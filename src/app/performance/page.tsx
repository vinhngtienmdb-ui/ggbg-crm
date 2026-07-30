'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Plus,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  Edit3,
  Trash2,
  Filter,
  Search,
  Calendar,
  Clock,
  Send,
  AlertTriangle,
  History,
  ShieldCheck,
  DollarSign,
  UserCheck,
  FileText,
  Lock,
  ChevronRight,
  BarChart3,
  Download
} from 'lucide-react';
import { PerformanceScorecard, FormulaWeights, RatingGrade, ScorecardStatus } from '@/types';
import {
  getScorecards,
  getScorecardsByPeriod,
  createScorecard,
  updateScorecard,
  deleteScorecard,
  getFormulaWeights,
  updateFormulaWeights,
  autoOpenMonthlyEvaluationScorecards,
  transitionPeriodToManager,
  transitionPeriodToHr,
  finalizePeriodScorecards,
  PERFORMANCE_UPDATED_EVENT
} from '@/lib/performanceStore';
import dynamic from 'next/dynamic';

const ScorecardModal = dynamic(() => import('@/components/performance/ScorecardModal'), { ssr: false });
const FormulaConfigModal = dynamic(() => import('@/components/performance/FormulaConfigModal'), { ssr: false });
const HrCriteriaModal = dynamic(() => import('@/components/performance/HrCriteriaModal'), { ssr: false });
import PerformanceAnalyticsDashboard from '@/components/performance/PerformanceAnalyticsDashboard';

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'list'>('reports');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');
  const [scorecards, setScorecards] = useState<PerformanceScorecard[]>([]);
  const [weights, setWeights] = useState<FormulaWeights>(() => getFormulaWeights());

  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [scorecardModalMode, setScorecardModalMode] = useState<'create' | 'edit'>('create');
  const [selectedScorecard, setSelectedScorecard] = useState<PerformanceScorecard | null>(null);

  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isHrCriteriaModalOpen, setIsHrCriteriaModalOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const reloadData = () => {
    setScorecards(getScorecardsByPeriod(selectedPeriod));
    setWeights(getFormulaWeights());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener(PERFORMANCE_UPDATED_EVENT, reloadData);
    return () => {
      window.removeEventListener(PERFORMANCE_UPDATED_EVENT, reloadData);
    };
  }, [selectedPeriod]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Filtered List
  const filteredScorecards = useMemo(() => {
    return scorecards.filter((sc) => {
      const matchesGrade = selectedGrade === 'ALL' || sc.rating_grade === selectedGrade;
      const matchesStatus = selectedStatus === 'ALL' || sc.status === selectedStatus;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        sc.employee_name.toLowerCase().includes(term) ||
        sc.employee_code.toLowerCase().includes(term) ||
        sc.department.toLowerCase().includes(term);

      return matchesGrade && matchesStatus && matchesSearch;
    });
  }, [scorecards, selectedGrade, selectedStatus, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = scorecards.length;
    if (total === 0) return { total: 0, gradeS: 0, gradeA: 0, totalP3Salary: 0 };

    const gradeS = scorecards.filter((s) => s.rating_grade === 'S').length;
    const gradeA = scorecards.filter((s) => s.rating_grade === 'A').length;
    const totalP3Salary = scorecards.reduce((acc, curr) => acc + (curr.calculated_p3_salary || 0), 0);

    return { total, gradeS, gradeA, totalP3Salary };
  }, [scorecards]);

  // Automation Triggers
  const handleAutoOpenMonth = () => {
    const updated = autoOpenMonthlyEvaluationScorecards(selectedPeriod);
    setScorecards(updated);
    showToast(`📅 Đã tự động mở bảng chấm điểm ngày 01 cho ${selectedPeriod}!`);
  };

  const handleTransitionToManager = () => {
    const updated = transitionPeriodToManager(selectedPeriod);
    setScorecards(updated);
    showToast(`🔒 Đã khóa tự đánh giá ngày 01 & chuyển Quản lý trực tiếp chấm điểm!`);
  };

  const handleTransitionToHr = () => {
    const updated = transitionPeriodToHr(selectedPeriod);
    setScorecards(updated);
    showToast(`📋 Đã hoàn thành chấm quản lý, chuyển HR tổng hợp & rà soát!`);
  };

  const handleFinalizeScorecards = () => {
    const updated = finalizePeriodScorecards(selectedPeriod);
    setScorecards(updated);
    showToast(`💰 Đã khóa bảng điểm & tự động tính Lương Hiệu Suất P3 thành công!`);
  };

  // CRUD Handlers
  const handleOpenCreateModal = () => {
    setSelectedScorecard(null);
    setScorecardModalMode('create');
    setIsScorecardModalOpen(true);
  };

  const handleOpenEditModal = (sc: PerformanceScorecard) => {
    setSelectedScorecard(sc);
    setScorecardModalMode('edit');
    setIsScorecardModalOpen(true);
  };

  const handleSaveScorecard = (scData: Partial<PerformanceScorecard>) => {
    if (scorecardModalMode === 'create') {
      createScorecard({ ...scData, period: selectedPeriod } as any);
      showToast('✅ Đã tạo bảng điểm mới thành công!');
    } else if (selectedScorecard) {
      updateScorecard(selectedScorecard.id, scData);
      showToast('✅ Đã cập nhật bảng điểm & tính lại lương P3 thành công!');
    }
    reloadData();
  };

  const handleSaveFormulaWeights = (newWeights: FormulaWeights) => {
    updateFormulaWeights(newWeights);
    reloadData();
    showToast('⚙️ Đã cập nhật công thức trọng số & tự động tính lại!');
  };

  const handleDeleteScorecard = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bảng điểm này?')) {
      deleteScorecard(id);
      reloadData();
      showToast('🗑️ Đã xóa bảng điểm!');
    }
  };

  const getStatusBadge = (status: ScorecardStatus) => {
    switch (status) {
      case 'DRAFT_SELF':
      case 'Draft':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Ngày 01 - Tự Đánh Giá
          </span>
        );
      case 'SUBMITTED_MANAGER':
      case 'Submitted':
        return (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-blue-600" /> Quản Lý Đang Chấm
          </span>
        );
      case 'REVIEWING_HR':
        return (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-600" /> HR Rà Soát
          </span>
        );
      case 'FINAL_LOCKED':
      case 'Locked':
      case 'Approved':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> Đã Khóa & Tính P3
          </span>
        );
    }
  };

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
            <Award className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Chấm Điểm Hiệu Suất & Lương P3 Tự Động</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Quy Trình Ngày 01 Tự Động
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tự động mở bảng điểm ngày 01, cá nhân tự nhập công việc, chuyển Quản lý & HR chấm điểm, xếp loại A-D & tự tính lương P3
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsHrCriteriaModalOpen(true)}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" /> Thiết Lập Tiêu Chí HR
          </button>
          <button
            onClick={() => setIsFormulaModalOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-4 h-4" /> Cấu Hình Trọng Số
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tạo Bảng Điểm Mới
          </button>
        </div>
      </div>

      {/* MODULE MAIN TABS: 📊 BÁO CÁO vs 📋 QUẢN LÝ */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto text-xs font-extrabold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'reports' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-400" /> 1. 📊 Báo Cáo & Phân Tích Hiệu Suất
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" /> 2. 📋 Bảng Chấm Điểm ({scorecards.length})
          </button>
        </div>

        <button
          onClick={() => showToast('📥 Đã xuất báo cáo Hiệu Suất & Lương P3 ra file Excel')}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4 text-purple-600" /> Xuất Báo Cáo Excel
        </button>
      </div>

      {/* TAB 1: 📊 BÁO CÁO & PHÂN TÍCH */}
      {activeTab === 'reports' && (
        <PerformanceAnalyticsDashboard scorecards={scorecards} />
      )}

      {/* AUTOMATED WORKFLOW TRIGGER BAR (Quy trình ngày 01 tự động) */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl space-y-3 border border-indigo-800/40">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-blue-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" /> Tiến Trình Tự Động Ngày 01 Hàng Tháng ({selectedPeriod})
          </span>
          <span className="text-[11px] text-slate-300">Tự khóa & chuyển tiếp phiếu chấm điểm theo quy định HR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={handleAutoOpenMonth}
            className="p-2.5 bg-slate-800/90 hover:bg-blue-900 text-white border border-slate-700 rounded-xl font-bold text-left transition-all flex flex-col justify-between"
          >
            <span className="text-[10px] text-emerald-400 font-mono">BƯỚC 1 (NGÀY 01)</span>
            <span className="text-xs font-extrabold">📅 Mở Tự Đánh Giá</span>
          </button>

          <button
            onClick={handleTransitionToManager}
            className="p-2.5 bg-slate-800/90 hover:bg-indigo-900 text-white border border-slate-700 rounded-xl font-bold text-left transition-all flex flex-col justify-between"
          >
            <span className="text-[10px] text-blue-400 font-mono">BƯỚC 2 (NGÀY 01 THÁNG SAU)</span>
            <span className="text-xs font-extrabold">👔 Chuyển Quản Lý Chấm</span>
          </button>

          <button
            onClick={handleTransitionToHr}
            className="p-2.5 bg-slate-800/90 hover:bg-purple-900 text-white border border-slate-700 rounded-xl font-bold text-left transition-all flex flex-col justify-between"
          >
            <span className="text-[10px] text-purple-400 font-mono">BƯỚC 3 (RÀ SOÁT HR)</span>
            <span className="text-xs font-extrabold">📋 Chuyển HR Hoàn Thiện</span>
          </button>

          <button
            onClick={handleFinalizeScorecards}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-left transition-all shadow-md flex flex-col justify-between"
          >
            <span className="text-[10px] text-emerald-100 font-mono">BƯỚC 4 (HOÀN TẤT)</span>
            <span className="text-xs font-black">💰 Chốt Lương P3 Hiệu Suất</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Tổng Phiếu Đánh Giá</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total} Phiếu</span>
            <span className="text-[11px] text-slate-400">Kỳ {selectedPeriod}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Xếp Loại Hạng S / A+</span>
            <span className="text-2xl font-black text-purple-600 mt-1 block">{stats.gradeS} Nhân Sự</span>
            <span className="text-[11px] text-purple-600 font-bold">Hưởng 120% Lương P3</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Xếp Loại Hạng A</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.gradeA} Nhân Sự</span>
            <span className="text-[11px] text-emerald-600 font-bold">Hưởng 100% Lương P3</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Tổng Quỹ Lương P3 Chi Trả</span>
            <span className="text-lg font-black text-emerald-700 mt-1 block">
              {stats.totalP3Salary.toLocaleString('vi-VN')} ₫
            </span>
            <span className="text-[11px] text-slate-400">Tự động tính theo điểm số</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl focus:outline-none"
          >
            <option value="Tháng 07/2026">Tháng 07/2026</option>
            <option value="Tháng 08/2026">Tháng 08/2026</option>
            <option value="Tháng 06/2026">Tháng 06/2026</option>
            <option value="Tháng 05/2026">Tháng 05/2026</option>
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Tất Cả Xếp Loại</option>
            <option value="S">🌟 Hạng S (A+ Xuất sắc)</option>
            <option value="A">🟢 Hạng A (Giỏi / Đạt)</option>
            <option value="B">🟡 Hạng B (Khá)</option>
            <option value="C">🟧 Hạng C (Trung bình)</option>
            <option value="D">🔴 Hạng D (Không đạt)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Tất Cả Trạng Thái</option>
            <option value="DRAFT_SELF">📝 Ngày 01 - Tự Đánh Giá</option>
            <option value="SUBMITTED_MANAGER">👔 Quản Lý Chấm</option>
            <option value="REVIEWING_HR">📋 HR Rà Soát</option>
            <option value="FINAL_LOCKED">🔒 Đã Khóa & Tính P3</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên nhân sự, mã NV, phòng ban..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
          />
        </div>
      </div>

      {/* Main Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nhân Sự & Mã NV</th>
                <th className="py-3.5 px-4">Phòng Ban & Vị Trí</th>
                <th className="py-3.5 px-4 text-center">Báo Cáo Tự Chấm</th>
                <th className="py-3.5 px-4 text-right">KPI Sync / Điểm Đánh Giá</th>
                <th className="py-3.5 px-4 text-center">Xếp Loại Hạng</th>
                <th className="py-3.5 px-4 text-right">Lương P3 Thực Nhận</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái Quy Trình</th>
                <th className="py-3.5 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredScorecards.map((sc) => {
                const workItemsCount = sc.self_work_items?.length || 0;

                return (
                  <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {sc.employee_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block truncate">{sc.employee_name}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">{sc.employee_code}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block truncate">{sc.department}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{sc.position || 'Chuyên Viên'}</span>
                    </td>

                    {/* Self Work items count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" /> {workItemsCount} Việc
                      </span>
                    </td>

                    {/* KPI score & Final Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-slate-900 text-sm block">
                        {sc.final_score} <span className="text-xs text-slate-400 font-normal">/100</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold block">
                        KPI: {sc.kpi_score} / 10
                      </span>
                    </td>

                    {/* Rating Grade */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm ${
                          sc.rating_grade === 'S'
                            ? 'bg-purple-600 text-white'
                            : sc.rating_grade === 'A'
                            ? 'bg-emerald-600 text-white'
                            : sc.rating_grade === 'B'
                            ? 'bg-blue-600 text-white'
                            : sc.rating_grade === 'C'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        Hạng {sc.rating_grade}
                      </span>
                    </td>

                    {/* Calculated P3 Salary */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-emerald-700 text-sm block">
                        {(sc.calculated_p3_salary || 0).toLocaleString('vi-VN')} ₫
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {Math.round((sc.p3_multiplier || 1.0) * 100)}% P3 Gốc
                      </span>
                    </td>

                    {/* Workflow status */}
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(sc.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(sc)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Đánh Giá & Chỉnh Sửa Phiếu"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScorecard(sc.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa Phiếu Đánh Giá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredScorecards.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Chưa có phiếu đánh giá hiệu suất nào trong kỳ {selectedPeriod}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scorecard Edit Modal */}
      <ScorecardModal
        isOpen={isScorecardModalOpen}
        onClose={() => setIsScorecardModalOpen(false)}
        onSave={handleSaveScorecard}
        initialData={selectedScorecard}
        mode={scorecardModalMode}
      />

      {/* Formula Weights Config Modal */}
      <FormulaConfigModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        onSave={handleSaveFormulaWeights}
        weights={weights}
      />

      {/* HR Criteria Config Modal */}
      <HrCriteriaModal
        isOpen={isHrCriteriaModalOpen}
        onClose={() => setIsHrCriteriaModalOpen(false)}
        onSaveSuccess={reloadData}
      />
    </div>
  );
}
