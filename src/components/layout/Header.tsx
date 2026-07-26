'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  PhoneCall,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Menu,
  Maximize2,
  Minimize2,
  Crown,
  Briefcase,
  Headphones,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { getPageMeta, CURRENT_PERIOD } from '@/lib/pageMeta';

interface HeaderProps {
  onOpenPhoneModal?: () => void;
  onToggleMobileSidebar?: () => void;
}

const ROLE_OPTIONS: { id: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
  { id: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5 text-warn-fg" />, badgeColor: 'bg-brand-600 text-white' },
  { id: 'SALES_MANAGER', label: 'Sales Manager', icon: <Briefcase className="w-3.5 h-3.5 text-brand-600" />, badgeColor: 'bg-brand-600 text-white' },
  { id: 'SALES_REP', label: 'Sales Rep', icon: <Briefcase className="w-3.5 h-3.5 text-plum-fg" />, badgeColor: 'bg-plum-fg text-white' },
  { id: 'CSKH', label: 'CSKH Specialist', icon: <Headphones className="w-3.5 h-3.5 text-success-fg" />, badgeColor: 'bg-success-fg text-white' },
  { id: 'AUDITOR', label: 'System Auditor', icon: <FileCheck className="w-3.5 h-3.5 text-aqua-fg" />, badgeColor: 'bg-aqua-fg text-white' },
];

export default function Header({ onOpenPhoneModal, onToggleMobileSidebar }: HeaderProps) {
  const [unreadCount] = useState(5);
  const pathname = usePathname();
  const { user, logout, simulatedRole, setSimulatedRole } = useAuth();
  const { densityMode, toggleDensity } = useTheme();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const activeRoleObj = ROLE_OPTIONS.find((r) => r.id === simulatedRole) || ROLE_OPTIONS[0];
  const { title, desc } = getPageMeta(pathname);

  return (
    <header className="h-14 shrink-0 bg-white border-b border-line px-4 sm:px-5 flex items-center gap-3.5 sticky top-0 z-30">
      <button
        onClick={onToggleMobileSidebar}
        className="md:hidden border border-line bg-white rounded-lg px-2.5 py-1.5 text-ink-700 hover:bg-brand-50 transition-colors shrink-0"
        title="Mở menu điều hướng"
      >
        <Menu className="w-[15px] h-[15px]" />
      </button>

      {/* Page identity */}
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[15px] tracking-[-0.2px] text-ink-900 truncate">{title}</div>
        <div className="text-[11px] text-ink-500 truncate">{desc}</div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Telephony status — also the VoIP dial pad entry point */}
        <button
          onClick={onOpenPhoneModal}
          className="inline-flex items-center gap-1.5 px-[11px] py-[5px] rounded-full bg-success-bg border border-success-border text-success-fg text-[11px] font-bold hover:bg-success-hover transition-colors"
          title="Mở bàn phím cuộc gọi VoIP"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success-dot animate-softPulse" />
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tổng đài sẵn sàng</span>
        </button>

        {/* Reporting period the on-screen figures belong to */}
        <span className="hidden lg:inline-block px-[11px] py-[5px] rounded-full bg-plum-bg border border-plum-border text-plum-fg text-[11px] font-bold">
          {CURRENT_PERIOD}
        </span>

        {/* Table density */}
        <button
          onClick={toggleDensity}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white hover:border-line-strong border border-line text-ink-700 transition-colors"
          title="Thay đổi mật độ hiển thị bảng biểu"
        >
          {densityMode === 'comfortable' ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-ink-400" />
              <span>Compact</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Comfortable</span>
            </>
          )}
        </button>

        {/* RBAC role simulator */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:border-line-strong border border-line text-[11px] font-bold text-ink-700 transition-colors"
            title="Mô phỏng vai trò phân quyền hệ thống"
          >
            {activeRoleObj.icon}
            <span className="hidden sm:inline-block">{activeRoleObj.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-cardLg border border-line p-1.5 z-50 animate-fadeUpFast">
              <div className="px-2.5 py-1.5 border-b border-line-soft">
                <p className="text-[10px] font-extrabold text-ink-400 uppercase tracking-wider">
                  Mô phỏng phân quyền (RBAC)
                </p>
              </div>

              <div className="py-1 space-y-0.5">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSimulatedRole(opt.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-[11.5px] font-semibold text-left transition-colors ${
                      simulatedRole === opt.id ? 'bg-brand-600 text-white' : 'hover:bg-brand-50 text-ink-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </span>
                    {simulatedRole === opt.id && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg text-ink-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-danger-dot text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-line" />

        {/* Identity + sign out */}
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-md font-extrabold flex items-center justify-center text-[11px] ${activeRoleObj.badgeColor}`}
          >
            {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-[11.5px] font-bold text-ink-900 leading-none">
              {user ? user.name : 'Super Admin'}
            </p>
            <p className="text-[10px] text-ink-500 font-medium mt-0.5">{activeRoleObj.label}</p>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
