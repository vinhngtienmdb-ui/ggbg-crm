import { Customer } from '@/types';

/**
 * Customer record plus the finance fields the 360° drawer shows.
 *
 * Kept as an extension of `Customer` rather than folded into it: these columns
 * live in a separate finance table server-side, so the split mirrors the API
 * this store will eventually be replaced by.
 */
export interface ExtendedCustomer extends Customer {
  bank_account?: string;
  bank_name?: string;
  credit_limit?: number;
  notes?: string;
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
    notes: 'Giảm GMV tháng trước, cần chăm sóc lại',
    tags: ['Nguy cơ rời bỏ', 'Giảm GMV tháng trước'],
    created_at: '2026-03-01',
  },
  {
    id: 'c4',
    customer_code: 'KH-8804',
    name: 'Nguyễn Hồng Lực',
    entity_type: 'ENTERPRISE',
    company_name: 'Công ty Vận Tải Hồng Lực',
    tax_code: '0107556621',
    representative_name: 'Nguyễn Hồng Lực',
    phone: '0988 234 111',
    email: 'luc.nguyen@logistics.vn',
    address: 'Quận Long Biên, Hà Nội',
    customer_type: 'B2B_Agency_Service',
    tier: 'Gold',
    lifecycle_stage: 'Regular',
    health_score: 78,
    ltv_total_spent: 940000000,
    ecom_platforms: ['Shopee'],
    avg_monthly_gmv: 310000000,
    owner_name: 'Trần Văn Hoàng (Sale Exec)',
    ops_manager_name: 'Đỗ Thị Quyên (Ops Leader)',
    contract_r2_file: 'HDLD_KH8804.pdf',
    kyc_status: 'VERIFIED',
    kyc_documents: [
      {
        doc_id: 'doc_3',
        doc_type: 'GPKD',
        doc_name: 'GPKD_HongLuc.pdf',
        file_r2_path: 'storage.ggbingo.vn/kyc/gpkd_8804.pdf',
        uploaded_at: '2026-03-05 09:10',
        status: 'VALID',
      },
    ],
    bank_account: '8899001234567',
    bank_name: 'MB Bank - CN Long Biên',
    credit_limit: 250000000,
    notes: 'Đang đàm phán gia hạn gói Shopee Mall quý tới',
    tags: ['Shopee Mall'],
    created_at: '2026-03-04',
  },
  {
    id: 'c5',
    customer_code: 'KH-8805',
    name: 'Trương Mỹ Lan Anh',
    entity_type: 'INDIVIDUAL',
    company_name: 'Hộ Kinh Doanh Mỹ Phẩm Beauty Glow',
    id_card_number: '079198334455',
    id_card_issue_date: '2022-08-19',
    id_card_issue_place: 'Cục Cảnh Sát QLHC về Trật Tự Xã Hội',
    phone: '0902 456 789',
    email: 'lananh@beautyglow.vn',
    address: 'TP. Thủ Đức, TP. Hồ Chí Minh',
    customer_type: 'GGBingoVN_Merchant',
    tier: 'Standard',
    lifecycle_stage: 'Prospect',
    health_score: 64,
    ltv_total_spent: 180000000,
    ecom_platforms: ['TikTokShop'],
    avg_monthly_gmv: 95000000,
    owner_name: 'Lê Thị Mai (Sale Exec)',
    contract_r2_file: 'HDLD_KH8805.pdf',
    kyc_status: 'PENDING',
    bank_account: '223344556677',
    bank_name: 'ACB - CN Thủ Đức',
    credit_limit: 80000000,
    notes: 'Mới ký gói Livestream & Booking KOC',
    tags: ['TikTok Shop', 'Khách mới'],
    created_at: '2026-06-20',
  },
];

/** Sale reps a customer can be assigned to, used by the bulk-reassign control. */
export const SALE_OWNERS: string[] = [
  'Trần Văn Hoàng (Sale Exec)',
  'Nguyễn Quốc Tuấn (Sale Senior)',
  'Lê Thị Mai (Sale Exec)',
  'Phạm Minh Đức (Đội 1)',
  'Phạm Thanh Hương (Đội 2)',
];

/** Next customer code in the `KH-####` sequence. */
export function nextCustomerCode(existing: ExtendedCustomer[]): string {
  const highest = existing.reduce((max, c) => {
    const n = Number(c.customer_code.replace(/\D/g, ''));
    return Number.isFinite(n) && n > max ? n : max;
  }, 8800);
  return `KH-${highest + 1}`;
}
