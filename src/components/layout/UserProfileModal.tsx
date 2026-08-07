'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  QrCode,
  Sparkles,
  Lock,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export default function UserProfileModal({ isOpen, onClose, onSuccessToast }: UserProfileModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PASSWORD' | '2FA'>('PROFILE');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // 2FA state
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [twoFaSubmitting, setTwoFaSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetch2faSetup = async () => {
    setTwoFaLoading(true);
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
    } catch {
      // ignore
    } finally {
      setTwoFaLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      fetch2faSetup();
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ tất cả các trường!');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (onSuccessToast) onSuccessToast(data.message || '🎉 Đổi mật khẩu cá nhân thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveTab('PROFILE');
      } else {
        setErrorMsg(data.message || 'Lỗi khi đổi mật khẩu.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setPassLoading(false);
    }
  };

  // Handle Enable 2FA
  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!totpCode || totpCode.trim().length !== 6) {
      setErrorMsg('Vui lòng nhập mã xác nhận 6 chữ số từ ứng dụng Google Authenticator!');
      return;
    }

    setTwoFaSubmitting(true);
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
        if (onSuccessToast) onSuccessToast(data.message || '🎉 Kích hoạt Google Authenticator 2FA thành công!');
      } else {
        setErrorMsg(data.message || 'Mã xác thực không đúng. Vui lòng kiểm tra lại.');
      }
    } catch {
      setErrorMsg('Lỗi máy chủ khi xác minh 2FA.');
    } finally {
      setTwoFaSubmitting(false);
    }
  };

  // Handle Disable 2FA
  const handleDisable2FA = async () => {
    if (!confirm('Bạn có chắc chắn muốn tắt bảo mật 2FA?')) return;
    setTwoFaSubmitting(true);
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DISABLE' }),
      });

      const data = await res.json();
      if (data.success) {
        setIs2faEnabled(false);
        if (onSuccessToast) onSuccessToast(data.message || '⚪ Đã tắt xác thực 2FA.');
      } else {
        setErrorMsg(data.message || 'Không thể tắt 2FA');
      }
    } catch {
      setErrorMsg('Lỗi máy chủ.');
    } finally {
      setTwoFaSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-2xl overflow-hidden text-xs font-medium max-h-[90vh] flex flex-col">
        {/* Header Profile Hero Bar */}
        <div className="p-5 bg-slate-900 text-white relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 border border-white/20 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {user.name} <BadgeCheck className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                [{user.employee_code}] • {user.role_name}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">@{user.username} ({user.email})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-5 pt-3 bg-slate-50 dark:bg-slate-850 shrink-0">
          <button
            onClick={() => {
              setActiveTab('PROFILE');
              setErrorMsg(null);
            }}
            className={`px-3.5 py-2 rounded-t-md font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'PROFILE'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" /> Thông Tin Hồ Sơ
          </button>

          <button
            onClick={() => {
              setActiveTab('PASSWORD');
              setErrorMsg(null);
            }}
            className={`px-3.5 py-2 rounded-t-md font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'PASSWORD'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-500" /> Đổi Mật Khẩu
          </button>

          <button
            onClick={() => {
              setActiveTab('2FA');
              setErrorMsg(null);
            }}
            className={`px-3.5 py-2 rounded-t-md font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === '2FA'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Google Authenticator 2FA
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 sleek-scrollbar">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* TAB 1: USER PROFILE OVERVIEW */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[10.5px] uppercase font-bold">Tên Nhân Viên</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[10.5px] uppercase font-bold">Mã Số Nhân Viên HRM</span>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400 font-mono">{user.employee_code}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[10.5px] uppercase font-bold">Tên Đăng Nhập System</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">@{user.username}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[10.5px] uppercase font-bold">Email Công Ty</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-2">
                <h4 className="text-purple-900 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
                  🛡️ Trạng Thái Phân Quyền & Bảo Mật:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-purple-900 dark:text-purple-200">
                  <p>Vai trò RBAC: <strong className="font-bold">{user.role_name}</strong></p>
                  <p>Xác thực 2FA: <strong className={is2faEnabled ? 'text-emerald-600' : 'text-slate-400'}>{is2faEnabled ? '🛡️ Đã Bật Google 2FA' : '⚪ Chưa Bật 2FA'}</strong></p>
                  <p>Quyền Hạn: <strong className="font-mono">{user.is_super_admin ? 'SUPER_ADMIN (*)' : 'Xem & Sửa nghiệp vụ'}</strong></p>
                  <p>Lần đăng nhập cuối: <strong className="font-mono">{user.login_at || 'Vừa đăng nhập'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'PASSWORD' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Mật khẩu mới (tối thiểu 6 ký tự) *
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>{passLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Cá Nhân'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GOOGLE AUTHENTICATOR 2FA */}
          {activeTab === '2FA' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {twoFaLoading ? (
                <div className="p-8 text-center text-slate-500 animate-pulse">
                  Đang kiểm tra trạng thái Google Authenticator...
                </div>
              ) : is2faEnabled ? (
                <div className="space-y-4 bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Tài Khoản Đã Được Bảo Vệ 2FA</h4>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Mỗi khi đăng nhập, hệ thống sẽ yêu cầu nhập mã 6 số từ ứng dụng <strong>Google Authenticator</strong> trên điện thoại của bạn.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleDisable2FA}
                      disabled={twoFaSubmitting}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold text-xs transition-colors"
                    >
                      🔴 Tắt Tính Năng Google Authenticator 2FA
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnable2FA} className="space-y-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1 text-[11.5px] text-purple-900 dark:text-purple-300">
                    <p className="font-bold">📱 Hướng dẫn kích hoạt Google Authenticator:</p>
                    <ol className="list-decimal list-inside font-medium space-y-0.5">
                      <li>Mở ứng dụng <strong>Google Authenticator</strong> trên smartphone.</li>
                      <li>Chọn <strong>Quét mã QR</strong> bên dưới hoặc nhập chuỗi Secret Key.</li>
                    </ol>
                  </div>

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
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Chuỗi Secret Key Bí Mật:</span>
                        <p className="font-mono text-purple-700 dark:text-purple-400 font-bold text-xs select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                          {totpSecret}
                        </p>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-medium">
                        Lưu trữ Secret Key này ở nơi an toàn để khôi phục khi đổi điện thoại.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="block text-slate-800 dark:text-slate-200 font-bold">
                      Nhập Mã Xác Nhận 6 Chữ Số Từ App *
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

                  <button
                    type="submit"
                    disabled={twoFaSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{twoFaSubmitting ? 'Đang xác minh...' : 'Xác Minh & Bật Bảo Mật 2FA'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-850 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
