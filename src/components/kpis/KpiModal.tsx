'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, TrendingUp, Calculator, Check, Sparkles, AlertCircle, Users, Building2, User } from 'lucide-react';
import { KPIAssignment, KpiAssigneeType, KpiCategory, KpiMetricType } from '@/types';
import { calculateProgressPercentage } from '@/lib/kpiStore';
import { getEmployees } from '@/lib/hrmStore';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: Partial<KPIAssignment>) => void;
  initialData?: KPIAssignment | null;
  mode?: 'create' | 'edit';
}

const DEPARTMENTS = [
  'Phòng Kinh Doanh 1',
  'Phòng Kinh Doanh 2',
  'Phòng CSKH',
  'Phòng Marketing',
  'Khối Nhân Sự (HRM)',
  'Khối Tài Chính - Kế Toán',
];

const PERIOD_OPTIONS = [
  'Tháng 07/2026',
  'Tháng 08/2026',
  'Tháng 09/2026',
  'Q3/2026',
  'Q4/2026',
  'Năm 2026',
];

const CATEGORY_OPTIONS: { key: KpiCategory; label: string; unit: string; metricType: KpiMetricType }[] = [
  { key: 'REVENUE', label: ' Doanh Số / Tiền Tệ', unit: 'VND', metricType: 'Currency' },
  { key: 'LEADS', label: ' Số Lượng Lead / KH Mới', unit: 'Lead', metricType: 'Count' },
  { key: 'CALLS', label: '📞 Cuộc Gọi / Hoạt Động', unit: 'Cuộc Gọi', metricType: 'Count' },
  { key: 'CONTRACTS', label: '🛍 Gian Hàng / Hợp Đồng', unit: 'Hợp Đồng', metricType: 'Count' },
  { key: 'CONVERSION', label: ' Tỷ Lệ Chuyển Đổi (%)', unit: '%', metricType: 'Percentage' },
  { key: 'CSAT', label: ' Đánh Giá Hài Lòng CSAT', unit: 'Điểm', metricType: 'Score' },
  { key: 'OTHER', label: '📌 Chỉ Số Tùy Chỉnh Khác', unit: 'Chỉ số', metricType: 'Count' },
];

export default function KpiModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: KpiModalProps) {
  const [employees] = useState(() => getEmployees());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<KPIAssignment>>({
    kpi_name: '',
    category: 'REVENUE',
    category_label: ' Doanh Số',
    metric_type: 'Currency',
    unit: 'VND',
    assignee_type: 'Department',
    assignee_name: 'Phòng Kinh Doanh 1',
    department: 'Phòng Kinh Doanh 1',
    period: 'Tháng 07/2026',
    target_value: 1000000000,
    actual_value: 0,
    progress_percentage: 0,
    weight: 100,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        kpi_name: '',
        category: 'REVENUE',
        category_label: ' Doanh Số',
        metric_type: 'Currency',
        unit: 'VND',
        assignee_type: 'Department',
        assignee_name: 'Phòng Kinh Doanh 1',
        department: 'Phòng Kinh Doanh 1',
        period: 'Tháng 07/2026',
        target_value: 1000000000,
        actual_value: 0,
        progress_percentage: 0,
        weight: 100,
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const target = Number(formData.target_value) || 0;
  const actual = Number(formData.actual_value) || 0;
  const computedProgress = calculateProgressPercentage(target, actual);

  const handleCategoryChange = (catKey: KpiCategory) => {
    const found = CATEGORY_OPTIONS.find((c) => c.key === catKey);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        category: catKey,
        category_label: found.label,
        metric_type: found.metricType,
        unit: prev.unit || found.unit,
      }));
    }
  };

  const handleAssigneeTypeChange = (type: KpiAssigneeType) => {
    let name = 'Toàn Công Ty GGBingo Group';
    if (type === 'Department') name = DEPARTMENTS[0];
    else if (type === 'Team') name = 'Đội 1 Sale TikTok';
    else if (type === 'Individual') name = employees[0]?.full_name || 'Nguyễn Văn A';

    setFormData((prev) => ({
      ...prev,
      assignee_type: type,
      assignee_name: name,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kpi_name?.trim()) {
      setErrorMsg('Vui lòng nhập tên chỉ tiêu KPI!');
      return;
    }
    onSave({
      ...formData,
      target_value: target,
      actual_value: actual,
      progress_percentage: computedProgress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-medium text-white shadow-md">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {mode === 'create' ? 'Tạo & Phân Bổ Chỉ Tiêu KPI Mới' : 'Cập Nhật Tiến Độ & Chỉnh Sửa KPI'}
              </h2>
              <p className="text-xs text-slate-300">
                Phân bổ chỉ tiêu chi tiết theo Công Ty / Bộ Phận / Đội Nhóm / Cá Nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Chỉ Tiêu KPI <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.kpi_name || ''}
              onChange={(e) => setFormData({ ...formData, kpi_name: e.target.value })}
              placeholder="VD: Doanh Số Phòng Kinh Doanh 1 Tháng 07/2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            /> </div> {/* Grid 1: Assignee Level & Specific Target Owner */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Cấp Phân Bổ (Assignee Type) </label> <select
                value={formData.assignee_type || 'Department'}
                onChange={(e) => handleAssigneeTypeChange(e.target.value as KpiAssigneeType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              > <option value="Company">🌐 Toàn Công Ty (Company)</option> <option value="Department">🏢 Khối / Bộ Phận / Phòng Ban</option> <option value="Team">👥 Đội Nhóm (Team)</option> <option value="Individual">👤 Cá Nhân (Individual)</option> </select> </div> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Đối Tượng Phụ Trách Năng Lực </label> {formData.assignee_type === 'Company' && ( <input
                  type="text"
                  readOnly
                  value="Toàn Công Ty GGBingo Group"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-not-allowed"
                /> )}

              {formData.assignee_type === 'Department' && ( <select
                  value={formData.assignee_name || DEPARTMENTS[0]}
                  onChange={(e) => setFormData({
                      ...formData,
                      assignee_name: e.target.value,
                      department: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                > {DEPARTMENTS.map((dept) => ( <option key={dept} value={dept}> {dept} </option> ))} </select> )}

              {formData.assignee_type === 'Team' && ( <input
                  type="text"
                  value={formData.assignee_name || ''}
                  onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value })}
                  placeholder="Nhập tên Đội / Team (VD: Đội TikTok Shop 1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> )}

              {formData.assignee_type === 'Individual' && ( <select
                  value={formData.assignee_name || ''}
                  onChange={(e) => {
                    const emp = employees.find((x) => x.full_name === e.target.value);
                    setFormData({
                      ...formData,
                      assignee_name: e.target.value,
                      assignee_id: emp?.id,
                      department: emp?.department || prevDepartment(formData.department),
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                > {employees.map((emp) => ( <option key={emp.id} value={emp.full_name}> {emp.full_name} ({emp.employee_code} - {emp.position}) </option> ))} </select> )} </div> </div> {/* Grid 2: Category & Unit */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Loại Chỉ Số KPI (Metric Category) </label> <select
                value={formData.category || 'REVENUE'}
                onChange={(e) => handleCategoryChange(e.target.value as KpiCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              > {CATEGORY_OPTIONS.map((cat) => ( <option key={cat.key} value={cat.key}> {cat.label} </option> ))} </select> </div> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Đơn Vị Tính (Unit) </label> <input
                type="text"
                value={formData.unit || 'VND'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="VD: VND, Lead, Cuộc gọi, Hợp đồng, %..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              /> </div> </div> {/* Grid 3: Period & Weight */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Kỳ Đánh Giá (Evaluation Period) </label> <select
                value={formData.period || 'Tháng 07/2026'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              > {PERIOD_OPTIONS.map((p) => ( <option key={p} value={p}> {p} </option> ))} </select> </div> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Trọng Số Đánh Giá (Weight %) </label> <input
                type="number"
                min={1}
                max={100}
                value={formData.weight || 100}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              /> </div> </div> {/* Target & Actual Numbers Section */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4"> <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5"> <Calculator className="w-4 h-4 text-blue-600" /> Giá Trị Chỉ Tiêu & Thực Tế </h4> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Mục Tiêu Chỉ Tiêu (Target Value) </label> <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={formData.target_value ?? ''}
                  onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
                  placeholder="Nhập giá trị chỉ tiêu"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> Đã Đạt Được (Actual Value) </label> <input
                  type="number"
                  min={0}
                  step="any"
                  value={formData.actual_value ?? ''}
                  onChange={(e) => setFormData({ ...formData, actual_value: Number(e.target.value) })}
                  placeholder="Nhập giá trị thực tế đã làm"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> </div> {/* Computed Progress Badge Preview */} <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"> <span className="text-xs font-medium text-slate-600">Tiến Độ Hoàn Thành Tính Toán:</span> <div className="flex items-center gap-2"> <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold shadow-sm ${
                    computedProgress >= 100
                      ? 'bg-emerald-600 text-white'
                      : computedProgress >= 80
                      ? 'bg-blue-600 text-white'
                      : computedProgress >= 50
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                > {computedProgress}% </span> <span className="text-xs font-semibold text-slate-800"> {computedProgress >= 110
                    ? ' Vượt Chỉ Tiêu'
                    : computedProgress >= 100
                    ? ' Hoàn Thành'
                    : computedProgress >= 80
                    ? '⚡ Đúng Tiến Độ'
                    : ' Chậm Tiến Độ'} </span> </div> </div> </div> {/* Notes */} <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5"> Ghi Chú & Hướng Dẫn Kế Hoạch </label> <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú chi tiết mục tiêu, chiến lược hoặc hướng dẫn thực hiện..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            /> </div> {/* Actions */} <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200"> <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all"
            > Hủy Bỏ </button> <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            > <Check className="w-4 h-4" /> {mode === 'create' ? 'Tạo & Phân Bổ KPI' : 'Lưu Thay Đổi'} </button> </div> </form> </div> </div> );
}

function prevDepartment(fallback?: string) {
  return fallback || 'Phòng Kinh Doanh 1';
}
