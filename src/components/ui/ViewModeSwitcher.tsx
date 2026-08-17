'use client';

import React from 'react';
import { Table, LayoutGrid, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';

export type ViewMode = 'list' | 'kanban' | 'insights';

export interface ViewModeSwitcherProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  showInsights?: boolean;
  listLabel?: string;
  kanbanLabel?: string;
  insightsLabel?: string;
  className?: string;
}

export function ViewModeSwitcher({
  currentMode,
  onChange,
  showInsights = false,
  listLabel = 'Danh Sách',
  kanbanLabel = 'Bảng Phễu',
  insightsLabel = 'Thống Kê',
  className,
}: ViewModeSwitcherProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs font-medium select-none',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange('list')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all',
          currentMode === 'list'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        )}
      >
        <Table className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>{listLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('kanban')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all',
          currentMode === 'kanban'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        )}
      >
        <LayoutGrid className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
        <span>{kanbanLabel}</span>
      </button>

      {showInsights && (
        <button
          type="button"
          onClick={() => onChange('insights')}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all',
            currentMode === 'insights'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{insightsLabel}</span>
        </button>
      )}
    </div>
  );
}
