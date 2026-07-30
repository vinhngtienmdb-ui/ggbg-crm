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
  Calendar
} from 'lucide-react';
import { KPIAssignment, KpiAssigneeType } from '@/types';
import { getKPIs, createKPI, updateKPI, deleteKPI, KPI_UPDATED_EVENT } from '@/lib/kpiStore';
import KpiModal from '@/components/kpis/KpiModal';
import KpiDetailModal from '@/components/kpis/KpiDetailModal';
import KpiAnalyticsDashboard from '@/components/kpis/KpiAnalyticsDashboard';

export default function KpisPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'list'>('reports');
  const [kpis, setKpis] = useState<KPIAssignment[]>([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPIAssignment | null>(null);

  const reloadKpis = () => {
    setKpis(getKPIs());
  };

  useEffect(() => {
    reloadKpis();
    window.addEventListener(KPI_UPDATED_EVENT, reloadKpis);
    return () => {
      window.removeEventListener(KPI_UPDATED_EVENT, reloadKpis);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setSelectedKpi(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (kpi: KPIAssignment) => {
    setSelectedKpi(kpi);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (kpi: KPIAssignment) => {
    setSelectedKpi(kpi);
    setIsDetailModalOpen(true);
  };

  const handleDeleteKpi = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chỉ tiêu KPI này không?')) {
      deleteKPI(id);
      showToast('🗑️ Đã xóa chỉ tiêu KPI thành công!');
    }
  };

  const handleSaveKpi = (kpiData: Partial<KPIAssignment>) => {
    if (selectedKpi && isEditModalOpen) {
      updateKPI(selectedKpi.id, kpiData);
      showToast('✅ Đã cập nhật chỉ tiêu KPI thành công!');
    } else {
      createKPI(kpiData as any);
      showToast('🎉 Đã phân bổ chỉ tiêu KPI mới thành công!');
    }
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  const filteredKpis = useMemo(() => {
    return kpis.filter((item) => {
      if (selectedLevelFilter !== 'ALL' && item.assignee_type?.toUpperCase() !== selectedLevelFilter) return false;
      if (selectedDeptFilter !== 'ALL' && item.department !== selectedDeptFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          (item.kpi_name && item.kpi_name.toLowerCase().includes(term)) ||
          (item.kpi_code && item.kpi_code.toLowerCase().includes(term)) ||
          (item.assignee_name && item.assignee_name.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [kpis, selectedLevelFilter, selectedDeptFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = kpis.length;
    const avgProgress =
      total > 0
        ? Math.round(kpis.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0) / total)
        : 0;

    const exceeded = kpis.filter((k) => (k.progress_percentage || 0) >= 110).length;
    const completed = kpis.filter(
      (k) => (k.progress_percentage || 0) >= 100 && (k.progress_percentage || 0) < 110
    ).length;
    const inProgress = kpis.filter(
      (k) => (k.progress_percentage || 0) >= 80 && (k.progress_percentage || 0) < 100
    ).length;
    const behind = kpis.filter((k) => (k.progress_percentage || 0) < 80).length;

    return { total, avgProgress, exceeded, completed, inProgress, behind };
  }, [kpis]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý & Phân Bổ Chỉ Tiêu KPIs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Module KPIs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Báo cáo phân tích chuyên sâu & quản lý phân bổ chỉ tiêu cho Công Ty / Bộ Phận / Đội Nhóm / Cá Nhân
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Phân Bổ Chỉ Tiêu KPI Mới
        </button>
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
            <BarChart3 className="w-4 h-4 text-blue-400" /> 1. 📊 Báo Cáo & Phân Tích KPIs
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" /> 2. 📋 Danh Sách Chỉ Tiêu ({kpis.length})
          </button>
        </div>

        <button
          onClick={() => showToast('📥 Đã xuất báo cáo KPIs ra file Excel (.xlsx)')}
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-600" /> Xuất Báo Cáo Excel
        </button>
      </div>

      {/* TAB 1: 📊 BÁO CÁO & PHÂN TÍCH KPIS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <KpiAnalyticsDashboard kpis={kpis} />

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-bold block">Tổng Chỉ Tiêu Phân Bổ</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total} KPI</span>
                <span className="text-[11px] text-slate-400">Công ty / Bộ phận / Cá nhân</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-bold block">Tiến Độ Trung Bình</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats.avgProgress}%</span>
                <span className="text-[11px] text-emerald-600 font-bold">Đạt chỉ tiêu đề ra</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-bold block">🔥 Vượt Chỉ Tiêu (≥110%)</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">{stats.exceeded} KPI</span>
                <span className="text-[11px] text-indigo-600 font-bold">Thành tích xuất sắc</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-bold block">⚠️ Chậm Tiến Độ (&lt;80%)</span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">{stats.behind} KPI</span>
                <span className="text-[11px] text-amber-600 font-bold">Cần đôn đốc thực hiện</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 📋 DANH SÁCH & CHỈ TIÊU KPI */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc Cấp Phân Bổ:
              </span>
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 font-bold text-slate-900 rounded-xl focus:outline-none"
              >
                <option value="ALL">Tất Cả Cấp</option>
                <option value="COMPANY">🏢 Cấp Công Ty</option>
                <option value="DEPARTMENT">🏬 Cấp Phòng Ban</option>
                <option value="TEAM">👥 Cấp Đội Nhóm</option>
                <option value="INDIVIDUAL">👤 Cấp Cá Nhân</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tiêu đề KPI, mã KPI, nhân sự..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>
          </div>

          {/* KPI Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3.5 px-4">Mã & Tiêu Đề KPI</th>
                  <th className="py-3.5 px-4">Cấp Phân Bổ</th>
                  <th className="py-3.5 px-4">Đơn Vị / Cá Nhân</th>
                  <th className="py-3.5 px-4 text-center">Chỉ Tiêu</th>
                  <th className="py-3.5 px-4 text-center">Thực Tế</th>
                  <th className="py-3.5 px-4 text-center">Tiến Độ (%)</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredKpis.map((kpi) => {
                  const pct = kpi.progress_percentage || 0;
                  return (
                    <tr key={kpi.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold text-blue-600 block">{kpi.kpi_code}</span>
                        <span
                          onClick={() => handleOpenDetailModal(kpi)}
                          className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer block"
                        >
                          {kpi.kpi_name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{kpi.category_label}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {kpi.assignee_type === 'Company' && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200">
                            🏢 Cấp Công Ty
                          </span>
                        )}
                        {kpi.assignee_type === 'Department' && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
                            🏬 Cấp Phòng Ban
                          </span>
                        )}
                        {kpi.assignee_type === 'Team' && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                            👥 Cấp Đội Nhóm
                          </span>
                        )}
                        {kpi.assignee_type === 'Individual' && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200">
                            👤 Cấp Cá Nhân
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{kpi.assignee_name || kpi.department}</span>
                        <span className="text-[10px] text-slate-400 block">{kpi.department}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {kpi.unit === 'VND' || kpi.unit === 'VNĐ'
                          ? `${kpi.target_value.toLocaleString('vi-VN')} ₫`
                          : `${kpi.target_value} ${kpi.unit}`}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">
                        {kpi.unit === 'VND' || kpi.unit === 'VNĐ'
                          ? `${kpi.actual_value.toLocaleString('vi-VN')} ₫`
                          : `${kpi.actual_value} ${kpi.unit}`}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="w-24 mx-auto space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className={pct >= 100 ? 'text-emerald-600' : 'text-slate-600'}>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 110 ? 'bg-indigo-600' : pct >= 100 ? 'bg-emerald-500' : pct >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {pct >= 110 && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                            🔥 Vượt Chỉ Tiêu
                          </span>
                        )}
                        {pct >= 100 && pct < 110 && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            ✅ Hoàn Thành
                          </span>
                        )}
                        {pct >= 80 && pct < 100 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                            ⚡ Đúng Tiến Độ
                          </span>
                        )}
                        {pct < 80 && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                            ⚠️ Chậm Tiến Độ
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(kpi)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-bold"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteKpi(kpi.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold"
                          >
                            Xóa
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

      {/* CREATE / EDIT MODAL */}
      <KpiModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        initialData={selectedKpi}
        onSave={handleSaveKpi}
      />

      {/* DETAIL MODAL */}
      <KpiDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        kpi={selectedKpi}
      />
    </div>
  );
}
