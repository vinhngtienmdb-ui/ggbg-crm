'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  X,
  Copy,
  Check,
  Send,
  Cloud,
  Lock,
  Mail,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ExternalSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentCode: string;
  onSendSuccess: (info: { partnerName: string; partnerEmail: string; signUrl: string }) => void;
}

export default function ExternalSignModal({
  isOpen,
  onClose,
  documentTitle,
  documentCode,
  onSendSuccess
}: ExternalSignModalProps) {
  const [partnerCompany, setPartnerCompany] = useState('Công Ty TNHH Thương Mại & Dịch Vụ Shopee Việt Nam');
  const [partnerSigner, setPartnerSigner] = useState('Trần Quốc Tuấn (Giám Đốc Đối Tác)');
  const [partnerEmail, setPartnerEmail] = useState('tuan.tran@shopee.vn');
  const [partnerPhone, setPartnerPhone] = useState('0988776655');
  const [cloudProvider, setCloudProvider] = useState<'GOOGLE_DRIVE' | 'AWS_S3'>('GOOGLE_DRIVE');
  const [isCopied, setIsCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  if (!isOpen) return null;

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const token = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const linkUrl = `https://crm.ggbingo.vn/contracts/external-sign?token=ext_${token}&doc=${encodeURIComponent(documentCode)}`;
    setGeneratedUrl(linkUrl);
  };

  const handleCopyLink = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendEmailZalo = () => {
    if (!generatedUrl) return;
    onSendSuccess({
      partnerName: partnerSigner,
      partnerEmail: partnerEmail,
      signUrl: generatedUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200 text-xs font-bold">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Trình Ký Đối Tác Ngoại & Lưu Trữ Cloud</h3>
              <p className="text-[10.5px] text-slate-500 font-normal">Mã hợp đồng: {documentCode}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Context Card */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 text-purple-950">
          <p className="font-bold text-xs leading-snug line-clamp-1">{documentTitle}</p>
          <div className="flex items-center justify-between text-[11px] font-normal text-purple-800 pt-1 border-t border-purple-200">
            <span>Bảo mật: <strong>Secure Token 256-bit</strong></span>
            <span>Trạng thái: <strong>Sẵn sàng khởi tạo</strong></span>
          </div>
        </div>

        <form onSubmit={handleGenerateLink} className="space-y-3">
          <div>
            <label className="block text-slate-700 mb-1">Tên Công Ty Đối Tác *</label>
            <input
              type="text"
              required
              value={partnerCompany}
              onChange={(e) => setPartnerCompany(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Người Ký Đại Diện *</label>
              <input
                type="text"
                required
                value={partnerSigner}
                onChange={(e) => setPartnerSigner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Email Nhận Link *</label>
              <input
                type="email"
                required
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Số ĐT Zalo Nhận OTP *</label>
              <input
                type="text"
                required
                value={partnerPhone}
                onChange={(e) => setPartnerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl tabular-nums"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Lưu Trữ Cloud Sao Lưu *</label>
              <select
                value={cloudProvider}
                onChange={(e) => setCloudProvider(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              >
                <option value="GOOGLE_DRIVE">📁 Google Drive Enterprise</option>
                <option value="AWS_S3">☁️ AWS S3 Bucket Cloud</option>
              </select>
            </div>
          </div>

          {!generatedUrl ? (
            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Sinh Đường Dẫn Trình Ký Bảo Mật
            </button>
          ) : (
            <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Đã sinh Link Ký Số Đối Tác Ngoại thành công!
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-[10.5px] font-bold flex items-center gap-1 border border-slate-700"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Đã sao chép' : 'Sao chép Link'}
                </button>
              </div>

              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[10.5px] font-mono text-slate-200 select-all"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSendEmailZalo}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 text-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi Qua Email & Zalo ZNS
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
