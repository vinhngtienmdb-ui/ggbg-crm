import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  PayrollSheet,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  PayrollStatus
} from '@/types';
import { getEmployees } from './hrmStore';
import { getScorecardsByPeriod } from './performanceStore';

export const PAYROLL_UPDATED_EVENT = 'ggbg_payroll_updated_event';

// Initial Seed Data: Attendance Records for July 2026
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    date: '2026-07-28',
    check_in_time: '08:15',
    check_out_time: '17:30',
    status: 'ON_TIME',
    late_minutes: 0,
    early_minutes: 0,
    ot_hours: 1.5,
    notes: 'Vào ca đúng giờ, OT tư vấn khách VIP Shopee',
  },
  {
    id: 'att_2',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng CSKH',
    date: '2026-07-28',
    check_in_time: '08:45',
    check_out_time: '17:30',
    status: 'LATE',
    late_minutes: 15,
    early_minutes: 0,
    ot_hours: 0,
    notes: 'Muộn 15 phút do tắc đường Nguyễn Trãi',
  },
  {
    id: 'att_3',
    employee_id: 'e3',
    employee_name: 'Đặng Kim Anh',
    employee_code: 'NV-00103',
    department: 'Phòng Nhân Sự (HR)',
    date: '2026-07-28',
    check_in_time: '08:10',
    check_out_time: '17:35',
    status: 'ON_TIME',
    late_minutes: 0,
    early_minutes: 0,
    ot_hours: 0,
    notes: 'Chính giờ',
  },
  {
    id: 'att_4',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    date: '2026-07-28',
    check_in_time: '08:20',
    check_out_time: '17:30',
    status: 'ON_TIME',
    late_minutes: 0,
    early_minutes: 0,
    ot_hours: 2.0,
    notes: 'Lên chiến dịch Flash Sale 8.8 TikTok Mall',
  },
];

// Initial Seed Data: Leave Requests
export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv_1',
    request_code: 'LEAVE-202607-001',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng CSKH',
    leave_type: 'ANNUAL',
    start_date: '2026-07-15',
    end_date: '2026-07-16',
    total_days: 2,
    reason: 'Nghỉ phép năm gia đình có việc cá nhân',
    status: 'HR_APPROVED',
    approver_note: 'Đã duyệt phép năm (Đã xác nhận với Trưởng phòng CSKH)',
    created_at: '2026-07-10',
  },
  {
    id: 'lv_2',
    request_code: 'LEAVE-202607-002',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    leave_type: 'SICK',
    start_date: '2026-07-22',
    end_date: '2026-07-22',
    total_days: 1,
    reason: 'Sốt siêu vi có xác nhận phòng khám',
    status: 'HR_APPROVED',
    approver_note: 'Đã duyệt nghỉ ốm hưởng BHXH',
    created_at: '2026-07-21',
  },
];

const ATTENDANCE_KEY = 'ggbg_attendance_records_v1';
const LEAVE_KEY = 'ggbg_leave_requests_v1';
const PAYROLL_KEY = 'ggbg_payroll_sheets_v1';

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
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) throw new Error('Employee not found');

  const today = new Date().toISOString().split('T')[0];
  const lateMinutes = checkInTime > '08:30' ? 15 : 0;
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

  return employees.map((emp) => {
    // Approved paid leaves for employee
    const approvedLeaves = leaveList.filter(
      (l) => l.employee_id === emp.id && (l.status === 'HR_APPROVED' || l.status === 'MANAGER_APPROVED')
    );
    const paidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'ANNUAL' || l.leave_type === 'COMPENSATORY')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    const unpaidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'UNPAID')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    const standardWorkdays = 26;
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

    // Phụ cấp P2 (Ăn trưa 730k + Điện thoại 300k + Xăng xe 500k = 1,530,000 ₫)
    const p2Allowances = 1530000;

    // Lương Hiệu Suất P3 (Tự động lấy từ Module Performance)
    const p3PerformanceSalary = scorecard?.calculated_p3_salary || (scorecard?.rating_grade === 'S' ? 7200000 : 4000000);

    // Tiền OT Tăng Ca (x1.5 lương theo giờ)
    const hourlyRate = baseSalary / (26 * 8);
    const otSalary = Math.round(summary.total_ot_hours * hourlyRate * 1.5);

    const bonusAmount = scorecard?.bonus_score ? scorecard.bonus_score * 200000 : 0;
    const totalGross = p1Calculated + p2Allowances + p3PerformanceSalary + otSalary + bonusAmount;

    // Khấu trừ Bảo hiểm theo quy định pháp luật Lao động Vietnam:
    // BHXH 8%, BHYT 1.5%, BHTN 1% = Tổng 10.5% lương BHXH
    const insuranceBase = Math.min(baseSalary, 36000000); // Trần BHXH 36tr
    const bhxhDeduction = Math.round(insuranceBase * 0.08);
    const bhytDeduction = Math.round(insuranceBase * 0.015);
    const bhtnDeduction = Math.round(insuranceBase * 0.01);

    // Phạt đi muộn (50,000 ₫ / lần đi muộn)
    const latePenalty = (summary.late_count || 0) * 50000;

    // Thuế TNCN tạm tính (Biểu thuế lũy tiến từng phần đơn giản hóa)
    const taxableIncome = Math.max(0, totalGross - (11000000 + bhxhDeduction + bhytDeduction + bhtnDeduction));
    const personalIncomeTax = Math.round(taxableIncome * 0.05);

    const totalDeductions = bhxhDeduction + bhytDeduction + bhtnDeduction + latePenalty + personalIncomeTax;
    const netSalary = Math.max(0, totalGross - totalDeductions);

    // Check if payroll record already exists for this employee/period
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

export function getPayrollByPeriod(period: string = 'Tháng 07/2026'): PayrollSheet[] {
  const current = loadPayroll();
  const filtered = current.filter((p) => p.period === period);
  if (filtered.length === 0) {
    return generateMonthlyPayroll(period);
  }
  return filtered;
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
