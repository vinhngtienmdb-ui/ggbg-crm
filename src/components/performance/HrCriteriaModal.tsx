'use client';

import React, { useState, useEffect } from 'react';
import { X, Sliders, ShieldCheck, Plus, Trash2, Check, AlertCircle, Info, Sparkles, UserCheck } from 'lucide-react';
import { EvaluationCriterion, AssessorRole } from '@/types';
import { getHrCriteria, saveHrCriteria } from '@/lib/performanceStore';

interface HrCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function HrCriteriaModal({ isOpen, onClose, onSaveSuccess }: HrCriteriaModalProps) {
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCriteria(getHrCriteria());
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalWeight = criteria.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

  const handleUpdateItem = (index: number, field: keyof EvaluationCriterion, value: any) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], [field]: value };
    setCriteria(updated);
  };

  const handleAddCriterion = () => {
    const newItem: EvaluationCriterion = {
      id: `crit_${Date.now()}`,
      code: `CRIT_CUSTOM_${Date.now().toString().slice(-4)}`,
      name: 'Tiêu chí đánh giá mới',
      assessor_role: 'DIRECT_MANAGER',
      weight: 10,
      description: 'Mô tả nội dung tiêu chí và quy định chấm điểm',
    };
    setCriteria([...criteria, newItem]);
  };

  const handleDeleteCriterion = (id: string) => {
    if (criteria.length <= 1) {
      alert('Phải giữ ít nhất 1 tiêu chí đánh giá trong hệ thống!');
      return;
    }
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      setErrorMsg(`Tổng trọng số tất cả tiêu chí phải bằng 100% (Hiện tại: ${totalWeight}%). Vui lòng điều chỉnh lại!`);
      return;
    }

    saveHrCriteria(criteria);
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Cấu Hình Tiêu Chí Đánh Giá HR & Phân Định Thẩm Quyền</h2>
              <p className="text-xs text-slate-300">
                Phòng HR thiết lập danh mục tiêu chí & phân công người chấm (Quản lý trực tiếp / Quản lý gián tiếp / HR)
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Weight Sum Meter */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-700 block">Tổng Trọng Số Đánh Giá:</span>
              <span className="text-slate-500">Quy định tổng trọng số các tiêu chí phải đạt chính xác 100%</span>
            </div>
            <div className="flex items-center gap-2 font-mono font-black text-sm">
              <span className={`px-3 py-1 rounded-xl ${totalWeight === 100 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                {totalWeight}%
              </span>
              {totalWeight === 100 ? (
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Hợp lệ
                </span>
              ) : (
                <span className="text-red-600 text-xs font-bold">Chưa cân bằng!</span>
              )}
            </div>
          </div>

          {/* Criteria List Editor */}
          <div className="space-y-3">
            {criteria.map((item, idx) => (
              <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-mono font-extrabold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>

                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                    placeholder="Tên tiêu chí đánh giá"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-slate-500">Trọng số:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={item.weight}
                      onChange={(e) => handleUpdateItem(idx, 'weight', Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCriterion(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Thẩm Quyền Đánh Giá (Assessor Role)
                    </label>
                    <select
                      value={item.assessor_role}
                      onChange={(e) => handleUpdateItem(idx, 'assessor_role', e.target.value as AssessorRole)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="DIRECT_MANAGER">👔 Quản Lý Trực Tiếp</option>
                      <option value="INDIRECT_MANAGER">👥 Quản Lý Gián Tiếp / Ban Giám Đốc</option>
                      <option value="HR">📋 Phòng Nhân Sự (HR)</option>
                      <option value="SELF">👤 Cá Nhân Tự Đánh Giá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mô Tả Tiêu Chí & Quy Định Chấm
                    </label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                      placeholder="Mô tả tiêu chuẩn đạt và lưu ý..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCriterion}
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Thêm Tiêu Chí Đánh Giá Mới
          </button>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" /> Lưu Thiết Lập Tiêu Chí HR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
