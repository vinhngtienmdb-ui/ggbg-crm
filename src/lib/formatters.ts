/**
 * Standard System Formatters (Định Dạng Chuẩn Hệ Thống GGBG ERP):
 * - Số và số tiền có dấu phẩy (,) phân cách hàng nghìn từ 1,000 trở lên
 * - Ngày tháng theo định dạng dd/mm/yyyy
 * - Múi giờ Việt Nam GMT+7 (Asia/Ho_Chi_Minh)
 */

/**
 * Định dạng số bất kỳ có dấu phẩy (,) phân cách hàng nghìn từ 1,000 trở lên
 * Ví dụ: 1000 -> "1,000", 15000000 -> "15,000,000", 12345.6 -> "12,345.6"
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals?: number
): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '0';

  if (decimals !== undefined) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return num.toLocaleString('en-US');
}

/**
 * Định dạng số tiền có dấu phẩy (,) hàng nghìn từ 1,000 trở lên (Ví dụ: 15,000,000 ₫)
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currencySymbol = '₫'
): string {
  if (amount === null || amount === undefined || amount === '') return `0 ${currencySymbol}`;
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (isNaN(num)) return `0 ${currencySymbol}`;

  return `${num.toLocaleString('en-US')} ${currencySymbol}`;
}

/**
 * Định dạng số kèm đơn vị tính có dấu phẩy (,) (Ví dụ: 1,250 Lead, 5,400 Phút)
 */
export function formatNumberWithUnit(
  value: number | string | null | undefined,
  unit = ''
): string {
  const formatted = formatNumber(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Định dạng ngày theo chuẩn dd/mm/yyyy (Múi giờ GMT+7)
 * Ví dụ: "2026-07-28" -> "28/07/2026"
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';

  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    // Enforce GMT+7 Timezone Formatting
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(d);
  } catch (err) {
    return String(dateInput);
  }
}

/**
 * Định dạng ngày & giờ theo chuẩn dd/mm/yyyy HH:mm (Múi giờ GMT+7)
 * Ví dụ: "2026-07-28T14:30:00Z" -> "28/07/2026 14:30"
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';

  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(d);
  } catch (err) {
    return String(dateInput);
  }
}
