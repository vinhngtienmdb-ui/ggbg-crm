'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  X,
  KeyRound,
  PenTool,
  Check
} from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentCode: string;
  signerName?: string;
  signerRole?: string;
  onSignComplete: (signatureData: {
    signer_name: string;
    signer_role: string;
    signature_type: 'HANDWRITTEN_CANVAS' | 'PKI_CERTIFICATE';
    sha256_hash: string;
    signed_at: string;
  }) => void;
}

export default function DigitalSignatureModal({
  isOpen,
  onClose,
  documentTitle,
  documentCode,
  signerName = 'Nguyễn Tiến Vinh',
  signerRole = 'CEO / Ban Giám Đốc',
  onSignComplete,
}: DigitalSignatureModalProps) {
  const [signType, setSignType] = useState<'HANDWRITTEN_CANVAS' | 'PKI_CERTIFICATE'>('HANDWRITTEN_CANVAS');
  const [pinCode, setPinCode] = useState('123456');
  const [pinError, setPinError] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isOpen && signType === 'HANDWRITTEN_CANVAS') {
      setTimeout(() => initCanvas(), 100);
    }
  }, [isOpen, signType]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1E3A8A'; // Deep Navy Blue Signature
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 6) {
      setPinError('Mã PIN bảo mật phải đủ 6 chữ số!');
      return;
    }

    if (signType === 'HANDWRITTEN_CANVAS' && !hasDrawn) {
      setPinError('Vui lòng vẽ chữ ký tay lên khung trước khi xác nhận!');
      return;
    }

    // Generate SHA-256 Checksum Mock Hash
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const signedAt = new Date().toLocaleString('vi-VN');

    onSignComplete({
      signer_name: signerName,
      signer_role: signerRole,
      signature_type: signType,
      sha256_hash: `SHA256:${randomHash}`,
      signed_at: signedAt,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Trình Ký Điện Tử & Ký Số PKI (E-Signature)</h3>
              <p className="text-[10.5px] text-slate-500 font-normal">Văn bản: {documentCode}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Context Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <p className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">{documentTitle}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/80">
            <span>Người ký: <strong className="text-blue-700">{signerName}</strong></span>
            <span>Chức vụ: <strong>{signerRole}</strong></span>
          </div>
        </div>

        {/* Signature Type Switcher */}
        <div className="space-y-1.5">
          <label className="block text-slate-700">Phương Thức Ký Số *</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSignType('HANDWRITTEN_CANVAS')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                signType === 'HANDWRITTEN_CANVAS'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">🖊️ Vẽ Chữ Ký Tay</span>
                {signType === 'HANDWRITTEN_CANVAS' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <span className="text-[10.5px] font-normal text-slate-500 mt-1">Ký trực tiếp trên màn hình Canvas</span>
            </button>

            <button
              type="button"
              onClick={() => setSignType('PKI_CERTIFICATE')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                signType === 'PKI_CERTIFICATE'
                  ? 'border-purple-600 bg-purple-50/60 text-purple-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs">🔑 Certificate PKI</span>
                {signType === 'PKI_CERTIFICATE' && <Check className="w-4 h-4 text-purple-600" />}
              </div>
              <span className="text-[10.5px] font-normal text-slate-500 mt-1">Sử dụng Chứng thư số USB Token</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleConfirmSign} className="space-y-4">
          {/* Handwritten Canvas Section */}
          {signType === 'HANDWRITTEN_CANVAS' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-700">Khung Vẽ Chữ Ký (Mouse / Touch Canvas):</label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[10.5px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                >
                  <RefreshCw className="w-3 h-3" /> Xóa vẽ lại
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-1 relative">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-32 cursor-crosshair rounded-xl"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-normal">
                    Ký hoặc vẽ chữ ký vào khung tại đây...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PKI Certificate Info Section */}
          {signType === 'PKI_CERTIFICATE' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2 text-purple-900">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Chứng Thư Số Doanh Nghiệp GGBG - USB Token PKI</span>
              </div>
              <p className="text-[11px] font-normal text-purple-800 leading-relaxed">
                • Serial: <strong>5401-8890-2026-GGBG</strong><br />
                • Nhà cung cấp: <strong>VNPT-CA / Viettel-CA Enterprise Root Certificate</strong><br />
                • Thời hạn hiệu lực: <strong>2025-01-01 ➔ 2028-12-31</strong>
              </p>
            </div>
          )}

          {/* PIN Security Code */}
          <div>
            <label className="block text-slate-700 mb-1 flex items-center justify-between">
              <span>Mã PIN Xác Thực Bảo Mật (6 chữ số) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Default: 123456</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={6}
                required
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  setPinError('');
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl font-mono text-slate-900 font-semibold tracking-widest text-sm"
              />
            </div>
            {pinError && <p className="text-[11px] text-red-600 font-bold mt-1">⚠️ {pinError}</p>}
          </div>

          {/* SHA-256 Checksum Encryption Notice */}
          <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Mã hóa SHA-256 Checksum chống chỉnh sửa văn bản</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">SHA-256 PKI</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Xác Nhận Đóng Chữ Ký Số
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
