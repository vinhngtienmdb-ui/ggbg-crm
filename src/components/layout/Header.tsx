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
  Sparkles,
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

const ROLE_OPTIONS: { id: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
  { id: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5 text-amber-500" />, badgeColor: 'bg-amber-500 text-slate-950 font-medium' },
  { id: 'SALES_MANAGER', label: 'Sales Manager', icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />, badgeColor: 'bg-blue-600 text-white font-medium' },
  { id: 'SALES_REP', label: 'Sales Rep', icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />, badgeColor: 'bg-indigo-600 text-white font-medium' },
  { id: 'CSKH', label: 'CSKH Specialist', icon: <Headphones className="w-3.5 h-3.5 text-emerald-500" />, badgeColor: 'bg-emerald-600 text-white font-medium' },
  { id: 'AUDITOR', label: 'System Auditor', icon: <FileCheck className="w-3.5 h-3.5 text-purple-500" />, badgeColor: 'bg-purple-600 text-white font-medium' },
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

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

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

  return ( <> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-purple-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"> <Sparkles className="w-4 h-4 text-amber-400" /> {toastMsg} </div> )} <header className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs gap-2 transition-colors"> {/* Mobile Sidebar Hamburger Toggle & Search */} <div className="flex items-center gap-2 flex-1 max-w-md"> <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Mở Menu Điều Hướng"
          > <Menu className="w-5 h-5" /> </button> {/* Quick Search Bar Trigger Command Palette */} <div
            onClick={() => setIsCmdPaletteOpen(true)}
            className="relative w-full cursor-pointer group"
          > <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-purple-600 transition-colors" /> <input
              type="text"
              readOnly
              placeholder="Tìm kiếm nhanh trang, tính năng (Cmd+K)..."
              className="w-full pl-9 pr-12 py-1.5 bg-slate-100/70 dark:bg-slate-800/70 group-hover:bg-white dark:group-hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 cursor-pointer focus:outline-none transition-all shadow-2xs"
            /> <span className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 px-1.5 py-0.5 bg-slate-200/60 dark:bg-slate-700/60 rounded-md border border-slate-300/50 dark:border-slate-600"> ⌘K </span> </div> </div> {/* Right Controls */} <div className="flex items-center gap-1.5 sm:gap-2"> {/* Dark/Light Mode Theme Switcher */} <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors"
            title={themeMode === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
          > {themeMode === 'light' ? ( <Moon className="w-4 h-4 text-slate-600" /> ) : ( <Sun className="w-4 h-4 text-amber-400" /> )} </button> {/* Data Density Toggle (Compact vs Comfortable) */} <button
            onClick={toggleDensity}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Thay đổi mật độ hiển thị bảng biểu"
          > {densityMode === 'comfortable' ? ( <> <Minimize2 className="w-3.5 h-3.5 text-slate-500" /> <span>Compact</span> </> ) : ( <> <Maximize2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> <span>Comfortable</span> </> )} </button> {/* DIRECT ROLE SWITCHER WIDGET */} <div className="relative"> <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              title="Mô phỏng vai trò phân quyền hệ thống"
            > {activeRoleObj.icon} <span className="hidden sm:inline-block">{activeRoleObj.label}</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> </button> {isRoleDropdownOpen && ( <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"> <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800"> <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider"> Mô Phỏng Phân Quyền (RBAC) </p> </div> <div className="py-1 space-y-0.5"> {ROLE_OPTIONS.map((opt) => ( <button
                      key={opt.id}
                      onClick={() => {
                        setSimulatedRole(opt.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        simulatedRole === opt.id ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    > <div className="flex items-center gap-2"> {opt.icon} <span>{opt.label}</span> </div> {simulatedRole === opt.id && <ShieldCheck className="w-3.5 h-3.5 text-white" />} </button> ))} </div> </div> )} </div> {/* Call Center VoIP Quick Dial */} <button
            onClick={onOpenPhoneModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium transition-colors"
          > <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> <span className="hidden sm:inline-block">Tổng đài</span> </button> {/* Notifications */} <div className="relative"> <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"> <Bell className="w-4 h-4" /> {unreadCount > 0 && ( <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-semibold flex items-center justify-center border border-white dark:border-slate-900"> {unreadCount} </span> )} </button> </div> <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5"></div> {/* USER PROFILE & SECURITY CENTER TRIGGER */} <div className="flex items-center gap-1.5"> <button
              onClick={() => setIsUserProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors group"
              title="Mở Khu Vực Thông Tin Cá Nhân & Bảo Mật 2FA / Mật Khẩu"
            > <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center text-[11px] shadow-xs"> {user ? user.username.substring(0, 2).toUpperCase() : 'SA'} </div> <div className="hidden md:block text-left"> <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-blue-600 transition-colors"> {user ? user.name : 'Vũ Quốc Anh'} </p> <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1"> <span>{activeRoleObj.label}</span> </p> </div> </button> <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Đăng xuất khỏi hệ thống"
            > <LogOut className="w-4 h-4" /> </button> </div> </div> </header> {/* Global Command Palette Modal */} <CommandPaletteModal
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onOpenVoIP={onOpenPhoneModal}
      /> {/* Unified User Profile & Security Center Modal */} <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onSuccessToast={(msg) => showToast(msg)}
      /> </> );
}
