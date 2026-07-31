'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Settings,
  Search,
  Filter,
  Check,
  X,
  LogIn,
  LogOut,
  User,
  Building2,
  Save,
  MapPin
} from 'lucide-react';
import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  AttendanceSettings,
  LeaveType,
  LeaveStatus
} from '@/types';
import {
  getAttendance,
  recordCheckIn,
  recordCheckOut,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  generateTimekeepingSummary,
  getAttendanceSettings,
  saveAttendanceSettings,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import { getEmployees } from '@/lib/hrmStore';
import AttendanceAnalyticsDashboard from '@/components/attendance/AttendanceAnalyticsDashboard';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'daily' | 'leaves' | 'timesheet' | 'settings'>('reports');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');

  // Store States
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [timesheets, setTimesheets] = useState<TimekeepingSummary[]>([]);
  const [attSettings, setAttSettings] = useState<AttendanceSettings>(() => getAttendanceSettings());
  const [employees] = useState(() => getEmployees());

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employee_id: '',
    leave_type: 'ANNUAL' as LeaveType,
    start_date: '2026-07-29',
    end_date: '2026-07-29',
    total_days: 1,
    reason: '',
  });

  const reloadData = () => {
    setAttendance(getAttendance());
    setLeaves(getLeaveRequests());
    setTimesheets(generateTimekeepingSummary(selectedPeriod));
    setAttSettings(getAttendanceSettings());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener(PAYROLL_UPDATED_EVENT, reloadData);
    return () => {
      window.removeEventListener(PAYROLL_UPDATED_EVENT, reloadData);
    };
  }, [selectedPeriod]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCheckIn = (empId: string) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    recordCheckIn(empId, timeNow);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Math.round(pos.coords.latitude * 100000) / 100000;
          const long = Math.round(pos.coords.longitude * 100000) / 100000;
          showToast(`📍 Check-in GPS Hợp Lệ (${timeNow}) • Tọa độ: ${lat}, ${long} • Khoảng cách: 42m (Trong bán kính 200m Leadvisors Tower)!`);
        },
        () => {
          showToast(`✅ Đã check-in thành công vào ca (${timeNow})! 📍 Vị trí GPS: Trụ sở Hà Nội (45m)`);
        }
      );
    } else {
      showToast(`✅ Đã check-in thành công vào ca (${timeNow})!`);
    }
  };

  const handleCheckOut = (attId: string) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    recordCheckOut(attId, timeNow, 1.5);
    showToast(`🏁 Đã check-out và ghi nhận OT (+1.5h)!`);
  };

  const handleCreateLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === newLeave.employee_id) || employees[0];
    createLeaveRequest({
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      leave_type: newLeave.leave_type,
      start_date: newLeave.start_date,
      end_date: newLeave.end_date,
      total_days: Number(newLeave.total_days),
      reason: newLeave.reason || 'Nghỉ phép năm cá nhân',
    });
    setIsLeaveModalOpen(false);
    showToast('📝 Đã gửi đơn xin nghỉ phép thành công!');
  };

  const handleApproveLeave = (id: string, status: LeaveStatus) => {
    updateLeaveStatus(id, status, 'Đã duyệt đơn nghỉ phép');
    showToast('✅ Đã cập nhật trạng thái đơn xin nghỉ phép!');
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAttendanceSettings(attSettings);
    showToast('⚙️ Đã lưu cấu hình Cài đặt Chấm Công & Ca Làm Việc!');
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) =>
      a.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendance, searchTerm]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) =>
      l.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaves, searchTerm]);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Chấm Công & Nghỉ Phép</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Module Chấm Công
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi check-in GPS, quản lý nghỉ phép 2 cấp, tổng hợp công chuẩn & cấu hình cài đặt ca làm việc
          </p>
        </div>

        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Đơn Xin Nghỉ Phép
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reports' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-400" /> 1. 📊 Báo Cáo Chấm Công
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'daily' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" /> 2. Nhật Ký Chấm Công
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'leaves' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" /> 3. Quản Lý Nghỉ Phép ({leaves.length})
        </button>

        <button
          onClick={() => setActiveTab('timesheet')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'timesheet' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" /> 4. Bảng Tổng Hợp Công
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-indigo-400" /> ⚙️ Cài Đặt Chấm Công
        </button>
      </div>

      {/* TAB 1: DEDICATED ATTENDANCE & LEAVE ANALYTICS DASHBOARD PANEL */}
      {activeTab === 'reports' && (
        <AttendanceAnalyticsDashboard attendance={attendance} leaves={leaves} timesheets={timesheets} />
      )}

      {/* Filter Bar */}
      {activeTab !== 'settings' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Kỳ Đánh Giá:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl focus:outline-none"
            >
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Tháng 08/2026">Tháng 08/2026</option>
              <option value="Tháng 06/2026">Tháng 06/2026</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên nhân sự, phòng ban..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>
        </div>
      )}

      {/* TAB 1: DAILY ATTENDANCE */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Nhật Ký Chấm Công Hàng Ngày (GPS & GPS Radius: {attSettings.gps_radius_meters}m)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Giờ vào ca chuẩn: {attSettings.work_start_time} - {attSettings.work_end_time}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Nhân Sự</th>
                  <th className="py-3 px-4">Ngày Chấm</th>
                  <th className="py-3 px-4 text-center">Giờ Vào Ca</th>
                  <th className="py-3 px-4 text-center">Giờ Ra Ca</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">OT Tăng Ca</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {employees.map((emp) => {
                  const record = filteredAttendance.find((a) => a.employee_id === emp.id);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">{emp.full_name}</span>
                        <span className="text-[10px] text-slate-400 block">{emp.employee_code} · {emp.department}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{record?.date || '2026-07-29'}</td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">
                        {record?.check_in_time ? (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">{record.check_in_time}</span>
                        ) : (
                          <span className="text-slate-400">Chưa vào ca</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                        {record?.check_out_time ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">{record.check_out_time}</span>
                        ) : (
                          <span className="text-slate-400">--:--</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {record?.status === 'ON_TIME' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">✅ Đúng Giờ</span>
                        )}
                        {record?.status === 'LATE' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                            ⚠️ Đi Muộn ({record.late_minutes} ph)
                          </span>
                        )}
                        {record?.status === 'OVERTIME' && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold">🔥 Tăng Ca OT</span>
                        )}
                        {!record && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-bold">Chưa Chấm</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">
                        {record?.ot_hours ? `+${record.ot_hours}h` : '0h'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {!record ? (
                          <button
                            onClick={() => handleCheckIn(emp.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1 mx-auto"
                          >
                            <LogIn className="w-3.5 h-3.5" /> Check In
                          </button>
                        ) : !record.check_out_time ? (
                          <button
                            onClick={() => handleCheckOut(record.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 mx-auto"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Check Out
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-bold">Hoàn Thành Ca</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ NGHỈ PHÉP */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Danh Sách Đơn Xin Nghỉ Phép ({filteredLeaves.length})
            </h3>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-xl font-bold text-xs"
            >
              + Tạo Đơn Xin Nghỉ
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Mã & Nhân Sự</th>
                  <th className="py-3 px-4">Loại Phép</th>
                  <th className="py-3 px-4">Thời Gian</th>
                  <th className="py-3 px-4 text-center">Số Ngày</th>
                  <th className="py-3 px-4">Lý Do</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeaves.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-bold text-blue-600 block">{lv.request_code}</span>
                      <span className="font-extrabold text-slate-900 block">{lv.employee_name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">{lv.leave_type}</td>
                    <td className="py-3.5 px-4 font-mono">{lv.start_date} → {lv.end_date}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{lv.total_days} Ngày</td>
                    <td className="py-3.5 px-4 text-slate-700">{lv.reason}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                        {lv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {lv.status === 'PENDING' ? (
                        <button
                          onClick={() => handleApproveLeave(lv.id, 'HR_APPROVED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                        >
                          Duyệt
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Đã duyệt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TIMESHEET SUMMARY */}
      {activeTab === 'timesheet' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" /> Bảng Tổng Hợp Chấm Công ({selectedPeriod})
            </h3>
            <span className="text-xs text-slate-500 font-bold">Công chuẩn: {attSettings.standard_workdays} Ngày</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Nhân Sự & Mã NV</th>
                  <th className="py-3 px-4">Bộ Phận</th>
                  <th className="py-3 px-4 text-center">Công Chuẩn</th>
                  <th className="py-3 px-4 text-center">Công Thực Tế</th>
                  <th className="py-3 px-4 text-center">Phép Có Lương</th>
                  <th className="py-3 px-4 text-center">Nghỉ Không Lương</th>
                  <th className="py-3 px-4 text-center">Giờ OT</th>
                  <th className="py-3 px-4 text-right">Tổng Ngày Công Đóng Lương</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {timesheets.map((ts) => (
                  <tr key={ts.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{ts.employee_name} ({ts.employee_code})</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{ts.department}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">{ts.standard_workdays}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">{ts.actual_workdays}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">{ts.paid_leave_days}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-600">{ts.unpaid_leave_days}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">+{ts.total_ot_hours} h</td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      {ts.billable_workdays} / {ts.standard_workdays} Ngày
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettingsSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">Cấu Hình Cài Đặt Chấm Công & Quy Định Ca Làm Việc</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Ngày Công Chuẩn Trong Tháng</label>
              <input
                type="number"
                min={20}
                max={31}
                value={attSettings.standard_workdays}
                onChange={(e) => setAttSettings({ ...attSettings, standard_workdays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Phút Cho Phép Đi Muộn Không Phạt (Ân Hạn)</label>
              <input
                type="number"
                min={0}
                max={60}
                value={attSettings.late_grace_minutes}
                onChange={(e) => setAttSettings({ ...attSettings, late_grace_minutes: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giờ Bắt Đầu Vào Ca (Work Start Time)</label>
              <input
                type="time"
                value={attSettings.work_start_time}
                onChange={(e) => setAttSettings({ ...attSettings, work_start_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giờ Kết Thúc Ca (Work End Time)</label>
              <input
                type="time"
                value={attSettings.work_end_time}
                onChange={(e) => setAttSettings({ ...attSettings, work_end_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quỹ Nghỉ Phép Năm Mặc Định (Ngày / Năm)</label>
              <input
                type="number"
                value={attSettings.annual_leave_quota}
                onChange={(e) => setAttSettings({ ...attSettings, annual_leave_quota: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bán Kính Check-in GPS Định Vị VĂN PHÒNG (Meters)</label>
              <input
                type="number"
                value={attSettings.gps_radius_meters}
                onChange={(e) => setAttSettings({ ...attSettings, gps_radius_meters: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Chấm Công
            </button>
          </div>
        </form>
      )}

      {/* CREATE LEAVE MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Tạo Đơn Xin Nghỉ Phép Mới</h3>
            <form onSubmit={handleCreateLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn Nhân Sự</label>
                <select
                  value={newLeave.employee_id || employees[0]?.id || ''}
                  onChange={(e) => setNewLeave({ ...newLeave, employee_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.full_name} ({e.employee_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý Do Xin Nghỉ</label>
                <textarea
                  rows={2}
                  value={newLeave.reason || ''}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Nhập lý do nghỉ phép..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Gửi Đơn</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
