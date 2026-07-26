import { Lead, LeadSource } from '@/types';
import { PIPELINE_STAGES } from '@/lib/uiFormat';
export interface LeadStageLog {
  id: string;
  lead_code: string;
  lead_name: string;
  actor_name: string;
  from_stage: string;
  to_stage: string;
  timestamp: string;
  note?: string;
}

const stageName = (n: number) => PIPELINE_STAGES[n - 1].name;

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
    stage_name: stageName(1),
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 150000000,
    lead_score: 88,
    status: 'New',
    created_at: '2026-07-23 08:30',
  },
  {
    id: 'l3',
    lead_code: 'LD-1031',
    full_name: 'Trần Bảo An',
    entity_type: 'INDIVIDUAL',
    phone: '0988 666 888',
    email: 'baoan.tran@beauty.vn',
    company_name: 'Mỹ Phẩm Beauty Glow',
    source_name: 'TikTok Lead Gen',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_1',
    stage_name: stageName(1),
    assigned_sale_name: 'Nguyễn Quốc Tuấn (Đội 2)',
    estimated_budget: 120000000,
    lead_score: 76,
    status: 'New',
    created_at: '2026-07-24 10:28',
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
    stage_name: stageName(2),
    assigned_sale_name: 'Lê Thị Mai (Đội 3)',
    estimated_budget: 200000000,
    lead_score: 92,
    status: 'Contacted',
    created_at: '2026-07-23 09:00',
  },
  {
    id: 'l4',
    lead_code: 'LD-1032',
    full_name: 'Ngô Đức Long',
    entity_type: 'ENTERPRISE',
    phone: '0936 222 333',
    email: 'long.ngo@besthome.vn',
    company_name: 'Gia Dụng BestHome',
    source_name: 'Zalo OA Form',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_3',
    stage_name: stageName(3),
    assigned_sale_name: 'Phạm Minh Đức (Đội 1)',
    estimated_budget: 320000000,
    lead_score: 81,
    status: 'Qualified',
    created_at: '2026-07-22 14:10',
  },
  {
    id: 'l5',
    lead_code: 'LD-1033',
    full_name: 'Hoàng Yến',
    entity_type: 'INDIVIDUAL',
    phone: '0905 777 111',
    email: 'yen.hoang@yenviet.vn',
    company_name: 'F&B Yến Việt',
    source_name: 'Referral / Giới Thiệu',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_3',
    stage_name: stageName(3),
    assigned_sale_name: 'Lê Thị Mai (Đội 3)',
    estimated_budget: 90000000,
    lead_score: 69,
    status: 'Qualified',
    created_at: '2026-07-21 16:45',
  },
  {
    id: 'l6',
    lead_code: 'LD-1034',
    full_name: 'Đỗ Mạnh Cường',
    entity_type: 'ENTERPRISE',
    phone: '0978 444 555',
    email: 'cuong.do@citypower.vn',
    company_name: 'Điện Máy CityPower',
    source_name: 'Website GGBingoVN',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_4',
    stage_name: stageName(4),
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 450000000,
    lead_score: 95,
    status: 'Negotiating',
    created_at: '2026-07-20 09:15',
  },
  {
    id: 'l7',
    lead_code: 'LD-1035',
    full_name: 'Lý Thu Trang',
    entity_type: 'INDIVIDUAL',
    phone: '0919 888 222',
    email: 'trang.ly@trangly.vn',
    company_name: 'Local Brand TrangLy',
    source_name: 'Event / Hội Thảo',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_5',
    stage_name: stageName(5),
    assigned_sale_name: 'Nguyễn Quốc Tuấn (Đội 2)',
    estimated_budget: 260000000,
    lead_score: 90,
    status: 'Negotiating',
    created_at: '2026-07-18 11:00',
  },
  {
    id: 'l8',
    lead_code: 'LD-1036',
    full_name: 'Bùi Quang Huy',
    entity_type: 'ENTERPRISE',
    phone: '0966 333 777',
    email: 'huy.bui@mocviet.vn',
    company_name: 'Nội Thất MocViet',
    source_name: 'Bulk Import Excel',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_6',
    stage_name: stageName(6),
    assigned_sale_name: 'Phạm Minh Đức (Đội 1)',
    estimated_budget: 380000000,
    lead_score: 84,
    status: 'Converted',
    created_at: '2026-07-15 08:00',
  },
  {
    id: 'l9',
    lead_code: 'LD-1037',
    full_name: 'Phan Kim Chi',
    entity_type: 'INDIVIDUAL',
    phone: '0932 555 999',
    email: 'chi.phan@kidscare.vn',
    company_name: 'Mẹ & Bé KidsCare',
    source_name: 'Hotline Zalo',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_7',
    stage_name: stageName(7),
    assigned_sale_name: 'Lê Thị Mai (Đội 3)',
    estimated_budget: 75000000,
    lead_score: 72,
    status: 'Contacted',
    created_at: '2026-07-10 13:20',
  },
];

export const INITIAL_STAGE_LOGS: LeadStageLog[] = [
  {
    id: 'log_1',
    lead_code: 'LD-1030',
    lead_name: 'Vũ Thị Minh',
    from_stage: stageName(1),
    to_stage: stageName(2),
    actor_name: 'Lê Thị Mai (Sale Exec)',
    timestamp: '2026-07-23 09:05:12',
    note: 'Đã hoàn thành cuộc gọi trao đổi nhu cầu ban đầu',
  },
  {
    id: 'log_2',
    lead_code: 'LD-1029',
    lead_name: 'Phạm Hồng Thái',
    from_stage: 'Khởi tạo hệ thống',
    to_stage: stageName(1),
    actor_name: 'Trần Văn Hoàng (Sale Exec)',
    timestamp: '2026-07-23 08:30:00',
    note: 'Tiếp nhận Lead mới từ Facebook Ads',
  },
];

export const SALES_REPS: string[] = [
  'Trần Văn Hoàng (Đội 1)',
  'Nguyễn Quốc Tuấn (Đội 2)',
  'Lê Thị Mai (Đội 3)',
  'Phạm Minh Đức (Đội 1)',
];

export const LEAD_SOURCES: LeadSource[] = [
  'Facebook Lead Ads',
  'TikTok Lead Gen',
  'Google Ads Form',
  'Zalo OA Form',
  'Website GGBingoVN',
  'Hotline Zalo',
  'Referral / Giới Thiệu',
  'Event / Hội Thảo',
];

/** Next lead code in the `LD-####` sequence. */
export function nextLeadCode(existing: Lead[]): string {
  const highest = existing.reduce((max, l) => {
    const n = Number(l.lead_code.replace(/\D/g, ''));
    return Number.isFinite(n) && n > max ? n : max;
  }, 1028);
  return `LD-${highest + 1}`;
}

/** Digits only, so `0912 345 678` and `0912345678` count as the same number. */
export function normalisePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
