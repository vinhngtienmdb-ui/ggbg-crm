'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { INITIAL_PL_DATA, INITIAL_DEBT_INVOICES, getFinancialSummary } from '@/lib/financeStore';
import { ContractProfitLoss, DebtInvoice } from '@/types/finance';

export default function FinancePage() {
  const [plStatements] = useState<ContractProfitLoss[]>(INITIAL_PL_DATA);
  const [debtInvoices, setDebtInvoices] = useState<DebtInvoice[]>(INITIAL_DEBT_INVOICES);
  const [activeTab, setActiveTab] = useState<'P_L' | 'DEBT'>('P_L');
  const [toastMessage, setToastMessage] = useState('');

  const summary = getFinancialSummary();

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

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-5 text-white border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium mb-2">
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Financial & P&L Analytics Engine</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Báo Cáo Tài Chính, Lợi Nhuận Gộp P&L & Quản Lý Công Nợ
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Phân tích tỷ suất lợi nhuận gộp từng hợp đồng vận hành TMĐT và theo dõi kỳ thu phí nợ dịch vụ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('P_L')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'P_L' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" /> Báo Cáo P&L
          </button>
          <button
            onClick={() => setActiveTab('DEBT')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'DEBT' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Quản Lý Công Nợ
          </button>
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
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
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
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
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
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
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
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
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
