'use client';

import React from 'react';
import { X, Download, Printer, CheckCircle2, ShieldCheck, QrCode, FileText, Building2 } from 'lucide-react';

interface OfficialContractPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractCode?: string;
  customerName?: string;
  companyName?: string;
}

export default function OfficialContractPdfModal({
  isOpen,
  onClose,
  contractCode = 'HD-2026-8801',
  customerName = 'Trần Thanh Sơn',
  companyName = 'Công ty TNHH Vận Tải Hồng Lực'
}: OfficialContractPdfModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-cardLg border border-line w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Toolbar Header */}
        <div className="p-3.5 bg-brand-50 text-brand-800 flex items-center justify-between border-b border-line">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-400">
              Hợp Đồng Ủy Quyền Vận Hành TMĐT (File PDF Chính Thức)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-surface-subtle hover:bg-line-soft text-ink-400 text-xs font-semibold rounded flex items-center gap-1 border border-line"
            >
              <Printer className="w-3.5 h-3.5" /> In Hợp Đồng
            </button>
            <button
              onClick={() => {
                alert(`Đã tải file ${contractCode}_GGBINGO_OFFICIAL.pdf về máy!`);
              }}
              className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Tải PDF
            </button>
            <button onClick={onClose} className="p-1 rounded text-ink-400 hover:text-brand-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Document Preview Paper A4 Style */}
        <div className="p-8 bg-line-soft text-ink-900 font-sans text-xs space-y-6 max-h-[75vh] overflow-y-auto sleek-scrollbar">
          <div className="bg-white p-8 rounded border border-line-strong shadow-md space-y-6 max-w-2xl mx-auto relative">
            {/* Document Header */}
            <div className="text-center space-y-1 border-b border-line pb-4">
              <p className="font-bold uppercase tracking-wider text-sm text-ink-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-xs text-ink-900">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-[10px] text-ink-400 font-mono pt-1">---***---</p>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-base uppercase text-ink-900 tracking-tight">HỢP ĐỒNG DỊCH VỤ UỶ QUYỀN VẬN HÀNH GIAN HÀNG TMĐT</h2>
              <p className="font-mono text-xs font-bold text-brand-800">Mã Số Chứng Từ: {contractCode}</p>
            </div>

            {/* Parties Info */}
            <div className="space-y-3 leading-relaxed text-ink-900">
              <div className="p-3 bg-surface-subtle border border-line rounded space-y-1">
                <p className="font-bold text-ink-900 uppercase">BÊN A (BÊN DỊCH VỤ VẬN HÀNH): CÔNG TY CP TẬP ĐOÀN GGBINGO ENTERPRISE</p>
                <p>Đại diện: Ông <strong>Nguyễn Quốc Tuấn</strong> — Chức vụ: Giám Đốc Vận Hành (COO)</p>
                <p>Mã số thuế: <strong>0318992817</strong> — Điện thoại: <strong>(028) 7300 8899</strong></p>
                <p>Địa chỉ: Tòa nhà GGBingo Tower, Quận 1, TP. Hồ Chí Minh</p>
              </div>

              <div className="p-3 bg-surface-subtle border border-line rounded space-y-1">
                <p className="font-bold text-ink-900 uppercase">BÊN B (BÊN KHÁCH HÀNG UỶ QUYỀN): {companyName}</p>
                <p>Đại diện pháp luật: Ông/Bà <strong>{customerName}</strong></p>
                <p>Loại hình: <strong>Doanh Nghiệp B2B</strong> — Trạng thái KYC: <strong>✓ Đã Phê Duyệt</strong></p>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="space-y-2 leading-relaxed">
              <p className="font-bold text-ink-900 uppercase">ĐIỀU 1: NỘI DUNG UỶ QUYỀN VẬN HÀNH</p>
              <p className="text-ink-700">
                Bên B đồng ý uỷ quyền toàn bộ cho Bên A thực hiện các công việc thiết kế trang trí gian hàng, tối ưu SEO Shopee Mall / TikTok Shop / Lazada, tổ chức Livestream chốt đơn và chăm sóc khách hàng 24/7.
              </p>

              <p className="font-bold text-ink-900 uppercase pt-2">ĐIỀU 2: PHÍ DỊCH VỤ & HOA HỒNG GMV</p>
              <p className="text-ink-700">
                Phí hoa hồng dịch vụ được tính theo tỷ lệ <strong>4.5% trên tổng doanh số GMV thực tế</strong> sàn thanh toán hàng tháng. Hạn thanh toán kỳ phí vào ngày 25 hàng tháng.
              </p>
            </div>

            {/* Signatures & Red Seal */}
            <div className="pt-8 flex items-end justify-between">
              <div className="text-center space-y-1">
                <p className="font-bold text-ink-900 uppercase">ĐẠI DIỆN BÊN B</p>
                <p className="text-[10px] text-ink-400 italic">(Ký và ghi rõ họ tên)</p>
                <div className="h-16 flex items-center justify-center">
                  <p className="font-bold text-ink-900">{customerName}</p>
                </div>
              </div>

              {/* Red Stamp & QR Verification Badge */}
              <div className="text-center relative">
                <p className="font-bold text-ink-900 uppercase mb-1">ĐẠI DIỆN BÊN A (GGBINGO)</p>

                {/* Digital Red Seal */}
                <div className="w-28 h-28 border-4 border-danger-border rounded-full flex flex-col items-center justify-center p-2 text-center text-danger-fg font-extrabold rotate-[-12deg] shadow-sm bg-danger-bg/20 mx-auto my-1">
                  <span className="text-[8px] uppercase tracking-tighter">CÔNG TY CP TẬP ĐOÀN</span>
                  <span className="text-xs font-black">GGBINGO</span>
                  <span className="text-[7px]">★ CON DẤU ĐIỆN TỬ ★</span>
                </div>

                {/* QR Code Verification */}
                <div className="mt-2 flex items-center justify-center gap-1.5 p-1.5 bg-line-soft border border-line-strong rounded font-mono text-[9px] text-ink-700">
                  <QrCode className="w-6 h-6 text-ink-900" />
                  <div className="text-left">
                    <p className="font-bold text-ink-900">Xác Thực QR Online</p>
                    <p className="text-[8px] text-ink-500">ggbingo.vn/verify/{contractCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
