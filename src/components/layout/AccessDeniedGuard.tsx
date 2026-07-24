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
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            403 • ACCESS DENIED
          </span>
          <h2 className="text-lg font-extrabold text-slate-900 mt-2">
            Không Có Quyền Truy Cập
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân hệ <strong className="text-slate-800">{moduleName || 'này'}</strong> đã bị ẩn hoặc không được phân quyền cho vai trò <span className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded font-mono font-bold">{activeRole}</span>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Lock className="w-4 h-4 text-amber-600" /> Lý Do Hạn Chế
          </div>
          <ul className="text-slate-500 space-y-1 list-disc list-inside text-[11px]">
            <li>Chức năng chưa được phân quyền trong Ma Trận RBAC.</li>
            <li>Hoặc phân hệ đang tạm tắt bởi Quản Trị Viên (Admin).</li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4" /> Trở Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
