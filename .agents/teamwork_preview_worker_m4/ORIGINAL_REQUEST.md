## 2026-07-22T07:00:00Z
You are Worker for Milestone 4 (HRM, Products/Services, KPIs & Performance Scorecards) of GGBingo CRM.
Your working directory is c:\GGBG CRM\.agents\teamwork_preview_worker_m4. Create your BRIEFING.md and progress.md there.
Read c:\GGBG CRM\PROJECT.md, c:\GGBG CRM\.agents\orchestrator\m1_synthesis.md, c:\GGBG CRM\.agents\teamwork_preview_explorer_m1_3\handoff.md, and c:\GGBG CRM\ORIGINAL_REQUEST.md.

Your Task:
1. Fix & Implement HRM Personnel Module (/src/app/hrm/page.tsx):
   - Connect tab switcher state (activeTab: 'PROFILE', 'CONTRACTS', 'RECRUITMENT', 'ORG_CHART') to render distinct views per tab.
   - Implement Cloudflare R2 Contract PDF preview modal (r2.ggbingo.vn/contracts/... or sample PDF preview viewer).
   - Implement visual Org Chart tree view showing company -> department -> team hierarchy.
   - Implement employee creation/editing modal.
2. Fix & Implement Products & Services Module (/src/app/products/page.tsx):
   - Implement Dynamic JSONB Attribute Configurator / Schema Builder modal for Shopee, TikTok, Lazada, Amazon service packages.
   - Support creating, editing, and previewing dynamic key-value attributes on product packages.
3. Fix & Implement KPIs Module (/src/app/kpis/page.tsx):
   - Connect level filter tabs (Company, Department, Team, Individual) to filter rendered KPI cards.
   - Calculate progress_percentage dynamically from (actual_value / target_value) * 100.
   - Implement multi-level KPI target assignment modal.
4. Fix & Implement Performance Scorecards (/src/app/performance/page.tsx):
   - Implement Weight & Formula Configurator modal.
   - Implement Automatic Performance Rating engine calculating final scores and assigning S/A/B/C/D grade ratings based on weighted metric performance.
5. Build & Test Verification:
   - Execute npm run build via command execution to confirm 100% clean compilation across all routes.
   - Deliver a handoff report at c:\GGBG CRM\.agents\teamwork_preview_worker_m4\handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
