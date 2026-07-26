'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Send,
  CheckCircle2,
  PieChart,
  Calendar,
  Building2,
  Clock,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Wallet,
  Percent,
  Receipt,
  Trophy,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { INITIAL_PL_DATA, INITIAL_DEBT_INVOICES, getFinancialSummary, getFinanceDashboardData } from '@/lib/financeStore';
import { ContractProfitLoss, DebtInvoice } from '@/types/finance';

const CHART_COLORS = ['#2E5CE6', '#1F7A33', '#D97706', '#C22F35', '#7C3AED', '#0E7490'];
const DEBT_COLORS: Record<string, string> = {
  ON_TIME: '#1F7A33',
  DUE_SOON: '#D97706',
  OVERDUE: '#C22F35',
};

const compactVnd = (n: number) => {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} tr`;
  return n.toLocaleString('vi-VN');
};

export default function FinancePage() {
  const [plStatements, setPlStatements] = useState<ContractProfitLoss[]>(INITIAL_PL_DATA);
  const [debtInvoices, setDebtInvoices] = useState<DebtInvoice[]>(INITIAL_DEBT_INVOICES);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'P_L' | 'DEBT'>('DASHBOARD');
  const [toastMessage, setToastMessage] = useState('');

  const summary = getFinancialSummary(plStatements, debtInvoices);
  const dashboard = useMemo(
    () => getFinanceDashboardData(plStatements, debtInvoices),
    [plStatements, debtInvoices]
  );

  // Đồng bộ dữ liệu từ API khi mount (dual-mode: Supabase hoặc in-memory phía server).
  // Nếu lỗi/empty (vd. không đủ quyền DIRECTOR) → giữ INITIAL để không nhấp nháy giao diện.
  useEffect(() => {
    let active = true;
    fetch('/api/finance')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && data.data) {
          if (Array.isArray(data.data.pl_statements) && data.data.pl_statements.length > 0) {
            setPlStatements(data.data.pl_statements as ContractProfitLoss[]);
          }
          if (Array.isArray(data.data.debt_invoices) && data.data.debt_invoices.length > 0) {
            setDebtInvoices(data.data.debt_invoices as DebtInvoice[]);
          }
        }
      })
      .catch(() => {
        /* fallback: giữ INITIAL */
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSendReminder = async (inv: DebtInvoice, channel: string) => {
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_DEBT_REMINDER',
          invoice_id: inv.id,
          channel: channel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDebtInvoices((prev) =>
          prev.map((item) =>
            item.id === inv.id
              ? {
                  ...item,
                  reminder_sent_count: item.reminder_sent_count + 1,
                  last_reminder_at: new Date().toLocaleString('vi-VN'),
                }
              : item
          )
        );

        setToastMessage(`🎉 ${data.message}`);
        setTimeout(() => setToastMessage(''), 5000);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-lg bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-emerald-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Hero */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(46,92,230,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10.5px] font-bold mb-2.5">
              <PieChart className="w-3.5 h-3.5 text-blue-600" />
              <span>Financial & P&L Analytics Engine</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-blue-700">
              Báo Cáo Tài Chính, Lợi Nhuận Gộp P&L & Quản Lý Công Nợ
            </h1>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
              Phân tích tỷ suất lợi nhuận gộp từng hợp đồng vận hành TMĐT và theo dõi kỳ thu phí nợ dịch vụ.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-blue-100 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> 📊 Dashboard Tài Chính
            </button>
            <button
              onClick={() => setActiveTab('P_L')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'P_L' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-blue-100 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" /> Báo Cáo P&L
            </button>
            <button
              onClick={() => setActiveTab('DEBT')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'DEBT' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-blue-100 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Quản Lý Công Nợ
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Doanh Thu Hoa Hồng</span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers">{summary.total_gross_revenue.toLocaleString('vi-VN')} ₫</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Hoa hồng % GMV Shopee / TikTok Shop</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lợi Nhuận Gộp (Net Profit)</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-700 tabular-numbers">{summary.total_net_profit.toLocaleString('vi-VN')} ₫</p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tỷ suất lợi nhuận: {summary.avg_profit_margin}%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Công Nợ Quá Hạn</span>
            <div className="p-1.5 rounded-md bg-red-50 text-red-600 border border-red-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-red-600 tabular-numbers">{summary.total_overdue_debt.toLocaleString('vi-VN')} ₫</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Cần tự động gửi nhắc nợ</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Số Hợp Đồng Active</span>
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers">{summary.contracts_count} Hợp Đồng</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">100% Khách hàng doanh nghiệp B2B</p>
        </div>
      </div>

      {/* TAB 0: DASHBOARD TÀI CHÍNH */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-5">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {[
              {
                label: 'Tổng Doanh Thu',
                value: `${compactVnd(dashboard.total_revenue)} ₫`,
                icon: <DollarSign className="w-4 h-4" />,
                accent: 'text-slate-900',
                iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
              },
              {
                label: 'Tổng Chi Phí',
                value: `${compactVnd(dashboard.total_cost)} ₫`,
                icon: <Wallet className="w-4 h-4" />,
                accent: 'text-amber-600',
                iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
              },
              {
                label: 'Lợi Nhuận Gộp',
                value: `${compactVnd(dashboard.gross_profit)} ₫`,
                icon: <TrendingUp className="w-4 h-4" />,
                accent: 'text-emerald-600',
                iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              },
              {
                label: 'Biên Lợi Nhuận',
                value: `${dashboard.profit_margin}%`,
                icon: <Percent className="w-4 h-4" />,
                accent: 'text-emerald-600',
                iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              },
              {
                label: 'Tổng Công Nợ Phải Thu',
                value: `${compactVnd(dashboard.total_receivable)} ₫`,
                icon: <Receipt className="w-4 h-4" />,
                accent: 'text-slate-900',
                iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
              },
              {
                label: 'Số Hóa Đơn Quá Hạn',
                value: `${dashboard.overdue_count} hóa đơn`,
                icon: <AlertTriangle className="w-4 h-4" />,
                accent: 'text-red-600',
                iconBg: 'bg-red-50 text-red-600 border-red-100',
              },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">{kpi.label}</span>
                  <div className={`p-1.5 rounded-md border ${kpi.iconBg}`}>{kpi.icon}</div>
                </div>
                <p className={`text-lg font-extrabold tabular-numbers ${kpi.accent}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row: Revenue/Cost/Profit + Debt Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Composed chart */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Doanh Thu · Chi Phí · Lợi Nhuận Theo Hợp Đồng
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 mb-4">
                So sánh theo từng mã hợp đồng vận hành TMĐT
              </p>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboard.contractChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis tickFormatter={(v) => compactVnd(Number(v))} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={52} />
                    <RTooltip
                      formatter={(v: number, name: string) => [`${Number(v).toLocaleString('vi-VN')} ₫`, name]}
                      labelFormatter={(label: string) => {
                        const row = dashboard.contractChart.find((r) => r.name === label);
                        return row ? `HD-${label} · ${row.fullName}` : label;
                      }}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" name="Doanh thu" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={34} />
                    <Bar dataKey="cost" name="Chi phí" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} maxBarSize={34} />
                    <Bar dataKey="profit" name="Lợi nhuận" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={34} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Debt structure pie */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600" /> Cơ Cấu Công Nợ
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 mb-2">
                Theo trạng thái thanh toán
              </p>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={dashboard.debtStructure}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {dashboard.debtStructure.map((entry) => (
                        <Cell key={entry.key} fill={DEBT_COLORS[entry.key]} />
                      ))}
                    </Pie>
                    <RTooltip
                      formatter={(v: number, _n: string, p: { payload?: { count?: number } }) => [
                        `${Number(v).toLocaleString('vi-VN')} ₫ (${p?.payload?.count ?? 0} hóa đơn)`,
                        'Giá trị',
                      ]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {dashboard.debtStructure.map((entry) => (
                  <div key={entry.key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: DEBT_COLORS[entry.key] }}></span>
                      <span className="font-medium text-slate-600">{entry.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 tabular-numbers">{compactVnd(entry.value)} ₫</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top contracts + Overdue alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Top contracts by profit */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" /> Top Hợp Đồng Theo Lợi Nhuận
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 mb-4">
                Xếp hạng lợi nhuận thuần từng hợp đồng
              </p>
              <div className="space-y-3">
                {dashboard.topContracts.map((c, idx) => {
                  const max = dashboard.topContracts[0]?.profit || 1;
                  const pct = Math.max(6, Math.round((c.profit / max) * 100));
                  const color = CHART_COLORS[idx % CHART_COLORS.length];
                  return (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-5 h-5 shrink-0 rounded-md text-white text-[10px] font-extrabold flex items-center justify-center"
                            style={{ backgroundColor: color }}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">{c.fullName}</span>
                        </div>
                        <span className="font-extrabold text-emerald-600 tabular-numbers shrink-0 ml-2">
                          {compactVnd(c.profit)} ₫
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-[10.5px] font-bold text-slate-500 w-12 text-right">{c.margin}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overdue alerts */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Cảnh Báo Công Nợ
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 mb-4">
                Hóa đơn quá hạn & sắp đến hạn cần xử lý
              </p>
              {dashboard.overdueAlerts.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4" /> Không có công nợ cần cảnh báo.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dashboard.overdueAlerts.map((inv) => {
                    const overdue = inv.payment_status === 'OVERDUE';
                    return (
                      <div
                        key={inv.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                          overdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${overdue ? 'text-red-800' : 'text-amber-800'}`}>
                            {inv.customer_name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 truncate">
                            {inv.invoice_code} · hạn {inv.due_date}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-extrabold tabular-numbers ${overdue ? 'text-red-600' : 'text-amber-600'}`}>
                            {compactVnd(inv.amount_due)} ₫
                          </p>
                          <span
                            className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                              overdue ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                            }`}
                          >
                            {overdue ? '⚠️ QUÁ HẠN' : '⏳ SẮP ĐẾN HẠN'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: P&L STATEMENTS TABLE */}
      {activeTab === 'P_L' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" /> Bảng Phân Tích Lợi Nhuận Gộp P&L Từng Hợp Đồng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Bóc tách doanh thu hoa hồng và chi phí Ops/Livestream/Booking KOC</p>
            </div>

            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-xs flex items-center gap-1.5 border border-slate-200">
              <Download className="w-3.5 h-3.5" /> Export Báo Cáo Excel
            </button>
          </div>

          <div className="overflow-x-auto touch-scroll sleek-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10.5px]">
                  <th className="p-3">Mã HĐ & Khách Hàng</th>
                  <th className="p-3">Sàn TMĐT</th>
                  <th className="p-3">GMV Hàng Tháng</th>
                  <th className="p-3">% Hoa Hồng</th>
                  <th className="p-3">Doanh Thu Thô</th>
                  <th className="p-3">Chi Phí Ops & Livestream</th>
                  <th className="p-3">Lợi Nhuận Thuần</th>
                  <th className="p-3">Tỷ Suất %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plStatements.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{item.company_name}</p>
                      <p className="text-[11px] text-blue-600 font-mono font-semibold">{item.contract_code} • {item.customer_name}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{item.ecom_platform}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 tabular-numbers">{item.monthly_gmv.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-3 font-bold text-blue-700">{item.commission_rate_percent}%</td>
                    <td className="p-3 font-mono font-bold text-slate-900 tabular-numbers">{item.gross_revenue.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-3 text-slate-600 font-mono">{(item.ops_cost + item.livestream_koc_cost + item.platform_tech_fee).toLocaleString('vi-VN')} ₫</td>
                    <td className="p-3 font-mono font-bold text-emerald-700 tabular-numbers">{item.net_profit.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-3 font-bold text-emerald-600">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[11px]">
                        {item.profit_margin_percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEBT INVOICES & AUTOMATED REMINDERS */}
      {activeTab === 'DEBT' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Theo Dõi Kỳ Thu Phí & Nhắc Nợ Tự Động
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Kích hoạt gửi Email SMTP / Telegram / Zalo ZNS nhắc nợ tự động</p>
            </div>
          </div>

          <div className="overflow-x-auto touch-scroll sleek-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10.5px]">
                  <th className="p-3">Mã Hóa Đơn & Khách Hàng</th>
                  <th className="p-3">Kỳ Thu Phí</th>
                  <th className="p-3">Số Tiền Phải Thu</th>
                  <th className="p-3">Hạn Thanh Toán</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3">Lần Nhắc Gần Nhất</th>
                  <th className="p-3 text-right">Kích Hoạt Nhắc Nợ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debtInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{inv.customer_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{inv.invoice_code} • {inv.contract_code}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{inv.billing_period}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 tabular-numbers">{inv.amount_due.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-3 font-mono text-slate-700">{inv.due_date}</td>
                    <td className="p-3">
                      {inv.payment_status === 'PAID' && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px]">
                          ✓ Đã Thanh Toán
                        </span>
                      )}
                      {inv.payment_status === 'UNPAID' && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px]">
                          ⏳ Chưa Thanh Toán
                        </span>
                      )}
                      {inv.payment_status === 'OVERDUE' && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded font-bold text-[10px]">
                          ⚠️ Quá Hạn Thanh Toán
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {inv.last_reminder_at ? `${inv.last_reminder_at} (${inv.reminder_sent_count} lần)` : 'Chưa gửi'}
                    </td>
                    <td className="p-3 text-right">
                      {inv.payment_status !== 'PAID' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendReminder(inv, 'EMAIL_SMTP')}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3 text-blue-600" /> Email
                          </button>
                          <button
                            onClick={() => handleSendReminder(inv, 'TELEGRAM_BOT')}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3 text-purple-600" /> Telegram
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium italic">Không cần nhắc</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
