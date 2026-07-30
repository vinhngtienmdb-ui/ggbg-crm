'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Printer,
  Eye,
  Check,
  X,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Building2,
  User,
  LogOut,
  LogIn,
  FileText,
  Lock
} from 'lucide-react';
import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  PayrollSheet,
  LeaveType,
  LeaveStatus,
  PayrollStatus
} from '@/types';
import {
  getAttendance,
  recordCheckIn,
  recordCheckOut,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  generateTimekeepingSummary,
  getPayrollByPeriod,
  generateMonthlyPayroll,
  sendPaystubEmail,
  sendBatchPaystubs,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import { getEmployees } from '@/lib/hrmStore';
import PaystubModal from '@/components/payroll/PaystubModal';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'timesheet' | 'payroll'>('attendance');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');

  // Stores data
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [timesheets, setTimesheets] = useState<TimekeepingSummary[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollSheet[]>([]);
  const [employees] = useState(() => getEmployees());

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [selectedPaystub, setSelectedPaystub] = useState<PayrollSheet | null>(null);
  const [isPaystubOpen, setIsPaystubOpen] = useState(false);

  // Leave Modal
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
    setPayrolls(getPayrollByPeriod(selectedPeriod));
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

  // Check In / Check Out Handler
  const handleCheckIn = (empId: string) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    recordCheckIn(empId, timeNow);
    showToast(`✅ Đã check-in thành công vào ca (${timeNow})!`);
  };

  const handleCheckOut = (attId: string) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    recordCheckOut(attId, timeNow, 1.5);
    showToast(`🏁 Đã check-out và ghi nhận OT (+1.5 giờ)!`);
  };

  // Leave Handlers
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
    updateLeaveStatus(id, status, 'Đã phê duyệt theo đúng quy chế HR');
    showToast(`✅ Đã duyệt đơn xin nghỉ phép!`);
  };

  // Payroll Actions
  const handleCalculatePayroll = () => {
    const updated = generateMonthlyPayroll(selectedPeriod);
    setPayrolls(updated);
    showToast(`⚡ Đã tự động tính bảng lương tháng ${selectedPeriod}!`);
  };

  const handleSendSinglePaystub = (id: string) => {
    sendPaystubEmail(id);
    showToast(`📧 Đã gửi phiếu lương qua Email & Zalo ZNS thành công!`);
    setIsPaystubOpen(false);
  };

  const handleBatchSendPaystubs = () => {
    sendBatchPaystubs(selectedPeriod);
    showToast(`📧 Đã gửi hàng loạt phiếu lương cho tất cả nhân sự tháng ${selectedPeriod}!`);
  };

  // Filtered lists
  const filteredAttendance = useMemo(() => {
    return attendance.filter(
      (a) =>
        a.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendance, searchTerm]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter(
      (l) =>
        l.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaves, searchTerm]);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(
      (p) =>
        p.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payrolls, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Chấm Công, Nghỉ Phép & Bảng Lương</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Quy Trình Tự Động 3P
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chấm công hàng ngày, quản lý nghỉ phép, tổng hợp công, tính lương P1-P2-P3 & tự động gửi phiếu lương
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tạo Đơn Xin Nghỉ Phép
          </button>
          <button
            onClick={handleCalculatePayroll}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Tính Lương Tự Động
          </button>
          <button
            onClick={handleBatchSendPaystubs}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" /> Gửi Bảng Lương Hàng Loạt
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-400" /> 1. Chấm Công Hàng Ngày
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'leaves'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" /> 2. Quản Lý Nghỉ Phép ({leaves.length})
        </button>

        <button
          onClick={() => setActiveTab('timesheet')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'timesheet'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" /> 3. Tổng Hợp Chấm Công
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'payroll'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> 4. Bảng Lương & Gửi Phiếu Lương
        </button>
      </div>

      {/* Filter Bar */}
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

      {/* TAB 1: CHẤM CÔNG HÀNG NGÀY */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Nhật Ký Chấm Công Hàng Ngày (GPS & Time Tracker)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Giờ vào ca chuẩn: 08:00 - 08:30</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Nhân Sự</th>
                  <th className="py-3 px-4">Ngày Chấm Công</th>
                  <th className="py-3 px-4 text-center">Giờ Vào Ca</th>
                  <th className="py-3 px-4 text-center">Giờ Ra Ca</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">OT Tăng Ca</th>
                  <th className="py-3 px-4 text-center">Thao Tác Fast Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {employees.map((emp) => {
                  const record = attendance.find((a) => a.employee_id === emp.id);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">{emp.full_name}</span>
                        <span className="text-[10px] text-slate-400 block">{emp.employee_code} · {emp.department}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        {record?.date || '2026-07-29'}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">
                        {record?.check_in_time ? (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                            {record.check_in_time}
                          </span>
                        ) : (
                          <span className="text-slate-400">Chưa vào ca</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                        {record?.check_out_time ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                            {record.check_out_time}
                          </span>
                        ) : (
                          <span className="text-slate-400">--:--</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {record?.status === 'ON_TIME' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            ✅ Đúng Giờ
                          </span>
                        )}
                        {record?.status === 'LATE' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                            ⚠️ Đi Muộn ({record.late_minutes} ph)
                          </span>
                        )}
                        {record?.status === 'OVERTIME' && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold">
                            🔥 Tăng Ca OT
                          </span>
                        )}
                        {!record && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-bold">
                            Chưa Chấm
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">
                        {record?.ot_hours ? `+${record.ot_hours} giờ` : '0h'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {!record ? (
                            <button
                              onClick={() => handleCheckIn(emp.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm active:scale-95"
                            >
                              <LogIn className="w-3.5 h-3.5" /> Check In
                            </button>
                          ) : !record.check_out_time ? (
                            <button
                              onClick={() => handleCheckOut(record.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm active:scale-95"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Check Out
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-bold">Hoàn Thành Ca</span>
                          )}
                        </div>
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
              <Calendar className="w-4 h-4 text-purple-600" /> Danh Sách Đơn Xin Nghỉ Phép & Phê Duyệt
            </h3>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm active:scale-95 text-xs"
            >
              <Plus className="w-4 h-4" /> Tạo Đơn Xin Nghỉ Phép
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Mã & Nhân Sự</th>
                  <th className="py-3 px-4">Loại Nghỉ Phép</th>
                  <th className="py-3 px-4">Thời Gian Nghỉ</th>
                  <th className="py-3 px-4 text-center">Số Ngày</th>
                  <th className="py-3 px-4">Lý Do Nghỉ</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Duyệt Đơn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeaves.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-bold text-blue-600 block">{lv.request_code}</span>
                      <span className="font-extrabold text-slate-900 block">{lv.employee_name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {lv.leave_type === 'ANNUAL' && '🏝️ Phép Năm'}
                        {lv.leave_type === 'SICK' && '🏥 Nghỉ Ốm BHXH'}
                        {lv.leave_type === 'MATERNITY' && '👶 Thai Sản'}
                        {lv.leave_type === 'UNPAID' && '📌 Không Lương'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {lv.start_date} → {lv.end_date}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-900">
                      {lv.total_days} Ngày
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-700">{lv.reason}</td>

                    <td className="py-3.5 px-4 text-center">
                      {lv.status === 'HR_APPROVED' || lv.status === 'MANAGER_APPROVED' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          ✅ Đã Phê Duyệt
                        </span>
                      ) : lv.status === 'REJECTED' ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold">
                          ❌ Từ Chối
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                          ⏳ Chờ Duyệt
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {lv.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleApproveLeave(lv.id, 'HR_APPROVED')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg font-bold"
                            title="Duyệt Đơn Nghỉ"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveLeave(lv.id, 'REJECTED')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold"
                            title="Từ Chối Đơn"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredLeaves.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Chưa có đơn xin nghỉ phép nào trong kỳ này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TỔNG HỢP CHẤM CÔNG THÁNG */}
      {activeTab === 'timesheet' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" /> Bảng Tổng Hợp Chấm Công Tháng ({selectedPeriod})
            </h3>
            <span className="text-xs text-slate-500 font-medium">Số ngày công chuẩn tiêu chuẩn: 26 ngày</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">Nhân Sự & Mã NV</th>
                  <th className="py-3 px-4">Bộ Phận</th>
                  <th className="py-3 px-4 text-center">Công Chuẩn</th>
                  <th className="py-3 px-4 text-center">Công Thực Tế</th>
                  <th className="py-3 px-4 text-center">Nghỉ Phép Có Lương</th>
                  <th className="py-3 px-4 text-center">Nghỉ Không Lương</th>
                  <th className="py-3 px-4 text-center">Đi Muộn (Phút)</th>
                  <th className="py-3 px-4 text-center">Giờ Tăng Ca OT</th>
                  <th className="py-3 px-4 text-right">Tổng Ngày Công Đóng Lương</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {timesheets.map((ts) => (
                  <tr key={ts.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 block">{ts.employee_name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{ts.employee_code}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-700">{ts.department}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">{ts.standard_workdays}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">{ts.actual_workdays}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">{ts.paid_leave_days}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-600">{ts.unpaid_leave_days}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">{ts.total_late_minutes} ph</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">+{ts.total_ot_hours} h</td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      {ts.billable_workdays} / 26 Ngày
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BẢNG LƯƠNG & GỬI PHIẾU LƯƠNG */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Bảng Lương Tổng Hợp {selectedPeriod} (Cấu Trúc 3P)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                P1 (Lương Cứng Công) + P2 (Phụ Cấp) + P3 (Hiệu Suất KPI) + OT Tăng Ca - Bảo Hiểm - Thuế TNCN
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCalculatePayroll}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Tính Điểm & Lương
              </button>
              <button
                onClick={handleBatchSendPaystubs}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" /> Gửi Hàng Loạt
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="py-3.5 px-4">Mã & Nhân Sự</th>
                    <th className="py-3.5 px-4 text-right">Lương P1 (Cứng)</th>
                    <th className="py-3.5 px-4 text-right">Phụ Cấp P2</th>
                    <th className="py-3.5 px-4 text-right">Lương P3 (Hiệu Suất)</th>
                    <th className="py-3.5 px-4 text-right">OT & Thưởng</th>
                    <th className="py-3.5 px-4 text-right">Tổng Khấu Trừ</th>
                    <th className="py-3.5 px-4 text-right">Lương Thực Nhận (NET)</th>
                    <th className="py-3.5 px-4 text-center">Trạng Thái Gửi</th>
                    <th className="py-3.5 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPayrolls.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">{p.payroll_code}</span>
                        <span className="font-extrabold text-slate-900 block truncate">{p.employee_name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{p.department}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {p.p1_calculated_salary.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                        {p.p2_allowances.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700">
                        {p.p3_performance_salary.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-700">
                        {(p.ot_salary + p.bonus_amount).toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600">
                        -{p.total_deductions.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                        {p.net_salary.toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {p.status === 'SENT_PAYSTUB' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            ✅ Đã Gửi Email/ZNS
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                            📝 Bản Thảo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedPaystub(p);
                              setIsPaystubOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-bold"
                            title="Xem Chi Tiết Phiếu Lương"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendSinglePaystub(p.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg font-bold"
                            title="Gửi Phiếu Lương Qua Email/Zalo"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPayrolls.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Chưa có dữ liệu bảng lương cho kỳ {selectedPeriod}. Nhấp &apos;Tính Điểm & Lương&apos; để khởi tạo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LEAVE REQUEST MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" /> Tạo Đơn Xin Nghỉ Phép Mới
              </h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Nhân Sự Xin Nghỉ</label>
                <select
                  value={newLeave.employee_id || employees[0]?.id}
                  onChange={(e) => setNewLeave({ ...newLeave, employee_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_code} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại Nghỉ Phép</label>
                  <select
                    value={newLeave.leave_type}
                    onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value as LeaveType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="ANNUAL">🏝️ Phép Năm</option>
                    <option value="SICK">🏥 Nghỉ Ốm BHXH</option>
                    <option value="MATERNITY">👶 Thai Sản</option>
                    <option value="UNPAID">📌 Không Lương</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Ngày Nghỉ</label>
                  <input
                    type="number"
                    min={0.5}
                    max={30}
                    step={0.5}
                    value={newLeave.total_days}
                    onChange={(e) => setNewLeave({ ...newLeave, total_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Từ Ngày</label>
                  <input
                    type="date"
                    value={newLeave.start_date}
                    onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đến Ngày</label>
                  <input
                    type="date"
                    value={newLeave.end_date}
                    onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý Do Nghỉ Phép</label>
                <textarea
                  rows={2}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Ghi rõ lý do xin nghỉ phép..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-md shadow-purple-600/30"
                >
                  Gửi Đơn Xin Nghỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYSTUB MODAL */}
      <PaystubModal
        isOpen={isPaystubOpen}
        onClose={() => setIsPaystubOpen(false)}
        payroll={selectedPaystub}
        onSendEmail={handleSendSinglePaystub}
      />
    </div>
  );
}
