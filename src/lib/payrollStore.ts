import {
  AttendanceRecord,
  LeaveRequest,
  TimekeepingSummary,
  PayrollSheet,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  PayrollStatus,
  PayrollPeriodStatus,
  PayrollApprovalLog,
  PayrollApprovalPeriod,
  BankDisbursementItem,
  BankPaymentBatch,
  AttendanceSettings,
  PayrollSettings,
  AttendanceRequest,
  AttendanceRequestType,
  TimesheetPeriodLock
} from '@/types';
import { getEmployees, getSalaryStep, getAllowanceCatalog, getTaxPolicyByDate } from './hrmStore';
import { getScorecardsByPeriod } from './performanceStore';

export const PAYROLL_UPDATED_EVENT = 'ggbg_payroll_updated_event';

export function notifyPayrollChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
  }
}

export const DEFAULT_ATTENDANCE_SETTINGS: AttendanceSettings = {
  standard_workdays: 26,
  work_start_time: '08:00',
  work_end_time: '17:30',
  late_grace_minutes: 15,
  ot_min_hours: 1.0,
  annual_leave_quota: 12,
  gps_radius_meters: 200,
  allowed_ip_range: '192.168.1.0/24',
  auto_lock_day: 5,
  auto_lock_time: '23:59',
  auto_lock_enabled: true,
  reminder_days_before: 2,
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

// Initial Seed Data: Unified Attendance Requests
export const INITIAL_ATTENDANCE_REQUESTS: AttendanceRequest[] = [
  {
    id: 'req_1',
    request_code: 'REQ-202607-001',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    employee_code: 'NV-00102',
    department: 'Phòng CSKH',
    request_type: 'LATE_EARLY_EXCUSE',
    date: '2026-07-28',
    proposed_check_in: '08:30',
    reason: 'Đến muộn 15 phút do sự cố kẹt xe ngập đường sau mưa bão lớn',
    status: 'HR_APPROVED',
    manager_note: 'Đã xác nhận sự cố ngập đường',
    manager_approved_at: '2026-07-28 09:00',
    hr_note: 'Duyệt giải trình đi muộn hợp lệ, không trừ công',
    hr_approved_at: '2026-07-28 10:30',
    created_at: '2026-07-28',
  },
  {
    id: 'req_2',
    request_code: 'REQ-202607-002',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    request_type: 'OUTSIDE_WORK',
    date: '2026-07-29',
    outside_location_name: 'Gặp đối tác tại KĐT Starlake Tây Hồ',
    reason: 'Ký kết hợp đồng phân phối gian hàng TMĐT Shopee Mall & TikTok Shop',
    status: 'HR_APPROVED',
    manager_note: 'Duyệt lịch công tác khách hàng',
    hr_note: 'Đã duyệt vị trí công tác ngoài văn phòng',
    created_at: '2026-07-29',
  },
  {
    id: 'req_3',
    request_code: 'REQ-202607-003',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    request_type: 'OVERTIME_REQUEST',
    date: '2026-07-28',
    ot_hours: 2.0,
    reason: 'Trực kỹ thuật chiến dịch Flash Sale 8.8 TikTok Mall xuyên đêm',
    status: 'HR_APPROVED',
    manager_note: 'Đã duyệt tăng ca phục vụ chiến dịch',
    created_at: '2026-07-28',
  },
  {
    id: 'req_4',
    request_code: 'REQ-202607-004',
    employee_id: 'e3',
    employee_name: 'Đặng Kim Anh',
    employee_code: 'NV-00103',
    department: 'Phòng Nhân Sự (HR)',
    request_type: 'MISSED_PUNCH_EXPLANATION',
    date: '2026-07-27',
    proposed_check_in: '08:15',
    proposed_check_out: '17:30',
    reason: 'Quên bấm check-out lúc tan ca do bận hỗ trợ Onboarding nhân viên mới',
    status: 'PENDING',
    created_at: '2026-07-28',
  },
];

export const INITIAL_TIMESHEET_LOCKS: TimesheetPeriodLock[] = [
  {
    period: 'Tháng 06/2026',
    is_locked: true,
    locked_at: '2026-07-01 23:59:00',
    locked_by: 'HR Manager (Đặng Kim Anh)',
    lock_note: 'Đã chốt công định kỳ và hoàn tất thanh toán lương',
  },
  {
    period: 'Tháng 07/2026',
    is_locked: false,
  },
  {
    period: 'Tháng 08/2026',
    is_locked: false,
  },
];

const ATTENDANCE_KEY = 'ggbg_attendance_records_v1';
const LEAVE_KEY = 'ggbg_leave_requests_v1';
const ATTENDANCE_REQUESTS_KEY = 'ggbg_attendance_requests_v1';
const TIMESHEET_LOCKS_KEY = 'ggbg_timesheet_locks_v1';
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

export interface CheckInOptions {
  checkInTime?: string;
  shiftId?: string;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  locationType?: 'OFFICE' | 'OUTSIDE_REMOTE' | 'CLIENT_SITE';
  gps?: { latitude: number; longitude: number; address_name?: string; distance_meters?: number };
  faceImage?: string;
  outsideReason?: string;
  isHoliday?: boolean;
  holidayName?: string;
  isWeekend?: boolean;
  payMultiplier?: number;
  notes?: string;
}

export interface CheckOutOptions {
  checkOutTime?: string;
  otHours?: number;
  locationType?: 'OFFICE' | 'OUTSIDE_REMOTE' | 'CLIENT_SITE';
  gps?: { latitude: number; longitude: number; address_name?: string; distance_meters?: number };
  faceImage?: string;
  outsideReason?: string;
  notes?: string;
}

// ===== 1. CHẤM CÔNG HÀNG NGÀY =====
export function getAttendance(): AttendanceRecord[] {
  return loadAttendance();
}

export function recordCheckIn(
  employeeId: string,
  optionsOrTime: CheckInOptions | string = '08:20'
): AttendanceRecord {
  const currentList = loadAttendance();
  const employees = getEmployees();
  const settings = getAttendanceSettings();
  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) throw new Error('Employee not found');

  const options: CheckInOptions =
    typeof optionsOrTime === 'string' ? { checkInTime: optionsOrTime } : optionsOrTime;

  const checkInTime = options.checkInTime || new Date().toTimeString().slice(0, 5);
  const shiftStartTime = options.shiftStartTime || settings.work_start_time || '08:30';
  const today = new Date().toISOString().split('T')[0];

  // Tính số phút đi muộn dựa trên ca làm việc
  let lateMinutes = 0;
  if (checkInTime > shiftStartTime) {
    const [cHour, cMin] = checkInTime.split(':').map(Number);
    const [sHour, sMin] = shiftStartTime.split(':').map(Number);
    const diff = (cHour * 60 + cMin) - (sHour * 60 + sMin);
    lateMinutes = Math.max(0, diff);
  }

  const status: AttendanceStatus = lateMinutes > (settings.late_grace_minutes || 15) ? 'LATE' : 'ON_TIME';

  // Check if today already has an open attendance record for this employee
  const existingIdx = currentList.findIndex((r) => r.employee_id === emp.id && r.date === today);

  const newRecord: AttendanceRecord = {
    id: existingIdx !== -1 ? currentList[existingIdx].id : `att_${Date.now()}`,
    employee_id: emp.id,
    employee_name: emp.full_name,
    employee_code: emp.employee_code,
    department: emp.department || 'Phòng Kinh Doanh 1',
    date: today,
    shift_id: options.shiftId || emp.default_shift_id || 'shift_office',
    shift_name: options.shiftName || 'Ca Hành Chính (08:30 - 17:30)',
    shift_start_time: shiftStartTime,
    shift_end_time: options.shiftEndTime || settings.work_end_time || '17:30',
    check_in_time: checkInTime,
    status,
    late_minutes: lateMinutes,
    early_minutes: 0,
    ot_hours: 0,
    check_in_location_type: options.locationType || 'OFFICE',
    check_in_gps: options.gps,
    check_in_face_image: options.faceImage,
    outside_reason: options.outsideReason,
    is_holiday: options.isHoliday,
    holiday_name: options.holidayName,
    is_weekend: options.isWeekend,
    pay_multiplier: options.payMultiplier || 1.0,
    notes:
      options.notes ||
      (options.locationType === 'OUTSIDE_REMOTE'
        ? `[Ngoài VP] ${options.outsideReason || 'Làm việc thị trường / Khách hàng'}`
        : lateMinutes > 0
        ? `Đi muộn ${lateMinutes} phút`
        : 'Check-in đúng giờ qua nhận diện khuôn mặt & GPS'),
  };

  let updated: AttendanceRecord[];
  if (existingIdx !== -1) {
    updated = currentList.map((item, idx) => (idx === existingIdx ? newRecord : item));
  } else {
    updated = [newRecord, ...currentList];
  }

  saveAttendance(updated);
  return newRecord;
}

export function recordCheckOut(
  recordOrEmpId: string,
  optionsOrTime: CheckOutOptions | string = '17:30',
  otHoursParam: number = 0
): AttendanceRecord {
  const currentList = loadAttendance();
  const settings = getAttendanceSettings();
  const today = new Date().toISOString().split('T')[0];

  const options: CheckOutOptions =
    typeof optionsOrTime === 'string'
      ? { checkOutTime: optionsOrTime, otHours: otHoursParam }
      : optionsOrTime;

  const checkOutTime = options.checkOutTime || new Date().toTimeString().slice(0, 5);
  let updatedRecord: AttendanceRecord | undefined;

  const updatedList = currentList.map((att) => {
    // Match by record id or employee id on today
    if (att.id === recordOrEmpId || (att.employee_id === recordOrEmpId && att.date === today)) {
      const shiftEndTime = att.shift_end_time || settings.work_end_time || '17:30';

      // Tính số phút về sớm
      let earlyMinutes = 0;
      if (checkOutTime < shiftEndTime) {
        const [cHour, cMin] = checkOutTime.split(':').map(Number);
        const [sHour, sMin] = shiftEndTime.split(':').map(Number);
        const diff = (sHour * 60 + sMin) - (cHour * 60 + cMin);
        earlyMinutes = Math.max(0, diff);
      }

      const otHours = options.otHours || (checkOutTime > shiftEndTime ? 1.0 : 0);

      updatedRecord = {
        ...att,
        check_out_time: checkOutTime,
        early_minutes: earlyMinutes,
        ot_hours: otHours,
        check_out_location_type: options.locationType || att.check_in_location_type || 'OFFICE',
        check_out_gps: options.gps,
        check_out_face_image: options.faceImage,
        status:
          otHours > 0
            ? 'OVERTIME'
            : earlyMinutes > 15
            ? 'EARLY_LEAVE'
            : att.status,
        notes: options.notes || att.notes || (otHours > 0 ? `Làm thêm ${otHours}h` : 'Check-out hoàn thành ca làm việc'),
      };
      return updatedRecord;
    }
    return att;
  });

  if (!updatedRecord) {
    // If not checked in, auto check in then check out
    throw new Error('Không tìm thấy bản ghi chấm công cần Check-out.');
  }

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

// ===== 2. TỔNG HỢP CÔNG THÁNG (TOÀN DIỆN: PHÉP NĂM, NGHỈ LỄ, VIỆC RIÊNG, ỐM, THAI SẢN, OT) =====
export function generateTimekeepingSummary(period: string = 'Tháng 07/2026'): TimekeepingSummary[] {
  const employees = getEmployees();
  const leaveList = loadLeaves();
  const attSettings = getAttendanceSettings();

  return employees.map((emp) => {
    const approvedLeaves = leaveList.filter(
      (l) => l.employee_id === emp.id && (l.status === 'HR_APPROVED' || l.status === 'MANAGER_APPROVED')
    );
    
    // 1. Nghỉ phép năm có lương (AL - Annual Leave)
    const paidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'ANNUAL' || l.leave_type === 'COMPENSATORY')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    // 2. Nghỉ việc riêng không lương (UL - Unpaid Leave)
    const unpaidLeaveDays = approvedLeaves
      .filter((l) => l.leave_type === 'UNPAID')
      .reduce((acc, curr) => acc + curr.total_days, 0);

    // 3. Nghỉ lễ tết toàn quốc hưởng 100% lương (HL - Holiday Leave)
    const holidayLeaveDays = 1; // 1 ngày nghỉ lễ quy định trong tháng

    // 4. Nghỉ việc riêng có lương (Cưới xin, tang chế theo Luật Lao Động)
    const specialPaidLeaveDays = emp.employee_code === 'NV-00103' ? 1 : 0;

    // 5. Nghỉ ốm hưởng BHXH (SL)
    const sickLeaveDays = emp.employee_code === 'NV-00102' ? 1 : 0;

    // 6. Nghỉ thai sản (ML)
    const maternityLeaveDays = 0;

    const standardWorkdays = attSettings.standard_workdays || 26;
    const actualWorkdays = Math.max(18, standardWorkdays - paidLeaveDays - unpaidLeaveDays - holidayLeaveDays - specialPaidLeaveDays - sickLeaveDays);
    
    // Tổng ngày công quy đổi hưởng lương (Công thực tế + Phép năm + Nghỉ lễ + Nghỉ việc riêng có lương)
    const billableWorkdays = actualWorkdays + paidLeaveDays + holidayLeaveDays + specialPaidLeaveDays;
    
    // Phân loại OT: Ngày thường x1.5, Nghỉ tuần x2.0, Lễ tết x3.0
    const normalOtHours = emp.employee_code === 'NV-00101' ? 4.5 : emp.employee_code === 'NV-00104' ? 6.0 : 2.0;
    const weekendOtHours = emp.employee_code === 'NV-00101' ? 4.0 : emp.employee_code === 'NV-00104' ? 6.0 : 2.0;
    const holidayOtHours = 0;
    const totalOtHours = normalOtHours + weekendOtHours + holidayOtHours;

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
      holiday_leave_days: holidayLeaveDays,
      special_paid_leave_days: specialPaidLeaveDays,
      unpaid_leave_days: unpaidLeaveDays,
      sick_leave_days: sickLeaveDays,
      maternity_leave_days: maternityLeaveDays,
      absent_unexcused_days: 0,
      late_count: lateCount,
      total_late_minutes: lateCount * 15,
      normal_ot_hours: normalOtHours,
      weekend_ot_hours: weekendOtHours,
      holiday_ot_hours: holidayOtHours,
      total_ot_hours: totalOtHours,
      billable_workdays: billableWorkdays,
    };
  });
}

// Progressive PIT Tax calculation according to Vietnamese Personal Income Tax brackets
function calculateProgressivePit(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 5000000) {
    return Math.round(taxableIncome * 0.05);
  } else if (taxableIncome <= 10000000) {
    return Math.round(taxableIncome * 0.1 - 250000);
  } else if (taxableIncome <= 18000000) {
    return Math.round(taxableIncome * 0.15 - 750000);
  } else if (taxableIncome <= 32000000) {
    return Math.round(taxableIncome * 0.2 - 1650000);
  } else if (taxableIncome <= 52000000) {
    return Math.round(taxableIncome * 0.25 - 3250000);
  } else if (taxableIncome <= 80000000) {
    return Math.round(taxableIncome * 0.3 - 5850000);
  } else {
    return Math.round(taxableIncome * 0.35 - 9850000);
  }
}

// ===== 4. TÍNH LƯƠNG TỰ ĐỘNG (PAYROLL ENGINE ĐỒNG BỘ HRM & CẤU HÌNH) =====
export function generateMonthlyPayroll(period: string = 'Tháng 07/2026'): PayrollSheet[] {
  const employees = getEmployees();
  const summaries = generateTimekeepingSummary(period);
  const scorecards = getScorecardsByPeriod(period);
  const paySettings = getPayrollSettings();
  const existingPayroll = loadPayroll();
  const allowanceCatalog = getAllowanceCatalog();

  // Convert period (e.g. 'Tháng 07/2026') to ISO date for tax policy lookup
  const periodMatch = period.match(/(\d{1,2})\/(\d{4})/);
  const periodDate = periodMatch ? `${periodMatch[2]}-${periodMatch[1].padStart(2, '0')}-01` : '2026-07-01';
  const activeTaxPolicy = getTaxPolicyByDate(periodDate);

  const generatedSheets: PayrollSheet[] = employees.map((emp) => {
    const summary = summaries.find((s) => s.employee_id === emp.id) || {
      standard_workdays: 26,
      actual_workdays: 26,
      paid_leave_days: 0,
      billable_workdays: 26,
      normal_ot_hours: 0,
      weekend_ot_hours: 0,
      holiday_ot_hours: 0,
      total_ot_hours: 0,
      total_late_minutes: 0,
      late_count: 0,
    };

    const scorecard = scorecards.find((sc) => sc.employee_id === emp.id);

    // 1. Lương Vị trí P1: Tra cứu từ Ngạch / Bậc lương đã gán
    let baseSalary = emp.base_salary || 15000000;
    let insuranceSalary = emp.insurance_salary || Math.min(baseSalary, 12000000);

    if (emp.salary_grade_id && emp.salary_step_number) {
      const stepItem = getSalaryStep(emp.salary_grade_id, emp.salary_step_number);
      if (stepItem) {
        baseSalary = stepItem.base_salary;
        insuranceSalary = stepItem.insurance_salary;
      }
    } else if (emp.salary_grade) {
      const stepItem = getSalaryStep(emp.salary_grade, emp.salary_step_number || 1);
      if (stepItem) {
        baseSalary = stepItem.base_salary;
        insuranceSalary = stepItem.insurance_salary;
      }
    }

    // Tính Lương P1 theo số ngày công thực tế
    const standardWorkdays = summary.standard_workdays || 26;
    const p1Calculated = Math.round(baseSalary * (summary.billable_workdays / standardWorkdays));

    // 2. Phụ cấp P2: Bóc tách chi tiết từng khoản từ hồ sơ nhân viên & danh mục định mức
    let totalAllowances = 0;
    let taxableAllowances = 0;
    let insuranceAllowances = 0;

    if (emp.allowances && emp.allowances.length > 0) {
      emp.allowances.forEach((al) => {
        const catalogItem = allowanceCatalog.find((c) => c.id === al.allowance_type_id || c.code === al.allowance_type_id);
        
        let actualAmount = al.amount || 0;
        if (catalogItem?.is_prorated_by_workdays) {
          actualAmount = Math.round((actualAmount * summary.billable_workdays) / standardWorkdays);
        }
        totalAllowances += actualAmount;

        // Bóc tách Thuế TNCN: So sánh với định mức miễn thuế
        const taxExemptCap = catalogItem?.tax_exempt_cap ?? (al.taxable ? 0 : actualAmount);
        if (taxExemptCap > 0) {
          const excessTaxable = Math.max(0, actualAmount - taxExemptCap);
          taxableAllowances += excessTaxable;
        } else if (al.taxable || catalogItem?.is_taxable_pit) {
          taxableAllowances += actualAmount;
        }

        // Bóc tách BHXH: So sánh với định mức miễn BHXH
        const insExemptCap = catalogItem?.insurance_exempt_cap ?? (al.include_in_insurance ? 0 : 999999999);
        if (insExemptCap === 0 || al.include_in_insurance || catalogItem?.is_social_insurance) {
          if (insExemptCap > 0 && actualAmount > insExemptCap) {
            insuranceAllowances += (actualAmount - insExemptCap);
          } else if (insExemptCap === 0) {
            insuranceAllowances += actualAmount;
          }
        }
      });
    } else {
      // Fallback default allowances nếu nhân sự chưa gắn riêng
      totalAllowances = paySettings.p2_lunch_allowance + paySettings.p2_phone_allowance + paySettings.p2_transport_allowance;
      taxableAllowances = 0; // default lunch/phone/transport within quota
    }

    // 3. Lương Hiệu Suất P3: Tự động từ Module Performance KPIs
    const p3PerformanceSalary = scorecard?.calculated_p3_salary || (scorecard?.rating_grade === 'S' ? 7200000 : 4000000);

    // 4. Tiền Làm Thêm Giờ (OT) & Thưởng Nóng (Bóc tách OT ngày thường 150%, OT cuối tuần 200%, OT lễ 300%)
    const hourlyRate = baseSalary / (standardWorkdays * 8);
    const normalOtSalary = Math.round((summary.normal_ot_hours || 0) * hourlyRate * paySettings.ot_multiplier_standard);
    const weekendOtSalary = Math.round((summary.weekend_ot_hours || 0) * hourlyRate * paySettings.ot_multiplier_weekend);
    const holidayOtSalary = Math.round((summary.holiday_ot_hours || 0) * hourlyRate * paySettings.ot_multiplier_holiday);
    const otSalary = normalOtSalary + weekendOtSalary + holidayOtSalary;
    const bonusAmount = scorecard?.bonus_score ? scorecard.bonus_score * 200000 : 0;

    // Tổng thu nhập Gross của người lao động
    const totalGross = p1Calculated + totalAllowances + p3PerformanceSalary + otSalary + bonusAmount;

    // 5. Khấu Trừ Bảo Hiểm Xã Hội (NLĐ trích đóng 10.5%)
    const rawInsuranceBase = insuranceSalary + insuranceAllowances;
    const cappedInsuranceBase = Math.min(rawInsuranceBase, activeTaxPolicy.max_insurance_base_cap || 46800000);

    const bhxhDeduction = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhxh_employee_rate / 100)); // 8%
    const bhytDeduction = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhyt_employee_rate / 100)); // 1.5%
    const bhtnDeduction = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhtn_employee_rate / 100)); // 1%
    const totalEmployeeInsurance = bhxhDeduction + bhytDeduction + bhtnDeduction; // 10.5%

    // 6. Doanh Nghiệp Đóng Bảo Hiểm & Kinh Phí Công Đoàn (23.5%)
    const companyBhxhContribution = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhxh_employer_rate / 100)); // 17.5%
    const companyBhytContribution = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhyt_employer_rate / 100)); // 3.0%
    const companyBhtnContribution = Math.round(cappedInsuranceBase * (activeTaxPolicy.bhtn_employer_rate / 100)); // 1.0%
    const companyUnionFee = Math.round(cappedInsuranceBase * (activeTaxPolicy.kpcd_employer_rate / 100)); // 2.0%
    const totalCompanyInsuranceCost = companyBhxhContribution + companyBhytContribution + companyBhtnContribution + companyUnionFee; // 23.5%
    const totalCompanyCost = totalGross + totalCompanyInsuranceCost; // Tổng chi phí thực tế doanh nghiệp phải chi trả

    // 7. Phạt Đi Muộn & Tạm Ứng / Khấu Trừ Khác
    const latePenalty = (summary.late_count || 0) * paySettings.late_penalty_per_instance;
    const salaryAdvance = emp.employee_code === 'NV-00102' ? 1000000 : 0; // Tạm ứng mẫu
    const otherDeduction = 0;

    // 8. Thuế Thu Nhập Cá Nhân (PIT) Theo Biểu Thuế Lũy Tiến & Giảm Trừ Gia Cảnh
    // Thu nhập chịu thuế = Lương P1 + Phụ cấp chịu thuế + Lương P3 + OT phần không miễn thuế (1.0) + Thưởng
    const nonExemptOt = Math.round((summary.normal_ot_hours || 0) * hourlyRate + (summary.weekend_ot_hours || 0) * hourlyRate);
    const taxableGross = p1Calculated + taxableAllowances + p3PerformanceSalary + nonExemptOt + bonusAmount;
    
    const selfDeduction = activeTaxPolicy.personal_tax_deduction_self || 11000000;
    const dependentCount = emp.dependent_count || 0;
    const dependentDeduction = dependentCount * (activeTaxPolicy.personal_tax_deduction_dependent || 4400000);
    const totalTaxDeductions = selfDeduction + dependentDeduction + totalEmployeeInsurance;

    const taxableIncome = Math.max(0, taxableGross - totalTaxDeductions);
    const personalIncomeTax = calculateProgressivePit(taxableIncome);

    // 9. Tổng Các Khoản Khấu Trừ & Lương Thực Nhận (NET)
    const totalDeductions = totalEmployeeInsurance + latePenalty + salaryAdvance + otherDeduction + personalIncomeTax;
    const netSalary = Math.max(0, totalGross - totalDeductions);

    const existing = existingPayroll.find((p) => p.employee_id === emp.id && p.period === period);

    return {
      id: existing?.id || `pay_${emp.id}_${period}`,
      payroll_code: existing?.payroll_code || `PAY-${period.replace(/[\/\s]/g, '')}-${emp.employee_code}`,
      employee_id: emp.id,
      employee_name: emp.full_name,
      employee_code: emp.employee_code,
      department: emp.department || 'Phòng Kinh Doanh 1',
      position: emp.position || 'Chuyên Viên',
      bank_account_holder: emp.bank_account_holder || emp.full_name.toUpperCase(),
      bank_account: emp.bank_account || '0988888888',
      bank_name: emp.bank_name || 'Techcombank',
      bank_branch: emp.bank_branch || 'Chi nhánh Hà Nội',
      period,
      base_salary: baseSalary,
      insurance_salary: cappedInsuranceBase,
      p1_calculated_salary: p1Calculated,
      p2_allowances: totalAllowances,
      p3_performance_salary: p3PerformanceSalary,
      normal_ot_salary: normalOtSalary,
      weekend_ot_salary: weekendOtSalary,
      holiday_ot_salary: holidayOtSalary,
      ot_salary: otSalary,
      bonus_amount: bonusAmount,
      total_gross_income: totalGross,
      
      // NLĐ trích nộp
      bhxh_deduction: bhxhDeduction,
      bhyt_deduction: bhytDeduction,
      bhtn_deduction: bhtnDeduction,
      total_employee_insurance: totalEmployeeInsurance,

      // Công ty đóng
      company_bhxh_contribution: companyBhxhContribution,
      company_bhyt_contribution: companyBhytContribution,
      company_bhtn_contribution: companyBhtnContribution,
      company_union_fee: companyUnionFee,
      total_company_insurance_cost: totalCompanyInsuranceCost,
      total_company_cost: totalCompanyCost,

      // Thuế TNCN
      taxable_income: taxableGross,
      tax_deduction_self: selfDeduction,
      tax_deduction_dependents: dependentDeduction,
      assessable_income: taxableIncome,
      personal_income_tax: personalIncomeTax,

      // Khấu trừ khác
      late_penalty_deduction: latePenalty,
      salary_advance_deduction: salaryAdvance,
      other_deductions: otherDeduction,
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

// ===== 6. QUẢN LÝ ĐƠN TỪ & PHÊ DUYỆT ĐỒNG BỘ (UNIFIED ATTENDANCE REQUESTS) =====
function loadAttendanceRequests(): AttendanceRequest[] {
  if (typeof window === 'undefined') return INITIAL_ATTENDANCE_REQUESTS;
  try {
    const raw = localStorage.getItem(ATTENDANCE_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_REQUESTS_KEY, JSON.stringify(INITIAL_ATTENDANCE_REQUESTS));
      return INITIAL_ATTENDANCE_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ATTENDANCE_REQUESTS;
  }
}

function saveAttendanceRequests(data: AttendanceRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_REQUESTS_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

export function getAttendanceRequests(): AttendanceRequest[] {
  return loadAttendanceRequests();
}

export function createAttendanceRequest(
  newItem: Omit<AttendanceRequest, 'id' | 'request_code' | 'status' | 'created_at'>
): AttendanceRequest {
  const currentList = loadAttendanceRequests();
  const typePrefixMap: Record<AttendanceRequestType, string> = {
    LEAVE: 'NP',
    LATE_EARLY_EXCUSE: 'GT',
    OUTSIDE_WORK: 'CT',
    MISSED_PUNCH_EXPLANATION: 'QC',
    OVERTIME_REQUEST: 'OT',
  };
  const prefix = typePrefixMap[newItem.request_type] || 'REQ';

  const created: AttendanceRequest = {
    ...newItem,
    id: `req_${Date.now()}`,
    request_code: `${prefix}-${Date.now().toString().slice(-6)}`,
    status: 'PENDING',
    created_at: new Date().toISOString().split('T')[0],
  };

  const updated = [created, ...currentList];
  saveAttendanceRequests(updated);
  return created;
}

export function approveAttendanceRequest(
  id: string,
  approverRole: 'MANAGER' | 'HR' = 'HR',
  approverNote?: string
): AttendanceRequest {
  const currentRequests = loadAttendanceRequests();
  let updatedReq: AttendanceRequest | undefined;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const updatedRequests = currentRequests.map((req) => {
    if (req.id === id) {
      if (approverRole === 'MANAGER') {
        updatedReq = {
          ...req,
          status: 'MANAGER_APPROVED',
          manager_note: approverNote || 'Quản lý trực tiếp đã duyệt',
          manager_approved_at: now,
        };
      } else {
        // HR / Final approval
        updatedReq = {
          ...req,
          status: 'HR_APPROVED',
          hr_note: approverNote || 'HR đã phê duyệt và đồng bộ bảng công',
          hr_approved_at: now,
        };
      }
      return updatedReq;
    }
    return req;
  });

  if (!updatedReq) throw new Error('Attendance request not found');
  saveAttendanceRequests(updatedRequests);

  // ===== TỰ ĐỘNG ĐỒNG BỘ VÀO BẢNG CHẤM CÔNG HÀNG NGÀY =====
  if (updatedReq.status === 'HR_APPROVED') {
    syncApprovedRequestToAttendance(updatedReq);
  }

  return updatedReq;
}

export function rejectAttendanceRequest(
  id: string,
  approverRole: 'MANAGER' | 'HR' = 'HR',
  note?: string
): AttendanceRequest {
  const currentRequests = loadAttendanceRequests();
  let updatedReq: AttendanceRequest | undefined;

  const updatedRequests = currentRequests.map((req) => {
    if (req.id === id) {
      updatedReq = {
        ...req,
        status: 'REJECTED',
        ...(approverRole === 'MANAGER'
          ? { manager_note: note || 'Quản lý từ chối đơn' }
          : { hr_note: note || 'HR từ chối đơn' }),
      };
      return updatedReq;
    }
    return req;
  });

  if (!updatedReq) throw new Error('Attendance request not found');
  saveAttendanceRequests(updatedRequests);
  return updatedReq;
}

export function deleteAttendanceRequest(id: string): boolean {
  const currentRequests = loadAttendanceRequests();
  const updated = currentRequests.filter((r) => r.id !== id);
  saveAttendanceRequests(updated);
  return true;
}

// Helper sync logic
function syncApprovedRequestToAttendance(req: AttendanceRequest) {
  const attendanceList = loadAttendance();
  const employees = getEmployees();
  const emp = employees.find((e) => e.id === req.employee_id);
  if (!emp) return;

  const targetDate = req.date;
  const existingIdx = attendanceList.findIndex(
    (a) => a.employee_id === req.employee_id && a.date === targetDate
  );

  if (req.request_type === 'LATE_EARLY_EXCUSE') {
    if (existingIdx !== -1) {
      attendanceList[existingIdx] = {
        ...attendanceList[existingIdx],
        status: 'ON_TIME',
        late_minutes: 0,
        early_minutes: 0,
        notes: `[Đã duyệt đơn giải trình: ${req.request_code}] ${attendanceList[existingIdx].notes || ''}`,
      };
      saveAttendance(attendanceList);
    }
  } else if (req.request_type === 'OUTSIDE_WORK') {
    if (existingIdx !== -1) {
      attendanceList[existingIdx] = {
        ...attendanceList[existingIdx],
        check_in_location_type: 'OUTSIDE_REMOTE',
        outside_reason: req.reason,
        notes: `[Đã duyệt công tác ngoài: ${req.outside_location_name || 'Khách hàng'}] ${attendanceList[existingIdx].notes || ''}`,
      };
      saveAttendance(attendanceList);
    }
  } else if (req.request_type === 'MISSED_PUNCH_EXPLANATION') {
    if (existingIdx !== -1) {
      attendanceList[existingIdx] = {
        ...attendanceList[existingIdx],
        check_in_time: req.proposed_check_in || attendanceList[existingIdx].check_in_time || '08:20',
        check_out_time: req.proposed_check_out || attendanceList[existingIdx].check_out_time || '17:30',
        status: 'ON_TIME',
        late_minutes: 0,
        early_minutes: 0,
        notes: `[Đã duyệt bổ sung giờ chấm công: ${req.request_code}]`,
      };
    } else {
      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        employee_id: emp.id,
        employee_name: emp.full_name,
        employee_code: emp.employee_code,
        department: emp.department || 'Phòng Kinh Doanh 1',
        date: targetDate,
        check_in_time: req.proposed_check_in || '08:20',
        check_out_time: req.proposed_check_out || '17:30',
        status: 'ON_TIME',
        late_minutes: 0,
        early_minutes: 0,
        ot_hours: 0,
        notes: `[Bổ sung qua đơn giải trình: ${req.request_code}]`,
      };
      attendanceList.unshift(newRecord);
    }
    saveAttendance(attendanceList);
  } else if (req.request_type === 'OVERTIME_REQUEST') {
    if (existingIdx !== -1) {
      attendanceList[existingIdx] = {
        ...attendanceList[existingIdx],
        ot_hours: (attendanceList[existingIdx].ot_hours || 0) + (req.ot_hours || 2.0),
        status: 'OVERTIME',
        notes: `[Đã duyệt tăng ca OT +${req.ot_hours || 2}h (${req.ot_start_time || '17:30'}-${req.ot_end_time || '19:30'})] ${attendanceList[existingIdx].notes || ''}`,
      };
      saveAttendance(attendanceList);
    }
    // Also create or sync into OvertimeRecord list
    addOvertimeRecord({
      employee_id: req.employee_id,
      employee_name: req.employee_name,
      employee_code: req.employee_code,
      department: req.department,
      date: req.date,
      ot_type: req.ot_pay_multiplier === 3.0 ? 'HOLIDAY' : req.ot_pay_multiplier === 2.0 ? 'WEEKEND' : 'NORMAL_DAY',
      start_time: req.ot_start_time || '17:30',
      end_time: req.ot_end_time || '19:30',
      hours: req.ot_hours || 2.0,
      pay_multiplier: req.ot_pay_multiplier || 1.5,
      request_code: req.request_code,
      approved_by: 'HR Manager (Đặng Kim Anh)',
      reason: req.reason,
      calculated_amount: req.ot_calculated_amount || Math.round((req.ot_hours || 2.0) * (15000000 / (26 * 8)) * (req.ot_pay_multiplier || 1.5)),
    });
  } else if (req.request_type === 'LEAVE') {
    // Sync to leaves list
    createLeaveRequest({
      employee_id: req.employee_id,
      employee_name: req.employee_name,
      employee_code: req.employee_code,
      department: req.department,
      leave_type: req.leave_type || 'ANNUAL',
      start_date: req.date,
      end_date: req.end_date || req.date,
      total_days: req.total_days || 1,
      reason: req.reason,
    });
  }
}

// ===== 7. QUẢN LÝ CHỐT BẢNG CHẤM CÔNG THEO LỊCH (TIMESHEET LOCKING) =====
function loadTimesheetLocks(): TimesheetPeriodLock[] {
  if (typeof window === 'undefined') return INITIAL_TIMESHEET_LOCKS;
  try {
    const raw = localStorage.getItem(TIMESHEET_LOCKS_KEY);
    if (!raw) {
      localStorage.setItem(TIMESHEET_LOCKS_KEY, JSON.stringify(INITIAL_TIMESHEET_LOCKS));
      return INITIAL_TIMESHEET_LOCKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_TIMESHEET_LOCKS;
  }
}

function saveTimesheetLocks(data: TimesheetPeriodLock[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TIMESHEET_LOCKS_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

export function getTimesheetPeriodLocks(): TimesheetPeriodLock[] {
  return loadTimesheetLocks();
}

export function getPeriodLockStatus(period: string): TimesheetPeriodLock {
  const locks = loadTimesheetLocks();
  const found = locks.find((l) => l.period === period);
  if (found) return found;
  return { period, is_locked: false };
}

export function lockTimesheetPeriod(
  period: string,
  lockedBy: string = 'HR Manager',
  note: string = 'Đã chốt công định kỳ và hoàn tất thanh toán lương'
): TimesheetPeriodLock {
  const locks = loadTimesheetLocks();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const existingIdx = locks.findIndex((l) => l.period === period);

  const lockObj: TimesheetPeriodLock = {
    period,
    is_locked: true,
    locked_at: now,
    locked_by: lockedBy,
    lock_note: note,
  };

  if (existingIdx !== -1) {
    locks[existingIdx] = lockObj;
  } else {
    locks.push(lockObj);
  }

  saveTimesheetLocks(locks);
  return lockObj;
}

export function unlockTimesheetPeriod(
  period: string,
  unlockedBy: string = 'System Admin',
  unlockReason: string = 'Admin mở khóa bảng công để hiệu chỉnh bổ sung dữ liệu'
): TimesheetPeriodLock {
  const locks = loadTimesheetLocks();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const existingIdx = locks.findIndex((l) => l.period === period);

  const lockObj: TimesheetPeriodLock = {
    period,
    is_locked: false,
    unlocked_at: now,
    unlocked_by: unlockedBy,
    unlock_reason: unlockReason,
    lock_note: `Đã mở khóa bởi Admin ${unlockedBy}: ${unlockReason}`,
  };

  if (existingIdx !== -1) {
    locks[existingIdx] = lockObj;
  } else {
    locks.push(lockObj);
  }

  saveTimesheetLocks(locks);
  return lockObj;
}

// ===== 8. QUẢN LÝ CHI TIẾT TĂNG CA (OVERTIME LOGS) =====
const OVERTIME_RECORDS_KEY = 'ggbg_overtime_records';

export const INITIAL_OVERTIME_RECORDS: any[] = [
  {
    id: 'ot_1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    date: '2026-07-28',
    ot_type: 'NORMAL_DAY',
    start_time: '17:30',
    end_time: '19:00',
    hours: 1.5,
    pay_multiplier: 1.5,
    request_code: 'OT-202607-001',
    approved_by: 'Nguyễn Quản Lý',
    reason: 'Tư vấn chốt đơn khách hàng VIP Shopee Mall',
    calculated_amount: 242000,
  },
  {
    id: 'ot_2',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    date: '2026-07-28',
    ot_type: 'NORMAL_DAY',
    start_time: '17:30',
    end_time: '19:30',
    hours: 2.0,
    pay_multiplier: 1.5,
    request_code: 'OT-202607-002',
    approved_by: 'Trần Giám Đốc',
    reason: 'Setup cổng thanh toán & cấu hình Flash Sale 8.8',
    calculated_amount: 325000,
  },
  {
    id: 'ot_3',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    date: '2026-07-25',
    ot_type: 'WEEKEND',
    start_time: '09:00',
    end_time: '13:00',
    hours: 4.0,
    pay_multiplier: 2.0,
    request_code: 'OT-202607-003',
    approved_by: 'Nguyễn Quản Lý',
    reason: 'Livestream bán hàng cuối tuần Mega Sale TikTok',
    calculated_amount: 860000,
  },
  {
    id: 'ot_4',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    employee_code: 'NV-00104',
    department: 'Phòng Vận Hành TMĐT',
    date: '2026-07-26',
    ot_type: 'WEEKEND',
    start_time: '14:00',
    end_time: '18:00',
    hours: 4.0,
    pay_multiplier: 2.0,
    request_code: 'OT-202607-004',
    approved_by: 'Trần Giám Đốc',
    reason: 'Xử lý sự cố đồng bộ đơn hàng đa kênh sàn Lazada',
    calculated_amount: 866000,
  },
];

function loadOvertimeRecords(): any[] {
  if (typeof window === 'undefined') return INITIAL_OVERTIME_RECORDS;
  try {
    const raw = localStorage.getItem(OVERTIME_RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(OVERTIME_RECORDS_KEY, JSON.stringify(INITIAL_OVERTIME_RECORDS));
      return INITIAL_OVERTIME_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_OVERTIME_RECORDS;
  }
}

function saveOvertimeRecords(data: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OVERTIME_RECORDS_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(PAYROLL_UPDATED_EVENT));
}

export function getOvertimeRecords(): any[] {
  return loadOvertimeRecords();
}

export function addOvertimeRecord(record: Omit<any, 'id'>): any {
  const current = loadOvertimeRecords();
  const newRec = {
    ...record,
    id: `ot_${Date.now()}`,
  };
  const updated = [newRec, ...current];
  saveOvertimeRecords(updated);
  return newRec;
}

// ===== 9. XUẤT BÁO CÁO EXCEL CSV CHO BẢNG LƯƠNG =====
export function exportPayrollToCsv(period: string = 'Tháng 07/2026'): string {
  const payrolls = getPayrollByPeriod(period);
  
  const headers = [
    'Mã Bảng Lương',
    'Mã Nhân Sự',
    'Họ Và Tên',
    'Phòng Ban',
    'Chức Vụ',
    'Lương P1 (Vị Trí)',
    'Phụ Cấp P2',
    'Lương P3 (Hiệu Suất)',
    'Tiền OT (Tăng Ca)',
    'Thưởng KPI',
    'TỔNG LƯƠNG GROSS',
    'BHXH NLĐ (8%)',
    'BHYT NLĐ (1.5%)',
    'BHTN NLĐ (1%)',
    'TỔNG BHXH NLĐ (10.5%)',
    'BHXH CÔNG TY (17.5%)',
    'BHYT CÔNG TY (3%)',
    'BHTN CÔNG TY (1%)',
    'KPCĐ CÔNG TY (2%)',
    'TỔNG BẢO HIỂM DOANH NGHIỆP (23.5%)',
    'TỔNG CHI PHÍ DOANH NGHIỆP',
    'Thuế TNCN Khấu Trừ',
    'Tạm Ứng Trong Kỳ',
    'Phạt Đi Muộn',
    'Khấu Trừ Khác',
    'TỔNG KHẤU TRỪ',
    'LƯƠNG THỰC NHẬN (NET)',
    'Số Tài Khoản',
    'Ngân Hàng',
    'Trạng Thái',
  ];

  const rows = payrolls.map((p) => [
    p.payroll_code,
    p.employee_code,
    `"${p.employee_name}"`,
    `"${p.department}"`,
    `"${p.position}"`,
    p.p1_calculated_salary,
    p.p2_allowances,
    p.p3_performance_salary,
    p.ot_salary,
    p.bonus_amount,
    p.total_gross_income,
    p.bhxh_deduction,
    p.bhyt_deduction,
    p.bhtn_deduction,
    p.total_employee_insurance || (p.bhxh_deduction + p.bhyt_deduction + p.bhtn_deduction),
    p.company_bhxh_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.175),
    p.company_bhyt_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.03),
    p.company_bhtn_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.01),
    p.company_union_fee || Math.round((p.insurance_salary || p.base_salary) * 0.02),
    p.total_company_insurance_cost || Math.round((p.insurance_salary || p.base_salary) * 0.235),
    p.total_company_cost || (p.total_gross_income + Math.round((p.insurance_salary || p.base_salary) * 0.235)),
    p.personal_income_tax,
    p.salary_advance_deduction || 0,
    p.late_penalty_deduction,
    p.other_deductions || 0,
    p.total_deductions,
    p.net_salary,
    `"${p.bank_account || ''}"`,
    `"${p.bank_name || ''}"`,
    p.status === 'SENT_PAYSTUB' ? 'Đã Gửi Phiếu' : 'Bản Thảo',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return csvContent;
}

// ===== 10. QUẢN LÝ QUY TRÌNH PHÊ DUYỆT BẢNG LƯƠNG 5 BƯỚC =====
const PAYROLL_APPROVAL_KEY = 'ggbg_payroll_approvals';
const BANK_BATCHES_KEY = 'ggbg_bank_payment_batches';

export function getPayrollApprovalPeriods(): PayrollApprovalPeriod[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PAYROLL_APPROVAL_KEY);
  if (!stored) {
    // Khởi tạo mặc định cho kỳ hiện tại
    const defaultPeriod: PayrollApprovalPeriod = {
      period: 'Tháng 07/2026',
      status: 'HR_CHECKED',
      total_employees: 5,
      total_gross: 94800000,
      total_net: 82500000,
      total_company_cost: 112400000,
      created_by: 'Nguyễn Thị Hoa (C&B Specialist)',
      created_at: '2026-07-28 09:00',
      hr_checked_by: 'Nguyễn Thị Hoa (C&B Specialist)',
      hr_checked_at: '2026-07-28 14:30',
      hr_note: 'Đã rà soát đủ 5/5 nhân sự, khớp công, phép năm AL và giảm trừ gia cảnh thuế TNCN.',
      logs: [
        {
          id: 'log_001',
          step: 'CREATE',
          actor_name: 'Nguyễn Thị Hoa',
          actor_role: 'Chuyên viên C&B',
          timestamp: '2026-07-28 09:00',
          action: 'SUBMIT',
          note: 'Khởi tạo và tính toán bảng lương 3P tháng 07/2026.',
        },
        {
          id: 'log_002',
          step: 'HR_CHECK',
          actor_name: 'Nguyễn Thị Hoa',
          actor_role: 'Chuyên viên C&B',
          timestamp: '2026-07-28 14:30',
          action: 'APPROVE',
          note: 'Đã rà soát chi tiết 100% dòng lương, xác nhận hợp lệ và trình GĐ Nhân sự.',
        },
      ],
    };
    localStorage.setItem(PAYROLL_APPROVAL_KEY, JSON.stringify([defaultPeriod]));
    return [defaultPeriod];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function savePayrollApprovalPeriods(periods: PayrollApprovalPeriod[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAYROLL_APPROVAL_KEY, JSON.stringify(periods));
  notifyPayrollChange();
}

export function getPayrollApprovalPeriod(period: string = 'Tháng 07/2026'): PayrollApprovalPeriod {
  const list = getPayrollApprovalPeriods();
  const found = list.find((p) => p.period === period);
  if (found) return found;

  const payrolls = getPayrollByPeriod(period);
  const totalGross = payrolls.reduce((acc, curr) => acc + curr.total_gross_income, 0);
  const totalNet = payrolls.reduce((acc, curr) => acc + curr.net_salary, 0);
  const totalCost = payrolls.reduce((acc, curr) => acc + (curr.total_company_cost || curr.total_gross_income), 0);

  const newPeriod: PayrollApprovalPeriod = {
    period,
    status: 'DRAFT',
    total_employees: payrolls.length,
    total_gross: totalGross,
    total_net: totalNet,
    total_company_cost: totalCost,
    created_by: 'Chuyên viên C&B Nhân sự',
    created_at: new Date().toLocaleString('vi-VN'),
    logs: [
      {
        id: `log_${Date.now()}`,
        step: 'CREATE',
        actor_name: 'Chuyên viên C&B',
        actor_role: 'Chuyên viên Nhân sự',
        timestamp: new Date().toLocaleString('vi-VN'),
        action: 'SUBMIT',
        note: `Khởi tạo bảng lương ${period}`,
      },
    ],
  };

  const updated = [newPeriod, ...list];
  savePayrollApprovalPeriods(updated);
  return newPeriod;
}

// 1. Chuyên viên Nhân sự kiểm tra & xác nhận trình duyệt
export function submitHrCheck(
  period: string,
  actorName: string = 'Nguyễn Thị Hoa (Chuyên viên C&B)',
  note: string = 'Đã rà soát đối soát chi tiết toàn bộ bảng lương, khớp ngày công, BHXH và thuế TNCN.'
): PayrollApprovalPeriod {
  const list = getPayrollApprovalPeriods();
  const index = list.findIndex((p) => p.period === period);
  const now = new Date().toLocaleString('vi-VN');

  const current = index >= 0 ? list[index] : getPayrollApprovalPeriod(period);
  const updatedPeriod: PayrollApprovalPeriod = {
    ...current,
    status: 'HR_CHECKED',
    hr_checked_by: actorName,
    hr_checked_at: now,
    hr_note: note,
    logs: [
      ...current.logs,
      {
        id: `log_${Date.now()}`,
        step: 'HR_CHECK',
        actor_name: actorName,
        actor_role: 'Chuyên viên C&B / Nhân sự',
        timestamp: now,
        action: 'APPROVE',
        note,
      },
    ],
  };

  if (index >= 0) list[index] = updatedPeriod;
  else list.push(updatedPeriod);

  savePayrollApprovalPeriods(list);
  return updatedPeriod;
}

// 2. Trưởng phòng / Giám đốc Nhân sự phê duyệt & trình CEO
export function approveHrd(
  period: string,
  actorName: string = 'Đặng Kim Anh (Giám đốc Nhân sự)',
  note: string = 'Đã thẩm định quỹ lương và cơ cấu thưởng hiệu suất P3, đồng ý trình Tổng Giám Đốc phê duyệt chi.'
): PayrollApprovalPeriod {
  const list = getPayrollApprovalPeriods();
  const index = list.findIndex((p) => p.period === period);
  const now = new Date().toLocaleString('vi-VN');

  const current = index >= 0 ? list[index] : getPayrollApprovalPeriod(period);
  const updatedPeriod: PayrollApprovalPeriod = {
    ...current,
    status: 'HRD_APPROVED',
    hrd_approved_by: actorName,
    hrd_approved_at: now,
    hrd_note: note,
    logs: [
      ...current.logs,
      {
        id: `log_${Date.now()}`,
        step: 'HRD_APPROVE',
        actor_name: actorName,
        actor_role: 'Giám đốc / Trưởng phòng Nhân sự',
        timestamp: now,
        action: 'APPROVE',
        note,
      },
    ],
  };

  if (index >= 0) list[index] = updatedPeriod;
  else list.push(updatedPeriod);

  savePayrollApprovalPeriods(list);
  return updatedPeriod;
}

// 3. CEO / Tổng Giám Đốc ký duyệt chi ngân sách
export function approveCeo(
  period: string,
  actorName: string = 'Trần Đình Hoàng (Tổng Giám Đốc / CEO)',
  note: string = 'Phê duyệt chi ngân sách quỹ lương tháng. Chuyển Kế toán trưởng lập lệnh thanh toán chuyển khoản.'
): PayrollApprovalPeriod {
  const list = getPayrollApprovalPeriods();
  const index = list.findIndex((p) => p.period === period);
  const now = new Date().toLocaleString('vi-VN');

  const current = index >= 0 ? list[index] : getPayrollApprovalPeriod(period);
  const updatedPeriod: PayrollApprovalPeriod = {
    ...current,
    status: 'CEO_APPROVED',
    ceo_approved_by: actorName,
    ceo_approved_at: now,
    ceo_note: note,
    logs: [
      ...current.logs,
      {
        id: `log_${Date.now()}`,
        step: 'CEO_APPROVE',
        actor_name: actorName,
        actor_role: 'Tổng Giám Đốc (CEO)',
        timestamp: now,
        action: 'APPROVE',
        note,
      },
    ],
  };

  if (index >= 0) list[index] = updatedPeriod;
  else list.push(updatedPeriod);

  savePayrollApprovalPeriods(list);

  // Tự động sinh sẵn Bank Payment Batch cho Kế toán trưởng
  generateBankPaymentBatch(period);

  return updatedPeriod;
}

// Trả lại yêu cầu điều chỉnh (Reject / Changes requested)
export function rejectPayrollApproval(
  period: string,
  actorName: string,
  reason: string
): PayrollApprovalPeriod {
  const list = getPayrollApprovalPeriods();
  const index = list.findIndex((p) => p.period === period);
  const now = new Date().toLocaleString('vi-VN');

  const current = index >= 0 ? list[index] : getPayrollApprovalPeriod(period);
  const updatedPeriod: PayrollApprovalPeriod = {
    ...current,
    status: 'CHANGES_REQUESTED',
    logs: [
      ...current.logs,
      {
        id: `log_${Date.now()}`,
        step: 'REJECT',
        actor_name: actorName,
        actor_role: 'Cấp Quản Lý Thẩm Định',
        timestamp: now,
        action: 'REJECT',
        note: `Yêu cầu điều chỉnh: ${reason}`,
      },
    ],
  };

  if (index >= 0) list[index] = updatedPeriod;
  else list.push(updatedPeriod);

  savePayrollApprovalPeriods(list);
  return updatedPeriod;
}

// ===== 11. QUẢN LÝ LỆNH CHUYỂN KHOẢN NGÂN HÀNG TỰ ĐỘNG (BANK PAYMENT BATCH) =====
export function getBankPaymentBatches(): BankPaymentBatch[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(BANK_BATCHES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveBankPaymentBatches(batches: BankPaymentBatch[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BANK_BATCHES_KEY, JSON.stringify(batches));
  notifyPayrollChange();
}

export function getBankPaymentBatchByPeriod(period: string = 'Tháng 07/2026'): BankPaymentBatch | undefined {
  const batches = getBankPaymentBatches();
  return batches.find((b) => b.period === period);
}

// Sinh danh sách chuyển khoản ngân hàng tự động từ Bảng Lương
export function generateBankPaymentBatch(
  period: string = 'Tháng 07/2026',
  sourceBank: string = 'Techcombank Doanh Nghiệp',
  sourceAccountNumber: string = '19038888999988',
  sourceAccountName: string = 'CONG TY CP GGBINGO VIET NAM'
): BankPaymentBatch {
  const payrolls = getPayrollByPeriod(period);
  const batches = getBankPaymentBatches();
  const existing = batches.find((b) => b.period === period);

  const cleanPeriod = period.replace(/[\/\s]/g, '');
  const batchCode = `UNC-GGBG-${cleanPeriod}-${Date.now().toString().slice(-4)}`;

  const items: BankDisbursementItem[] = payrolls.map((p) => {
    // Chuẩn hóa tên ngân hàng và số tài khoản
    const bankName = p.bank_name || 'MBBank';
    const bankAcc = p.bank_account || '0988888888';
    const bankHolder = p.bank_account_holder || p.employee_name.toUpperCase();
    const bankBranch = p.bank_branch || 'Chi nhánh Hà Nội';
    const cleanEmpName = p.employee_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    const paymentContent = `GGBG TRA LUONG ${period.toUpperCase().replace('THÁNG ', 'T')} CHO ${cleanEmpName}`;

    return {
      id: `disb_${p.id}`,
      employee_id: p.employee_id,
      employee_code: p.employee_code,
      employee_name: p.employee_name,
      bank_account_holder: bankHolder,
      department: p.department,
      bank_name: bankName,
      bank_account: bankAcc,
      bank_branch: bankBranch,
      amount: p.net_salary,
      payment_content: paymentContent,
      status: 'PENDING',
      transaction_ref: `REF-${p.employee_code}-${cleanPeriod}`,
    };
  });

  const totalAmount = items.reduce((acc, curr) => acc + curr.amount, 0);

  const newBatch: BankPaymentBatch = {
    id: existing ? existing.id : `batch_${Date.now()}`,
    batch_code: existing ? existing.batch_code : batchCode,
    period,
    source_bank: sourceBank,
    source_account_number: sourceAccountNumber,
    source_account_name: sourceAccountName,
    total_recipients: items.length,
    total_amount: totalAmount,
    created_at: existing ? existing.created_at : new Date().toLocaleString('vi-VN'),
    created_by: 'Nguyễn Thu Thảo (Kế Toán Trưởng)',
    status: existing ? existing.status : 'GENERATED',
    items: existing ? existing.items : items,
  };

  const updated = existing
    ? batches.map((b) => (b.id === newBatch.id ? newBatch : b))
    : [newBatch, ...batches];

  saveBankPaymentBatches(updated);
  return newBatch;
}

// Xuất file lệnh chuyển tiền theo định dạng các Ngân hàng Việt Nam (VCB, TCB, MBB, Chuẩn Chung)
export function exportBankBatchToCsv(
  batchId: string,
  bankFormat: 'VCB' | 'TCB' | 'MBB' | 'GENERAL' = 'GENERAL'
): string {
  const batches = getBankPaymentBatches();
  const batch = batches.find((b) => b.id === batchId) || batches[0];
  if (!batch) return '';

  let headers: string[] = [];
  let rows: string[][] = [];

  if (bankFormat === 'VCB') {
    // Mẫu Lô Chi Lương Vietcombank
    headers = [
      'STT',
      'Tài Khoản Trích Nợ',
      'Tài Khoản Người Hưởng',
      'Tên Người Hưởng',
      'Số Tiền',
      'Mã Ngân Hàng Hưởng',
      'Tên Ngân Hàng Hưởng',
      'Chi Nhánh',
      'Nội Dung Thanh Toán',
    ];
    rows = batch.items.map((item, idx) => [
      String(idx + 1),
      batch.source_account_number,
      item.bank_account,
      `"${item.employee_name.toUpperCase()}"`,
      String(item.amount),
      'VCB',
      `"${item.bank_name}"`,
      `"${item.bank_branch || 'Hà Nội'}"`,
      `"${item.payment_content}"`,
    ]);
  } else if (bankFormat === 'TCB') {
    // Mẫu Techcombank Corporate Fast Transfer
    headers = [
      'STT',
      'Beneficiary Account',
      'Beneficiary Name',
      'Beneficiary Bank',
      'Amount',
      'Payment Details',
      'Employee Code',
    ];
    rows = batch.items.map((item, idx) => [
      String(idx + 1),
      item.bank_account,
      `"${item.employee_name.toUpperCase()}"`,
      `"${item.bank_name}"`,
      String(item.amount),
      `"${item.payment_content}"`,
      item.employee_code,
    ]);
  } else if (bankFormat === 'MBB') {
    // Mẫu MBBank Chi Lương Trả Tài Khoản
    headers = [
      'STT',
      'Số Tài Khoản Nhận',
      'Tên Người Nhận',
      'Số Tiền Chuyển',
      'Ngân Hàng Nhận',
      'Nội Dung Chuyển Khoản',
      'Mã Nhân Viên',
      'Phòng Ban',
    ];
    rows = batch.items.map((item, idx) => [
      String(idx + 1),
      item.bank_account,
      `"${item.employee_name}"`,
      String(item.amount),
      `"${item.bank_name}"`,
      `"${item.payment_content}"`,
      item.employee_code,
      `"${item.department}"`,
    ]);
  } else {
    // Mẫu Ủy Nhiệm Chi Lô Chuẩn Chung (Excel / CSV)
    headers = [
      'STT',
      'Mã Nhân Viên',
      'Họ Và Tên',
      'Phòng Ban',
      'Số Tài Khoản Nhận',
      'Tên Ngân Hàng',
      'Chi Nhánh',
      'Số Tiền Lương NET (VNĐ)',
      'Nội Dung Chuyển Khoản',
      'Mã Giao Dịch',
      'Trạng Thái',
    ];
    rows = batch.items.map((item, idx) => [
      String(idx + 1),
      item.employee_code,
      `"${item.employee_name}"`,
      `"${item.department}"`,
      item.bank_account,
      `"${item.bank_name}"`,
      `"${item.bank_branch || 'Trụ sở chính'}"`,
      String(item.amount),
      `"${item.payment_content}"`,
      item.transaction_ref || '',
      item.status === 'SUCCESS' ? 'Thành Công' : 'Chờ Chuyển',
    ]);
  }

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return csvContent;
}

// 4. Kế toán trưởng xác nhận đã chuyển khoản ngân hàng hoàn tất & Hạch toán dòng tiền
export function confirmBankDisbursement(
  period: string,
  batchId: string,
  actorName: string = 'Nguyễn Thu Thảo (Kế Toán Trưởng)'
): { success: boolean; message: string; batch: BankPaymentBatch } {
  const batches = getBankPaymentBatches();
  const batchIndex = batches.findIndex((b) => b.id === batchId || b.period === period);
  const now = new Date().toLocaleString('vi-VN');

  if (batchIndex < 0) {
    const newBatch = generateBankPaymentBatch(period);
    return confirmBankDisbursement(period, newBatch.id, actorName);
  }

  const batch = batches[batchIndex];
  const updatedItems = batch.items.map((i) => ({
    ...i,
    status: 'SUCCESS' as const,
  }));

  const updatedBatch: BankPaymentBatch = {
    ...batch,
    status: 'COMPLETED',
    completed_at: now,
    items: updatedItems,
  };

  batches[batchIndex] = updatedBatch;
  saveBankPaymentBatches(batches);

  // Cập nhật trạng thái vòng đời bảng lương sang DISBURSED
  const approvalList = getPayrollApprovalPeriods();
  const appIndex = approvalList.findIndex((p) => p.period === period);
  if (appIndex >= 0) {
    approvalList[appIndex] = {
      ...approvalList[appIndex],
      status: 'DISBURSED',
      disbursed_by: actorName,
      disbursed_at: now,
      payment_batch_code: batch.batch_code,
      logs: [
        ...approvalList[appIndex].logs,
        {
          id: `log_${Date.now()}`,
          step: 'ACCOUNTANT_DISBURSE',
          actor_name: actorName,
          actor_role: 'Kế Toán Trưởng',
          timestamp: now,
          action: 'DISBURSE',
          note: `Đã thực hiện lệnh chuyển khoản ${batch.batch_code} qua ${batch.source_bank} cho ${batch.total_recipients} nhân sự.`,
        },
      ],
    };
    savePayrollApprovalPeriods(approvalList);
  }

  // Cập nhật toàn bộ phiếu lương thành SENT_PAYSTUB
  sendBatchPaystubs(period);

  return {
    success: true,
    message: `Đã xác nhận chuyển khoản thành công ${batch.batch_code} cho ${batch.total_recipients} nhân sự!`,
    batch: updatedBatch,
  };
}

