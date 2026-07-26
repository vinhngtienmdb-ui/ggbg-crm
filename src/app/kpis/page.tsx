'use client';

import React, { useState } from 'react';
import {
  Layers,
} from 'lucide-react';
export type KPILevel = 'COMPANY' | 'DEPARTMENT' | 'TEAM' | 'INDIVIDUAL';
export type KPICategory = 'REVENUE' | 'NEW_LEADS' | 'CONVERSION_RATE' | 'CSAT' | 'RECRUITMENT';
export type ReportPeriod = 'MONTH_07_2026' | 'Q3_2026' | 'YEAR_2026';

interface KPIItem {
  id: string;
  name: string;
  level: KPILevel;
  level_name: string;
  target_owner: string;
  period: ReportPeriod;
  period_label: string;
  category: KPICategory;
  category_label: string;
  target_value: number;
  current_value: number;
  unit: string;
  achievement_rate: number;
}

const INITIAL_KPIS: KPIItem[] = [
  {
    id: 'kpi_1',
    name: 'Tổng Doanh Thu Toàn Công Ty Q3/2026',
    level: 'COMPANY',
    level_name: '🌐 Toàn Công Ty',
    target_owner: 'GGBingo Việt Nam JSC',
    period: 'Q3_2026',
    period_label: 'Q3/2026',
    category: 'REVENUE',
    category_label: '💰 Doanh thu',
    target_value: 15000000000,
    current_value: 16500000000,
    unit: 'VNĐ',
    achievement_rate: 110,
  },
  {
    id: 'kpi_2',
    name: 'Chỉ Tiêu Doanh Số Phòng Kinh Doanh Tháng 07/2026',
    level: 'DEPARTMENT',
    level_name: '🏢 Phòng Ban',
    target_owner: 'Phòng Kinh Doanh (Sales Dept)',
    period: 'MONTH_07_2026',
    period_label: 'Tháng 07/2026',
    category: 'REVENUE',
    category_label: '💰 Doanh thu',
    target_value: 5000000000,
    current_value: 4800000000,
    unit: 'VNĐ',
    achievement_rate: 96,
  },
  {
    id: 'kpi_3',
    name: 'Số Lượng Lead Mới Tiếp Nhận Đội TikTok Shop',
    level: 'TEAM',
    level_name: '👥 Đội Nhóm',
    target_owner: 'Đội 3 (TikTok Shop Team)',
    period: 'MONTH_07_2026',
    period_label: 'Tháng 07/2026',
    category: 'NEW_LEADS',
    category_label: '🎯 Leads mới',
    target_value: 200,
    current_value: 140,
    unit: 'Leads',
    achievement_rate: 70,
  },
  {
    id: 'kpi_4',
    name: 'Doanh Số Cá Nhân Trần Văn Hoàng',
    level: 'INDIVIDUAL',
    level_name: '👤 Cá Nhân',
    target_owner: 'Trần Văn Hoàng (Sale Exec)',
    period: 'MONTH_07_2026',
    period_label: 'Tháng 07/2026',
    category: 'REVENUE',
    category_label: '💰 Doanh thu',
    target_value: 500000000,
    current_value: 620000000,
    unit: 'VNĐ',
    achievement_rate: 124,
  },
  {
    id: 'kpi_5',
    name: 'Tỷ Lệ Hài Lòng Khách Hàng CSAT Phòng CSKH',
    level: 'DEPARTMENT',
    level_name: '🏢 Phòng Ban',
    target_owner: 'Phòng CSKH',
    period: 'MONTH_07_2026',
    period_label: 'Tháng 07/2026',
    category: 'CSAT',
    category_label: '⭐ Điểm CSAT',
    target_value: 95,
    current_value: 96,
    unit: '%',
    achievement_rate: 101,
  },
];

function getKPIStatusBadge(rate: number) {
  if (rate >= 100) {
    return { label: '🔥 Vượt Chỉ Tiêu', color: 'bg-success-bg text-success-fg border-success-border' };
  } else if (rate >= 80) {
    return { label: '✓ Đạt Tiến Độ', color: 'bg-brand-300 text-brand-800 border-brand-200' };
  } else if (rate >= 50) {
    return { label: '⚠️ Có Nguy Cơ', color: 'bg-warn-bg text-warn-fg border-gold-border' };
  } else {
    return { label: '❌ Chưa Đạt', color: 'bg-danger-bg text-danger-fg border-danger-border' };
  }
}

export default function KPIsPage() {
  const [kpis, setKpis] = useState<KPIItem[]>(INITIAL_KPIS);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredKPIs = kpis.filter((item) => {
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;
    if (selectedPeriod !== 'ALL' && item.period !== selectedPeriod) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            Quản Lý KPIs Đa Cấp Độ (Multi-Level Targets)
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-xs font-semibold border border-brand-100 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-600" /> 4 Cấp Độ & 5 Loại Chỉ Tiêu
            </span>
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Giao chỉ tiêu đa cấp (Toàn Công Ty ➔ Phòng Ban ➔ Đội Nhóm ➔ Cá Nhân) & Tự động xếp loại Vượt/Đạt/Nguy cơ
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Level filter — one chip style across all levels, per the redesign. */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-ink-700">Cấp Độ Giao:</span>
          {(
            [
              { id: 'ALL', label: `Tất cả cấp (${kpis.length})` },
              { id: 'COMPANY', label: '🌐 Toàn Công Ty' },
              { id: 'DEPARTMENT', label: '🏢 Phòng Ban' },
              { id: 'TEAM', label: '👥 Đội Nhóm' },
              { id: 'INDIVIDUAL', label: '👤 Cá Nhân' },
            ] as const
          ).map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`rounded-full border px-3.5 py-[7px] text-[11.5px] font-bold transition-colors ${
                selectedLevel === lvl.id
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-line bg-white text-ink-700 hover:border-line-strong'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Period & Category Filter Selectors */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900"
          >
            <option value="ALL">Tất cả Kỳ báo cáo</option>
            <option value="MONTH_07_2026">Tháng 07/2026</option>
            <option value="Q3_2026">Q3/2026</option>
            <option value="YEAR_2026">Năm 2026</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900"
          >
            <option value="ALL">Tất cả Loại chỉ tiêu</option>
            <option value="REVENUE">💰 Doanh thu</option>
            <option value="NEW_LEADS">🎯 Leads mới</option>
            <option value="CONVERSION_RATE">📈 Tỷ lệ chốt</option>
            <option value="CSAT">⭐ Điểm CSAT</option>
            <option value="RECRUITMENT">👥 Tuyển dụng</option>
          </select>

          <div className="flex overflow-hidden rounded-[9px] border border-line bg-white">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-2 text-[11.5px] font-extrabold transition-colors ${
                viewMode === 'cards' ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-brand-50'
              }`}
            >
              ▦ Thẻ
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-2 text-[11.5px] font-extrabold transition-colors ${
                viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-brand-50'
              }`}
            >
              ☰ Bảng
            </button>
          </div>
        </div>
      </div>

      {/* Card view — the redesign's default presentation. */}
      {viewMode === 'cards' && (
        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))]">
          {filteredKPIs.map((item) => {
            const badge = getKPIStatusBadge(item.achievement_rate);
            const barColor =
              item.achievement_rate >= 100
                ? '#1F7A33'
                : item.achievement_rate >= 85
                  ? '#2E5CE6'
                  : '#A05408';
            const fmt = (v: number) =>
              item.unit === 'VNĐ'
                ? `${(v / 1000000).toLocaleString('vi-VN')} Tr ₫`
                : `${v.toLocaleString('vi-VN')} ${item.unit}`;

            return (
              <div key={item.id} className="dc-card card-hover p-[18px]">
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-extrabold tracking-[0.6px] text-ink-400">
                      {item.category_label} · {item.period_label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-extrabold text-ink-900">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-500">
                      {item.level_name} — {item.target_owner}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="dc-num text-xs text-ink-500">
                    {fmt(item.current_value)} / {fmt(item.target_value)}
                  </span>
                  <span className="dc-num text-base font-extrabold" style={{ color: barColor }}>
                    {item.achievement_rate}%
                  </span>
                </div>

                <div className="dc-bar h-2">
                  <span style={{ width: `${Math.min(item.achievement_rate, 100)}%`, background: barColor }} />
                </div>
              </div>
            );
          })}

          {filteredKPIs.length === 0 && (
            <p className="rounded-xl border border-dashed border-line-muted bg-white px-4 py-12 text-center text-[12.5px] text-ink-500">
              Không có chỉ tiêu nào khớp bộ lọc hiện tại.
            </p>
          )}
        </div>
      )}

      {/* Main KPI Table */}
      <div className={`bg-white rounded-2xl border border-line shadow-sm overflow-hidden ${viewMode === 'table' ? '' : 'hidden'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider">
                <th className="p-4">Tên Chỉ Tiêu KPI</th>
                <th className="p-4">Cấp Độ & Đơn Vị Thụ Hưởng</th>
                <th className="p-4">Kỳ Báo Cáo</th>
                <th className="p-4">Mục Tiêu Giao</th>
                <th className="p-4">Thực Hiện Thực Tế</th>
                <th className="p-4">Tiến Độ Tự Động</th>
                <th className="p-4 text-center">Xếp Loại Tiến Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredKPIs.map((item) => {
                const statusBadge = getKPIStatusBadge(item.achievement_rate);
                return (
                  <tr key={item.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-ink-900 text-sm">{item.name}</p>
                      <p className="text-[11px] font-semibold text-brand-600 mt-0.5">{item.category_label}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-ink-900 block">{item.level_name}</span>
                      <span className="text-[11px] text-ink-500">{item.target_owner}</span>
                    </td>

                    <td className="p-4 font-semibold text-ink-700 font-mono">
                      {item.period_label}
                    </td>

                    <td className="p-4 font-mono font-bold text-ink-900">
                      {item.unit === 'VNĐ' ? `${(item.target_value / 1000000).toLocaleString('vi-VN')} Tr ₫` : `${item.target_value} ${item.unit}`}
                    </td>

                    <td className="p-4 font-mono font-extrabold text-success-fg">
                      {item.unit === 'VNĐ' ? `${(item.current_value / 1000000).toLocaleString('vi-VN')} Tr ₫` : `${item.current_value} ${item.unit}`}
                    </td>

                    <td className="p-4 w-48">
                      <div className="flex items-center justify-between text-[11px] font-bold font-mono mb-1">
                        <span>{item.achievement_rate}%</span>
                      </div>
                      <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.achievement_rate >= 100 ? 'bg-success-dot' : item.achievement_rate >= 80 ? 'bg-brand-500' : item.achievement_rate >= 50 ? 'bg-warn-fg' : 'bg-danger-dot'
                          }`}
                          style={{ width: `${Math.min(item.achievement_rate, 100)}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
