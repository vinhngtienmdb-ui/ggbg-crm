# Empirical Challenge Report: Milestone 2 — System Auth, HTTP-Only Cookie Session, RBAC/RLS

**Agent ID**: Challenger 2 (Milestone 2)  
**Working Directory**: `c:\GGBG CRM\.agents\teamwork_preview_challenger_m2_2`  
**Target Path**: `c:\GGBG CRM\`  
**Date**: 2026-07-22  
**Verdict**: **FAIL** (Action Required: Session Invalidation, API Authorization, and Account Shadowing Fixes Required)

---

## 1. Observation

Direct empirical observations from line-by-line inspection, state-machine tracing, API payload analysis, and schema verification of Milestone 2 components:

### A. Authentication & Session Operations (Passed Verification)
1. **`/src/app/api/auth/login/route.ts` (Lines 28–41, 59–69)**:
   - Account status validation checks `(user.account_status).toUpperCase()`. If `'LOCKED'`, `'INACTIVE'`, or `'SUSPENDED'`, it returns HTTP **403 Forbidden** with message: `"Tài khoản của bạn đã bị khóa hoặc ngưng hoạt động. Vui lòng liên hệ Quản trị viên!"`.
   - Sets HTTP-Only cookie `ggbg_crm_session` with `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, `maxAge: 86400` (24h).
2. **`/src/app/api/auth/logout/route.ts` (Lines 9–18)**:
   - Sets `ggbg_crm_session` with `maxAge: 0` and `expires: new Date(0)`, followed by `cookieStore.delete('ggbg_crm_session')`.
3. **`/src/app/api/auth/me/route.ts` (Lines 16–23)**:
   - Validates session cookie and queries `userStore` for live `account_status`. If `LOCKED`, returns HTTP **401 Unauthorized**.

---

### B. Confirmed Security & Session Invalidation Vulnerabilities (Failed Verification)

1. **Vulnerability 1 (Critical): Session Invalidation & Un-redirected Orphaned UI State (`AuthContext.tsx` & `middleware.ts`)**:
   - **`/src/middleware.ts` (Lines 19–28, 50–52)**: Middleware only checks if `sessionCookie.value` exists and contains `username` and `role`. It does NOT query `userStore` or check live account status.
   - **`/src/context/AuthContext.tsx` (Lines 39–57)**: When `fetchSession()` calls `GET /api/auth/me` for a user whose account was just locked, `/api/auth/me` returns HTTP **401 Unauthorized**. `AuthContext` catches this and executes `setUser(null)`.
   - **Observed Behavior**: `AuthContext` does **NOT** call `router.push('/login')` or invoke `/api/auth/logout` to clear the browser cookie when `/api/auth/me` returns 401. Because the HTTP-Only cookie remains in the browser, `middleware.ts` continues to permit navigation to protected routes (`/customers`, `/leads`, `/hrm`, `/settings/*`), rendering the app in a broken state (`user = null`) with hardcoded default header fallback values ("US", "Quản trị viên").

2. **Vulnerability 2 (High): Account Shadowing / Hijacking via `POST /api/users` (`src/lib/userStore.ts`)**:
   - **`/src/lib/userStore.ts` (Lines 142–145, 168–185)**:
     ```ts
     export function findUserByUsernameOrEmail(input: string) {
       const clean = input.trim().toLowerCase();
       return userAccounts.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean);
     }
     export function createUserAccount(...) {
       ...
       userAccounts = [created, ...userAccounts];
     }
     ```
   - **Observed Behavior**: `createUserAccount` does NOT check if `username` or `email` already exists. It un-shifts (`[created, ...userAccounts]`) the new user to index `0`.
   - An attacker or user issuing `POST /api/users` with `{ "username": "admin", "password": "hacked123" }` creates a duplicate account at index `0`. `findUserByUsernameOrEmail("admin")` returns the new index 0 account, shadowing/hijacking the real Super Admin `u0`.

3. **Vulnerability 3 (High): Unauthenticated Access to Administrative APIs (`/api/users` & `/api/rbac`)**:
   - **`/src/app/api/users/route.ts` (Lines 4, 13, 44)** & **`/src/app/api/rbac/route.ts` (Lines 4, 14)**:
   - Neither `/api/users` (GET, POST, PATCH) nor `/api/rbac` (GET, PUT) check request cookies (`ggbg_crm_session`) or verify user roles.
   - Any unauthenticated client can dump all user accounts, lock/unlock accounts, modify RBAC matrices, and inspect security audit logs containing user activity and IP addresses.

4. **Vulnerability 4 (Medium): Missing Server-Side Protection for `SUPER_ADMIN` Permissions (`/api/rbac` PUT)**:
   - **`/src/app/api/rbac/route.ts` (Lines 14–35)** & **`/src/lib/userStore.ts` (Lines 191–205)**:
   - While `src/app/settings/rbac/page.tsx` disables the toggle UI for `SUPER_ADMIN`, `PUT /api/rbac` accepts `{ role: "SUPER_ADMIN", module: "System", action: "All Privileges", updates: { enabled: false } }` and disables Super Admin privileges without server-side validation.

---

### C. Database RLS Migration & Schema Inspection (`supabase/migrations/20260722_initial_schema.sql`)

1. **Table Coverage (Passed)**:
   - All 19 tables (`departments`, `teams`, `positions`, `profiles`, `user_accounts`, `roles`, `user_roles`, `permissions`, `role_permissions`, `audit_logs`, `customers`, `lead_sources`, `pipelines`, `pipeline_stages`, `leads`, `voip_call_logs`, `products`, `kpi_assignments`, `performance_scorecards`) have explicit `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;` directives (Lines 271–289).
2. **SECURITY DEFINER Best Practice (Low Risk Finding)**:
   - Function `public.is_super_admin()` (Lines 292–302) lacks `SET search_path = public`, which violates PostgreSQL secure function guidelines.

---

## 2. Logic Chain

1. **Observation**: `/api/auth/me` returns 401 when account status is `'Locked'`, but `AuthContext.tsx` does not redirect to `/login` or trigger `/api/auth/logout`.
   - **Reasoning**: Next.js `middleware.ts` validates requests using static cookie parsing (`sessionCookie.value`). Because the cookie persists in the browser after a 401 from `/api/auth/me`, `middleware.ts` allows the browser to visit protected pages. `AuthContext` sets `user = null`, causing UI component rendering anomalies.
   - **Fix Required**: In `AuthContext.tsx`, if `/api/auth/me` returns 401 or `authenticated: false` while on a protected route, trigger `logout()` or `router.push('/login')`.

2. **Observation**: `createUserAccount` in `userStore.ts` prepends new user accounts without checking existing usernames.
   - **Reasoning**: JavaScript `Array.prototype.find` returns the first matching element. Prepending duplicate usernames ensures the new record shadows the old one.
   - **Fix Required**: Add uniqueness validation for `username` and `email` in `createUserAccount` / `POST /api/users`.

3. **Observation**: `/api/users` and `/api/rbac` endpoints lack authentication middleware / session checks.
   - **Reasoning**: Standard Next.js API routes require explicit cookie validation (`cookies()`) and role verification before processing administrative actions.
   - **Fix Required**: Add session check and `is_super_admin` validation helper to `/api/users` and `/api/rbac` route handlers.

4. **Observation**: `updateRolePermission` in `userStore.ts` permits updating `SUPER_ADMIN` entries.
   - **Reasoning**: Client-side UI disables controls, but server-side route handlers must enforce invariant checks independently of UI state.
   - **Fix Required**: Reject `PUT /api/rbac` calls where `role === 'SUPER_ADMIN'`.

---

## 3. Caveats

- **Runtime In-Memory State**: Runtime user and RBAC state is maintained in `src/lib/userStore.ts`. Database schema in `supabase/migrations/20260722_initial_schema.sql` provides PostgreSQL RLS definitions for production deployment.
- **Node execution timeout**: Shell commands timed out waiting for user approval; all findings were derived from comprehensive static analysis, logical execution tracing, and constraint verification.

---

## 4. Conclusion

Milestone 2 (System Auth, HTTP-Only Cookie Session, RBAC/RLS Core) is **NOT READY for approval** (Verdict: **FAIL**).

While basic login/logout, status checking on login, HTTP-Only cookie setting, and 19-table database RLS enablement are correctly built, critical security bugs must be remediated:
1. **Fix Session Invalidation in `AuthContext.tsx`**: Force redirect to `/login` and purge session cookie when `/api/auth/me` returns HTTP 401.
2. **Fix Duplicate Username Shadowing in `userStore.ts`**: Reject `POST /api/users` if username or email already exists.
3. **Secure Administrative API Routes (`/api/users` & `/api/rbac`)**: Require valid Super Admin session cookie before fulfilling GET/POST/PATCH/PUT requests.
4. **Protect `SUPER_ADMIN` Role Server-Side**: Prevent modification of Super Admin permissions in `PUT /api/rbac`.

---

## 5. Verification Method

To verify these fixes after remediation:

1. **Verify Session Invalidation on Lock**:
   - Log in as `hoang.tv` in browser.
   - In another session/Postman, call `PATCH /api/users` to lock `hoang.tv` (`id: 'u1'`).
   - Refresh `/customers` as `hoang.tv`.
   - *Expected*: `/api/auth/me` returns 401, `AuthContext` redirects to `/login`, and `ggbg_crm_session` cookie is cleared.

2. **Verify Account Shadowing Prevention**:
   - Call `POST /api/users` with `{ "username": "admin", "password": "123" }`.
   - *Expected*: Returns HTTP 400/409 with error `"Tên đăng nhập đã tồn tại!"`.

3. **Verify API Authorization Guards**:
   - Send `GET /api/users` or `PUT /api/rbac` without session cookie.
   - *Expected*: Returns HTTP 401 Unauthorized.

4. **Verify Super Admin Protection on API**:
   - Send `PUT /api/rbac` with `{ "role": "SUPER_ADMIN", "module": "System", "action": "All Privileges", "updates": { "enabled": false } }`.
   - *Expected*: Returns HTTP 403 Forbidden with error `"Không thể thay đổi quyền Super Admin"`.
