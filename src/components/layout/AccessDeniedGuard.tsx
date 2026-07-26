'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AccessDeniedGuardProps {
  moduleName?: string;
}

export default function AccessDeniedGuard({ moduleName }: AccessDeniedGuardProps) {
  const { simulatedRole, user } = useAuth();
  const activeRole = simulatedRole || user?.role || 'Chưa xác định';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-line shadow-cardLg text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-danger-bg border border-danger-border text-danger-fg mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 bg-danger-bg text-danger-fg rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            403 • ACCESS DENIED
          </span>
          <h2 className="text-lg font-extrabold text-ink-900 mt-2">
            Không Có Quyền Truy Cập
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Phân hệ <strong className="text-ink-900">{moduleName || 'này'}</strong> đã bị ẩn hoặc không được phân quyền cho vai trò <span className="px-2 py-0.5 bg-line-soft text-brand-800 rounded font-mono font-bold">{activeRole}</span>.
          </p>
        </div>

        <div className="p-4 bg-surface-subtle rounded-2xl border border-line text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-ink-700 font-bold">
            <Lock className="w-4 h-4 text-warn-fg" /> Lý Do Hạn Chế
          </div>
          <ul className="text-ink-500 space-y-1 list-disc list-inside text-[11px]">
            <li>Chức năng chưa được phân quyền trong Ma Trận RBAC.</li>
            <li>Hoặc phân hệ đang tạm tắt bởi Quản Trị Viên (Admin).</li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4" /> Trở Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
