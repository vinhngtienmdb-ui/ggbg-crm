# 🚀 GGBingo CRM - Enterprise E-Commerce Platform & Omnichannel Sales Engine

Hệ thống **GGBingo CRM** là phần mềm quản trị doanh nghiệp toàn diện dành cho các mô hình kinh doanh **Ủy quyền Vận hành Gian hàng Thương mại Điện tử (Shopee, TikTok Shop, Lazada, Amazon)** và **Nền tảng Thương mại Điện tử GGBingoVN**.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Enterprise-emerald?style=for-the-badge)

---

## 🔑 Thông Tin Đăng Nhập Hệ Thống (Test Credentials)

| Cấp Độ Tài Khoản | Tên Đăng Nhập (Username) | Mật Khẩu (Password) | Vai Trò & Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `GGBG@2026#` | Toàn quyền quản trị hệ thống, RBAC & Cấu hình |

---

## ✨ 10 Phân Hệ Chức Năng Cốt Lõi

1. **📊 Tổng Quan Hệ Thống (Executive Dashboard):**
   - Theo dõi tổng doanh số ủy quyền vận hành, tổng số gian hàng active, số lượng Lead mới và phút gọi VoIP thời gian thực.
   - Thống kê tiến độ chỉ tiêu KPI toàn công ty với giao diện hiện đại, phẳng sắc nét.

2. **🏢 Quản Lý Khách Hàng 360° (`/customers`):**
   - Hồ sơ khách hàng B2B Doanh nghiệp & B2C Cá nhân / Hộ kinh doanh.
   - Tích hợp bảo mật tính năng gỡ Mask SĐT (`0988****999`), MST & CCCD.
   - Quản lý quy trình phê duyệt KYC chứng từ pháp lý, tài khoản ngân hàng và hạn mức công nợ.

3. **🎯 Quản Lý Lead & Phễu Bán Hàng 7 Bước (`/leads`):**
   - Phễu Kanban 7 bước chuyển đổi linh hoạt: *Lead Mới ➔ Khảo Sát Gian Hàng ➔ Báo Giá ➔ Đàm Phán Hợp Đồng ➔ Chốt Hợp Đồng ➔ Khởi Tạo Vận Hành ➔ Tái Chăm Sóc*.
   - Đẩy tự động Lead từ Webhook (Facebook Lead Ads, TikTok Gen, Google Forms, Zalo OA Form, GGBingoVN Platform) & Nhập hàng loạt file Excel/CSV chống trùng SĐT.

4. **💬 Live Chat CSKH Đa Kênh (`/chat`):**
   - Kết nối hợp nhất 3 kênh nhắn tin: **Zalo OA**, **Zalo Cá Nhân** và **Facebook Fanpage (Messenger)**.
   - Thư viện câu trả lời mẫu (*Quick Reply Macros*) 1-click chèn mẫu tư vấn Shopee Mall, TikTok TSP và quy trình HĐ.
   - Nút thao tác nhanh **`➕ Tạo Nhanh Khách Hàng CRM`** & **`🎯 Đẩy Lead Vào Phễu`** trực tiếp từ cửa sổ chat.

5. **👔 Quản Lý Nhân Sự HRM (`/hrm`):**
   - Quản lý hồ sơ nhân viên, quy trình phê duyệt tuyển dụng / onboard nhân sự mới qua các cấp Quản lý & Giám đốc Kinh doanh.
   - Quản lý Hợp đồng lao động, xem trực tuyến PDF hợp đồng lưu trữ trên Cloudflare R2 và Sơ đồ tổ chức cây phòng ban (`OrgChartTree`).
   - Quản lý chuyển trạng thái nhân sự chuyên nghiệp (*Đang làm việc, Chờ nghỉ việc, Nghỉ việc...*).

6. **📦 Sản Phẩm & Dịch Vụ Cấu Hình Động (`/products`):**
   - Quản lý danh mục gói dịch vụ vận hành Shopee, TikTok Shop, Lazada, Amazon và sàn GGBingoVN.
   - Bộ công cụ cấu hình thuộc tính động JSONB linh hoạt (`JsonbSchemaBuilderModal`).

7. **📈 Quản Lý KPIs Đa Cấp (`/kpis`):**
   - Giao chỉ tiêu doanh số GMV, số lượng Lead chốt, số phút gọi VoIP cho Phòng ban, Team và Cá nhân.
   - Tự động tính % tiến độ thực hiện chỉ tiêu theo tháng.

8. **🏆 Chấm Điểm Hiệu Suất Cá Nhân S/A/B/C/D (`/performance`):**
   - Đánh giá hiệu suất làm việc nhân sự từ ngày 1 - ngày 5 hàng tháng.
   - Công thức tính điểm tự động xếp loại **Hạng S (Xuất sắc)**, **Hạng A (Tốt)**, **Hạng B (Đạt)**, **Hạng C (Cần cố gắng)** và **Hạng D (Kém)**.

9. **👥 Đánh Giá 360° Năng Lực (`/reviews`):**
   - Mô hình đánh giá 360 độ: Tự đánh giá, Quản lý trực tiếp đánh giá và Đồng nghiệp đánh giá.
   - Tổng hợp sơ đồ nhện năng lực kỹ năng chuyên môn, thái độ và tinh thần đồng đội.

10. **🛡️ Phân Quyền Truy Cập (RBAC) & Cấu Hình Hệ Thống (`/settings`):**
    - Ma trận phân quyền 2 chiều: Granular Permissions (`leads:read`, `customers:edit`, `teams:manage`, `audit:read`...) & Data Scope Boundaries.
    - Cấu hình 5 tab hệ thống: Hạ tầng Cloud R2, Key API Sàn TMĐT & AI (Gemini/OpenAI), Email SMTP Server, Webhooks Telegram/Zalo và Security Audit Logs.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Core Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Handcrafted Enterprise Clean Design, Crisp 4px-8px Corners)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/) & Local Encrypted Session
- **Storage:** Cloudflare R2 Storage & Custom Object API

---

## ⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy Ứng Dụng (Installation & Running)

### 1. Tải Mã Nguồn Về Máy (Clone Repository)
```bash
git clone https://github.com/vinhngtienmdb-ui/ggbg-crm.git
cd ggbg-crm
```

### 2. Cài Đặt Gói Phụ Thuộc (Install Dependencies)
```bash
npm install
```

### 3. Khởi Chạy Môi Trường Phát Triển (Run Development Server)
```bash
npm run dev
```
> 📍 Ứng dụng tự động chạy tại địa chỉ cố định: **`http://localhost:3000`**

### 4. Biên Dịch Sản Xuất (Build for Production)
```bash
npm run build
npm run start
```

---

## 📁 Cấu Trúc Thư Mục Dự Án (Directory Structure)

```text
ggbg-crm/
├── src/
│   ├── app/                    # Next.js App Router Pages & API Endpoints
│   │   ├── api/                # RESTful API Endpoints (Auth, Leads, Chat, System...)
│   │   ├── chat/               # Live Chat CSKH Đa Kênh (/chat)
│   │   ├── customers/          # Quản lý Khách hàng 360° (/customers)
│   │   ├── hrm/                # Quản lý Nhân sự HRM (/hrm)
│   │   ├── kpis/               # Quản lý KPIs (/kpis)
│   │   ├── leads/              # Quản lý Lead & Phễu Kanban (/leads)
│   │   ├── performance/        # Chấm điểm hiệu suất S/A/B/C/D (/performance)
│   │   ├── products/           # Sản phẩm & Gói dịch vụ (/products)
│   │   ├── reviews/            # Đánh giá 360° (/reviews)
│   │   ├── settings/           # Cấu hình RBAC & Hệ thống (/settings/*)
│   │   ├── globals.css         # Custom Enterprise Utility Styles
│   │   └── layout.tsx          # Root Layout & ThemeProvider
│   ├── components/             # Reusable Handcrafted React Components
│   │   ├── chat/               # Quick Create Customer & Lead Modals
│   │   ├── hrm/                # Employee Modal, PDF Viewer, OrgChartTree
│   │   ├── layout/             # Header, Sidebar (Mobile Drawer)
│   │   ├── leads/              # Bulk Lead Import & Channel Analytics
│   │   └── settings/           # System Config & Security Modals
│   ├── context/                # React Contexts (AuthContext, ThemeContext)
│   ├── lib/                    # Stores, Supabase Client & Business Logic
│   └── types/                  # TypeScript Interfaces & Granular RBAC Permissions
├── supabase/                   # Database Migrations & SQL Schemas
└── package.json
```

---

## 📄 Giấy Phép & Bản Quyền (License)

Được phát triển và sở hữu bởi **GGBingo Enterprise Platform**. Bảo lưu mọi quyền.
