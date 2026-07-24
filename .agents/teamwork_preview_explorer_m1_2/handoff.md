# Handoff Report: Authentication & Access Control System Audit

**Agent ID**: Explorer 2 (Milestone 1)  
**Working Directory**: `c:\GGBG CRM\.agents\teamwork_preview_explorer_m1_2`  
**Target Path**: `c:\GGBG CRM\`  
**Date**: 2026-07-22  

---

## 1. Observation

Direct observations from source file analysis:

1. **`src/app/api/auth/login/route.ts`**:
   - Lines 5–46: In-memory `USER_ACCOUNTS_DB` array defines accounts (`admin`, `hoang.tv`, `mai.lt`, `anh.dk`) with plain text passwords (`password: 'GGBG@2026#'`).
   - Line 63: Verification checks `u.password === password` without cryptographic hashing.
   - Lines 86–95: Cookie `ggbg_crm_session` is written as unencrypted stringified JSON (`value: JSON.stringify(sessionData)`).
   - Lines 60–71: Does not query `account_status` field or block locked user accounts.

2. **`src/middleware.ts`**:
   - Line 5: `const sessionCookie = request.cookies.get('ggbg_crm_session')`.
   - Lines 19 & 27: Checks presence of `sessionCookie.value` only; does not validate cookie signature or payload integrity.

3. **`src/context/AuthContext.tsx`**:
   - Line 29: `const [isLoading, setIsLoading] = useState(true)`.
   - Lines 33–51: Client component fetches `/api/auth/me` asynchronously on mount. `Header.tsx` defaults to "Quản trị viên" and "US" until `user` state updates, causing layout re-renders.

4. **`src/app/settings/users/page.tsx` & `src/app/settings/rbac/page.tsx`**:
   - User creation modal (lines 98–119) and account status toggle (lines 88–96) only modify local React `useState`. No database API endpoints exist to persist user changes.

5. **`supabase/migrations/20260722_initial_schema.sql`**:
   - Tables `user_accounts`, `roles`, `permissions`, `role_permissions`, `audit_logs` exist.
   - Zero `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` or `CREATE POLICY` statements exist in the file.

---

## 2. Logic Chain

1. **Observation**: `/src/app/api/auth/login/route.ts` relies on in-memory `USER_ACCOUNTS_DB` and plaintext password strings.
   * **Reasoning**: Authentication bypasses Supabase DB (`public.user_accounts`). Any user accounts created or modified via UI or DB are completely ignored by the auth engine.
   * **Deduction**: System authentication is static and disconnected from backend database infrastructure.

2. **Observation**: Account status field (`Active` vs `Locked`) is present in `USER_ACCOUNTS_DB` / `mockUserAccounts`, but `/api/auth/login` does not evaluate it.
   * **Reasoning**: A locked user account (such as `anh.dk` marked as `Locked`) can still post credentials to `/api/auth/login` and receive a valid HTTP-Only session cookie.
   * **Deduction**: Account locking/suspension functionality is broken at the authentication layer.

3. **Observation**: Cookie `ggbg_crm_session` contains raw JSON string without JWT signature or secret-based HMAC/encryption.
   * **Reasoning**: Middleware only checks `sessionCookie.value` presence. Anyone crafting a non-empty cookie can bypass route protection.
   * **Deduction**: Session validation lacks cryptographic protection.

4. **Observation**: `supabase/migrations/20260722_initial_schema.sql` defines schema tables but omits PostgreSQL RLS directives.
   * **Reasoning**: Database queries with anon/service keys bypass row-level filtering based on user roles and scopes (SCOPE 1 to 4).
   * **Deduction**: RBAC/RLS data boundary isolation is currently UI-only.

---

## 3. Caveats

- **Runtime Performance**: Server execution performance of `/api/auth/login` was not benchmarked against active DB latency since Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`) currently use placeholder values (`https://placeholder.supabase.co`).
- **External Auth Integrations**: OAuth / SSO mechanisms were not in the scope of Milestone 1 specifications.

---

## 4. Conclusion

The current Auth & RBAC system in GGBingo CRM provides a functional UI prototype with basic HTTP-Only cookie routing protection in Middleware, but has critical backend disconnections:
- In-memory static auth instead of DB lookup.
- Unsigned cookie sessions.
- Inactive RLS database policies.
- Non-persistent User Access Management actions.

Milestone 2 MUST prioritize connecting `/api/auth/login` to Supabase DB `user_accounts`, signing the `ggbg_crm_session` cookie, enforcing `account_status`, creating CRUD API routes for `/settings/users`, and writing PostgreSQL RLS policies in Supabase migrations.

---

## 5. Verification Method

To verify findings independently:
1. **Plaintext & Disconnection**: Inspect `src/app/api/auth/login/route.ts` lines 5–46 and 63 to confirm `USER_ACCOUNTS_DB` static array and raw string matching.
2. **Locked Account Bypass**: Attempt login with username `anh.dk` and password `GGBG@2026#`. Observe successful 200 response with set-cookie despite `anh.dk` being `Locked` in `settings/users/page.tsx`.
3. **Cookie Signing**: Check `src/app/api/auth/login/route.ts` lines 86–95 to confirm `JSON.stringify(sessionData)` without HMAC or JWT signature.
4. **Missing RLS**: Run search for `ROW LEVEL SECURITY` or `CREATE POLICY` in `supabase/migrations/20260722_initial_schema.sql` (0 matches).
