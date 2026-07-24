## 2026-07-22T07:11:32Z
You are Worker M5 for GGBingo CRM.
Your working directory is: c:\GGBG CRM\.agents\teamwork_preview_worker_m5
Identity: teamwork_preview_worker

Your task is to fix the build/typecheck error and perform Milestone 5 final E2E verification:
1. Fix type export issue in `src/types/index.ts`:
   Add `export type KpiAssigneeType = 'Company' | 'Department' | 'Team' | 'Individual';` (or ensure `KpiAssigneeType` is exported from `src/types/index.ts`).
2. Run `cmd /c npm run build` to ensure 100% clean compilation across all 18 routes (18/18 static pages compiled with zero TS or lint errors).
3. Verify fixed port 3000 server response (< 500ms response time).
4. Verify all 8 modules are fully functional:
   - Auth, Session (`ggbg_crm_session`), RBAC/RLS & User Management
   - Customer 360° (Detail, Single Create, Excel Bulk Import, CSV/Excel Template Download, Safe Phone Hide/Show)
   - Lead & Phễu Kanban (2 Funnels: Vận hành TMĐT & GGBingoVN Platform, Manual & Auto distribution)
   - HRM Nhân sự (Employee profiles, Cloudflare R2 PDF contract preview modal, Org chart)
   - Sản phẩm Dịch vụ (Dynamic JSONB packages for Shopee/TikTok/Lazada/Amazon)
   - KPIs (Multi-level targets, auto % progress calculation)
   - Chấm điểm hiệu suất S/A/B/C/D (Hybrid formula, S/A/B/C/D auto rating scorecards, batch execution)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to `c:\GGBG CRM\.agents\teamwork_preview_worker_m5\handoff.md` and notify orchestrator when done.
