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
  ChevronRight,
  Building2,
  Settings,
  MessageSquare,
  PieChart,
  ShoppingBag,
  ShieldAlert,
  FileText,
  X,
  Layers,
  Lock
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
          className="md:hidden fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`w-64 bg-[#090d16] text-slate-300 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-800/80 shadow-2xl z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
              GG
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight flex items-center gap-1">
                GGBingo CRM
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Platform</p>
            </div>
          </div>

          <button onClick={onClose} className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Scope Badge */}
        <div className="mx-3 my-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="text-xs min-w-0">
            <p className="font-semibold text-white truncate text-[11px]">Vận hành TMĐT & GGBingoVN</p>
            <p className="text-[10px] text-slate-400 truncate">Shopee, TikTok, Lazada, Amazon</p>
          </div>
        </div>

        {/* Clustered & RBAC Filtered Navigation */}
        <nav className="flex-1 px-2.5 py-2 space-y-4 overflow-y-auto sleek-scrollbar">
          {filteredClusters.map((cluster) => (
            <div key={cluster.groupKey} className="space-y-1">
              {/* Cluster Group Title Header */}
              <div className="px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-blue-400/80" />
                  {cluster.groupName}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-full border border-slate-700/50">
                  {cluster.items.length}
                </span>
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
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
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                          : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredClusters.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-xs font-semibold">
              <Lock className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              Không có phân hệ nào được phân quyền cho vai trò hiện tại.
            </div>
          )}
        </nav>

        {/* Telephony Status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tổng đài sẵn sàng
            </span>
          </div>
          <button className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700/60 active:scale-95">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Mở bàn phím cuộc gọi
          </button>
        </div>

        {/* User Footer with Simulated Role Indicator */}
        <div className="p-3 border-t border-slate-800/80 flex items-center gap-2.5 bg-[#090d16]">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shrink-0">
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user ? user.name : 'Super Admin'}</p>
            <p className="text-[10px] text-blue-400 font-semibold truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {activeRole}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
