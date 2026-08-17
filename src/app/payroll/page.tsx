'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Download,
  FileText,
  Percent,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  HelpCircle,
  Receipt,
  ArrowRight,
  UserCheck,
  Crown,
  Lock,
  Unlock,
  History,
  RotateCcw,
  Landmark,
  Building,
  CheckCircle,
  Clock,
  FileCheck
} from 'lucide-react';
import {
  PayrollSheet,
  PayrollSettings,
  PayrollStatus,
  PayrollApprovalPeriod,
  PayrollPeriodStatus,
  BankPaymentBatch,
  BankDisbursementItem
} from '@/types';
import {
  getPayrollByPeriod,
  getAllHistoricalPayrolls,
  AVAILABLE_PAYROLL_PERIODS,
  generateMonthlyPayroll,
  sendPaystubEmail,
  sendBatchPaystubs,
  getPayrollSettings,
  savePayrollSettings,
  getPayrollApprovalPeriod,
  submitHrCheck,
  approveHrd,
  approveCeo,
  rejectPayrollApproval,
  getBankPaymentBatchByPeriod,
  generateBankPaymentBatch,
  confirmBankDisbursement,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import { exportPayrollToXlsx, exportBankBatchToXlsx } from '@/lib/excelExport';
import PaystubModal from '@/components/payroll/PaystubModal';
import PayrollAnalyticsDashboard from '@/components/payroll/PayrollAnalyticsDashboard';
import { formatCurrency } from '@/lib/formatters';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'payroll' | 'paystubs' | 'banking'>('reports');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');

  // Role Scope Switcher: 'ADMIN' (Quản Trị Hệ Thống) vs 'PERSONAL' (Cá Nhân Xem Phiếu Lương Của Mình)
  const [viewScopeMode, setViewScopeMode] = useState<'ADMIN' | 'PERSONAL'>('ADMIN');
  const [myEmployeeCode, setMyEmployeeCode] = useState<string>('NV-00101'); // Mã nhân viên cá nhân (e.g. Trần Văn Hoàng)

  // Store states
  const [payrolls, setPayrolls] = useState<PayrollSheet[]>([]);
  const [paySettings, setPaySettings] = useState<PayrollSettings>(() => getPayrollSettings());
  const [approvalInfo, setApprovalInfo] = useState<PayrollApprovalPeriod>(() => getPayrollApprovalPeriod('Tháng 07/2026'));
  const [bankBatch, setBankBatch] = useState<BankPaymentBatch | undefined>(() => getBankPaymentBatchByPeriod('Tháng 07/2026'));

  const [searchTerm, setSearchTerm] = useState('');
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [selectedPaystub, setSelectedPaystub] = useState<PayrollSheet | null>(null);
  const [isPaystubOpen, setIsPaystubOpen] = useState(false);
  const [isFullReportModalOpen, setIsFullReportModalOpen] = useState(false);
  const [isUncModalOpen, setIsUncModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Approval Form State
  const [approvalActorName, setApprovalActorName] = useState('Đặng Kim Anh');
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Selected Bank Source
  const [sourceBank, setSourceBank] = useState<'TCB' | 'MBB' | 'VCB'>('TCB');

  const reloadData = () => {
    if (selectedPeriod === 'ALL') {
      setPayrolls(getAllHistoricalPayrolls());
    } else {
      setPayrolls(getPayrollByPeriod(selectedPeriod));
    }
    setPaySettings(getPayrollSettings());
    setApprovalInfo(getPayrollApprovalPeriod(selectedPeriod));
    setBankBatch(getBankPaymentBatchByPeriod(selectedPeriod));
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
    reloadData();
    showToast(`⚡ Đã tự động tính toán bảng lương 3P tháng ${selectedPeriod}!`);
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

  // Export Excel XLSX Bảng Lương
  const handleExportPayrollXlsx = () => {
    exportPayrollToXlsx(selectedPeriod);
    showToast(`📥 Đã xuất file Excel (*.xlsx) bảng lương ${selectedPeriod} thành công!`);
  };

  // Xuất file lệnh chuyển tiền ngân hàng (*.xlsx)
  const handleExportBankXlsx = (format: 'VCB' | 'TCB' | 'MBB' | 'GENERAL') => {
    if (!bankBatch) {
      const generated = generateBankPaymentBatch(selectedPeriod);
      setBankBatch(generated);
    }
    const currentBatch = bankBatch || generateBankPaymentBatch(selectedPeriod);
    exportBankBatchToXlsx(currentBatch.id, format);
    showToast(`📥 Đã xuất file Excel (*.xlsx) lệnh chuyển tiền ngân hàng (${format}) thành công!`);
  };

  // Xử lý chuyển tiếp phê duyệt
  const handleProceedApproval = () => {
    if (approvalInfo.status === 'DRAFT') {
      const updated = submitHrCheck(selectedPeriod, approvalActorName || 'Nguyễn Thị Hoa', approvalNote || 'Đã kiểm tra đối soát số liệu công và lương.');
      setApprovalInfo(updated);
      showToast('✅ Chuyên viên HR đã xác nhận kiểm tra & trình GĐ Nhân sự!');
    } else if (approvalInfo.status === 'HR_CHECKED') {
      const updated = approveHrd(selectedPeriod, approvalActorName || 'Đặng Kim Anh', approvalNote || 'Đã thẩm định cơ cấu quỹ lương và trình CEO duyệt chi.');
      setApprovalInfo(updated);
      showToast('👑 GĐ Nhân Sự đã phê duyệt & trình Tổng Giám Đốc (CEO)!');
    } else if (approvalInfo.status === 'HRD_APPROVED') {
      const updated = approveCeo(selectedPeriod, approvalActorName || 'Trần Đình Hoàng', approvalNote || 'Phê duyệt chi ngân sách. Chuyển Kế toán trưởng chi tiền.');
      setApprovalInfo(updated);
      const batch = generateBankPaymentBatch(selectedPeriod);
      setBankBatch(batch);
      showToast('⭐ Tổng Giám Đốc (CEO) đã phê duyệt chi ngân sách bảng lương!');
    }
    setIsApprovalModalOpen(false);
    reloadData();
  };

  const handleRejectApproval = () => {
    if (!rejectReason.trim()) {
      showToast('⚠️ Vui lòng nhập lý do yêu cầu điều chỉnh!');
      return;
    }
    const updated = rejectPayrollApproval(selectedPeriod, approvalActorName || 'Cấp Quản Lý', rejectReason);
    setApprovalInfo(updated);
    setIsRejectModalOpen(false);
    setRejectReason('');
    showToast('↩️ Đã trả lại bảng lương và gửi yêu cầu điều chỉnh!');
    reloadData();
  };

  // Kế toán trưởng thực hiện lệnh chuyển khoản
  const handleConfirmDisbursement = () => {
    const currentBatch = bankBatch || generateBankPaymentBatch(selectedPeriod);
    const res = confirmBankDisbursement(selectedPeriod, currentBatch.id, 'Nguyễn Thu Thảo (Kế Toán Trưởng)');
    reloadData();
    showToast(`🚀 ${res.message}`);
  };

  // Filter payroll data based on View Scope (ADMIN vs PERSONAL)
  const scopedPayrolls = useMemo(() => {
    if (viewScopeMode === 'PERSONAL') {
      // Chế độ Cá Nhân: CHỈ xem phiếu lương của chính nhân sự đang đăng nhập
      return payrolls.filter((p) => p.employee_code === myEmployeeCode);
    }
    // Chế độ Quản Trị Hệ Thống: Xem toàn bộ nhân sự công ty
    return payrolls;
  }, [payrolls, viewScopeMode, myEmployeeCode]);

  const filteredPayrolls = useMemo(() => {
    return scopedPayrolls.filter(
      (p) =>
        p.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payroll_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scopedPayrolls, searchTerm]);

  const filteredBankItems = useMemo(() => {
    if (!bankBatch) return [];
    return bankBatch.items.filter(
      (item) =>
        item.employee_name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
        item.bank_account.includes(bankSearchTerm) ||
        item.bank_name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );
  }, [bankBatch, bankSearchTerm]);

  const stats = useMemo(() => {
    const totalNet = payrolls.reduce((acc, curr) => acc + curr.net_salary, 0);
    const totalGross = payrolls.reduce((acc, curr) => acc + curr.total_gross_income, 0);
    const totalTax = payrolls.reduce((acc, curr) => acc + curr.personal_income_tax, 0);
    
    // NLĐ đóng (10.5%)
    const totalEmployeeBhxh = payrolls.reduce((acc, curr) => acc + curr.bhxh_deduction, 0);
    const totalEmployeeBhyt = payrolls.reduce((acc, curr) => acc + curr.bhyt_deduction, 0);
    const totalEmployeeBhtn = payrolls.reduce((acc, curr) => acc + curr.bhtn_deduction, 0);
    const totalEmployeeInsurance = totalEmployeeBhxh + totalEmployeeBhyt + totalEmployeeBhtn;

    // Doanh nghiệp đóng (23.5%)
    const totalCompanyBhxh = payrolls.reduce((acc, curr) => acc + (curr.company_bhxh_contribution || Math.round((curr.insurance_salary || curr.base_salary) * 0.175)), 0);
    const totalCompanyBhyt = payrolls.reduce((acc, curr) => acc + (curr.company_bhyt_contribution || Math.round((curr.insurance_salary || curr.base_salary) * 0.03)), 0);
    const totalCompanyBhtn = payrolls.reduce((acc, curr) => acc + (curr.company_bhtn_contribution || Math.round((curr.insurance_salary || curr.base_salary) * 0.01)), 0);
    const totalCompanyUnion = payrolls.reduce((acc, curr) => acc + (curr.company_union_fee || Math.round((curr.insurance_salary || curr.base_salary) * 0.02)), 0);
    const totalCompanyInsurance = totalCompanyBhxh + totalCompanyBhyt + totalCompanyBhtn + totalCompanyUnion;
    const totalEmployerCost = totalGross + totalCompanyInsurance;

    const totalAdvances = payrolls.reduce((acc, curr) => acc + (curr.salary_advance_deduction || 0), 0);
    const totalPenalties = payrolls.reduce((acc, curr) => acc + curr.late_penalty_deduction, 0);

    return {
      totalNet,
      totalGross,
      totalTax,
      totalEmployeeBhxh,
      totalEmployeeBhyt,
      totalEmployeeBhtn,
      totalEmployeeInsurance,
      totalCompanyBhxh,
      totalCompanyBhyt,
      totalCompanyBhtn,
      totalCompanyUnion,
      totalCompanyInsurance,
      totalEmployerCost,
      totalAdvances,
      totalPenalties
    };
  }, [payrolls]);

  // Stepper Step Number (1 to 5)
  const currentStep = useMemo(() => {
    if (approvalInfo.status === 'DRAFT' || approvalInfo.status === 'CHANGES_REQUESTED') return 1;
    if (approvalInfo.status === 'HR_CHECKED') return 2;
    if (approvalInfo.status === 'HRD_APPROVED') return 3;
    if (approvalInfo.status === 'CEO_APPROVED') return 4;
    if (approvalInfo.status === 'DISBURSED') return 5;
    return 1;
  }, [approvalInfo.status]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Phê Duyệt Bảng Lương & Chi Trả Ngân Hàng
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                Quy Trình 5 Cấp
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lập biểu $\rightarrow$ Chuyên viên HR kiểm tra $\rightarrow$ GĐ Nhân sự duyệt $\rightarrow$ CEO duyệt $\rightarrow$ Kế toán trưởng lập lệnh chuyển khoản tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCalculatePayroll}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Tính Lương 3P</span>
          </button>
          <button
            onClick={handleExportPayrollXlsx}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => setIsFullReportModalOpen(true)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>In Báo Cáo A4</span>
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <History className="w-4 h-4 text-purple-600" />
            <span>Lịch Sử Duyệt</span>
          </button>
        </div>
      </div>

      {/* 5-STEP APPROVAL PIPELINE INTERACTIVE STEPPER BANNER */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Tiến Trình Thẩm Định & Phê Duyệt Bảng Lương {selectedPeriod}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {approvalInfo.status === 'CHANGES_REQUESTED' && (
              <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded-full font-semibold text-xs border border-red-200">
                ⚠️ Yêu Cầu Điều Chỉnh
              </span>
            )}
            {approvalInfo.status === 'DISBURSED' ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-semibold text-xs border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã Hoàn Tất Chi Trả
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full font-semibold text-xs border border-blue-200">
                Đang Xử Lý: Bước {currentStep}/5
              </span>
            )}
          </div>
        </div>

        {/* The 5 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1: Lập biểu C&B */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              currentStep > 1
                ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : currentStep === 1
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bước 1</span>
              {currentStep > 1 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <FileText className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">1. Lập Bảng Lương</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{approvalInfo.created_by}</p>
          </div>

          {/* Step 2: Chuyên viên HR kiểm tra */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              currentStep > 2
                ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : currentStep === 2
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bước 2</span>
              {currentStep > 2 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : currentStep === 2 ? (
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">2. HR Kiểm Tra</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {approvalInfo.hr_checked_by ? `Đã duyệt: ${approvalInfo.hr_checked_by}` : 'Chuyên viên rà soát'}
            </p>
          </div>

          {/* Step 3: GĐ Nhân sự duyệt */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              currentStep > 3
                ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : currentStep === 3
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bước 3</span>
              {currentStep > 3 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : currentStep === 3 ? (
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">3. GĐ Nhân Sự Duyệt</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {approvalInfo.hrd_approved_by ? `Đã duyệt: ${approvalInfo.hrd_approved_by}` : 'Trưởng phòng / HRD'}
            </p>
          </div>

          {/* Step 4: CEO duyệt chi */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              currentStep > 4
                ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : currentStep === 4
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bước 4</span>
              {currentStep > 4 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : currentStep === 4 ? (
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <Crown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">4. Tổng Giám Đốc (CEO)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {approvalInfo.ceo_approved_by ? `Đã duyệt: ${approvalInfo.ceo_approved_by}` : 'Ký duyệt chi quỹ lương'}
            </p>
          </div>

          {/* Step 5: Kế toán trưởng lập lệnh & chi tiền */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              currentStep === 5
                ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bước 5</span>
              {currentStep === 5 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Landmark className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">5. Kế Toán Chi Tiền</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {approvalInfo.disbursed_by ? `Đã chi: ${approvalInfo.disbursed_by}` : 'Lệnh chuyển khoản tự động'}
            </p>
          </div>
        </div>

        {/* Action Controls for Current Step */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {approvalInfo.status === 'DRAFT' && 'Bảng lương mới khởi tạo. Cần Chuyên viên C&B kiểm tra và ký xác nhận rà soát.'}
              {approvalInfo.status === 'HR_CHECKED' && 'Chuyên viên HR đã kiểm tra xong. Đang chờ Trưởng phòng / Giám đốc Nhân sự thẩm định.'}
              {approvalInfo.status === 'HRD_APPROVED' && 'GĐ Nhân sự đã duyệt. Đang chờ Tổng Giám Đốc (CEO) ký duyệt chi ngân sách.'}
              {approvalInfo.status === 'CEO_APPROVED' && 'CEO đã phê duyệt chi! Bảng lương sẵn sàng để Kế toán trưởng lập lệnh chuyển khoản ngân hàng.'}
              {approvalInfo.status === 'DISBURSED' && `Đã hoàn tất chuyển khoản chi trả quỹ lương ${formatCurrency(stats.totalNet)} qua ${approvalInfo.bank_account_source || 'Ngân hàng'}.`}
              {approvalInfo.status === 'CHANGES_REQUESTED' && 'Bảng lương đang có yêu cầu điều chỉnh từ cấp quản lý. Vui lòng rà soát lại.'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {approvalInfo.status === 'DRAFT' && (
              <button
                onClick={() => {
                  setApprovalActorName('Nguyễn Thị Hoa (Chuyên viên C&B)');
                  setApprovalNote('Đã rà soát chi tiết 100% dòng lương, khớp ngày công, BHXH và thuế TNCN.');
                  setIsApprovalModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Chuyên Viên HR Xác Nhận Kiểm Tra</span>
              </button>
            )}

            {approvalInfo.status === 'HR_CHECKED' && (
              <>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yêu Cầu Sửa</span>
                </button>
                <button
                  onClick={() => {
                    setApprovalActorName('Đặng Kim Anh (GĐ Nhân Sự)');
                    setApprovalNote('Đã thẩm định quỹ lương và cơ cấu thưởng P3, đồng ý trình Tổng Giám Đốc.');
                    setIsApprovalModalOpen(true);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>GĐ Nhân Sự Duyệt & Trình CEO</span>
                </button>
              </>
            )}

            {approvalInfo.status === 'HRD_APPROVED' && (
              <>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yêu Cầu Sửa</span>
                </button>
                <button
                  onClick={() => {
                    setApprovalActorName('Trần Đình Hoàng (Tổng Giám Đốc / CEO)');
                    setApprovalNote('Phê duyệt chi ngân sách quỹ lương tháng. Chuyển Kế toán trưởng chi tiền.');
                    setIsApprovalModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span>CEO Ký Duyệt Chi Ngân Sách</span>
                </button>
              </>
            )}

            {approvalInfo.status === 'CEO_APPROVED' && (
              <button
                onClick={() => {
                  const batch = generateBankPaymentBatch(selectedPeriod);
                  setBankBatch(batch);
                  setActiveTab('banking');
                  showToast('⚡ Đã chuyển sang màn hình Lập Lệnh Chuyển Khoản Ngân Hàng!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Landmark className="w-4 h-4" />
                <span>Kế Toán Trưởng: Lập Lệnh Chuyển Khoản</span>
              </button>
            )}

            {approvalInfo.status === 'DISBURSED' && (
              <button
                onClick={() => setActiveTab('banking')}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>Xem Lệnh Chuyển Khoản ({bankBatch?.batch_code || 'UNC'})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Multi-Dimensional Cost Metrics - 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Card 1: NET Salary */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium block">Lương Thực Nhận (NET)</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block tabular-nums">
              {formatCurrency(stats.totalNet)}
            </span>
            <span className="text-[10px] text-slate-400">Chi trả vào TK ngân hàng</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Total Gross */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium block">Tổng Thu Nhập Gross</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 block tabular-nums">
              {formatCurrency(stats.totalGross)}
            </span>
            <span className="text-[10px] text-slate-400">P1 + P2 + P3 + OT + Thưởng</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Employee Insurance (10.5%) */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium block">BHXH NLĐ Trích Nộp</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5 block tabular-nums">
              {formatCurrency(stats.totalEmployeeInsurance)}
            </span>
            <span className="text-[10px] text-slate-400">BHXH 8% + BHYT 1.5% + BHTN 1%</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Employer Insurance (23.5%) */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium block">Doanh Nghiệp Đóng (23.5%)</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block tabular-nums">
              {formatCurrency(stats.totalCompanyInsurance)}
            </span>
            <span className="text-[10px] text-slate-400">BHXH 17.5% + BHYT 3% + BHTN 1% + KPCĐ 2%</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>

        {/* Card 5: PIT Tax & Deductions */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium block">Thuế TNCN & Tạm Ứng</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 block tabular-nums">
              {formatCurrency(stats.totalTax + stats.totalAdvances + stats.totalPenalties)}
            </span>
            <span className="text-[10px] text-slate-400">Thuế {formatCurrency(stats.totalTax)} · Tạm ứng {formatCurrency(stats.totalAdvances)}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (4 TABS) */}
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-medium scrollbar-none touch-scroll">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reports'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>1. Báo Cáo Chi Phí Tổng Thể</span>
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'payroll'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          <span>2. Bảng Lương 3P & Khấu Trừ Chi Tiết ({payrolls.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('paystubs')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'paystubs'
              ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          <span>3. Danh Sách Phiếu Lương Paystub ({payrolls.length})</span>
        </button>
        <button
          onClick={() => {
            if (!bankBatch) {
              const generated = generateBankPaymentBatch(selectedPeriod);
              setBankBatch(generated);
            }
            setActiveTab('banking');
          }}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'banking'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-indigo-600" />
          <span>4. Lệnh Chuyển Khoản Ngân Hàng Tự Động</span>
        </button>
      </div>

      {/* TAB 1: DEDICATED PAYROLL ANALYTICS DASHBOARD */}
      {activeTab === 'reports' && <PayrollAnalyticsDashboard payrolls={payrolls} />}

      {/* Filter Bar for Tab 2 & 3 */}
      {(activeTab === 'payroll' || activeTab === 'paystubs') && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Kỳ Đánh Giá Lương:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-xl focus:outline-none"
            >
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Tháng 08/2026">Tháng 08/2026</option>
              <option value="Tháng 06/2026">Tháng 06/2026</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên nhân sự, mã lương, phòng ban..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>
        </div>
      )}

      {/* TAB 2 & 3: PAYROLL TABLE / PAYSTUBS */}
      {(activeTab === 'payroll' || activeTab === 'paystubs') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Bảng Lương 3P, Bảo Hiểm & Khấu Trừ Chi Tiết {selectedPeriod} ({filteredPayrolls.length} Nhân Sự)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Bóc tách riêng: BHXH NLĐ (10.5%) vs BHXH Doanh nghiệp (23.5%), Thuế TNCN, Tạm ứng lương và Lương Thực Nhận (NET)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPayrollXlsx}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" /> Xuất File Excel (.xlsx)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase text-[11px]">
                  <th className="py-3 px-3">Mã & Nhân Sự</th>
                  <th className="py-3 px-2 text-right" title="Lương vị trí chức danh P1">Lương P1 (Cứng)</th>
                  <th className="py-3 px-2 text-right" title="Phụ cấp P2">Phụ Cấp P2</th>
                  <th className="py-3 px-2 text-right" title="Lương hiệu suất P3">Lương P3 (KPI)</th>
                  <th className="py-3 px-2 text-right" title="Tiền làm thêm giờ OT">Tiền OT</th>
                  <th className="py-3 px-2 text-right font-bold text-blue-700" title="Tổng thu nhập trước thuế">Tổng Gross</th>
                  <th className="py-3 px-2 text-right text-purple-600" title="BHXH 8% + BHYT 1.5% + BHTN 1%">BHXH NLĐ (10.5%)</th>
                  <th className="py-3 px-2 text-right text-indigo-600" title="BHXH 17.5% + BHYT 3% + BHTN 1% + KPCĐ 2%">BHXH C.Ty (23.5%)</th>
                  <th className="py-3 px-2 text-right text-amber-600" title="Thuế thu nhập cá nhân tạm khấu trừ">Thuế TNCN</th>
                  <th className="py-3 px-2 text-right text-slate-600" title="Tạm ứng trong kỳ & Phạt đi muộn">Tạm Ứng / Phạt</th>
                  <th className="py-3 px-2 text-right font-bold text-emerald-700" title="Lương thực nhận vào tài khoản">Lương NET</th>
                  <th className="py-3 px-2 text-right font-semibold text-slate-700 dark:text-slate-300" title="Tổng chi phí doanh nghiệp thực tế = Gross + BHXH Công ty">Tổng Chi Phí C.Ty</th>
                  <th className="py-3 px-2 text-center">Trạng Thái</th>
                  <th className="py-3 px-2 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredPayrolls.map((p) => {
                  const companyInsurance = p.total_company_insurance_cost || Math.round((p.insurance_salary || p.base_salary) * 0.235);
                  const totalEmployerCost = p.total_company_cost || (p.total_gross_income + companyInsurance);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold text-blue-600 block">{p.payroll_code}</span>
                        <span className="font-semibold text-slate-900 dark:text-white block truncate">{p.employee_name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{p.department}</span>
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                        {formatCurrency(p.p1_calculated_salary)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                        {formatCurrency(p.p2_allowances)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-blue-700 dark:text-blue-400 font-semibold">
                        {formatCurrency(p.p3_performance_salary)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-purple-700 dark:text-purple-400 font-medium">
                        {formatCurrency(p.ot_salary + (p.bonus_amount || 0))}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums font-bold text-blue-800 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20">
                        {formatCurrency(p.total_gross_income)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-red-600 font-medium">
                        -{formatCurrency(p.total_employee_insurance || (p.bhxh_deduction + p.bhyt_deduction + p.bhtn_deduction))}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-indigo-700 dark:text-indigo-400 font-semibold">
                        {formatCurrency(companyInsurance)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-amber-700 dark:text-amber-400 font-medium">
                        -{formatCurrency(p.personal_income_tax)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-slate-600 text-[11px]">
                        {(p.salary_advance_deduction || 0) + p.late_penalty_deduction > 0 ? (
                          <span>-{formatCurrency((p.salary_advance_deduction || 0) + p.late_penalty_deduction)}</span>
                        ) : (
                          '0'
                        )}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-50/40 dark:bg-emerald-950/20">
                        {formatCurrency(p.net_salary)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                        {formatCurrency(totalEmployerCost)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {p.status === 'SENT_PAYSTUB' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-semibold text-[10px]">
                            Đã Gửi
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full font-semibold text-[10px]">
                            Bản Thảo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedPaystub(p);
                              setIsPaystubOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg font-medium"
                            title="Xem Chi Tiết Phiếu Lương Paystub"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendSinglePaystub(p.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg font-medium"
                            title="Gửi Phiếu Lương Qua Email/Zalo ZNS"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LỆNH CHUYỂN KHOẢN NGÂN HÀNG TỰ ĐỘNG (BANK PAYMENT DISBURSEMENT) */}
      {activeTab === 'banking' && (
        <div className="space-y-5">
          {/* Bank Batch Header Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-[11px] font-semibold mb-1">
                  <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Kế Toán Trưởng: Lệnh Chi Trả Ngân Hàng Tự Động</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Danh Sách Lệnh Chuyển Khoản Lương Kỳ {selectedPeriod} ({bankBatch?.batch_code || 'UNC-AUTO'})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động sinh từ Bảng Lương đã được CEO duyệt. Hỗ trợ xuất file Excel (*.xlsx) theo mẫu Vietcombank, Techcombank, MBBank và In Ủy Nhiệm Chi (UNC).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsUncModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>In Ủy Nhiệm Chi Lô (UNC)</span>
                </button>
                <button
                  onClick={handleConfirmDisbursement}
                  disabled={bankBatch?.status === 'COMPLETED'}
                  className={`px-4 py-2 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                    bankBatch?.status === 'COMPLETED'
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{bankBatch?.status === 'COMPLETED' ? '✓ Đã Hoàn Tất Chuyển Tiền' : '🚀 Xác Nhận Đã Chuyển Khoản Xong'}</span>
                </button>
              </div>
            </div>

            {/* Bank Source Selection & Export Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">Tài Khoản Nguồn Trích Nợ Của Công Ty:</span>
                <select
                  value={sourceBank}
                  onChange={(e) => setSourceBank(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="TCB">Techcombank - 19038888999988 (Trụ Sở)</option>
                  <option value="MBB">MBBank Quân Đội - 098888888888 (Chi Nhánh HN)</option>
                  <option value="VCB">Vietcombank - 00110088888888 (Sở Giao Dịch)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">Tổng Số Tiền NET Cần Chuyển Khoản:</span>
                <span className="text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400 block">
                  {formatCurrency(bankBatch?.total_amount || stats.totalNet)}
                </span>
                <span className="text-[10px] text-slate-400">Cho {bankBatch?.total_recipients || payrolls.length} nhân sự</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <span className="text-[11px] text-slate-500 font-medium block">Xuất File Excel (*.xlsx) Ngân Hàng:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleExportBankXlsx('TCB')}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-semibold"
                  >
                    Mẫu TCB (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExportBankXlsx('MBB')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold"
                  >
                    Mẫu MBB (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExportBankXlsx('VCB')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold"
                  >
                    Mẫu VCB (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExportBankXlsx('GENERAL')}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold"
                  >
                    Excel (.xlsx)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={bankSearchTerm}
                onChange={(e) => setBankSearchTerm(e.target.value)}
                placeholder="Tìm nhân viên, số tài khoản, ngân hàng..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Hiển thị: <strong>{filteredBankItems.length}</strong> / {bankBatch?.items.length || 0} lệnh chuyển
            </span>
          </div>

          {/* Bank Items Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase text-[10.5px]">
                    <th className="py-3 px-3">STT</th>
                    <th className="py-3 px-3">Mã & Họ Tên Nhân Sự</th>
                    <th className="py-3 px-3">Phòng Ban</th>
                    <th className="py-3 px-3">Ngân Hàng Thụ Hưởng</th>
                    <th className="py-3 px-3">Số Tài Khoản</th>
                    <th className="py-3 px-3 text-right font-bold text-emerald-700">Số Tiền Lương NET</th>
                    <th className="py-3 px-3">Nội Dung Chuyển Khoản</th>
                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredBankItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 text-slate-400 tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white block">{item.employee_name}</span>
                        <span className="text-[10px] font-semibold text-blue-600 block">{item.employee_code}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{item.department}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded font-semibold text-[11px]">
                          {item.bank_name}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white tracking-wider tabular-nums">
                        {item.bank_account}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs truncate font-medium">
                        {item.payment_content}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.status === 'SUCCESS' || bankBatch?.status === 'COMPLETED' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-semibold text-[10px] flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Đã Chuyển
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full font-semibold text-[10px]">
                            Chờ Chuyển
                          </span>
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

      {/* MODAL 1: FORM PHÊ DUYỆT TỪNG BƯỚC */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 font-sans">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm">
                  Xác Nhận Ký Phê Duyệt Bảng Lương ({selectedPeriod})
                </h3>
              </div>
              <button onClick={() => setIsApprovalModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-blue-900 dark:text-blue-200">
                <p className="font-semibold">
                  {approvalInfo.status === 'DRAFT' && 'Bước 1 $\\rightarrow$ Bước 2: Chuyên Viên HR Ký Biên Bản Kiểm Tra'}
                  {approvalInfo.status === 'HR_CHECKED' && 'Bước 2 $\\rightarrow$ Bước 3: Giám Đốc Nhân Sự Phê Duyệt & Trình CEO'}
                  {approvalInfo.status === 'HRD_APPROVED' && 'Bước 3 $\\rightarrow$ Bước 4: Tổng Giám Đốc (CEO) Phê Duyệt Chi Ngân Sách'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Tổng quỹ lương chi trả NET: <strong className="tabular-nums">{formatCurrency(stats.totalNet)}</strong> ({payrolls.length} nhân sự)
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Họ Tên & Chức Danh Người Ký Phê Duyệt:
                </label>
                <input
                  type="text"
                  value={approvalActorName}
                  onChange={(e) => setApprovalActorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ý Kiến & Ghi Chú Thẩm Định:
                </label>
                <textarea
                  rows={3}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Nhập nhận xét rà soát..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs focus:outline-none font-sans"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Hủy Bỏ
                </button>
                <button
                  onClick={handleProceedApproval}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" /> Ký Duyệt & Chuyển Bước Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM TRẢ LẠI / YÊU CẦU ĐIỀU CHỈNH */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 font-sans">
            <div className="bg-red-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-sm">Trả Lại Yêu Cầu Điều Chỉnh Bảng Lương</h3>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lý Do Yêu Cầu Điều Chỉnh (Bắt Buộc):
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Cần kiểm tra lại tiền thưởng OT của phòng Kinh Doanh, chưa trừ tạm ứng của nhân viên..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRejectApproval}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Gửi Yêu Cầu Điều Chỉnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AUDIT LOGS LỊCH SỬ KÝ DUYỆT */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 font-sans">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-sm">Nhật Ký Ký Duyệt & Audit Trail Bảng Lương ({selectedPeriod})</h3>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {approvalInfo.logs.length === 0 ? (
                <p className="text-slate-400 italic">Chưa có lịch sử ký duyệt nào.</p>
              ) : (
                <div className="space-y-3">
                  {approvalInfo.logs.map((log, idx) => (
                    <div
                      key={log.id || idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {log.actor_name} <span className="font-normal text-slate-500">({log.actor_role})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 tabular-nums">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{log.note}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: IN ỦY NHIỆM CHI LÔ (UNC) A4 NGÂN HÀNG */}
      {isUncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-6 print:m-0 print:border-none print:shadow-none animate-in fade-in font-sans">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-sm">Xem Trước & In Lệnh Ủy Nhiệm Chi Lô (UNC) Ngân Hàng</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> In Ngay (Khổ A4)
                </button>
                <button onClick={() => setIsUncModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable UNC Document */}
            <div className="p-8 space-y-5 text-xs text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:p-6">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 uppercase">CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM</h2>
                  <p className="text-[11px] text-slate-500">Mã Số Thuế: 0109988776 • Hotline: 1900 6868</p>
                  <p className="text-[11px] text-slate-500">Địa chỉ: Tòa nhà GGBG Tower, Hà Nội</p>
                </div>
                <div className="text-right">
                  <h1 className="text-base font-bold text-indigo-800 uppercase">ỦY NHIỆM CHI LÔ CHI TRẢ LƯƠNG</h1>
                  <p className="text-xs font-semibold text-slate-700">MÃ LÔ: {bankBatch?.batch_code || 'UNC-GGBG'}</p>
                  <p className="text-[10px] text-slate-400">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border rounded-lg text-[11px]">
                <div>
                  <span className="text-slate-500 block">Đơn vị trích nợ (Bên chuyển):</span>
                  <p className="font-bold text-slate-900">CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM</p>
                  <p className="font-semibold">Số TK: 19038888999988</p>
                  <p>Tại Ngân hàng: Techcombank - Chi nhánh Hà Nội</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng số tiền chi trả lương:</span>
                  <p className="font-bold text-emerald-700 text-base tabular-nums">{formatCurrency(bankBatch?.total_amount || stats.totalNet)}</p>
                  <p className="italic text-slate-600">Số lượng người thụ hưởng: {bankBatch?.total_recipients || payrolls.length} nhân sự</p>
                </div>
              </div>

              {/* Beneficiary List */}
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-700">
                    <th className="py-2 px-2 border-r border-slate-300">STT</th>
                    <th className="py-2 px-2 border-r border-slate-300">Mã NV</th>
                    <th className="py-2 px-2 border-r border-slate-300">Họ Và Tên</th>
                    <th className="py-2 px-2 border-r border-slate-300">Ngân Hàng</th>
                    <th className="py-2 px-2 border-r border-slate-300">Số Tài Khoản</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Số Tiền (VNĐ)</th>
                    <th className="py-2 px-2">Nội Dung Chuyển Khoản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(bankBatch?.items || []).map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-1.5 px-2 tabular-nums border-r border-slate-200">{idx + 1}</td>
                      <td className="py-1.5 px-2 font-semibold border-r border-slate-200">{item.employee_code}</td>
                      <td className="py-1.5 px-2 font-semibold border-r border-slate-200">{item.employee_name}</td>
                      <td className="py-1.5 px-2 border-r border-slate-200">{item.bank_name}</td>
                      <td className="py-1.5 px-2 font-semibold border-r border-slate-200 tabular-nums">{item.bank_account}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums font-bold text-emerald-700 border-r border-slate-200">{formatCurrency(item.amount)}</td>
                      <td className="py-1.5 px-2 font-medium">{item.payment_content}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <td colSpan={5} className="py-2 px-2 text-center uppercase border-r border-slate-300">TỔNG CỘNG ({bankBatch?.items.length || 0} LỆNH)</td>
                    <td className="py-2 px-2 text-right tabular-nums text-emerald-800 text-xs border-r border-slate-300">{formatCurrency(bankBatch?.total_amount || stats.totalNet)}</td>
                    <td className="py-2 px-2"></td>
                  </tr>
                </tbody>
              </table>

              {/* 3 Official Signatures */}
              <div className="grid grid-cols-3 gap-4 text-center pt-8 text-xs">
                <div>
                  <p className="font-bold text-slate-900">KẾ TOÁN LẬP BIỂU</p>
                  <p className="text-[10px] text-slate-400">(Ký & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Nguyễn Thị Hoa</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">KẾ TOÁN TRƯỞNG</p>
                  <p className="text-[10px] text-slate-400">(Ký & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Nguyễn Thu Thảo</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">CHỦ TÀI KHOẢN / TỔNG GIÁM ĐỐC</p>
                  <p className="text-[10px] text-slate-400">(Ký, đóng dấu & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Trần Đình Hoàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: BÁO CÁO BẢNG LƯƠNG TỔNG HỢP IN ẤN / XUẤT PDF */}
      {isFullReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-6 print:m-0 print:border-none print:shadow-none animate-in fade-in font-sans">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm">Xem Trước Báo Cáo Bảng Lương & Chi Phí Tổng Thể ({selectedPeriod})</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> In Ngay / Tải PDF (A4 Ngang)
                </button>
                <button
                  onClick={() => setIsFullReportModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document A4 Content */}
            <div className="p-8 space-y-6 text-xs text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:p-6">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 uppercase">CÔNG TY CỔ PHẦN GGBINGO VIỆT NAM</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Trụ sở: Tòa nhà GGBG Tower, Hà Nội • MST: 0109988776</p>
                  <p className="text-[11px] text-slate-500 font-medium">Hệ thống Quản trị Doanh nghiệp ERP & Bảng Lương 3P</p>
                </div>
                <div className="text-right">
                  <h1 className="text-base font-bold text-blue-800 uppercase">BẢNG THANH TOÁN TIỀN LƯƠNG & BẢO HIỂM</h1>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">KỲ LƯƠNG: {selectedPeriod.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-400">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Summary Stats Table */}
              <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 border rounded-lg text-[11px]">
                <div>
                  <span className="text-slate-500 block">Tổng Quỹ Lương Gross:</span>
                  <span className="font-bold text-blue-700 text-xs tabular-nums">{formatCurrency(stats.totalGross)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng Trích Nộp BHXH NLĐ (10.5%):</span>
                  <span className="font-bold text-red-600 text-xs tabular-nums">{formatCurrency(stats.totalEmployeeInsurance)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng Bảo Hiểm C.Ty Đóng (23.5%):</span>
                  <span className="font-bold text-indigo-700 text-xs tabular-nums">{formatCurrency(stats.totalCompanyInsurance)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng Chi Trả NET Chuyển Khoản:</span>
                  <span className="font-bold text-emerald-700 text-xs tabular-nums">{formatCurrency(stats.totalNet)}</span>
                </div>
              </div>

              {/* Detail Table */}
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-700">
                    <th className="py-2 px-2 border-r border-slate-300">Mã NV</th>
                    <th className="py-2 px-2 border-r border-slate-300">Họ Và Tên</th>
                    <th className="py-2 px-2 border-r border-slate-300">Phòng Ban</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Lương P1</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Phụ Cấp P2</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Lương P3</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">OT & Thưởng</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Gross</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">BHXH NLĐ (10.5%)</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Thuế TNCN</th>
                    <th className="py-2 px-2 text-right border-r border-slate-300">Tạm Ứng/Phạt</th>
                    <th className="py-2 px-2 text-right font-bold text-emerald-800">Lương NET</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payrolls.map((p) => (
                    <tr key={p.id}>
                      <td className="py-1.5 px-2 font-semibold border-r border-slate-200">{p.employee_code}</td>
                      <td className="py-1.5 px-2 font-semibold border-r border-slate-200">{p.employee_name}</td>
                      <td className="py-1.5 px-2 border-r border-slate-200">{p.department}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums border-r border-slate-200 font-medium">{formatCurrency(p.p1_calculated_salary)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums border-r border-slate-200 font-medium">{formatCurrency(p.p2_allowances)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums border-r border-slate-200 font-medium">{formatCurrency(p.p3_performance_salary)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums border-r border-slate-200 font-medium">{formatCurrency(p.ot_salary + (p.bonus_amount || 0))}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums font-bold border-r border-slate-200">{formatCurrency(p.total_gross_income)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-red-600 border-r border-slate-200 font-medium">-{formatCurrency(p.total_employee_insurance || (p.bhxh_deduction + p.bhyt_deduction + p.bhtn_deduction))}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-red-600 border-r border-slate-200 font-medium">-{formatCurrency(p.personal_income_tax)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums border-r border-slate-200 font-medium">{formatCurrency((p.salary_advance_deduction || 0) + p.late_penalty_deduction)}</td>
                      <td className="py-1.5 px-2 text-right tabular-nums font-bold text-emerald-700">{formatCurrency(p.net_salary)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                    <td colSpan={3} className="py-2 px-2 text-center uppercase border-r border-slate-300">TỔNG CỘNG ({payrolls.length} NV)</td>
                    <td className="py-2 px-2 text-right tabular-nums border-r border-slate-300">{formatCurrency(payrolls.reduce((a, c) => a + c.p1_calculated_salary, 0))}</td>
                    <td className="py-2 px-2 text-right tabular-nums border-r border-slate-300">{formatCurrency(payrolls.reduce((a, c) => a + c.p2_allowances, 0))}</td>
                    <td className="py-2 px-2 text-right tabular-nums border-r border-slate-300">{formatCurrency(payrolls.reduce((a, c) => a + c.p3_performance_salary, 0))}</td>
                    <td className="py-2 px-2 text-right tabular-nums border-r border-slate-300">{formatCurrency(payrolls.reduce((a, c) => a + c.ot_salary + (c.bonus_amount || 0), 0))}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-blue-700 border-r border-slate-300">{formatCurrency(stats.totalGross)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-red-600 border-r border-slate-300">-{formatCurrency(stats.totalEmployeeInsurance)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-red-600 border-r border-slate-300">-{formatCurrency(stats.totalTax)}</td>
                    <td className="py-2 px-2 text-right tabular-nums border-r border-slate-300">{formatCurrency(stats.totalAdvances + stats.totalPenalties)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-emerald-800 text-xs">{formatCurrency(stats.totalNet)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 text-center pt-8 text-xs">
                <div>
                  <p className="font-bold text-slate-900">NGƯỜI LẬP BIỂU</p>
                  <p className="text-[10px] text-slate-400">(Ký & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Nguyễn Thị Hoa</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">KẾ TOÁN TRƯỞNG</p>
                  <p className="text-[10px] text-slate-400">(Ký & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Nguyễn Thu Thảo</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">TỔNG GIÁM ĐỐC DUYỆT</p>
                  <p className="text-[10px] text-slate-400">(Ký, đóng dấu & ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-slate-800">Trần Đình Hoàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
