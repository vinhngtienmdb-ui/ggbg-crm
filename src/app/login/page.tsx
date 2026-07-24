'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  User,
  KeyRound,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Building2,
  TrendingUp,
  ShoppingBag,
  PhoneCall,
  Globe
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
    <div className="min-h-screen w-full bg-slate-950 flex font-sans text-slate-100 relative overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Main Container - Split Screen */}
      <div className="w-full flex flex-col lg:flex-row min-h-screen z-10">

        {/* LEFT COLUMN: Premium Brand & Enterprise Feature Showcase */}
        <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-12 xl:p-16 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative">

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-white">
                GG
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                GGBingo Enterprise
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-semibold">
                  v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">E-Commerce Agency & Platform Admin</p>
            </div>
          </div>

          {/* Middle Value Proposition Hero Section */}
          <div className="my-auto space-y-8 py-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
                Hệ Thống Quản Trị Chuyên Sâu TMĐT (Shopee • TikTok • Lazada • Amazon)
              </div>
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
                Nâng Tầm Vận Hành <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Đột Phá Doanh Số TMĐT
                </span>
              </h1>
              <p className="text-slate-300 text-sm xl:text-base max-w-xl leading-relaxed">
                Nền tảng CRM tích hợp phân quyền hạt mịn cho 500+ nhân sự, tự động tiếp nhận Lead đa kênh, VoIP Call Center & Hệ thống chấm điểm KPI tự động.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 backdrop-blur-sm">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ủy Quyền Vận Hành</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Shopee Mall, TikTok Shop, Lazada</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 backdrop-blur-sm">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Sàn GGBingoVN</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Tuyển mộ & quản lý merchant</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 backdrop-blur-sm">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">VoIP Telephony</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ghi âm cuộc gọi R2 Storage</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 backdrop-blur-sm">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Phân Quyền RLS</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Chống rò rỉ SĐT 500+ users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live System Status Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300 font-medium">Supabase Enterprise Auth Online</span>
            </div>
            <span>© 2026 GGBingo Corporation</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Clean & Professional Login Portal */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 relative">

          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 text-slate-900 relative z-10">

            {/* Top Greeting */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đăng Nhập CRM</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Vui lòng nhập tài khoản được cấp để truy cập hệ thống
              </p>
            </div>

            {/* Real Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center animate-in fade-in duration-150">
                  {errorMsg}
                </div>
              )}

              {isSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-150">
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all disabled:opacity-50"
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
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 font-mono transition-all disabled:opacity-50"
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
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 mt-6 disabled:opacity-70"
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
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-bit SSL Encrypted
              </span>
              <span>Postgres RLS Security</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
