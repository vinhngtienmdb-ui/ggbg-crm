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
  Building2,
  Settings,
  MessageSquare,
  PieChart,
  ShoppingBag,
  ShieldAlert,
  FileText,
  MapPin,
  X,
  Lock,
} from 'lucide-react';
import { useModuleToggles } from '@/context/ModuleToggleContext';
import { useAuth } from '@/context/AuthContext';
import { getFilteredMenuClusters, MenuItemDefinition } from '@/lib/permissions';
import { INITIAL_CHAT_CONVERSATIONS } from '@/lib/chatStore';
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
  MapPin,
};

const UNREAD_CHATS = INITIAL_CHAT_CONVERSATIONS.reduce((sum, c) => sum + c.unread_count, 0);

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toggles } = useModuleToggles();
  const { user, simulatedRole } = useAuth();

  const activeRole = simulatedRole || user?.role || 'SUPER_ADMIN';
  const filteredClusters = getFilteredMenuClusters(activeRole, toggles);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-[#0b1020]/60 transition-opacity animate-fadeUpFast"
        />
      )}

      <aside
        className={`w-[250px] shrink-0 bg-white text-brand-600 flex flex-col h-screen fixed md:sticky top-0 border-r border-line z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 pt-[18px] pb-3.5">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-brand-600 to-plum-deep flex items-center justify-center text-white font-extrabold text-[13px] shrink-0">
            GG
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-brand-800 font-bold text-sm tracking-[-0.2px] truncate">GGBingo CRM</h1>
            <p className="text-[10px] text-brand-400 font-semibold tracking-[0.6px] uppercase">
              Enterprise Platform
            </p>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-brand-400 hover:text-brand-800 rounded-lg hover:bg-brand-50"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business scope */}
        <div className="mx-3 mb-2.5 px-[11px] py-[9px] rounded-[9px] bg-brand-50 border border-brand-100 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-brand-800 truncate">Vận hành TMĐT &amp; GGBingoVN</p>
            <p className="text-[10px] text-brand-600 truncate">Shopee · TikTok · Lazada · Amazon</p>
          </div>
        </div>

        {/* Clustered, RBAC-filtered navigation */}
        <nav className="flex-1 px-2.5 pt-1 pb-2.5 space-y-3.5 overflow-y-auto sleek-scrollbar">
          {filteredClusters.map((cluster) => (
            <div key={cluster.groupKey} className="space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-extrabold text-brand-400 uppercase tracking-[1px]">
                {cluster.groupName}
              </div>

              {cluster.items.map((item: MenuItemDefinition) => {
                const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                const isActive = pathname === item.href;
                const badge = item.href === '/chat' && UNREAD_CHATS > 0 ? UNREAD_CHATS : null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onMouseEnter={() => router.prefetch(item.href)}
                    onClick={() => onClose?.()}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] transition-colors active:scale-[0.99] ${
                      isActive
                        ? 'bg-brand-600 text-white font-extrabold'
                        : 'text-brand-600 font-medium hover:bg-brand-50 hover:text-brand-800'
                    }`}
                  >
                    <Icon className="w-[15px] h-[15px] shrink-0" />
                    <span className="flex-1 truncate">{item.name}</span>
                    {badge && (
                      <span
                        className={`min-w-[16px] px-[5px] py-px rounded-full text-[10px] font-bold text-center ${
                          isActive ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {filteredClusters.length === 0 && (
            <div className="p-4 text-center text-ink-500 text-xs font-semibold">
              <Lock className="w-6 h-6 mx-auto mb-2 text-ink-400" />
              Không có phân hệ nào được phân quyền cho vai trò hiện tại.
            </div>
          )}
        </nav>

        {/* Signed-in user */}
        <div className="px-3.5 py-3 border-t border-line flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0">
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-brand-800 truncate">{user ? user.name : 'Super Admin GGBingo'}</p>
            <p className="text-[10px] text-success-fg font-semibold truncate">● {activeRole} · Trực tuyến</p>
          </div>
        </div>
      </aside>
    </>
  );
}
