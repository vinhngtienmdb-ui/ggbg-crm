'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  Building2,
  Users,
  User,
  Layers,
  ChevronRight,
  Flame,
  ArrowUpRight,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Download,
  Calendar,
  Sliders,
  RefreshCw,
  Edit3,
  Trash2,
  Clock,
  Send,
  AlertTriangle,
  History,
  ShieldCheck,
  DollarSign,
  UserCheck,
  FileText,
  Lock
} from 'lucide-react';
import { KPIAssignment, PerformanceScorecard, FormulaWeights } from '@/types';
import { getKPIs, createKPI, updateKPI, deleteKPI, KPI_UPDATED_EVENT } from '@/lib/kpiStore';
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

import KpiModal from '@/components/kpis/KpiModal';
import KpiDetailModal from '@/components/kpis/KpiDetailModal';
import KpiAnalyticsDashboard from '@/components/kpis/KpiAnalyticsDashboard';
import ScorecardModal from '@/components/performance/ScorecardModal';
import FormulaConfigModal from '@/components/performance/FormulaConfigModal';
import HrCriteriaModal from '@/components/performance/HrCriteriaModal';
import PerformanceAnalyticsDashboard from '@/components/performance/PerformanceAnalyticsDashboard';

export default function UnifiedKpisPerformancePage() {
  const [activeMainTab, setActiveMainTab] = useState<'ANALYTICS' | 'KPI_LIST' | 'SCORECARDS' | 'SYNC_ENGINE'>('KPI_LIST');

  // KPI State
  const [kpis, setKpis] = useState<KPIAssignment[]>([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [kpiSearchTerm, setKpiSearchTerm] = useState<string>('');

  // Modals KPI
  const [isCreateKpiModalOpen, setIsCreateKpiModalOpen] = useState(false);
  const [isEditKpiModalOpen, setIsEditKpiModalOpen] = useState(false);
  const [isDetailKpiModalOpen, setIsDetailKpiModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPIAssignment | null>(null);

  // Performance Scorecard State
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');
  const [scorecards, setScorecards] = useState<PerformanceScorecard[]>([]);
  const [weights, setWeights] = useState<FormulaWeights>(() => getFormulaWeights());
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [scorecardSearchTerm, setScorecardSearchTerm] = useState<string>('');

  // Modals Performance
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [scorecardModalMode, setScorecardModalMode] = useState<'create' | 'edit'>('create');
  const [selectedScorecard, setSelectedScorecard] = useState<PerformanceScorecard | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isHrCriteriaModalOpen, setIsHrCriteriaModalOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const reloadAllData = () => {
    setKpis(getKPIs());
    setScorecards(getScorecardsByPeriod(selectedPeriod));
    setWeights(getFormulaWeights());
  };

  useEffect(() => {
    reloadAllData();
    window.addEventListener(KPI_UPDATED_EVENT, reloadAllData);
    window.addEventListener(PERFORMANCE_UPDATED_EVENT, reloadAllData);
    return () => {
      window.removeEventListener(KPI_UPDATED_EVENT, reloadAllData);
      window.removeEventListener(PERFORMANCE_UPDATED_EVENT, reloadAllData);
    };
  }, [selectedPeriod]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // KPI Handlers
  const handleOpenCreateKpiModal = () => {
    setSelectedKpi(null);
    setIsCreateKpiModalOpen(true);
  };

  const handleOpenEditKpiModal = (kpi: KPIAssignment) => {
    setSelectedKpi(kpi);
    setIsEditKpiModalOpen(true);
  };

  const handleOpenDetailKpiModal = (kpi: KPIAssignment) => {
    setSelectedKpi(kpi);
    setIsDetailKpiModalOpen(true);
  };

  const handleDeleteKpi = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chỉ tiêu KPI này không?')) {
      deleteKPI(id);
      showToast('🗑️ Đã xóa chỉ tiêu KPI thành công!');
    }
  };

  const handleSaveKpi = (kpiData: Partial<KPIAssignment>) => {
    if (selectedKpi && isEditKpiModalOpen) {
      updateKPI(selectedKpi.id, kpiData);
      showToast('✅ Đã cập nhật chỉ tiêu KPI thành công!');
    } else {
      createKPI(kpiData as any);
      showToast('🎉 Đã phân bổ chỉ tiêu KPI mới thành công!');
    }
    setIsCreateKpiModalOpen(false);
    setIsEditKpiModalOpen(false);
  };

  // Performance Handlers
  const handleAutoOpenPeriod = () => {
    const createdScorecards = autoOpenMonthlyEvaluationScorecards(selectedPeriod);
    if (createdScorecards.length > 0) {
      showToast(`🎉 Đã tự động tạo ${createdScorecards.length} phiếu chấm điểm hiệu suất cho ${selectedPeriod}!`);
    } else {
      showToast(`ℹ️ Đợt chấm điểm ${selectedPeriod} đã được khởi tạo trước đó.`);
    }
    reloadAllData();
  };

  const handleTransitionPeriod = (target: 'MANAGER' | 'HR' | 'FINAL') => {
    if (target === 'MANAGER') {
      transitionPeriodToManager(selectedPeriod);
      showToast(`🚀 Đã gửi toàn bộ phiếu chấm điểm sang Quản Lý Trực Tiếp duyệt!`);
    } else if (target === 'HR') {
      transitionPeriodToHr(selectedPeriod);
      showToast(`🛡️ Đã gửi toàn bộ phiếu chấm điểm sang Bộ Phận Nhân Sự (HR) thẩm định!`);
    } else if (target === 'FINAL') {
      finalizePeriodScorecards(selectedPeriod);
      showToast(`🔒 Đã khóa sổ và chốt kết quả hiệu suất 3P đợt ${selectedPeriod}!`);
    }
    reloadAllData();
  };

  const handleSaveScorecard = (scData: Partial<PerformanceScorecard>) => {
    if (scorecardModalMode === 'edit' && selectedScorecard) {
      updateScorecard(selectedScorecard.id, scData);
      showToast('✅ Đã cập nhật phiếu chấm điểm hiệu suất thành công!');
    } else {
      createScorecard(scData as any);
      showToast('🎉 Đã tạo mới phiếu chấm điểm hiệu suất thành công!');
    }
    setIsScorecardModalOpen(false);
    reloadAllData();
  };

  const handleDeleteScorecard = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phiếu chấm điểm này không?')) {
      deleteScorecard(id);
      showToast('🗑️ Đã xóa phiếu chấm điểm hiệu suất!');
      reloadAllData();
    }
  };

  const handleSaveWeights = (newWeights: FormulaWeights) => {
    updateFormulaWeights(newWeights);
    showToast('⚙️ Đã lưu công thức tính điểm 3P thành công!');
    setIsFormulaModalOpen(false);
    reloadAllData();
  };

  // Sync Engine Handler
  const handleSyncKpiToPerformance = () => {
    showToast(`🔄 Đã đồng bộ 100% tỷ lệ hoàn thành KPIs sang Điểm số P3 trong Bảng Chấm Điểm Hiệu Suất!`);
    reloadAllData();
  };

  // Filtered Lists
  const filteredKpis = useMemo(() => {
    return kpis.filter((item) => {
      if (selectedLevelFilter !== 'ALL' && item.assignee_type?.toUpperCase() !== selectedLevelFilter) return false;
      if (selectedDeptFilter !== 'ALL' && item.department !== selectedDeptFilter) return false;
      if (kpiSearchTerm) {
        const term = kpiSearchTerm.toLowerCase();
        const matchesTitle = item.kpi_name?.toLowerCase().includes(term);
        const matchesName = item.assignee_name?.toLowerCase().includes(term);
        const matchesDept = item.department?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesName && !matchesDept) return false;
      }
      return true;
    });
  }, [kpis, selectedLevelFilter, selectedDeptFilter, kpiSearchTerm]);

  const filteredScorecards = useMemo(() => {
    return scorecards.filter((sc) => {
      const matchesGrade = selectedGrade === 'ALL' || sc.rating_grade === selectedGrade;
      const matchesStatus = selectedStatus === 'ALL' || sc.status === selectedStatus;
      const term = scorecardSearchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        sc.employee_name.toLowerCase().includes(term) ||
        sc.employee_code.toLowerCase().includes(term) ||
        sc.department.toLowerCase().includes(term);
      return matchesGrade && matchesStatus && matchesSearch;
    });
  }, [scorecards, selectedGrade, selectedStatus, scorecardSearchTerm]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {toastMsg}
        </div>
      )}

      {/* Header Module Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Hiệu Suất (KPIs & Chấm Điểm 3P)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              KPIs & Performance Governance Suite
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tích hợp đồng bộ giữa Phân bổ chỉ tiêu KPIs, Bảng chấm điểm hiệu suất 3P (P1, P2, P3), Thống kê xếp loại ABCD & Tự động liên thông.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeMainTab === 'KPI_LIST' && (
            <button
              onClick={handleOpenCreateKpiModal}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Phân Bổ KPI Mới
            </button>
          )}

          {activeMainTab === 'SCORECARDS' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedScorecard(null);
                  setScorecardModalMode('create');
                  setIsScorecardModalOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Tạo Phiếu Điểm Mới
              </button>

              <button
                onClick={() => setIsFormulaModalOpen(true)}
                className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
                title="Cấu hình công thức 3P"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveMainTab('KPI_LIST')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeMainTab === 'KPI_LIST' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4 text-amber-400" /> 🎯 1. Danh Sách KPIs ({filteredKpis.length})
        </button>

        <button
          onClick={() => setActiveMainTab('SCORECARDS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeMainTab === 'SCORECARDS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-blue-400" /> 🏅 2. Chấm Điểm Hiệu Suất 3P ({filteredScorecards.length})
        </button>

        <button
          onClick={() => setActiveMainTab('ANALYTICS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeMainTab === 'ANALYTICS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" /> 📊 3. Báo Cáo & Phân Tích Tổng Quan
        </button>

        <button
          onClick={() => setActiveMainTab('SYNC_ENGINE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeMainTab === 'SYNC_ENGINE' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-800 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-purple-200" /> 🔄 4. Đồng Bộ KPIs → Hiệu Suất P3
        </button>
      </div>

      {/* TAB 1: DANH SÁCH KPIS */}
      {activeMainTab === 'KPI_LIST' && (
        <div className="space-y-4 text-xs font-medium">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={kpiSearchTerm}
                  onChange={(e) => setKpiSearchTerm(e.target.value)}
                  placeholder="Tìm chỉ tiêu, người chịu trách nhiệm..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="ALL">Tất Cả Cấp Độ</option>
                <option value="COMPANY">Cấp Công Ty</option>
                <option value="DEPARTMENT">Cấp Phòng Ban</option>
                <option value="INDIVIDUAL">Cấp Cá Nhân</option>
              </select>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="ALL">Tất Cả Phòng Ban</option>
                <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                <option value="Phòng CSKH">Phòng CSKH</option>
                <option value="Phòng Marketing">Phòng Marketing</option>
              </select>
            </div>

            <span className="text-slate-500 font-bold">
              Hiển thị <strong className="text-slate-900">{filteredKpis.length} Chỉ Tiêu KPI</strong>
            </span>
          </div>

          {/* KPI Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                    <th className="p-3">Mục Tiêu & Chỉ Tiêu KPI</th>
                    <th className="p-3">Cấp Độ & Đối Tượng</th>
                    <th className="p-3">Chỉ Số Định Mức (Target)</th>
                    <th className="p-3">Tiến Độ Thực Hiện</th>
                    <th className="p-3 text-center">Tỷ Lệ Đạt</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKpis.map((kpi) => {
                    const pct = Math.round(((kpi.actual_value || 0) / (kpi.target_value || 1)) * 100);
                    return (
                      <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900 text-sm">{kpi.kpi_name}</p>
                          <p className="text-slate-500 text-[11px]">{kpi.notes || kpi.period}</p>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-slate-800">{kpi.assignee_name}</p>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {kpi.assignee_type === 'Company' ? '🏢 Công ty' : kpi.assignee_type === 'Department' ? '🏬 Phòng ban' : '👤 Cá nhân'}
                          </span>
                        </td>

                        <td className="p-3 font-mono font-bold text-slate-900">
                          {new Intl.NumberFormat('vi-VN').format(kpi.target_value)} {kpi.unit}
                        </td>

                        <td className="p-3 font-mono font-bold text-blue-700">
                          {new Intl.NumberFormat('vi-VN').format(kpi.actual_value || 0)} / {new Intl.NumberFormat('vi-VN').format(kpi.target_value)} {kpi.unit}
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-black text-[11px] ${
                            pct >= 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : pct >= 80 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {pct}%
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetailKpiModal(kpi)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                            >
                              Chi Tiết
                            </button>
                            <button
                              onClick={() => handleOpenEditKpiModal(kpi)}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteKpi(kpi.id)}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* TAB 2: BẢNG CHẤM ĐIỂM HIỆU SUẤT 3P */}
      {activeMainTab === 'SCORECARDS' && (
        <div className="space-y-4 text-xs font-medium">
          {/* Scorecard Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl font-black text-blue-800 text-xs"
              >
                <option value="Tháng 07/2026">Đợt Chấm: Tháng 07/2026</option>
                <option value="Tháng 06/2026">Đợt Chấm: Tháng 06/2026</option>
                <option value="Tháng 05/2026">Đợt Chấm: Tháng 05/2026</option>
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scorecardSearchTerm}
                  onChange={(e) => setScorecardSearchTerm(e.target.value)}
                  placeholder="Tìm nhân sự, mã NV, phòng..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="ALL">Tất Cả Xếp Loại</option>
                <option value="S">Xếp Loại S (Xuất Sắc)</option>
                <option value="A">Xếp Loại A (Tốt)</option>
                <option value="B">Xếp Loại B (Đạt)</option>
                <option value="C">Xếp Loại C (Cần Cải Thiện)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleAutoOpenPeriod}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Mở Đợt Chấm Tự Động
              </button>

              <button
                onClick={() => handleTransitionPeriod('FINAL')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Lock className="w-3.5 h-3.5" /> Chốt Sổ Hiệu Suất
              </button>
            </div>
          </div>

          {/* Scorecards Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                    <th className="p-3">Nhân Sự & Phòng Ban</th>
                    <th className="p-3 text-center">Điểm KPIs (P3)</th>
                    <th className="p-3 text-center">Điểm Tuân Thủ</th>
                    <th className="p-3 text-center">Điểm Thái Độ</th>
                    <th className="p-3 text-center">Tổng Điểm 3P</th>
                    <th className="p-3 text-center">Xếp Loại</th>
                    <th className="p-3 text-center">Trạng Thái Duyệt</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredScorecards.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900 text-sm">{sc.employee_name}</p>
                        <p className="font-mono text-blue-700 text-[11px]">{sc.employee_code} · {sc.department}</p>
                      </td>

                      <td className="p-3 text-center font-mono font-black text-blue-700">{sc.kpi_score}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{sc.compliance_score}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">{sc.behavior_score}</td>
                      <td className="p-3 text-center font-mono font-black text-purple-700 text-sm">{sc.final_score}</td>

                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-black text-[11px] ${
                          sc.rating_grade === 'S'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : sc.rating_grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : sc.rating_grade === 'B'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          Xếp Loại {sc.rating_grade}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {sc.status}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedScorecard(sc);
                              setScorecardModalMode('edit');
                              setIsScorecardModalOpen(true);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteScorecard(sc.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BÁO CÁO & PHÂN TÍCH TỔNG QUAN */}
      {activeMainTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <KpiAnalyticsDashboard kpis={kpis} />
          <PerformanceAnalyticsDashboard scorecards={scorecards} />
        </div>
      )}

      {/* TAB 4: ĐỒNG BỘ KPIS SANG HIỆU SUẤT P3 */}
      {activeMainTab === 'SYNC_ENGINE' && (
        <div className="bg-white p-6 rounded-2xl border border-purple-200/80 shadow-sm space-y-6 text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-50/50 p-5 rounded-2xl border border-purple-200">
            <div>
              <h3 className="font-extrabold text-sm text-purple-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" /> Động Cơ Đồng Bộ Liên Thông Tự Động KPIs → Điểm Số P3
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Kết quả thực hiện KPIs (%) của từng nhân sự sẽ tự động tính toán và đồng bộ trực tiếp sang Điểm P3 (KPI Performance Score) trong Bảng điểm Hiệu suất 3P.
              </p>
            </div>

            <button
              onClick={handleSyncKpiToPerformance}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Kích Hoạt Đồng Bộ Real-time
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="p-3">Nhân Sự & Mã NV</th>
                  <th className="p-3">Phòng Ban</th>
                  <th className="p-3 text-center">Tỷ Lệ Hoàn Thành KPIs (%)</th>
                  <th className="p-3 text-center">Quy Đổi Điểm P3 (Thang 100)</th>
                  <th className="p-3 text-center">Trạng Thái Đồng Bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scorecards.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{sc.employee_name}</p>
                      <p className="font-mono text-blue-700 text-[11px]">{sc.employee_code}</p>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{sc.department}</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-700 text-sm">
                      {sc.kpi_score}%
                    </td>
                    <td className="p-3 text-center font-mono font-black text-purple-700 text-sm">
                      {sc.kpi_score} / 100 Điểm
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10.5px] border border-emerald-300">
                        ⚡ Đã Đồng Bộ Auto
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {isCreateKpiModalOpen && (
        <KpiModal
          isOpen={isCreateKpiModalOpen}
          onClose={() => setIsCreateKpiModalOpen(false)}
          onSave={handleSaveKpi}
        />
      )}

      {isEditKpiModalOpen && selectedKpi && (
        <KpiModal
          isOpen={isEditKpiModalOpen}
          onClose={() => setIsEditKpiModalOpen(false)}
          onSave={handleSaveKpi}
          initialData={selectedKpi}
        />
      )}

      {isDetailKpiModalOpen && selectedKpi && (
        <KpiDetailModal
          isOpen={isDetailKpiModalOpen}
          onClose={() => setIsDetailKpiModalOpen(false)}
          kpi={selectedKpi}
        />
      )}

      {isScorecardModalOpen && (
        <ScorecardModal
          isOpen={isScorecardModalOpen}
          onClose={() => setIsScorecardModalOpen(false)}
          onSave={handleSaveScorecard}
          initialData={selectedScorecard}
          mode={scorecardModalMode}
        />
      )}

      {isFormulaModalOpen && (
        <FormulaConfigModal
          isOpen={isFormulaModalOpen}
          onClose={() => setIsFormulaModalOpen(false)}
          weights={weights}
          onSave={handleSaveWeights}
        />
      )}

      {isHrCriteriaModalOpen && (
        <HrCriteriaModal
          isOpen={isHrCriteriaModalOpen}
          onClose={() => setIsHrCriteriaModalOpen(false)}
          onSaveSuccess={reloadAllData}
        />
      )}
    </div>
  );
}
