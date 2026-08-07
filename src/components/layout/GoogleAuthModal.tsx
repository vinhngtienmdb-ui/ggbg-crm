'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, Key, CheckCircle2, AlertTriangle, X, Lock, ShieldAlert } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const [loading, setLoading] = useState(true);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetch2faSetup = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/2fa/setup');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIs2faEnabled(data.is_2fa_enabled);
          setTotpSecret(data.totp_secret);
          setQrUrl(data.qr_url);
        }
      }
    } catch (e) {
      setErrorMsg('Không thể kết nối lấy thông tin 2FA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetch2faSetup();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!totpCode || totpCode.trim().length !== 6) {
      setErrorMsg('Vui lòng nhập đầy đủ mã xác minh 6 chữ số từ ứng dụng Google Authenticator!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ENABLE',
          totp_code: totpCode.trim(),
          secret: totpSecret,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2faEnabled(true);
        setTotpCode('');
        if (onSuccess) onSuccess(data.message || '🎉 Đã xác minh & kích hoạt bảo mật Google Authenticator (2FA) thành công!');
        onClose();
      } else {
        setErrorMsg(data.message || 'Mã xác minh không chính xác. Vui lòng kiểm tra lại đồng hồ điện thoại.');
      }
    } catch (err) {
      setErrorMsg('Lỗi máy chủ khi xác minh 2FA.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Bạn có chắc chắn muốn tắt xác thực 2 lớp Google Authenticator?')) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DISABLE' }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2faEnabled(false);
        if (onSuccess) onSuccess(data.message || '⚪ Đã tắt tính năng Xác thực 2FA thành công.');
        onClose();
      } else {
        setErrorMsg(data.message || 'Không thể tắt 2FA');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-bold max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Bảo Mật 2 Lớp Google Authenticator (2FA)</h3>
              <p className="text-[11px] text-slate-400 font-medium">Bảo vệ tài khoản với mã OTP 6 chữ số biến đổi 30s</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
            Đang tải thông tin cấu hình Google Authenticator...
          </div>
        ) : is2faEnabled ? (
          /* ALREADY ENABLED STATE */
          <div className="space-y-4 bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Tài Khoản Đã Được Bảo Vệ 2FA</h4>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Mỗi khi đăng nhập, hệ thống sẽ yêu cầu nhập mã 6 số ngẫu nhiên từ ứng dụng <strong>Google Authenticator</strong> trên điện thoại của bạn.
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDisable2FA}
                disabled={submitting}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold text-xs transition-colors"
              >
                🔴 Tắt Tính Năng 2FA Google Authenticator
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          /* NOT ENABLED - SETUP PROCESS */
          <form onSubmit={handleEnable2FA} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1 text-[11.5px] text-purple-900 dark:text-purple-300">
              <p className="font-bold">📱 Hướng dẫn 2 Bước kích hoạt Google Authenticator:</p>
              <ol className="list-decimal list-inside font-normal space-y-0.5">
                <li>Mở ứng dụng <strong>Google Authenticator</strong> (hoặc Authy) trên smartphone.</li>
                <li>Chọn <strong>Quét mã QR</strong> hoặc nhập chuỗi Secret Key bí mật bên dưới.</li>
              </ol>
            </div>

            {/* QR CODE & SECRET KEY */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-sm flex items-center justify-center">
                {qrUrl ? (
                  <img src={qrUrl} alt="Google Authenticator QR Code" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Chuỗi Secret Key Bí Mật:</span>
                  <p className="font-mono text-purple-700 dark:text-purple-400 font-bold text-xs select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                    {totpSecret}
                  </p>
                </div>
                <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                  Lưu trữ Secret Key này ở nơi an toàn để khôi phục khi đổi điện thoại.
                </p>
              </div>
            </div>

            {/* CONFIRMATION CODE INPUT */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-slate-800 dark:text-slate-200 font-bold">
                Nhập Mã Xác Nhận 6 Chữ Số Từ Ứng Dụng *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center px-4 py-3 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-2xl font-mono text-lg tracking-[8px] font-semibold text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                {submitting ? 'Đang xác minh...' : '✅ Xác Minh & Bật 2FA'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
