'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Bell,
  PhoneCall,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Menu,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Crown,
  Briefcase,
  Headphones,
  FileCheck
} from 'lucide-react';
import { UserRole } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onOpenPhoneModal?: () => void;
  onToggleMobileSidebar?: () => void;
}

const ROLE_OPTIONS: { id: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
  { id: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5 text-amber-500" />, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
  { id: 'SALES_MANAGER', label: 'Sales Manager', icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />, badgeColor: 'bg-blue-600 text-white font-bold' },
  { id: 'SALES_REP', label: 'Sales Rep', icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />, badgeColor: 'bg-indigo-600 text-white font-bold' },
  { id: 'CSKH', label: 'CSKH Specialist', icon: <Headphones className="w-3.5 h-3.5 text-emerald-500" />, badgeColor: 'bg-emerald-600 text-white font-bold' },
  { id: 'AUDITOR', label: 'System Auditor', icon: <FileCheck className="w-3.5 h-3.5 text-purple-500" />, badgeColor: 'bg-purple-600 text-white font-bold' },
];

export default function Header({ onOpenPhoneModal, onToggleMobileSidebar }: HeaderProps) {
  const [unreadCount] = useState(5);
  const { user, logout, simulatedRole, setSimulatedRole } = useAuth();
  const { themeMode, toggleTheme, densityMode, toggleDensity } = useTheme();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const activeRoleObj = ROLE_OPTIONS.find(r => r.id === simulatedRole) || ROLE_OPTIONS[0];

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs gap-2">
      {/* Mobile Sidebar Hamburger Toggle & Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          title="Mở Menu Điều Hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-12 py-1.5 bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 px-1.5 py-0.5 bg-slate-200/60 rounded border border-slate-300/50">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Dark/Light Mode Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          title={themeMode === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
        >
          {themeMode === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Data Density Toggle (Compact vs Comfortable) */}
        <button
          onClick={toggleDensity}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700 transition-colors"
          title="Thay đổi mật độ hiển thị bảng biểu"
        >
          {densityMode === 'comfortable' ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Compact</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Comfortable</span>
            </>
          )}
        </button>

        {/* DIRECT ROLE SWITCHER WIDGET */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
            title="Mô phỏng vai trò phân quyền hệ thống"
          >
            {activeRoleObj.icon}
            <span className="hidden sm:inline-block">{activeRoleObj.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mô Phỏng Phân Quyền (RBAC)
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
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      simulatedRole === opt.id ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {simulatedRole === opt.id && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call Center VoIP Quick Dial */}
        <button
          onClick={onOpenPhoneModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline-block">Tổng đài</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 mx-0.5"></div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1">
            <div className={`w-7 h-7 rounded-md font-bold flex items-center justify-center text-[11px] ${activeRoleObj.badgeColor}`}>
              {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {user ? user.name : 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{activeRoleObj.label}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
