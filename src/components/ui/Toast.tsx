'use client';

/**
 * Toast notification system — lightweight, no external dependency.
 * Usage:
 *   import { useToast } from '@/components/ui/Toast';
 *   const { toast } = useToast();
 *   toast.success('Lưu thành công!');
 *   toast.error('Có lỗi xảy ra');
 *   toast.info('Thông báo mới');
 *   toast.warning('Cảnh báo!');
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />,
  error:   <XCircle    className="w-4 h-4 text-red-500 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  info:    <Info       className="w-4 h-4 text-indigo-500 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-slate-900',
  error:   'border-red-200 dark:border-red-800/60 bg-white dark:bg-slate-900',
  warning: 'border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-900',
  info:    'border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-slate-900',
};

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(item.id), 300);
    }, item.duration ?? 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-slate-900/10 dark:shadow-slate-900/40 min-w-[280px] max-w-[380px] text-sm font-medium text-slate-800 dark:text-slate-100 transition-all duration-300',
        STYLES[item.type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
    >
      {ICONS[item.type]}
      <span className="flex-1 leading-snug">{item.message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(item.id), 300);
        }}
        className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
  }, []);

  const toast = {
    success: (msg: string, dur?: number) => add('success', msg, dur),
    error:   (msg: string, dur?: number) => add('error', msg, dur),
    warning: (msg: string, dur?: number) => add('warning', msg, dur),
    info:    (msg: string, dur?: number) => add('info', msg, dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Portal — top-right */}
      <div
        aria-label="Thông báo hệ thống"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastItem item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
