/**
 * Lớp dữ liệu Nhân sự (HRM) — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `employees`
 *    (id, employee_code, full_name, department, position, status, contract_type,
 *    contract_end_date date, data jsonb). Cột `data` lưu TOÀN BỘ object
 *    EmployeeProfile.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_EMPLOYEES.
 *
 * Module này chỉ phục vụ seed & search: repo + seed + GET API (KHÔNG đổi trang HRM).
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { EmployeeProfile } from '@/types';
import { INITIAL_EMPLOYEES } from './hrmStore';

let memoryEmployees: EmployeeProfile[] = INITIAL_EMPLOYEES.map((e) => ({ ...e }));

/** Ghép row DB (jsonb `data` + id) về đúng shape EmployeeProfile. */
function rowToEmployee(row: any): EmployeeProfile {
  const data = (row?.data ?? {}) as Partial<EmployeeProfile>;
  return { ...(data as EmployeeProfile), id: row.id };
}

/** Map object EmployeeProfile -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function employeeToRow(e: EmployeeProfile) {
  return {
    id: e.id,
    employee_code: e.employee_code ?? null,
    full_name: e.full_name ?? null,
    department: e.department ?? null,
    position: e.position ?? null,
    status: e.status ?? null,
    contract_type: e.contract_type ?? null,
    contract_end_date: e.contract_end_date || null,
    data: e,
  };
}

/** Đọc toàn bộ hồ sơ nhân sự. */
export async function listEmployees(): Promise<EmployeeProfile[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('employees').select('id, data');
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToEmployee);
      } catch (err) {
        console.error('[employeesRepo.listEmployees] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryEmployees.map((e) => ({ ...e }));
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_EMPLOYEES, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedEmployees(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_EMPLOYEES.map((e) => employeeToRow(e));
        const { error } = await supabase.from('employees').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[employeesRepo.seedEmployees] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryEmployees = INITIAL_EMPLOYEES.map((e) => ({ ...e }));
  return memoryEmployees.length;
}
