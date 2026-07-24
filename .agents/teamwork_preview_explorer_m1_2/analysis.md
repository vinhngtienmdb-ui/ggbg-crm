# Analysis Report: Authentication, HTTP-Only Cookie Session & RBAC/RLS Systems

**Target Workspace**: `c:\GGBG CRM`  
**Explorer Agent**: Explorer 2 (Milestone 1)  
**Date**: 2026-07-22  

---

## 1. Executive Summary

An in-depth code audit of the Authentication, HTTP-Only Cookie Session Management, Middleware, and User Access Management / RBAC components of GGBingo CRM was conducted. While the basic foundation for HTTP-Only cookie authentication and UI shell navigation exists, multiple critical architectural disconnections, security risks, hydration edge cases, and missing persistence layers were identified.

Key findings include hardcoded plaintext credentials in memory disconnected from Supabase DB schema, locked user accounts able to bypass status checks, missing cryptographic signatures/encryption on HTTP-Only cookies, lack of PostgreSQL Row Level Security (RLS) policies in SQL migrations, and state/SSR hydration mismatches in AuthContext.

---

## 2. Component-by-Component Investigation

### 2.1 API Auth Routes (`/src/app/api/auth/*`)

#### 1. Login Route (`/src/app/api/auth/login/route.ts`)
* **Mechanism**: Accepts POST `{ username, password }`. Matches against an in-memory hardcoded `USER_ACCOUNTS_DB` array (containing `admin`, `hoang.tv`, `mai.lt`, `anh.dk`).
* **Session Cookie Creation**: Sets `ggbg_crm_session` cookie containing unencrypted JSON string representation of session user data.
* **Flaws Identified**:
  * **Plaintext Passwords**: `USER_ACCOUNTS_DB` stores passwords in raw string form (`password: 'GGBG@2026#'`) and performs direct string comparison (`u.password === password`).
  * **Database Disconnection**: Ignores Supabase database (`public.user_accounts`, `public.profiles`, `public.roles`). Changes made in DB or user management settings page do not affect authentication.
  * **No Account Status Check**: Does not verify if `account_status === 'Active'`. Accounts flagged as `Locked` (e.g. `anh.dk` in UI) can still log in successfully.

#### 2. Logout Route (`/src/app/api/auth/logout/route.ts`)
* **Mechanism**: Accepts POST request, calls `cookieStore.delete('ggbg_crm_session')`.
* **Flaws Identified**:
  * Calls `.delete('ggbg_crm_session')` without explicit path configuration (`path: '/'`), which can leave cookies intact on specific path sub-scopes in certain browser/Next.js runtime versions.

#### 3. Current User Route (`/src/app/api/auth/me/route.ts`)
* **Mechanism**: GET request retrieves `ggbg_crm_session` cookie, parses `JSON.parse(sessionCookie.value)`, returns `{ authenticated: true, user: userData }` or 401.
* **Flaws Identified**:
  * Does not validate session expiration or check user status against database. If a user is deactivated or deleted, their session cookie remains valid for 7 days.

---

### 2.2 Middleware (`/src/middleware.ts`)

* **Mechanism**: Intercepts requests. Bypasses `/_next`, `/api`, static assets.
* **Protection Logic**: Checks `request.cookies.get('ggbg_crm_session')`.
  * On `/login`: If cookie present, redirects to `/`.
  * On Protected routes: If cookie missing, redirects to `/login`.
* **Flaws Identified**:
  * **Unvalidated Cookie Content**: Checks existence of `sessionCookie.value` only. A client with any arbitrary non-empty cookie value will pass middleware protection.
  * **Redundant Checks**: Path check `if (pathname.startsWith('/_next') || pathname.startsWith('/api') || ...)` overlaps with Next.js matcher configuration `matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']`.

---

### 2.3 Client Auth Context (`/src/context/AuthContext.tsx`)

* **Mechanism**: React Context `AuthProvider` maintaining `user` state and `isLoading` flag. On mount (`useEffect`), calls `/api/auth/me`.
* **Flaws Identified**:
  * **Hydration Flash / SSR Fallback**: `isLoading` starts as `true`. Before `/api/auth/me` returns, UI components reading `useAuth()` (e.g. `Header.tsx`) render fallback default values ("Quản trị viên", avatar "US"), creating a visible layout flash when user data populates.
  * **Missing Unauthorized Interceptor**: Does not automatically redirect client when API requests return 401 during active session.

---

### 2.4 Super Admin Handling & Security

* **Credentials**: `admin` / `GGBG@2026#`.
* **Findings**:
  * Seeded in `supabase/migrations/20260722_initial_schema.sql` with bcrypt hash (`crypt('GGBG@2026#', gen_salt('bf'))`).
  * Hardcoded in `/src/app/api/auth/login/route.ts` as plaintext.
  * Hardcoded and displayed openly in `/src/app/settings/users/page.tsx` UI banner (`Username: admin • Mật khẩu: GGBG@2026#`).

---

### 2.5 User Access Management & RBAC/RLS (`/src/app/settings/users`, `/src/app/settings/rbac`)

* **User Management (`/src/app/settings/users/page.tsx`)**:
  * Uses local `mockUserAccounts` array state.
  * Modal "Cấp Tài Khoản Mới Từ HRM" appends a temporary object to local React state. No API call is made, no database row is inserted, and `/api/auth/login` is unaware of newly created users.
* **RBAC & Data Scopes (`/src/app/settings/rbac/page.tsx`)**:
  * Presentational UI showcasing 4 data scopes (SCOPE 1: Own Data, SCOPE 2: Team, SCOPE 3: Dept, SCOPE 4: All).
  * **Missing Database RLS Policies**: `supabase/migrations/20260722_initial_schema.sql` creates tables (`user_accounts`, `roles`, `permissions`, `role_permissions`, `audit_logs`), BUT lacks `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` statements and `CREATE POLICY` queries to enforce actual RLS in PostgreSQL.

---

## 3. Summary of Bugs & Deficiencies

| ID | Component | Issue Category | Description | Severity |
|----|-----------|----------------|-------------|----------|
| **BUG-01** | `/api/auth/login` | Security & DB | Hardcoded plaintext passwords in memory; disconnected from Supabase DB | **CRITICAL** |
| **BUG-02** | `/api/auth/login` | Access Control | Fails to check `account_status` (Locked accounts like `anh.dk` can still log in) | **HIGH** |
| **BUG-03** | `ggbg_crm_session` | Security | Unsigned, unencrypted JSON stored directly in cookie value | **HIGH** |
| **BUG-04** | `/settings/users` | Functionality | User creation & account status toggling only mutate client state; no backend persistence | **HIGH** |
| **BUG-05** | Supabase Migration | Security & DB | DB schema lacks PostgreSQL RLS policies (`ENABLE ROW LEVEL SECURITY`) | **HIGH** |
| **BUG-06** | `AuthContext` | UX / Hydration | Initial SSR render causes fallback flash ("Quản trị viên" / "US") before session fetch completes | **MEDIUM** |
| **BUG-07** | `/api/auth/logout` | Session | `cookieStore.delete` lacks explicit `path: '/'` parameter | **LOW** |

---

## 4. Recommended Remediation Roadmap (Milestone 2 Implementation)

1. **Database-Driven Auth Integration**:
   - Replace in-memory `USER_ACCOUNTS_DB` in `/src/app/api/auth/login/route.ts` with Supabase `user_accounts` and `profiles` table queries.
   - Use proper password hashing check (e.g. bcrypt/argon2 or Supabase Auth).
2. **Account Status Verification**:
   - Validate `account_status === 'Active'` during login and session check (`/api/auth/me`).
3. **Session Cookie Security**:
   - Sign or encrypt session cookie payload or use JWT token with secret key.
4. **User Management API Routes**:
   - Create POST/PATCH API endpoints for `/api/users` to handle creation and locking/unlocking of user accounts in Supabase DB.
5. **PostgreSQL RLS Implementation**:
   - Write SQL migration adding RLS policies for `customers`, `leads`, `voip_call_logs`, `kpi_assignments` based on `user_accounts.role` and `data_scope`.
6. **Hydration & UX Polish**:
   - Update `AuthContext` to handle loading state seamlessly and prevent fallback content flash on initial load.
