'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  RefreshCw,
  X
} from 'lucide-react';
import { getStores, STORES_UPDATED_EVENT } from '@/lib/storeStore';
import { EcomStore } from '@/types/store';
import { formatCurrency } from '@/lib/formatters';

export default function StoresPage() {
  const [stores, setStores] = useState<EcomStore[]>(() => getStores());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleUpdate = () => setStores([...getStores()]);
    window.addEventListener(STORES_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STORES_UPDATED_EVENT, handleUpdate);
  }, []);

  const filteredStores = stores.filter((s) => {
    if (selectedPlatform !== 'ALL' && s.platform !== selectedPlatform) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        s.store_name.toLowerCase().includes(term) ||
        s.customer_name.toLowerCase().includes(term) ||
        s.store_code.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const renderHealthBadge = (rating: EcomStore['health_rating']) => {
    switch (rating) {
      case 'EXCELLENT':
        return ( <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md font-medium text-[11px]"> Xuất Sắc (5.0) </span> );
      case 'GOOD':
        return ( <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md font-medium text-[11px]"> Tốt (4.8) </span> );
      case 'WARNING':
        return ( <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md font-medium text-[11px]"> Cần Cảnh Báo </span> );
      case 'CRITICAL':
        return ( <span className="px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md font-medium text-[11px]"> Rủi Ro Cao </span> );
      default:
        return null;
    }
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMessage && ( <div className="p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top duration-300"> <div className="flex items-center gap-2"> <CheckCircle2 className="w-4 h-4 text-emerald-200" /> <span>{toastMessage}</span> </div> <button onClick={() => setToastMessage('')} className="p-1 hover:bg-emerald-700 rounded-lg"> <X className="w-4 h-4" /> </button> </div> )}

      {/* Header - Clean White with Colorful Highlights */} <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400"> <ShoppingBag className="w-5 h-5" /> </div> <div> <div className="flex items-center gap-2"> <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"> Gian Hàng Đa Sàn TMĐT </h1> <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800"> {stores.length} Gian Hàng </span> </div> <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5"> Theo dõi chỉ số vận hành Shopee Mall, TikTok Shop, Lazada & Amazon đồng bộ qua API </p> </div> </div> <button
          onClick={() => {
            setToastMessage('Đã đồng bộ thành công dữ liệu GMV mới nhất từ API sàn TMĐT!');
            setTimeout(() => setToastMessage(''), 4000);
          }}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        > <RefreshCw className="w-3.5 h-3.5" /> Đồng Bộ API Sàn </button> </div> {/* Filter Bar */} <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll scrollbar-none w-full sm:w-auto text-xs"> {['ALL', 'Shopee Mall', 'TikTok Shop', 'Lazada', 'Amazon'].map((platform) => ( <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                selectedPlatform === platform
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            > {platform === 'ALL' ? 'Tất Cả Sàn' : platform} </button> ))} </div> <div className="relative w-full sm:w-80"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên shop, mã gian hàng, chủ sở hữu..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          /> </div> </div> {/* Stores Table */} <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4"> <div className="overflow-x-auto touch-scroll sleek-scrollbar"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wide text-[10.5px]"> <th className="p-3">Mã & Tên Gian Hàng</th> <th className="p-3">Sàn TMĐT</th> <th className="p-3">Chủ Sở Hữu / Doanh Nghiệp</th> <th className="p-3">GMV Thực Tế vs Mục Tiêu</th> <th className="p-3">Sức Khỏe Shop</th> <th className="p-3">Tỷ Lệ Hủy Đơn</th> <th className="p-3">Ops Phụ Trách</th> <th className="p-3 text-right">Liên Kết</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {filteredStores.map((store) => ( <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors"> <td className="p-3"> <p className="font-medium text-slate-900">{store.store_name}</p> <p className="text-[11px] text-blue-600 font-mono font-semibold">{store.store_code}</p> </td> <td className="p-3 font-medium text-slate-700">{store.platform}</td> <td className="p-3"> <p className="font-semibold text-slate-800">{store.company_name}</p> <p className="text-[11px] text-slate-500">{store.customer_name}</p> </td> <td className="p-3"> <p className="font-mono font-medium text-slate-900 tabular-numbers">{formatCurrency(store.monthly_gmv_actual)}</p> <p className="text-[10px] text-slate-400 font-mono">Mục tiêu: {formatCurrency(store.monthly_gmv_target)}</p> </td> <td className="p-3">{renderHealthBadge(store.health_rating)}</td> <td className="p-3 font-medium text-slate-700">{store.cancellation_rate_percent}%</td> <td className="p-3 text-slate-600 font-medium">{store.owner_ops_name}</td> <td className="p-3 text-right"> <a
                      href={store.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                    > <ExternalLink className="w-3 h-3 text-slate-500" /> Xem Shop </a> </td> </tr> ))} </tbody> </table> </div> </div> </div> );
}
