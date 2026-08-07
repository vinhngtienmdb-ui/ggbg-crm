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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const kpiPct = 88.5;

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
              <p className="text-sm font-bold text-emerald-400 tabular-numbers">{kpiPct}% — Đạt Mục Tiêu</p>
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
          value={formatVND(3_480_000_000)}
          sub={<><ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so tháng trước</>}
          icon={<DollarSign className="w-4 h-4" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
          href="/leads" hrefLabel="Phễu CRM"
        />
        <MetricCard
          label="Nhân Sự & Quy Mô"
          value="48 Nhân Sự"
          sub="Active: 94% · Thử việc: 6%"
          subColor="text-slate-500"
          icon={<Briefcase className="w-4 h-4" />}
          iconBg="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          href="/hrm" hrefLabel="HRM"
        />
        <MetricCard
          label="Chỉ Tiêu KPIs"
          value="7 Chỉ Tiêu"
          sub="3 KPI Vượt Chỉ Tiêu"
          subColor="text-indigo-600 dark:text-indigo-400"
          icon={<TrendingUp className="w-4 h-4" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
          href="/kpis" hrefLabel="KPIs"
        />
        <MetricCard
          label="Bảng Lương P3 Tháng"
          value={formatVND(485_000_000)}
          sub="Đã khóa & gửi Paystub"
          subColor="text-emerald-600 dark:text-emerald-400"
          icon={<PieChart className="w-4 h-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
          href="/payroll" hrefLabel="Bảng Lương"
        />
      </div>

      {/* ── BI Analytics Panel ── */}
      <Card accent="primary">
        <CardHeader
          actions={<Badge variant="success" dot>Khỏe Mạnh</Badge>}
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
                CAC, LTV, Retention Rate & ROI Kênh Marketing
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { label: 'CAC (Chi phí Thu Hái)', value: formatVND(3_250_000), sub: '📉 -12.5% so tháng trước', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'LTV (Giá Trị Trọn Đời)', value: formatVND(185_000_000), sub: '📈 +24.1% YoY', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Retention / Churn', value: '94.2% / 5.8%', sub: 'Tỷ lệ duy trì KH vượt trội', color: 'text-slate-700 dark:text-slate-300' },
              { label: 'ROI Quảng Cáo TB', value: '440% ROI', sub: 'Top: Referral (650%)', color: 'text-emerald-600 dark:text-emerald-400' },
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
                <PipelineBar label="1. Lead Mới Tiếp Nhận" count={142} amount={formatCompact(850_000_000) + ' ₫'} pct={70} color="text-indigo-600 dark:text-indigo-400" />
                <PipelineBar label="2. Khảo Sát Gian Hàng" count={86}  amount={formatCompact(1_420_000_000) + ' ₫'} pct={55} color="text-amber-600 dark:text-amber-400" />
                <PipelineBar label="3. Báo Giá & Kế Hoạch" count={45}  amount={formatCompact(980_000_000) + ' ₫'} pct={40} color="text-indigo-600 dark:text-indigo-400" />
                <PipelineBar label="4. Chốt HĐ & Vận Hành" count={32}  amount={formatCompact(1_150_000_000) + ' ₫'} pct={85} color="text-emerald-600 dark:text-emerald-400" />
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
                  {[
                    { name: 'Thời Trang An An', platform: 'Shopee Mall', service: 'Vận hành Trọn Gói', sale: 'Trần Văn Hoàng', status: 'Đang VH', variant: 'success' as const },
                    { name: 'Beauty Glow',       platform: 'TikTok Shop', service: 'Livestream & KOC',   sale: 'Lê Thị Mai',    status: 'Khởi Tạo', variant: 'primary' as const },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColor(row.name)}`}>
                            {getInitials(row.name)}
                          </div>
                          <span className="truncate max-w-[120px]">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{row.platform}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{row.service}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{row.sale}</td>
                      <td className="px-5 py-3"><Badge variant={row.variant} dot size="sm">{row.status}</Badge></td>
                    </tr>
                  ))}
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
              <div className="space-y-2">
                {[
                  { name: 'Phạm Minh Đức', phone: '0912 **** 889', note: 'Tư vấn gói Shopee', duration: '3:12' },
                  { name: 'Nguyễn Thị Lan', phone: '0934 **** 112', note: 'Hỗ trợ TikTok Shop', duration: '1:45' },
                ].map((call) => (
                  <div key={call.name} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{call.name} → {call.phone}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{call.note} · {call.duration}</p>
                    </div>
                    <button className="shrink-0 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1 text-[10px] transition-colors">
                      <Play className="w-3 h-3 fill-emerald-600 dark:fill-emerald-400" /> Nghe
                    </button>
                  </div>
                ))}
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
              <div className="space-y-2.5">
                {[
                  { rank: 1, name: 'Trần Văn Hoàng', team: 'Đội 1', revenue: 620_000_000, pct: 124, badge: 'Top 1' },
                  { rank: 2, name: 'Lê Thị Mai',     team: 'Đội 3', revenue: 540_000_000, pct: 108, badge: 'Top 2' },
                  { rank: 3, name: 'Nguyễn Đức Anh', team: 'Đội 2', revenue: 490_000_000, pct: 98,  badge: 'Top 3' },
                ].map(({ rank, name, team, revenue, pct, badge }) => (
                  <div key={name} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${rank === 1 ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'}`}>
                    <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ${rank === 1 ? 'bg-amber-500 text-white' : rank === 2 ? 'bg-slate-400 text-white' : 'bg-orange-400 text-white'}`}>
                      {rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{name} ({team})</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-numbers">
                        {formatCompact(revenue)} ₫ · Đạt {pct}%
                      </p>
                    </div>
                    <Badge variant={rank === 1 ? 'warning' : 'default'} size="sm">{badge}</Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}
