'use client';

import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
      setErrorMsg('Mật khẩu xác nhận không trùng khớp với Mật khẩu mới!');
      return;
    }

    setLoading(true);
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
        if (onSuccess) onSuccess(data.message || '🎉 Đổi mật khẩu cá nhân thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        setErrorMsg(data.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"> <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4 text-xs font-medium"> {/* Header */} <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"> <div className="flex items-center gap-2.5"> <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"> <KeyRound className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Tự Đổi Mật Khẩu Cá Nhân</h3> <p className="text-[11px] text-slate-400 font-medium">Bảo mật tài khoản với mật khẩu mạnh</p> </div> </div> <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600"> <X className="w-5 h-5" /> </button> </div> {errorMsg && ( <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-medium"> {errorMsg} </div> )} <form onSubmit={handleSubmit} className="space-y-4"> <div className="space-y-1"> <label className="block text-slate-700 dark:text-slate-300 font-medium"> Mật khẩu hiện tại * </label> <div className="relative"> <input
                type={showPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu đang dùng..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              /> <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              > {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} </button> </div> </div> <div className="space-y-1"> <label className="block text-slate-700 dark:text-slate-300 font-medium"> Mật khẩu mới (tối thiểu 6 ký tự) * </label> <input
              type={showPass ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            /> </div> <div className="space-y-1"> <label className="block text-slate-700 dark:text-slate-300 font-medium"> Xác nhận mật khẩu mới * </label> <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            /> </div> <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800"> <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
            > Hủy </button> <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            > {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'} </button> </div> </form> </div> </div> );
}
