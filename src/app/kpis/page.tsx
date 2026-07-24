'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Users,
  Building2,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Crown,
  Medal,
  Trophy,
  Flame,
  ChevronRight,
  Calendar,
  Layers,
  Check
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
    return { label: '🔥 Vượt Chỉ Tiêu', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (rate >= 80) {
    return { label: '✓ Đạt Tiến Độ', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  } else if (rate >= 50) {
    return { label: '⚠️ Có Nguy Cơ', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  } else {
    return { label: '❌ Chưa Đạt', color: 'bg-red-100 text-red-800 border-red-300' };
  }
}

export default function KPIsPage() {
  const [kpis, setKpis] = useState<KPIItem[]>(INITIAL_KPIS);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredKPIs = kpis.filter((item) => {
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;
    if (selectedPeriod !== 'ALL' && item.period !== selectedPeriod) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Quản Lý KPIs Đa Cấp Độ (Multi-Level Targets)
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> 4 Cấp Độ & 5 Loại Chỉ Tiêu
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Giao chỉ tiêu đa cấp (Toàn Công Ty ➔ Phòng Ban ➔ Đội Nhóm ➔ Cá Nhân) & Tự động xếp loại Vượt/Đạt/Nguy cơ
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Level Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700">Cấp Độ Giao:</span>
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLevel === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả Cấp ({kpis.length})
          </button>
          <button
            onClick={() => setSelectedLevel('COMPANY')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLevel === 'COMPANY' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            🌐 Toàn Công Ty
          </button>
          <button
            onClick={() => setSelectedLevel('DEPARTMENT')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLevel === 'DEPARTMENT' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            🏢 Phòng Ban
          </button>
          <button
            onClick={() => setSelectedLevel('TEAM')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLevel === 'TEAM' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            👥 Đội Nhóm
          </button>
          <button
            onClick={() => setSelectedLevel('INDIVIDUAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedLevel === 'INDIVIDUAL' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            👤 Cá Nhân
          </button>
        </div>

        {/* Period & Category Filter Selectors */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="ALL">Tất cả Kỳ báo cáo</option>
            <option value="MONTH_07_2026">Tháng 07/2026</option>
            <option value="Q3_2026">Q3/2026</option>
            <option value="YEAR_2026">Năm 2026</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="ALL">Tất cả Loại chỉ tiêu</option>
            <option value="REVENUE">💰 Doanh thu</option>
            <option value="NEW_LEADS">🎯 Leads mới</option>
            <option value="CONVERSION_RATE">📈 Tỷ lệ chốt</option>
            <option value="CSAT">⭐ Điểm CSAT</option>
            <option value="RECRUITMENT">👥 Tuyển dụng</option>
          </select>
        </div>
      </div>

      {/* Main KPI Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="p-4">Tên Chỉ Tiêu KPI</th>
                <th className="p-4">Cấp Độ & Đơn Vị Thụ Hưởng</th>
                <th className="p-4">Kỳ Báo Cáo</th>
                <th className="p-4">Mục Tiêu Giao</th>
                <th className="p-4">Thực Hiện Thực Tế</th>
                <th className="p-4">Tiến Độ Tự Động</th>
                <th className="p-4 text-center">Xếp Loại Tiến Độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKPIs.map((item) => {
                const statusBadge = getKPIStatusBadge(item.achievement_rate);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{item.category_label}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{item.level_name}</span>
                      <span className="text-[11px] text-slate-500">{item.target_owner}</span>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 font-mono">
                      {item.period_label}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-900">
                      {item.unit === 'VNĐ' ? `${(item.target_value / 1000000).toLocaleString('vi-VN')} Tr ₫` : `${item.target_value} ${item.unit}`}
                    </td>

                    <td className="p-4 font-mono font-extrabold text-emerald-700">
                      {item.unit === 'VNĐ' ? `${(item.current_value / 1000000).toLocaleString('vi-VN')} Tr ₫` : `${item.current_value} ${item.unit}`}
                    </td>

                    <td className="p-4 w-48">
                      <div className="flex items-center justify-between text-[11px] font-bold font-mono mb-1">
                        <span>{item.achievement_rate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.achievement_rate >= 100 ? 'bg-emerald-500' : item.achievement_rate >= 80 ? 'bg-blue-500' : item.achievement_rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
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
