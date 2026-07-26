import { Lead } from '@/types';

/**
 * Chấm điểm Lead (Lead Scoring) — tính điểm tiềm năng 0..100 từ các yếu tố sẵn có
 * trong dữ liệu Lead: nguồn, ngân sách dự kiến, giai đoạn phễu, độ mới, đã có
 * người phụ trách hay chưa. Không phụ thuộc field `lead_score` sẵn có (đó là điểm
 * nhập tay/ngẫu nhiên) — hàm này tính lại minh bạch, kèm lý do (reasons).
 */

export type LeadTier = 'HOT' | 'WARM' | 'COLD';

export interface LeadScoreResult {
  score: number; // 0..100
  tier: LeadTier;
  reasons: string[];
}

// Trọng số theo nguồn Lead (điểm cộng, tối đa ~30). Nguồn chất lượng cao (giới
// thiệu, sự kiện, form chủ động) được đánh giá cao hơn quảng cáo phủ rộng.
const SOURCE_WEIGHTS: Record<string, number> = {
  'Referral / Giới Thiệu': 30,
  'Event / Hội Thảo': 26,
  'Website GGBingoVN': 24,
  'Zalo OA Form': 22,
  'Google Ads Form': 21,
  'Google Ads': 20,
  'Hotline Zalo': 20,
  'Facebook Lead Ads': 18,
  'TikTok Lead Gen': 18,
  'Facebook Ads': 15,
  'TikTok Ads': 14,
  'Universal Webhook': 12,
  'Bulk Import Excel': 8,
};

const SOURCE_MAX = 30;

// Điểm theo giai đoạn phễu — càng sâu càng cao (tối đa 25). stage_6 (Chốt) cao
// nhất; stage_7 (Thất bại/Tạm dừng) bị hạ thấp vì gần như đã nguội.
const STAGE_POINTS: Record<string, number> = {
  stage_1: 4,
  stage_2: 9,
  stage_3: 14,
  stage_4: 18,
  stage_5: 22,
  stage_6: 25,
  stage_7: 2,
};

const STAGE_MAX = 25;
const BUDGET_MAX = 25;
const RECENCY_MAX = 12;
const OWNER_POINTS = 8;

// Ngưỡng ngân sách (VNĐ) → điểm ngân sách (tối đa 25).
function budgetPoints(budget: number): { points: number; label: string } {
  if (budget >= 300_000_000) return { points: 25, label: '≥ 300 triệu' };
  if (budget >= 200_000_000) return { points: 21, label: '≥ 200 triệu' };
  if (budget >= 150_000_000) return { points: 17, label: '≥ 150 triệu' };
  if (budget >= 100_000_000) return { points: 13, label: '≥ 100 triệu' };
  if (budget >= 50_000_000) return { points: 8, label: '≥ 50 triệu' };
  if (budget > 0) return { points: 4, label: '< 50 triệu' };
  return { points: 0, label: 'chưa xác định' };
}

// Parse chuỗi ngày kiểu '2026-07-23 08:30' hoặc ISO → Date (hoặc null nếu lỗi).
function parseCreatedAt(raw?: string): Date | null {
  if (!raw) return null;
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

// Độ mới: Lead tạo càng gần hiện tại → điểm càng cao (tối đa 12).
function recencyPoints(createdAt?: string): { points: number; label: string } {
  const d = parseCreatedAt(createdAt);
  if (!d) return { points: 0, label: 'không rõ ngày tạo' };
  const days = Math.max(0, (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 3) return { points: 12, label: 'mới trong 3 ngày' };
  if (days <= 7) return { points: 9, label: 'trong tuần qua' };
  if (days <= 14) return { points: 6, label: 'trong 2 tuần' };
  if (days <= 30) return { points: 3, label: 'trong 30 ngày' };
  return { points: 0, label: 'cũ hơn 30 ngày' };
}

// Coi là "đã có người phụ trách" khi có tên sale thực (không rỗng, không placeholder).
export function isLeadAssigned(lead: Pick<Lead, 'assigned_sale_name'>): boolean {
  const name = (lead.assigned_sale_name || '').trim();
  if (!name) return false;
  const lower = name.toLowerCase();
  return !['chưa gán', 'chưa phân bổ', 'unassigned', 'n/a', '-'].includes(lower);
}

/**
 * Tính điểm tổng hợp cho một Lead. Kết quả gồm điểm 0..100, phân hạng (tier) và
 * danh sách lý do để hiển thị tooltip.
 */
export function computeLeadScore(lead: Lead): LeadScoreResult {
  const reasons: string[] = [];

  // 1) Nguồn
  const sourcePts = SOURCE_WEIGHTS[lead.source_name] ?? 10;
  reasons.push(`Nguồn "${lead.source_name}": +${sourcePts}/${SOURCE_MAX}`);

  // 2) Ngân sách
  const budget = budgetPoints(lead.estimated_budget || 0);
  reasons.push(`Ngân sách ${budget.label}: +${budget.points}/${BUDGET_MAX}`);

  // 3) Giai đoạn phễu
  const stagePts = STAGE_POINTS[lead.stage_id] ?? 4;
  reasons.push(`Giai đoạn "${lead.stage_name}": +${stagePts}/${STAGE_MAX}`);

  // 4) Độ mới
  const recency = recencyPoints(lead.created_at);
  reasons.push(`Độ mới (${recency.label}): +${recency.points}/${RECENCY_MAX}`);

  // 5) Đã có người phụ trách
  const assigned = isLeadAssigned(lead);
  const ownerPts = assigned ? OWNER_POINTS : 0;
  reasons.push(
    assigned
      ? `Đã có người phụ trách: +${ownerPts}/${OWNER_POINTS}`
      : `Chưa có người phụ trách: +0/${OWNER_POINTS}`
  );

  const raw = sourcePts + budget.points + stagePts + recency.points + ownerPts;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const tier: LeadTier = score >= 70 ? 'HOT' : score >= 40 ? 'WARM' : 'COLD';

  return { score, tier, reasons };
}

/**
 * Bảng màu (Tailwind class) theo phân hạng — dùng cho badge hiển thị.
 * HOT đỏ, WARM cam, COLD xám. Tông sáng đồng bộ với hệ thống.
 */
export function scoreColor(tier: LeadTier): {
  badge: string;
  dot: string;
  text: string;
  label: string;
} {
  switch (tier) {
    case 'HOT':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        text: 'text-red-600',
        label: 'HOT',
      };
    case 'WARM':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        text: 'text-amber-600',
        label: 'WARM',
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        text: 'text-slate-500',
        label: 'COLD',
      };
  }
}
