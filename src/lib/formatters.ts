/**
 * Standard System Formatters (Định Dạng Chuẩn Hệ Thống GGBG ERP):
 * - Số tiền có dấu chấm (.) phân cách hàng nghìn (Việt Nam)
 * - Ngày tháng theo định dạng dd/mm/yyyy
 * - Múi giờ Việt Nam GMT+7 (Asia/Ho_Chi_Minh)
 */

/**
 * Định dạng số tiền có dấu (.) hàng nghìn (Ví dụ: 15.000.000 ₫)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';
  return `${amount.toLocaleString('vi-VN')} ₫`;
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
