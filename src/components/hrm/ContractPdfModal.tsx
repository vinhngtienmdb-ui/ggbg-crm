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
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Hợp Đồng Lao Động — {employee.full_name}</h3>
                <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded font-mono text-xs font-bold border border-blue-400/30">
                  {employee.contract_number}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Mã NV: {employee.employee_code} • {employee.department} • {employee.position}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Bar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Tập tin lưu trữ đã được mã hóa bảo mật (Standard Storage Security Protocol)</span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
            ✓ Kiểm Tra Chữ Ký Số Hợp Lệ
          </span>
        </div>

        {/* PDF Simulated Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-200/50 space-y-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-slate-300 max-w-2xl mx-auto space-y-6 text-slate-900 font-serif">
            {/* Header document */}
            <div className="text-center space-y-1 pb-4 border-b border-slate-300">
              <p className="font-bold uppercase text-xs tracking-widest text-slate-700">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-xs text-slate-600">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-24 h-[1px] bg-slate-400 mx-auto my-2"></div>
              <h2 className="font-bold text-lg pt-2 text-slate-900 tracking-wide font-sans">HỢP ĐỒNG LAO ĐỘNG</h2>
              <p className="text-xs font-mono text-slate-500">Số: {employee.contract_number}</p>
            </div>

            {/* Parties */}
            <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-800">
              <div>
                <p className="font-bold text-slate-900 uppercase">BÊN A: CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM</p>
                <p className="text-slate-600">Đại diện: Ban Giám Đốc • Địa chỉ: Hà Nội, Việt Nam</p>
              </div>

              <div>
                <p className="font-bold text-slate-900 uppercase">BÊN B: ÔNG/BÀ {employee.full_name.toUpperCase()}</p>
                <p className="text-slate-600">Mã Nhân Sự: {employee.employee_code} • Chức danh: {employee.position}</p>
                <p className="text-slate-600">Email: {employee.email} • Điện thoại: {employee.phone}</p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="font-bold text-slate-900">ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</p>
                <p className="text-slate-700 mt-1">
                  Bên A đồng ý tuyển dụng Bên B làm việc tại {employee.department} với vị trí {employee.position} kể từ ngày {employee.joined_date}.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900">ĐIỀU 2: CHẾ ĐỘ LÀM VIỆC VÀ PHÚC LỢI</p>
                <p className="text-slate-700 mt-1">
                  Bên B được hưởng đầy đủ quyền lợi Bảo hiểm xã hội, Bảo hiểm y tế, KPI thưởng doanh số và chính sách đào tạo theo Quy chế Doanh nghiệp GGBingo.
                </p>
              </div>
            </div>

            {/* Footer Signature */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs font-sans">
              <div>
                <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN BÊN B</p>
                <p className="text-[10px] text-slate-400 italic mb-12">(Ký và ghi rõ họ tên)</p>
                <p className="font-bold text-slate-900">{employee.full_name}</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN BÊN A</p>
                <p className="text-[10px] text-slate-400 italic mb-12">(Đã xác thực chữ ký số)</p>
                <p className="font-bold text-blue-900">GGBINGO VIETNAM JSC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">Trạng thái: Hợp đồng đã có hiệu lực</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Đóng Xem PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
