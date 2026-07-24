## 2026-07-22T03:06:02Z

You are Worker for Milestone 3 (Customer 360 & Lead Kanban Modules) of GGBingo CRM.
Your working directory is c:\GGBG CRM\.agents\teamwork_preview_worker_m3. Create your BRIEFING.md and progress.md there.
Read c:\GGBG CRM\PROJECT.md, c:\GGBG CRM\.agents\orchestrator\m1_synthesis.md, c:\GGBG CRM\.agents\teamwork_preview_explorer_m1_3\handoff.md, and c:\GGBG CRM\ORIGINAL_REQUEST.md.

Your Task:
1. Fix & Implement Customer 360° Module (/src/app/customers/page.tsx):
   - "Xem chi tiết" 360° detail drawer/modal: Bind click handler to open comprehensive 360° customer profile modal showing customer profile, history, transactions, lead association, and activity log.
   - Single creation modal: Validate inputs (name, phone, email, channel, source) and add new customer to data store.
   - Excel / CSV bulk import: Ensure CSV/Excel file parsing works cleanly, creating customer records and reporting count imported.
   - Download CSV/Excel template button: Provide working download trigger for sample import template (CSV formatted data).
   - Phone safe hide/show toggle: Ensure safe phone masking toggle operates seamlessly for all customer rows.
2. Fix & Implement Lead & Phễu Kanban Board (/src/app/leads/page.tsx):
   - 2-Funnel Pipeline Switcher: Connect activePipeline state (Vận hành TMĐT - AGENCY vs GGBingoVN Platform - PLATFORM) to render dynamic stages and column cards for the active funnel.
   - Manual Lead Creation: Add functional modal ("Tạo Lead Thủ Công") allowing user to input Lead name, phone, email, source, target funnel, and assign rep.
   - Auto Lead Distribution Engine: Add auto-distribution button/algorithm distributing unassigned leads across active sales reps (round-robin / quota balance).
   - Card Stage Movement / Drag-and-Drop: Enable moving cards between Kanban columns/stages with updated stage state.
   - VOIP Quick Call Action: Add call action trigger logging to call logs/history.
3. Test & Build Verification:
   - Execute npm run build via command execution to verify 100% clean compilation.
   - Deliver a handoff report at c:\GGBG CRM\.agents\teamwork_preview_worker_m3\handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
