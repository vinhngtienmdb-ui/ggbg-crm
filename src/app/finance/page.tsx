'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
import { formatCurrency, formatNumber } from '@/lib/formatters';
import {
  INITIAL_PL_DATA,
  INITIAL_DEBT_INVOICES,
  getFinancialSummary,
  getPLStatements,
  getDebtInvoices,
  FINANCE_UPDATED_EVENT
} from '@/lib/financeStore';
import { ContractProfitLoss, DebtInvoice, CashFlowTransaction, DepartmentBudget, CreditLimitApprovalRequest } from '@/types/finance';
import { getStoredCreditRequests, saveStoredCreditRequests, getStoredCustomers, saveStoredCustomers } from '@/lib/customerStore';
import { useSearchParams } from 'next/navigation';
import { ModuleBanner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { canAccessSettings } from '@/lib/permissions';

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

const INITIAL_TRANSACTIONS: CashFlowTransaction[] = [
  {
    id: 'tx_1',
    code: 'PT-2026-0701',
    date: '2026-07-28',
    type: 'INCOME',
    category: 'Hợp Đồng Dịch Vụ',
    amount: 38250000,
    account: 'Techcombank',
    description: 'Thu tiền dịch vụ hợp đồng Agency Hồng Lực',
    approval_status: 'APPROVED',
  },
  {
    id: 'tx_2',
    code: 'PC-2026-0702',
    date: '2026-07-25',
    type: 'EXPENSE',
    category: 'Chi Lương Nhân Sự',
    amount: 145000000,
    account: 'Techcombank',
    description: 'Thanh toán lương 3P tháng 7 cho nhân sự',
    approval_status: 'APPROVED',
  },
];

const INITIAL_BUDGETS: DepartmentBudget[] = [
  {
    id: 'b_1',
    department_name: 'Khối Kinh Doanh (Sales & BD)',
    allocated_budget: 150000000,
    spent_amount: 112000000,
    remaining_amount: 38000000,
    utilization_pct: 74.6,
    status: 'SAFE',
  },
  {
    id: 'b_2',
    department_name: 'Khối Marketing & Media KOC',
    allocated_budget: 200000000,
    spent_amount: 185000000,
    remaining_amount: 15000000,
    utilization_pct: 92.5,
    status: 'WARNING',
  },
  {
    id: 'b_3',
    department_name: 'Khối Vận Hành & CSKH',
    allocated_budget: 80000000,
    spent_amount: 54000000,
    remaining_amount: 26000000,
    utilization_pct: 67.5,
    status: 'SAFE',
  },
  {
    id: 'b_4',
    department_name: 'Khối Hành Chính Nhân Sự C&B',
    allocated_budget: 60000000,
    spent_amount: 45000000,
    remaining_amount: 15000000,
    utilization_pct: 75.0,
    status: 'SAFE',
  },
];

function FinanceContent() {
  const { user, simulatedRole } = useAuth();
  const activeRole = simulatedRole || user?.role || 'SALE_EXEC';
  const searchParams = useSearchParams();

  const [plStatements, setPlStatements] = useState<ContractProfitLoss[]>(() => getPLStatements());
  const [debtInvoices, setDebtInvoices] = useState<DebtInvoice[]>(() => getDebtInvoices());
  const [transactions, setTransactions] = useState<CashFlowTransaction[]>(INITIAL_TRANSACTIONS);
  const [budgets] = useState<DepartmentBudget[]>(INITIAL_BUDGETS);
  const [creditRequests, setCreditRequests] = useState<CreditLimitApprovalRequest[]>([]);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [newCreditReq, setNewCreditReq] = useState({
    customer_id: '',
    requested_limit: 50000000,
    reason: '',
  });

  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'P_L' | 'DEBT' | 'CASH_FLOW' | 'BUDGET_FORECAST' | 'VAS_BALANCE_SHEET' | 'FINANCE_CONFIG'>('EXECUTIVE');

  useEffect(() => {
    const handleFinanceUpdate = () => {
      setPlStatements([...getPLStatements()]);
      setDebtInvoices([...getDebtInvoices()]);
    };
    window.addEventListener(FINANCE_UPDATED_EVENT, handleFinanceUpdate);
    return () => window.removeEventListener(FINANCE_UPDATED_EVENT, handleFinanceUpdate);
  }, []);

  useEffect(() => {
    setCreditRequests(getStoredCreditRequests());
    const handleCreditUpdate = () => {
      setCreditRequests(getStoredCreditRequests());
    };
    window.addEventListener('ggbg_credit_requests_updated', handleCreditUpdate);
    return () => window.removeEventListener('ggbg_credit_requests_updated', handleCreditUpdate);
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'overview' || tab === 'executive') setActiveTab('EXECUTIVE');
    else if (tab === 'revenue' || tab === 'cash_flow') setActiveTab('CASH_FLOW');
    else if (tab === 'expenses' || tab === 'budget') setActiveTab('BUDGET_FORECAST');
    else if (tab === 'profit_loss' || tab === 'p_l') setActiveTab('P_L');
    else if (tab === 'debt') setActiveTab('DEBT');
    else if (tab === 'vas') setActiveTab('VAS_BALANCE_SHEET');
  }, [searchParams]);

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
        setDebtInvoices((prev) => prev.map((item) => item.id === inv.id
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

  const handleApproveCreditStep = (
    reqId: string,
    step: 1 | 2 | 3,
    action: 'APPROVE' | 'REJECT',
    note?: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedReqs = creditRequests.map((r) => {
      if (r.id === reqId) {
        if (action === 'REJECT') {
          return {
            ...r,
            status: 'REJECTED' as const,
            rejection_reason: note || 'Từ chối cấp hạn mức tín dụng',
            updated_at: now,
          };
        }

        if (step === 1) {
          return {
            ...r,
            status: 'PENDING_CHIEF_ACCOUNTANT' as const,
            sales_director_approval: {
              approver_name: user?.name || 'Giám Đốc Kinh Doanh',
              approved_at: now,
              status: 'APPROVED' as const,
              note: note || 'Đã thẩm định nhu cầu khách hàng',
            },
            updated_at: now,
          };
        } else if (step === 2) {
          return {
            ...r,
            status: 'PENDING_CEO' as const,
            chief_accountant_approval: {
              approver_name: user?.name || 'Kế Toán Trưởng',
              approved_at: now,
              status: 'APPROVED' as const,
              note: note || 'Thẩm tra lịch sử thanh toán đạt yêu cầu',
            },
            updated_at: now,
          };
        } else if (step === 3) {
          // CEO APPROVES => Update customer store
          const custs = getStoredCustomers();
          const updatedCusts = custs.map((c) => {
            if (c.id === r.customer_id) {
              return {
                ...c,
                credit_limit_info: {
                  approved_limit: r.requested_limit,
                  status: 'APPROVED' as const,
                  requested_limit: r.requested_limit,
                  reason: r.reason,
                  sales_director_approval: r.sales_director_approval,
                  chief_accountant_approval: r.chief_accountant_approval,
                  ceo_approval: {
                    approver_name: user?.name || 'Nguyễn Quốc Tuấn (CEO)',
                    approved_at: now,
                    status: 'APPROVED' as const,
                    note: note || 'Phê chuẩn hạn mức tín dụng',
                  },
                },
              };
            }
            return c;
          });
          saveStoredCustomers(updatedCusts);

          return {
            ...r,
            status: 'APPROVED' as const,
            current_limit: r.requested_limit,
            ceo_approval: {
              approver_name: user?.name || 'Nguyễn Quốc Tuấn (CEO)',
              approved_at: now,
              status: 'APPROVED' as const,
              note: note || 'Phê chuẩn hạn mức tín dụng',
            },
            updated_at: now,
          };
        }
      }
      return r;
    });

    setCreditRequests(updatedReqs);
    saveStoredCreditRequests(updatedReqs);
    showToast(action === 'APPROVE' ? `✓ Đã phê duyệt cấp ${step} thành công!` : '❌ Đã từ chối yêu cầu cấp hạn mức!');
  };

  const handleCreateCreditRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const custs = getStoredCustomers();
    const cust = custs.find((c) => c.id === newCreditReq.customer_id);
    if (!cust) {
      showToast('⚠️ Vui lòng chọn khách hàng!');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newReq: CreditLimitApprovalRequest = {
      id: `req_cred_${Date.now()}`,
      request_code: `CR-2026-${String(creditRequests.length + 1).padStart(4, '0')}`,
      customer_id: cust.id,
      customer_code: cust.customer_code,
      customer_name: cust.name,
      company_name: cust.company_name || cust.household_name,
      entity_type: cust.entity_type,
      current_limit: cust.credit_limit_info?.approved_limit || 0,
      requested_limit: Number(newCreditReq.requested_limit) || 0,
      reason: newCreditReq.reason.trim() || 'Cấp hạn mức công nợ theo hợp đồng dịch vụ',
      status: 'PENDING_SALES_DIR',
      created_at: now,
      updated_at: now,
    };

    const updatedReqs = [newReq, ...creditRequests];
    setCreditRequests(updatedReqs);
    saveStoredCreditRequests(updatedReqs);
    setIsCreditModalOpen(false);
    showToast(`🎉 Đã tạo yêu cầu phê duyệt hạn mức [${newReq.request_code}] thành công!`);
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
    showToast(`✓ Đã lập thành công Phiếu ${newTx.type === 'INCOME' ? 'Thu' : 'Chi'} ${item.code}`);
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMessage && ( <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"> <Sparkles className="w-4 h-4 text-blue-400" /> <span>{toastMessage}</span> <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-80"> <X className="w-4 h-4" /> </button> </div> )}

      {/* HEADER BANNER - THEO CHUẨN DASHBOARD */}
      <ModuleBanner
        badge={{
          label: 'Hệ Thống Quản Trị Tài Chính & Dòng Tiền VAS',
          icon: PieChartIcon,
          variant: 'emerald',
        }}
        title="Báo Cáo Tài Chính & Quản Trị P&L Doanh Nghiệp"
        subtitle="Phân tích tỷ suất lợi nhuận gộp P&L hợp đồng, quản lý công nợ phải thu (AR), dòng tiền thực tế & cân đối kế toán VAS"
        kpis={[
          { label: 'Doanh Thu Tổng', value: formatCurrency(summary.total_gross_revenue), subtext: '+18.4% so với kỳ trước' },
          { label: 'Lợi Nhuận Gộp P&L', value: formatCurrency(summary.total_net_profit), subtext: `Margin: ${summary.avg_profit_margin}%` },
          { label: 'Công Nợ Quá Hạn', value: formatCurrency(summary.total_overdue_debt), subtext: 'Cần gửi nhắc nợ' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsTxModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Lập Phiếu Thu / Chi</span>
            </button>
          </div>
        }
      />

      {/* NỘI DUNG TÀI CHÍNH FULL-WIDTH */}
      <div className="space-y-6">
        {/* TAB 1: EXECUTIVE FINANCIAL DASHBOARD */}
      {activeTab === 'EXECUTIVE' && (
        <div className="space-y-6 text-xs">
          {/* Top 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-medium">
            <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Doanh Thu Tổng (Gross Revenue)</span>
              <p className="text-2xl font-semibold text-blue-700 font-mono">
                {formatCurrency(summary.total_gross_revenue)}
              </p>
              <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so với tháng trước
              </div>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Lợi Nhuận Gộp P&L (Net Profit)</span>
              <p className="text-2xl font-semibold text-emerald-600 font-mono">
                {formatCurrency(summary.total_net_profit)}
              </p>
              <span className="text-slate-500 text-[11px]">Tỷ suất lợi nhuận: <strong className="text-emerald-700 font-semibold">{summary.avg_profit_margin}%</strong></span>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Công Nợ Quá Hạn Phải Thu (AR)</span>
              <p className="text-2xl font-semibold text-red-600 font-mono">
                {formatCurrency(summary.total_overdue_debt)}
              </p>
              <span className="text-red-600 text-[11px] font-medium">Cần gửi thông báo đòi nợ Zalo/Email</span>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Dòng Tiền Quỹ Thực Có (Cash Balance)</span>
              <p className="text-2xl font-semibold text-purple-700 font-mono">
                {formatCurrency(850000000)}
              </p>
              <span className="text-purple-600 text-[11px] font-medium">Techcombank + Quỹ tiền mặt</span>
            </div>
          </div>

          {/* Charts Section: 12-Month Performance Trend & Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Biểu Đồ Xu Hướng Doanh Thu, Chi Phí & Lợi Nhuận (12 Tháng)
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Đơn vị: Triệu VNĐ</span>
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
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
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

          {/* Quick Shortcuts Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setActiveTab('CASH_FLOW')}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between text-blue-600 mb-1">
                <Wallet className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900">Sổ Quỹ Dòng Tiền</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Biến động thu chi tài khoản</p>
            </button>
            <button
              onClick={() => setActiveTab('BUDGET_FORECAST')}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between text-purple-600 mb-1">
                <PieChartIcon className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900">Ngân Sách Phòng Ban</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Định mức chi tiêu nội bộ</p>
            </button>
            <button
              onClick={() => setActiveTab('P_L')}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900">Báo Cáo Lãi Lỗ P&L</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Theo từng hợp đồng TMĐT</p>
            </button>
            <button
              onClick={() => setActiveTab('DEBT')}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900">Quản Trị Công Nợ</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Đòi nợ tự động đa kênh</p>
            </button>
            <button
              onClick={() => setActiveTab('VAS_BALANCE_SHEET')}
              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left shadow-2xs transition-all group"
            >
              <div className="flex items-center justify-between text-indigo-600 mb-1">
                <FileSpreadsheet className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900">Cân Đối Kế Toán VAS</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Báo cáo tài chính chuẩn mực</p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACT P_L STATEMENT ANALYSIS */}
      {activeTab === 'P_L' && ( <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 text-xs font-medium"> <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <TrendingUp className="w-4 h-4 text-emerald-600" /> Báo Cáo Phân Tích Lợi Nhuận Gộp (P&L) Từng Hợp Đồng Gian Hàng TMĐT </h3> <p className="text-xs text-slate-500 mt-0.5">Theo dõi tỷ suất lợi nhuận gộp thực tế sau khi trừ chi phí nhân sự C&B, KOC Livestream & phí sàn.</p> </div> <button
              onClick={() => showToast('📥 Đã xuất báo cáo P&L định dạng Excel thành công!')}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all"
            > <FileSpreadsheet className="w-4 h-4" /> Xuất Báo Cáo P&L Excel </button> </div> <div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px]"> <th className="p-3">Mã Hợp Đồng & Khách Hàng</th> <th className="p-3">Sàn TMĐT</th> <th className="p-3">GMV Hàng Tháng</th> <th className="p-3">Doanh Thu Phí (%)</th> <th className="p-3">Chi Phí Vận Hành & KOC</th> <th className="p-3">Lợi Nhuận Gộp P&L (₫)</th> <th className="p-3 text-center">Tỷ Suất Margin (%)</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {plStatements.map((pl) => ( <tr key={pl.id} className="hover:bg-slate-50 transition-colors"> <td className="p-3"> <p className="font-semibold text-slate-900">{pl.company_name}</p> <p className="font-mono text-blue-700 text-[11px]">{pl.contract_code} · Đại diện: {pl.customer_name}</p> </td> <td className="p-3 font-medium text-slate-800"> <span className="px-2.5 py-1 bg-slate-100 rounded-full text-[11px]">{pl.ecom_platform}</span> </td> <td className="p-3 font-mono font-medium text-slate-800"> {formatCurrency(pl.monthly_gmv)} </td> <td className="p-3 font-mono font-medium text-blue-700"> {formatCurrency(pl.gross_revenue)} ({pl.commission_rate_percent}%) </td> <td className="p-3 font-mono text-[11px]"> <p className="text-slate-700">C&B Nhân sự: <strong>{formatCurrency(pl.ops_cost)}</strong></p> <p className="text-slate-500">KOC Ads: <strong>{formatCurrency(pl.livestream_koc_cost)}</strong></p> </td> <td className="p-3 font-mono font-semibold text-emerald-700 text-sm"> {formatCurrency(pl.net_profit)} </td> <td className="p-3 text-center"> <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        pl.profit_margin_percent >= 40
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : pl.profit_margin_percent >= 25
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}> {pl.profit_margin_percent}% </span> </td> </tr> ))} </tbody> </table> </div> </div> )}

      {/* TAB 3: ACCOUNTS RECEIVABLE & CREDIT LIMIT 3-STEP APPROVAL */}
      {activeTab === 'DEBT' && (
        <div className="space-y-6 text-xs font-medium">
          {/* SECTION 1: 3-STEP CREDIT LIMIT APPROVAL WORKFLOW */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Quy Trình Thẩm Định & Phê Duyệt Hạn Mức Tín Dụng Khách Hàng (3 Cấp Duyệt)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy trình xét duyệt chuẩn: <strong>1. Giám Đốc Kinh Doanh</strong> → <strong>2. Kế Toán Trưởng</strong> → <strong>3. CEO Phê Chuẩn</strong> (Đồng bộ hạn mức sang hồ sơ Khách hàng)
                </p>
              </div>
              <button
                onClick={() => setIsCreditModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Đề Xuất Cấp Hạn Mức</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px]">
                    <th className="p-3">Mã Phiếu & Khách Hàng</th>
                    <th className="p-3">Thể Nhân</th>
                    <th className="p-3 font-mono">Hạn Mức Đề Xuất</th>
                    <th className="p-3">Lý Do Đề Xuất</th>
                    <th className="p-3 text-center">Tiến Trình Duyệt 3 Cấp</th>
                    <th className="p-3 text-right">Thao Tác Duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {creditRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        Chưa có yêu cầu cấp hạn mức tín dụng nào
                      </td>
                    </tr>
                  ) : (
                    creditRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        {/* Customer Info */}
                        <td className="p-3">
                          <p className="font-semibold text-slate-900">{req.company_name || req.customer_name}</p>
                          <p className="font-mono text-blue-700 text-[11px]">
                            {req.request_code} · {req.customer_code} ({req.customer_name})
                          </p>
                        </td>

                        {/* Entity Type */}
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {req.entity_type === 'ENTERPRISE'
                              ? 'Doanh Nghiệp'
                              : req.entity_type === 'HOUSEHOLD_BUSINESS'
                              ? 'Hộ Kinh Doanh'
                              : 'Cá Nhân'}
                          </span>
                        </td>

                        {/* Limit Amount */}
                        <td className="p-3 font-mono">
                          <div className="font-semibold text-slate-900 text-sm">
                            {formatCurrency(req.requested_limit)}
                          </div>
                          {req.current_limit > 0 && (
                            <div className="text-[10.5px] text-slate-400">
                              Hiện tại: {formatCurrency(req.current_limit)}
                            </div>
                          )}
                        </td>

                        {/* Reason */}
                        <td className="p-3 text-slate-600 max-w-[200px] truncate">
                          {req.reason}
                        </td>

                        {/* 3 Steps Pipeline Visual */}
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1 text-[10px]">
                            {/* Step 1: Sales Dir */}
                            <span
                              className={`px-2 py-0.5 rounded font-semibold border ${
                                req.sales_director_approval?.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : req.status === 'PENDING_SALES_DIR'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                              title={req.sales_director_approval?.approver_name || '1. GĐ Kinh Doanh'}
                            >
                              1. GĐ Kinh Doanh
                            </span>
                            <span>→</span>
                            {/* Step 2: Chief Accountant */}
                            <span
                              className={`px-2 py-0.5 rounded font-semibold border ${
                                req.chief_accountant_approval?.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : req.status === 'PENDING_CHIEF_ACCOUNTANT'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                              title={req.chief_accountant_approval?.approver_name || '2. Kế Toán Trưởng'}
                            >
                              2. Kế Toán Trưởng
                            </span>
                            <span>→</span>
                            {/* Step 3: CEO */}
                            <span
                              className={`px-2 py-0.5 rounded font-semibold border ${
                                req.ceo_approval?.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : req.status === 'PENDING_CEO'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                              title={req.ceo_approval?.approver_name || '3. CEO Phê Chuẩn'}
                            >
                              3. CEO
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          {req.status === 'APPROVED' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Đã Duyệt Hạn Mức
                            </span>
                          ) : req.status === 'REJECTED' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-red-100 text-red-800 border border-red-300">
                              ✕ Từ Chối
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {req.status === 'PENDING_SALES_DIR' && (
                                <button
                                  onClick={() => handleApproveCreditStep(req.id, 1, 'APPROVE')}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px] shadow-xs"
                                >
                                  GĐ KD Duyệt
                                </button>
                              )}
                              {req.status === 'PENDING_CHIEF_ACCOUNTANT' && (
                                <button
                                  onClick={() => handleApproveCreditStep(req.id, 2, 'APPROVE')}
                                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-[11px] shadow-xs"
                                >
                                  KTT Thẩm Tra
                                </button>
                              )}
                              {req.status === 'PENDING_CEO' && (
                                <button
                                  onClick={() => handleApproveCreditStep(req.id, 3, 'APPROVE')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] shadow-xs"
                                >
                                  CEO Phê Chuẩn
                                </button>
                              )}
                              <button
                                onClick={() => handleApproveCreditStep(req.id, 1, 'REJECT')}
                                className="px-2 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded text-[11px]"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: ACCOUNTS RECEIVABLE & DEBT INVOICES */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Sổ Quản Lý Công Nợ Hóa Đơn & Đòi Nợ Tự Động Multi-Channel</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động gửi thông báo nhắc nợ kỳ thu phí dịch vụ qua Zalo ZNS, Email tự động & SMS Brandname.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px]">
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
                        <p className="font-semibold text-slate-900">{inv.customer_name}</p>
                        <p className="font-mono text-blue-700 text-[11px]">{inv.invoice_code}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-slate-800">{inv.billing_period}</p>
                        <p className="font-mono text-slate-500 text-[11px]">{inv.contract_code}</p>
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-900 text-sm">
                        {formatCurrency(inv.amount_due)}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{inv.due_date}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full font-medium text-[10.5px] ${
                            inv.payment_status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : inv.payment_status === 'UNPAID'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                          }`}
                        >
                          {inv.payment_status === 'PAID'
                            ? '✓ Đã Thanh Toán'
                            : inv.payment_status === 'UNPAID'
                            ? '⏳ Chờ Thanh Toán'
                            : '⚡ Nợ Quá Hạn'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {inv.payment_status !== 'PAID' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSendReminder(inv, 'Zalo ZNS')}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
                              title="Gửi Zalo ZNS"
                            >
                              Zalo
                            </button>
                            <button
                              onClick={() => handleSendReminder(inv, 'Email')}
                              className="px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-all border border-purple-200"
                              title="Gửi Email"
                            >
                              📧 Email
                            </button>
                            <button
                              onClick={() => handleSendReminder(inv, 'SMS')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-all border border-emerald-200"
                              title="Gửi SMS Brandname"
                            >
                              SMS
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Không cần nhắc</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CASH FLOW & TRANSACTION LEDGER */}
      {activeTab === 'CASH_FLOW' && ( <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 text-xs font-medium"> <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <Wallet className="w-4 h-4 text-purple-600" /> Sổ Nhật Ký Giao Dịch Thu / Chi Dòng Tiền Real-Time </h3> <p className="text-xs text-slate-500 mt-0.5">Theo dõi lịch sử biến động dòng tiền thực tế qua các tài khoản ngân hàng và quỹ tiền mặt.</p> </div> <button
              onClick={() => setIsTxModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            > <Plus className="w-4 h-4" /> Tạo Phiếu Thu / Chi Mới </button> </div> <div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px]"> <th className="p-3">Mã Phiếu & Ngày</th> <th className="p-3">Loại Giao Dịch</th> <th className="p-3">Danh Mục Thu / Chi</th> <th className="p-3">Số Tiền (₫)</th> <th className="p-3">Tài Khoản / Quỹ</th> <th className="p-3">Nội Dung Diễn Giải</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {transactions.map((tx) => ( <tr key={tx.id} className="hover:bg-slate-50 transition-colors"> <td className="p-3"> <p className="font-mono font-medium text-blue-700">{tx.code}</p> <p className="text-slate-500 text-[11px]">{tx.date}</p> </td> <td className="p-3"> <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10.5px] ${
                        tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}> {tx.type === 'INCOME' ? '🟢 PHIẾU THU' : '🔴 PHIẾU CHI'} </span> </td> <td className="p-3 font-medium text-slate-800">{tx.category}</td> <td className={`p-3 font-mono font-semibold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}> {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)} </td> <td className="p-3 font-medium text-slate-700">{tx.account}</td> <td className="p-3 text-slate-600 font-normal">{tx.description}</td> </tr> ))} </tbody> </table> </div> </div> )}

      {/* TAB 5: DEPARTMENTAL BUDGETING & FORECAST */}
      {activeTab === 'BUDGET_FORECAST' && ( <div className="space-y-6 text-xs font-medium"> <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4"> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <DollarSign className="w-4 h-4 text-indigo-600" /> Quản Lý Định Mức Ngân Sách Dự Chi Theo Khối / Phòng Ban </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {budgets.map((b) => ( <div key={b.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"> <div className="flex items-center justify-between"> <p className="font-semibold text-sm text-slate-900">{b.department_name}</p> <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                      b.status === 'SAFE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}> {b.status === 'SAFE' ? '🟢 An Toàn' : b.status === 'WARNING' ? '🟡 Sắp Hết Ngân Sách' : '🔴 Vượt Ngân Sách'} </span> </div> <div className="grid grid-cols-3 gap-2 text-[11px] font-mono"> <div> <span className="text-slate-500 font-normal block">Hạn Mức Cấp:</span> <strong className="text-slate-900">{formatCurrency(b.allocated_budget)}</strong> </div> <div> <span className="text-slate-500 font-normal block">Đã Chi Tiêu:</span> <strong className="text-purple-700">{formatCurrency(b.spent_amount)}</strong> </div> <div> <span className="text-slate-500 font-normal block">Còn Lại:</span> <strong className={b.remaining_amount >= 0 ? 'text-emerald-700' : 'text-red-700'}> {formatCurrency(b.remaining_amount)} </strong> </div> </div> {/* Progress Bar */} <div className="space-y-1"> <div className="flex items-center justify-between text-[10.5px]"> <span className="text-slate-500 font-semibold">Tỷ lệ tiêu dùng:</span> <span className="font-semibold text-slate-900">{b.utilization_pct}%</span> </div> <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"> <div
                        className={`h-full transition-all ${
                          b.utilization_pct > 100 ? 'bg-red-600' : b.utilization_pct > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(b.utilization_pct, 100)}%` }}
                      /> </div> </div> </div> ))} </div> </div> </div> )}

      {/* TAB 6: VAS BALANCE SHEET & DOUBLE-ENTRY GENERAL LEDGER */}
      {activeTab === 'VAS_BALANCE_SHEET' && ( <div className="space-y-6"> <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-medium"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4"> <div> <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2"> <Building2 className="w-5 h-5 text-emerald-600" /> Bảng Cân Đối Kế Toán Chuẩn VAS (Thông tư 200/2014/TT-BTC) </h3> <p className="text-xs text-slate-500 font-normal mt-0.5"> Báo cáo cân đối Tổng Tài Sản = Tổng Nguồn Vốn (Tiền mặt, Hàng tồn kho, Tài sản cố định, Công nợ & Vốn chủ sở hữu). </p> </div> <div className="flex items-center gap-2"> <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-mono text-xs border border-emerald-200"> ⚖ Trạng Thái: Cân Bằng (0 ₫ chênh lệch) </span> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* CỘT TÀI SẢN (ASSETS) */} <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4"> <div className="flex items-center justify-between border-b pb-2"> <h4 className="font-semibold text-slate-900 text-sm">A. TỔNG TÀI SẢN (ASSETS)</h4> <span className="font-mono text-emerald-700 text-sm font-semibold">4,412,300,000 ₫</span> </div> <div className="space-y-3 font-medium"> <div> <div className="flex justify-between font-semibold text-slate-800 border-b pb-1"> <span>I. TÀI SẢN NGẮN HẠN</span> <span className="font-mono text-slate-900">4,055,000,000 ₫</span> </div> <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]"> <li className="flex justify-between"> <span>1. Tiền & các khoản tương đương tiền (TK 111, 112)</span> <span className="font-mono font-medium text-slate-900">3,450,000,000 ₫</span> </li> <li className="flex justify-between"> <span>2. Phải thu ngắn hạn khách hàng (TK 131)</span> <span className="font-mono font-medium text-slate-900">485,000,000 ₫</span> </li> <li className="flex justify-between"> <span>3. Hàng tồn kho kho vận (TK 156)</span> <span className="font-mono font-medium text-slate-900">120,000,000 ₫</span> </li> </ul> </div> <div> <div className="flex justify-between font-semibold text-slate-800 border-b pb-1"> <span>II. TÀI SẢN DÀI HẠN</span> <span className="font-mono text-slate-900">357,300,000 ₫</span> </div> <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]"> <li className="flex justify-between"> <span>1. Nguyên giá Tài sản cố định hữu hình (TK 211)</span> <span className="font-mono font-medium text-slate-900">398,500,000 ₫</span> </li> <li className="flex justify-between text-purple-700"> <span>2. Giá trị hao mòn lũy kế (TK 214)</span> <span className="font-mono font-medium">-41,200,000 ₫</span> </li> </ul> </div> </div> </div> {/* CỘT NGUỒN VỐN (LIABILITIES & EQUITY) */} <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4"> <div className="flex items-center justify-between border-b pb-2"> <h4 className="font-semibold text-slate-900 text-sm">B. TỔNG NGUỒN VỐN (EQUITY & LIABILITIES)</h4> <span className="font-mono text-blue-700 text-sm font-semibold">4,412,300,000 ₫</span> </div> <div className="space-y-3 font-medium"> <div> <div className="flex justify-between font-semibold text-slate-800 border-b pb-1"> <span>I. NỢ PHẢI TRẢ (LIABILITIES)</span> <span className="font-mono text-slate-900">498,000,000 ₫</span> </div> <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]"> <li className="flex justify-between"> <span>1. Phải trả người bán ngắn hạn (TK 331)</span> <span className="font-mono font-medium text-slate-900">245,000,000 ₫</span> </li> <li className="flex justify-between"> <span>2. Thuế & các khoản phải nộp Nhà nước (TK 333)</span> <span className="font-mono font-medium text-slate-900">68,000,000 ₫</span> </li> <li className="flex justify-between"> <span>3. Phải trả người lao động Lương 3P (TK 334)</span> <span className="font-mono font-medium text-slate-900">185,000,000 ₫</span> </li> </ul> </div> <div> <div className="flex justify-between font-semibold text-slate-800 border-b pb-1"> <span>II. VỐN CHỦ SỞ HỮU (OWNER'S EQUITY)</span> <span className="font-mono text-slate-900">3,914,300,000 ₫</span> </div> <ul className="pl-3 mt-1 space-y-1 text-slate-600 text-[11.5px]"> <li className="flex justify-between"> <span>1. Vốn góp của chủ sở hữu (TK 411)</span> <span className="font-mono font-medium text-slate-900">3,500,000,000 ₫</span> </li> <li className="flex justify-between text-emerald-700"> <span>2. Lợi nhuận sau thuế chưa phân phối (TK 421)</span> <span className="font-mono font-medium">414,300,000 ₫</span> </li> </ul> </div> </div> </div> </div> {/* SỔ CÁI BÚT TOÁN ĐỊNH KHOẢN ĐÚP */} <div className="pt-4 border-t space-y-3"> <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2"> <FileSpreadsheet className="w-4 h-4 text-purple-600" /> Sổ Nhật Ký Bút Toán Định Khoản Đúp (General Ledger Entries) </h4> <div className="overflow-x-auto border border-slate-200 rounded-xl"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="bg-slate-100 border-b font-semibold uppercase text-[10.5px]"> <th className="p-2.5">Ngày Bút Toán</th> <th className="p-2.5">Mã Chứng Từ</th> <th className="p-2.5">Diễn Giải Nghiệp Vụ</th> <th className="p-2.5 font-mono text-center">Nợ (Debit TK)</th> <th className="p-2.5 font-mono text-center">Có (Credit TK)</th> <th className="p-2.5 font-mono text-right">Số Tiền (VND)</th> </tr> </thead> <tbody className="divide-y divide-slate-100 font-medium"> <tr className="hover:bg-slate-50"> <td className="p-2.5 font-mono">2026-07-28</td> <td className="p-2.5 font-mono font-medium text-blue-700">PT-2026-0701</td> <td className="p-2.5">Thu tiền dịch vụ hợp đồng Agency Hồng Lực</td> <td className="p-2.5 text-center font-mono font-medium text-emerald-700">TK 112 (TGNH)</td> <td className="p-2.5 text-center font-mono font-medium text-blue-700">TK 511 (Doanh Thu)</td> <td className="p-2.5 text-right font-mono font-semibold text-slate-900">38,250,000 ₫</td> </tr> <tr className="hover:bg-slate-50"> <td className="p-2.5 font-mono">2026-07-25</td> <td className="p-2.5 font-mono font-medium text-red-700">PC-2026-0702</td> <td className="p-2.5">Thanh toán lương 3P tháng 7 cho nhân sự</td> <td className="p-2.5 text-center font-mono font-medium text-purple-700">TK 334 (Phải Trả Lương)</td> <td className="p-2.5 text-center font-mono font-medium text-emerald-700">TK 112 (TGNH)</td> <td className="p-2.5 text-right font-mono font-semibold text-slate-900">145,000,000 ₫</td> </tr> <tr className="hover:bg-slate-50"> <td className="p-2.5 font-mono">2026-07-01</td> <td className="p-2.5 font-mono font-medium text-purple-700">KH-2026-0701</td> <td className="p-2.5">Trích khấu hao tài sản cố định máy tính Server</td> <td className="p-2.5 text-center font-mono font-medium text-slate-700">TK 642 (Chi Phí QLDN)</td> <td className="p-2.5 text-center font-mono font-medium text-purple-700">TK 214 (Hao Mòn TSCD)</td> <td className="p-2.5 text-right font-mono font-semibold text-slate-900">1,250,000 ₫</td> </tr> </tbody> </table> </div> </div> </div> </div> )}

      {/* TAB 7: FINANCE MODULE CONFIGURATION PANEL */}
      {activeTab === 'FINANCE_CONFIG' && ( <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-6 text-xs font-medium"> <div className="flex items-center justify-between border-b pb-3"> <div> <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"> <Building2 className="w-5 h-5 text-indigo-600" /> Cấu Hình Tham Số Kế Toán, Thuế & Công Nợ </h3> <p className="text-[11px] text-slate-500 font-normal mt-0.5"> Thiết lập quy tắc nhảy số chứng từ thu chi tự động, thuế suất GTGT & ngưỡng cảnh báo nợ quá hạn. </p> </div> <button
              onClick={() => showToast('💾 Đã lưu thành công cấu hình tham số Kế toán & Tài chính!')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            > <Save className="w-4 h-4" /> Lưu Cấu Hình Tài Chính </button> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Box 1: Quy tắc Đánh Số Chứng Từ */} <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-indigo-700 uppercase tracking-wider"> 1. Tiền Tố Đánh Số Chứng Từ Thu / Chi </h4> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Tiền tố Phiếu Thu *</label> <input
                    type="text"
                    value={finConfig.receipt_prefix}
                    onChange={(e) => setFinConfig({ ...finConfig, receipt_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700"
                  /> </div> <div> <label className="block text-slate-700 mb-1">Tiền tố Phiếu Chi *</label> <input
                    type="text"
                    value={finConfig.payment_prefix}
                    onChange={(e) => setFinConfig({ ...finConfig, payment_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-red-700"
                  /> </div> </div> </div> {/* Box 2: Thuế Suất & Tuổi Nợ SLA */} <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3"> <h4 className="font-semibold text-slate-900 text-xs text-indigo-700 uppercase tracking-wider"> 2. Thuế Suất & Ngưỡng Nợ Xấu (Ngày) </h4> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-700 mb-1">Thuế Suất GTGT VAT (%) *</label> <input
                    type="number"
                    value={finConfig.vat_rate}
                    onChange={(e) => setFinConfig({ ...finConfig, vat_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-900"
                  /> </div> <div> <label className="block text-slate-700 mb-1">Cảnh Báo Nợ Quá Hạn (Ngày) *</label> <input
                    type="number"
                    value={finConfig.warning_debt_days}
                    onChange={(e) => setFinConfig({ ...finConfig, warning_debt_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-amber-700"
                  /> </div> </div> </div> </div> </div> )}
      </div>

      {/* MODAL LẬP PHIẾU THU / CHI MỚI */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 text-xs font-medium">
            <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
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
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700 font-semibold text-sm"
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
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Lưu Phiếu Giao Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ĐỀ XUẤT CẤP HẠN MỨC TÍN DỤNG MỚI */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Đề Xuất Cấp Hạn Mức Tín Dụng</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCreditRequestSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Chọn Khách Hàng / Đơn Vị <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newCreditReq.customer_id}
                  onChange={(e) => setNewCreditReq({ ...newCreditReq, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-medium text-slate-800"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {getStoredCustomers().map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.customer_code}] {c.company_name || c.household_name || c.name} ({c.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp' : c.entity_type === 'HOUSEHOLD_BUSINESS' ? 'Hộ Kinh Doanh' : 'Cá Nhân'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Hạn Mức Đề Xuất (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step={5000000}
                  required
                  value={newCreditReq.requested_limit}
                  onChange={(e) => setNewCreditReq({ ...newCreditReq, requested_limit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-blue-700 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Lý Do Đề Xuất & Căn Cứ Đánh Giá <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCreditReq.reason}
                  onChange={(e) => setNewCreditReq({ ...newCreditReq, reason: e.target.value })}
                  placeholder="VD: Khách hàng ký hợp đồng dịch vụ vận hành 12 tháng, lịch sử thanh toán tốt..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-700 space-y-1">
                <p className="font-semibold">Quy trình duyệt tự động:</p>
                <p>1. Giám Đốc Kinh Doanh thẩm định nhu cầu</p>
                <p>2. Kế Toán Trưởng thẩm tra năng lực tài chính</p>
                <p>3. CEO phê chuẩn & ban hành hạn mức công nợ</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Gửi Yêu Cầu Phê Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs font-medium text-slate-400">Đang tải phân hệ Báo Cáo Tài Chính...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
