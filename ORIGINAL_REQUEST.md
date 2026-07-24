# Original User Request

## Initial Request — 2026-07-22T02:40:16Z

Kiểm tra toàn diện, rà soát sửa lỗi và tối ưu hóa độ ổn định cho toàn bộ 8 phân hệ phần mềm GGBingo CRM (Quản lý khách hàng 360°, Lead & Phễu Kanban, HRM Nhân sự, Sản phẩm Dịch vụ, KPIs, Chấm điểm hiệu suất S/A/B/C/D, User Access Management & Phân quyền RBAC/RLS).

Working directory: c:\GGBG CRM
Integrity mode: development

## Requirements

### R1. Kiểm Tra & Khắc Phục Lỗi Runtime / Build Toàn Hệ Thống
- Rà soát toàn bộ source code Next.js 15 App Router, React Components, API Routes (/api/auth/*), AuthContext và Middleware.
- Đảm bảo 100% không còn lỗi crash, missing module, unhandled error hoặc React Client/Server Hydration mismatch.

### R2. Đảm Bảo Tính Ổn Định & Tương Tác Thật Của Toàn Bộ 8 Phân Hệ
- Quản lý Khách hàng: Xem chi tiết 360°, Thêm mới đơn lẻ, Nhập nhiều từ file Excel (Bulk Import), Tải file mẫu CSV/Excel, Ẩn/Hiện SĐT an toàn.
- Lead & Phễu Kanban: Chuyển đổi linh hoạt giữa 2 Phễu (Vận hành TMĐT & GGBingoVN Platform), tạo Lead thủ công & tự động phân bổ.
- HRM Nhân sự: Hồ sơ nhân viên, Hợp đồng lao động PDF Cloudflare R2, Sơ đồ tổ chức.
- Sản phẩm & Dịch vụ: Cấu hình thuộc tính động JSONB gói dịch vụ Shopee/TikTok/Lazada/Amazon.
- KPIs & Chấm điểm hiệu suất: Giao chỉ tiêu đa cấp, tự động tính tiến độ %, bảng điểm hiệu suất xếp loại S/A/B/C/D.
- User Management & System Auth: Xác thực tài khoản Super Admin (admin / GGBG@2026#), gán quyền, khóa/mở tài khoản, HTTP-Only Cookie session ggbg_crm_session.

### R3. Kiểm Trực Quan & Cố Định Cổng 3000
- Đảm bảo ứng dụng chạy mượt mà trên cổng cố định http://localhost:3000 với thời gian phản hồi nhanh (< 500ms).

## Acceptance Criteria

### Verification Checklist
- Lệnh npm run build hoàn thành 100% không có lỗi TypeScript hay Linting (✓ Generating static pages (16/16)).
- Mọi API Route /api/auth/login, /api/auth/logout, /api/auth/me xử lý mượt mà.
- Toàn bộ các trang /, /customers, /leads, /hrm, /products, /kpis, /performance, /settings/users, /settings/rbac, /login hoạt động hoàn hảo.
