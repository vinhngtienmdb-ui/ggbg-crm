'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  MapPin,
  Camera,
  Globe,
  Sun,
  Moon,
  Lock,
  Unlock,
  FileText,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Briefcase,
  Users,
  Award,
  ArrowUpRight,
  CheckCircle,
  ShieldAlert,
  Key,
  Timer,
  Flame,
  Info
} from 'lucide-react';
import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  AttendanceSettings,
  LeaveType,
  LeaveStatus,
  AttendanceRequest,
  AttendanceRequestType,
  TimesheetPeriodLock,
  WorkShift,
  OvertimeRecord
} from '@/types';
import {
  getAttendance,
  recordCheckIn,
  recordCheckOut,
  getAttendanceRequests,
  createAttendanceRequest,
  approveAttendanceRequest,
  rejectAttendanceRequest,
  deleteAttendanceRequest,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  generateTimekeepingSummary,
  getAttendanceSettings,
  saveAttendanceSettings,
  getPeriodLockStatus,
  lockTimesheetPeriod,
  unlockTimesheetPeriod,
  getOvertimeRecords,
  addOvertimeRecord,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import { getEmployees, getWorkShifts } from '@/lib/hrmStore';
import AttendanceAnalyticsDashboard from '@/components/attendance/AttendanceAnalyticsDashboard';
import AttendanceCheckinModal from '@/components/attendance/AttendanceCheckinModal';
import { formatCurrency } from '@/lib/formatters';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'daily' | 'ot' | 'requests' | 'timesheet'>('reports');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');

  // Store States
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [timesheets, setTimesheets] = useState<TimekeepingSummary[]>([]);
  const [overtimeList, setOvertimeList] = useState<OvertimeRecord[]>(() => getOvertimeRecords());
  const [attSettings, setAttSettings] = useState<AttendanceSettings>(() => getAttendanceSettings());
  const [employees] = useState(() => getEmployees());
  const [workShifts, setWorkShifts] = useState<WorkShift[]>(() => getWorkShifts());
  const [lockStatus, setLockStatus] = useState<TimesheetPeriodLock>(() => getPeriodLockStatus(selectedPeriod));

  const [searchTerm, setSearchTerm] = useState('');
  const [requestFilterType, setRequestFilterType] = useState<string>('ALL');
  const [otFilterType, setOtFilterType] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Checkin Modal State
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [activeEmpForCheckin, setActiveEmpForCheckin] = useState<string | undefined>(undefined);

  // Admin Unlock Modal State
  const [isAdminUnlockModalOpen, setIsAdminUnlockModalOpen] = useState(false);
  const [adminRoleName, setAdminRoleName] = useState('Ban Giám Đốc (CEO / Admin)');
  const [adminPin, setAdminPin] = useState('');
  const [adminUnlockReason, setAdminUnlockReason] = useState('Mở khóa kỳ công để đối soát bổ sung dữ liệu chấm bù và tăng ca');

  // Add OT Modal State
  const [isAddOtModalOpen, setIsAddOtModalOpen] = useState(false);
  const [newOt, setNewOt] = useState({
    employee_id: '',
    date: '2026-07-28',
    ot_type: 'NORMAL_DAY' as 'NORMAL_DAY' | 'WEEKEND' | 'HOLIDAY',
    start_time: '17:30',
    end_time: '19:30',
    hours: 2.0,
    reason: 'Hỗ trợ xử lý chiến dịch bán hàng phát sinh',
  });

  // Unified Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<{
    employee_id: string;
    request_type: AttendanceRequestType;
    leave_type: LeaveType;
    date: string;
    end_date: string;
    total_days: number;
    proposed_check_in: string;
    proposed_check_out: string;
    ot_hours: number;
    outside_location_name: string;
    reason: string;
  }>({
    employee_id: '',
    request_type: 'LATE_EARLY_EXCUSE',
    leave_type: 'ANNUAL',
    date: '2026-07-29',
    end_date: '2026-07-29',
    total_days: 1,
    proposed_check_in: '08:30',
    proposed_check_out: '17:30',
    ot_hours: 2,
    outside_location_name: '',
    reason: '',
  });

  const reloadData = () => {
    setAttendance(getAttendance());
    setRequests(getAttendanceRequests());
    setTimesheets(generateTimekeepingSummary(selectedPeriod));
    setOvertimeList(getOvertimeRecords());
    setAttSettings(getAttendanceSettings());
    setLockStatus(getPeriodLockStatus(selectedPeriod));
    setWorkShifts(getWorkShifts());
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

  // Open modal for specific employee
  const handleOpenCheckinModal = (empId?: string) => {
    setActiveEmpForCheckin(empId);
    setIsCheckinModalOpen(true);
  };

  // Unified Request creation
  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === (newRequest.employee_id || employees[0]?.id)) || employees[0];
    if (!emp) return;

    createAttendanceRequest({
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      request_type: newRequest.request_type,
      leave_type: newRequest.request_type === 'LEAVE' ? newRequest.leave_type : undefined,
      date: newRequest.date,
      end_date: newRequest.request_type === 'LEAVE' ? newRequest.end_date : undefined,
      total_days: newRequest.request_type === 'LEAVE' ? newRequest.total_days : undefined,
      proposed_check_in: newRequest.proposed_check_in,
      proposed_check_out: newRequest.proposed_check_out,
      ot_hours: newRequest.request_type === 'OVERTIME_REQUEST' ? newRequest.ot_hours : undefined,
      outside_location_name: newRequest.outside_location_name,
      reason: newRequest.reason,
    });

    setIsRequestModalOpen(false);
    showToast(`✅ Đã gửi đơn thành công! Hệ thống đang chờ Quản lý & HR phê duyệt.`);
    setNewRequest({
      employee_id: '',
      request_type: 'LATE_EARLY_EXCUSE',
      leave_type: 'ANNUAL',
      date: '2026-07-29',
      end_date: '2026-07-29',
      total_days: 1,
      proposed_check_in: '08:30',
      proposed_check_out: '17:30',
      ot_hours: 2,
      outside_location_name: '',
      reason: '',
    });
  };

  // Unified Request Approval
  const handleApproveRequest = (id: string, role: 'MANAGER' | 'HR' = 'HR') => {
    approveAttendanceRequest(id, role);
    showToast(`🎉 Đã duyệt đơn và TỰ ĐỘNG ĐỒNG BỘ vào bảng chấm công ngày!`);
  };

  const handleRejectRequest = (id: string, role: 'MANAGER' | 'HR' = 'HR') => {
    rejectAttendanceRequest(id, role);
    showToast(`Đã từ chối đơn yêu cầu.`);
  };

  // Timesheet Lock / Unlock
  const handleLockTimesheet = () => {
    lockTimesheetPeriod(selectedPeriod, 'HR Manager (Đặng Kim Anh)');
    setLockStatus(getPeriodLockStatus(selectedPeriod));
    showToast(`🔒 Đã chốt và khóa sổ bảng chấm công ${selectedPeriod}!`);
  };

  // Admin Unlock Submit
  const handleAdminUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUnlockReason.trim()) {
      alert('Vui lòng nhập lý do mở khóa bảng công!');
      return;
    }
    unlockTimesheetPeriod(selectedPeriod, adminRoleName, adminUnlockReason);
    setLockStatus(getPeriodLockStatus(selectedPeriod));
    setIsAdminUnlockModalOpen(false);
    showToast(`🔓 Admin (${adminRoleName}) đã mở khóa kỳ chấm công ${selectedPeriod} thành công!`);
  };

  // Add OT Submit
  const handleAddOtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === (newOt.employee_id || employees[0]?.id)) || employees[0];
    if (!emp) return;

    const multiplier = newOt.ot_type === 'NORMAL_DAY' ? 1.5 : newOt.ot_type === 'WEEKEND' ? 2.0 : 3.0;
    const baseSal = emp.base_salary || 15000000;
    const hourlyRate = baseSal / (26 * 8);
    const amount = Math.round(newOt.hours * hourlyRate * multiplier);

    addOvertimeRecord({
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      date: newOt.date,
      ot_type: newOt.ot_type,
      start_time: newOt.start_time,
      end_time: newOt.end_time,
      hours: newOt.hours,
      pay_multiplier: multiplier,
      request_code: `OT-${Date.now().toString().slice(-6)}`,
      approved_by: 'Trần Giám Đốc',
      reason: newOt.reason,
      calculated_amount: amount,
    });

    setIsAddOtModalOpen(false);
    showToast(`🎉 Đã thêm bản ghi tăng ca cho ${emp.full_name}!`);
  };

  // Filters
  const filteredAttendance = attendance.filter(
    (a) =>
      a.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOvertime = overtimeList.filter((ot) => {
    const matchSearch =
      ot.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ot.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = otFilterType === 'ALL' || ot.ot_type === otFilterType;
    return matchSearch && matchType;
  });

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.request_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = requestFilterType === 'ALL' || r.request_type === requestFilterType;
    return matchSearch && matchType;
  });

  const getRequestTypeName = (type: AttendanceRequestType) => {
    switch (type) {
      case 'LEAVE':
        return 'Nghỉ Phép';
      case 'LATE_EARLY_EXCUSE':
        return 'Vào Trễ / Về Sớm';
      case 'OUTSIDE_WORK':
        return 'Công Tác / Ra Ngoài';
      case 'MISSED_PUNCH_EXPLANATION':
        return 'Giải Trình Quên Chấm Công';
      case 'OVERTIME_REQUEST':
        return 'Đăng Ký Tăng Ca (OT)';
      default:
        return 'Đơn Khác';
    }
  };

  const getRequestTypeBadge = (type: AttendanceRequestType) => {
    switch (type) {
      case 'LEAVE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'LATE_EARLY_EXCUSE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'OUTSIDE_WORK':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'MISSED_PUNCH_EXPLANATION':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'OVERTIME_REQUEST':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Checkin / Checkout Modal */}
      {isCheckinModalOpen && (
        <AttendanceCheckinModal
          isOpen={isCheckinModalOpen}
          defaultEmployeeId={activeEmpForCheckin}
          onClose={() => {
            setIsCheckinModalOpen(false);
            setActiveEmpForCheckin(undefined);
          }}
          onSuccess={() => {
            reloadData();
            showToast('🎉 Ghi nhận chấm công thành công!');
          }}
        />
      )}

      {/* Top Banner Header - Matching Overview Design */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Trung Tâm Chấm Công & Quản Lý Kỷ Luật Lao Động GGBingo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Quản Lý Chấm Công, Chi Tiết Công & Chốt Kỳ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-2xl leading-relaxed">
            Hệ thống chấm công Camera Face ID & GPS đa ca, chi tiết công thường, công tăng ca (OT), bóc tách phép năm/lễ tết/việc riêng và chốt bảng công bảo mật quyền Admin.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Trạng Thái Kỳ Công</p>
            <p className={`text-base font-semibold tabular-numbers flex items-center gap-1.5 ${lockStatus.is_locked ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {lockStatus.is_locked ? (
                <>
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>ĐÃ KHÓA SỔ</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>ĐANG MỞ KỲ</span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-xs text-slate-800 dark:text-slate-200 shadow-xs"
            >
              <option value="Tháng 06/2026">Kỳ Tháng 06/2026</option>
              <option value="Tháng 07/2026">Kỳ Tháng 07/2026</option>
              <option value="Tháng 08/2026">Kỳ Tháng 08/2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCHER ACTION BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
        <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Thao Tác Nhanh:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCheckinModal()}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" /> + Chấm Công Live (Face ID & GPS)
          </button>
          <button
            onClick={() => setIsAddOtModalOpen(true)}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            <Flame className="w-3.5 h-3.5 text-purple-600" /> + Ghi Nhận Tăng Ca (OT)
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" /> + Nộp Đơn / Giải Trình
          </button>
          {lockStatus.is_locked ? (
            <button
              onClick={() => setIsAdminUnlockModalOpen(true)}
              className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-1.5 transition-colors font-semibold"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> 🔓 Admin Mở Khóa Bảng Công
            </button>
          ) : (
            <button
              onClick={handleLockTimesheet}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
            >
              <Lock className="w-3.5 h-3.5 text-rose-600" /> 🔒 Chốt Bảng Chấm Công
            </button>
          )}
          <Link
            href="/hrm-settings?tab=TIMEKEEPING_SHIFTS"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" /> Cài Đặt Ca & Lịch Chốt
          </Link>
        </div>
      </div>

      {/* Tabs Bar - 5 Operational Core Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>1. Báo Cáo & Thống Kê Đi Làm</span>
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'daily'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>2. Chi Tiết Công Bình Thường ({filteredAttendance.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ot')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ot'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>3. Chi Tiết Công Tăng Ca (OT) ({filteredOvertime.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>4. Đơn Từ & Phê Duyệt ({requests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('timesheet')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'timesheet'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>5. Bảng Tổng Hợp Công Tháng & Chốt Kỳ ({timesheets.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REPORTS & ANALYTICS DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <AttendanceAnalyticsDashboard
          attendance={attendance}
          leaves={getLeaveRequests()}
          timesheets={timesheets}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHI TIẾT CÔNG BÌNH THƯỜNG (DAILY SHIFTS) */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm nhân sự theo tên, mã NV, phòng ban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Ngày xem: {new Date().toLocaleDateString('vi-VN')}</span>
              <button
                onClick={() => handleOpenCheckinModal()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Camera className="w-3.5 h-3.5" /> + Chấm Công Live
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                  <th className="py-3 px-4">Nhân Sự & Mã</th>
                  <th className="py-3 px-4">Phòng Ban</th>
                  <th className="py-3 px-4">Ca Được Gán</th>
                  <th className="py-3 px-4 text-center">Giờ Vào Ca</th>
                  <th className="py-3 px-4 text-center">Giờ Ra Ca</th>
                  <th className="py-3 px-4 text-center">Công Chuẩn</th>
                  <th className="py-3 px-4 text-center">Vị Trí & GPS</th>
                  <th className="py-3 px-4 text-center">Face ID</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {employees.map((emp) => {
                  const today = new Date().toISOString().split('T')[0];
                  const record = filteredAttendance.find((a) => a.employee_id === emp.id && a.date === today) ||
                    filteredAttendance.find((a) => a.employee_id === emp.id);

                  const hasCheckedIn = !!record?.check_in_time;
                  const hasCheckedOut = !!record?.check_out_time;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">{emp.full_name}</span>
                        <span className="text-[10px] text-slate-400 block font-medium">{emp.employee_code}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{emp.department}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-blue-700 dark:text-blue-300 block">
                          {record?.shift_name || 'Ca Hành Chính'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                          {record?.shift_start_time || '08:00'} - {record?.shift_end_time || '17:30'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center tabular-nums font-medium text-blue-700 dark:text-blue-400">
                        {record?.check_in_time ? (
                          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
                            {record.check_in_time}
                          </span>
                        ) : (
                          <span className="text-slate-400">--:--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center tabular-nums font-medium text-emerald-700 dark:text-emerald-400">
                        {record?.check_out_time ? (
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold">
                            {record.check_out_time}
                          </span>
                        ) : (
                          <span className="text-slate-400">--:--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {hasCheckedIn ? '1.0 Công (8h)' : '0.0'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {record?.check_in_location_type === 'OUTSIDE_REMOTE' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-md font-semibold text-[10px] flex items-center gap-1">
                              <Globe className="w-3 h-3 text-amber-600" /> Ngoài VP
                            </span>
                            {record.outside_reason && (
                              <span className="text-[9px] text-slate-400 truncate max-w-[120px] block mt-0.5" title={record.outside_reason}>
                                {record.outside_reason}
                              </span>
                            )}
                          </div>
                        ) : record?.check_in_time ? (
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md font-medium text-[10px] inline-flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-emerald-600" /> Trụ Sở (Hợp Lệ)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Chưa xác thực</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {record?.check_in_face_image ? (
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full font-medium text-[10px] inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-blue-600" /> Đã Xác Thực
                          </span>
                        ) : record?.check_in_time ? (
                          <span className="text-slate-500 text-[10px]">Vân tay / Thẻ</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {record?.status === 'ON_TIME' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-semibold text-[10px]">
                            Đúng Giờ
                          </span>
                        )}
                        {record?.status === 'LATE' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full font-semibold text-[10px]">
                            Muộn {record.late_minutes}p
                          </span>
                        )}
                        {record?.status === 'OVERTIME' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-full font-semibold text-[10px]">
                            Tăng Ca +{record.ot_hours}h
                          </span>
                        )}
                        {!record && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full font-medium text-[10px]">
                            Chưa Check-in
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {!hasCheckedIn ? (
                          <button
                            onClick={() => handleOpenCheckinModal(emp.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all mx-auto"
                          >
                            <Sun className="w-3.5 h-3.5" /> Check-in
                          </button>
                        ) : !hasCheckedOut ? (
                          <button
                            onClick={() => handleOpenCheckinModal(emp.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all mx-auto"
                          >
                            <Moon className="w-3.5 h-3.5" /> Check-out
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg font-medium text-[11px] inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Đã Xong Ca
                          </span>
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

      {/* ========================================================================= */}
      {/* TAB 3: CHI TIẾT CÔNG TĂNG CA (OVERTIME LOGS) */}
      {/* ========================================================================= */}
      {activeTab === 'ot' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên nhân sự, mã NV, phòng ban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>

              <select
                value={otFilterType}
                onChange={(e) => setOtFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Tất Cả Loại Tăng Ca</option>
                <option value="NORMAL_DAY">OT Ngày Thường (x150%)</option>
                <option value="WEEKEND">OT Cuối Tuần / Nghỉ Tuần (x200%)</option>
                <option value="HOLIDAY">OT Ngày Nghỉ Lễ Tết (x300%)</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddOtModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> + Thêm Bản Ghi Tăng Ca
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                  <th className="py-3 px-4">Nhân Sự & Mã</th>
                  <th className="py-3 px-4">Phòng Ban</th>
                  <th className="py-3 px-4">Ngày Tăng Ca</th>
                  <th className="py-3 px-4 text-center">Phân Loại OT</th>
                  <th className="py-3 px-4 text-center">Khung Giờ (Từ - Đến)</th>
                  <th className="py-3 px-4 text-center">Số Giờ OT</th>
                  <th className="py-3 px-4">Đơn Duyệt & Người Duyệt</th>
                  <th className="py-3 px-4 text-right">Tạm Tính Tiền OT</th>
                  <th className="py-3 px-4">Lý Do Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredOvertime.map((ot) => (
                    <tr key={ot.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white block">{ot.employee_name}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">{ot.employee_code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{ot.department}</td>
                    <td className="py-3.5 px-4 tabular-nums font-semibold text-slate-800 dark:text-slate-200">{ot.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      {ot.ot_type === 'NORMAL_DAY' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full font-bold text-[10px]">
                          ⚡ Ngày Thường (x150%)
                        </span>
                      )}
                      {ot.ot_type === 'WEEKEND' && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-full font-bold text-[10px]">
                          🔥 Cuối Tuần (x200%)
                        </span>
                      )}
                      {ot.ot_type === 'HOLIDAY' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full font-bold text-[10px]">
                          🌟 Nghỉ Lễ Tết (x300%)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
                      {ot.start_time} - {ot.end_time}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-bold text-purple-600 text-sm">
                      +{ot.hours}h
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold text-blue-600 block">{ot.request_code || 'OT-DIRECT'}</span>
                      <span className="text-[11px] text-slate-500 block">Duyệt: {ot.approved_by}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums font-bold text-emerald-600">
                      {formatCurrency(ot.calculated_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={ot.reason}>
                      {ot.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: UNIFIED ATTENDANCE REQUESTS & APPROVALS (ĐƠN TỪ & GIẢI TRÌNH) */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm đơn theo mã đơn, nhân viên, lý do..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>

              <select
                value={requestFilterType}
                onChange={(e) => setRequestFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Tất Cả Loại Đơn</option>
                <option value="LATE_EARLY_EXCUSE">Đơn Vào Trễ / Về Sớm</option>
                <option value="OUTSIDE_WORK">Đơn Đi Ra Ngoài / Công Tác</option>
                <option value="MISSED_PUNCH_EXPLANATION">Giải Trình Quên Chấm Công</option>
                <option value="LEAVE">Đơn Xin Nghỉ Phép</option>
                <option value="OVERTIME_REQUEST">Đăng Ký Tăng Ca (OT)</option>
              </select>
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> + Tạo Đơn Yêu Cầu / Giải Trình
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                  <th className="py-3 px-4">Mã Đơn & Nhân Sự</th>
                  <th className="py-3 px-4">Loại Đơn</th>
                  <th className="py-3 px-4">Ngày & Giờ Áp Dụng</th>
                  <th className="py-3 px-4">Lý Do Chi Tiết & Địa Điểm</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Phê Duyệt & Đồng Bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold text-blue-600 block tabular-nums">{req.request_code}</span>
                      <span className="font-semibold text-slate-900 dark:text-white block">{req.employee_name}</span>
                      <span className="text-[10px] text-slate-400 block">{req.employee_code} · {req.department}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[10px] inline-block ${getRequestTypeBadge(req.request_type)}`}>
                        {getRequestTypeName(req.request_type)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block tabular-nums">{req.date}</span>
                      {req.proposed_check_in && (
                        <span className="text-[10px] text-slate-400 block tabular-nums">Vào: {req.proposed_check_in} · Ra: {req.proposed_check_out}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      {req.outside_location_name && (
                        <span className="font-semibold text-blue-600 block truncate">📍 {req.outside_location_name}</span>
                      )}
                      <span className="truncate block">{req.reason}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {req.status === 'PENDING' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full font-semibold text-[10px]">
                          ⏳ Chờ Duyệt
                        </span>
                      )}
                      {req.status === 'MANAGER_APPROVED' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full font-semibold text-[10px]">
                          👔 Quản Lý Đã Duyệt
                        </span>
                      )}
                      {req.status === 'HR_APPROVED' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-semibold text-[10px]">
                          ✅ HR Đã Duyệt (Đồng Bộ)
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full font-semibold text-[10px]">
                          ❌ Từ Chối
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {req.status === 'PENDING' || req.status === 'MANAGER_APPROVED' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleApproveRequest(req.id, 'HR')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                            title="HR Duyệt và đồng bộ công"
                          >
                            <Check className="w-3 h-3" /> Duyệt
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id, 'HR')}
                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-semibold text-[11px] transition-colors"
                            title="Từ chối đơn"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BẢNG TỔNG HỢP CÔNG THÁNG TOÀN DIỆN (ĐẦY ĐỦ CÁC LOẠI PHÉP & OT) */}
      {/* ========================================================================= */}
      {activeTab === 'timesheet' && (
        <div className="space-y-4">
          {/* Timesheet Lock Header Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Bảng Tổng Hợp Chấm Công Toàn Diện ({selectedPeriod})
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Công chuẩn kỳ: <strong>{attSettings.standard_workdays} Ngày</strong> • Bóc tách đầy đủ Phép năm (AL), Nghỉ lễ (HL 100%), Việc riêng có lương, Nghỉ ốm / Thai sản và Giờ OT
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lockStatus.is_locked ? (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-900 dark:text-rose-200 text-xs font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Đã Khóa Sổ ({lockStatus.locked_by} · {lockStatus.locked_at?.slice(0, 10)})</span>
                  </div>
                  <button
                    onClick={() => setIsAdminUnlockModalOpen(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> 🔓 Admin Mở Khóa
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLockTimesheet}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4" /> 🔒 Chốt & Khóa Bảng Công Kỳ Này
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase text-[11px]">
                  <th className="py-3 px-3">Nhân Sự & Mã</th>
                  <th className="py-3 px-3">Phòng Ban</th>
                  <th className="py-3 px-2 text-center" title="Công chuẩn chế độ trong tháng">Công Chuẩn</th>
                  <th className="py-3 px-2 text-center" title="Số ngày công làm thực tế">Công Đi Làm</th>
                  <th className="py-3 px-2 text-center" title="Nghỉ phép năm hưởng 100% lương (AL)">Phép Năm (AL)</th>
                  <th className="py-3 px-2 text-center" title="Nghỉ lễ tết toàn quốc hưởng 100% lương (HL)">Nghỉ Lễ (HL)</th>
                  <th className="py-3 px-2 text-center" title="Nghỉ việc riêng có lương (Cưới xin, tang chế)">Việc Riêng Hưởng Lương</th>
                  <th className="py-3 px-2 text-center" title="Nghỉ việc riêng không lương (UL)">Nghỉ Không Lương (UL)</th>
                  <th className="py-3 px-2 text-center" title="Nghỉ ốm / Thai sản hưởng trợ cấp BHXH">Nghỉ Ốm/Thai Sản</th>
                  <th className="py-3 px-2 text-center" title="Số lần & số phút đi muộn">Đi Muộn</th>
                  <th className="py-3 px-2 text-center" title="Số giờ OT Ngày thường (x150%)">OT Thường (h)</th>
                  <th className="py-3 px-2 text-center" title="Số giờ OT Nghỉ tuần / Lễ (x200%, x300%)">OT Nghỉ Tuần (h)</th>
                  <th className="py-3 px-3 text-right" title="Tổng ngày công quy đổi tính lương chuyển sang bảng lương 3P">Tổng Công Tính Lương</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {timesheets.map((ts) => (
                  <tr key={ts.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white block">{ts.employee_name}</span>
                      <span className="text-[10px] text-slate-400 tabular-nums block">{ts.employee_code}</span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">{ts.department}</td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-slate-600 dark:text-slate-400">
                      {ts.standard_workdays}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-bold text-blue-700 dark:text-blue-400">
                      {ts.actual_workdays}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-emerald-700 dark:text-emerald-400">
                      {ts.paid_leave_days > 0 ? `${ts.paid_leave_days} d` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-indigo-700 dark:text-indigo-400">
                      {ts.holiday_leave_days ? `${ts.holiday_leave_days} d` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-purple-700 dark:text-purple-400">
                      {ts.special_paid_leave_days ? `${ts.special_paid_leave_days} d` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-rose-600">
                      {ts.unpaid_leave_days > 0 ? `${ts.unpaid_leave_days} d` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-medium text-amber-600">
                      {ts.sick_leave_days ? `${ts.sick_leave_days} d (SL)` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 text-[11px]">
                      {ts.late_count > 0 ? (
                        <span className="text-amber-600 font-semibold">{ts.late_count}L ({ts.total_late_minutes}p)</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-semibold text-blue-600">
                      {ts.normal_ot_hours ? `+${ts.normal_ot_hours}h` : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-semibold text-purple-600">
                      {ts.weekend_ot_hours ? `+${ts.weekend_ot_hours}h` : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {ts.billable_workdays} / {ts.standard_workdays} Ngày
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADMIN XÁC THỰC MỞ KHÓA BẢNG CHẤM CÔNG */}
      {/* ========================================================================= */}
      {isAdminUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Xác Thực Quyền Admin Mở Khóa Bảng Công
                </h3>
              </div>
              <button
                onClick={() => setIsAdminUnlockModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Kỳ chấm công <strong>{selectedPeriod}</strong> đã được chốt và khóa sổ. Chỉ tài khoản Quản Trị Viên / Ban Giám Đốc mới có thẩm quyền mở khóa để điều chỉnh dữ liệu.
              </span>
            </div>

            <form onSubmit={handleAdminUnlockSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Cấp Bậc / Thẩm Quyền Mở Khóa *</label>
                <select
                  value={adminRoleName}
                  onChange={(e) => setAdminRoleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Ban Giám Đốc (CEO / Tổng Giám Đốc)">1. Ban Giám Đốc (CEO / Tổng Giám Đốc)</option>
                  <option value="Quản Trị Viên Hệ Thống (System Admin)">2. Quản Trị Viên Hệ Thống (System Admin)</option>
                  <option value="Giám Đốc Nhân Sự (HR Director)">3. Giám Đốc Nhân Sự (HR Director)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Bảo Mật / PIN Admin Xác Thực</label>
                <input
                  type="password"
                  placeholder="Nhập mã PIN xác nhận (Mặc định: admin123)..."
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lý Do Mở Khóa Kỳ Công *</label>
                <textarea
                  rows={3}
                  required
                  value={adminUnlockReason}
                  onChange={(e) => setAdminUnlockReason(e.target.value)}
                  placeholder="Nhập lý do chi tiết mở khóa..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAdminUnlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" /> Xác Thực & Mở Khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM BẢN GHI TĂNG CA (OT) */}
      {/* ========================================================================= */}
      {isAddOtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Thêm Bản Ghi Tăng Ca (Overtime - OT)
                </h3>
              </div>
              <button
                onClick={() => setIsAddOtModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOtSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nhân Sự Tăng Ca *</label>
                <select
                  value={newOt.employee_id || employees[0]?.id || ''}
                  onChange={(e) => setNewOt({ ...newOt, employee_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_code}) - {e.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày Tăng Ca *</label>
                  <input
                    type="date"
                    required
                    value={newOt.date}
                    onChange={(e) => setNewOt({ ...newOt, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Loại Tăng Ca *</label>
                  <select
                    value={newOt.ot_type}
                    onChange={(e) => setNewOt({ ...newOt, ot_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-purple-600"
                  >
                    <option value="NORMAL_DAY">Ngày Thường (x150%)</option>
                    <option value="WEEKEND">Cuối Tuần (x200%)</option>
                    <option value="HOLIDAY">Lễ Tết (x300%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Từ Giờ</label>
                  <input
                    type="time"
                    value={newOt.start_time}
                    onChange={(e) => setNewOt({ ...newOt, start_time: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Đến Giờ</label>
                  <input
                    type="time"
                    value={newOt.end_time}
                    onChange={(e) => setNewOt({ ...newOt, end_time: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Số Giờ (h) *</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={12}
                    value={newOt.hours}
                    onChange={(e) => setNewOt({ ...newOt, hours: Number(e.target.value) })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-purple-600 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lý Do / Công Việc OT *</label>
                <textarea
                  rows={2}
                  required
                  value={newOt.reason}
                  onChange={(e) => setNewOt({ ...newOt, reason: e.target.value })}
                  placeholder="VD: Setup cổng thanh toán & cấu hình Flash Sale..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddOtModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                >
                  Lưu Bản Ghi OT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE UNIFIED REQUEST MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tạo Đơn Yêu Cầu Chấm Công / Giải Trình
                </h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Chọn Loại Đơn *</label>
                <select
                  value={newRequest.request_type}
                  onChange={(e) => setNewRequest({ ...newRequest, request_type: e.target.value as AttendanceRequestType })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-purple-700 dark:text-purple-300"
                >
                  <option value="LATE_EARLY_EXCUSE">1. Đơn Xin Vào Trễ / Về Sớm (Lý Do Bất Khả Kháng)</option>
                  <option value="OUTSIDE_WORK">2. Đơn Xin Đi Ra Ngoài / Công Tác Thị Trường</option>
                  <option value="MISSED_PUNCH_EXPLANATION">3. Giải Trình Quên Chấm Công (Vào/Ra)</option>
                  <option value="LEAVE">4. Đơn Xin Nghỉ Phép (Phép Năm / Nghỉ Ốm / Không Lương)</option>
                  <option value="OVERTIME_REQUEST">5. Đơn Đăng Ký Tăng Ca (OT)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nhân Viên Làm Đơn *</label>
                <select
                  value={newRequest.employee_id || employees[0]?.id || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, employee_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_code}) - {e.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional fields based on type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày Áp Dụng *</label>
                  <input
                    type="date"
                    required
                    value={newRequest.date}
                    onChange={(e) => setNewRequest({ ...newRequest, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>

                {newRequest.request_type === 'LEAVE' && (
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Loại Nghỉ Phép</label>
                    <select
                      value={newRequest.leave_type}
                      onChange={(e) => setNewRequest({ ...newRequest, leave_type: e.target.value as LeaveType })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="ANNUAL">Phép Năm Có Lương</option>
                      <option value="SICK">Nghỉ Ốm Hưởng BHXH</option>
                      <option value="MATERNITY">Nghỉ Thai Sản</option>
                      <option value="UNPAID">Nghỉ Không Hưởng Lương</option>
                    </select>
                  </div>
                )}

                {(newRequest.request_type === 'LATE_EARLY_EXCUSE' || newRequest.request_type === 'MISSED_PUNCH_EXPLANATION') && (
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Giờ Vào/Ra Đề Xuất</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="time"
                        value={newRequest.proposed_check_in}
                        onChange={(e) => setNewRequest({ ...newRequest, proposed_check_in: e.target.value })}
                        className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                      />
                    </div>
                  </div>
                )}

                {newRequest.request_type === 'OVERTIME_REQUEST' && (
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Số Giờ Tăng Ca (OT)</label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.5}
                      max={8}
                      value={newRequest.ot_hours}
                      onChange={(e) => setNewRequest({ ...newRequest, ot_hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                )}
              </div>

              {newRequest.request_type === 'OUTSIDE_WORK' && (
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Địa Điểm Làm Việc / Khách Hàng</label>
                  <input
                    type="text"
                    placeholder="VD: Gặp khách hàng đối tác tại Aeon Mall Hà Đông..."
                    value={newRequest.outside_location_name}
                    onChange={(e) => setNewRequest({ ...newRequest, outside_location_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lý Do Chi Tiết / Giải Trình *</label>
                <textarea
                  rows={2}
                  required
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  placeholder="Nhập lý do chi tiết giải trình..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                >
                  Gửi Đơn Yêu Cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
