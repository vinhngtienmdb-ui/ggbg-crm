/**
 * Che dữ liệu cá nhân nhạy cảm (PII) theo vai trò.
 * Chỉ các vai trò được phép mới xem đầy đủ CCCD, SĐT, BHXH, MST, tài khoản NH, lương.
 */

const PII_ALLOWED_ROLES = new Set(['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER']);

export function canViewPII(role?: string, isSuperAdmin?: boolean): boolean {
  if (isSuperAdmin) return true;
  return PII_ALLOWED_ROLES.has((role || '').toUpperCase());
}

/** Giữ 4 số cuối: 0•••• 1234 */
export function maskPhone(value?: string): string {
  if (!value) return '—';
  const digits = value.replace(/\s+/g, '');
  if (digits.length <= 4) return '••••';
  return digits.slice(0, 2) + '••••' + digits.slice(-3);
}

/** CCCD/CMND: chỉ hiện 4 số cuối */
export function maskId(value?: string): string {
  if (!value) return '—';
  const s = value.trim();
  if (s.length <= 4) return '••••';
  return '••••••••' + s.slice(-4);
}

/** Số tài khoản ngân hàng */
export function maskAccount(value?: string): string {
  if (!value) return '—';
  const s = value.trim();
  if (s.length <= 4) return '••••';
  return '••••' + s.slice(-4);
}

/** Mã số thuế / BHXH / BHYT */
export function maskCode(value?: string): string {
  if (!value) return '—';
  const s = value.trim();
  if (s.length <= 3) return '•••';
  return s.slice(0, 2) + '••••' + s.slice(-2);
}

/** Lương: ẩn hoàn toàn khi không đủ quyền */
export function maskSalary(canView: boolean, formatted: string): string {
  return canView ? formatted : '••••••';
}

/** Áp che theo cờ quyền: trả giá trị gốc nếu được xem, ngược lại giá trị đã che. */
export function pii<T extends string>(canView: boolean, raw: T | undefined, masker: (v?: string) => string): string {
  if (canView) return raw ?? '—';
  return masker(raw);
}
