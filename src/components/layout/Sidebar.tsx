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
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`w-[250px] bg-white text-slate-700 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-200 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 pt-[18px] pb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-[13px] shadow-sm">
              GG
            </div>
            <div>
              <h1 className="font-bold text-blue-700 text-sm tracking-tight leading-tight">GGBingo CRM</h1>
              <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-[0.6px]">Enterprise Platform</p>
            </div>
          </div>

          <button onClick={onClose} className="md:hidden p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Scope Badge */}
        <div className="mx-3 mb-2.5 px-[11px] py-[9px] rounded-[9px] bg-blue-50 border border-blue-100 flex flex-col gap-px">
          <span className="text-[11px] font-bold text-blue-700 truncate">Vận hành TMĐT & GGBingoVN</span>
          <span className="text-[10px] text-blue-400 truncate">Shopee · TikTok · Lazada · Amazon</span>
        </div>

        {/* Clustered & RBAC Filtered Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1 flex flex-col gap-3.5 sleek-scrollbar">
          {filteredClusters.map((cluster) => (
            <div key={cluster.groupKey} className="flex flex-col gap-0.5">
              {/* Cluster Group Title Header */}
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-[1px]">
                  {cluster.groupName}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
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
                      className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] transition-all active:scale-[0.99] ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600" />
                      )}
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                        }`}
                      />
                      <span className="flex-1 truncate">{item.name}</span>
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

        {/* Telephony Status */}
        <div className="px-3 py-2.5 border-t border-slate-200">
          <button className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-emerald-100 active:scale-[0.99]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            Mở bàn phím cuộc gọi
          </button>
        </div>

        {/* User Footer */}
        <div className="px-3.5 py-3 border-t border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0">
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-blue-700 truncate">{user ? user.name : 'Super Admin GGBingo'}</p>
            <p className="text-[10px] text-emerald-600 font-semibold truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {activeRole} · Trực tuyến
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
