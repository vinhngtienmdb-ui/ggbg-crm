'use client';

import React, { useMemo, useState } from 'react';
import { Search, Download, Printer, BookText } from 'lucide-react';
import { EmployeeProfile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { canViewPII, maskId, maskSalary } from '@/lib/pii';

const formatVND = (n?: number) => {
  if (n === undefined || n === null) return '—';
  return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
};

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  Active: { label: '🟢 Đang Làm Việc', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  Probation: { label: '🔵 Thử Việc', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  Pending_Resign: { label: '🟠 Chờ Nghỉ Việc', cls: 'bg-amber-100 text-amber-900 border-amber-200' },
  Resigned: { label: '🔴 Đã Nghỉ Việc', cls: 'bg-red-100 text-red-800 border-red-200' },
  Suspended: { label: '🟣 Tạm Hoãn HĐ', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  Applicant: { label: '⚪ Ứng Viên Mới', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const BHXH_BADGES: Record<string, string> = {
  'Đang tham gia': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Chưa tham gia': 'bg-slate-100 text-slate-600 border-slate-200',
  'Tạm dừng': 'bg-amber-100 text-amber-900 border-amber-200',
  'Đã chốt sổ': 'bg-red-100 text-red-800 border-red-200',
};

export default function LaborBook({
  employees,
  onSelect,
}: {
  employees: EmployeeProfile[];
  onSelect?: (e: EmployeeProfile) => void;
}) {
  const { user, simulatedRole } = useAuth();
  const role = simulatedRole || user?.role;
  const showPII = canViewPII(role, user?.is_super_admin);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      const matchesSearch =
        !q ||
        e.full_name.toLowerCase().includes(q) ||
        e.employee_code.toLowerCase().includes(q) ||
        (e.id_card_number && e.id_card_number.includes(search.trim()));
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      const matchesDept = deptFilter === 'ALL' || e.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [employees, search, statusFilter, deptFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Mã NV',
      'Họ tên',
      'Giới tính',
      'Ngày sinh',
      'CCCD',
      'Trình độ CMKT',
      'Bậc kỹ năng',
      'Loại HĐ',
      'Ngày bắt đầu',
      'BHXH',
      'Lương (VND)',
      'Phép đã nghỉ/tổng',
      'Giờ OT',
      'Trạng thái',
    ];

    const rows = filtered.map((e) => [
      e.employee_code,
      e.full_name,
      e.gender || '',
      e.date_of_birth || '',
      showPII ? e.id_card_number || '' : maskId(e.id_card_number),
      e.education_level || '',
      e.skill_level || '',
      e.contract_type || '',
      e.contract_start_date || '',
      e.bhxh_status || '',
      showPII ? (e.base_salary ?? '') : '••••••',
      `${e.leave_taken_days ?? 0}/${e.annual_leave_days ?? 0}`,
      String(e.overtime_hours ?? 0),
      STATUS_BADGES[e.status]?.label.replace(/^[^\s]+\s/, '') || e.status,
    ]);

    const escapeCell = (v: any) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const csv = [headers, ...rows].map((r) => r.map(escapeCell).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `so-quan-ly-lao-dong-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const thCls = 'p-3 uppercase text-slate-500 font-bold tracking-wide text-[10.5px]';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header + controls */}
      <div className="p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <BookText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Sổ Quản Lý Lao Động</h2>
              <p className="text-[11px] text-slate-500">Theo Nghị định 145/2020/NĐ-CP • {filtered.length} lao động</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> Xuất CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-600" /> In Sổ
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, Mã NV, CCCD..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="ALL">Tất Cả Trạng Thái</option>
            <option value="Active">🟢 Đang Làm Việc</option>
            <option value="Probation">🔵 Thử Việc</option>
            <option value="Pending_Resign">🟠 Chờ Nghỉ Việc</option>
            <option value="Resigned">🔴 Đã Nghỉ Việc</option>
            <option value="Suspended">🟣 Tạm Hoãn HĐ</option>
            <option value="Applicant">⚪ Ứng Viên Mới</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="ALL">Tất Cả Phòng Ban</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className={thCls}>Mã NV & Họ Tên</th>
              <th className={thCls}>Giới Tính / Ngày Sinh</th>
              <th className={thCls}>CCCD</th>
              <th className={thCls}>Trình Độ CMKT / Bậc KN</th>
              <th className={thCls}>Loại HĐ / Ngày BĐ</th>
              <th className={thCls}>BHXH / Lương</th>
              <th className={thCls}>Phép / OT</th>
              <th className={thCls}>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const statusBadge = STATUS_BADGES[e.status] || STATUS_BADGES.Applicant;
              return (
                <tr
                  key={e.id}
                  onClick={() => onSelect?.(e)}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
                >
                  <td className="p-3">
                    <p className="font-bold text-slate-900 text-sm">{e.full_name}</p>
                    <p className="font-mono text-blue-700 text-[11px]">{e.employee_code}</p>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800">{e.gender || '—'}</p>
                    <p className="text-slate-500">{e.date_of_birth || '—'}</p>
                  </td>

                  <td className="p-3 font-mono text-slate-800">
                    {showPII ? e.id_card_number || '—' : maskId(e.id_card_number)}
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800">{e.education_level || '—'}</p>
                    <p className="text-slate-500">{e.skill_level || '—'}</p>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800">{e.contract_type || '—'}</p>
                    <p className="text-slate-500">{e.contract_start_date || '—'}</p>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${BHXH_BADGES[e.bhxh_status || ''] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {e.bhxh_status || 'Chưa xác định'}
                    </span>
                    <p className="font-bold text-slate-900 mt-1">{maskSalary(showPII, formatVND(e.base_salary))}</p>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800">
                      Phép: <span className="text-amber-700">{e.leave_taken_days ?? 0}</span>/{e.annual_leave_days ?? 0}
                    </p>
                    <p className="text-slate-500">OT: {e.overtime_hours ?? 0}h</p>
                  </td>

                  <td className="p-3">
                    <span className={`px-2.5 py-1 border font-bold rounded-xl text-[11px] w-fit inline-block ${statusBadge.cls}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 italic text-xs">
                  Không tìm thấy lao động nào phù hợp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
