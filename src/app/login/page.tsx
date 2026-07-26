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
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const result = await login(username, password);

    setIsSubmitting(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 max-w-md w-full">

        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
            GG
          </div>
          <div>
            <h2 className="text-base font-extrabold text-blue-700 tracking-tight leading-none">GGBingo CRM</h2>
            <p className="text-blue-400 uppercase text-[10px] tracking-wide font-bold mt-1">Enterprise Platform</p>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Đăng Nhập CRM</h1>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng nhập tài khoản được cấp để truy cập hệ thống
          </p>
        </div>

        {/* Real Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center animate-in fade-in duration-150">
              {errorMsg}
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Xác thực tài khoản thành công! Đang vào Dashboard...
            </div>
          )}

          {/* Username Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
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
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
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
                className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-mono transition-all disabled:opacity-50"
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

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-2.5 text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 mt-6 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Đang Xác Thực Đăng Nhập...</span>
              </>
            ) : (
              <>
                <span>Đăng Nhập System Auth</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Trust Badges */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-bit SSL Encrypted
          </span>
          <span>Postgres RLS Security</span>
        </div>

      </div>
    </div>
  );
}
