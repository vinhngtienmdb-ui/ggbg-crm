'use client';

import React from 'react';
import {
  BarChart3,
  X,
  PieChart,
  Zap,
  Send,
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
    <div className="fixed inset-0 z-50 flex justify-end bg-white">
      <div className="bg-white w-full max-w-lg h-full shadow-cardLg p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="font-bold text-base text-ink-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" /> Báo Cáo Hiệu Quả Kênh Lead Đa Kênh
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              Phân tích tỷ lệ chuyển đổi thành công & tổng ngân sách theo từng kênh Marketing
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-ink-400 hover:text-ink-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-brand-50 text-brand-800 rounded-2xl border border-line space-y-1">
            <p className="text-[10px] text-ink-400 font-bold uppercase">Tổng Lead Đa Kênh</p>
            <p className="text-xl font-extrabold text-brand-400">{totalLeadsCount}</p>
          </div>

          <div className="p-3.5 bg-success-bg text-success-fg rounded-2xl border border-success-border space-y-1">
            <p className="text-[10px] text-success-fg font-bold uppercase">Tỷ Lệ Chuyển Đổi</p>
            <p className="text-xl font-extrabold text-success-fg">{overallConversionRate}%</p>
          </div>

          <div className="p-3.5 bg-plum-bg text-plum-fg rounded-2xl border border-plum-border space-y-1">
            <p className="text-[10px] text-plum-fg font-bold uppercase">Tổng Ngân Sách</p>
            <p className="text-xs font-mono font-extrabold text-plum-fg pt-1">
              {(grandTotalBudget / 1000000).toFixed(0)}Tr ₫
            </p>
          </div>
        </div>

        {/* Trigger Test Webhook Ingest Button */}
        <div className="p-4 bg-gradient-to-r from-brand-50 to-white border border-brand-100 rounded-2xl flex items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-xs text-brand-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-600" /> Thử Nghiệm Bắn Lead Webhook Real-time
            </h4>
            <p className="text-[11px] text-brand-800 mt-0.5">
              Gửi thử nghiệm 1 Payload Webhook từ Landing Page vào phễu
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerTestWebhook}
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 flex items-center gap-1 shrink-0 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" /> Bắn Lead Webhook
          </button>
        </div>

        {/* Breakdown by Channels */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-ink-900 flex items-center gap-1.5 border-b border-line pb-2">
            <PieChart className="w-4 h-4 text-brand-600" /> Chi Tiết Hiệu Quả Theo Từng Kênh Nguồn ({channelStatsList.length} Kênh)
          </h4>

          <div className="space-y-3">
            {channelStatsList.map((stat) => {
              const percentage = totalLeadsCount > 0 ? ((stat.total_leads / totalLeadsCount) * 100).toFixed(1) : '0';

              return (
                <div key={stat.source_name} className="p-4 bg-surface-subtle border border-line rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-ink-900">{stat.source_name}</span>
                      <span className="ml-2 font-mono text-[11px] text-brand-800 font-bold">
                        {stat.total_leads} Lead ({percentage}%)
                      </span>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-success-fg">
                      {(stat.total_budget / 1000000).toLocaleString('vi-VN')} Tr ₫
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-500 pt-1">
                    <span>Đã chốt thành công: <strong className="text-success-fg font-bold">{stat.converted_count} Lead</strong></span>
                    <span>Tỷ lệ chốt: <strong className="text-brand-800 font-bold">{stat.conversion_rate.toFixed(1)}%</strong></span>
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
