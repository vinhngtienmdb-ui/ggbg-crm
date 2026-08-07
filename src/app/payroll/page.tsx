'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Printer,
  Eye,
  Check,
  X,
  Search,
  Filter,
  RefreshCw,
  Building2,
  User,
  Settings,
  Save,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import {
  PayrollSheet,
  PayrollSettings,
  PayrollStatus
} from '@/types';
import {
  getPayrollByPeriod,
  generateMonthlyPayroll,
  sendPaystubEmail,
  sendBatchPaystubs,
  getPayrollSettings,
  savePayrollSettings,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import PaystubModal from '@/components/payroll/PaystubModal';
import PayrollAnalyticsDashboard from '@/components/payroll/PayrollAnalyticsDashboard';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'payroll' | 'paystubs' | 'settings'>('reports');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');

  // Store states
  const [payrolls, setPayrolls] = useState<PayrollSheet[]>([]);
  const [paySettings, setPaySettings] = useState<PayrollSettings>(() => getPayrollSettings());

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [selectedPaystub, setSelectedPaystub] = useState<PayrollSheet | null>(null);
  const [isPaystubOpen, setIsPaystubOpen] = useState(false);

  const reloadData = () => {
    setPayrolls(getPayrollByPeriod(selectedPeriod));
    setPaySettings(getPayrollSettings());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener(PAYROLL_UPDATED_EVENT, reloadData);
    return () => {
      window.removeEventListener(PAYROLL_UPDATED_EVENT, reloadData);
    };
  }, [selectedPeriod]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCalculatePayroll = () => {
    const updated = generateMonthlyPayroll(selectedPeriod);
    setPayrolls(updated);
    showToast(`⚡ Đã tự động tính bảng lương 3P tháng ${selectedPeriod}!`);
  };

  const handleSendSinglePaystub = (id: string) => {
    sendPaystubEmail(id);
    showToast(`📧 Đã gửi phiếu lương qua Email & Zalo ZNS thành công!`);
    setIsPaystubOpen(false);
  };

  const handleBatchSendPaystubs = () => {
    sendBatchPaystubs(selectedPeriod);
    showToast(`📧 Đã gửi hàng loạt phiếu lương cho tất cả nhân sự kỳ ${selectedPeriod}!`);
  };

  const handleSavePayrollSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePayrollSettings(paySettings);
    // Recalculate payroll with new settings
    generateMonthlyPayroll(selectedPeriod);
    reloadData();
    showToast('⚙️ Đã lưu cấu hình cài đặt Bảng Lương & Phụ Cấp!');
  };

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(
      (p) =>
        p.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payroll_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payrolls, searchTerm]);

  const stats = useMemo(() => {
    const totalNet = payrolls.reduce((acc, curr) => acc + curr.net_salary, 0);
    const totalGross = payrolls.reduce((acc, curr) => acc + curr.total_gross_income, 0);
    const totalTax = payrolls.reduce((acc, curr) => acc + curr.personal_income_tax, 0);
    const totalInsurance = payrolls.reduce(
      (acc, curr) => acc + curr.bhxh_deduction + curr.bhyt_deduction + curr.bhtn_deduction,
      0
    );

    return { totalNet, totalGross, totalTax, totalInsurance };
  }, [payrolls]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Bảng Lương & Phụ Cấp 3P</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Module Bảng Lương
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tính toán lương P1-P2-P3 tự động, rà soát BHXH, khấu trừ Thuế TNCN & phát hành phiếu lương qua Zalo ZNS/Email
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCalculatePayroll}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Tính Lương Tự Động
          </button>
          <button
            onClick={handleBatchSendPaystubs}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" /> Gửi Bảng Lương Hàng Loạt
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reports' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> Báo Cáo
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'payroll' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-blue-400" /> Bảng Lương 3P
        </button>

        <button
          onClick={() => setActiveTab('paystubs')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'paystubs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4 text-purple-400" /> Phiếu Lương ({payrolls.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-amber-400" /> Cài Đặt
        </button>
      </div>

      {/* TAB 1: DEDICATED PAYROLL ANALYTICS DASHBOARD */}
      {activeTab === 'reports' && (
        <PayrollAnalyticsDashboard payrolls={payrolls} />
      )}

      {/* Top Cards Summary */}
      {activeTab !== 'settings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-bold block">Tổng Lương Thực Nhận (NET)</span>
              <span className="text-xl font-semibold text-emerald-700 mt-1 block">
                {stats.totalNet.toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-[11px] text-slate-400">Chi trả qua tài khoản ngân hàng</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-blue-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-bold block">Tổng Quỹ Lương Gross</span>
              <span className="text-xl font-semibold text-blue-700 mt-1 block">
                {stats.totalGross.toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-[11px] text-slate-400">P1 + P2 + P3 + OT + Thưởng</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-purple-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-bold block">Tổng Trích Nộp Bảo Hiểm</span>
              <span className="text-xl font-semibold text-purple-700 mt-1 block">
                {stats.totalInsurance.toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-[11px] text-slate-400">BHXH + BHYT + BHTN (10.5%)</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-bold block">Tổng Thuế TNCN Khấu Trừ</span>
              <span className="text-xl font-semibold text-amber-700 mt-1 block">
                {stats.totalTax.toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-[11px] text-slate-400">Tạm tính nộp ngân sách nhà nước</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {activeTab !== 'settings' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Kỳ Đánh Giá Lương:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl focus:outline-none"
            >
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Tháng 08/2026">Tháng 08/2026</option>
              <option value="Tháng 06/2026">Tháng 06/2026</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên nhân sự, mã lương, phòng ban..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>
        </div>
      )}

      {/* TAB 1 & 2: PAYROLL TABLE / PAYSTUBS */}
      {(activeTab === 'payroll' || activeTab === 'paystubs') && (
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Bảng Lương Chi Tiết {selectedPeriod} ({filteredPayrolls.length} Nhân Sự)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Tự động kết nối Lương P3 từ Module Performance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã & Nhân Sự</th>
                  <th className="py-3.5 px-4 text-right">Lương P1 (Cứng)</th>
                  <th className="py-3.5 px-4 text-right">Phụ Cấp P2</th>
                  <th className="py-3.5 px-4 text-right">Lương P3 (Hiệu Suất)</th>
                  <th className="py-3.5 px-4 text-right">OT & Thưởng</th>
                  <th className="py-3.5 px-4 text-right">Khấu Trừ</th>
                  <th className="py-3.5 px-4 text-right">Lương Thực Nhận (NET)</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPayrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-bold text-blue-600 block">{p.payroll_code}</span>
                      <span className="font-bold text-slate-900 block truncate">{p.employee_name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{p.department}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {p.p1_calculated_salary.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                      {p.p2_allowances.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700">
                      {p.p3_performance_salary.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-700">
                      {(p.ot_salary + p.bonus_amount).toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600">
                      -{p.total_deductions.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 text-sm">
                      {p.net_salary.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {p.status === 'SENT_PAYSTUB' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          ✅ Đã Gửi ZNS/Email
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                          📝 Bản Thảo
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedPaystub(p);
                            setIsPaystubOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-bold"
                          title="Xem Chi Tiết Phiếu Lương"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendSinglePaystub(p.id)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg font-bold"
                          title="Gửi Phiếu Lương Qua Email/Zalo"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYROLL SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSavePayrollSettings} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900">Cấu Hình Cài Đặt Bảng Lương, Phụ Cấp & Bảo Hiểm</h3>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-blue-700 uppercase tracking-wider">
              1. Cấu Hình Phụ Cấp P2 (Hàng Tháng)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trợ Cấp Ăn Trưa (VND/Tháng)</label>
                <input
                  type="number"
                  step={50000}
                  value={paySettings.p2_lunch_allowance}
                  onChange={(e) => setPaySettings({ ...paySettings, p2_lunch_allowance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trợ Cấp Điện Thoại (VND/Tháng)</label>
                <input
                  type="number"
                  step={50000}
                  value={paySettings.p2_phone_allowance}
                  onChange={(e) => setPaySettings({ ...paySettings, p2_phone_allowance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trợ Cấp Đi Lại / Xăng Xe (VND/Tháng)</label>
                <input
                  type="number"
                  step={50000}
                  value={paySettings.p2_transport_allowance}
                  onChange={(e) => setPaySettings({ ...paySettings, p2_transport_allowance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs text-purple-700 uppercase tracking-wider">
              2. Tỷ Lệ Trích Nộp Bảo Hiểm & Mức Phạt Đi Muộn
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tỷ Lệ BHXH Nhân Viên (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={paySettings.bhxh_percent}
                  onChange={(e) => setPaySettings({ ...paySettings, bhxh_percent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tỷ Lệ BHYT Nhân Viên (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={paySettings.bhyt_percent}
                  onChange={(e) => setPaySettings({ ...paySettings, bhyt_percent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tỷ Lệ BHTN Nhân Viên (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={paySettings.bhtn_percent}
                  onChange={(e) => setPaySettings({ ...paySettings, bhtn_percent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức Phạt Đi Muộn (VND / Lần)</label>
                <input
                  type="number"
                  step={10000}
                  value={paySettings.late_penalty_per_instance}
                  onChange={(e) => setPaySettings({ ...paySettings, late_penalty_per_instance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs text-amber-700 uppercase tracking-wider">
              3. Giảm Trừ Thuế TNCN & Hệ Số OT
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức Giảm Trừ Bản Thân (VND/Tháng)</label>
                <input
                  type="number"
                  step={500000}
                  value={paySettings.personal_tax_deduction_self}
                  onChange={(e) => setPaySettings({ ...paySettings, personal_tax_deduction_self: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hệ Số Tăng Ca Ngày Thường (OT)</label>
                <input
                  type="number"
                  step={0.1}
                  value={paySettings.ot_multiplier_standard}
                  onChange={(e) => setPaySettings({ ...paySettings, ot_multiplier_standard: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hệ Số Tăng Ca Cuối Tuần / Ngày Nghỉ</label>
                <input
                  type="number"
                  step={0.1}
                  value={paySettings.ot_multiplier_weekend}
                  onChange={(e) => setPaySettings({ ...paySettings, ot_multiplier_weekend: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Cài Đặt Bảng Lương
            </button>
          </div>
        </form>
      )}

      {/* PAYSTUB MODAL */}
      <PaystubModal
        isOpen={isPaystubOpen}
        onClose={() => setIsPaystubOpen(false)}
        payroll={selectedPaystub}
        onSendEmail={handleSendSinglePaystub}
      />
    </div>
  );
}
