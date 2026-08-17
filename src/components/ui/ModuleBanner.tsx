'use client';

import React from 'react';
import { Sparkles, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export interface ModuleBannerBadge {
  label: string;
  icon?: LucideIcon;
  variant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo' | 'orange';
}

export interface ModuleBannerKPI {
  label: string;
  value: string | number;
  highlight?: string;
  subtext?: string;
}

export interface ModuleBannerProps {
  badge?: ModuleBannerBadge;
  title: string;
  subtitle?: string;
  kpis?: ModuleBannerKPI[];
  actions?: React.ReactNode;
  className?: string;
}

const BADGE_STYLES = {
  blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
  purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
  orange: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
};

export function ModuleBanner({
  badge,
  title,
  subtitle,
  kpis,
  actions,
  className,
}: ModuleBannerProps) {
  const Icon = badge?.icon || Sparkles;
  const badgeColor = badge?.variant || 'blue';

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5',
        className
      )}
    >
      <div className="space-y-1.5 min-w-0 max-w-3xl">
        {badge && (
          <div
            className={clsx(
              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border',
              BADGE_STYLES[badgeColor]
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{badge.label}</span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        {kpis && kpis.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-left min-w-[120px]"
              >
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {kpi.value}
                </p>
                {kpi.subtext && (
                  <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {kpi.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
