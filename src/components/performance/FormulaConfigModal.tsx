'use client';

import React, { useState } from 'react';
import { X, Sliders, Sparkles, Check, RefreshCw } from 'lucide-react';
import { FormulaWeights } from '@/types';

interface FormulaConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: FormulaWeights;
  onSave: (newWeights: FormulaWeights) => void;
}

export default function FormulaConfigModal({
  isOpen,
  onClose,
  weights,
  onSave,
}: FormulaConfigModalProps) {
  const [formData, setFormData] = useState<FormulaWeights>({ ...weights });

  if (!isOpen) return null;

  const totalWeight = Number(formData.kpi_weight) + Number(formData.compliance_weight) + Number(formData.behavior_weight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      alert('Tổng trọng số ba thành phần (KPI + Kỷ luật + Thái độ) phải bằng 100%!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-line shadow-cardLg w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-brand-50 text-brand-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warn-fg flex items-center justify-center font-bold text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Cấu Hình Trọng Số & Ngưỡng Xếp Loại Performance</h2>
              <p className="text-xs text-ink-400">
                Formula Engine: Tổng Điểm = (KPI × W1) + (Kỷ Luật × W2) + (Thái Độ × W3) + Thưởng - Phạt
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Component Weights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900">
                1. Trọng Số Các Thành Phần (%)
              </h3>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                totalWeight === 100 ? 'bg-success-bg text-success-fg' : 'bg-danger-bg text-danger-fg'
              }`}>
                Tổng: {totalWeight}% {totalWeight !== 100 && '(Phải = 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-subtle p-3 rounded-xl border border-line">
                <label className="block text-[11px] font-semibold text-ink-700 mb-1">Điểm KPI (%)</label>
                <input
                  type="number"
                  value={formData.kpi_weight}
                  onChange={e => setFormData({ ...formData, kpi_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-line rounded-lg text-xs font-bold text-brand-600 text-center"
                  min="0"
                  max="100"
                />
              </div>

              <div className="bg-surface-subtle p-3 rounded-xl border border-line">
                <label className="block text-[11px] font-semibold text-ink-700 mb-1">Kỷ Luật CRM (%)</label>
                <input
                  type="number"
                  value={formData.compliance_weight}
                  onChange={e => setFormData({ ...formData, compliance_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-line rounded-lg text-xs font-bold text-ink-900 text-center"
                  min="0"
                  max="100"
                />
              </div>

              <div className="bg-surface-subtle p-3 rounded-xl border border-line">
                <label className="block text-[11px] font-semibold text-ink-700 mb-1">Thái Độ & CSKH (%)</label>
                <input
                  type="number"
                  value={formData.behavior_weight}
                  onChange={e => setFormData({ ...formData, behavior_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-line rounded-lg text-xs font-bold text-ink-900 text-center"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Rating Grade Thresholds */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 mb-2">
              2. Ngưỡng Tự Động Xếp Loại Performance Grade (S / A / B / C / D)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-warn-bg p-3 rounded-xl border border-gold-border">
                <label className="block text-xs font-bold text-warn-fg mb-1">GRADE S (Xuất Sắc Vượt Trội)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-warn-fg">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_s_threshold}
                    onChange={e => setFormData({ ...formData, grade_s_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-gold-border rounded text-xs font-bold text-warn-fg"
                  />
                  <span className="text-xs text-warn-fg">% (hoặc Điểm ≥ 9.5)</span>
                </div>
              </div>

              <div className="bg-brand-50 p-3 rounded-xl border border-brand-100">
                <label className="block text-xs font-bold text-brand-900 mb-1">GRADE A (Hoàn Thành Xuất Sắc)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-brand-800">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_a_threshold}
                    onChange={e => setFormData({ ...formData, grade_a_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-brand-200 rounded text-xs font-bold text-brand-900"
                  />
                  <span className="text-xs text-brand-800">% (hoặc Điểm ≥ 8.5)</span>
                </div>
              </div>

              <div className="bg-success-bg p-3 rounded-xl border border-success-border">
                <label className="block text-xs font-bold text-success-fg mb-1">GRADE B (Hoàn Thành Tốt)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-success-fg">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_b_threshold}
                    onChange={e => setFormData({ ...formData, grade_b_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-success-border rounded text-xs font-bold text-success-fg"
                  />
                  <span className="text-xs text-success-fg">% (hoặc Điểm ≥ 7.0)</span>
                </div>
              </div>

              <div className="bg-line-soft p-3 rounded-xl border border-line-strong">
                <label className="block text-xs font-bold text-ink-900 mb-1">GRADE C (Đạt Yêu Cầu)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-ink-700">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_c_threshold}
                    onChange={e => setFormData({ ...formData, grade_c_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-line-strong rounded text-xs font-bold text-ink-900"
                  />
                  <span className="text-xs text-ink-700">% (D: &lt; 60%)</span>
                </div>
              </div>
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
              Cập Nhật Cấu Hình Formula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
