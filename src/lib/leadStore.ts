import { Lead } from '@/types';

/**
 * Dữ liệu Lead mẫu ban đầu — tách khỏi trang UI (leads/page.tsx) để tái sử dụng
 * ở lớp dữ liệu server (API tìm kiếm) làm store in-memory khi chưa bật Supabase.
 * Giữ nguyên dữ liệu/định dạng như trước khi tách.
 */
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    lead_code: 'LD-1029',
    full_name: 'Phạm Hồng Thái',
    entity_type: 'ENTERPRISE',
    phone: '0977 123 888',
    email: 'thai.pham@sneakerx.vn',
    company_name: 'Shop Giày Sneaker X',
    tax_code: '0109283711',
    shop_link: 'shopee.vn/sneakerx',
    source_name: 'Facebook Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_1',
    stage_name: '1. Tiếp Nhận Mới',
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 150000000,
    lead_score: 88,
    status: 'New',
    created_at: '2026-07-23 08:30',
  },
  {
    id: 'l2',
    lead_code: 'LD-1030',
    full_name: 'Vũ Thị Minh',
    entity_type: 'INDIVIDUAL',
    phone: '0912 345 678',
    email: 'minh.vu@miumiusale.com',
    company_name: 'Thời Trang Nữ Miu Miu',
    id_card_number: '001198002345',
    shop_link: 'tiktok.com/@miumiusale',
    source_name: 'Google Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_2',
    stage_name: '2. Liên Hệ Ban Đầu',
    assigned_sale_name: 'Lê Thị Mai (Đội 3)',
    estimated_budget: 200000000,
    lead_score: 92,
    status: 'Contacted',
    created_at: '2026-07-23 09:00',
  },
];
