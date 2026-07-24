'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, Sparkles, CheckCircle2, Calculator, Sliders, ThumbsUp, ShieldCheck, HeartHandshake, Smile } from 'lucide-react';
import { PerformanceScorecard, FormulaWeights, RatingGrade } from '@/types';
import { calculateFinalScore, classifyRatingGrade, getFormulaWeights } from '@/lib/performanceStore';

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
  const [formData, setFormData] = useState<Partial<PerformanceScorecard>>({
    employee_name: '',
    employee_code: '',
    department: 'Phòng Kinh Doanh 1',
    period: 'Tháng 07/2026',
    kpi_score: 9.0,
    compliance_score: 9.0,
    teamwork_score: 8.5,
    csat_score: 8.5,
    behavior_score: 8.5,
    bonus_score: 0,
    penalty_score: 0,
    achievement_percentage: 100,
    status: 'Submitted',
    reviewer_notes: '',
  });

  const weights = getFormulaWeights();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        teamwork_score: initialData.teamwork_score ?? 8.5,
        csat_score: initialData.csat_score ?? 8.5,
      });
    } else {
      setFormData({
        employee_name: 'Trần Văn Hoàng',
        employee_code: 'NV-00101',
        department: 'Phòng Kinh Doanh 1',
        period: 'Tháng 07/2026',
        kpi_score: 9.5,
        compliance_score: 9.0,
        teamwork_score: 9.0,
        csat_score: 9.5,
        behavior_score: 9.0,
        bonus_score: 5,
        penalty_score: 0,
        achievement_percentage: 110,
        status: 'Submitted',
        reviewer_notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const kpiScore = Number(formData.kpi_score) || 0;
  const complianceScore = Number(formData.compliance_score) || 0;
  const teamworkScore = Number(formData.teamwork_score) || 8.5;
  const csatScore = Number(formData.csat_score) || 8.5;
  const bonusScore = Number(formData.bonus_score) || 0;
  const penaltyScore = Number(formData.penalty_score) || 0;
  const achievementPct = Number(formData.achievement_percentage) || (kpiScore * 10);

  const computedFinalScore = calculateFinalScore(
    kpiScore,
    complianceScore,
    teamworkScore,
    csatScore,
    bonusScore,
    penaltyScore,
    weights
  );

  const computedRatingGrade = classifyRatingGrade(computedFinalScore, weights);

  const getGradeTitleLabel = (grade: RatingGrade) => {
    switch (grade) {
      case 'S': return 'A+ Xuất sắc (≥ 90 điểm)';
      case 'A': return 'A Giỏi (80 - 89 điểm)';
      case 'B': return 'B Khá (70 - 79 điểm)';
      case 'C': return 'C Trung bình (60 - 69 điểm)';
      case 'D': return 'D Yếu (< 60 điểm)';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      kpi_score: kpiScore,
      compliance_score: complianceScore,
      teamwork_score: teamworkScore,
      csat_score: csatScore,
      behavior_score: (teamworkScore + csatScore) / 2,
      bonus_score: bonusScore,
      penalty_score: penaltyScore,
      final_score: computedFinalScore,
      rating_grade: computedRatingGrade,
      achievement_percentage: achievementPct,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'create' ? 'Tạo Bảng Điểm Hiệu Suất' : `Chấm Điểm Cá Nhân: ${formData.employee_name}`}
              </h2>
              <p className="text-xs text-slate-300">
                {formData.employee_code} • {formData.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Employee Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ Và Tên Nhân Sự *</label>
              <input
                type="text"
                value={formData.employee_name || ''}
                onChange={e => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="Trần Văn Hoàng"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Nhân Viên *</label>
              <input
                type="text"
                value={formData.employee_code || ''}
                onChange={e => setFormData({ ...formData, employee_code: e.target.value })}
                placeholder="NV-00101"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng Ban *</label>
              <select
                value={formData.department || 'Phòng Kinh Doanh 1'}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kỳ Đánh Giá *</label>
              <input
                type="text"
                value={formData.period || 'Tháng 07/2026'}
                onChange={e => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* VISUAL SLIDER SCORING TOOL */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Chấm Điểm Chi Tiết
            </h4>

            {/* Slider 1: KPI Score */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-blue-600" /> Điểm KPI
                </span>
                <span className="font-mono font-extrabold text-blue-700 text-sm">{kpiScore.toFixed(1)} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={kpiScore}
                onChange={e => setFormData({ ...formData, kpi_score: parseFloat(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Slider 2: Compliance Score */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Kỷ Luật CRM
                </span>
                <span className="font-mono font-extrabold text-purple-700 text-sm">{complianceScore.toFixed(1)} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={complianceScore}
                onChange={e => setFormData({ ...formData, compliance_score: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Slider 3: Teamwork Score */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" /> Teamwork
                </span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">{teamworkScore.toFixed(1)} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={teamworkScore}
                onChange={e => setFormData({ ...formData, teamwork_score: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Slider 4: CSAT Score */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-600" /> CSAT
                </span>
                <span className="font-mono font-extrabold text-amber-700 text-sm">{csatScore.toFixed(1)} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={csatScore}
                onChange={e => setFormData({ ...formData, csat_score: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Bonus & Penalty Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Điểm Thưởng</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bonus_score || 0}
                  onChange={e => setFormData({ ...formData, bonus_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Điểm Phạt</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.penalty_score || 0}
                  onChange={e => setFormData({ ...formData, penalty_score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          {/* SCORE CONVERSION BANNER */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-blue-300 font-bold uppercase tracking-wider">
                Tổng Điểm Quy Đổi:
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-amber-400">
                  {computedFinalScore.toFixed(1)} <span className="text-sm font-normal text-slate-300">/ 100 Điểm</span>
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Danh Hiệu Xếp Loại Tự Động:</p>
              <span className={`px-4 py-2 rounded-2xl text-sm font-black shadow-lg inline-block ${
                computedRatingGrade === 'S' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                computedRatingGrade === 'A' ? 'bg-blue-600 text-white' :
                computedRatingGrade === 'B' ? 'bg-emerald-600 text-white' :
                computedRatingGrade === 'C' ? 'bg-slate-600 text-white' : 'bg-red-600 text-white'
              }`}>
                🏆 {getGradeTitleLabel(computedRatingGrade)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhận Xét / Ghi Chú Của Quản Lý</label>
            <textarea
              rows={2}
              value={formData.reviewer_notes || ''}
              onChange={e => setFormData({ ...formData, reviewer_notes: e.target.value })}
              placeholder="Nhập nhận xét chi tiết về hiệu suất làm việc..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              {mode === 'create' ? 'Tạo Scorecard Hiệu Suất' : 'Lưu Thay Đổi & Cập Nhật Điểm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
