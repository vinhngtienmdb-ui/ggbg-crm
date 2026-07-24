## 2026-07-22T09:45:35Z
<USER_REQUEST>
You are Worker for Milestone 2 (System Auth, HTTP-Only Cookie Session, RBAC/RLS Core) of GGBingo CRM.
Your working directory is c:\GGBG CRM\.agents\teamwork_preview_worker_m2. Create your BRIEFING.md and progress.md there.
Read c:\GGBG CRM\PROJECT.md, c:\GGBG CRM\.agents\orchestrator\m1_synthesis.md, c:\GGBG CRM\.agents\teamwork_preview_explorer_m1_2\handoff.md, and c:\GGBG CRM\ORIGINAL_REQUEST.md.

Your Task:
1. Fix /src/app/api/auth/login/route.ts:
   - Support Super Admin authentication (admin / GGBG@2026#) and account status validation (account_status === 'ACTIVE'). Reject locked/inactive accounts (account_status === 'LOCKED' or 'INACTIVE') with 403 Forbidden response.
   - Set HTTP-Only Cookie ggbg_crm_session with httpOnly: true, sameSite: 'lax', path: '/', maxAge: 86400.
2. Fix /src/app/api/auth/logout/route.ts:
   - Properly delete ggbg_crm_session cookie (maxAge: 0, expires: new Date(0)).
3. Fix /src/app/api/auth/me/route.ts:
   - Parse ggbg_crm_session cookie, return authenticated user details, roles, permissions, and active status. Return 401 if unauthenticated/invalid.
4. Fix /src/middleware.ts:
   - Validate ggbg_crm_session cookie for protected routes (/customers, /leads, /hrm, /products, /kpis, /performance, /settings/*). Redirect unauthenticated users to /login. Redirect authenticated users hitting /login to /.
5. Fix /src/context/AuthContext.tsx:
   - Ensure initial loading state prevents UI flash/flicker and component hydration mismatches.
6. Fix /src/app/settings/users/page.tsx and /src/app/settings/rbac/page.tsx:
   - Enable user creation, account lock/unlock action (e.g. locking/unlocking accounts), permission assignment, and RBAC matrix updates.
7. Update supabase/migrations/20260722_initial_schema.sql:
   - Add ALTER TABLE ... ENABLE ROW LEVEL SECURITY; for relevant tables and appropriate RLS policies.
8. Test & Verify:
   - Run npm run build via command execution to confirm 100% clean compilation.
   - Deliver a handoff report at c:\GGBG CRM\.agents\teamwork_preview_worker_m2\handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
</USER_REQUEST>
