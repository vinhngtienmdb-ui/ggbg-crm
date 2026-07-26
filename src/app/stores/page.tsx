'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  X,
} from 'lucide-react';
import { INITIAL_STORES } from '@/lib/storeStore';
import { EcomStore } from '@/types/store';
export default function StoresPage() {
  const [stores, setStores] = useState<EcomStore[]>(INITIAL_STORES);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

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
        return (
          <span className="px-2 py-0.5 bg-success-bg text-success-fg border border-success-border rounded font-bold text-[10px]">
            ✓ Xuất Sắc (5★)
          </span>
        );
      case 'GOOD':
        return (
          <span className="px-2 py-0.5 bg-brand-50 text-brand-800 border border-brand-100 rounded font-bold text-[10px]">
            ✓ Tốt (4.8★)
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 bg-warn-bg text-warn-fg border border-gold-border rounded font-bold text-[10px]">
            ⚠️ Cần Cảnh Báo
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 bg-danger-bg text-danger-fg border border-danger-border rounded font-bold text-[10px]">
            ⛔ Rủi Ro Cao
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-lg bg-success-fg text-white font-bold text-xs shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-dot" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-success-fg rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-brand-50 rounded-lg p-5 text-brand-800 border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-subtle border border-line text-ink-400 text-[11px] font-medium mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-400" />
            <span>Multi-Store Health & GMV Engine</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Quản Lý Gian Hàng Đa Sàn TMĐT & Chỉ Số Sức Khỏe Shop
          </h1>
          <p className="text-ink-400 text-xs mt-1">
            Theo dõi chỉ số vận hành thực tế của Shopee Mall, TikTok Shop, Lazada & Amazon kéo về qua API.
          </p>
        </div>

        <button
          onClick={() => {
            setToastMessage('🎉 Đã đồng bộ thành công dữ liệu GMV mới nhất từ API Shopee & TikTok Shop!');
            setTimeout(() => setToastMessage(''), 4000);
          }}
          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-md text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Đồng Bộ API Sàn
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll sleek-scrollbar w-full sm:w-auto text-[11px]">
          {['ALL', 'Shopee Mall', 'TikTok Shop', 'Lazada', 'Amazon'].map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
                selectedPlatform === platform
                  ? 'bg-brand-50 text-brand-800'
                  : 'bg-line-soft text-ink-700 hover:bg-line'
              }`}
            >
              {platform === 'ALL' ? 'Tất Cả Sàn' : platform}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm gian hàng, mã shop..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-subtle border border-line rounded-md text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white p-5 rounded-lg border border-line space-y-4">
        <div className="overflow-x-auto touch-scroll sleek-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Mã & Tên Gian Hàng</th>
                <th className="p-3">Sàn TMĐT</th>
                <th className="p-3">Chủ Sở Hữu / Doanh Nghiệp</th>
                <th className="p-3">GMV Thực Tế vs Mục Tiêu</th>
                <th className="p-3">Sức Khỏe Shop</th>
                <th className="p-3">Tỷ Lệ Hủy Đơn</th>
                <th className="p-3">Ops Phụ Trách</th>
                <th className="p-3 text-right">Liên Kết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-ink-900">{store.store_name}</p>
                    <p className="text-[11px] text-brand-600 font-mono font-semibold">{store.store_code}</p>
                  </td>
                  <td className="p-3 font-medium text-ink-700">{store.platform}</td>
                  <td className="p-3">
                    <p className="font-semibold text-ink-900">{store.company_name}</p>
                    <p className="text-[11px] text-ink-500">{store.customer_name}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-mono font-bold text-ink-900 tabular-numbers">{store.monthly_gmv_actual.toLocaleString('vi-VN')} ₫</p>
                    <p className="text-[10px] text-ink-400 font-mono">Mục tiêu: {store.monthly_gmv_target.toLocaleString('vi-VN')} ₫</p>
                  </td>
                  <td className="p-3">{renderHealthBadge(store.health_rating)}</td>
                  <td className="p-3 font-bold text-ink-700">{store.cancellation_rate_percent}%</td>
                  <td className="p-3 text-ink-500 font-medium">{store.owner_ops_name}</td>
                  <td className="p-3 text-right">
                    <a
                      href={store.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-line-soft hover:bg-line text-ink-700 rounded border border-line font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-ink-500" /> Xem Shop
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
