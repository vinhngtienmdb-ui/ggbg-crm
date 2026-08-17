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
  X
} from 'lucide-react';
import { WorkShift, ShiftAssignment, EmployeeProfile } from '@/types';
import {
  getWorkShifts,
  getShiftAssignments,
  saveShiftAssignment,
  deleteShiftAssignment,
  createWorkShift,
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

const SHIFT_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-800' },
};

export default function ShiftScheduleRoster() {
  const [shifts, setShifts] = useState<WorkShift[]>(() => getWorkShifts());
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(() => getShiftAssignments());
  const [employees] = useState<EmployeeProfile[]>(() => getEmployees());

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftForBatch, setSelectedShiftForBatch] = useState<string>(shifts[0]?.id || '');
  const [showShiftConfigModal, setShowShiftConfigModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Shift State
  const [newShift, setNewShift] = useState({
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
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

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

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkShift({
      ...newShift,
      work_hours: Number(newShift.work_hours),
      night_shift_bonus_pct: Number(newShift.night_shift_bonus_pct),
      grace_period_late_mins: Number(newShift.grace_period_late_mins),
      grace_period_early_mins: Number(newShift.grace_period_early_mins),
    });

    setShifts([...getWorkShifts()]);
    setShowShiftConfigModal(false);
    showToast('Đã thêm loại ca làm việc mới vào hệ thống!');
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in"> <Sparkles className="w-4 h-4 text-amber-400" /> <span className="text-sm font-semibold">{toastMsg}</span> </div> )}

      {/* Shifts Legend & Quick Switch */} <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"> <div className="flex flex-col md:flex-row md:items-center justify-between gap-3"> <div className="flex items-center gap-2"> <Clock className="w-5 h-5 text-blue-600" /> <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Danh Mục Ca Làm Việc Doanh Nghiệp</h4> </div> <button
            onClick={() => setShowShiftConfigModal(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors w-fit"
          > <Plus className="w-4 h-4" /> Thêm Ca Làm Việc Mới </button> </div> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"> {shifts.map((s) => {
            const color = SHIFT_COLOR_MAP[s.color] || SHIFT_COLOR_MAP.emerald;
            return ( <div
                key={s.id}
                className={`p-3 rounded-xl border ${color.border} ${color.bg} flex flex-col justify-between space-y-1`}
              > <div className="flex items-center justify-between"> <span className={`font-medium text-xs ${color.text} truncate`}>{s.name}</span> {s.night_shift_bonus_pct > 0 && ( <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded text-[9px] font-semibold"> +{s.night_shift_bonus_pct}% Đêm </span> )} </div> <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300"> <span>{s.start_time} - {s.end_time}</span> <span className="font-medium">{s.work_hours}h</span> </div> </div> );
          })} </div> </div> {/* Roster Controls */} <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"> <div className="flex items-center gap-3 flex-1 flex-wrap"> <div className="relative flex-1 min-w-[240px]"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
              type="text"
              placeholder="Tìm theo tên nhân sự, mã nhân viên để phân ca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
            /> </div> <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          > <option value="ALL">Tất Cả Phòng Ban</option> <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option> <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option> <option value="Phòng Marketing">Phòng Marketing</option> <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option> <option value="Phòng CSKH">Phòng CSKH</option> <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option> </select> </div> <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"> <Calendar className="w-4 h-4 text-blue-600" /> Tuần Hiện Tại: 17/08 - 23/08/2026 </div> </div> {/* ROSTER MATRIX TABLE */} <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"> <div className="overflow-x-auto"> <table className="w-full text-left text-xs border-collapse"> <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5 min-w-[200px]">Nhân Viên</th> {DAYS_OF_WEEK.map((d) => ( <th key={d.key} className="p-3.5 text-center min-w-[130px] border-l border-slate-200/60 dark:border-slate-700/60"> <p className="font-semibold text-slate-800 dark:text-slate-200">{d.dayName}</p> <p className="text-[10px] font-mono text-slate-400">{d.shortDate}</p> </th> ))} </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {filteredEmployees.map((emp) => ( <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5"> <div className="font-medium text-slate-900 dark:text-white">{emp.full_name}</div> <div className="text-[10px] text-slate-400 font-mono">{emp.employee_code} · {emp.position}</div> </td> {DAYS_OF_WEEK.map((d) => {
                    const assigned = assignments.find((sa) => sa.employee_id === emp.id && sa.date === d.key);
                    const shiftObj = assigned ? shifts.find((s) => s.id === assigned.shift_id) : null;
                    const color = shiftObj ? (SHIFT_COLOR_MAP[shiftObj.color] || SHIFT_COLOR_MAP.emerald) : null;

                    return ( <td key={d.key} className="p-2 border-l border-slate-200/60 dark:border-slate-700/60 text-center"> <select
                          value={assigned ? assigned.shift_id : 'OFF'}
                          onChange={(e) => handleAssignShift(emp, d.key, e.target.value)}
                          className={`w-full text-[10px] font-medium rounded-lg px-2 py-1.5 border transition-all cursor-pointer ${
                            assigned && color
                              ? `${color.bg} ${color.text} ${color.border}`
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        > <option value="OFF">⚪ Nghỉ Tuần (Off)</option> {shifts.map((s) => ( <option key={s.id} value={s.id}> {s.name} ({s.start_time}-{s.end_time}) </option> ))} </select> </td> );
                  })} </tr> ))} </tbody> </table> </div> </div> {/* CREATE NEW SHIFT MODAL */}
      {showShiftConfigModal && ( <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <form onSubmit={handleCreateShift}> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Plus className="w-4 h-4 text-blue-600" /> Thêm Loại Ca Làm Việc Mới </h3> <button
                  type="button"
                  onClick={() => setShowShiftConfigModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs"> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mã Ca Làm Việc *</label> <input
                      type="text"
                      required
                      placeholder="SHIFT_LIVE_MEGA"
                      value={newShift.shift_code}
                      onChange={(e) => setNewShift({ ...newShift, shift_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tên Ca Làm Việc *</label> <input
                      type="text"
                      required
                      placeholder="Ca Livestream Mega Sale"
                      value={newShift.name}
                      onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    /> </div> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Giờ Bắt Đầu Vào Ca</label> <input
                      type="time"
                      value={newShift.start_time}
                      onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Giờ Kết Thúc Tan Ca</label> <input
                      type="time"
                      value={newShift.end_time}
                      onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> </div> <div className="grid grid-cols-3 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Giờ Công Chuẩn</label> <input
                      type="number"
                      step="0.5"
                      value={newShift.work_hours}
                      onChange={(e) => setNewShift({ ...newShift, work_hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Phụ Cấp Ca Đêm (%)</label> <input
                      type="number"
                      value={newShift.night_shift_bonus_pct}
                      onChange={(e) => setNewShift({ ...newShift, night_shift_bonus_pct: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Màu Nhận Diện</label> <select
                      value={newShift.color}
                      onChange={(e) => setNewShift({ ...newShift, color: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    > <option value="emerald">Xanh Lá (Emerald)</option> <option value="blue">Xanh Dương (Blue)</option> <option value="amber">Vàng Cam (Amber)</option> <option value="purple">Tím (Purple)</option> <option value="rose">Hồng Đỏ (Rose)</option> </select> </div> </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900"> <button
                  type="button"
                  onClick={() => setShowShiftConfigModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                > Lưu Ca Làm Việc </button> </div> </form> </div> </div> )} </div> );
}
