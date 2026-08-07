'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  X,
  Phone,
  PhoneOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCircle,
} from 'lucide-react';
import { UserRole } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import CommandPaletteModal from './CommandPaletteModal';
import UserProfileModal from './UserProfileModal';

interface HeaderProps {
  onOpenPhoneModal?: () => void;
  onToggleMobileSidebar?: () => void;
}

const ROLE_OPTIONS: {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  badgeColor: string;
}[] = [
  { id: 'SUPER_ADMIN',   label: 'Super Admin',     icon: <Crown className="w-3.5 h-3.5 text-amber-500" />,   badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
  { id: 'SALES_MANAGER', label: 'Sales Manager',   icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />, badgeColor: 'bg-blue-600 text-white font-bold' },
  { id: 'SALES_REP',     label: 'Sales Rep',        icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />, badgeColor: 'bg-indigo-600 text-white font-bold' },
  { id: 'CSKH',          label: 'CSKH Specialist',  icon: <Headphones className="w-3.5 h-3.5 text-emerald-500" />, badgeColor: 'bg-emerald-600 text-white font-bold' },
  { id: 'AUDITOR',       label: 'System Auditor',   icon: <FileCheck className="w-3.5 h-3.5 text-purple-500" />, badgeColor: 'bg-purple-600 text-white font-bold' },
];

// Mock notification data — in production connect to Supabase realtime
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'success' as const, title: 'Hợp đồng được ký', body: 'KH Nguyễn Thị Lan vừa ký HĐ #CT-2024-089', time: '2 phút trước', read: false },
  { id: '2', type: 'info' as const,    title: 'Lead mới từ Shopee', body: '3 lead mới từ chiến dịch Q1 cần phân công', time: '15 phút trước', read: false },
  { id: '3', type: 'warning' as const, title: 'KPI sắp đến hạn',   body: 'Target doanh số tháng 8 đạt 67% — còn 12 ngày', time: '1 giờ trước', read: false },
  { id: '4', type: 'info' as const,    title: 'Yêu cầu phê duyệt', body: 'Nguyễn Văn Hùng gửi đề xuất tăng lương cho bạn duyệt', time: '3 giờ trước', read: true },
  { id: '5', type: 'success' as const, title: 'Nhân viên mới onboard', body: 'Trần Thị Mai đã hoàn thành onboarding thành công', time: 'Hôm qua', read: true },
];

const NOTI_ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  warning: <AlertCircle  className="w-4 h-4 text-amber-500 shrink-0" />,
  info:    <Bell         className="w-4 h-4 text-indigo-500 shrink-0" />,
};

export default function Header({ onOpenPhoneModal, onToggleMobileSidebar }: HeaderProps) {
  const { user, logout, simulatedRole, setSimulatedRole } = useAuth();
  const { themeMode, toggleTheme, densityMode, toggleDensity } = useTheme();
  const { toast } = useToast();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [voipStatus, setVoipStatus] = useState<'available' | 'busy' | 'offline'>('available');

  const notiRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const activeRoleObj = useMemo(() => ROLE_OPTIONS.find((r) => r.id === simulatedRole) || ROLE_OPTIONS[0], [simulatedRole]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setIsNotiOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setIsRoleDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info('Đã đánh dấu tất cả là đã đọc');
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const voipStatusConfig = {
    available: { label: 'Sẵn sàng', dotClass: 'bg-emerald-500 animate-pulse', textClass: 'text-emerald-700 dark:text-emerald-300', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800' },
    busy:      { label: 'Đang bận',  dotClass: 'bg-amber-500',                 textClass: 'text-amber-700 dark:text-amber-300',   bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800' },
    offline:   { label: 'Ngoại tuyến', dotClass: 'bg-slate-400',              textClass: 'text-slate-500 dark:text-slate-400',  bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  };
  const vs = voipStatusConfig[voipStatus];

  return (
    <>
      <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-5 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-2 transition-colors">

        {/* ── Left: Hamburger + Search ── */}
        <div className="flex items-center gap-2 flex-1 max-w-[420px]">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="relative w-full flex items-center gap-2.5 pl-3.5 pr-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-xs text-slate-400 cursor-pointer transition-all duration-150 shadow-sm group"
            aria-label="Mở tìm kiếm nhanh (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 shrink-0 group-hover:text-indigo-500 transition-colors" />
            <span className="flex-1 text-left font-normal truncate hidden sm:block">
              Tìm khách hàng, lead, hợp đồng...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] tabular-nums text-slate-400 px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-700/70 rounded border border-slate-300/50 dark:border-slate-600 shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-1 sm:gap-1.5">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-all"
            title={themeMode === 'light' ? 'Chuyển Dark Mode' : 'Chuyển Light Mode'}
            aria-label="Đổi theme"
          >
            {themeMode === 'light'
              ? <Moon className="w-4 h-4" />
              : <Sun  className="w-4 h-4 text-amber-400" />
            }
          </button>

          {/* Density Toggle */}
          <button
            onClick={toggleDensity}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Thay đổi mật độ hiển thị"
            aria-label="Toggle density"
          >
            {densityMode === 'comfortable'
              ? <><Minimize2 className="w-3.5 h-3.5 text-slate-400" /><span>Compact</span></>
              : <><Maximize2 className="w-3.5 h-3.5 text-indigo-500" /><span>Comfortable</span></>
            }
          </button>

          {/* Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setIsRoleDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Đổi vai trò"
              aria-expanded={isRoleDropdownOpen}
            >
              {activeRoleObj.icon}
              <span className="hidden sm:inline-block">{activeRoleObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                  Mô Phỏng Phân Quyền (RBAC)
                </p>
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSimulatedRole(opt.id);
                      setIsRoleDropdownOpen(false);
                      toast.info(`Đã chuyển sang vai trò: ${opt.label}`);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      simulatedRole === opt.id
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {simulatedRole === opt.id && <ShieldCheck className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VoIP Button with status */}
          <div className="relative group">
            <button
              onClick={() => {
                if (voipStatus !== 'offline') {
                  onOpenPhoneModal?.();
                } else {
                  toast.warning('Tổng đài đang ngoại tuyến');
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${vs.bgClass} ${vs.textClass}`}
              aria-label={`Tổng đài — ${vs.label}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${vs.dotClass}`} />
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline-block">Tổng đài</span>
            </button>

            {/* VoIP status picker tooltip */}
            <div className="absolute right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 w-40 hidden group-hover:block animate-in fade-in zoom-in-95 duration-150">
              {(['available', 'busy', 'offline'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setVoipStatus(s); toast.info(`Trạng thái tổng đài: ${voipStatusConfig[s].label}`); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    voipStatus === s
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${voipStatusConfig[s].dotClass}`} />
                  {voipStatusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Bell with dropdown */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => setIsNotiOpen((v) => !v)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              aria-label={`Thông báo — ${unreadCount} chưa đọc`}
              aria-expanded={isNotiOpen}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 border border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotiOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Noti Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Thông Báo</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{unreadCount} chưa đọc</p>
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Đọc tất cả
                  </button>
                </div>

                {/* Noti List */}
                <div className="max-h-[320px] overflow-y-auto sleek-scrollbar divide-y divide-slate-50 dark:divide-slate-800">
                  {notifications.map((noti) => (
                    <button
                      key={noti.id}
                      onClick={() => { markRead(noti.id); setIsNotiOpen(false); }}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !noti.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">{NOTI_ICONS[noti.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug truncate ${!noti.read ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {noti.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                          {noti.body}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {noti.time}
                        </p>
                      </div>
                      {!noti.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold w-full text-center">
                    Xem tất cả thông báo →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* User Profile */}
          <button
            onClick={() => setIsUserProfileOpen(true)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
            title="Hồ sơ & Bảo mật"
            aria-label="Mở hồ sơ người dùng"
          >
            <div className={`w-7 h-7 rounded-md font-bold flex items-center justify-center text-[11px] shrink-0 ${activeRoleObj.badgeColor}`}>
              {user ? user.username.substring(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[100px]">
                {user ? user.name : 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {activeRoleObj.label}
              </p>
            </div>
          </button>

          <button
            onClick={() => { logout(); toast.info('Đã đăng xuất khỏi hệ thống'); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Đăng xuất"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Modals */}
      <CommandPaletteModal
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onOpenVoIP={onOpenPhoneModal}
      />

      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onSuccessToast={(msg) => toast.success(msg)}
      />
    </>
  );
}
