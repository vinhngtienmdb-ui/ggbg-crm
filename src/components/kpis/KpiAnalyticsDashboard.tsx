'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Target, TrendingUp, Award, Flame, AlertCircle, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { KPIAssignment } from '@/types';

interface KpiAnalyticsDashboardProps {
  kpis: KPIAssignment[];
}

const STATUS_COLORS: Record<string, string> = {
  EXCEEDED: '#6366F1', // Indigo
  COMPLETED: '#10B981', // Emerald
  IN_PROGRESS: '#3B82F6', // Blue
  BEHIND: '#F59E0B', // Amber
};

export default function KpiAnalyticsDashboard({ kpis }: KpiAnalyticsDashboardProps) {
  // Department Aggregation Data for BarChart
  const deptDataMap: Record<string, { target: number; actual: number; count: number }> = {};

  kpis.forEach((item) => {
    const dept = item.department || item.assignee_name || 'Khác';
    if (!deptDataMap[dept]) {
      deptDataMap[dept] = { target: 0, actual: 0, count: 0 };
    }
    // Scale normalized values for visual comparison
    if (item.unit === 'VND' || item.unit === 'VNĐ') {
      deptDataMap[dept].target += Math.round(item.target_value / 1000000); // In Millions
      deptDataMap[dept].actual += Math.round(item.actual_value / 1000000);
    } else {
      deptDataMap[dept].target += item.target_value;
      deptDataMap[dept].actual += item.actual_value;
    }
    deptDataMap[dept].count += 1;
  });

  const deptChartData = Object.keys(deptDataMap).map((dept) => ({
    name: dept.replace('Phòng ', '').replace('Khối ', ''),
    ChỉTiêu: deptDataMap[dept].target,
    ThựcTế: deptDataMap[dept].actual,
  }));

  // Status Breakdown Data for PieChart
  let exceeded = 0;
  let completed = 0;
  let inProgress = 0;
  let behind = 0;

  kpis.forEach((k) => {
    const pct = k.progress_percentage || 0;
    if (pct >= 110) exceeded++;
    else if (pct >= 100) completed++;
    else if (pct >= 80) inProgress++;
    else behind++;
  });

  const statusPieData = [
    { name: ' Vượt chỉ tiêu (≥110%)', value: exceeded, color: STATUS_COLORS.EXCEEDED },
    { name: ' Hoàn thành (100-109%)', value: completed, color: STATUS_COLORS.COMPLETED },
    { name: '⚡ Đúng tiến độ (80-99%)', value: inProgress, color: STATUS_COLORS.IN_PROGRESS },
    { name: ' Chậm tiến độ (<80%)', value: behind, color: STATUS_COLORS.BEHIND },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[11px] font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân Tích Báo Cáo Chuyên Sâu</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard Phân Tích Chỉ Số KPI Toàn Hệ Thống</h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 font-medium block">Tổng Số Chỉ Tiêu:</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-lg">{kpis.length} KPI</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Department Target vs Actual Bar Chart */}
        <div className="lg:col-span-2 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            So Sánh Chỉ Tiêu vs Thực Tế Theo Phòng Ban
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="ChỉTiêu" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Mục Tiêu" />
                <Bar dataKey="ThựcTế" fill="#10B981" radius={[6, 6, 0, 0]} name="Thực Tế Đạt Được" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown Pie Chart */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Phân Bổ Trạng Thái Tiến Độ
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
            {statusPieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{st.value} KPI</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
