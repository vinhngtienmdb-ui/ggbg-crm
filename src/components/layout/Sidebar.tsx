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
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { name: 'Tổng Quan Hệ Thống', href: '/', icon: LayoutDashboard },
  { name: 'Quản Lý Khách Hàng', href: '/customers', icon: Users },
  { name: 'Quản Lý Lead & Phễu', href: '/leads', icon: UserCheck },
  { name: 'Live Chat CSKH Đa Kênh', href: '/chat', icon: MessageSquare },
  { name: 'Báo Cáo Tài Chính', href: '/finance', icon: PieChart },
  { name: 'Quản Lý Nhân Sự', href: '/hrm', icon: Briefcase },
  { name: 'Sản Phẩm & Dịch Vụ', href: '/products', icon: Package },
  { name: 'Quản Lý KPIs', href: '/kpis', icon: TrendingUp },
  { name: 'Chấm Điểm Hiệu Suất', href: '/performance', icon: Award },
  { name: 'Đánh Giá 360°', href: '/reviews', icon: Users },
  { name: 'Quản Lý Tài Khoản', href: '/settings/users', icon: UserCog },
  { name: 'Phân Quyền Truy Cập', href: '/settings/rbac', icon: ShieldCheck },
  { name: 'Cấu Hình Hệ Thống', href: '/settings/system', icon: Settings },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`w-64 bg-[#090d16] text-slate-300 flex flex-col h-screen fixed md:sticky top-0 border-r border-slate-800/80 shadow-xl z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              GG
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight flex items-center gap-1">
                GGBingo CRM
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Platform</p>
            </div>
          </div>

          <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Scope Badge */}
        <div className="mx-3 my-3 p-2.5 rounded-md bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-white truncate text-[11px]">Vận hành TMĐT & GGBingoVN</p>
            <p className="text-[10px] text-slate-400">Shopee, TikTok, Lazada, Amazon</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto sleek-scrollbar">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Phân Hệ Chức Năng
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
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
                className={`flex items-center justify-between px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Telephony Status */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tổng đài cuộc gọi sẵn sàng
            </span>
          </div>
          <button className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700/60">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Mở bàn phím cuộc gọi
          </button>
        </div>

        {/* User Footer */}
        <div className="p-3.5 border-t border-slate-800/80 flex items-center gap-2.5 bg-[#090d16]">
          <div className="w-8 h-8 rounded-md bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shadow-xs">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Super Admin</p>
            <p className="text-[10px] text-amber-400 font-semibold truncate">Quản trị tối cao</p>
          </div>
        </div>
      </aside>
    </>
  );
}
