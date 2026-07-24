# Execution Plan: GGBingo CRM Full Audit, Stabilization & Optimization

## Objectives
1. Fix all Runtime / Build errors across Next.js 15 App Router, React Components, API Routes (/api/auth/*), AuthContext, and Middleware.
   `npm run build` must complete 100% without TypeScript or Lint errors (✓ Generating static pages (16/16)).
2. Ensure full functionality across all 8 modules:
   - Quản lý khách hàng 360° (Detail, Single Create, Excel Import, Template Download, Safe Phone Hide/Show)
   - Lead & Phễu Kanban (2 Funnels: Vận hành TMĐT & GGBingoVN Platform, Manual & Auto distribution)
   - HRM Nhân sự (Employee profiles, Cloudflare R2 PDF contract, Org chart)
   - Sản phẩm Dịch vụ (Dynamic JSONB config for Shopee/TikTok/Lazada/Amazon packages)
   - KPIs & Performance Scorecards (Multi-level targets, auto % progress, S/A/B/C/D ratings)
   - User Management & Phân quyền RBAC/RLS (Super Admin auth `admin` / `GGBG@2026#`, permission matrix, account lock/unlock)
   - System Auth & HTTP-Only Cookie session `ggbg_crm_session`
3. Visual & Port Verification: Ensure smooth execution on fixed port http://localhost:3000 (< 500ms response time).

## Milestone Decomposition

| Milestone | Name | Description | Key Deliverables |
|-----------|------|-------------|------------------|
| M1 | Diagnosis & Static Analysis | Discover codebase structure, run initial build attempt via worker, log all TS/Lint/Runtime errors. | Initial error log & audit plan |
| M2 | Auth, Session & RBAC Core | Fix `/api/auth/*`, AuthContext, Middleware, HTTP-Only Cookie `ggbg_crm_session`, RBAC/RLS, Super Admin login. | Operational auth flow & session handling |
| M3 | Customer 360 & Lead Kanban | Fix Customer 360 view/create/import/export/phone mask and 2-funnel Lead Kanban with auto/manual lead distribution. | Customer & Lead module stability |
| M4 | HRM, Products, KPIs & Performance | Fix HRM PDF contract & Org Chart, Dynamic JSONB Products, Multi-level KPIs, S/A/B/C/D Scorecards. | HRM, Product, KPI & Performance stability |
| M5 | E2E Testing, Build & Port 3000 Verification | Run full `npm run build`, verify 16 static pages, test port 3000 server response, perform forensic audit. | Final 100% build pass & verification report |
