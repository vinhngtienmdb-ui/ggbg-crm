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
  X,
  Lock,
  Sparkles
} from 'lucide-react';

import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { getFilteredMenuClusters, MenuItemDefinition } from '@/lib/permissions';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
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
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggles } = useModuleToggles();
  const { user, simulatedRole } = useAuth();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';
  const filteredClusters = getFilteredMenuClusters(activeRole, toggles);

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
        className={`w-[255px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-200/80 dark:border-slate-800 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 pt-[18px] pb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-600/20">
              GG
            </div>
            <div>
              <h1 className="font-black text-purple-700 dark:text-purple-400 text-sm tracking-tight leading-tight flex items-center gap-1">
                GGBingo CRM <Sparkles className="w-3 h-3 text-amber-400" />
              </h1>
              <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-bold uppercase tracking-[0.6px]">Enterprise Platform</p>
            </div>
          </div>

          <button onClick={onClose} className="md:hidden p-1.5 text-slate-400 hover:text-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Scope Badge */}
        <div className="mx-3 mb-2.5 px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 flex flex-col gap-0.5">
          <span className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 truncate">Vận hành TMĐT & GGBingoVN</span>
          <span className="text-[10px] text-purple-700/80 dark:text-purple-400/80 font-medium truncate">Shopee · TikTok · Lazada · Amazon</span>
        </div>

        {/* Clustered & RBAC Filtered Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1 flex flex-col gap-3 sleek-scrollbar">
          {filteredClusters.map((cluster) => (
            <div key={cluster.groupKey} className="flex flex-col gap-0.5">
              {/* Cluster Group Title Header */}
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-purple-600/90 dark:text-purple-400/90 uppercase tracking-[1px]">
                  {cluster.groupName}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                  {cluster.items.length}
                </span>
              </div>

              {/* Group Items */}
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
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/30'
                          : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-700 dark:hover:text-purple-300'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                        }`}
                      />
                      <span className="flex-1 truncate">{item.name}</span>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
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
              Không có phân hệ nào được phân quyền cho vai trò hiện tại.
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="px-3.5 py-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-850">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0 shadow-xs">
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user ? user.name : 'Super Admin GGBingo'}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {activeRole} · Trực tuyến
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
