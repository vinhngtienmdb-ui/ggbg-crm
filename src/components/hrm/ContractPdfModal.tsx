'use client';

import React from 'react';
import { X, FileText, Download, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { EmployeeProfile } from '@/types';

interface ContractPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeProfile | null;
  onUpdateR2Url?: (empId: string, newUrl: string) => void;
}

export default function ContractPdfModal({ isOpen, onClose, employee }: ContractPdfModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-cardLg border border-line w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-brand-50 via-white to-white text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-200/30 flex items-center justify-center text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Hợp Đồng Lao Động — {employee.full_name}</h3>
                <span className="px-2 py-0.5 bg-brand-500/30 text-brand-400 rounded font-mono text-xs font-bold border border-brand-200/30">
                  {employee.contract_number}
                </span>
              </div>
              <p className="text-xs text-ink-400 mt-0.5">
                Mã NV: {employee.employee_code} • {employee.department} • {employee.position}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-900 hover:bg-line-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Bar */}
        <div className="px-6 py-3 bg-line-soft border-b border-line flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-ink-700 font-semibold">
            <Lock className="w-4 h-4 text-success-fg" />
            <span>Tập tin lưu trữ đã được mã hóa bảo mật (Standard Storage Security Protocol)</span>
          </div>
          <span className="px-2.5 py-0.5 bg-success-bg text-success-fg rounded font-bold text-[10px]">
            ✓ Kiểm Tra Chữ Ký Số Hợp Lệ
          </span>
        </div>

        {/* PDF Simulated Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-line space-y-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-line-strong max-w-2xl mx-auto space-y-6 text-ink-900 font-serif">
            {/* Header document */}
            <div className="text-center space-y-1 pb-4 border-b border-line-strong">
              <p className="font-bold uppercase text-xs tracking-widest text-ink-700">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-xs text-ink-500">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-24 h-[1px] bg-line-muted mx-auto my-2"></div>
              <h2 className="font-bold text-lg pt-2 text-ink-900 tracking-wide font-sans">HỢP ĐỒNG LAO ĐỘNG</h2>
              <p className="text-xs font-mono text-ink-500">Số: {employee.contract_number}</p>
            </div>

            {/* Parties */}
            <div className="space-y-3 text-xs leading-relaxed font-sans text-ink-900">
              <div>
                <p className="font-bold text-ink-900 uppercase">BÊN A: CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM</p>
                <p className="text-ink-500">Đại diện: Ban Giám Đốc • Địa chỉ: Hà Nội, Việt Nam</p>
              </div>

              <div>
                <p className="font-bold text-ink-900 uppercase">BÊN B: ÔNG/BÀ {employee.full_name.toUpperCase()}</p>
                <p className="text-ink-500">Mã Nhân Sự: {employee.employee_code} • Chức danh: {employee.position}</p>
                <p className="text-ink-500">Email: {employee.email} • Điện thoại: {employee.phone}</p>
              </div>

              <div className="pt-2 border-t border-line">
                <p className="font-bold text-ink-900">ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</p>
                <p className="text-ink-700 mt-1">
                  Bên A đồng ý tuyển dụng Bên B làm việc tại {employee.department} với vị trí {employee.position} kể từ ngày {employee.joined_date}.
                </p>
              </div>

              <div>
                <p className="font-bold text-ink-900">ĐIỀU 2: CHẾ ĐỘ LÀM VIỆC VÀ PHÚC LỢI</p>
                <p className="text-ink-700 mt-1">
                  Bên B được hưởng đầy đủ quyền lợi Bảo hiểm xã hội, Bảo hiểm y tế, KPI thưởng doanh số và chính sách đào tạo theo Quy chế Doanh nghiệp GGBingo.
                </p>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="pt-8 border-t border-line-strong grid grid-cols-2 text-center text-xs font-sans">
              <div>
                <p className="font-bold text-ink-900 uppercase">ĐẠI DIỆN BÊN B</p>
                <p className="text-[10px] text-ink-400 italic mb-12">(Ký và ghi rõ họ tên)</p>
                <p className="font-bold text-ink-900">{employee.full_name}</p>
              </div>
              <div>
                <p className="font-bold text-ink-900 uppercase">ĐẠI DIỆN BÊN A</p>
                <p className="text-[10px] text-ink-400 italic mb-12">(Đã xác thực chữ ký số)</p>
                <p className="font-bold text-brand-900">GGBINGO VIETNAM JSC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-line bg-surface-subtle flex items-center justify-between shrink-0">
          <span className="text-xs text-ink-500 font-medium">Trạng thái: Hợp đồng đã có hiệu lực</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-line hover:bg-line-muted text-ink-900 font-bold text-xs rounded-xl transition-all"
            >
              Đóng Xem PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
