## 2026-07-22T02:51:40Z
<USER_REQUEST>
You are the Forensic Auditor for Milestone 2 of GGBingo CRM.
Your working directory is c:\GGBG CRM\.agents\teamwork_preview_auditor_m2. Create your BRIEFING.md and progress.md there.
Read c:\GGBG CRM\PROJECT.md and c:\GGBG CRM\.agents\teamwork_preview_worker_m2\handoff.md.

Your Task:
1. Perform thorough integrity audit of all code added or modified in Milestone 2:
   - /src/app/api/auth/*
   - /src/middleware.ts
   - /src/context/AuthContext.tsx
   - /src/app/settings/users/page.tsx & /src/app/settings/rbac/page.tsx
   - /src/app/api/users/* & /src/app/api/rbac/*
   - supabase/migrations/20260722_initial_schema.sql
2. Check specifically for:
   - Hardcoded test mocks or false test passes
   - Facade implementations
   - Circumvention of auth logic
   - Unhandled security bypasses
3. Deliver an audit report at c:\GGBG CRM\.agents\teamwork_preview_auditor_m2\handoff.md with an explicit audit verdict: CLEAN or INTEGRITY VIOLATION.
</USER_REQUEST>
