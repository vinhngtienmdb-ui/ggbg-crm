'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Sparkles,
} from 'lucide-react';

import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { getFilteredMenuClusters, MenuItemDefinition } from '@/lib/permissions';

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

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggles } = useModuleToggles();
  const { user, simulatedRole } = useAuth();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';
  const filteredClusters = getFilteredMenuClusters(activeRole, toggles);
  const avatarInitials = user ? user.username.substring(0, 2).toUpperCase() : 'SA';
  const roleColor = ROLE_COLORS[activeRole] || 'bg-indigo-600 text-white';

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
        className={`
          ${isCollapsed ? 'w-[64px]' : 'w-[255px]'}
          bg-white dark:bg-slate-900
          text-slate-700 dark:text-slate-200
          flex flex-col h-screen
          fixed md:sticky top-0
          border-r border-slate-200/80 dark:border-slate-800
          z-50
          transition-all duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-hidden
        `}
      >
        {/* ── Brand Header ── */}
        <div className={`px-4 pt-[18px] pb-3.5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-[34px] h-[34px] shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                GG
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight truncate">
                  GGBingo CRM
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-[0.5px]">
                  Enterprise Platform
                </p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-[34px] h-[34px] rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
              GG
            </div>
          )}

          {/* Mobile close / Desktop collapse toggle */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Business Scope Badge (hidden when collapsed) ── */}
        {!isCollapsed && (
          <div className="mx-3 mb-2.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-0.5 transition-opacity duration-200">
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
              Vận hành TMĐT & GGBingoVN
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">
              Shopee · TikTok · Lazada · Amazon
            </span>
          </div>
        )}

        {/* ── Clustered RBAC Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 pt-1 flex flex-col gap-2 sleek-scrollbar">
          {filteredClusters.map((cluster) => (
            <div key={cluster.groupKey} className="flex flex-col gap-0.5">
              {/* Group Title (hidden when collapsed) */}
              {!isCollapsed && (
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.8px]">
                    {cluster.groupName}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {cluster.items.length}
                  </span>
                </div>
              )}

              {/* Separator line when collapsed */}
              {isCollapsed && (
                <div className="mx-2 my-1 h-px bg-slate-100 dark:bg-slate-800" />
              )}

              {/* Menu Items */}
              <div className="flex flex-col gap-0.5">
                {cluster.items.map((item: MenuItemDefinition) => {
                  const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onMouseEnter={() => router.prefetch(item.href)}
                      onClick={() => { if (onClose) onClose(); }}
                      title={isCollapsed ? item.name : undefined}
                      aria-label={item.name}
                      className={`
                        group relative flex items-center gap-2.5
                        ${isCollapsed ? 'px-0 justify-center py-2.5' : 'px-3 py-2'}
                        rounded-lg text-[12.5px] transition-all duration-150
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40'
                          : 'text-slate-700 dark:text-slate-300 font-normal hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                        }
                      `}
                    >
                      {/* Active left accent bar */}
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-r-full" />
                      )}

                      <Icon
                        className={`shrink-0 transition-colors ${
                          isCollapsed ? 'w-5 h-5' : 'w-[17px] h-[17px]'
                        } ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}

                      {isActive && !isCollapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                      )}

                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <div className="
                          absolute left-full ml-2.5 px-2.5 py-1.5
                          bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium
                          rounded-lg shadow-lg whitespace-nowrap
                          pointer-events-none z-50
                          opacity-0 group-hover:opacity-100
                          translate-x-1 group-hover:translate-x-0
                          transition-all duration-150
                        ">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 -left-1 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredClusters.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-xs font-semibold">
              <Lock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              {!isCollapsed && 'Không có phân hệ nào được phân quyền cho vai trò hiện tại.'}
            </div>
          )}
        </nav>

        {/* ── Collapse Toggle Button (desktop only) ── */}
        <div className="hidden md:flex items-center justify-end px-2 py-1.5 border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* ── User Footer ── */}
        <div
          className={`
            border-t border-slate-200/80 dark:border-slate-800
            bg-slate-50/60 dark:bg-slate-900/60
            flex items-center gap-2.5
            transition-all duration-300
            ${isCollapsed ? 'px-0 py-3 justify-center' : 'px-3.5 py-3'}
          `}
        >
          <div
            className={`w-8 h-8 rounded-xl ${roleColor} font-extrabold flex items-center justify-center text-[11px] shrink-0 shadow-sm`}
            title={`${user ? user.name : 'Super Admin'} — ${activeRole}`}
          >
            {avatarInitials}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user ? user.name : 'Super Admin GGBingo'}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                {activeRole} · Trực tuyến
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
