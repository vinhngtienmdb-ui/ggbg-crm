'use client';

import React from 'react';
import {
  Users, TrendingUp, DollarSign, PhoneCall,
  ArrowUpRight, Award, ChevronRight,
  Play, Layers, Briefcase, FileText,
  BarChart3, PieChart, ShieldCheck, PlusCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Badge } from '@/components/ui';
import { formatVND, formatCompact, avatarColor, getInitials } from '@/lib/ui';

// ── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string;
  sub: React.ReactNode;
  subColor?: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  hrefLabel: string;
}

function MetricCard({ label, value, sub, subColor = 'text-emerald-600 dark:text-emerald-400', icon, iconBg, href, hrefLabel }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm card-hover space-y-2.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg border ${iconBg}`}>{icon}</div>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className={`flex items-center gap-1 font-semibold ${subColor}`}>{sub}</span>
        <Link href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold">
          {hrefLabel} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ── Pipeline Bar ──────────────────────────────────────────────────────────────
const PIPELINE_BAR_COLORS: Record<string, string> = {
  'text-indigo-600 dark:text-indigo-400': 'bg-indigo-500',
  'text-amber-600 dark:text-amber-400':   'bg-amber-500',
  'text-emerald-600 dark:text-emerald-400': 'bg-emerald-500',
  'text-red-600 dark:text-red-400': 'bg-red-500',
};

function PipelineBar({ label, count, amount, pct, color }: { label: string; count: number; amount: string; pct: number; color: string }) {
  const barColor = PIPELINE_BAR_COLORS[color] ?? 'bg-indigo-500';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-700 dark:text-slate-300 truncate flex-1">{label} • <span className="tabular-nums">{count}</span></span>
        <span className={`tabular-nums ml-2 shrink-0 ${color}`}>{amount}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

import { getEmployees } from '@/lib/hrmStore';
import { getKPIs } from '@/lib/kpiStore';
import { getFinancialSummary } from '@/lib/financeStore';

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const employees = getEmployees();
  const kpis = getKPIs();
  const finSummary = getFinancialSummary();

  const totalRevenue = finSummary.total_gross_revenue || 0;
  const totalPayroll = finSummary.total_net_profit || 0;
  const kpiCount = kpis.length;
  const passedKpis = kpis.filter(k => (k.progress_percentage || 0) >= 100).length;
  const kpiPct = kpiCount > 0 ? Math.round((passedKpis / kpiCount) * 100) : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-sm border border-slate-800 p-5 md:p-6">
        {/* Subtle glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-transparent pointer-events-none" />
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-500 rounded-t-xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trung Tâm Điều Hành · GGBingo CRM Enterprise</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
              Tổng Quan Vận Hành, Doanh Số & Nhân Sự 360°
            </h1>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              Điều hành Gian hàng TMĐT (Shopee, TikTok Shop, Lazada, Amazon), Nhân sự 3P, KPIs & Bảng Lương P3.
            </p>
          </div>

          {/* KPI Donut */}
          <div className="flex items-center gap-3.5 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 shrink-0">
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Tiến độ KPI Tháng</p>
              <p className="text-sm font-bold text-emerald-400 tabular-numbers">{kpiPct}% — {kpiCount > 0 ? 'Đang Thực Hiện' : 'Sẵn Sàng Nhập Liệu'}</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-emerald-500/30"
              style={{ background: `conic-gradient(#10B981 0 ${kpiPct}%, #374151 ${kpiPct}% 100%)` }}
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-emerald-400">
                {Math.round(kpiPct)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Launcher ── */}
      <Card padding="none">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Thao Tác Nhanh
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { href: '/leads',     label: 'Tạo Lead Mới',       icon: <PlusCircle className="w-3.5 h-3.5" />, cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60' },
              { href: '/proposals', label: 'Nộp Phiếu Phê Duyệt', icon: <FileText   className="w-3.5 h-3.5" />, cls: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/60' },
              { href: '/customers', label: 'Khách Hàng 360°',     icon: <Users      className="w-3.5 h-3.5" />, cls: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' },
            ].map(({ href, label, icon, cls }) => (
              <Link key={href} href={href} className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${cls}`}>
                {icon} {label}
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Doanh Số Dịch Vụ"
          value={formatVND(totalRevenue)}
          sub={<><ArrowUpRight className="w-3.5 h-3.5" /> 0đ tháng này</>}
          icon={<DollarSign className="w-4 h-4" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
          href="/leads" hrefLabel="Phễu CRM"
        />
        <MetricCard
          label="Nhân Sự & Quy Mô"
          value={`${employees.length} Nhân Sự`}
          sub={`Super Admin: ${employees.length}`}
          subColor="text-slate-500"
          icon={<Briefcase className="w-4 h-4" />}
          iconBg="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          href="/hrm" hrefLabel="HRM"
        />
        <MetricCard
          label="Chỉ Tiêu KPIs"
          value={`${kpiCount} Chỉ Tiêu`}
          sub={`${passedKpis} KPI Đạt`}
          subColor="text-indigo-600 dark:text-indigo-400"
          icon={<TrendingUp className="w-4 h-4" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
          href="/kpis" hrefLabel="KPIs"
        />
        <MetricCard
          label="Bảng Lương P3 Tháng"
          value={formatVND(totalPayroll)}
          sub="Chưa phát sinh chi phí"
          subColor="text-emerald-600 dark:text-emerald-400"
          icon={<PieChart className="w-4 h-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
          href="/payroll" hrefLabel="Bảng Lương"
        />
      </div>

      {/* ── BI Analytics Panel ── */}
      <Card accent="primary">
        <CardHeader
          actions={<Badge variant="success" dot>Hệ Thống Sạch</Badge>}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Executive BI Analytics · Chỉ Số Sức Khỏe Doanh Nghiệp 360°
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                CAC, LTV, Retention Rate & ROI Kênh Marketing (Cập nhật real-time khi có giao dịch)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { label: 'CAC (Chi phí Thu Hái)', value: formatVND(0), sub: 'Chưa có dữ liệu', color: 'text-slate-500' },
              { label: 'LTV (Giá Trị Trọn Đời)', value: formatVND(0), sub: 'Chưa có dữ liệu', color: 'text-slate-500' },
              { label: 'Retention / Churn', value: '0% / 0%', sub: 'Chưa phát sinh KH', color: 'text-slate-500' },
              { label: 'ROI Quảng Cáo TB', value: '0% ROI', sub: 'Chưa phát sinh Ads', color: 'text-slate-500' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px] tracking-wide">{label}</span>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className={`text-[11px] font-semibold ${color}`}>{sub}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Pipeline + Customers Table */}
        <div className="lg:col-span-2 space-y-5">

          {/* Pipeline */}
          <Card>
            <CardHeader actions={
              <Link href="/leads" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }>
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Phễu Chuyển Đổi CRM & Gian Hàng TMĐT
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  Giá trị cơ hội ở từng giai đoạn
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <PipelineBar label="1. Lead Mới Tiếp Nhận" count={0} amount="0 ₫" pct={0} color="text-indigo-600 dark:text-indigo-400" />
                <PipelineBar label="2. Khảo Sát Gian Hàng" count={0}  amount="0 ₫" pct={0} color="text-amber-600 dark:text-amber-400" />
                <PipelineBar label="3. Báo Giá & Kế Hoạch" count={0}  amount="0 ₫" pct={0} color="text-indigo-600 dark:text-indigo-400" />
                <PipelineBar label="4. Chốt HĐ & Vận Hành" count={0}  amount="0 ₫" pct={0} color="text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardBody>
          </Card>

          {/* Recent Customers */}
          <Card>
            <CardHeader actions={
              <Link href="/customers" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Khách Hàng Ký Hợp Đồng Gần Đây
              </h3>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3">Khách Hàng</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Sàn TMĐT</th>
                    <th className="px-4 py-3 hidden md:table-cell">Gói Dịch Vụ</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Sale Phụ Trách</th>
                    <th className="px-5 py-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-medium">
                      Chưa có hợp đồng khách hàng nào. Sẵn sàng nhập liệu mới.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: VoIP + Leaderboard */}
        <div className="space-y-5">

          {/* VoIP */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Cuộc Gọi VoIP Gần Đây
              </h3>
            </CardHeader>
            <CardBody>
              <div className="p-6 text-center text-slate-400 text-xs font-medium">
                Chưa phát sinh cuộc gọi tư vấn VoIP.
              </div>
            </CardBody>
          </Card>

          {/* Sales Leaderboard */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Thành Tích Doanh Số Tháng
              </h3>
            </CardHeader>
            <CardBody>
              <div className="p-6 text-center text-slate-400 text-xs font-medium">
                Chưa có dữ liệu xếp hạng doanh số tháng này.
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}
