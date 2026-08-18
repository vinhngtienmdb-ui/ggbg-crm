'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Users,
  Search,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Video,
  Building2,
  X,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Check
} from 'lucide-react';
import { WorkShift, ShiftAssignment, EmployeeProfile } from '@/types';
import {
  getWorkShifts,
  getShiftAssignments,
  saveShiftAssignment,
  deleteShiftAssignment,
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
  getEmployees
} from '@/lib/hrmStore';

const DAYS_OF_WEEK = [
  { key: '2026-08-17', dayName: 'Thứ Hai', shortDate: '17/08' },
  { key: '2026-08-18', dayName: 'Thứ Ba', shortDate: '18/08' },
  { key: '2026-08-19', dayName: 'Thứ Tư', shortDate: '19/08' },
  { key: '2026-08-20', dayName: 'Thứ Năm', shortDate: '20/08' },
  { key: '2026-08-21', dayName: 'Thứ Sáu', shortDate: '21/08' },
  { key: '2026-08-22', dayName: 'Thứ Bảy', shortDate: '22/08' },
  { key: '2026-08-23', dayName: 'Chủ Nhật', shortDate: '23/08' },
];

const SHIFT_COLOR_MAP: Record<string, { bg: string; text: string; border: string; badgeBg: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', badgeBg: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', badgeBg: 'bg-blue-500' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', badgeBg: 'bg-amber-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', badgeBg: 'bg-purple-500' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', badgeBg: 'bg-rose-500' },
};

const DEFAULT_NEW_SHIFT = {
  shift_code: 'SHIFT_CUSTOM',
  name: 'Ca Tăng Cường TMĐT',
  start_time: '18:00',
  end_time: '23:00',
  break_start: '20:00',
  break_end: '20:30',
  work_hours: 5.0,
  night_shift_bonus_pct: 15,
  grace_period_late_mins: 10,
  grace_period_early_mins: 5,
  is_active: true,
  color: 'amber',
};

export default function ShiftScheduleRoster() {
  const [shifts, setShifts] = useState<WorkShift[]>(() => getWorkShifts());
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(() => getShiftAssignments());
  const [employees] = useState<EmployeeProfile[]>(() => getEmployees());

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showShiftConfigModal, setShowShiftConfigModal] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [shiftFormData, setShiftFormData] = useState(DEFAULT_NEW_SHIFT);
  
  // View assigned employees modal
  const [viewingEmployeesForShift, setViewingEmployeesForShift] = useState<WorkShift | null>(null);
  const [searchEmpInShiftModal, setSearchEmpInShiftModal] = useState('');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Open modal for new shift
  const handleOpenCreateShift = () => {
    setEditingShiftId(null);
    setShiftFormData(DEFAULT_NEW_SHIFT);
    setShowShiftConfigModal(true);
  };

  // Open modal for editing existing shift
  const handleOpenEditShift = (shift: WorkShift, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingShiftId(shift.id);
    setShiftFormData({
      shift_code: shift.shift_code || 'SHIFT_CUSTOM',
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      break_start: shift.break_start || '',
      break_end: shift.break_end || '',
      work_hours: shift.work_hours,
      night_shift_bonus_pct: shift.night_shift_bonus_pct || 0,
      grace_period_late_mins: shift.grace_period_late_mins || 5,
      grace_period_early_mins: shift.grace_period_early_mins || 0,
      is_active: shift.is_active ?? true,
      color: shift.color || 'blue',
    });
    setShowShiftConfigModal(true);
  };

  // Save Shift (Create or Edit)
  const handleSaveShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShiftId) {
      // Update existing shift
      updateWorkShift(editingShiftId, {
        ...shiftFormData,
        work_hours: Number(shiftFormData.work_hours),
        night_shift_bonus_pct: Number(shiftFormData.night_shift_bonus_pct),
        grace_period_late_mins: Number(shiftFormData.grace_period_late_mins),
        grace_period_early_mins: Number(shiftFormData.grace_period_early_mins),
      });
      showToast(`✅ Đã cập nhật thành công ca làm việc: ${shiftFormData.name}`);
    } else {
      // Create new shift
      createWorkShift({
        ...shiftFormData,
        work_hours: Number(shiftFormData.work_hours),
        night_shift_bonus_pct: Number(shiftFormData.night_shift_bonus_pct),
        grace_period_late_mins: Number(shiftFormData.grace_period_late_mins),
        grace_period_early_mins: Number(shiftFormData.grace_period_early_mins),
      });
      showToast(`🎉 Đã thêm mới ca làm việc: ${shiftFormData.name}`);
    }

    setShifts([...getWorkShifts()]);
    setShowShiftConfigModal(false);
  };

  // Delete Shift
  const handleDeleteShift = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ca làm việc "${name}"? Các phân ca đang dùng ca này sẽ cần được phân lại.`)) {
      deleteWorkShift(id);
      setShifts([...getWorkShifts()]);
      setShowShiftConfigModal(false);
      showToast(`🗑️ Đã xóa ca làm việc: ${name}`);
    }
  };

  // Assign shift for an employee on a date
  const handleAssignShift = (employee: EmployeeProfile, date: string, shiftId: string) => {
    if (shiftId === 'OFF') {
      deleteShiftAssignment(employee.id, date);
      setAssignments([...getShiftAssignments()]);
      showToast(`Đã xếp nghỉ ngày ${date} cho ${employee.full_name}`);
      return;
    }

    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return;

    saveShiftAssignment({
      employee_id: employee.id,
      employee_name: employee.full_name,
      department: employee.department,
      date: date,
      shift_id: shift.id,
      shift_name: shift.name,
      shift_color: shift.color,
    });

    setAssignments([...getShiftAssignments()]);
    showToast(`Đã gán ${shift.name} cho ${employee.full_name} (${date})`);
  };

  // Filter employees for roster table
  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
    
    // If filtered by shift, check if employee has this shift in any day of the current week
    const matchShift =
      shiftFilter === 'ALL' ||
      assignments.some((a) => a.employee_id === emp.id && a.shift_id === shiftFilter);

    return matchSearch && matchDept && matchShift;
  });

  // Calculate assigned stats for a shift in the current week
  const getShiftStats = (shiftId: string) => {
    const shiftAssignmentsList = assignments.filter((a) => a.shift_id === shiftId);
    const uniqueEmployees = new Set(shiftAssignmentsList.map((a) => a.employee_id));
    return {
      totalAssignments: shiftAssignmentsList.length,
      uniqueCount: uniqueEmployees.size,
    };
  };

  // Get list of employees assigned to viewing shift
  const assignedEmployeesForViewingShift = viewingEmployeesForShift
    ? employees
        .map((emp) => {
          const empAssignments = assignments.filter(
            (a) => a.employee_id === emp.id && a.shift_id === viewingEmployeesForShift.id
          );
          return {
            employee: emp,
            assignedDates: empAssignments.map((a) => a.date),
            count: empAssignments.length,
          };
        })
        .filter((item) => {
          if (item.count === 0 && item.employee.default_shift_id !== viewingEmployeesForShift.id) {
            return false;
          }
          const matchSearch =
            item.employee.full_name.toLowerCase().includes(searchEmpInShiftModal.toLowerCase()) ||
            item.employee.employee_code.toLowerCase().includes(searchEmpInShiftModal.toLowerCase()) ||
            item.employee.department.toLowerCase().includes(searchEmpInShiftModal.toLowerCase());
          return matchSearch;
        })
    : [];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHIFTS LEGEND & MANAGEMENT BAR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Danh Mục Ca Làm Việc & Phân Bổ Nhân Sự
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bấm vào từng ca để xem danh sách nhân sự áp dụng hoặc chỉnh sửa thông số ca làm việc.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {shiftFilter !== 'ALL' && (
              <button
                onClick={() => setShiftFilter('ALL')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Bỏ lọc ca
              </button>
            )}
            <button
              onClick={handleOpenCreateShift}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm Ca Làm Việc Mới
            </button>
          </div>
        </div>

        {/* Shift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {shifts.map((s) => {
            const color = SHIFT_COLOR_MAP[s.color] || SHIFT_COLOR_MAP.emerald;
            const stats = getShiftStats(s.id);
            const isFilterActive = shiftFilter === s.id;

            return (
              <div
                key={s.id}
                className={`p-3.5 rounded-xl border ${color.border} ${color.bg} flex flex-col justify-between space-y-2.5 transition-all relative group ${
                  isFilterActive ? 'ring-2 ring-blue-500 shadow-md scale-[1.02]' : 'hover:shadow-md'
                }`}
              >
                {/* Top header of card */}
                <div className="flex items-start justify-between gap-1.5">
                  <span className={`font-bold text-xs ${color.text} line-clamp-1`} title={s.name}>
                    {s.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditShift(s, e)}
                      className="p-1 rounded-md bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs transition-colors"
                      title="Chỉnh sửa ca làm việc này"
                    >
                      <Edit2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>

                {/* Time & Hours */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">{s.start_time} - {s.end_time}</span>
                  <span className="font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 border border-current/10">
                    {s.work_hours}h
                  </span>
                </div>

                {/* Night Bonus Badge if any */}
                {s.night_shift_bonus_pct > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded text-[9px] font-bold">
                      +{s.night_shift_bonus_pct}% Phụ Cấp Đêm
                    </span>
                  </div>
                )}

                {/* Footer Action: View Assigned Employees */}
                <div className="pt-2 border-t border-current/10 flex items-center justify-between gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setViewingEmployeesForShift(s)}
                    className="font-semibold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1 text-[10.5px]"
                    title="Xem danh sách nhân viên áp dụng ca này"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{stats.uniqueCount} Nhân sự áp dụng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftFilter(isFilterActive ? 'ALL' : s.id)}
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border transition-colors ${
                      isFilterActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-blue-50'
                    }`}
                    title="Lọc bảng phân ca theo ca này"
                  >
                    {isFilterActive ? 'Đang lọc' : 'Lọc bảng'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROSTER CONTROLS & FILTER BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên nhân sự, mã nhân viên để phân ca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">Tất Cả Phòng Ban</option>
            <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
            <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
            <option value="Phòng Marketing">Phòng Marketing</option>
            <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
            <option value="Phòng CSKH">Phòng CSKH</option>
            <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Tuần Roster: 17/08 - 23/08/2026</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
            {filteredEmployees.length} Nhân Sự
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROSTER MATRIX TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 min-w-[220px]">Nhân Viên</th>
                {DAYS_OF_WEEK.map((d) => (
                  <th key={d.key} className="p-3.5 text-center min-w-[135px] border-l border-slate-200/60 dark:border-slate-700/60">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{d.dayName}</p>
                    <p className="text-[10px] font-mono text-slate-400">{d.shortDate}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy nhân sự nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{emp.full_name}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-mono">
                        {emp.employee_code} · {emp.position}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {emp.department}
                      </div>
                    </td>
                    {DAYS_OF_WEEK.map((d) => {
                      const assigned = assignments.find((sa) => sa.employee_id === emp.id && sa.date === d.key);
                      const shiftObj = assigned ? shifts.find((s) => s.id === assigned.shift_id) : null;
                      const color = shiftObj ? (SHIFT_COLOR_MAP[shiftObj.color] || SHIFT_COLOR_MAP.emerald) : null;

                      return (
                        <td key={d.key} className="p-2 border-l border-slate-200/60 dark:border-slate-700/60 text-center">
                          <select
                            value={assigned ? assigned.shift_id : 'OFF'}
                            onChange={(e) => handleAssignShift(emp, d.key, e.target.value)}
                            className={`w-full text-[10px] font-semibold rounded-lg px-2 py-1.5 border transition-all cursor-pointer ${
                              assigned && color
                                ? `${color.bg} ${color.text} ${color.border}`
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <option value="OFF">⚪ Nghỉ Tuần (Off)</option>
                            {shifts.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.start_time}-{s.end_time})
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TẠO MỚI / CHỈNH SỬA CA LÀM VIỆC (EDIT & CREATE SHIFT MODAL) */}
      {/* ========================================================================= */}
      {showShiftConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <form onSubmit={handleSaveShiftSubmit}>
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingShiftId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-blue-600" />
                      Chỉnh Sửa Ca Làm Việc: {shiftFormData.name}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-blue-600" />
                      Thêm Loại Ca Làm Việc Mới
                    </>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowShiftConfigModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã Ca Làm Việc *</label>
                    <input
                      type="text"
                      required
                      placeholder="SHIFT_LIVE_MEGA"
                      value={shiftFormData.shift_code}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, shift_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tên Ca Làm Việc *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ca Livestream Mega Sale"
                      value={shiftFormData.name}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Giờ Bắt Đầu Vào Ca *</label>
                    <input
                      type="time"
                      required
                      value={shiftFormData.start_time}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, start_time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Giờ Kết Thúc Tan Ca *</label>
                    <input
                      type="time"
                      required
                      value={shiftFormData.end_time}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, end_time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bắt Đầu Giờ Nghỉ (Break)</label>
                    <input
                      type="time"
                      value={shiftFormData.break_start}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, break_start: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Kết Thúc Giờ Nghỉ (Break)</label>
                    <input
                      type="time"
                      value={shiftFormData.break_end}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, break_end: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Số Giờ Công Chuẩn</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="24"
                      value={shiftFormData.work_hours}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, work_hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phụ Cấp Ca Đêm (%)</label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      max="100"
                      value={shiftFormData.night_shift_bonus_pct}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, night_shift_bonus_pct: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Màu Nhận Diện</label>
                    <select
                      value={shiftFormData.color}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, color: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="emerald">Xanh Lá (Emerald)</option>
                      <option value="blue">Xanh Dương (Blue)</option>
                      <option value="amber">Vàng Cam (Amber)</option>
                      <option value="purple">Tím (Purple)</option>
                      <option value="rose">Hồng Đỏ (Rose)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Dung sai đi muộn (phút)</label>
                    <input
                      type="number"
                      value={shiftFormData.grace_period_late_mins}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, grace_period_late_mins: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Dung sai về sớm (phút)</label>
                    <input
                      type="number"
                      value={shiftFormData.grace_period_early_mins}
                      onChange={(e) => setShiftFormData({ ...shiftFormData, grace_period_early_mins: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                {editingShiftId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteShift(editingShiftId, shiftFormData.name)}
                    className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa Ca
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShiftConfigModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    {editingShiftId ? 'Cập Nhật Ca Làm Việc' : 'Lưu Ca Làm Việc'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: XEM DANH SÁCH NHÂN SỰ ÁP DỤNG CA (VIEW ASSIGNED EMPLOYEES MODAL) */}
      {/* ========================================================================= */}
      {viewingEmployeesForShift && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${SHIFT_COLOR_MAP[viewingEmployeesForShift.color]?.border || 'border-blue-200'} ${SHIFT_COLOR_MAP[viewingEmployeesForShift.color]?.bg || 'bg-blue-50'}`}>
                  <Clock className={`w-5 h-5 ${SHIFT_COLOR_MAP[viewingEmployeesForShift.color]?.text || 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Nhân Sự Áp Dụng: {viewingEmployeesForShift.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {viewingEmployeesForShift.start_time} - {viewingEmployeesForShift.end_time} ({viewingEmployeesForShift.work_hours}h)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Danh sách nhân viên được phân công làm việc theo ca này trong tuần 17/08 - 23/08/2026.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEmployeesForShift(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter within Modal */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 bg-white dark:bg-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm nhân sự theo tên, mã NV, phòng ban..."
                  value={searchEmpInShiftModal}
                  onChange={(e) => setSearchEmpInShiftModal(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                Tổng: <span className="text-blue-600 dark:text-blue-400">{assignedEmployeesForViewingShift.length}</span> nhân sự
              </div>
            </div>

            {/* Employees List */}
            <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-700">
              {assignedEmployeesForViewingShift.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                  Chưa có nhân sự nào được phân ca này trong tuần này.
                </div>
              ) : (
                assignedEmployeesForViewingShift.map(({ employee, assignedDates, count }) => (
                  <div key={employee.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
                        {employee.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{employee.full_name}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {employee.employee_code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {employee.position} • <span className="font-medium text-slate-700 dark:text-slate-300">{employee.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Days Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {DAYS_OF_WEEK.map((d) => {
                        const isAssignedDay = assignedDates.includes(d.key);
                        return (
                          <span
                            key={d.key}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              isAssignedDay
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                            title={`${d.dayName} (${d.shortDate}): ${isAssignedDay ? 'Có ca' : 'Nghỉ / Ca khác'}`}
                          >
                            {d.dayName.replace('Thứ ', 'T').replace('Chủ Nhật', 'CN')}
                          </span>
                        );
                      })}
                      <span className="ml-1 font-bold text-xs text-blue-700 dark:text-blue-300">
                        ({count} ca/tuần)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShiftFilter(viewingEmployeesForShift.id);
                  setViewingEmployeesForShift(null);
                  showToast(`Đã lọc bảng ma trận theo ca ${viewingEmployeesForShift.name}`);
                }}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" /> Lọc Bảng Roster Theo Ca Này
              </button>

              <button
                type="button"
                onClick={() => setViewingEmployeesForShift(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
