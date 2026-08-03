'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Users,
  Kanban,
  FileCheck,
  Briefcase,
  Layers,
  Award,
  Settings,
  PhoneCall,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoIP?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Trang Hệ Thống' | 'Thao Tác Nhanh' | 'Phê Duyệt & HRM';
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  shortcut?: string;
}

export default function CommandPaletteModal({ isOpen, onClose, onOpenVoIP }: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS: CommandItem[] = [
    { id: 'c_dash', title: 'Tổng Quan Executive Dashboard', category: 'Trang Hệ Thống', icon: <Sparkles className="w-4 h-4 text-purple-500" />, path: '/', shortcut: '↵' },
    { id: 'c_cust', title: 'Quản Lý Khách Hàng 360°', category: 'Trang Hệ Thống', icon: <Users className="w-4 h-4 text-blue-500" />, path: '/customers' },
    { id: 'c_leads', title: 'Lead & Phễu Ban Hàng 7 Bước (Kanban)', category: 'Trang Hệ Thống', icon: <Kanban className="w-4 h-4 text-emerald-500" />, path: '/leads' },
    { id: 'c_approvals', title: 'Quản Lý Phê Duyệt (22 Mẫu Lark Approval)', category: 'Trang Hệ Thống', icon: <ShieldCheck className="w-4 h-4 text-purple-600" />, path: '/proposals' },
    { id: 'c_hrm', title: 'Quản Lý Nhân Sự HRM & Hồ Sơ', category: 'Trang Hệ Thống', icon: <Briefcase className="w-4 h-4 text-indigo-500" />, path: '/hrm' },
    { id: 'c_products', title: 'Sản Phẩm & Dịch Vụ Cấu Hình Động', category: 'Trang Hệ Thống', icon: <Layers className="w-4 h-4 text-amber-500" />, path: '/products' },
    { id: 'c_kpis', title: 'Quản Lý KPIs & Chỉ Tiêu Đa Cấp', category: 'Trang Hệ Thống', icon: <Award className="w-4 h-4 text-rose-500" />, path: '/kpis' },
    { id: 'c_perf', title: 'Chấm Điểm Hiệu Suất S/A/B/C/D', category: 'Trang Hệ Thống', icon: <Award className="w-4 h-4 text-amber-500" />, path: '/performance' },
    { id: 'c_settings', title: 'Cấu Hình Hệ Thống & RBAC Phân Quyền', category: 'Trang Hệ Thống', icon: <Settings className="w-4 h-4 text-slate-500" />, path: '/settings/system' },

    {
      id: 'a_new_lead',
      title: '➕ Thêm Lead Mới Tức Thời',
      category: 'Thao Tác Nhanh',
      icon: <PlusCircle className="w-4 h-4 text-emerald-600" />,
      action: () => {
        router.push('/leads');
        onClose();
      },
    },
    {
      id: 'a_new_sub',
      title: '✍️ Nộp Phiếu Phê Duyệt Mới',
      category: 'Thao Tác Nhanh',
      icon: <FileCheck className="w-4 h-4 text-purple-600" />,
      action: () => {
        router.push('/proposals');
        onClose();
      },
    },
    {
      id: 'a_voip',
      title: '📞 Mở Trình Gọi Điện VoIP Telesale',
      category: 'Thao Tác Nhanh',
      icon: <PhoneCall className="w-4 h-4 text-blue-600" />,
      action: () => {
        if (onOpenVoIP) onOpenVoIP();
        onClose();
      },
    },
  ];

  const filteredCommands = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase();
    return !q || cmd.title.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q);
  });

  const handleSelectCommand = (cmd: CommandItem) => {
    if (cmd.path) {
      router.push(cmd.path);
    } else if (cmd.action) {
      cmd.action();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-xl overflow-hidden space-y-0 text-xs font-medium">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-850">
          <Search className="w-4 h-4 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gõ tên trang, tính năng hoặc thao tác (ví dụ: Lead, Phê duyệt, Khách hàng)..."
            className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 font-semibold text-xs placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1 sleek-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              Không tìm thấy kết quả phù hợp cho "<strong className="text-slate-800 dark:text-slate-200">{query}</strong>"
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => handleSelectCommand(cmd)}
                className="p-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-all group border border-transparent hover:border-purple-200/60"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                    {cmd.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                      {cmd.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-400 font-medium">{cmd.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    Đi tới <ArrowRight className="w-3 h-3 inline ml-0.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-medium px-4">
          <span>Dùng phím <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border text-[10px] font-mono">↑↓</kbd> để di chuyển, <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border text-[10px] font-mono">Enter</kbd> để chọn</span>
          <span className="font-mono text-purple-600 font-bold">GGBingo Command Palette</span>
        </div>
      </div>
    </div>
  );
}
