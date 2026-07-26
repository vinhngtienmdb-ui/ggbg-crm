'use client';

import React from 'react';
import {
  BarChart3,
  X,
  TrendingUp,
  Share2,
  PieChart,
  Zap,
  Target,
  Send,
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Lead, LeadChannelStats } from '@/types';

interface ChannelAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onTriggerTestWebhook: () => void;
}

export default function ChannelAnalyticsDrawer({
  isOpen,
  onClose,
  leads,
  onTriggerTestWebhook,
}: ChannelAnalyticsDrawerProps) {
  if (!isOpen) return null;

  // Calculate channel stats dynamically from current leads
  const channelMap: Record<string, { total: number; converted: number; budget: number }> = {};

  leads.forEach((l) => {
    const src = l.source_name || 'Khác';
    if (!channelMap[src]) {
      channelMap[src] = { total: 0, converted: 0, budget: 0 };
    }
    channelMap[src].total += 1;
    if (l.stage_id === 'stage_6' || l.status === 'Converted') {
      channelMap[src].converted += 1;
    }
    channelMap[src].budget += l.estimated_budget || 0;
  });

  const channelStatsList: LeadChannelStats[] = Object.entries(channelMap).map(([srcName, data]) => ({
    source_name: srcName,
    total_leads: data.total,
    converted_count: data.converted,
    conversion_rate: data.total > 0 ? (data.converted / data.total) * 100 : 0,
    total_budget: data.budget,
  }));

  const totalLeadsCount = leads.length;
  const totalConvertedCount = leads.filter((l) => l.stage_id === 'stage_6' || l.status === 'Converted').length;
  const overallConversionRate = totalLeadsCount > 0 ? ((totalConvertedCount / totalLeadsCount) * 100).toFixed(1) : '0.0';
  const grandTotalBudget = leads.reduce((sum, l) => sum + (l.estimated_budget || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" /> Báo Cáo Hiệu Quả Kênh Lead Đa Kênh
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân tích tỷ lệ chuyển đổi thành công & tổng ngân sách theo từng kênh Marketing
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-blue-50 text-slate-900 rounded-2xl border border-blue-200 space-y-1">
            <p className="text-[10px] text-blue-700 font-bold uppercase">Tổng Lead Đa Kênh</p>
            <p className="text-xl font-extrabold text-blue-700">{totalLeadsCount}</p>
          </div>

          <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 space-y-1">
            <p className="text-[10px] text-emerald-700 font-bold uppercase">Tỷ Lệ Chuyển Đổi</p>
            <p className="text-xl font-extrabold text-emerald-700">{overallConversionRate}%</p>
          </div>

          <div className="p-3.5 bg-purple-50 text-purple-900 rounded-2xl border border-purple-200 space-y-1">
            <p className="text-[10px] text-purple-700 font-bold uppercase">Tổng Ngân Sách</p>
            <p className="text-xs font-mono font-extrabold text-purple-800 pt-1">
              {(grandTotalBudget / 1000000).toFixed(0)}Tr ₫
            </p>
          </div>
        </div>

        {/* Trigger Test Webhook Ingest Button */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" /> Thử Nghiệm Bắn Lead Webhook Real-time
            </h4>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Gửi thử nghiệm 1 Payload Webhook từ Landing Page vào phễu
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerTestWebhook}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1 shrink-0 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" /> Bắn Lead Webhook
          </button>
        </div>

        {/* Breakdown by Channels */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <PieChart className="w-4 h-4 text-blue-600" /> Chi Tiết Hiệu Quả Theo Từng Kênh Nguồn ({channelStatsList.length} Kênh)
          </h4>

          <div className="space-y-3">
            {channelStatsList.map((stat) => {
              const percentage = totalLeadsCount > 0 ? ((stat.total_leads / totalLeadsCount) * 100).toFixed(1) : '0';

              return (
                <div key={stat.source_name} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{stat.source_name}</span>
                      <span className="ml-2 font-mono text-[11px] text-blue-700 font-bold">
                        {stat.total_leads} Lead ({percentage}%)
                      </span>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-emerald-700">
                      {(stat.total_budget / 1000000).toLocaleString('vi-VN')} Tr ₫
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Đã chốt thành công: <strong className="text-emerald-700 font-bold">{stat.converted_count} Lead</strong></span>
                    <span>Tỷ lệ chốt: <strong className="text-blue-700 font-bold">{stat.conversion_rate.toFixed(1)}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
