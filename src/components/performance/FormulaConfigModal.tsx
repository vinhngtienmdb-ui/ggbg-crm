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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 text-slate-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Cấu Hình Trọng Số & Ngưỡng Xếp Loại Performance</h2>
              <p className="text-xs text-slate-500">
                Formula Engine: Tổng Điểm = (KPI × W1) + (Kỷ Luật × W2) + (Thái Độ × W3) + Thưởng - Phạt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Component Weights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Trọng Số Các Thành Phần (%)
              </h3>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                Tổng: {totalWeight}% {totalWeight !== 100 && '(Phải = 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Điểm KPI (%)</label>
                <input
                  type="number"
                  value={formData.kpi_weight}
                  onChange={e => setFormData({ ...formData, kpi_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 text-center"
                  min="0"
                  max="100"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kỷ Luật CRM (%)</label>
                <input
                  type="number"
                  value={formData.compliance_weight}
                  onChange={e => setFormData({ ...formData, compliance_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-center"
                  min="0"
                  max="100"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thái Độ & CSKH (%)</label>
                <input
                  type="number"
                  value={formData.behavior_weight}
                  onChange={e => setFormData({ ...formData, behavior_weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-center"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Rating Grade Thresholds */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              2. Ngưỡng Tự Động Xếp Loại Performance Grade (S / A / B / C / D)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-900 mb-1">GRADE S (Xuất Sắc Vượt Trội)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-amber-800">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_s_threshold}
                    onChange={e => setFormData({ ...formData, grade_s_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-amber-900"
                  />
                  <span className="text-xs text-amber-800">% (hoặc Điểm ≥ 9.5)</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <label className="block text-xs font-bold text-blue-900 mb-1">GRADE A (Hoàn Thành Xuất Sắc)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-800">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_a_threshold}
                    onChange={e => setFormData({ ...formData, grade_a_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-blue-300 rounded text-xs font-bold text-blue-900"
                  />
                  <span className="text-xs text-blue-800">% (hoặc Điểm ≥ 8.5)</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <label className="block text-xs font-bold text-emerald-900 mb-1">GRADE B (Hoàn Thành Tốt)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-emerald-800">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_b_threshold}
                    onChange={e => setFormData({ ...formData, grade_b_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-emerald-300 rounded text-xs font-bold text-emerald-900"
                  />
                  <span className="text-xs text-emerald-800">% (hoặc Điểm ≥ 7.0)</span>
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded-xl border border-slate-300">
                <label className="block text-xs font-bold text-slate-800 mb-1">GRADE C (Đạt Yêu Cầu)</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-700">Tiến độ ≥</span>
                  <input
                    type="number"
                    value={formData.grade_c_threshold}
                    onChange={e => setFormData({ ...formData, grade_c_threshold: Number(e.target.value) })}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                  <span className="text-xs text-slate-700">% (D: &lt; 60%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Cập Nhật Cấu Hình Formula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
