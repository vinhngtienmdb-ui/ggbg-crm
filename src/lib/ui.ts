/**
 * GGBingo CRM — UI helper utilities
 * Centralized semantic color tokens, status maps, và các helper UI dùng lại toàn app.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── cn() — Tailwind class merger (clsx + twMerge) ───────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Status → Badge variant map ────────────────────────────────────────────────
export type StatusType =
  | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected'
  | 'vip' | 'regular' | 'prospect' | 'at_risk' | 'churned'
  | 'running' | 'paused' | 'completed' | 'draft'
  | 'online' | 'offline' | 'busy';

export const STATUS_BADGE: Record<StatusType, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'purple' | 'default' }> = {
  active:    { label: 'Hoạt động',    variant: 'success' },
  inactive:  { label: 'Không hoạt động', variant: 'default' },
  pending:   { label: 'Chờ xử lý',    variant: 'warning' },
  approved:  { label: 'Đã duyệt',     variant: 'success' },
  rejected:  { label: 'Từ chối',      variant: 'danger' },
  vip:       { label: 'VIP',          variant: 'primary' },
  regular:   { label: 'Thường',       variant: 'default' },
  prospect:  { label: 'Tiềm năng',    variant: 'info' },
  at_risk:   { label: 'Nguy cơ',      variant: 'warning' },
  churned:   { label: 'Đã rời bỏ',    variant: 'danger' },
  running:   { label: 'Đang chạy',    variant: 'success' },
  paused:    { label: 'Tạm dừng',     variant: 'warning' },
  completed: { label: 'Hoàn thành',   variant: 'success' },
  draft:     { label: 'Bản nháp',     variant: 'default' },
  online:    { label: 'Trực tuyến',   variant: 'success' },
  offline:   { label: 'Ngoại tuyến',  variant: 'default' },
  busy:      { label: 'Đang bận',     variant: 'warning' },
};

// ── Avatar initials & color ────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  'bg-indigo-600 text-white',
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-500 text-slate-900',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
  'bg-purple-600 text-white',
];

/**
 * Deterministic color from a string (e.g., user name or ID).
 * Same string always returns same color — no flicker on re-render.
 */
export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/** Generate initials from full name: "Nguyễn Văn A" → "NV" */
export function getInitials(name: string, maxChars = 2): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, maxChars).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Number formatting ─────────────────────────────────────────────────────────
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
const COMPACT = new Intl.NumberFormat('vi-VN', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 });

/** 3480000000 → "3.480.000.000 ₫" */
export function formatVND(value: number): string {
  return VND.format(value);
}

/** 3480000000 → "3,5 T" (tỷ) */
export function formatCompact(value: number): string {
  return COMPACT.format(value);
}

/** 0.185 → "18.5%" */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ── Date/Time formatting ───────────────────────────────────────────────────────
const DATE_FMT = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATETIME_FMT = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function formatDate(date: string | Date): string {
  return DATE_FMT.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatDateTime(date: string | Date): string {
  return DATETIME_FMT.format(typeof date === 'string' ? new Date(date) : date);
}

/** "2 giờ trước", "3 ngày trước" */
export function timeAgo(date: string | Date): string {
  const ms = Date.now() - (typeof date === 'string' ? new Date(date) : date).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return 'Vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w} tuần trước`;
  return formatDate(date);
}

// ── Skeleton class helper ──────────────────────────────────────────────────────
/** Returns skeleton pulse class string */
export const skeleton = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';
