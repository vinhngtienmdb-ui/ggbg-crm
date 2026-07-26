'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, TrendingUp, Calculator, Check, Sparkles, AlertCircle } from 'lucide-react';
import { KPIAssignment } from '@/types';
import { calculateProgressPercentage } from '@/lib/kpiStore';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: Partial<KPIAssignment>) => void;
  initialData?: KPIAssignment | null;
  mode?: 'create' | 'edit';
}

export default function KpiModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: KpiModalProps) {
  const [formData, setFormData] = useState<Partial<KPIAssignment>>({
    kpi_name: '',
    unit: 'VND',
    assignee_type: 'Department',
    assignee_name: 'Phòng Kinh Doanh 1',
    period: 'Tháng 07/2026',
    target_value: 1000000000,
    actual_value: 850000000,
    progress_percentage: 85.0,
    weight: 100,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        kpi_name: 'Doanh Số Kinh Doanh Chốt Hợp Đồng Dịch Vụ',
        unit: 'VND',
        assignee_type: 'Department',
        assignee_name: 'Phòng Kinh Doanh 1',
        period: 'Tháng 07/2026',
        target_value: 1000000000,
        actual_value: 850000000,
        progress_percentage: 85.0,
        weight: 100,
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const target = Number(formData.target_value) || 0;
  const actual = Number(formData.actual_value) || 0;
  const computedProgress = calculateProgressPercentage(target, actual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      target_value: target,
      actual_value: actual,
      progress_percentage: computedProgress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-line shadow-cardLg w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-brand-50 text-brand-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow-md">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'create' ? 'Giao Chỉ Tiêu KPI Mới (Multi-Level Target)' : `Chỉnh Sửa Tiến Độ KPI`}
              </h2>
              <p className="text-xs text-ink-400">
                Tự động tính toán % tiến độ hoàn thành dựa trên Thực tế / Chỉ tiêu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-line-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Level Selection */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-2">Cấp Bậc Giao Chỉ Tiêu (Level Assignment) *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Company', label: '🏢 Công Ty', desc: 'Toàn Tập Đoàn' },
                { id: 'Department', label: '🏛️ Phòng Ban', desc: 'Cấp Phòng' },
                { id: 'Team', label: '👥 Đội Nhóm', desc: 'Cấp Team' },
                { id: 'Individual', label: '👤 Cá Nhân', desc: 'Từng Cán Bộ' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, assignee_type: lvl.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.assignee_type === lvl.id
                      ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-600/20 text-brand-900 font-bold'
                      : 'bg-white border-line hover:bg-surface-subtle text-ink-700'
                  }`}
                >
                  <p className="text-xs font-bold">{lvl.label}</p>
                  <p className="text-[10px] text-ink-500 mt-0.5">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Tên Đối Tượng Nhận KPI *</label>
              <input
                type="text"
                value={formData.assignee_name || ''}
                onChange={e => setFormData({ ...formData, assignee_name: e.target.value })}
                placeholder="Ví dụ: Phòng Kinh Doanh 1 / Trần Văn Hoàng"
                className="w-full px-3 py-2 border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Chu Kỳ KPI (Period) *</label>
              <input
                type="text"
                value={formData.period || 'Tháng 07/2026'}
                onChange={e => setFormData({ ...formData, period: e.target.value })}
                placeholder="Tháng 07/2026"
                className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1">Tên Chỉ Tiêu KPI *</label>
            <input
              type="text"
              value={formData.kpi_name || ''}
              onChange={e => setFormData({ ...formData, kpi_name: e.target.value })}
              placeholder="Doanh Số Chốt Hợp Đồng Dịch Vụ Vận Hành Shopee/TikTok"
              className="w-full px-3 py-2 border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Đơn Vị Đo Lường *</label>
              <select
                value={formData.unit || 'VND'}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="VND">VND (Số Tiền)</option>
                <option value="Gian Hàng">Gian Hàng</option>
                <option value="Hợp Đồng">Hợp Đồng</option>
                <option value="Leads">Leads</option>
                <option value="%">% Tỷ Lệ</option>
                <option value="Phiên Live">Phiên Livestream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Mục Tiêu Chỉ Tiêu (Target) *</label>
              <input
                type="number"
                value={formData.target_value || 0}
                onChange={e => setFormData({ ...formData, target_value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Thực Tế Đạt Được (Actual) *</label>
              <input
                type="number"
                value={formData.actual_value || 0}
                onChange={e => setFormData({ ...formData, actual_value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-line rounded-xl text-xs font-extrabold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>
          </div>

          {/* Automated Percentage Calculation Banner */}
          <div className="bg-gradient-to-r from-brand-600 to-white p-4 rounded-xl text-white shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-200/30 flex items-center justify-center font-bold text-brand-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-brand-400 font-bold uppercase tracking-wider">Tự Động Tính Tiến Độ (Automated Progress Calculation):</p>
                <p className="text-xs text-ink-400 mt-0.5 font-mono">
                  (Thực Tế / Chỉ Tiêu) × 100% = <span className="font-extrabold text-warn-fg text-sm">{computedProgress}%</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                computedProgress >= 100
                  ? 'bg-success-dot text-white border-success-border'
                  : computedProgress >= 80
                  ? 'bg-brand-600 text-white border-brand-200'
                  : 'bg-warn-fg text-white border-gold-border'
              }`}>
                {computedProgress >= 100 ? '🎉 Vượt Chỉ Tiêu' : computedProgress >= 80 ? '👍 Đạt Tiến Độ' : '⚠️ Cần Nỗ Lực'}
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-bold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
            >
              {mode === 'create' ? 'Giao Chỉ Tiêu KPI' : 'Cập Nhật Tiến Độ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
