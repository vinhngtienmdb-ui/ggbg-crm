import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  PayrollSheet,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  PayrollStatus,
  AttendanceSettings,
  PayrollSettings
} from '@/types';
import { getEmployees } from './hrmStore';
import { getScorecardsByPeriod } from './performanceStore';

export const PAYROLL_UPDATED_EVENT = 'ggbg_payroll_updated_event';

export const DEFAULT_ATTENDANCE_SETTINGS: AttendanceSettings = {
  standard_workdays: 26,
  work_start_time: '08:00',
  work_end_time: '17:30',
  late_grace_minutes: 15,
  ot_min_hours: 1.0,
  annual_leave_quota: 12,
  gps_radius_meters: 200,
  allowed_ip_range: '192.168.1.0/24',
};

export const DEFAULT_PAYROLL_SETTINGS: PayrollSettings = {
  p2_lunch_allowance: 730000,
  p2_phone_allowance: 300000,
  p2_transport_allowance: 500000,
  bhxh_percent: 8.0,
  bhyt_percent: 1.5,
  bhtn_percent: 1.0,
  late_penalty_per_instance: 50000,
  ot_multiplier_standard: 1.5,
  ot_multiplier_weekend: 2.0,
  ot_multiplier_holiday: 3.0,
  personal_tax_deduction_self: 11000000,
  personal_tax_deduction_dependent: 4400000,
};

// Initial Seed Data: Attendance Records & Leave Requests
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [];

const ATTENDANCE_KEY = 'ggbg_attendance_records_v1';
const LEAVE_KEY = 'ggbg_leave_requests_v1';
const PAYROLL_KEY = 'ggbg_payroll_sheets_v1';
const ATTENDANCE_SETTING_KEY = 'ggbg_attendance_settings_v1';
const PAYROLL_SETTING_KEY = 'ggbg_payroll_settings_v1';

// ===== GETTERS / SETTERS SETTINGS =====
export function getAttendanceSettings(): AttendanceSettings {
  if (typeof window === 'undefined') return DEFAULT_ATTENDANCE_SETTINGS;
  try {
    const raw = localStorage.getItem(ATTENDANCE_SETTING_KEY);
    if (!raw) return DEFAULT_ATTENDANCE_SETTINGS;
    return { ...DEFAULT_ATTENDANCE_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_ATTENDANCE_SETTINGS;
  }
}

export function saveAttendanceSettings(settings: AttendanceSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_SETTING_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

export function getPayrollSettings(): PayrollSettings {
  if (typeof window === 'undefined') return DEFAULT_PAYROLL_SETTINGS;
  try {
    const raw = localStorage.getItem(PAYROLL_SETTING_KEY);
    if (!raw) return DEFAULT_PAYROLL_SETTINGS;
    return { ...DEFAULT_PAYROLL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PAYROLL_SETTINGS;
  }
}

export function savePayrollSettings(settings: PayrollSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAYROLL_SETTING_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

function loadAttendance(): AttendanceRecord[] {
  if (typeof window === 'undefined') return INITIAL_ATTENDANCE;
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ATTENDANCE;
  }
}

function saveAttendance(data: AttendanceRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

function loadLeaves(): LeaveRequest[] {
  if (typeof window === 'undefined') return INITIAL_LEAVE_REQUESTS;
  try {
    const raw = localStorage.getItem(LEAVE_KEY);
    if (!raw) {
      localStorage.setItem(LEAVE_KEY, JSON.stringify(INITIAL_LEAVE_REQUESTS));
      return INITIAL_LEAVE_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LEAVE_REQUESTS;
  }
}

function saveLeaves(data: LeaveRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEAVE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

function loadPayroll(): PayrollSheet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PAYROLL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function savePayroll(data: PayrollSheet[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAYROLL_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

// ===== 1. CHẤM CÔNG HÀNG NGÀY =====
export function getAttendance(): AttendanceRecord[] {
  return loadAttendance();
}

export function recordCheckIn(employeeId: string, checkInTime: string = '08:20'): AttendanceRecord {
  const currentList = loadAttendance();
  const employees = getEmployees();
  const settings = getAttendanceSettings();
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) throw new Error('Employee not found');

  const today = new Date().toISOString().split('T')[0];
  const lateMinutes = checkInTime > settings.work_start_time ? 15 : 0;
  const status: AttendanceStatus = lateMinutes > 0 ? 'LATE' : 'ON_TIME';

  const newRecord: AttendanceRecord = {
    id: `att_${Date.now()}`,
    employee_id: emp.id,
    employee_name: emp.full_name,
    employee_code: emp.employee_code,
    department: emp.department || 'Phòng Kinh Doanh 1',
    date: today,
    check_in_time: checkInTime,
    status,
    late_minutes: lateMinutes,
    early_minutes: 0,
    ot_hours: 0,
    notes: lateMinutes > 0 ? `Đi muộn ${lateMinutes} phút` : 'Check-in thành công qua CRM GPS',
  };

  const updated = [newRecord, ...currentList];
  saveAttendance(updated);
  return newRecord;
}

export function recordCheckOut(recordId: string, checkOutTime: string = '17:30', otHours: number = 0): AttendanceRecord {
  const currentList = loadAttendance();
  let updatedRecord: AttendanceRecord | undefined;

  const updatedList = currentList.map((att) => {
    if (att.id === recordId) {
      updatedRecord = {
        ...att,
        check_out_time: checkOutTime,
        ot_hours: otHours,
        status: otHours > 0 ? 'OVERTIME' : att.status,
      };
      return updatedRecord;
    }
    return att;
  });

  if (!updatedRecord) throw new Error('Attendance record not found');
  saveAttendance(updatedList);
  return updatedRecord;
}

// ===== 2. QUẢN LÝ NGHỈ PHÉP =====
export function getLeaveRequests(): LeaveRequest[] {
  return loadLeaves();
}

export function createLeaveRequest(newItem: Omit<LeaveRequest, 'id' | 'request_code' | 'status' | 'created_at'>): LeaveRequest {
  const currentList = loadLeaves();
  const created: LeaveRequest = {
    ...newItem,
    id: `lv_${Date.now()}`,
    request_code: `LEAVE-${Date.now().toString().slice(-6)}`,
    status: 'PENDING',
    created_at: new Date().toISOString().split('T')[0],
  };

  const updated = [created, ...currentList];
  saveLeaves(updated);
  return created;
}

export function updateLeaveStatus(id: string, status: LeaveStatus, approverNote?: string): LeaveRequest {
  const currentList = loadLeaves();
  let updatedObj: LeaveRequest | undefined;

  const updatedList = currentList.map((lv) => {
    if (lv.id === id) {
      updatedObj = {
        ...lv,
        status,
        approver_note: approverNote || lv.approver_note,
      };
      return updatedObj;
    }
    return lv;
  });

  if (!updatedObj) throw new Error('Leave request not found');
  saveLeaves(updatedList);
  return updatedObj;
}

// ===== 3. TỔNG HỢP CHẤM CÔNG THÁNG =====
export function generateTimekeepingSummary(period: string = 'Tháng 07/2026'): TimekeepingSummary[] {
  const employees = getEmployees();
  const leaveList = loadLeaves();
  const attSettings = getAttendanceSettings();

  return employees.map((emp) => {
    const approvedLeaves = leaveList.filter(
      (l) => l.employee_id === emp.id && (l.status === 'HR_APPROVED' || l.status === 'MANAGER_APPROVED')
    );
    const paidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'ANNUAL' || l.leave_type === 'COMPENSATORY')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    const unpaidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'UNPAID')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    const standardWorkdays = attSettings.standard_workdays || 26;
    const actualWorkdays = Math.max(20, standardWorkdays - paidLeaveDays - unpaidLeaveDays);
    const billableWorkdays = actualWorkdays + paidLeaveDays;
    const otHours = emp.employee_code === 'NV-00101' ? 8.5 : emp.employee_code === 'NV-00104' ? 12.0 : 4.0;
    const lateCount = emp.employee_code === 'NV-00102' ? 2 : 0;

    return {
      id: `ts_${emp.id}_${period}`,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      period,
      standard_workdays: standardWorkdays,
      actual_workdays: actualWorkdays,
      paid_leave_days: paidLeaveDays,
      unpaid_leave_days: unpaidLeaveDays,
      absent_unexcused_days: 0,
      late_count: lateCount,
      total_late_minutes: lateCount * 15,
      total_ot_hours: otHours,
      billable_workdays: billableWorkdays,
    };
  });
}

// ===== 4. TÍNH LƯƠNG TỰ ĐỘNG (PAYROLL ENGINE) =====
export function generateMonthlyPayroll(period: string = 'Tháng 07/2026'): PayrollSheet[] {
  const employees = getEmployees();
  const summaries = generateTimekeepingSummary(period);
  const scorecards = getScorecardsByPeriod(period);
  const paySettings = getPayrollSettings();
  const existingPayroll = loadPayroll();

  const generatedSheets: PayrollSheet[] = employees.map((emp) => {
    const summary = summaries.find((s) => s.employee_id === emp.id) || {
      standard_workdays: 26,
      actual_workdays: 26,
      paid_leave_days: 0,
      billable_workdays: 26,
      total_ot_hours: 0,
      total_late_minutes: 0,
      late_count: 0,
    };

    const scorecard = scorecards.find((sc) => sc.employee_id === emp.id);

    // Lương cứng Hợp đồng (P1 Base Salary)
    const baseSalary = emp.base_salary || (emp.employee_code === 'NV-00101' ? 18000000 : 12000000);
    // Tính P1 theo số công billable thực tế
    const p1Calculated = Math.round(baseSalary * (summary.billable_workdays / summary.standard_workdays));

    // Phụ cấp P2 từ Cài đặt Payroll
    const p2Allowances = paySettings.p2_lunch_allowance + paySettings.p2_phone_allowance + paySettings.p2_transport_allowance;

    // Lương Hiệu Suất P3 (Tự động lấy từ Module Performance)
    const p3PerformanceSalary = scorecard?.calculated_p3_salary || (scorecard?.rating_grade === 'S' ? 7200000 : 4000000);

    // Tiền OT Tăng Ca
    const hourlyRate = baseSalary / (summary.standard_workdays * 8);
    const otSalary = Math.round(summary.total_ot_hours * hourlyRate * paySettings.ot_multiplier_standard);

    const bonusAmount = scorecard?.bonus_score ? scorecard.bonus_score * 200000 : 0;
    const totalGross = p1Calculated + p2Allowances + p3PerformanceSalary + otSalary + bonusAmount;

    // Khấu trừ Bảo hiểm theo cài đặt %
    const insuranceBase = Math.min(baseSalary, 36000000);
    const bhxhDeduction = Math.round(insuranceBase * (paySettings.bhxh_percent / 100));
    const bhytDeduction = Math.round(insuranceBase * (paySettings.bhyt_percent / 100));
    const bhtnDeduction = Math.round(insuranceBase * (paySettings.bhtn_percent / 100));

    // Phạt đi muộn
    const latePenalty = (summary.late_count || 0) * paySettings.late_penalty_per_instance;

    // Thuế TNCN tạm tính
    const taxableIncome = Math.max(0, totalGross - (paySettings.personal_tax_deduction_self + bhxhDeduction + bhytDeduction + bhtnDeduction));
    const personalIncomeTax = Math.round(taxableIncome * 0.05);

    const totalDeductions = bhxhDeduction + bhytDeduction + bhtnDeduction + latePenalty + personalIncomeTax;
    const netSalary = Math.max(0, totalGross - totalDeductions);

    const existing = existingPayroll.find((p) => p.employee_id === emp.id && p.period === period);

    return {
      id: existing?.id || `pay_${emp.id}_${period}`,
      payroll_code: existing?.payroll_code || `PAY-${period.replace('/', '')}-${emp.employee_code}`,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      position: emp.position || 'Chuyên Viên',
      bank_name: emp.bank_name || 'MBBank (NH Quân Đội)',
      bank_account: emp.bank_account || '0988888888',
      period,
      base_salary: baseSalary,
      p1_calculated_salary: p1Calculated,
      p2_allowances: p2Allowances,
      p3_performance_salary: p3PerformanceSalary,
      ot_salary: otSalary,
      bonus_amount: bonusAmount,
      total_gross_income: totalGross,
      bhxh_deduction: bhxhDeduction,
      bhyt_deduction: bhytDeduction,
      bhtn_deduction: bhtnDeduction,
      late_penalty_deduction: latePenalty,
      personal_income_tax: personalIncomeTax,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      status: existing?.status || 'DRAFT',
      paystub_sent_at: existing?.paystub_sent_at,
    };
  });

  savePayroll(generatedSheets);
  return generatedSheets;
}

export const AVAILABLE_PAYROLL_PERIODS = [
  'Tháng 08/2026',
  'Tháng 07/2026',
  'Tháng 06/2026',
  'Tháng 05/2026',
  'Tháng 04/2026',
  'Tháng 03/2026',
  'Tháng 02/2026',
  'Tháng 01/2026',
  'Tháng 12/2025',
];

export function getPayrollByPeriod(period: string = 'Tháng 07/2026'): PayrollSheet[] {
  const current = loadPayroll();
  const filtered = current.filter((p) => p.period === period);
  if (filtered.length === 0) {
    return generateMonthlyPayroll(period);
  }
  return filtered;
}

export function getAllHistoricalPayrolls(): PayrollSheet[] {
  const allPayrolls: PayrollSheet[] = [];
  AVAILABLE_PAYROLL_PERIODS.forEach((period) => {
    const sheets = getPayrollByPeriod(period);
    allPayrolls.push(...sheets);
  });
  return allPayrolls;
}

// ===== 5. GỬI BẢNG LƯƠNG VIA EMAIL / ZNS =====
export function sendPaystubEmail(payrollId: string): PayrollSheet {
  const currentList = loadPayroll();
  let updatedObj: PayrollSheet | undefined;

  const updatedList = currentList.map((p) => {
    if (p.id === payrollId) {
      updatedObj = {
        ...p,
        status: 'SENT_PAYSTUB' as PayrollStatus,
        paystub_sent_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      return updatedObj;
    }
    return p;
  });

  if (!updatedObj) throw new Error('Payroll record not found');
  savePayroll(updatedList);
  return updatedObj;
}

export function sendBatchPaystubs(period: string): PayrollSheet[] {
  const currentList = getPayrollByPeriod(period);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const updatedList = currentList.map((p) => ({
    ...p,
    status: 'SENT_PAYSTUB' as PayrollStatus,
    paystub_sent_at: now,
  }));

  savePayroll(updatedList);
  return updatedList;
}
