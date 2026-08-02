'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState<'LOGIN' | '2FA'>('LOGIN');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'LOGIN') {
      if (!username || !password) {
        setErrorMsg('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
        return;
      }
    } else {
      if (!totpCode || totpCode.trim().length !== 6) {
        setErrorMsg('Vui lòng nhập mã xác thực 6 chữ số từ ứng dụng Google Authenticator!');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const result = await login(username, password, step === '2FA' ? totpCode.trim() : undefined);

    setIsSubmitting(false);

    if (result.require_2fa) {
      setStep('2FA');
      setErrorMsg('');
      return;
    }

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 700);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in fade-in duration-300">

        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-purple-600/30">
            GG
          </div>
          <div>
            <h2 className="text-base font-black text-purple-700 dark:text-purple-400 tracking-tight leading-none">GGBingo CRM</h2>
            <p className="text-purple-600 uppercase text-[10px] tracking-wide font-extrabold mt-1">Enterprise Platform</p>
          </div>
        </div>

        {/* Greeting Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {step === 'LOGIN' ? 'Đăng Nhập CRM' : 'Xác Thực 2 Lớp (2FA)'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-extrabold text-[10px]">
              {step === 'LOGIN' ? 'Bước 1 / 2' : 'Bước 2 / 2'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {step === 'LOGIN'
              ? 'Vui lòng nhập tài khoản được cấp để truy cập hệ thống'
              : `Mở ứng dụng Google Authenticator trên điện thoại để lấy mã 6 số cho tài khoản [${username}]`}
          </p>
        </div>

        {/* Real Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center animate-in fade-in duration-150">
              ⚠️ {errorMsg}
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Xác thực tài khoản thành công! Đang vào Dashboard...
            </div>
          )}

          {step === 'LOGIN' ? (
            <>
              {/* Username Input Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Tên Đăng Nhập / Email
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập hoặc email..."
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mật Khẩu Access
                </label>
                <div className="relative">
                  <KeyRound className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: 2FA GOOGLE AUTHENTICATOR INPUT */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-1 text-center">
                <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto" />
                <p className="font-extrabold text-purple-900 dark:text-purple-300 text-xs">Yêu Cầu Xác Thực 2 Lớp Google Authenticator</p>
                <p className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">Nhập mã 6 chữ số đang hiển thị trong app của bạn</p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider text-center">
                  Mã Xác Thực OTP 6 Chữ Số *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  disabled={isSubmitting}
                  className="w-full text-center px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-purple-400 dark:border-purple-700 rounded-2xl font-mono text-xl tracking-[10px] font-black text-purple-700 dark:text-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('LOGIN')}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại nhập mật khẩu khác
              </button>
            </div>
          )}

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl py-3 text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 mt-6 disabled:opacity-70 shadow-lg shadow-purple-600/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{step === 'LOGIN' ? 'Đang Xác Thực...' : 'Đang Kiểm Tra Mã 2FA...'}</span>
              </>
            ) : (
              <>
                <span>{step === 'LOGIN' ? 'Tiếp Tục Đăng Nhập' : 'Xác Nhận Mã 2FA & Đăng Nhập'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Trust Badges */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-bit SSL & Google 2FA
          </span>
          <span>Postgres RLS Security</span>
        </div>

      </div>
    </div>
  );
}
