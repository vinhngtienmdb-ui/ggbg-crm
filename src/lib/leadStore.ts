import { Lead } from '@/types';
import { isLeadAssigned } from '@/lib/leadScoring';

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

/**
 * Tự động phân bổ (auto-assign) một Lead cho danh sách sale theo round-robin.
 * - Nếu Lead đã có người phụ trách → giữ nguyên (không ghi đè).
 * - `index` là vị trí luân phiên (round-robin), do phía gọi tăng dần cho mỗi
 *   Lead chưa gán để trải đều khối lượng cho các sale.
 * Trả về bản sao Lead với `assigned_sale_name` đã gán (nếu có thay đổi).
 */
export function autoAssignLead(lead: Lead, salesList: string[], index = 0): Lead {
  if (!salesList.length || isLeadAssigned(lead)) return lead;
  const assignee = salesList[index % salesList.length];
  return { ...lead, assigned_sale_name: assignee };
}

/**
 * Phân bổ hàng loạt: gán mọi Lead chưa có người phụ trách cho `salesList` theo
 * round-robin. Trả về mảng Lead mới và số lượng Lead đã được phân bổ.
 */
export function autoAssignLeads(
  leads: Lead[],
  salesList: string[]
): { leads: Lead[]; assignedCount: number; assignments: { id: string; assignee: string }[] } {
  const assignments: { id: string; assignee: string }[] = [];
  let cursor = 0;
  const next = leads.map((lead) => {
    if (isLeadAssigned(lead) || !salesList.length) return lead;
    const assigned = autoAssignLead(lead, salesList, cursor);
    cursor += 1;
    assignments.push({ id: assigned.id, assignee: assigned.assigned_sale_name });
    return assigned;
  });
  return { leads: next, assignedCount: assignments.length, assignments };
}
