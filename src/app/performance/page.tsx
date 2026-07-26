'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Sliders,
  CheckCircle2,
  Edit3,
  Trash2,
  Filter,
  Search,
  Calendar,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { PerformanceScorecard, FormulaWeights, RatingGrade } from '@/types';
import {
  getScorecardsByPeriod,
  createScorecard,
  updateScorecard,
  deleteScorecard,
  getFormulaWeights,
  updateFormulaWeights,
  runAutomatedBatchEvaluation,
} from '@/lib/performanceStore';
import dynamic from 'next/dynamic';

const ScorecardModal = dynamic(() => import('@/components/performance/ScorecardModal'), { ssr: false });
const FormulaConfigModal = dynamic(() => import('@/components/performance/FormulaConfigModal'), { ssr: false });

export default function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');
  const [scorecards, setScorecards] = useState<PerformanceScorecard[]>(() => getScorecardsByPeriod('Tháng 07/2026'));
  const [weights, setWeights] = useState<FormulaWeights>(() => getFormulaWeights());
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [scorecardModalMode, setScorecardModalMode] = useState<'create' | 'edit'>('create');
  const [selectedScorecard, setSelectedScorecard] = useState<PerformanceScorecard | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [autoRunToast, setAutoRunToast] = useState<string | null>(null);

  useEffect(() => {
    setScorecards(getScorecardsByPeriod(selectedPeriod));
  }, [selectedPeriod]);

  const filteredScorecards = scorecards.filter((sc) => {
    const matchesGrade = selectedGrade === 'ALL' || sc.rating_grade === selectedGrade;
    const matchesStatus = selectedStatus === 'ALL' || sc.status === selectedStatus;
    const matchesSearch =
      sc.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGrade && matchesStatus && matchesSearch;
  });

  const handleSaveScorecard = (scData: Partial<PerformanceScorecard>) => {
    if (scorecardModalMode === 'create') {
      createScorecard({ ...scData, period: selectedPeriod } as any);
      setScorecards(getScorecardsByPeriod(selectedPeriod));
    } else if (selectedScorecard) {
      updateScorecard(selectedScorecard.id, scData);
      setScorecards(getScorecardsByPeriod(selectedPeriod));
    }
  };

  const handleSaveFormulaWeights = (newWeights: FormulaWeights) => {
    const updated = updateFormulaWeights(newWeights);
    setWeights(updated);
    setScorecards(getScorecardsByPeriod(selectedPeriod));
  };

  const handleRunAutoBatch = () => {
    const updated = runAutomatedBatchEvaluation(selectedPeriod);
    setScorecards([...updated.filter(s => s.period === selectedPeriod)]);
    setAutoRunToast(`Đã tự động chấm điểm & khóa bảng điểm ${selectedPeriod} gửi HR!`);
    setTimeout(() => setAutoRunToast(null), 4000);
  };

  const handleDeleteScorecard = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bảng điểm này?')) {
      deleteScorecard(id);
      setScorecards(getScorecardsByPeriod(selectedPeriod));
    }
  };

  const getRatingBadgeText = (grade: RatingGrade) => {
    switch (grade) {
      case 'S': return 'A+ Xuất sắc';
      case 'A': return 'A Giỏi';
      case 'B': return 'B Khá';
      case 'C': return 'C Trung bình';
      case 'D': return 'D Yếu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {autoRunToast && (
        <div className="bg-success-fg text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            {autoRunToast}
          </div>
          <button onClick={() => setAutoRunToast(null)} className="text-white/80 hover:text-brand-800 font-bold text-xs">
            Đóng
          </button>
        </div>
      )}

      {/* Header & Period Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">Chấm Điểm Hiệu Suất Cá Nhân</h1>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Đánh giá hiệu suất nhân sự và xếp loại danh hiệu hàng tháng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* MONTH / PERIOD SELECTOR DROP-DOWN */}
          <div className="flex items-center gap-2 bg-line-soft p-1.5 rounded-xl border border-line">
            <Calendar className="w-4 h-4 text-brand-600 ml-1" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent font-bold text-ink-900 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Tháng 06/2026">Tháng 06/2026</option>
              <option value="Tháng 05/2026">Tháng 05/2026</option>
              <option value="Tháng 08/2026">Tháng 08/2026</option>
            </select>
          </div>

          <button
            onClick={() => setIsFormulaModalOpen(true)}
            className="px-3.5 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-ink-500" /> Cấu Hình Trọng Số
          </button>
          <button
            onClick={handleRunAutoBatch}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all"
          >
            <Send className="w-4 h-4 text-warn-fg" /> Duyệt & Gửi HR
          </button>
        </div>
      </div>

      {/* RATING GRADE THRESHOLDS BANNER */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-white p-5 rounded-2xl text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-warn-fg uppercase tracking-wider">Thang Điểm & Xếp Loại Danh Hiệu:</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1 bg-warn-fg text-white rounded-xl">🏆 A+ Xuất sắc: ≥ {weights.grade_s_threshold}đ</span>
          <span className="px-3 py-1 bg-brand-600 text-white rounded-xl">🥇 A Giỏi: ≥ {weights.grade_a_threshold}đ</span>
          <span className="px-3 py-1 bg-success-fg text-white rounded-xl">🥈 B Khá: ≥ {weights.grade_b_threshold}đ</span>
          <span className="px-3 py-1 bg-steel-bg text-steel-fg rounded-xl">🥉 C Trung bình: ≥ {weights.grade_c_threshold}đ</span>
          <span className="px-3 py-1 bg-danger-fg text-white rounded-xl">⚠️ D Yếu: &lt; 60đ</span>
        </div>
      </div>

      {/* Scorecards Table Section */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm Nhân sự, Mã NV, Phòng ban..."
                className="w-full pl-9 pr-3 py-1.5 bg-surface-subtle border border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1 bg-line-soft p-1 rounded-xl">
              {['ALL', 'S', 'A', 'B', 'C', 'D'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGrade === g ? 'bg-brand-600 text-white ' : 'text-ink-500 hover:bg-line'
                  }`}
                >
                  {g === 'ALL' ? 'Tất cả Danh Hiệu' : g === 'S' ? 'A+ Xuất sắc' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedScorecard(null);
                setScorecardModalMode('create');
                setIsScorecardModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-line-soft hover:bg-line text-ink-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo Scorecard Mới
            </button>
            <span className="text-xs text-ink-500 font-medium">
              Kỳ đánh giá: <strong className="text-brand-800 font-bold">{selectedPeriod}</strong> ({filteredScorecards.length} cán bộ)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider">
                <th className="p-4">Nhân Sự</th>
                <th className="p-4">Kỳ Đánh Giá</th>
                <th className="p-4">Điểm KPI</th>
                <th className="p-4">Kỷ Luật CRM</th>
                <th className="p-4">Teamwork</th>
                <th className="p-4">CSAT</th>
                <th className="p-4">Thưởng / Phạt</th>
                <th className="p-4">Điểm Quy Đổi</th>
                <th className="p-4">Xếp Loại</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredScorecards.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-ink-400 italic">
                    Không tìm thấy bảng điểm hiệu suất phù hợp cho {selectedPeriod}.
                  </td>
                </tr>
              ) : (
                filteredScorecards.map((sc) => (
                  <tr key={sc.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-ink-900 text-sm">{sc.employee_name}</p>
                      <p className="text-ink-500 text-[11px] font-mono">{sc.employee_code} • {sc.department}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-ink-900">{sc.period}</p>
                      {sc.period.includes('Tạm Tính') ? (
                        <span className="px-2 py-0.5 bg-warn-bg text-warn-fg border border-gold-border text-[10px] font-bold rounded flex items-center gap-1 w-fit mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-warn-fg" /> Tạm Tính từ KPIs
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-success-bg text-success-fg text-[10px] font-bold rounded w-fit mt-0.5 block">
                          ✓ Đã Gửi HR
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-brand-600">{sc.kpi_score} / 10</td>
                    <td className="p-4 font-medium text-plum-fg">{sc.compliance_score} / 10</td>
                    <td className="p-4 font-medium text-success-fg">{sc.teamwork_score ?? 8.5} / 10</td>
                    <td className="p-4 font-medium text-warn-fg">{sc.csat_score ?? 8.5} / 10</td>

                    <td className="p-4 font-medium">
                      <span className="text-success-fg font-bold">+{sc.bonus_score}đ</span> / <span className="text-danger-fg font-bold">-{sc.penalty_score}đ</span>
                    </td>

                    <td className="p-4 font-mono font-extrabold text-brand-900 text-sm">
                      {sc.final_score.toFixed(1)} <span className="text-[10px] font-normal text-ink-400">/ 100đ</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black  ${
                        sc.rating_grade === 'S' ? 'bg-warn-fg text-white shadow-card' :
                        sc.rating_grade === 'A' ? 'bg-brand-600 text-white' :
                        sc.rating_grade === 'B' ? 'bg-success-fg text-white' :
                        sc.rating_grade === 'C' ? 'bg-steel-bg text-steel-fg' : 'bg-danger-fg text-white'
                      }`}>
                        🏆 {getRatingBadgeText(sc.rating_grade)}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedScorecard(sc);
                            setScorecardModalMode('edit');
                            setIsScorecardModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-brand-50 text-brand-800 hover:bg-brand-300 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Chấm Sliders
                        </button>
                        <button
                          onClick={() => handleDeleteScorecard(sc.id)}
                          className="p-1 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ScorecardModal
        isOpen={isScorecardModalOpen}
        onClose={() => setIsScorecardModalOpen(false)}
        onSave={handleSaveScorecard}
        initialData={selectedScorecard}
        mode={scorecardModalMode}
      />

      <FormulaConfigModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        weights={weights}
        onSave={handleSaveFormulaWeights}
      />
    </div>
  );
}
