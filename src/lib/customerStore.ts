import { Customer } from '@/types';

/**
 * Kiểu Khách hàng mở rộng (thêm thông tin ngân hàng, hạn mức, ghi chú) và bộ
 * dữ liệu mẫu ban đầu. Tách khỏi trang UI để tái sử dụng ở lớp dữ liệu
 * (customersRepo) — dùng làm store in-memory khi chưa bật Supabase.
 */
/**
 * Một tương tác/sự kiện trên dòng thời gian chăm sóc khách hàng (Activity Timeline).
 * type quyết định icon + màu chấm hiển thị ở view chi tiết khách hàng.
 */
export interface CustomerActivity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'CONTRACT' | 'STAGE';
  title: string;
  note?: string;
  actor?: string;
  timestamp: string; // ISO string hoặc chuỗi ngày giờ parse được bởi Date
}

export interface ExtendedCustomer extends Customer {
  bank_account?: string;
  bank_name?: string;
  credit_limit?: number;
  notes?: string;
  activities?: CustomerActivity[];
}

export const INITIAL_CUSTOMERS: ExtendedCustomer[] = [
  {
    id: 'c1',
    customer_code: 'KH-8801',
    name: 'Phạm Văn Nam',
    entity_type: 'ENTERPRISE',
    company_name: 'Công ty TNHH Mỹ Phẩm SunBeauty',
    tax_code: '0108928374',
    representative_name: 'Phạm Văn Nam',
    phone: '0988 123 456',
    email: 'nam.pham@sunbeauty.vn',
    address: 'Số 18 Nguyễn Chánh, Quận Cầu Giấy, Hà Nội',
    customer_type: 'B2B_Agency_Service',
    tier: 'VIP',
    lifecycle_stage: 'VIP',
    health_score: 95,
    ltv_total_spent: 3850000000,
    ecom_platforms: ['Shopee', 'TikTokShop', 'Lazada'],
    avg_monthly_gmv: 1200000000,
    owner_name: 'Trần Văn Hoàng (Sale Exec)',
    ops_manager_name: 'Đỗ Thị Quyên (Ops Leader)',
    contract_r2_file: 'HDLD_KH8801.pdf',
    kyc_status: 'VERIFIED',
    kyc_documents: [
      {
        doc_id: 'doc_1',
        doc_type: 'GPKD',
        doc_name: 'Giay_Phep_Kinh_Doanh_SunBeauty.pdf',
        file_r2_path: 'storage.ggbingo.vn/kyc/gpkd_8801.pdf',
        uploaded_at: '2026-01-16 10:00',
        status: 'VALID',
      },
    ],
    bank_account: '1903888999001',
    bank_name: 'Techcombank - CN Cầu Giấy',
    credit_limit: 500000000,
    notes: 'Khách hàng VIP agency ưu tiên hỗ trợ 24/7',
    tags: ['Doanh số cao', 'Hợp đồng 2 năm'],
    created_at: '2026-01-15',
    activities: [
      {
        id: 'act_c1_1',
        type: 'STAGE',
        title: 'Nâng hạng vòng đời lên VIP',
        note: 'Doanh số quý vượt mốc 3 tỷ, tự động nâng hạng VIP.',
        actor: 'Hệ thống',
        timestamp: '2026-06-20T09:15:00',
      },
      {
        id: 'act_c1_2',
        type: 'CONTRACT',
        title: 'Ký gia hạn hợp đồng dịch vụ 2 năm',
        note: 'Hợp đồng HDLD_KH8801.pdf đã được ký số thành công.',
        actor: 'Đỗ Thị Quyên (Ops Leader)',
        timestamp: '2026-05-12T14:30:00',
      },
      {
        id: 'act_c1_3',
        type: 'MEETING',
        title: 'Họp review kế hoạch GMV Q3',
        note: 'Chốt mục tiêu tăng trưởng GMV 15% và bổ sung sàn Lazada.',
        actor: 'Trần Văn Hoàng (Sale Exec)',
        timestamp: '2026-04-28T10:00:00',
      },
      {
        id: 'act_c1_4',
        type: 'CALL',
        title: 'Gọi điện chăm sóc định kỳ',
        note: 'Khách hài lòng với hiệu suất vận hành, không có khiếu nại.',
        actor: 'Trần Văn Hoàng (Sale Exec)',
        timestamp: '2026-03-15T16:45:00',
      },
    ],
  },
  {
    id: 'c2',
    customer_code: 'KH-8802',
    name: 'Nguyễn Thị Hoa',
    entity_type: 'INDIVIDUAL',
    company_name: 'Hộ Kinh Doanh Thời Trang MiuStore',
    id_card_number: '001198002345',
    id_card_issue_date: '2021-05-10',
    id_card_issue_place: 'Cục Cảnh Sát QLHC về Trật Tự Xã Hội',
    phone: '0912 345 678',
    email: 'hoa.miustore@gmail.com',
    address: 'Đường Lê Lai, Quận 1, TP. Hồ Chí Minh',
    customer_type: 'GGBingoVN_Merchant',
    tier: 'Gold',
    lifecycle_stage: 'Regular',
    health_score: 82,
    ltv_total_spent: 1250000000,
    ecom_platforms: ['TikTokShop', 'GGBingoVN'],
    avg_monthly_gmv: 450000000,
    owner_name: 'Nguyễn Quốc Tuấn (Sale Senior)',
    ops_manager_name: 'Phạm Minh Đức (Ops Specialist)',
    contract_r2_file: 'HDLD_KH8802.pdf',
    kyc_status: 'VERIFIED',
    kyc_documents: [
      {
        doc_id: 'doc_2',
        doc_type: 'CCCD_FRONT',
        doc_name: 'CCCD_Mat_Truoc_NguyenThiHoa.jpg',
        file_r2_path: 'storage.ggbingo.vn/kyc/cccd_front_8802.jpg',
        uploaded_at: '2026-02-11 14:20',
        status: 'VALID',
      },
    ],
    bank_account: '0071000988776',
    bank_name: 'Vietcombank - CN Sài Gòn',
    credit_limit: 200000000,
    notes: 'Gian hàng hot trên GGBingoVN Platform',
    tags: ['GGBingoVN Merchant'],
    created_at: '2026-02-10',
    activities: [
      {
        id: 'act_c2_1',
        type: 'EMAIL',
        title: 'Gửi email báo cáo doanh số tháng 6',
        note: 'Đính kèm bảng phân tích GMV theo từng sàn TMĐT.',
        actor: 'Nguyễn Quốc Tuấn (Sale Senior)',
        timestamp: '2026-07-02T08:20:00',
      },
      {
        id: 'act_c2_2',
        type: 'NOTE',
        title: 'Ghi chú: khách quan tâm gói quảng cáo TikTokShop',
        note: 'Cần chuẩn bị proposal booking KOC cho chiến dịch tháng 8.',
        actor: 'Phạm Minh Đức (Ops Specialist)',
        timestamp: '2026-06-18T11:05:00',
      },
      {
        id: 'act_c2_3',
        type: 'CALL',
        title: 'Tư vấn onboarding gian hàng mới',
        note: 'Hướng dẫn thiết lập kho và cấu hình vận chuyển GGBingoVN.',
        actor: 'Nguyễn Quốc Tuấn (Sale Senior)',
        timestamp: '2026-02-11T15:40:00',
      },
    ],
  },
  {
    id: 'c3',
    customer_code: 'KH-8803',
    name: 'Lê Hoàng Anh',
    entity_type: 'ENTERPRISE',
    company_name: 'Công ty CP Gia Dụng SmartHome',
    tax_code: '0314928172',
    representative_name: 'Lê Hoàng Anh',
    phone: '0977 888 999',
    email: 'hoanganh@smarthome.vn',
    address: 'Quận Hai Bà Trưng, Hà Nội',
    customer_type: 'B2B_Agency_Service',
    tier: 'Silver',
    lifecycle_stage: 'At-Risk',
    health_score: 38,
    ltv_total_spent: 680000000,
    ecom_platforms: ['Shopee', 'Amazon'],
    avg_monthly_gmv: 280000000,
    owner_name: 'Lê Thị Mai (Sale Exec)',
    ops_manager_name: 'Nguyễn Văn Bình (Ops Specialist)',
    contract_r2_file: 'HDLD_KH8803.pdf',
    kyc_status: 'PENDING',
    bank_account: '112000888999',
    bank_name: 'VietinBank - CN Hai Bà Trưng',
    credit_limit: 150000000,
    tags: ['Nguy cơ rời bỏ', 'Giảm GMV tháng trước'],
    created_at: '2026-03-01',
  },
];
