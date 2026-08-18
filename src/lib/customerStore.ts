import { Customer, CustomerTier, LifecycleStage, CustomerTierRuleConfig } from '@/types';
import { CreditLimitApprovalRequest } from '@/types/finance';
import { getCustomerTierRules } from './systemConfigStore';

export const INITIAL_CUSTOMERS_DATA: Customer[] = [
  {
    id: 'cust_01',
    customer_code: 'KH-1001',
    name: 'Nguyễn Văn Hùng',
    entity_type: 'ENTERPRISE',
    company_name: 'Công Ty Cổ Phần Công Nghệ & Thương Mại Alpha',
    tax_code: '0108992384',
    representative_name: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    email: 'contact@alphatech.vn',
    address: 'Tầng 12, Tòa nhà Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    contacts: [
      {
        id: 'c_01_1',
        name: 'Nguyễn Văn Hùng',
        role_title: 'Tổng Giám Đốc (CEO)',
        phone: '0912345678',
        email: 'hung.nguyen@alphatech.vn',
        is_primary: true,
        notes: 'Người đại diện ký duyệt hợp đồng chính thức'
      },
      {
        id: 'c_01_2',
        name: 'Trần Thị Thu Hà',
        role_title: 'Kế Toán Trưởng',
        phone: '0988776655',
        email: 'ketoan@alphatech.vn',
        is_primary: false,
        notes: 'Phụ trách đối soát hóa đơn và công nợ định kỳ'
      },
      {
        id: 'c_01_3',
        name: 'Lê Minh Tuấn',
        role_title: 'Trợ Lý Giám Đốc / Điều Phối Vận Hành',
        phone: '0977112233',
        email: 'tuan.lm@alphatech.vn',
        is_primary: false,
        notes: 'Đầu mối trao đổi công việc hàng ngày'
      }
    ],
    tier: 'VIP',
    tier_auto_updated_at: '2026-08-01',
    lifecycle_stage: 'VIP',
    lifecycle_auto_updated_at: '2026-08-01',
    lifecycle_reason: 'LTV đạt 145 triệu VNĐ và duy trì tương tác tốt trong 30 ngày',
    health_score: 95,
    ltv_total_spent: 145000000,
    owner_name: 'Trần Quang Huy',
    ops_manager_name: 'Nguyễn Văn A',
    cskh_task_assigned: 'Chăm sóc định kỳ tháng 8 & Tặng quà tri ân VIP',
    credit_limit_info: {
      approved_limit: 150000000,
      status: 'APPROVED',
      requested_limit: 150000000,
      reason: 'Khách hàng chiến lược, uy tín thanh toán tốt',
      sales_director_approval: { approver_name: 'Phạm Minh Đức', approved_at: '2026-06-15 09:30', status: 'APPROVED' },
      chief_accountant_approval: { approver_name: 'Đặng Thanh Thủy', approved_at: '2026-06-15 14:20', status: 'APPROVED' },
      ceo_approval: { approver_name: 'Nguyễn Quốc Tuấn (CEO)', approved_at: '2026-06-16 08:45', status: 'APPROVED' }
    },
    bank_account: '19034567890012',
    bank_name: 'Techcombank - CN Thăng Long',
    kyc_status: 'VERIFIED',
    kyc_documents: [
      { doc_id: 'kyc_1_1', doc_type: 'GPKD', doc_name: 'Giấy phép ĐKKD Alpha Tech.pdf', file_r2_path: '/kyc/gpkd_alpha.pdf', uploaded_at: '2026-01-10', status: 'VALID' },
      { doc_id: 'kyc_1_2', doc_type: 'CCCD_FRONT', doc_name: 'CCCD Đại diện pháp luật (Mặt trước)', file_r2_path: '/kyc/cccd_hung_f.jpg', uploaded_at: '2026-01-10', status: 'VALID' }
    ],
    tags: ['Chiến Lược', 'Top 5 GMV', 'Doanh Nghiệp Lớn'],
    created_at: '2026-01-10 09:00'
  },
  {
    id: 'cust_02',
    customer_code: 'KH-1002',
    name: 'Vũ Đình Trọng',
    entity_type: 'HOUSEHOLD_BUSINESS',
    household_name: 'Hộ Kinh Doanh Thời Trang May Mặc Trọng Phát',
    household_reg_num: '01D8012345',
    household_owner_name: 'Vũ Đình Trọng',
    tax_code: '8392019283',
    id_card_number: '036090012345',
    id_card_issue_date: '2022-05-15',
    id_card_issue_place: 'Cục CSQLHC về TTXH',
    phone: '0903456789',
    email: 'trongphat.fashion@gmail.com',
    address: 'Số 45 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
    contacts: [
      {
        id: 'c_02_1',
        name: 'Vũ Đình Trọng',
        role_title: 'Chủ Hộ Kinh Doanh',
        phone: '0903456789',
        email: 'trongphat.fashion@gmail.com',
        is_primary: true,
        notes: 'Chủ cơ sở quyết định toàn bộ hoạt động'
      },
      {
        id: 'c_02_2',
        name: 'Nguyễn Bích Ngọc',
        role_title: 'Quản Lý Cửa Hàng / Vận Hành',
        phone: '0908889922',
        email: 'bichngoc.trongphat@gmail.com',
        is_primary: false,
        notes: 'Phụ trách nhận bàn giao ấn phẩm và vận hành'
      }
    ],
    tier: 'Gold',
    tier_auto_updated_at: '2026-07-20',
    lifecycle_stage: 'Active',
    lifecycle_auto_updated_at: '2026-07-20',
    lifecycle_reason: 'Phát sinh đơn hàng & thanh toán đều đặn trong 45 ngày qua',
    health_score: 88,
    ltv_total_spent: 68000000,
    owner_name: 'Lê Hoàng Nam',
    cskh_task_assigned: 'Tư vấn mở rộng kênh kinh doanh mới',
    credit_limit_info: {
      approved_limit: 50000000,
      status: 'APPROVED',
      requested_limit: 50000000,
      reason: 'Hộ kinh doanh uy tín, doanh thu thực tế ổn định',
      sales_director_approval: { approver_name: 'Phạm Minh Đức', approved_at: '2026-05-10 10:00', status: 'APPROVED' },
      chief_accountant_approval: { approver_name: 'Đặng Thanh Thủy', approved_at: '2026-05-10 15:30', status: 'APPROVED' },
      ceo_approval: { approver_name: 'Nguyễn Quốc Tuấn (CEO)', approved_at: '2026-05-11 09:15', status: 'APPROVED' }
    },
    bank_account: '1029384756',
    bank_name: 'Vietcombank - CN Hà Nội',
    kyc_status: 'VERIFIED',
    kyc_documents: [
      { doc_id: 'kyc_2_1', doc_type: 'GPKD', doc_name: 'GCN Đăng ký Hộ kinh doanh Trọng Phát.pdf', file_r2_path: '/kyc/hkd_trongphat.pdf', uploaded_at: '2026-03-05', status: 'VALID' }
    ],
    tags: ['Hộ Kinh Doanh', 'Thời Trang', 'Tiềm Năng Cao'],
    created_at: '2026-03-05 14:30'
  },
  {
    id: 'cust_03',
    customer_code: 'KH-1003',
    name: 'Phạm Phương Linh',
    entity_type: 'INDIVIDUAL',
    id_card_number: '079198004567',
    id_card_issue_date: '2023-01-12',
    id_card_issue_place: 'Cục CSQLHC về TTXH',
    phone: '0938112233',
    email: 'linh.pham.creator@gmail.com',
    address: 'Chung cư Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh',
    tier: 'Silver',
    tier_auto_updated_at: '2026-06-18',
    lifecycle_stage: 'Regular',
    lifecycle_auto_updated_at: '2026-06-18',
    lifecycle_reason: 'Khách hàng cá nhân ký kết 2 hợp đồng dịch vụ liên tiếp',
    health_score: 82,
    ltv_total_spent: 32000000,
    owner_name: 'Đỗ Thùy Trang',
    cskh_task_assigned: 'Hỗ trợ kỹ thuật định kỳ',
    credit_limit_info: {
      approved_limit: 0,
      status: 'NOT_SET',
      reason: 'Khách hàng cá nhân thanh toán trả trước theo từng kỳ'
    },
    bank_account: '0938112233',
    bank_name: 'MB Bank',
    kyc_status: 'VERIFIED',
    tags: ['Cá Nhân', 'KOC/KOL', 'Sáng Tạo Nội Dung'],
    created_at: '2026-04-12 11:20'
  },
  {
    id: 'cust_04',
    customer_code: 'KH-1004',
    name: 'Hoàng Quốc Việt',
    entity_type: 'ENTERPRISE',
    company_name: 'Công Ty TNHH Xuất Nhập Khẩu & Phân Phối Việt Long',
    tax_code: '0316789012',
    representative_name: 'Hoàng Quốc Việt',
    phone: '0909123888',
    email: 'contact@vietlongcorp.com',
    address: 'Khu Công Nghiệp Tân Bình, Tân Phú, TP. Hồ Chí Minh',
    contacts: [
      {
        id: 'c_04_1',
        name: 'Hoàng Quốc Việt',
        role_title: 'Giám Đốc Điều Hành',
        phone: '0909123888',
        email: 'viet.hq@vietlongcorp.com',
        is_primary: true
      },
      {
        id: 'c_04_2',
        name: 'Phan Thị Mai',
        role_title: 'Trưởng Phòng Thu Mua',
        phone: '0909887711',
        email: 'mai.pt@vietlongcorp.com',
        is_primary: false
      }
    ],
    tier: 'Standard',
    tier_auto_updated_at: '2026-08-10',
    lifecycle_stage: 'Prospect',
    lifecycle_auto_updated_at: '2026-08-10',
    lifecycle_reason: 'Khách hàng mới tiếp nhận từ nguồn Lead, đang trong giai đoạn báo giá',
    health_score: 65,
    ltv_total_spent: 0,
    owner_name: 'Trần Quang Huy',
    cskh_task_assigned: 'Gửi bản đề xuất giải pháp dịch vụ và demo',
    credit_limit_info: {
      approved_limit: 0,
      status: 'PENDING',
      requested_limit: 100000000,
      reason: 'Đề xuất hạn mức công nợ gối đầu 30 ngày cho hợp đồng mới',
      sales_director_approval: { approver_name: 'Phạm Minh Đức', approved_at: '2026-08-16 11:00', status: 'APPROVED', note: 'Đã thẩm định tiềm năng doanh nghiệp lớn' }
    },
    kyc_status: 'PENDING',
    tags: ['Lead Chuyển Đổi', 'Triển Vọng', 'Báo Giá'],
    created_at: '2026-08-10 16:45'
  }
];

export const INITIAL_CREDIT_REQUESTS: CreditLimitApprovalRequest[] = [
  {
    id: 'req_cred_01',
    request_code: 'CR-2026-0801',
    customer_id: 'cust_04',
    customer_code: 'KH-1004',
    customer_name: 'Hoàng Quốc Việt',
    company_name: 'Công Ty TNHH Xuất Nhập Khẩu & Phân Phối Việt Long',
    entity_type: 'ENTERPRISE',
    current_limit: 0,
    requested_limit: 100000000,
    reason: 'Cấp hạn mức gối đầu thanh toán kỳ 30 ngày cho gói dịch vụ tổng thể',
    status: 'PENDING_CHIEF_ACCOUNTANT',
    sales_director_approval: {
      approver_name: 'Phạm Minh Đức (GĐ Kinh Doanh)',
      approved_at: '2026-08-16 11:00',
      status: 'APPROVED',
      note: 'Hồ sơ pháp lý đầy đủ, kế hoạch doanh thu khả quan'
    },
    created_at: '2026-08-16 09:30',
    updated_at: '2026-08-16 11:00'
  },
  {
    id: 'req_cred_02',
    request_code: 'CR-2026-0701',
    customer_id: 'cust_01',
    customer_code: 'KH-1001',
    customer_name: 'Nguyễn Văn Hùng',
    company_name: 'Công Ty Cổ Phần Công Nghệ & Thương Mại Alpha',
    entity_type: 'ENTERPRISE',
    current_limit: 100000000,
    requested_limit: 150000000,
    reason: 'Nâng hạn mức đáp ứng quy mô mở rộng 5 dự án',
    status: 'APPROVED',
    sales_director_approval: {
      approver_name: 'Phạm Minh Đức',
      approved_at: '2026-06-15 09:30',
      status: 'APPROVED',
      note: 'Đã duyệt'
    },
    chief_accountant_approval: {
      approver_name: 'Đặng Thanh Thủy',
      approved_at: '2026-06-15 14:20',
      status: 'APPROVED',
      note: 'Lịch sử thanh toán xuất sắc 0 ngày quá hạn'
    },
    ceo_approval: {
      approver_name: 'Nguyễn Quốc Tuấn (CEO)',
      approved_at: '2026-06-16 08:45',
      status: 'APPROVED',
      note: 'Phê chuẩn hạn mức 150 triệu'
    },
    created_at: '2026-06-14 14:00',
    updated_at: '2026-06-16 08:45'
  }
];

// =================== AUTO EVALUATION LOGIC ===================

/**
 * Tự động tính toán Hạng Khách Hàng (Tier) dựa trên bảng quy tắc cấu hình hệ thống
 */
export function computeCustomerTier(
  ltvTotalSpent: number,
  activeContractsCount: number = 0,
  rulesConfig?: CustomerTierRuleConfig[]
): CustomerTier {
  const rules = rulesConfig && rulesConfig.length > 0 ? rulesConfig : getCustomerTierRules();
  
  // Sort rules by min_ltv descending to match highest tier first
  const sortedRules = [...rules].sort((a, b) => b.min_ltv - a.min_ltv);

  for (const rule of sortedRules) {
    if (ltvTotalSpent >= rule.min_ltv && activeContractsCount >= rule.min_active_contracts) {
      return rule.tier;
    }
  }

  return 'Standard';
}

/**
 * Tự động tính toán Trạng Thái Vòng Đời (Lifecycle Stage)
 */
export function computeCustomerLifecycle(
  customer: Partial<Customer>,
  overdueDebtDays: number = 0,
  daysSinceLastActivity: number = 0
): { stage: LifecycleStage; reason: string } {
  const ltv = customer.ltv_total_spent || 0;
  const health = customer.health_score ?? 75;

  // 1. Quá hạn nghiêm trọng hoặc không hoạt động quá 180 ngày => Churned
  if (daysSinceLastActivity > 180 || health <= 20) {
    return {
      stage: 'Churned',
      reason: 'Không phát sinh giao dịch trong hơn 180 ngày hoặc điểm sức khỏe dưới 20'
    };
  }

  // 2. Nợ quá hạn trên 30 ngày hoặc sức khỏe suy giảm => At-Risk
  if (overdueDebtDays > 30 || health < 50 || daysSinceLastActivity > 60) {
    return {
      stage: 'At-Risk',
      reason: overdueDebtDays > 30
        ? `Công nợ quá hạn ${overdueDebtDays} ngày cần thu hồi`
        : 'Không phát sinh tương tác trong hơn 60 ngày hoặc chỉ số sức khỏe thấp'
    };
  }

  // 3. Khách hàng chi tiêu lớn và gắn kết cao => VIP
  if (ltv >= 100000000 && health >= 85) {
    return {
      stage: 'VIP',
      reason: `Tổng chi tiêu LTV đạt ${Math.round(ltv / 1000000)} triệu VNĐ và sức khỏe gắn kết đạt ${health}/100`
    };
  }

  // 4. Khách hàng đã phát sinh chi tiêu và duy trì ổn định => Regular hoặc Active
  if (ltv > 0) {
    if (ltv >= 30000000) {
      return {
        stage: 'Regular',
        reason: 'Khách hàng duy trì sử dụng dịch vụ định kỳ và thanh toán đúng hạn'
      };
    }
    return {
      stage: 'Active',
      reason: 'Khách hàng đang trong thời gian hợp đồng hiệu lực'
    };
  }

  // 5. Mặc định khách hàng mới chưa phát sinh doanh số => Prospect
  return {
    stage: 'Prospect',
    reason: 'Khách hàng mới tiếp nhận, chưa phát sinh doanh thu thực tế'
  };
}

// =================== STORAGE HELPERS ===================

export function getStoredCustomers(): Customer[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ggbg_crm_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
  }
  return INITIAL_CUSTOMERS_DATA;
}

export function saveStoredCustomers(customers: Customer[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ggbg_crm_customers', JSON.stringify(customers));
    window.dispatchEvent(new Event('ggbg_customers_updated'));
  }
}

export function getStoredCreditRequests(): CreditLimitApprovalRequest[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ggbg_credit_limit_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
  }
  return INITIAL_CREDIT_REQUESTS;
}

export function saveStoredCreditRequests(requests: CreditLimitApprovalRequest[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ggbg_credit_limit_requests', JSON.stringify(requests));
    window.dispatchEvent(new Event('ggbg_credit_requests_updated'));
  }
}
