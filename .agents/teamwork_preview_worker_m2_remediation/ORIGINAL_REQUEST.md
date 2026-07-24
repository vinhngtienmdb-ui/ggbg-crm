## 2026-07-22T02:58:10Z

You are Worker for Milestone 2 Remediation (Security Hardening & RBAC Endpoint Protection) of GGBingo CRM.
Your working directory is c:\GGBG CRM\.agents\teamwork_preview_worker_m2_remediation. Create your BRIEFING.md and progress.md there.
Read c:\GGBG CRM\PROJECT.md and c:\GGBG CRM\.agents\teamwork_preview_challenger_m2_2\handoff.md.

Your Task:
Fix the 4 findings reported by Challenger 2:
1. Fix Session Invalidation on Account Lock (src/context/AuthContext.tsx & /src/app/api/auth/me/route.ts):
   - In AuthContext.tsx, when /api/auth/me returns 401 or user === null due to locked account status, explicitly call fetch('/api/auth/logout', { method: 'POST' }) to clear ggbg_crm_session cookie and redirect user to /login.
2. Prevent Account Shadowing (src/lib/userStore.ts):
   - In createUserAccount, validate that username and email are unique (case-insensitive check against existing userAccounts). If duplicate username or email is found, throw an Error / return 400 Bad Request ("Tên đăng nhập hoặc Email đã tồn tại").
3. Secure Administrative API Endpoints (/src/app/api/users/route.ts & /src/app/api/rbac/route.ts):
   - Parse ggbg_crm_session cookie in /api/users (GET, POST, PATCH) and /api/rbac (GET, PUT).
   - Reject unauthenticated requests with 401 Unauthorized.
   - Restrict mutation operations (POST/PATCH on /api/users and PUT on /api/rbac) to users with SUPER_ADMIN or ADMIN roles or manage_users permission. Return 403 Forbidden if user lacks required authorization.
4. Protect Super Admin Role Integrity (/src/app/api/rbac/route.ts):
   - In PUT /api/rbac, prevent modifying or revoking permissions for SUPER_ADMIN role (roleId === 'r0' || roleName === 'SUPER_ADMIN'). If client attempts to mutate SUPER_ADMIN permissions, preserve full permissions (['*']) or return 403 Forbidden.
5. Build & Test Verification:
   - Execute npm run build via command execution to verify 100% clean compilation.
   - Deliver a handoff report at c:\GGBG CRM\.agents\teamwork_preview_worker_m2_remediation\handoff.md.
