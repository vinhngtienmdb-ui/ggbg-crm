'use client';

import { Lead } from '@/types';

export const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead_01',
    lead_code: 'LD-1001',
    customer_id: 'cust_01',
    full_name: 'Nguyễn Văn Hùng',
    entity_type: 'ENTERPRISE',
    company_name: 'Công Ty Cổ Phần Công Nghệ & Thương Mại Alpha',
    tax_code: '0108992384',
    phone: '0912345678',
    email: 'contact@alphatech.vn',
    interested_product_id: 'p1',
    interested_product_name: 'Gói Vận Hành Gian Hàng TMĐT Toàn Diện',
    address: 'Tầng 12, Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    source_name: 'Facebook Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_6',
    stage_name: '6. Chốt Thành Công',
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 145000000,
    lead_score: 95,
    status: 'Converted',
    kyc_status: 'VERIFIED',
    created_at: '2026-08-01 10:00',
  },
  {
    id: 'lead_02',
    lead_code: 'LD-1002',
    customer_id: 'cust_02',
    full_name: 'Vũ Đình Trọng',
    entity_type: 'HOUSEHOLD_BUSINESS',
    company_name: 'Hộ Kinh Doanh Thời Trang May Mặc Trọng Phát',
    tax_code: '8392019283',
    household_reg_num: 'HKD-839201',
    phone: '0987654321',
    email: 'trongphat.fashion@gmail.com',
    interested_product_id: 'p2',
    interested_product_name: 'Setup & Tối Ưu Gian Hàng TikTok Shop',
    address: 'Số 45 Phố Huế, Hoàn Kiếm, Hà Nội',
    source_name: 'TikTok Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_4',
    stage_name: '4. Báo Giá Dịch Vụ',
    assigned_sale_name: 'Lê Thị Mai (Đội 2)',
    estimated_budget: 65000000,
    lead_score: 82,
    status: 'Negotiating',
    kyc_status: 'VERIFIED',
    created_at: '2026-08-05 14:30',
  },
  {
    id: 'lead_03',
    lead_code: 'LD-1003',
    customer_id: 'cust_03',
    full_name: 'Trần Bảo Ngọc',
    entity_type: 'INDIVIDUAL',
    phone: '0903456789',
    email: 'baongoc.koc@gmail.com',
    interested_product_id: 'p3',
    interested_product_name: 'Khóa Huấn Luyện Livestream Thực Chiến',
    address: 'Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh',
    source_name: 'Google Ads',
    pipeline_id: 'ACADEMY',
    stage_id: 'stage_3',
    stage_name: '3. Tư Vấn Giải Pháp',
    assigned_sale_name: 'Nguyễn Văn Nam (Đội 1)',
    estimated_budget: 25000000,
    lead_score: 74,
    status: 'Contacted',
    kyc_status: 'PENDING',
    created_at: '2026-08-10 09:15',
  },
  {
    id: 'lead_04',
    lead_code: 'LD-1004',
    customer_id: 'cust_04',
    full_name: 'Phạm Quốc Hưng',
    entity_type: 'ENTERPRISE',
    company_name: 'Công Ty TNHH Phân Phối Dược Phẩm MediGreen',
    tax_code: '0315998822',
    phone: '0977889900',
    email: 'hung.pq@medigreen.vn',
    interested_product_id: 'p4',
    interested_product_name: 'Tư Vấn Giấy Phép & Gian Hàng Shopee Mall',
    address: 'Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh',
    source_name: 'Referral / Giới Thiệu',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_5',
    stage_name: '5. Đàm Phán Hợp Đồng',
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 220000000,
    lead_score: 91,
    status: 'Negotiating',
    kyc_status: 'VERIFIED',
    created_at: '2026-08-12 16:40',
  }
];

const LEADS_STORAGE_KEY = 'ggbg_crm_leads_v1';

export function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
      return INITIAL_SAMPLE_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading leads from localStorage:', e);
    return INITIAL_SAMPLE_LEADS;
  }
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new Event('ggbg_leads_updated'));
  } catch (e) {
    console.error('Error saving leads to localStorage:', e);
  }
}
