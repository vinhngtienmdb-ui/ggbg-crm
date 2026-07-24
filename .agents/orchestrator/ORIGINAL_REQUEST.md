# Original User Request

## 2026-07-22T02:40:48Z

Kiểm tra toàn diện, rà soát sửa lỗi và tối ưu hóa độ ổn định cho toàn bộ 8 phân hệ phần mềm GGBingo CRM:
1. Quản lý khách hàng 360°
2. Lead & Phễu Kanban
3. HRM Nhân sự
4. Sản phẩm Dịch vụ
5. KPIs
6. Chấm điểm hiệu suất S/A/B/C/D
7. User Access Management & Phân quyền RBAC/RLS
8. System Auth & HTTP-Only Cookie session ggbg_crm_session

Requirements:
- R1. Fix all Runtime / Build errors across Next.js 15 App Router, React Components, API Routes (/api/auth/*), AuthContext, and Middleware. Ensure no crashes, missing modules, unhandled errors, or React Client/Server Hydration mismatches. `npm run build` must complete 100% without TypeScript or Lint errors (✓ Generating static pages (16/16)).
- R2. Ensure stability & real interactivity across all 8 modules:
  * Customer 360, Single creation, Excel bulk import, Download CSV/Excel template, Phone number safe hide/show.
  * Lead Kanban: 2 funnels (Vận hành TMĐT & GGBingoVN Platform), manual & auto lead distribution.
  * HRM: Employee profiles, PDF Cloudflare R2 contract, Org chart.
  * Product & Services: Dynamic JSONB attribute config for Shopee/TikTok/Lazada/Amazon packages.
  * KPIs & Performance: Multi-level targets, auto % calculation, S/A/B/C/D performance scorecards.
  * User Management & Auth: Super Admin authentication (admin / GGBG@2026#), permissions assignment, lock/unlock accounts, HTTP-Only Cookie session `ggbg_crm_session`.
- R3. Visual verification & fixed port 3000: ensure application runs smoothly at http://localhost:3000 with quick response (< 500ms).
