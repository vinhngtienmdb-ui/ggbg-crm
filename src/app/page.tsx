'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  PhoneCall,
  ArrowUpRight,
  ShoppingBag,
  UserCheck,
  Play,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_LEADS } from '@/lib/leadStore';
import { INITIAL_CUSTOMERS } from '@/lib/customerStore';

import {
  PIPELINE_STAGES,
  PLATFORM_CHIP,
  TIER_CHIP,
  fmtCompact,
  fmtVnd,
} from '@/lib/uiFormat';
import { useToast } from '@/context/ToastContext';
/** Widest funnel bar corresponds to this much pipeline value. */
const FUNNEL_SCALE = 500_000_000;

const METRICS = [
  {
    label: 'Doanh số dịch vụ',
    value: '3,48 tỷ ₫',
    sub: 'Tăng 18,4% so với tháng trước',
    subTone: 'text-success-fg',
    Icon: DollarSign,
    iconBg: 'bg-brand-300 text-brand-600',
    trend: true,
  },
  {
    label: 'Gian hàng active',
    value: '1.240',
    sub: 'Shopee 520 · TikTok 480 · Lazada 240',
    subTone: 'text-ink-500',
    Icon: ShoppingBag,
    iconBg: 'bg-plum-bg text-plum-fg',
    trend: false,
  },
  {
    label: 'Lead mới tiếp nhận',
    value: '458',
    sub: 'Tự động phân bổ nhân sự',
    subTone: 'text-success-fg',
    Icon: UserCheck,
    iconBg: 'bg-warn-bg text-warn-fg',
    trend: false,
    live: true,
  },
  {
    label: 'Phút gọi VoIP',
    value: '12.450',
    sub: 'Tỷ lệ nghe máy 84,2% · Ghi âm tự động',
    subTone: 'text-ink-500',
    Icon: PhoneCall,
    iconBg: 'bg-success-bg text-success-fg',
    trend: false,
  },
] as const;

const RECENT_CALLS = [
  { who: 'Phạm Minh Đức → 0912 *** 889', meta: 'Tư vấn gói Shopee · 3 phút 12 giây' },
  { who: 'Lê Thị Mai → 0977 *** 555', meta: 'Báo giá LazMall Enterprise · 6 phút 40 giây' },
  { who: '0936 *** 333 → Tổng đài (Inbound)', meta: 'Hỏi quy trình KYC gian hàng · 2 phút 05 giây' },
];

const LEADERBOARD = [
  { name: 'Trần Văn Hoàng (Đội 1)', revenue: 620_000_000, pct: 124 },
  { name: 'Lê Thị Mai (Đội 3)', revenue: 264_000_000, pct: 88 },
  { name: 'Nguyễn Quốc Tuấn (Đội 2)', revenue: 198_000_000, pct: 75 },
];

const KPI_PROGRESS = 87;

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const funnel = useMemo(
    () =>
      PIPELINE_STAGES.map((stage) => {
        const stageLeads = INITIAL_LEADS.filter((l) => l.stage_id === stage.id);
        const sum = stageLeads.reduce((acc, l) => acc + l.estimated_budget, 0);
        return {
          ...stage,
          count: stageLeads.length,
          sum,
          pct: Math.max(4, Math.min(100, Math.round((sum / FUNNEL_SCALE) * 100))),
        };
      }),
    [],
  );

  const topCustomers = useMemo(
    () => [...INITIAL_CUSTOMERS].sort((a, b) => b.ltv_total_spent - a.ltv_total_spent).slice(0, 4),
    [],
  );

  return (
    <div className="flex flex-col gap-4 animate-fadeUp">
      {/* Hero banner ---------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-[14px] border border-brand-100 bg-gradient-to-br from-brand-50 to-white px-6 py-[22px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(46,92,230,.12), transparent 70%)' }}
        />

        {/* The copy block and the KPI tile are separate flex children so long
            descriptions wrap instead of running underneath the tile. */}
        <div className="relative flex flex-wrap items-center gap-[18px]">
          <div className="min-w-[240px] flex-1">
            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-100 px-2.5 py-[3px] text-[10.5px] font-bold text-brand-800">
              <Sparkles className="h-3 w-3" />
              GGBINGO SYSTEM OVERVIEW
            </span>
            <h1 className="text-xl font-extrabold tracking-[-0.4px] text-brand-800">Tổng quan hệ thống</h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-500">
              Dịch vụ ủy quyền vận hành gian hàng TMĐT (Shopee, TikTok Shop, Lazada, Amazon) và nền tảng
              GGBingoVN.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3.5 rounded-xl border border-brand-100 bg-white px-4 py-3">
            <div>
              <p className="text-[10.5px] font-semibold text-ink-500">TIẾN ĐỘ KPI THÁNG 07</p>
              <p className="dc-num text-[19px] font-extrabold text-success-fg">{KPI_PROGRESS.toFixed(1)}%</p>
              <p className="text-[10.5px] text-ink-500">3,48 tỷ / 4,0 tỷ ₫</p>
            </div>
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#2FA84F 0 ${KPI_PROGRESS}%, #E4E7EC ${KPI_PROGRESS}% 100%)`,
              }}
            >
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-success-fg">
                {KPI_PROGRESS}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metric cards --------------------------------------------------- */}
      <section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(215px,1fr))]">
        {METRICS.map((m) => (
          <div key={m.label} className="dc-card card-hover p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.7px] text-ink-500">
                {m.label}
              </span>
              <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${m.iconBg}`}>
                <m.Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="dc-num text-[19px] font-extrabold tracking-[-0.3px] text-ink-900">{m.value}</p>
            <p className={`mt-1 flex items-center gap-1.5 text-[11.5px] font-semibold ${m.subTone}`}>
              {m.trend && <ArrowUpRight className="h-3.5 w-3.5" />}
              {'live' in m && m.live && (
                <span className="h-1.5 w-1.5 rounded-full bg-success-dot animate-softPulse" />
              )}
              {m.sub}
            </p>
          </div>
        ))}
      </section>

      {/* Two-column body ------------------------------------------------ */}
      <section className="grid items-start gap-4 lg:[grid-template-columns:1.9fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Sales funnel */}
          <div className="dc-card px-5 py-[18px]">
            <div className="mb-3.5 flex items-center justify-between border-b border-line-soft pb-3">
              <div>
                <h2 className="dc-card-title">Phễu bán hàng</h2>
                <p className="dc-card-sub">Giá trị cơ hội kinh doanh theo từng giai đoạn</p>
              </div>
              <button
                onClick={() => router.push('/leads')}
                className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-[11.5px] font-bold text-brand-600 transition-colors hover:bg-brand-100"
              >
                Mở phễu <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-[11px]">
              {funnel.map((f) => (
                <div key={f.id}>
                  <div className="mb-1 flex justify-between text-[11.5px] font-semibold">
                    <span className="text-ink-700">
                      {f.name} · {f.count} lead
                    </span>
                    <span className="dc-num font-extrabold text-ink-900">{fmtCompact(f.sum)}</span>
                  </div>
                  <div className="dc-bar h-[7px]">
                    <span style={{ width: `${f.pct}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-value customers */}
          <div className="dc-card px-5 py-[18px]">
            <h2 className="dc-card-title mb-3">Khách Hàng Giá Trị Cao</h2>
            <div className="overflow-x-auto">
              <table className="dc-table">
                <thead>
                  <tr>
                    <th className="dc-th pl-0">Khách hàng</th>
                    <th className="dc-th">Sàn</th>
                    <th className="dc-th">Hạng</th>
                    <th className="dc-th pr-0 text-right">LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((c) => {
                    const tier = TIER_CHIP[c.tier];
                    return (
                      <tr
                        key={c.id}
                        onClick={() => router.push('/customers')}
                        className="dc-row cursor-pointer"
                      >
                        <td className="dc-td pl-0">
                          <p className="font-bold text-ink-900">{c.company_name}</p>
                          <p className="text-[10.5px] text-ink-500">{c.owner_name}</p>
                        </td>
                        <td className="dc-td text-ink-700">
                          {c.ecom_platforms.map((p) => PLATFORM_CHIP[p].label).join(' · ')}
                        </td>
                        <td className="dc-td">
                          <span
                            className="dc-chip"
                            style={{ background: tier.bg, color: tier.fg }}
                          >
                            {c.tier}
                          </span>
                        </td>
                        <td className="dc-td dc-num pr-0 text-right font-extrabold text-ink-900">
                          {fmtCompact(c.ltv_total_spent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Call centre */}
          <div className="dc-card px-[18px] py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-extrabold text-ink-900">
                <PhoneCall className="h-4 w-4 text-success-fg" />
                Cuộc Gọi Tổng Đài
              </h2>
              <span className="h-[7px] w-[7px] rounded-full bg-success-dot animate-softPulse" />
            </div>

            <div className="flex flex-col gap-2">
              {RECENT_CALLS.map((call) => (
                <div
                  key={call.who}
                  className="flex items-center justify-between gap-2 rounded-[9px] border border-line-softer bg-surface-subtle px-[11px] py-[9px]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-bold text-ink-900">{call.who}</p>
                    <p className="text-[10.5px] text-ink-500">{call.meta}</p>
                  </div>
                  <button
                    onClick={() => showToast('▶ Đang phát ghi âm cuộc gọi (Cloudflare R2)…')}
                    className="dc-btn-success dc-btn-xs shrink-0"
                  >
                    <Play className="h-3 w-3" /> Ghi âm
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sales leaderboard */}
          <div className="dc-card px-[18px] py-4">
            <h2 className="mb-3 text-[13px] font-extrabold text-ink-900">🏆 Bảng Vàng Doanh Số Tháng</h2>

            <div className="flex flex-col gap-2">
              {LEADERBOARD.map((row, i) => {
                const isTop = i === 0;
                const onTarget = row.pct >= 100;
                return (
                  <div
                    key={row.name}
                    className={`flex items-center gap-2.5 rounded-[9px] border px-[11px] py-[9px] ${
                      isTop ? 'border-gold-border bg-gold-bg' : 'border-line-softer bg-surface-subtle'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-[7px] text-[11px] font-extrabold ${
                        isTop ? 'bg-brand-600 text-white' : 'bg-line text-ink-700'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-bold text-ink-900">{row.name}</p>
                      <p className="dc-num text-[10.5px] text-ink-500">Doanh số: {fmtVnd(row.revenue)}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        onTarget ? 'bg-success-bg text-success-fg' : 'bg-brand-300 text-brand-600'
                      }`}
                    >
                      Đạt {row.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
