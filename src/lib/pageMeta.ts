/**
 * Title + subtitle shown in the app header for each route.
 *
 * Kept separate from MENU_CLUSTERS: the sidebar wants a short label that fits a
 * 250px rail, the header wants the full name plus a line of context.
 */
export interface PageMeta {
  title: string;
  desc: string;
}

/**
 * The reporting period the seeded scorecards, KPIs and dashboard figures belong
 * to. Deliberately a constant rather than `new Date()` — it labels the data on
 * screen, and it must not drift away from that data (nor differ between the
 * server render and the client hydration).
 */
export const CURRENT_PERIOD = 'Tháng 07/2026';

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Tổng Quan Hệ Thống',
    desc: 'Executive Dashboard — Doanh số, gian hàng, lead & VoIP thời gian thực',
  },
  '/finance': {
    title: 'Báo Cáo Tài Chính',
    desc: 'Doanh thu, công nợ và dòng tiền theo từng gói dịch vụ vận hành',
  },
  '/customers': {
    title: 'Quản Lý Khách Hàng 360°',
    desc: 'Hồ sơ B2B & B2C, KYC, mask SĐT, công nợ',
  },
  '/leads': {
    title: 'Lead & Phễu Bán Hàng 7 Bước',
    desc: 'Kanban kéo-thả, webhook đa nguồn, chống trùng SĐT',
  },
  '/chat': {
    title: 'Live Chat CSKH Đa Kênh',
    desc: 'Zalo OA · Zalo Cá Nhân · Facebook Fanpage',
  },
  '/stores': {
    title: 'Gian Hàng Đa Sàn TMĐT',
    desc: 'Shopee · TikTok Shop · Lazada · Amazon · GGBingoVN',
  },
  '/products': {
    title: 'Sản Phẩm & Gói Dịch Vụ',
    desc: 'Cấu hình thuộc tính động JSONB theo sàn TMĐT',
  },
  '/hr-map': {
    title: 'Bản Đồ Phân Bổ Nhân Sự',
    desc: 'Mật độ nhân sự theo tỉnh/thành trên toàn quốc',
  },
  '/contracts': {
    title: 'Quản Lý Hợp Đồng PDF',
    desc: 'Kho hợp đồng Cloudflare R2, ký số điện tử & gia hạn',
  },
  '/hrm': {
    title: 'Quản Lý Nhân Sự HRM',
    desc: 'Hồ sơ, hợp đồng R2, phê duyệt onboard, sơ đồ tổ chức',
  },
  '/kpis': {
    title: 'Quản Lý KPIs',
    desc: 'Công ty → Phòng ban → Team → Cá nhân',
  },
  '/performance': {
    title: 'Chấm Điểm Hiệu Suất S/A/B/C/D',
    desc: 'Đánh giá từ ngày 1–5 hàng tháng, xếp hạng tự động',
  },
  '/reviews': {
    title: 'Đánh Giá 360° Năng Lực',
    desc: 'Tự đánh giá · Quản lý · Đồng nghiệp · Cấp dưới',
  },
  '/audit': {
    title: 'Nhật Ký Hệ Thống',
    desc: 'Security audit log — truy vết mọi thao tác nhạy cảm',
  },
  '/settings/users': {
    title: 'Quản Lý Tài Khoản',
    desc: 'Tài khoản đăng nhập, khóa/mở khóa, gán vai trò',
  },
  '/settings/rbac': {
    title: 'Phân Quyền Truy Cập RBAC',
    desc: 'Ma trận vai trò × phân hệ × phạm vi dữ liệu',
  },
  '/settings/system': {
    title: 'Cấu Hình Hệ Thống',
    desc: 'SMTP, webhook, kết nối CSDL & bật/tắt phân hệ',
  },
};

const FALLBACK: PageMeta = {
  title: 'GGBingo CRM',
  desc: 'Nền tảng vận hành gian hàng TMĐT & GGBingoVN',
};

export function getPageMeta(pathname: string): PageMeta {
  if (PAGE_META[pathname]) return PAGE_META[pathname];

  // Longest-prefix match so nested routes inherit their section's heading.
  const prefix = Object.keys(PAGE_META)
    .filter((href) => href !== '/' && pathname.startsWith(href))
    .sort((a, b) => b.length - a.length)[0];

  return prefix ? PAGE_META[prefix] : FALLBACK;
}
