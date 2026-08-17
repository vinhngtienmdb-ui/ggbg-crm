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
import { UserCheck, TrendingUp, Layers, DollarSign, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { Lead } from '@/types';

interface LeadAnalyticsDashboardProps {
  leads: Lead[];
}

const CHANNEL_COLORS: Record<string, string> = {
  Shopee: '#EE4D2D',
  TikTokShop: '#1E293B',
  FacebookAds: '#1877F2',
  Website: '#10B981',
  Hotline: '#8B5CF6',
  Direct: '#F59E0B',
};

export default function LeadAnalyticsDashboard({ leads }: LeadAnalyticsDashboardProps) {
  // Channel Intake Data
  const channelMap: Record<string, number> = {};
  let totalBudget = 0;
  let convertedCount = 0;

  leads.forEach((l) => {
    const src = l.source_name || 'Khác';
    channelMap[src] = (channelMap[src] || 0) + 1;
    totalBudget += l.estimated_budget || 0;
    if (l.status === 'Converted') convertedCount++;
  });

  const channelPieData = Object.keys(channelMap).map((src) => ({
    name: src,
    value: channelMap[src],
    color: CHANNEL_COLORS[src] || '#6B7280',
  }));

  // Status Funnel Data
  const statusMap: Record<string, number> = {
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Negotiating: 0,
    Converted: 0,
    Lost: 0,
  };

  leads.forEach((l) => {
    if (statusMap[l.status] !== undefined) {
      statusMap[l.status]++;
    }
  });

  const statusFunnelData = [
    { name: '1. Lead Mới', count: statusMap.New, fill: '#3B82F6' },
    { name: '2. Đã Liên Hệ', count: statusMap.Contacted, fill: '#8B5CF6' },
    { name: '3. Đánh Giá Gian Hàng', count: statusMap.Qualified, fill: '#F59E0B' },
    { name: '4. Báo Giá & Thương Lượng', count: statusMap.Negotiating, fill: '#EC4899' },
    { name: '5. Chốt Hợp Đồng', count: statusMap.Converted, fill: '#10B981' },
  ];

  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[11px] font-semibold mb-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân Tích Báo Cáo CRM & Lead Intake</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard Báo Cáo Phễu Chuyển Đổi Lead & Doanh Số Dự Kiến</h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 font-medium block">Tỷ Lệ Chốt Hợp Đồng Thành Công:</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-lg">{conversionRate}%</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Status Funnel Bar Chart */}
        <div className="lg:col-span-2 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Phễu Chuyển Đổi Lead Theo Giai Đoạn Vận Hành
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
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
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Số Lead" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Channel Intake Pie Chart */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Phân Bổ Lead Theo Kênh Tiếp Nhận
          </h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {channelPieData.map((entry, index) => (
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
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
            {channelPieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{st.value} Lead</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
