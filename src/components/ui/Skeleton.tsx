import React from 'react';
import { clsx } from 'clsx';

/**
 * Skeleton loading primitives.
 * Usage:
 *   <Skeleton className="h-4 w-32" />
 *   <SkeletonCard />
 *   <SkeletonTable rows={5} cols={4} />
 */

interface SkeletonProps {
  className?: string;
}

// ── Base Skeleton ────────────────────────────────────────────────────────────
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700/70 rounded', className)}
      aria-hidden="true"
    />
  );
}

// ── Metric Card Skeleton ─────────────────────────────────────────────────────
export function SkeletonMetricCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-36 mb-3" />
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// ── Table Skeleton ────────────────────────────────────────────────────────────
interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonTable({ rows = 5, cols = 5 }: SkeletonTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-3 ${i === 0 ? 'w-32' : 'w-20'}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="px-4 py-3 flex gap-4 items-center border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton
              key={col}
              className={`h-3.5 ${col === 0 ? 'w-40' : col === cols - 1 ? 'w-16 rounded-full' : 'w-24'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Page Skeleton (full-page loading state) ────────────────────────────────
export function SkeletonPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-200" aria-label="Đang tải...">
      {/* Header banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonMetricCard key={i} />)}
      </div>

      {/* Content */}
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}

// ── List Item Skeleton ────────────────────────────────────────────────────────
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}
