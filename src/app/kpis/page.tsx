'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  Users,
  Building2,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { KPIAssignment, KpiAssigneeType, KpiCategory } from '@/types';
import { getKPIs, createKPI, updateKPI, deleteKPI, KPI_UPDATED_EVENT } from '@/lib/kpiStore';
import KpiModal from '@/components/kpis/KpiModal';
import KpiDetailModal from '@/components/kpis/KpiDetailModal';

export default function KpisPage() {
  const [kpis, setKpis] = useState<KPIAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<KPIAssignment | null>(null);

  const [detailItem, setDetailItem] = useState<KPIAssignment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Load KPIs from store
  const reloadKPIs = () => {
    setKpis(getKPIs());
  };

  useEffect(() => {
    reloadKPIs();
    window.addEventListener(KPI_UPDATED_EVENT, reloadKPIs);
    return () => {
      window.removeEventListener(KPI_UPDATED_EVENT, reloadKPIs);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered KPIs list
  const filteredKPIs = useMemo(() => {
    return kpis.filter((item) => {
      // Level Filter
      if (selectedLevelFilter !== 'ALL' && item.assignee_type !== selectedLevelFilter) return false;

      // Dept Filter
      if (selectedDeptFilter !== 'ALL' && item.department !== selectedDeptFilter && item.assignee_name !== selectedDeptFilter) {
        return false;
      }

      // Period Filter
      if (selectedPeriodFilter !== 'ALL' && item.period !== selectedPeriodFilter) return false;

      // Status Filter
      if (selectedStatusFilter !== 'ALL') {
        const pct = item.progress_percentage || 0;
        if (selectedStatusFilter === 'EXCEEDED' && pct < 110) return false;
        if (selectedStatusFilter === 'COMPLETED' && (pct < 100 || pct >= 110)) return false;
        if (selectedStatusFilter === 'IN_PROGRESS' && (pct < 80 || pct >= 100)) return false;
        if (selectedStatusFilter === 'BEHIND' && pct >= 80) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          item.kpi_name.toLowerCase().includes(term) ||
          (item.kpi_code || '').toLowerCase().includes(term) ||
          item.assignee_name.toLowerCase().includes(term) ||
          (item.notes || '').toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [kpis, selectedLevelFilter, selectedDeptFilter, selectedPeriodFilter, selectedStatusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = kpis.length;
    if (total === 0) return { total: 0, avgPct: 0, exceededCount: 0, behindCount: 0 };

    const totalPct = kpis.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0);
    const avgPct = Math.round((totalPct / total) * 10);

    const exceededCount = kpis.filter((k) => (k.progress_percentage || 0) >= 100).length;
    const behindCount = kpis.filter((k) => (k.progress_percentage || 0) < 80).length;

    return { total, avgPct, exceededCount, behindCount };
  }, [kpis]);

  // CRUD Handlers
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: KPIAssignment) => {
    setEditingItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Partial<KPIAssignment>) => {
    if (modalMode === 'create') {
      createKPI(data as any);
      showToast('✅ Đã tạo & phân bổ chỉ tiêu KPI mới thành công!');
    } else if (editingItem) {
      updateKPI(editingItem.id, data);
      showToast('✅ Đã cập nhật tiến độ KPI thành công!');
    }
    reloadKPIs();
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteKPI(deleteId);
      setDeleteId(null);
      reloadKPIs();
      showToast('🗑️ Đã xóa chỉ tiêu KPI thành công!');
    }
  };

  const formatValue = (val: number, unit: string) => {
    if (unit === 'VND' || unit === 'VNĐ') {
      return `${val.toLocaleString('vi-VN')} ₫`;
    }
    return `${val.toLocaleString('vi-VN')} ${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý & Phân Bổ Chỉ Tiêu KPIs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Phân Bổ Đa Cấp
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phân bổ & quản lý chỉ tiêu chi tiết cho Công Ty / Bộ Phận / Đội Nhóm / Cá Nhân theo đa dạng loại chỉ số
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

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Tổng Chỉ Tiêu Đang Quản Lý</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total} KPI</span>
            <span className="text-[11px] text-slate-400">Tất cả các bộ phận & cá nhân</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-lg">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Tỷ Lệ Hoàn Thành Trung Bình</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.avgPct}%</span>
            <span className="text-[11px] text-slate-400">Tiến độ chung toàn hệ thống</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Chỉ Tiêu Đạt / Vượt Kế Hoạch</span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">{stats.exceededCount} KPI</span>
            <span className="text-[11px] text-emerald-600 font-bold">≥ 100% mục tiêu ban đầu</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-lg">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">Chỉ Tiêu Cần Cảnh Báo Tiến Độ</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.behindCount} KPI</span>
            <span className="text-[11px] text-amber-600 font-bold">Mức đạt &lt; 80% kế hoạch</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar & Search Panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc Theo Cấp:
            </span>
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Tất Cả Cấp Phân Bổ</option>
              <option value="Company">🌐 Toàn Công Ty (Company)</option>
              <option value="Department">🏢 Phòng Ban (Department)</option>
              <option value="Team">👥 Đội Nhóm (Team)</option>
              <option value="Individual">👤 Cá Nhân (Individual)</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Tất Cả Bộ Phận</option>
              <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
              <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
              <option value="Phòng CSKH">Phòng CSKH</option>
              <option value="Phòng Marketing">Phòng Marketing</option>
            </select>

            {/* Period Filter */}
            <select
              value={selectedPeriodFilter}
              onChange={(e) => setSelectedPeriodFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Tất Cả Kỳ Đánh Giá</option>
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Q3/2026">Q3/2026</option>
              <option value="Năm 2026">Năm 2026</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="EXCEEDED">🔥 Vượt Chỉ Tiêu (≥110%)</option>
              <option value="COMPLETED">✅ Hoàn Thành (100-109%)</option>
              <option value="IN_PROGRESS">⚡ Đúng Tiến Độ (80-99%)</option>
              <option value="BEHIND">⚠️ Chậm Tiến Độ (&lt;80%)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên KPI, mã, người phụ trách..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Main KPI Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Bảng Phân Bổ 指標 KPI Chi Tiết ({filteredKPIs.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tự động tính phần trăm & hiển thị cảnh báo theo trọng số
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Mã & Chỉ Tiêu KPI</th>
                <th className="py-3 px-4">Cấp Phân Bổ</th>
                <th className="py-3 px-4">Đối Tượng Phụ Trách</th>
                <th className="py-3 px-4">Loại Chỉ Số</th>
                <th className="py-3 px-4">Kỳ Đánh Giá</th>
                <th className="py-3 px-4 text-right">Chỉ Tiêu</th>
                <th className="py-3 px-4 text-right">Thực Tế</th>
                <th className="py-3 px-4 text-center">Tiến Độ (%)</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredKPIs.map((kpi) => {
                const progress = kpi.progress_percentage || 0;

                return (
                  <tr key={kpi.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* KPI Name & Code */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-[10px] font-mono font-bold text-blue-600 block">
                        {kpi.kpi_code || kpi.id}
                      </span>
                      <span className="font-extrabold text-slate-900 block truncate" title={kpi.kpi_name}>
                        {kpi.kpi_name}
                      </span>
                    </td>

                    {/* Level Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          kpi.assignee_type === 'Company'
                            ? 'bg-purple-100 text-purple-800'
                            : kpi.assignee_type === 'Department'
                            ? 'bg-blue-100 text-blue-800'
                            : kpi.assignee_type === 'Team'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {kpi.assignee_type === 'Company' && '🌐 Công Ty'}
                        {kpi.assignee_type === 'Department' && '🏢 Phòng Ban'}
                        {kpi.assignee_type === 'Team' && '👥 Đội Nhóm'}
                        {kpi.assignee_type === 'Individual' && '👤 Cá Nhân'}
                      </span>
                    </td>

                    {/* Assignee Name */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                        {kpi.assignee_name}
                      </span>
                      {kpi.department && (
                        <span className="text-[10px] text-slate-400 block truncate">{kpi.department}</span>
                      )}
                    </td>

                    {/* Category Label */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {kpi.category_label || kpi.unit}
                    </td>

                    {/* Evaluation Period */}
                    <td className="py-3.5 px-4 font-bold text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {kpi.period}
                      </span>
                    </td>

                    {/* Target Value */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700">
                      {formatValue(kpi.target_value, kpi.unit)}
                    </td>

                    {/* Actual Value */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatValue(kpi.actual_value, kpi.unit)}
                    </td>

                    {/* Progress Bar & Rate Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold ${
                            progress >= 110
                              ? 'bg-indigo-100 text-indigo-800'
                              : progress >= 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : progress >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {progress}%
                        </span>

                        <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress >= 100 ? 'bg-emerald-600' : progress >= 80 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setDetailItem(kpi);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem Chi Tiết KPI"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(kpi)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Cập Nhật Tiến Độ & Chỉnh Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(kpi.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa Chỉ Tiêu KPI"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredKPIs.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Target className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy chỉ tiêu KPI nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <KpiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingItem}
        mode={modalMode}
      />

      {/* Detail Modal */}
      <KpiDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        kpi={detailItem}
        onEdit={(item) => handleOpenEditModal(item)}
      />

      {/* Confirm Delete Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Xác Nhận Xóa KPI</h4>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa chỉ tiêu KPI này? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
