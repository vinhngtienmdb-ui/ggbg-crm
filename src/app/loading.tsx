import React from 'react';
import { SkeletonPage } from '@/components/ui/Skeleton';

export default function GlobalLoading() {
  return ( <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-150"> <div className="relative flex items-center justify-center"> <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm"> <Loader2 className="w-6 h-6 text-blue-600 animate-spin" /> </div> </div> <p className="text-xs font-medium text-slate-500 tracking-wide animate-pulse"> Đang tải phân hệ... </p> </div> );
}
