/**
 * Presentation helpers shared by every CRM screen.
 *
 * Each colour pair is `[background, foreground]` and maps 1:1 to the approved
 * redesign, so a Gold tier chip looks identical whether it is rendered in the
 * customers table, the dashboard leaderboard or the 360° drawer.
 */
import {
  CustomerTier,
  EcomPlatform,
  KycStatus,
  RatingGrade,
  EmployeeProfile,
  UserRole,
} from '@/types';

export type ChipColors = { bg: string; fg: string };

const chip = (bg: string, fg: string): ChipColors => ({ bg, fg });

/* -------------------------------------------------------------------------- */
/* Numbers                                                                    */
/* -------------------------------------------------------------------------- */

/** Short money label: `3,48 tỷ ₫` · `450 tr ₫` · `75.000 ₫`. */
export function fmtCompact(n: number): string {
  if (!Number.isFinite(n)) return '0 ₫';
  if (n >= 1e9) return `${(Math.round(n / 1e7) / 100).toLocaleString('vi-VN')} tỷ ₫`;
  if (n >= 1e6) return `${Math.round(n / 1e6).toLocaleString('vi-VN')} tr ₫`;
  return `${(n || 0).toLocaleString('vi-VN')} ₫`;
}

/** Full money label with thousands separators: `620.000.000 ₫`. */
export function fmtVnd(n: number): string {
  return `${(n || 0).toLocaleString('vi-VN')} ₫`;
}

/** Format a KPI/target value, respecting non-currency units (`50 Gian Hàng`). */
export function fmtByUnit(value: number, unit: string): string {
  return unit === 'VND' ? fmtCompact(value) : `${value.toLocaleString('vi-VN')} ${unit}`;
}

/* -------------------------------------------------------------------------- */
/* Identity                                                                   */
/* -------------------------------------------------------------------------- */

/** First + last initial, ignoring any parenthesised role suffix. */
export function initials(source?: string): string {
  const parts = (source || '?').replace(/[()]/g, '').trim().split(/\s+/);
  return ((parts[0] || '')[0] || '') + ((parts[parts.length - 1] || '')[0] || '');
}

const AVATAR_COLORS = ['#2E5CE6', '#7C3AED', '#0891B2', '#D97706', '#059669', '#DB2777'];

/** Deterministic avatar colour so the same person keeps the same swatch. */
export function avatarColor(source?: string): string {
  let hash = 0;
  for (const ch of source || '') hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** Drop the `(Sale Exec)` style suffix for tight columns. */
export function shortName(fullName?: string): string {
  return (fullName || '—').split(' (')[0];
}

/* -------------------------------------------------------------------------- */
/* PII masking                                                                */
/* -------------------------------------------------------------------------- */

export function maskPhone(phone?: string): string {
  if (!phone) return '—';
  const digits = phone.replace(/\s/g, '');
  if (digits.length < 7) return digits;
  return `${digits.slice(0, 4)} *** ${digits.slice(-3)}`;
}

export function maskLegalId(value?: string): string {
  if (!value) return '—';
  if (value.length < 7) return value;
  return `${value.slice(0, 3)}******${value.slice(-3)}`;
}

/* -------------------------------------------------------------------------- */
/* Chip palettes                                                              */
/* -------------------------------------------------------------------------- */

export const TIER_CHIP: Record<CustomerTier, ChipColors> = {
  VIP: chip('#FDF3E7', '#B25E09'),
  Gold: chip('#FBF3D9', '#8F6B08'),
  Silver: chip('#EEF0F4', '#5B657F'),
  Standard: chip('#F0F1F4', '#3A414E'),
};

export const PLATFORM_CHIP: Record<EcomPlatform, ChipColors & { label: string }> = {
  Shopee: { ...chip('#FDEBE5', '#D14415'), label: 'Shopee' },
  TikTokShop: { ...chip('#F0F1F4', '#16181D'), label: 'TikTok' },
  Lazada: { ...chip('#E8ECFB', '#1D3EA8'), label: 'Lazada' },
  Amazon: { ...chip('#FDF3E7', '#B25E09'), label: 'Amazon' },
  GGBingoVN: { ...chip('#E4F6F8', '#0E7490'), label: 'GGBingoVN' },
};

export const GRADE_CHIP: Record<RatingGrade, ChipColors> = {
  S: chip('#F4F1FE', '#6D3FD4'),
  A: chip('#EEF4EE', '#1F7A33'),
  B: chip('#E8ECFB', '#2E5CE6'),
  C: chip('#FDF3E7', '#B25E09'),
  D: chip('#FDEEEE', '#C22F35'),
};

export const KYC_CHIP: Record<KycStatus, ChipColors & { label: string }> = {
  VERIFIED: { ...chip('#EEF4EE', '#1F7A33'), label: 'Đã xác minh' },
  PENDING: { ...chip('#FDF3E7', '#B25E09'), label: 'Chờ duyệt' },
  REJECTED: { ...chip('#FDEEEE', '#C22F35'), label: 'Từ chối' },
};

export const EMPLOYEE_STATUS_CHIP: Record<EmployeeProfile['status'], ChipColors & { label: string }> = {
  Active: { ...chip('#EEF4EE', '#1F7A33'), label: 'Đang làm việc' },
  Probation: { ...chip('#E8ECFB', '#2E5CE6'), label: 'Thử việc' },
  Applicant: { ...chip('#FDF3E7', '#B25E09'), label: 'Ứng viên' },
  Pending_Resign: { ...chip('#FDF3E7', '#B25E09'), label: 'Chờ nghỉ việc' },
  Resigned: { ...chip('#F0F1F4', '#5B657F'), label: 'Nghỉ việc' },
  Suspended: { ...chip('#FDEEEE', '#C22F35'), label: 'Đình chỉ' },
};

export const ROLE_CHIP: Record<string, ChipColors> = {
  SUPER_ADMIN: chip('#1D46C4', '#FFFFFF'),
  DIRECTOR: chip('#F4F1FE', '#6D3FD4'),
  SALES_MANAGER: chip('#E8ECFB', '#2E5CE6'),
  TEAM_LEADER: chip('#E4F6F8', '#0E7490'),
  SALE_EXEC: chip('#EEF4EE', '#1F7A33'),
  SALES_REP: chip('#EEF4EE', '#1F7A33'),
  CSKH: chip('#E4F6F8', '#0E7490'),
  AUDITOR: chip('#F4F1FE', '#6D3FD4'),
  HR_MANAGER: chip('#FDF3E7', '#B25E09'),
};

export function roleChip(role: UserRole | string): ChipColors {
  return ROLE_CHIP[role] ?? chip('#F0F1F4', '#3A414E');
}

export const SCOPE_CHIP: Record<string, ChipColors & { label: string }> = {
  ALL_COMPANY: { ...chip('#1D46C4', '#FFFFFF'), label: 'Toàn công ty' },
  DEPARTMENT: { ...chip('#E8ECFB', '#2E5CE6'), label: 'Phòng ban' },
  TEAM: { ...chip('#E4F6F8', '#0E7490'), label: 'Team' },
  OWNER_ONLY: { ...chip('#EEF4EE', '#1F7A33'), label: 'Cá nhân' },
};

export const LIFECYCLE_LABEL: Record<string, string> = {
  ALL: 'Tất cả',
  VIP: 'VIP',
  Regular: 'Thường xuyên',
  Prospect: 'Tiềm năng',
  'At-Risk': 'Nguy cơ rời bỏ',
  Churned: 'Đã rời bỏ',
};

/* -------------------------------------------------------------------------- */
/* Scores                                                                     */
/* -------------------------------------------------------------------------- */

/** Green ≥ 75, amber ≥ 50, red below — used for customer health bars. */
export function healthColor(score: number): string {
  if (score >= 75) return '#1F7A33';
  if (score >= 50) return '#B25E09';
  return '#C22F35';
}

/** Lead score chip: green ≥ 85, cobalt ≥ 70, amber below. */
export function leadScoreChip(score: number): ChipColors {
  if (score >= 85) return chip('#EEF4EE', '#1F7A33');
  if (score >= 70) return chip('#E8ECFB', '#2E5CE6');
  return chip('#FDF3E7', '#B25E09');
}

/** KPI progress colour: green at target, cobalt when close, amber when behind. */
export function progressColor(pct: number): string {
  if (pct >= 100) return '#1F7A33';
  if (pct >= 85) return '#2E5CE6';
  return '#B25E09';
}

/* -------------------------------------------------------------------------- */
/* Pipeline                                                                   */
/* -------------------------------------------------------------------------- */

export interface StageDef {
  n: number;
  id: string;
  name: string;
  color: string;
}

/** The 7-step sales funnel, in order. */
export const PIPELINE_STAGES: StageDef[] = [
  { n: 1, id: 'stage_1', name: '1. Lead mới', color: '#2E5CE6' },
  { n: 2, id: 'stage_2', name: '2. Khảo Sát Gian Hàng', color: '#7C3AED' },
  { n: 3, id: 'stage_3', name: '3. Báo Giá', color: '#0891B2' },
  { n: 4, id: 'stage_4', name: '4. Đàm Phán HĐ', color: '#D97706' },
  { n: 5, id: 'stage_5', name: '5. Chốt Hợp Đồng', color: '#059669' },
  { n: 6, id: 'stage_6', name: '6. Khởi Tạo Vận Hành', color: '#DB2777' },
  { n: 7, id: 'stage_7', name: '7. Tái Chăm Sóc', color: '#64748B' },
];

export function stageById(stageId: string): StageDef {
  return PIPELINE_STAGES.find((s) => s.id === stageId) ?? PIPELINE_STAGES[0];
}
