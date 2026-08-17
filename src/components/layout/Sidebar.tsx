'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  TrendingUp,
  Briefcase,
  Package,
  Award,
  ShieldCheck,
  UserCog,
  PhoneCall,
  Building2,
  Settings,
  MessageSquare,
  PieChart,
  ShoppingBag,
  ShieldAlert,
  FileText,
  Truck,
  ShoppingCart,
  FileSpreadsheet,
  FolderKanban,
  FileCheck,
  UserPlus,
  Clock,
  X,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Sliders,
} from 'lucide-react';

import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { useBranding } from '@/context/BrandingContext';
import { getFilteredMenuClusters, MenuItemDefinition, SubMenuItemDefinition } from '@/lib/permissions';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  ShoppingBag,
  PieChart,
  FileText,
  Briefcase,
  Package,
  TrendingUp,
  Award,
  UserCog,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Sliders,
  Truck,
  ShoppingCart,
  FileSpreadsheet,
  FolderKanban,
  FileCheck,
  UserPlus,
  Clock,
};

// Role badge color mapping
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-amber-500 text-slate-950',
  DIRECTOR: 'bg-indigo-600 text-white',
  SALES_MANAGER: 'bg-blue-600 text-white',
  SALES_REP: 'bg-sky-600 text-white',
  SALE_EXEC: 'bg-cyan-600 text-white',
  TEAM_LEADER: 'bg-violet-600 text-white',
  CSKH: 'bg-emerald-600 text-white',
  AUDITOR: 'bg-purple-600 text-white',
  HR_MANAGER: 'bg-rose-600 text-white',
};

function SidebarNavigation({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggles } = useModuleToggles();
  const { user, simulatedRole } = useAuth();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';
  const filteredClusters = getFilteredMenuClusters(activeRole, toggles);
  const activeTabParam = searchParams.get('tab');

  // Accordion open/close state for items with subItems
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    '/hrm': true,
    '/documents': true,
    '/proposals': true,
    '/finance': true,
    '/kpis': true,
    '/settings/system': true,
  });

  // Auto-expand parent menu when navigating to its route
  useEffect(() => {
    if (pathname && !expandedKeys[pathname]) {
      setExpandedKeys((prev) => ({ ...prev, [pathname]: true }));
    }
  }, [pathname]);

  const toggleExpand = (href: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedKeys((prev) => ({
      ...prev,
      [href]: prev[href] === undefined ? false : !prev[href],
    }));
  };

  return (
    <nav className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1 flex flex-col gap-3 sleek-scrollbar">
      {filteredClusters.map((cluster) => (
        <div key={cluster.groupKey} className="flex flex-col gap-0.5">
          {/* Cluster Group Title Header */}
          <div className="px-2.5 py-1 flex items-center justify-between">
            <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {cluster.groupName}
            </span>
            <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {cluster.items.length}
            </span>
          </div>

          {/* Group Items */}
          <div className="flex flex-col gap-0.5">
            {cluster.items.map((item: MenuItemDefinition) => {
              const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isPathMatch = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const isHeaderExactActive = pathname === item.href && !activeTabParam;
              const isParentActive = isPathMatch;
              const isExpanded = expandedKeys[item.href] ?? isParentActive;

              return (
                <div key={item.href} className="flex flex-col">
                  {/* MAIN ITEM ROW (HEADER MODULE CHÍNH = BÁO CÁO TỔNG QUAN) */}
                  <div
                    className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      isHeaderExactActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : isParentActive && !hasSubItems
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : isParentActive && hasSubItems
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/70 dark:border-blue-800/50'
                        : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <Link
                      href={item.href}
                      prefetch={true}
                      title={hasSubItems ? `${item.name} - Báo Cáo Tổng Quan` : item.name}
                      onMouseEnter={() => router.prefetch(item.href)}
                      onClick={() => {
                        if (hasSubItems) {
                          setExpandedKeys((prev) => ({ ...prev, [item.href]: true }));
                        }
                        if (onClose && !hasSubItems) onClose();
                      }}
                      className="flex items-center gap-2.5 min-w-0 flex-1 py-0.5"
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isHeaderExactActive || (isParentActive && !hasSubItems)
                            ? 'text-white'
                            : isParentActive && hasSubItems
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>

                    {/* SUB-ITEMS TOGGLE CHEVRON & BADGE */}
                    {hasSubItems ? (
                      <div className="flex items-center gap-1 shrink-0 ml-1.5">
                        <span
                          className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded transition-colors ${
                            isHeaderExactActive
                              ? 'bg-blue-700 text-blue-100'
                              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.subItems!.length}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(item.href, e)}
                          className={`p-1 rounded transition-colors ${
                            isHeaderExactActive
                              ? 'hover:bg-blue-700 text-white'
                              : 'hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                          title={isExpanded ? 'Thu gọn chức năng' : 'Mở rộng chức năng'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      isParentActive && <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0 ml-1" />
                    )}
                  </div>

                  {/* NESTED SUB-ITEMS LIST */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 pl-2.5 border-l-2 border-slate-200/90 dark:border-slate-800/90 flex flex-col gap-0.5 my-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.subItems!.map((sub: SubMenuItemDefinition) => {
                        const isSubActive =
                          pathname === item.href && activeTabParam === sub.tabKey;

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            prefetch={true}
                            onMouseEnter={() => router.prefetch(sub.href)}
                            onClick={() => {
                              if (onClose) onClose();
                            }}
                            className={`group/sub flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11.5px] transition-all ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                                  isSubActive
                                    ? 'bg-white scale-110'
                                    : 'bg-slate-300 dark:bg-slate-600 group-hover/sub:bg-blue-500'
                                }`}
                              />
                              <span className="truncate">{sub.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredClusters.length === 0 && (
        <div className="p-4 text-center text-slate-500 text-xs font-medium">
          <Lock className="w-5 h-5 mx-auto mb-2 text-slate-400" />
          Không có phân hệ nào được phân quyền cho vai trò hiện tại.
        </div>
      )}
    </nav>
  );
}

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { user, simulatedRole } = useAuth();
  const { branding } = useBranding();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`w-[260px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-200/80 dark:border-slate-800 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            {branding.logoType === 'IMAGE' && branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.systemName}
                className="w-[34px] h-[34px] rounded-lg object-contain bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs shrink-0"
              />
            ) : (
              <div
                className={`w-[34px] h-[34px] rounded-lg bg-gradient-to-tr ${
                  branding.logoBgGradient || 'from-blue-600 via-indigo-600 to-purple-600'
                } flex items-center justify-center text-white font-semibold text-sm shadow-xs shrink-0 uppercase`}
              >
                {branding.logoText || 'GG'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight truncate" title={branding.systemName}>
                {branding.systemName || 'GGBingo CRM'}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate" title={branding.tagline}>
                {branding.tagline || 'E-Commerce Platform'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clustered & RBAC Filtered Navigation Wrapped in Suspense */}
        <Suspense fallback={<div className="flex-1 p-4 text-xs text-slate-400">Đang tải danh mục...</div>}>
          <SidebarNavigation onClose={onClose} />
        </Suspense>

        {/* User Footer */}
        <div className="px-3.5 py-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-850">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user ? user.name : 'Super Admin GGBingo'}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {activeRole} · Trực tuyến
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
