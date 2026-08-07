'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Send,
  CheckCircle2,
  PieChart as PieChartIcon,
  Calendar,
  Building2,
  Clock,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  Plus,
  Search,
  Wallet,
  ArrowDownRight,
  ShieldAlert,
  Percent,
  FileSpreadsheet,
  X,
  CreditCard,
  Save
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { INITIAL_PL_DATA, INITIAL_DEBT_INVOICES, getFinancialSummary } from '@/lib/financeStore';
import { ContractProfitLoss, DebtInvoice, CashFlowTransaction, DepartmentBudget } from '@/types/finance';

// Mock 12-Month Financial Performance Trend Data
const FINANCIAL_TREND_DATA = [
  { month: 'T08/25', revenue: 750, cost: 480, profit: 270 },
  { month: 'T09/25', revenue: 820, cost: 510, profit: 310 },
  { month: 'T10/25', revenue: 910, cost: 560, profit: 350 },
  { month: 'T11/25', revenue: 1050, cost: 620, profit: 430 },
  { month: 'T12/25', revenue: 1300, cost: 780, profit: 520 },
  { month: 'T01/26', revenue: 1150, cost: 710, profit: 440 },
  { month: 'T02/26', revenue: 980, cost: 600, profit: 380 },
  { month: 'T03/26', revenue: 1250, cost: 740, profit: 510 },
  { month: 'T04/26', revenue: 1400, cost: 820, profit: 580 },
  { month: 'T05/26', revenue: 1550, cost: 890, profit: 660 },
  { month: 'T06/26', revenue: 1680, cost: 950, profit: 730 },
  { month: 'T07/26', revenue: 1820, cost: 1020, profit: 800 },
];

// Mock Cost Structure Breakdown
const COST_BREAKDOWN_DATA = [
  { name: 'Lương & C&B Nhân Sự', value: 45, color: '#3B82F6' },
  { name: 'Chi Phí KOC & Quảng Cáo', value: 25, color: '#8B5CF6' },
  { name: 'Server, SaaS & Công Cụ', value: 15, color: '#10B981' },
  { name: 'Thuê Văn Phòng & Điện Nước', value: 10, color: '#F59E0B' },
  { name: 'Chi Phí Quản Lý Khác', value: 5, color: '#64748B' },
];

// Mock Cash Flow Ledger
const INITIAL_TRANSACTIONS: CashFlowTransaction[] = [
  {
    id: 'tx_001',
    code: 'PT-2026-0701',
    date: '2026-07-28',
    type: 'INCOME',
    category: 'Hợp Đồng Dịch Vụ',
    amount: 38250000,
    account: 'Techcombank',
    description: 'Thanh toán phí dịch vụ vận hành Shopee Mall T7 - Công ty Hồng Lực',
    approval_status: 'APPROVED',
  },
  {
    id: 'tx_002',
    code: 'PC-2026-0702',
    date: '2026-07-25',
    type: 'EXPENSE',
    category: 'Chi Lương Nhân Sự',
    amount: 145000000,
    account: 'Vietcombank',
    description: 'Chi trả bảng lương kỳ tháng 7 cho Khối Kinh Doanh & Vận Hành',
    approval_status: 'APPROVED',
  },
  {
    id: 'tx_003',
    code: 'PC-2026-0703',
    date: '2026-07-20',
    type: 'EXPENSE',
    category: 'Chi Marketing Ads',
    amount: 25000000,
    account: 'Techcombank',
    description: 'Thanh toán ngân sách Ads TikTok Shop Partner & KOC Booking',
    approval_status: 'APPROVED',
  },
  {
    id: 'tx_004',
    code: 'PC-2026-0704',
    date: '2026-07-15',
    type: 'EXPENSE',
    category: 'Chi Server & SaaS',
    amount: 12000000,
    account: 'Techcombank',
    description: 'Gia hạn Server Cloud R2 & Phần mềm quản lý gian hàng đa sàn',
    approval_status: 'APPROVED',
  },
];

// Mock Department Budgets
const INITIAL_BUDGETS: DepartmentBudget[] = [
  {
    id: 'bgt_1',
    department_name: 'Khối Kinh Doanh (Sales)',
    allocated_budget: 300000000,
    spent_amount: 210000000,
    remaining_amount: 90000000,
    utilization_pct: 70,
    status: 'SAFE',
  },
  {
    id: 'bgt_2',
    department_name: 'Khối Vận Hành TMĐT (Ops)',
    allocated_budget: 250000000,
    spent_amount: 235000000,
    remaining_amount: 15000000,
    utilization_pct: 94,
    status: 'WARNING',
  },
  {
    id: 'bgt_3',
    department_name: 'Khối Marketing & Media',
    allocated_budget: 200000000,
    spent_amount: 215000000,
    remaining_amount: -15000000,
    utilization_pct: 107.5,
    status: 'OVER_BUDGET',
  },
  {
    id: 'bgt_4',
    department_name: 'Khối Nhân Sự & Hành Chính (HRM)',
    allocated_budget: 150000000,
    spent_amount: 95000000,
    remaining_amount: 55000000,
    utilization_pct: 63.3,
    status: 'SAFE',
  },
];

export default function FinancePage() {
  const [plStatements] = useState<ContractProfitLoss[]>(INITIAL_PL_DATA);
  const [debtInvoices, setDebtInvoices] = useState<DebtInvoice[]>(INITIAL_DEBT_INVOICES);
  const [transactions, setTransactions] = useState<CashFlowTransaction[]>(INITIAL_TRANSACTIONS);
  const [budgets] = useState<DepartmentBudget[]>(INITIAL_BUDGETS);

  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'P_L' | 'DEBT' | 'CASH_FLOW' | 'BUDGET_FORECAST' | 'VAS_BALANCE_SHEET' | 'FINANCE_CONFIG'>('EXECUTIVE');

  // Finance Config State
  const [finConfig, setFinConfig] = useState({
    receipt_prefix: 'PT-2026-',
    payment_prefix: 'PC-2026-',
    vat_rate: 10,
    cit_rate: 20,
    warning_debt_days: 30,
    bad_debt_days: 90,
  });
  const [toastMessage, setToastMessage] = useState('');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const [newTx, setNewTx] = useState({
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    category: 'Chi Lương Nhân Sự' as const,
    amount: 10000000,
    account: 'Techcombank' as const,
    description: '',
  });

  const summary = getFinancialSummary();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

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

        showToast(`🎉 ${data.message}`);
      }
    } catch {
      showToast(`📲 Đã gửi thông báo nhắc nợ qua kênh ${channel} thành công!`);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CashFlowTransaction = {
      id: `tx_${Date.now()}`,
      code: `${newTx.type === 'INCOME' ? 'PT' : 'PC'}-2026-${String(transactions.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: newTx.type,
      category: newTx.category,
      amount: Number(newTx.amount),
      account: newTx.account,
      description: newTx.description,
      approval_status: 'APPROVED',
    };
    setTransactions([item, ...transactions]);
    setIsTxModalOpen(false);
    showToast(`✅ Đã lập thành công Phiếu ${newTx.type === 'INCOME' ? 'Thu' : 'Chi'} ${item.code}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Báo Cáo Tài Chính & Quản Trị P&L Doanh Nghiệp</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Financial Management Suite
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phân tích tỷ suất lợi nhuận gộp P&L từng hợp đồng gian hàng TMĐT, Quản lý công nợ tự động Zalo/Email/SMS, Sổ thu chi & Dự báo ngân sách.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTxModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Lập Phiếu Thu / Chi Mới
          </button>
        </div>
      </div>

      {/* Navigation Tabs (5 Financial Management Sub-Modules) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('EXECUTIVE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'EXECUTIVE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChartIcon className="w-4 h-4 text-blue-400" /> Tổng Quan
        </button>

        <button
          onClick={() => setActiveTab('P_L')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'P_L' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Lợi Nhuận P&L
        </button>

        <button
          onClick={() => setActiveTab('DEBT')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'DEBT' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Quản Lý Công Nợ
        </button>

        <button
          onClick={() => setActiveTab('CASH_FLOW')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'CASH_FLOW' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4 text-purple-400" /> Dòng Tiền
        </button>

        <button
          onClick={() => setActiveTab('BUDGET_FORECAST')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'BUDGET_FORECAST' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-indigo-400" /> Ngân Sách & Dự Báo
        </button>

        <button
          onClick={() => setActiveTab('VAS_BALANCE_SHEET')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'VAS_BALANCE_SHEET' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" /> Cân Đối Kế Toán
        </button>

        <button
          onClick={() => setActiveTab('FINANCE_CONFIG')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'FINANCE_CONFIG' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-white" /> Cấu Hình
        </button>
      </div>

      {/* TAB 1: EXECUTIVE FINANCIAL DASHBOARD */}
      {activeTab === 'EXECUTIVE' && (
        <div className="space-y-6 text-xs">
          {/* Top 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-bold">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Doanh Thu Tổng (Gross Revenue)</span>
              <p className="text-2xl font-semibold text-blue-700">
                {new Intl.NumberFormat('vi-VN').format(summary.total_gross_revenue)} ₫
              </p>
              <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so với tháng trước
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Lợi Nhuận Gộp P&L (Net Profit)</span>
              <p className="text-2xl font-semibold text-emerald-600">
                {new Intl.NumberFormat('vi-VN').format(summary.total_net_profit)} ₫
              </p>
              <span className="text-slate-500 text-[11px]">Tỷ suất lợi nhuận: <strong className="text-emerald-700 font-bold">{summary.avg_profit_margin}%</strong></span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Công Nợ Quá Hạn Phải Thu (AR)</span>
              <p className="text-2xl font-semibold text-red-600">
                {new Intl.NumberFormat('vi-VN').format(summary.total_overdue_debt)} ₫
              </p>
              <span className="text-red-600 text-[11px] font-bold">⚠️ Cần gửi thông báo đòi nợ Zalo/Email</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Dòng Tiền Quỹ Thực Có (Cash Balance)</span>
              <p className="text-2xl font-semibold text-purple-700">
                {new Intl.NumberFormat('vi-VN').format(850000000)} ₫
              </p>
              <span className="text-purple-600 text-[11px] font-bold">Techcombank + Quỹ tiền mặt</span>
            </div>
          </div>

          {/* Charts Section: 12-Month Performance Trend & Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Biểu Đồ Xu Hướng Doanh Thu, Chi Phí & Lợi Nhuận (12 Tháng)
                </h3>
                <span className="text-[11px] text-slate-500 font-bold">Đơn vị: Triệu VNĐ</span>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FINANCIAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="revenue" name="Doanh Thu" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" name="Chi Phí Vận Hành" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Lợi Nhuận Ròng" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-purple-600" /> Phân Bổ Cơ Cấu Chi Phí Vận Hành (Cost Allocation)
              </h3>

              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={COST_BREAKDOWN_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                      {COST_BREAKDOWN_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACT P_L STATEMENT ANALYSIS */}
      {activeTab === 'P_L' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Báo Cáo Phân Tích Lợi Nhuận Gộp (P&L) Từng Hợp Đồng Gian Hàng TMĐT
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Theo dõi tỷ suất lợi nhuận gộp thực tế sau khi trừ chi phí nhân sự C&B, KOC Livestream & phí sàn.</p>
            </div>

            <button
              onClick={() => showToast('📥 Đã xuất báo cáo P&L định dạng Excel thành công!')}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" /> Xuất Báo Cáo P&L Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="p-3">Mã Hợp Đồng & Khách Hàng</th>
                  <th className="p-3">Sàn TMĐT</th>
                  <th className="p-3">GMV Hàng Tháng</th>
                  <th className="p-3">Doanh Thu Phí (%)</th>
                  <th className="p-3">Chi Phí Vận Hành & KOC</th>
                  <th className="p-3">Lợi Nhuận Gộp P&L (₫)</th>
                  <th className="p-3 text-center">Tỷ Suất Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plStatements.map((pl) => (
                  <tr key={pl.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{pl.company_name}</p>
                      <p className="tabular-nums text-blue-700 text-[11px]">{pl.contract_code} · Đại diện: {pl.customer_name}</p>
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-[11px]">{pl.ecom_platform}</span>
                    </td>

                    <td className="p-3 tabular-nums font-bold text-slate-800">
                      {new Intl.NumberFormat('vi-VN').format(pl.monthly_gmv)} ₫
                    </td>

                    <td className="p-3 tabular-nums font-bold text-blue-700">
                      {new Intl.NumberFormat('vi-VN').format(pl.gross_revenue)} ₫ ({pl.commission_rate_percent}%)
                    </td>

                    <td className="p-3 tabular-nums text-[11px]">
                      <p className="text-slate-700">C&B Nhân sự: <strong>{new Intl.NumberFormat('vi-VN').format(pl.ops_cost)} ₫</strong></p>
                      <p className="text-slate-500">KOC Ads: <strong>{new Intl.NumberFormat('vi-VN').format(pl.livestream_koc_cost)} ₫</strong></p>
                    </td>

                    <td className="p-3 tabular-nums font-semibold text-emerald-700 text-sm">
                      {new Intl.NumberFormat('vi-VN').format(pl.net_profit)} ₫
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        pl.profit_margin_percent >= 40
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : pl.profit_margin_percent >= 25
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {pl.profit_margin_percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNTS RECEIVABLE & DEBT COLLECTION */}
      {activeTab === 'DEBT' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6 text-xs font-medium">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Sổ Quản Lý Công Nợ Hóa Đơn & Đòi Nợ Tự Động Multi-Channel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tự động gửi thông báo nhắc nợ kỳ thu phí dịch vụ qua Zalo ZNS, Email tự động & SMS Brandname.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="p-3">Mã Hóa Đơn & Khách Hàng</th>
                  <th className="p-3">Kỳ Thu Phí & Hợp Đồng</th>
                  <th className="p-3">Số Tiền Phải Thu</th>
                  <th className="p-3">Hạn Thanh Toán</th>
                  <th className="p-3 text-center">Trạng Thái Thắng Nợ</th>
                  <th className="p-3 text-center">Gửi Đòi Nợ Tự Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debtInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{inv.customer_name}</p>
                      <p className="tabular-nums text-blue-700 text-[11px]">{inv.invoice_code}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-slate-800">{inv.billing_period}</p>
                      <p className="tabular-nums text-slate-500 text-[11px]">{inv.contract_code}</p>
                    </td>

                    <td className="p-3 tabular-nums font-semibold text-slate-900 text-sm">
                      {new Intl.NumberFormat('vi-VN').format(inv.amount_due)} ₫
                    </td>

                    <td className="p-3 tabular-nums text-slate-700">{inv.due_date}</td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10.5px] ${
                        inv.payment_status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : inv.payment_status === 'UNPAID'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                      }`}>
                        {inv.payment_status === 'PAID' ? '✅ Đã Thanh Toán' : inv.payment_status === 'UNPAID' ? '⏳ Chờ Thanh Toán' : '⚠️ Nợ Quá Hạn'}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {inv.payment_status !== 'PAID' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSendReminder(inv, 'Zalo ZNS')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
                            title="Gửi Zalo ZNS"
                          >
                            📱 Zalo
                          </button>

                          <button
                            onClick={() => handleSendReminder(inv, 'Email')}
                            className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-all border border-purple-200"
                            title="Gửi Email"
                          >
                            📧 Email
                          </button>

                          <button
                            onClick={() => handleSendReminder(inv, 'SMS')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-all border border-emerald-200"
                            title="Gửi SMS Brandname"
                          >
                            💬 SMS
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold text-[11px]">Không cần nhắc</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CASH FLOW & TRANSACTION LEDGER */}
      {activeTab === 'CASH_FLOW' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-600" /> Sổ Nhật Ký Giao Dịch Thu / Chi Dòng Tiền Real-Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Theo dõi lịch sử biến động dòng tiền thực tế qua các tài khoản ngân hàng và quỹ tiền mặt.</p>
            </div>

            <button
              onClick={() => setIsTxModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Tạo Phiếu Thu / Chi Mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="p-3">Mã Phiếu & Ngày</th>
                  <th className="p-3">Loại Giao Dịch</th>
                  <th className="p-3">Danh Mục Thu / Chi</th>
                  <th className="p-3">Số Tiền (₫)</th>
                  <th className="p-3">Tài Khoản / Quỹ</th>
                  <th className="p-3">Nội Dung Diễn Giải</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="tabular-nums font-bold text-blue-700">{tx.code}</p>
                      <p className="text-slate-500 text-[11px]">{tx.date}</p>
                    </td>

                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10.5px] ${
                        tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {tx.type === 'INCOME' ? '🟢 PHIẾU THU' : '🔴 PHIẾU CHI'}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-slate-800">{tx.category}</td>

                    <td className={`p-3 tabular-nums font-semibold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tx.amount)} ₫
                    </td>

                    <td className="p-3 font-bold text-slate-700">{tx.account}</td>

                    <td className="p-3 text-slate-600 font-normal">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DEPARTMENTAL BUDGETING & FORECAST */}
      {activeTab === 'BUDGET_FORECAST' && (
        <div className="space-y-6 text-xs font-bold">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" /> Quản Lý Định Mức Ngân Sách Dự Chi Theo Khối / Phòng Ban
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((b) => (
                <div key={b.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-slate-900">{b.department_name}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                      b.status === 'SAFE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {b.status === 'SAFE' ? '🟢 An Toàn' : b.status === 'WARNING' ? '🟡 Sắp Hết Ngân Sách' : '🔴 Vượt Ngân Sách'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] tabular-nums">
                    <div>
                      <span className="text-slate-500 font-normal block">Hạn Mức Cấp:</span>
                      <strong className="text-slate-900">{new Intl.NumberFormat('vi-VN').format(b.allocated_budget)} ₫</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-normal block">Đã Chi Tiêu:</span>
                      <strong className="text-purple-700">{new Intl.NumberFormat('vi-VN').format(b.spent_amount)} ₫</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-normal block">Còn Lại:</span>
                      <strong className={b.remaining_amount >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                        {new Intl.NumberFormat('vi-VN').format(b.remaining_amount)} ₫
                      </strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-slate-500 font-semibold">Tỷ lệ tiêu dùng:</span>
                      <span className="font-semibold text-slate-900">{b.utilization_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          b.utilization_pct > 100 ? 'bg-red-600' : b.utilization_pct > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(b.utilization_pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VAS BALANCE SHEET & DOUBLE-ENTRY GENERAL LEDGER */}
      {activeTab === 'VAS_BALANCE_SHEET' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" /> Bảng Cân Đối Kế Toán Chuẩn VAS (Thông tư 200/2014/TT-BTC)
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Báo cáo cân đối Tổng Tài Sản = Tổng Nguồn Vốn (Tiền mặt, Hàng tồn kho, Tài sản cố định, Công nợ & Vốn chủ sở hữu).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full tabular-nums text-xs border border-emerald-200">
                  ⚖️ Trạng Thái: Cân Bằng (0 ₫ chênh lệch)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CỘT TÀI SẢN (ASSETS) */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">A. TỔNG TÀI SẢN (ASSETS)</h4>
                  <span className="tabular-nums text-emerald-700 text-sm font-semibold">4.412.300.000 ₫</span>
                </div>

                <div className="space-y-3 font-medium">
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                      <span>I. TÀI SẢN NGẮN HẠN</span>
                      <span className="tabular-nums text-slate-900">4.055.000.000 ₫</span>
                    </div>
                    <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]">
                      <li className="flex justify-between">
                        <span>1. Tiền & các khoản tương đương tiền (TK 111, 112)</span>
                        <span className="tabular-nums font-bold text-slate-900">3.450.000.000 ₫</span>
                      </li>
                      <li className="flex justify-between">
                        <span>2. Phải thu ngắn hạn khách hàng (TK 131)</span>
                        <span className="tabular-nums font-bold text-slate-900">485.000.000 ₫</span>
                      </li>
                      <li className="flex justify-between">
                        <span>3. Hàng tồn kho kho vận (TK 156)</span>
                        <span className="tabular-nums font-bold text-slate-900">120.000.000 ₫</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                      <span>II. TÀI SẢN DÀI HẠN</span>
                      <span className="tabular-nums text-slate-900">357.300.000 ₫</span>
                    </div>
                    <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]">
                      <li className="flex justify-between">
                        <span>1. Nguyên giá Tài sản cố định hữu hình (TK 211)</span>
                        <span className="tabular-nums font-bold text-slate-900">398.500.000 ₫</span>
                      </li>
                      <li className="flex justify-between text-purple-700">
                        <span>2. Giá trị hao mòn lũy kế (TK 214)</span>
                        <span className="tabular-nums font-bold">-41.200.000 ₫</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CỘT NGUỒN VỐN (LIABILITIES & EQUITY) */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">B. TỔNG NGUỒN VỐN (EQUITY & LIABILITIES)</h4>
                  <span className="tabular-nums text-blue-700 text-sm font-semibold">4.412.300.000 ₫</span>
                </div>

                <div className="space-y-3 font-medium">
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                      <span>I. NỢ PHẢI TRẢ (LIABILITIES)</span>
                      <span className="tabular-nums text-slate-900">498.000.000 ₫</span>
                    </div>
                    <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]">
                      <li className="flex justify-between">
                        <span>1. Phải trả người bán ngắn hạn (TK 331)</span>
                        <span className="tabular-nums font-bold text-slate-900">245.000.000 ₫</span>
                      </li>
                      <li className="flex justify-between">
                        <span>2. Thuế & các khoản phải nộp Nhà nước (TK 333)</span>
                        <span className="tabular-nums font-bold text-slate-900">68.000.000 ₫</span>
                      </li>
                      <li className="flex justify-between">
                        <span>3. Phải trả người lao động Lương 3P (TK 334)</span>
                        <span className="tabular-nums font-bold text-slate-900">185.000.000 ₫</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 border-b pb-1">
                      <span>II. VỐN CHỦ SỞ HỮU (OWNER'S EQUITY)</span>
                      <span className="tabular-nums text-slate-900">3.914.300.000 ₫</span>
                    </div>
                    <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]">
                      <li className="flex justify-between">
                        <span>1. Vốn góp của chủ sở hữu (TK 411)</span>
                        <span className="tabular-nums font-bold text-slate-900">3.500.000.000 ₫</span>
                      </li>
                      <li className="flex justify-between text-emerald-700">
                        <span>2. Lợi nhuận sau thuế chưa phân phối (TK 421)</span>
                        <span className="tabular-nums font-bold">414.300.000 ₫</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SỔ CÁI BÚT TOÁN ĐỊNH KHOẢN ĐÚP */}
            <div className="pt-4 border-t space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" /> Sổ Nhật Ký Bút Toán Định Khoản Đúp (General Ledger Entries)
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b font-semibold uppercase tracking-wider text-[10.5px]">
                      <th className="p-2.5">Ngày Bút Toán</th>
                      <th className="p-2.5">Mã Chứng Từ</th>
                      <th className="p-2.5">Diễn Giải Nghiệp Vụ</th>
                      <th className="p-2.5 tabular-nums text-center">Nợ (Debit TK)</th>
                      <th className="p-2.5 tabular-nums text-center">Có (Credit TK)</th>
                      <th className="p-2.5 tabular-nums text-right">Số Tiền (VND)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 tabular-nums">2026-07-28</td>
                      <td className="p-2.5 tabular-nums font-bold text-blue-700">PT-2026-0701</td>
                      <td className="p-2.5">Thu tiền dịch vụ hợp đồng Agency Hồng Lực</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-emerald-700">TK 112 (TGNH)</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-blue-700">TK 511 (Doanh Thu)</td>
                      <td className="p-2.5 text-right tabular-nums font-semibold text-slate-900">38.250.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 tabular-nums">2026-07-25</td>
                      <td className="p-2.5 tabular-nums font-bold text-red-700">PC-2026-0702</td>
                      <td className="p-2.5">Thanh toán lương 3P tháng 7 cho nhân sự</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-purple-700">TK 334 (Phải Trả Lương)</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-emerald-700">TK 112 (TGNH)</td>
                      <td className="p-2.5 text-right tabular-nums font-semibold text-slate-900">145.000.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 tabular-nums">2026-07-01</td>
                      <td className="p-2.5 tabular-nums font-bold text-purple-700">KH-2026-0701</td>
                      <td className="p-2.5">Trích khấu hao tài sản cố định máy tính Server</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-slate-700">TK 642 (Chi Phí QLDN)</td>
                      <td className="p-2.5 text-center tabular-nums font-bold text-purple-700">TK 214 (Hao Mòn TSCD)</td>
                      <td className="p-2.5 text-right tabular-nums font-semibold text-slate-900">1.250.000 ₫</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FINANCE MODULE CONFIGURATION PANEL */}
      {activeTab === 'FINANCE_CONFIG' && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-xs font-bold">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" /> Cấu Hình Tham Số Kế Toán, Thuế & Công Nợ
              </h3>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                Thiết lập quy tắc nhảy số chứng từ thu chi tự động, thuế suất GTGT & ngưỡng cảnh báo nợ quá hạn.
              </p>
            </div>

            <button
              onClick={() => showToast('💾 Đã lưu thành công cấu hình tham số Kế toán & Tài chính!')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Tài Chính
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Quy tắc Đánh Số Chứng Từ */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs text-indigo-700 uppercase tracking-wider">
                1. Tiền Tố Đánh Số Chứng Từ Thu / Chi
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Tiền tố Phiếu Thu *</label>
                  <input
                    type="text"
                    value={finConfig.receipt_prefix}
                    onChange={(e) => setFinConfig({ ...finConfig, receipt_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Tiền tố Phiếu Chi *</label>
                  <input
                    type="text"
                    value={finConfig.payment_prefix}
                    onChange={(e) => setFinConfig({ ...finConfig, payment_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums text-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Thuế Suất & Tuổi Nợ SLA */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs text-indigo-700 uppercase tracking-wider">
                2. Thuế Suất & Ngưỡng Nợ Xấu (Ngày)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Thuế Suất GTGT VAT (%) *</label>
                  <input
                    type="number"
                    value={finConfig.vat_rate}
                    onChange={(e) => setFinConfig({ ...finConfig, vat_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Cảnh Báo Nợ Quá Hạn (Ngày) *</label>
                  <input
                    type="number"
                    value={finConfig.warning_debt_days}
                    onChange={(e) => setFinConfig({ ...finConfig, warning_debt_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums text-amber-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LẬP PHIẾU THU / CHI MỚI */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 text-xs font-bold">
            <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wallet className="w-5 h-5" /> Lập Phiếu Thu / Chi Tài Chính Mới
              </h3>
              <button onClick={() => setIsTxModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Loại Phiếu *</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="EXPENSE">🔴 Phiếu Chi (Chi Tiền)</option>
                    <option value="INCOME">🟢 Phiếu Thu (Thu Tiền)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Danh Mục Thu / Chi *</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Hợp Đồng Dịch Vụ">Hợp Đồng Dịch Vụ</option>
                    <option value="Chi Lương Nhân Sự">Chi Lương Nhân Sự</option>
                    <option value="Chi Marketing Ads">Chi Marketing Ads</option>
                    <option value="Chi Server & SaaS">Chi Server & SaaS</option>
                    <option value="Chi Tiền Điện Nước VP">Chi Tiền Điện Nước VP</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Số Tiền (VND) *</label>
                  <input
                    type="number"
                    step={1000000}
                    required
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl tabular-nums text-emerald-700 font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Tài Khoản Giao Dịch *</label>
                  <select
                    value={newTx.account}
                    onChange={(e) => setNewTx({ ...newTx, account: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Techcombank">Techcombank</option>
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="Quỹ Tiền Mặt">Quỹ Tiền Mặt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Diễn Giải Nội Dung Giao Dịch *</label>
                <textarea
                  rows={3}
                  required
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  placeholder="Nhập chi tiết nội dung thu chi..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Lưu Phiếu Giao Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
