'use client';

import React from 'react';
import { X, DollarSign, Send, Printer, CheckCircle2, Building2, User, FileText, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { PayrollSheet } from '@/types';

interface PaystubModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollSheet | null;
  onSendEmail?: (id: string) => void;
}

export default function PaystubModal({ isOpen, onClose, payroll, onSendEmail }: PaystubModalProps) {
  if (!isOpen || !payroll) return null;

  const formatVND = (amount: number = 0) => {
    return `${amount.toLocaleString('vi-VN')} ₫`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200 print:shadow-none print:border-none print:m-0">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                {payroll.payroll_code}
              </span>
              <h3 className="font-extrabold text-sm text-white">Phiếu Lương Chi Tiết - {payroll.period}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Paystub Document */}
        <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto print:max-h-none print:p-6">
          {/* Brand & Document Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-black text-blue-700 tracking-tight">CÔNG TY CP GGBINGO VIỆT NAM</h2>
              <p className="text-[11px] text-slate-500">Hệ Thống Quản Trị Nhân Sự & Bảng Lương Tự Động GGBG CRM</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-black text-slate-900 uppercase">PHIẾU LƯƠNG NHÂN VIÊN</h3>
              <p className="text-[11px] font-mono font-bold text-emerald-700">KỲ THUẾ: {payroll.period}</p>
            </div>
          </div>

          {/* Employee Basic Info Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div>
              <span className="text-slate-500 font-bold block">Mã & Họ Tên Nhân Sự:</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {payroll.employee_name} <span className="font-mono text-xs text-blue-600">({payroll.employee_code})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Bộ Phận & Vị Trí Công Việc:</span>
              <span className="font-bold text-slate-800 block">
                {payroll.department} · {payroll.position}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Tài Khoản Ngân Hàng Nhận Lương:</span>
              <span className="font-mono font-bold text-slate-800 block">
                {payroll.bank_name || 'MBBank'} - {payroll.bank_account || '0988888888'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Trạng Thái Gửi Phiếu Lương:</span>
              <span className="font-bold text-emerald-600 block">
                {payroll.status === 'SENT_PAYSTUB' ? '✅ Đã Gửi Email / Zalo ZNS' : '📝 Bản Thảo Bảng Lương'}
              </span>
            </div>
          </div>

          {/* INCOME & DEDUCTIONS BREAKDOWN TABLE */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Chi Tiết Thu Nhập & Các Khoản Khấu Trừ
            </h4>

            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2 px-3">Khoản Mục Thu Nhập (Gross)</th>
                  <th className="py-2 px-3 text-right">Số Tiền (VND)</th>
                  <th className="py-2 px-3 border-l border-slate-200">Khoản Trừ & Bảo Hiểm</th>
                  <th className="py-2 px-3 text-right">Số Tiền (VND)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-medium">1. Lương Cứng P1 (Theo Công)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {formatVND(payroll.p1_calculated_salary)}
                  </td>
                  <td className="py-2 px-3 border-l border-slate-200 font-medium">1. BHXH (8%)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">
                    -{formatVND(payroll.bhxh_deduction)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-medium">2. Phụ Cấp P2 (Ăn trưa, xăng, ĐT)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {formatVND(payroll.p2_allowances)}
                  </td>
                  <td className="py-2 px-3 border-l border-slate-200 font-medium">2. BHYT (1.5%)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">
                    -{formatVND(payroll.bhyt_deduction)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-medium">3. Lương Hiệu Suất P3 (KPI/Rating)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">
                    {formatVND(payroll.p3_performance_salary)}
                  </td>
                  <td className="py-2 px-3 border-l border-slate-200 font-medium">3. BHTN (1%)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">
                    -{formatVND(payroll.bhtn_deduction)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-medium">4. Tiền Tăng Ca OT (x1.5)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {formatVND(payroll.ot_salary)}
                  </td>
                  <td className="py-2 px-3 border-l border-slate-200 font-medium">4. Phạt Đi Muộn</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">
                    -{formatVND(payroll.late_penalty_deduction)}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-medium">5. Tiền Thưởng Thêm</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                    {formatVND(payroll.bonus_amount)}
                  </td>
                  <td className="py-2 px-3 border-l border-slate-200 font-medium">5. Thuế TNCN Tạm Tính</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-red-600">
                    -{formatVND(payroll.personal_income_tax)}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-3 text-slate-900">TỔNG THU NHẬP (GROSS):</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                    {formatVND(payroll.total_gross_income)}
                  </td>
                  <td className="py-2.5 px-3 border-l border-slate-200 text-slate-900">TỔNG KHẤU TRỪ:</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-600">
                    -{formatVND(payroll.total_deductions)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* NET SALARY HIGHLIGHT CARD */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-100 block">LƯƠNG THỰC NHẬN (NET SALARY):</span>
              <span className="text-2xl font-mono font-black text-white mt-0.5 block">
                {formatVND(payroll.net_salary)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-100 block">Dự kiến chuyển khoản:</span>
              <span className="text-xs font-mono font-extrabold text-white">Ngày 05 Hàng Tháng</span>
            </div>
          </div>

          {/* PIN PROTECTION SECURITY NOTICE */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bảo Mật PDF: File Phiếu Lương PDF được tự động cài Mã PIN (Là Số Điện Thoại hoặc Số CCCD cá nhân)</span>
            </div>
            <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 font-black rounded-md text-[10px]">
              🔒 PIN Encrypted
            </span>
          </div>

          {/* Signatures Footer for printing */}
          <div className="hidden print:grid grid-cols-2 gap-4 text-center pt-8">
            <div>
              <p className="font-bold text-slate-900">NGƯỜI LẬP BẢNG LƯƠNG</p>
              <p className="text-[10px] text-slate-400 font-mono">(Ký & ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">GIÁM ĐỐC NHÂN SỰ (HRD)</p>
              <p className="text-[10px] text-slate-400 font-mono">(Ký & ghi rõ họ tên)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" /> In / Tải PDF
            </button>
            {onSendEmail && (
              <button
                onClick={() => onSendEmail(payroll.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" /> Gửi Bảng Lương Qua Email / Zalo ZNS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
