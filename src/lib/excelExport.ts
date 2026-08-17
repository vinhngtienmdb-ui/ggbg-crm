import { getPayrollByPeriod, getBankPaymentBatches, getBankPaymentBatchByPeriod, generateBankPaymentBatch } from './payrollStore';

const FONT_NAME = 'Times New Roman';
const DATA_FONT_SIZE = 14;

// Utility trigger download in browser
async function downloadWorkbook(workbook: any, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

const thinBorder: any = {
  top: { style: 'thin', color: { argb: 'FF94A3B8' } },
  left: { style: 'thin', color: { argb: 'FF94A3B8' } },
  bottom: { style: 'thin', color: { argb: 'FF94A3B8' } },
  right: { style: 'thin', color: { argb: 'FF94A3B8' } },
};

const doubleBottomBorder: any = {
  top: { style: 'thin', color: { argb: 'FF334155' } },
  left: { style: 'thin', color: { argb: 'FF334155' } },
  bottom: { style: 'double', color: { argb: 'FF334155' } },
  right: { style: 'thin', color: { argb: 'FF334155' } },
};

/**
 * Xuất Bảng Lương 3P toàn diện sang định dạng *.xlsx nguyên bản
 * Áp dụng font Times New Roman + Cỡ chữ 14 + Viền lưới + Định dạng số chuẩn
 */
export async function exportPayrollToXlsx(period: string = 'Tháng 07/2026'): Promise<void> {
  const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
  const payrolls = getPayrollByPeriod(period);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GGBingo CRM';
  workbook.lastModifiedBy = 'Hệ Thống Quản Trị Doanh Nghiệp GGBG';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Bang_Luong_3P', {
    views: [{ showGridLines: true }],
  });

  // 1. Company Info Header
  const r1 = ws.addRow(['CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM']);
  r1.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: 'FF1E3A8A' } };

  const r2 = ws.addRow(['Mã số thuế: 0109988776 — Địa chỉ: Tòa nhà GGBG Tower, Hà Nội — Hotline: 1900 6868']);
  r2.font = { name: FONT_NAME, size: 12, italic: true, color: { argb: 'FF475569' } };

  ws.addRow([]); // Blank row

  // 2. Title Banner
  const titleRow = ws.addRow([`BẢNG THANH TOÁN TIỀN LƯƠNG & BẢO HIỂM 3P — KỲ ${period.toUpperCase()}`]);
  titleRow.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF0F172A' } };
  titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 32;
  ws.mergeCells(`A${titleRow.number}:AE${titleRow.number}`);

  const subTitleRow = ws.addRow([
    `Ngày kết xuất dữ liệu: ${new Date().toLocaleDateString('vi-VN')} | Đơn vị tiền tệ: Việt Nam Đồng (VNĐ)`,
  ]);
  subTitleRow.font = { name: FONT_NAME, size: 13, italic: true, color: { argb: 'FF64748B' } };
  subTitleRow.alignment = { horizontal: 'center' };
  ws.mergeCells(`A${subTitleRow.number}:AE${subTitleRow.number}`);

  ws.addRow([]); // Blank row

  // 3. Table Headers
  const headers = [
    'STT',
    'Mã Bảng Lương',
    'Mã Nhân Sự',
    'Họ Và Tên',
    'Phòng Ban',
    'Chức Vụ',
    'Lương P1 (Vị Trí)',
    'Phụ Cấp P2',
    'Lương P3 (KPI)',
    'Tiền OT (Tăng Ca)',
    'Thưởng KPI',
    'TỔNG GROSS',
    'BHXH NLĐ (8%)',
    'BHYT NLĐ (1.5%)',
    'BHTN NLĐ (1%)',
    'TỔNG BHXH NLĐ (10.5%)',
    'BHXH C.TY (17.5%)',
    'BHYT C.TY (3%)',
    'BHTN C.TY (1%)',
    'KPCĐ C.TY (2%)',
    'TỔNG BH C.TY (23.5%)',
    'TỔNG CHI PHÍ DOANH NGHIỆP',
    'Thuế TNCN',
    'Tạm Ứng Trong Kỳ',
    'Phạt Đi Muộn',
    'Tổng Khấu Trừ',
    'LƯƠNG THỰC NHẬN (NET)',
    'Chủ Tài Khoản',
    'Số Tài Khoản',
    'Ngân Hàng',
    'Chi Nhánh',
  ];

  const headerRow = ws.addRow(headers);
  headerRow.height = 36;
  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Slate-800
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = thinBorder;
  });

  // 4. Data Rows
  payrolls.forEach((p, idx) => {
    const employeeBhTotal = p.total_employee_insurance || (p.bhxh_deduction + p.bhyt_deduction + p.bhtn_deduction);
    const companyBhxh = p.company_bhxh_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.175);
    const companyBhyt = p.company_bhyt_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.03);
    const companyBhtn = p.company_bhtn_contribution || Math.round((p.insurance_salary || p.base_salary) * 0.01);
    const companyUnion = p.company_union_fee || Math.round((p.insurance_salary || p.base_salary) * 0.02);
    const companyBhTotal = p.total_company_insurance_cost || (companyBhxh + companyBhyt + companyBhtn + companyUnion);
    const totalCompanyCost = p.total_company_cost || (p.total_gross_income + companyBhTotal);

    const bankHolder = p.bank_account_holder || p.employee_name.toUpperCase();
    const bankBranch = p.bank_branch || 'Chi nhánh Hà Nội';

    const rowValues = [
      idx + 1,
      p.payroll_code,
      p.employee_code,
      p.employee_name,
      p.department,
      p.position,
      p.p1_calculated_salary,
      p.p2_allowances,
      p.p3_performance_salary,
      p.ot_salary,
      p.bonus_amount || 0,
      p.total_gross_income,
      p.bhxh_deduction,
      p.bhyt_deduction,
      p.bhtn_deduction,
      employeeBhTotal,
      companyBhxh,
      companyBhyt,
      companyBhtn,
      companyUnion,
      companyBhTotal,
      totalCompanyCost,
      p.personal_income_tax,
      p.salary_advance_deduction || 0,
      p.late_penalty_deduction,
      p.total_deductions,
      p.net_salary,
      bankHolder,
      p.bank_account || '',
      p.bank_name || '',
      bankBranch,
    ];

    const row = ws.addRow(rowValues);
    row.height = 28;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE };
      cell.border = thinBorder;

      // Formatting based on column type
      if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 4 || colNumber === 5 || colNumber === 6 || colNumber === 28 || colNumber === 30 || colNumber === 31) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else if (colNumber === 29) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        // Currency numeric columns
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0';
      }

      // Highlight key columns
      if (colNumber === 12) {
        // Total Gross
        cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF1E40AF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
      } else if (colNumber === 27) {
        // NET Salary
        cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF065F46' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
      }
    });
  });

  // 5. Total Row
  const totalGross = payrolls.reduce((a, c) => a + c.total_gross_income, 0);
  const totalNet = payrolls.reduce((a, c) => a + c.net_salary, 0);
  const totalP1 = payrolls.reduce((a, c) => a + c.p1_calculated_salary, 0);
  const totalP2 = payrolls.reduce((a, c) => a + c.p2_allowances, 0);
  const totalP3 = payrolls.reduce((a, c) => a + c.p3_performance_salary, 0);
  const totalOT = payrolls.reduce((a, c) => a + c.ot_salary, 0);
  const totalBonus = payrolls.reduce((a, c) => a + (c.bonus_amount || 0), 0);
  const totalEmpBh = payrolls.reduce((a, c) => a + (c.total_employee_insurance || (c.bhxh_deduction + c.bhyt_deduction + c.bhtn_deduction)), 0);
  const totalTax = payrolls.reduce((a, c) => a + c.personal_income_tax, 0);
  const totalAdvance = payrolls.reduce((a, c) => a + (c.salary_advance_deduction || 0), 0);
  const totalPenalty = payrolls.reduce((a, c) => a + c.late_penalty_deduction, 0);
  const totalDeduction = payrolls.reduce((a, c) => a + c.total_deductions, 0);
  const totalCompCost = payrolls.reduce((a, c) => a + (c.total_company_cost || (c.total_gross_income + Math.round((c.insurance_salary || c.base_salary) * 0.235))), 0);

  const totalRowValues = [
    'TỔNG CỘNG',
    '',
    '',
    `${payrolls.length} Nhân Sự`,
    '',
    '',
    totalP1,
    totalP2,
    totalP3,
    totalOT,
    totalBonus,
    totalGross,
    0,
    0,
    0,
    totalEmpBh,
    0,
    0,
    0,
    0,
    0,
    totalCompCost,
    totalTax,
    totalAdvance,
    totalPenalty,
    totalDeduction,
    totalNet,
    '',
    '',
    '',
    '',
  ];

  const totalRow = ws.addRow(totalRowValues);
  totalRow.height = 32;
  totalRow.eachCell((cell, colNumber) => {
    cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.border = doubleBottomBorder;

    if (colNumber >= 7 && colNumber <= 27) {
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
      cell.numFmt = '#,##0';
    } else {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
  });

  // Merge Total Label A -> C
  ws.mergeCells(`A${totalRow.number}:C${totalRow.number}`);

  // 6. Signature Section
  ws.addRow([]); // Blank
  ws.addRow([]); // Blank

  const sigTitleRow = ws.addRow([
    '',
    'NGƯỜI LẬP BIỂU',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'KẾ TOÁN TRƯỞNG',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'GIÁM ĐỐC NHÂN SỰ',
    '',
    '',
    '',
    '',
    'TỔNG GIÁM ĐỐC DUYỆT',
  ]);
  sigTitleRow.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF0F172A' } };
  sigTitleRow.alignment = { horizontal: 'center' };

  const sigSubRow = ws.addRow([
    '',
    '(Ký & ghi rõ họ tên)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '(Ký & ghi rõ họ tên)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '(Ký & ghi rõ họ tên)',
    '',
    '',
    '',
    '',
    '(Ký, đóng dấu & ghi rõ họ tên)',
  ]);
  sigSubRow.font = { name: FONT_NAME, size: 12, italic: true, color: { argb: 'FF64748B' } };
  sigSubRow.alignment = { horizontal: 'center' };

  ws.addRow([]);
  ws.addRow([]);
  ws.addRow([]);

  const sigNameRow = ws.addRow([
    '',
    'Nguyễn Thị Hoa',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Nguyễn Thu Thảo',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Đặng Kim Anh',
    '',
    '',
    '',
    '',
    'Trần Đình Hoàng',
  ]);
  sigNameRow.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF0F172A' } };
  sigNameRow.alignment = { horizontal: 'center' };

  // Set optimized column widths
  ws.columns = [
    { width: 8 },  // STT
    { width: 20 }, // Mã Lương
    { width: 16 }, // Mã NV
    { width: 26 }, // Họ Tên
    { width: 24 }, // Phòng Ban
    { width: 22 }, // Chức Vụ
    { width: 18 }, // P1
    { width: 16 }, // P2
    { width: 18 }, // P3
    { width: 16 }, // OT
    { width: 16 }, // Thưởng
    { width: 20 }, // Tổng Gross
    { width: 16 }, // BHXH
    { width: 16 }, // BHYT
    { width: 16 }, // BHTN
    { width: 20 }, // Tổng BH NLĐ
    { width: 18 }, // BHXH Cty
    { width: 16 }, // BHYT Cty
    { width: 16 }, // BHTN Cty
    { width: 16 }, // KPCĐ
    { width: 20 }, // Tổng BH Cty
    { width: 24 }, // Tổng chi phí Cty
    { width: 18 }, // Thuế TNCN
    { width: 16 }, // Tạm ứng
    { width: 16 }, // Phạt
    { width: 18 }, // Tổng trừ
    { width: 22 }, // NET Thực Nhận
    { width: 26 }, // Chủ Tài Khoản
    { width: 20 }, // Số Tài Khoản
    { width: 20 }, // Ngân Hàng
    { width: 26 }, // Chi Nhánh
  ];

  const cleanPeriod = period.replace(/[\/\s]/g, '_');
  await downloadWorkbook(workbook, `Bang_Luong_${cleanPeriod}_GGBG.xlsx`);
}

/**
 * Xuất Danh Sách Lệnh Chuyển Khoản Ngân Hàng sang file *.xlsx
 * Áp dụng font Times New Roman + Cỡ chữ 14 + Đầy đủ 4 trường ngân hàng
 */
export async function exportBankBatchToXlsx(
  batchId: string,
  bankFormat: 'VCB' | 'TCB' | 'MBB' | 'GENERAL' = 'GENERAL'
): Promise<void> {
  const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
  const batches = getBankPaymentBatches();
  const batch = batches.find((b) => b.id === batchId) || batches[0];
  if (!batch) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'GGBingo CRM';
  const ws = workbook.addWorksheet(`Lenh_Chi_${bankFormat}`, {
    views: [{ showGridLines: true }],
  });

  // 1. Company Header
  const r1 = ws.addRow(['CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM']);
  r1.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: 'FF1E3A8A' } };

  const r2 = ws.addRow([
    `Tài khoản trích nợ: ${batch.source_account_number} — ${batch.source_bank} — Chủ TK: ${batch.source_account_name}`,
  ]);
  r2.font = { name: FONT_NAME, size: 12, italic: true, color: { argb: 'FF475569' } };

  ws.addRow([]); // Blank

  // 2. Title Banner
  const title =
    bankFormat === 'VCB'
      ? `DANH SÁCH LỆNH CHUYỂN TIỀN THEO LÔ VIETCOMBANK (VCB BATCH TRANSFER)`
      : bankFormat === 'TCB'
      ? `TECHCOMBANK CORPORATE SALARY DISBURSEMENT BATCH — ${batch.batch_code}`
      : bankFormat === 'MBB'
      ? `DANH SÁCH CHI TRẢ LƯƠNG TÀI KHOẢN MBBANK — ${batch.batch_code}`
      : `BẢNG KÊ LỆNH CHUYỂN KHOẢN CHI LƯƠNG TỔNG HỢP — KỲ ${batch.period.toUpperCase()}`;

  const titleRow = ws.addRow([title]);
  titleRow.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF0F172A' } };
  titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 30;

  const subRow = ws.addRow([
    `Mã lô: ${batch.batch_code} | Tổng số người hưởng: ${batch.total_recipients} | Tổng số tiền: ${batch.total_amount.toLocaleString('vi-VN')} VNĐ`,
  ]);
  subRow.font = { name: FONT_NAME, size: 13, italic: true, color: { argb: 'FF64748B' } };
  subRow.alignment = { horizontal: 'center' };

  ws.addRow([]); // Blank

  // 3. Headers & Rows setup
  let headers: string[] = [];
  let colWidths: number[] = [];

  if (bankFormat === 'VCB') {
    headers = [
      'STT',
      'Tài Khoản Trích Nợ',
      'Tài Khoản Người Hưởng',
      'Tên Chủ Tài Khoản Hưởng',
      'Số Tiền (VNĐ)',
      'Mã Ngân Hàng',
      'Tên Ngân Hàng Hưởng',
      'Chi Nhánh Ngân Hàng',
      'Nội Dung Chuyển Khoản',
    ];
    colWidths = [8, 22, 22, 28, 20, 16, 22, 26, 36];
  } else if (bankFormat === 'TCB') {
    headers = [
      'STT',
      'Beneficiary Account',
      'Beneficiary Name (Chủ TK)',
      'Beneficiary Bank',
      'Bank Branch',
      'Amount (VND)',
      'Payment Details',
      'Employee Code',
    ];
    colWidths = [8, 22, 28, 20, 24, 20, 36, 16];
  } else if (bankFormat === 'MBB') {
    headers = [
      'STT',
      'Số Tài Khoản Nhận',
      'Tên Chủ Tài Khoản',
      'Số Tiền Chuyển',
      'Ngân Hàng Nhận',
      'Chi Nhánh',
      'Nội Dung Chuyển Khoản',
      'Mã Nhân Viên',
      'Phòng Ban',
    ];
    colWidths = [8, 22, 28, 20, 20, 24, 36, 16, 22];
  } else {
    headers = [
      'STT',
      'Mã Nhân Viên',
      'Họ Và Tên',
      'Chủ Tài Khoản',
      'Số Tài Khoản',
      'Ngân Hàng Thụ Hưởng',
      'Chi Nhánh Ngân Hàng',
      'Phòng Ban',
      'Số Tiền Lương NET (VNĐ)',
      'Nội Dung Chuyển Khoản',
      'Mã Giao Dịch',
      'Trạng Thái',
    ];
    colWidths = [8, 16, 26, 28, 22, 22, 26, 22, 22, 36, 20, 16];
  }

  // Merge Title banner across columns
  const lastColLetter = String.fromCharCode(65 + headers.length - 1);
  ws.mergeCells(`A${titleRow.number}:${lastColLetter}${titleRow.number}`);
  ws.mergeCells(`A${subRow.number}:${lastColLetter}${subRow.number}`);

  // Add Header Row
  const headerRow = ws.addRow(headers);
  headerRow.height = 34;
  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Blue-900
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = thinBorder;
  });

  // Data rows
  batch.items.forEach((item, idx) => {
    const bankHolder = item.bank_account_holder || item.employee_name.toUpperCase();
    const bankBranch = item.bank_branch || 'Chi nhánh Hà Nội';

    let rowValues: (string | number)[] = [];

    if (bankFormat === 'VCB') {
      rowValues = [
        idx + 1,
        batch.source_account_number,
        item.bank_account,
        bankHolder,
        item.amount,
        'VCB',
        item.bank_name,
        bankBranch,
        item.payment_content,
      ];
    } else if (bankFormat === 'TCB') {
      rowValues = [
        idx + 1,
        item.bank_account,
        bankHolder,
        item.bank_name,
        bankBranch,
        item.amount,
        item.payment_content,
        item.employee_code,
      ];
    } else if (bankFormat === 'MBB') {
      rowValues = [
        idx + 1,
        item.bank_account,
        bankHolder,
        item.amount,
        item.bank_name,
        bankBranch,
        item.payment_content,
        item.employee_code,
        item.department,
      ];
    } else {
      rowValues = [
        idx + 1,
        item.employee_code,
        item.employee_name,
        bankHolder,
        item.bank_account,
        item.bank_name,
        bankBranch,
        item.department,
        item.amount,
        item.payment_content,
        item.transaction_ref || `TX-${item.employee_code}`,
        item.status === 'SUCCESS' ? 'Thành Công' : 'Chờ Chuyển',
      ];
    }

    const row = ws.addRow(rowValues);
    row.height = 28;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE };
      cell.border = thinBorder;

      if (colNumber === 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (
        (bankFormat === 'VCB' && colNumber === 5) ||
        (bankFormat === 'TCB' && colNumber === 6) ||
        (bankFormat === 'MBB' && colNumber === 4) ||
        (bankFormat === 'GENERAL' && colNumber === 9)
      ) {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0';
        cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF065F46' } };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  // Total summary row
  let totalRowValues: (string | number)[] = [];
  if (bankFormat === 'VCB') {
    totalRowValues = ['TỔNG CỘNG', '', '', `${batch.items.length} LỆNH`, batch.total_amount, '', '', '', ''];
  } else if (bankFormat === 'TCB') {
    totalRowValues = ['TỔNG CỘNG', '', `${batch.items.length} LỆNH`, '', '', batch.total_amount, '', ''];
  } else if (bankFormat === 'MBB') {
    totalRowValues = ['TỔNG CỘNG', '', `${batch.items.length} LỆNH`, batch.total_amount, '', '', '', '', ''];
  } else {
    totalRowValues = ['TỔNG CỘNG', '', `${batch.items.length} LỆNH`, '', '', '', '', '', batch.total_amount, '', '', ''];
  }

  const totalRow = ws.addRow(totalRowValues);
  totalRow.height = 32;
  totalRow.eachCell((cell) => {
    cell.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    cell.border = doubleBottomBorder;
    if (typeof cell.value === 'number') {
      cell.numFmt = '#,##0';
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    }
  });

  // Set widths
  ws.columns = colWidths.map((w) => ({ width: w }));

  // Signatures
  ws.addRow([]);
  ws.addRow([]);
  const sigRow = ws.addRow(['', 'KẾ TOÁN LẬP BIỂU', '', '', 'KẾ TOÁN TRƯỞNG', '', '', 'CHỦ TÀI KHOẢN / TỔNG GIÁM ĐỐC']);
  sigRow.font = { name: FONT_NAME, size: DATA_FONT_SIZE, bold: true };
  sigRow.alignment = { horizontal: 'center' };

  await downloadWorkbook(workbook, `Lenh_Chi_Luong_${bankFormat}_${batch.batch_code}.xlsx`);
}
