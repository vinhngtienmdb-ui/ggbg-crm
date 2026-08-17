'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  TrendingUp,
  Calculator,
  Check,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  FileText,
  User,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { PerformanceScorecard, SelfWorkItem, ScorecardStatus } from '@/types';
import {
  calculateFinalScore,
  classifyRatingGrade,
  calculateP3Salary,
  getFormulaWeights,
  getHrCriteria,
  syncEmployeeKpisToScorecard
} from '@/lib/performanceStore';
import { formatCurrency } from '@/lib/formatters';

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sc: Partial<PerformanceScorecard>) => void;
  initialData?: PerformanceScorecard | null;
  mode?: 'create' | 'edit';
}

export default function ScorecardModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: ScorecardModalProps) {
  const [weights] = useState(() => getFormulaWeights());
  const [hrCriteria] = useState(() => getHrCriteria());

  const [formData, setFormData] = useState<Partial<PerformanceScorecard>>({
    employee_name: '',
    employee_code: '',
    department: 'Phòng Kinh Doanh 1',
    position: 'Chuyên Viên',
    period: 'Tháng 07/2026',
    kpi_score: 9.0,
    compliance_score: 9.0,
    teamwork_score: 8.5,
    csat_score: 8.5,
    behavior_score: 8.5,
    bonus_score: 0,
    penalty_score: 0,
    base_p3_salary: 4000000,
    status: 'DRAFT_SELF',
    reviewer_notes: '',
    self_work_items: [],
  });

  const [workItems, setWorkItems] = useState<SelfWorkItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setWorkItems(initialData.self_work_items || []);
    } else {
      setFormData({
        employee_name: 'Trần Văn Hoàng',
        employee_code: 'NV-00101',
        department: 'Phòng Kinh Doanh 1',
        position: 'Chuyên Viên Kinh Doanh',
        period: 'Tháng 07/2026',
        kpi_score: 9.0,
        compliance_score: 9.0,
        teamwork_score: 8.5,
        csat_score: 8.5,
        behavior_score: 8.5,
        bonus_score: 0,
        penalty_score: 0,
        base_p3_salary: 4000000,
        status: 'DRAFT_SELF',
        reviewer_notes: '',
        self_work_items: [],
      });
      setWorkItems([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const kpiScore = Number(formData.kpi_score) || 0;
  const compScore = Number(formData.compliance_score) || 0;
  const twScore = Number(formData.teamwork_score) || 8.5;
  const csatScore = Number(formData.csat_score) || 8.5;
  const bonus = Number(formData.bonus_score) || 0;
  const penalty = Number(formData.penalty_score) || 0;
  const baseP3 = Number(formData.base_p3_salary) || 4000000;

  const computedFinalScore = calculateFinalScore(kpiScore, compScore, twScore, csatScore, bonus, penalty, weights);
  const computedGrade = classifyRatingGrade(computedFinalScore, weights);
  const { calculatedP3, multiplier } = calculateP3Salary(baseP3, computedGrade, weights);

  const handleAddWorkItem = () => {
    const newItem: SelfWorkItem = {
      id: `work_${Date.now()}`,
      work_title: '',
      result_summary: '',
      self_score: 9.0,
    };
    setWorkItems([...workItems, newItem]);
  };

  const handleUpdateWorkItem = (idx: number, field: keyof SelfWorkItem, value: any) => {
    const updated = [...workItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setWorkItems(updated);
  };

  const handleDeleteWorkItem = (id: string) => {
    setWorkItems(workItems.filter((w) => w.id !== id));
  };

  const handleSyncKpis = () => {
    if (!formData.employee_name) return;
    const syncedScore = syncEmployeeKpisToScorecard(formData.employee_name, formData.period || 'Tháng 07/2026');
    setFormData((prev) => ({
      ...prev,
      kpi_score: syncedScore,
      auto_synced_kpis: true,
    }));
    alert(`Đã tự động đồng bộ kết quả KPI! Điểm KPI quy đổi: ${syncedScore} / 10`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_name?.trim()) {
      alert('Vui lòng nhập tên nhân sự đánh giá!');
      return;
    }

    onSave({
      ...formData,
      kpi_score: kpiScore,
      compliance_score: compScore,
      teamwork_score: twScore,
      csat_score: csatScore,
      bonus_score: bonus,
      penalty_score: penalty,
      final_score: computedFinalScore,
      rating_grade: computedGrade,
      base_p3_salary: baseP3,
      calculated_p3_salary: calculatedP3,
      p3_multiplier: multiplier,
      self_work_items: workItems,
    });
    onClose();
  };

  return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"> <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200"> {/* Header */} <div className="bg-slate-900 text-white p-5 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-medium text-white shadow-md"> <Award className="w-5 h-5" /> </div> <div> <h2 className="text-base font-semibold text-white"> {mode === 'create' ? 'Tạo Bảng Điểm Hiệu Suất Tháng Mới' : 'Đánh Giá Hiệu Suất & Tự Tính Lương P3'} </h2> <p className="text-xs text-slate-300"> Đồng bộ kết quả KPI, tự đánh giá công việc & quy trình phê duyệt đa cấp </p> </div> </div> <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          > <X className="w-5 h-5" /> </button> </div> {/* Content Form */} <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"> {/* Employee Basic Info Grid */} <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1"> Tên Nhân Sự <span className="text-red-500">*</span> </label> <input
                type="text"
                required
                value={formData.employee_name || ''}
                onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="VD: Trần Văn Hoàng"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              /> </div> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1"> Mã Nhân Viên & Chức Danh </label> <input
                type="text"
                value={formData.employee_code || ''}
                onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                placeholder="VD: NV-00101"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              /> </div> <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1"> Phòng Ban </label> <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="VD: Phòng Kinh Doanh 1"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              /> </div> </div> {/* Workflow Status Selector */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"> <div> <span className="font-medium text-slate-700 block">Quy Trình & Trạng Thái Phiếu Đánh Giá:</span> <span className="text-slate-500 text-[11px]"> {formData.status === 'DRAFT_SELF' && 'Cá nhân đang tự nhập công việc & tự chấm điểm ngày 01'}
                {formData.status === 'SUBMITTED_MANAGER' && 'Đã chuyển cho Quản lý trực tiếp chấm điểm tiêu chí chuyên môn'}
                {formData.status === 'REVIEWING_HR' && 'Đã chuyển cho HR rà soát nội quy, tuân thủ & tổng hợp'}
                {formData.status === 'FINAL_LOCKED' && 'Bảng điểm đã chốt vĩnh viễn & tự tính Lương P3'} </span> </div> <select
              value={formData.status || 'DRAFT_SELF'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ScorecardStatus })}
              className="px-3 py-1.5 bg-white border border-slate-300 font-semibold text-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            > <option value="DRAFT_SELF">📝 Cá Nhân Tự Đánh Giá (Ngày 01)</option> <option value="SUBMITTED_MANAGER">👔 Quản Lý Trực Tiếp Chấm Điểm</option> <option value="REVIEWING_HR">📋 HR Hoàn Thiện & Rà Soát</option> <option value="FINAL_LOCKED">🔒 Khóa Bảng Điểm & Tính Lương P3</option> </select> </div> {/* SECTION 1: SELF-WORK ITEMS (Cá nhân tự thêm mới công việc hoàn thành kèm kết quả) */} <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3"> <div className="flex items-center justify-between border-b border-slate-100 pb-2"> <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5"> <FileText className="w-4 h-4 text-blue-600" /> Danh Sách Công Việc Hoàn Thành Kèm Kết Quả (Self-Assessment) </h4> <button
                type="button"
                onClick={handleAddWorkItem}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
              > <Plus className="w-3.5 h-3.5" /> Thêm Công Việc </button> </div> {workItems.map((item, idx) => ( <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs"> <div className="flex items-center justify-between gap-2"> <span className="font-medium text-slate-500 font-mono">#{idx + 1}</span> <input
                    type="text"
                    value={item.work_title}
                    onChange={(e) => handleUpdateWorkItem(idx, 'work_title', e.target.value)}
                    placeholder="Tên công việc hoàn thành trong tháng..."
                    className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  /> <div className="flex items-center gap-1 shrink-0"> <span className="text-[11px] font-medium text-slate-500">Tự chấm:</span> <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={item.self_score}
                      onChange={(e) => handleUpdateWorkItem(idx, 'self_score', Number(e.target.value))}
                      className="w-14 px-1.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-medium text-blue-700 text-center"
                    /> <span className="text-[11px] font-medium text-slate-500">/10</span> </div> <button
                    type="button"
                    onClick={() => handleDeleteWorkItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                  > <Trash2 className="w-3.5 h-3.5" /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> <input
                    type="text"
                    value={item.result_summary}
                    onChange={(e) => handleUpdateWorkItem(idx, 'result_summary', e.target.value)}
                    placeholder="Kết quả thực tế đạt được (VD: Đạt 125% kế hoạch)..."
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700"
                  /> <input
                    type="text"
                    value={item.proof_note || ''}
                    onChange={(e) => handleUpdateWorkItem(idx, 'proof_note', e.target.value)}
                    placeholder="Mã hợp đồng / Minh chứng liên quan..."
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700"
                  /> </div> </div> ))}

            {workItems.length === 0 && ( <p className="text-center py-4 text-slate-400 text-xs italic"> Chưa có công việc nào được thêm. Nhấp &apos;Thêm Công Việc&apos; để cá nhân tự báo cáo kết quả. </p> )} </div> {/* SECTION 2: EVALUATION CRITERIA SCORES & KPI SYNC */} <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4"> <div className="flex items-center justify-between border-b border-slate-200 pb-2"> <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5"> <Calculator className="w-4 h-4 text-purple-600" /> Chấm Điểm Tiêu Chí Theo Thẩm Quyền (0 - 10 Điểm) </h4> <button
                type="button"
                onClick={handleSyncKpis}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition-all active:scale-95"
              > <RefreshCw className="w-3.5 h-3.5" /> Đồng Bộ Kết Quả KPI </button> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"> {/* KPI Score */} <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"> <div className="flex items-center justify-between"> <span className="font-semibold text-slate-800 flex items-center gap-1"> Điểm Chỉ Tiêu KPI ({weights.kpi_weight}%) </span> <span className="text-[10px] font-medium text-blue-600">👔 Quản Lý Chấm</span> </div> <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.kpi_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, kpi_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> {/* Compliance Score */} <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"> <div className="flex items-center justify-between"> <span className="font-semibold text-slate-800 flex items-center gap-1"> 📋 Tuân Thủ Nội Quy ({weights.compliance_weight}%) </span> <span className="text-[10px] font-medium text-purple-600">📋 HR Chấm</span> </div> <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.compliance_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, compliance_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> {/* Teamwork Score */} <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"> <div className="flex items-center justify-between"> <span className="font-semibold text-slate-800 flex items-center gap-1"> 👥 Phối Hợp Đội Nhóm ({weights.teamwork_weight || 15}%) </span> <span className="text-[10px] font-medium text-indigo-600">👥 QL Gián Tiếp Chấm</span> </div> <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.teamwork_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, teamwork_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> {/* CSAT / Quality Score */} <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"> <div className="flex items-center justify-between"> <span className="font-semibold text-slate-800 flex items-center gap-1"> Chất Lượng CSAT ({weights.csat_weight || 15}%) </span> <span className="text-[10px] font-medium text-blue-600">👔 Quản Lý Chấm</span> </div> <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.csat_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, csat_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                /> </div> {/* Bonus Score */} <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1"> <span className="font-semibold text-emerald-900 block">🎁 Điểm Thưởng Cộng Thêm (Bonus +)</span> <input
                  type="number"
                  min={0}
                  max={20}
                  value={formData.bonus_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, bonus_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg font-mono font-medium text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                /> </div> {/* Penalty Score */} <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl space-y-1"> <span className="font-semibold text-red-900 block"> Điểm Phạt Trừ (Penalty -)</span> <input
                  type="number"
                  min={0}
                  max={20}
                  value={formData.penalty_score ?? ''}
                  onChange={(e) => setFormData({ ...formData, penalty_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg font-mono font-medium text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                /> </div> </div> </div> {/* SECTION 3: AUTOMATED PERFORMANCE SALARY P3 CALCULATOR & RATING GRADE */} <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl shadow-xl space-y-4 border border-indigo-800/40"> <h4 className="font-semibold text-xs text-white flex items-center gap-1.5 border-b border-slate-800 pb-2"> <DollarSign className="w-4 h-4 text-emerald-400" /> Tự Động Xếp Loại A,B,C,D & Tính Lương Hiệu Suất P3 </h4> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"> <div> <span className="text-slate-300 font-medium block mb-1">Mức Lương P3 Mục Tiêu (Gốc):</span> <input
                  type="number"
                  min={0}
                  step={500000}
                  value={baseP3}
                  onChange={(e) => setFormData({ ...formData, base_p3_salary: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl font-mono font-medium text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                /> </div> <div> <span className="text-slate-300 font-medium block mb-1">Tổng Điểm Tổng Hợp:</span> <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl font-mono font-semibold text-blue-300 text-sm"> {computedFinalScore} / 100 Điểm </div> </div> <div> <span className="text-slate-300 font-medium block mb-1">Xếp Loại Hiệu Suất:</span> <div className="flex items-center gap-2"> <span
                    className={`px-3 py-1 rounded-xl font-semibold text-xs shadow-md ${
                      computedGrade === 'S'
                        ? 'bg-purple-500 text-white'
                        : computedGrade === 'A'
                        ? 'bg-emerald-500 text-slate-950'
                        : computedGrade === 'B'
                        ? 'bg-blue-500 text-white'
                        : computedGrade === 'C'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-red-500 text-white'
                    }`}
                  > Hạng {computedGrade} ({Math.round(multiplier * 100)}% P3) </span> </div> </div> </div> {/* Calculated Final Salary Result */} <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-xl flex items-center justify-between text-xs"> <span className="text-slate-300 font-medium">Lương Hiệu Suất Thực Nhận (P3 Auto-Salary):</span> <span className="font-mono font-semibold text-emerald-400 text-base"> {formatCurrency(calculatedP3)} </span> </div> </div> {/* Notes */} <div> <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1"> Ghi Chú Đánh Giá Của Quản Lý & HR </label> <textarea
              rows={2}
              value={formData.reviewer_notes || ''}
              onChange={(e) => setFormData({ ...formData, reviewer_notes: e.target.value })}
              placeholder="Nhận xét ưu điểm, điểm cần phát huy hoặc ghi chú cho phòng nhân sự..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            /> </div> {/* Actions */} <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200"> <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all"
            > Hủy Bỏ </button> <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            > <Check className="w-4 h-4" /> {mode === 'create' ? 'Tạo Bảng Điểm' : 'Lưu Thay Đổi & Tính Lương P3'} </button> </div> </form> </div> </div> );
}
