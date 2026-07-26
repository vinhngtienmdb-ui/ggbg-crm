'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  FileCheck,
  FileClock,
  UserCheck,
  Info,
  CheckCheck
} from 'lucide-react';
import { UserRole } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import GlobalSearch from './GlobalSearch';

type NotificationType = 'contract' | 'approval' | 'system';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

const NOTIF_ICON: Record<NotificationType, React.ReactNode> = {
  contract: <FileClock className="w-4 h-4 text-amber-600" />,
  approval: <UserCheck className="w-4 h-4 text-blue-600" />,
  system: <Info className="w-4 h-4 text-slate-500" />,
};

function formatNotifTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

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
  const router = useRouter();
  const { user, logout, simulatedRole, setSimulatedRole } = useAuth();
  const { themeMode, toggleTheme, densityMode, toggleDensity } = useTheme();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Tìm kiếm toàn cục ⌘K
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Trung tâm thông báo
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const activeRoleObj = ROLE_OPTIONS.find(r => r.id === simulatedRole) || ROLE_OPTIONS[0];

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(typeof data.unread === 'number' ? data.unread : 0);
    } catch {
      // giữ nguyên trạng thái hiện tại nếu lỗi
    }
  }, []);

  // Nạp thông báo khi mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Nạp lại mỗi khi mở dropdown
  useEffect(() => {
    if (isNotifOpen) fetchNotifications();
  }, [isNotifOpen, fetchNotifications]);

  // Phím tắt mở tìm kiếm ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Đóng dropdown thông báo khi click ra ngoài
  useEffect(() => {
    if (!isNotifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isNotifOpen]);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch {
      // best-effort
    }
  };

  const handleNotifClick = async (n: AppNotification) => {
    setIsNotifOpen(false);
    if (!n.is_read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n.id }),
        });
      } catch {
        // best-effort
      }
    }
    if (n.link) router.push(n.link);
  };

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

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="relative w-full flex items-center pl-9 pr-12 py-1.5 bg-slate-100/70 hover:bg-white border border-slate-200/80 rounded-lg text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
          title="Tìm kiếm toàn cục (⌘K)"
        >
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <span>Tìm kiếm khách hàng, lead, nhân sự...</span>
          <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 px-1.5 py-0.5 bg-slate-200/60 rounded border border-slate-300/50">
            ⌘K
          </span>
        </button>
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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Thông Báo</p>
                  <p className="text-[11px] text-slate-500">
                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-500">Chưa có thông báo</p>
                    <p className="text-xs text-slate-400 mt-1">Các cảnh báo hệ thống sẽ hiển thị tại đây.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-b-0 transition-colors ${
                        n.is_read ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        {NOTIF_ICON[n.type] ?? NOTIF_ICON.system}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{n.title}</span>
                          {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                        </span>
                        <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">{n.body}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-1">{formatNotifTime(n.created_at)}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
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

      {/* Command palette tìm kiếm toàn cục */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
