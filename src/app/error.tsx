'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>

      <div className="text-center space-y-1.5 max-w-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Đã xảy ra lỗi
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Trang này gặp sự cố không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-2">
            Mã lỗi: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
