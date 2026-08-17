'use client';

import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export interface ModuleRailItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeVariant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo' | 'orange';
  icon: LucideIcon;
  description?: string;
}

export interface ModuleRailSection {
  title?: string;
  items: ModuleRailItem[];
}

export interface ModuleLayoutWithRailProps {
  sections: ModuleRailSection[];
  activeId: string;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  railTitle?: string;
  railSubtitle?: string;
  className?: string;
}

const BADGE_VARIANTS = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
};

export function ModuleLayoutWithRail({
  sections,
  activeId,
  onSelect,
  children,
  railTitle = 'Nghiệp Vụ Chuyên Sâu',
  railSubtitle,
  className,
}: ModuleLayoutWithRailProps) {
  return (
    <div className={clsx('grid grid-cols-1 lg:grid-cols-12 gap-5 items-start', className)}>
      {/* LEFT FUNCTIONAL RAIL */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-3 sm:p-4 space-y-4">
        {(railTitle || railSubtitle) && (
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 px-1">
            {railTitle && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {railTitle}
              </h3>
            )}
            {railSubtitle && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                {railSubtitle}
              </p>
            )}
          </div>
        )}

        <nav className="space-y-4" aria-label="Menu nghiệp vụ phân hệ">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 py-1">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeId === item.id;
                  const badgeColor = item.badgeVariant || 'slate';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={clsx(
                        'w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all text-left group',
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold border border-purple-200 dark:border-purple-800 shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={clsx(
                            'p-1.5 rounded-md transition-colors shrink-0',
                            isActive
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 truncate">
                          <p className="truncate leading-tight">{item.label}</p>
                          {item.description && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-normal">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.badge !== undefined && (
                          <span
                            className={clsx(
                              'px-2 py-0.5 rounded-full text-[10px] font-semibold border tabular-nums',
                              BADGE_VARIANTS[badgeColor]
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={clsx(
                            'w-3.5 h-3.5 transition-transform shrink-0',
                            isActive
                              ? 'text-purple-600 dark:text-purple-400 translate-x-0.5'
                              : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500'
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* RIGHT MAIN WORKSPACE PANE */}
      <div className="lg:col-span-9 min-w-0 space-y-5">{children}</div>
    </div>
  );
}
