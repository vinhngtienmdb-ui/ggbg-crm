'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  Edit3,
  Trash2,
  Filter,
  Search,
  Calendar,
  Clock,
  Send,
  AlertTriangle,
  History
} from 'lucide-react';
import { PerformanceScorecard, FormulaWeights, RatingGrade } from '@/types';
import {
  getScorecards,
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
  // Dữ liệu từ API (dual-mode: Supabase hoặc in-memory phía server); null = chưa tải.
  const [remoteCards, setRemoteCards] = useState<PerformanceScorecard[] | null>(null);

  // Đồng bộ từ API khi mount; lỗi/empty → giữ store fallback.
  useEffect(() => {
    let active = true;
    fetch('/api/performance')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setRemoteCards(data.data as PerformanceScorecard[]);
        }
      })
      .catch(() => {
        /* fallback: giữ store in-memory */
      });
    return () => {
      active = false;
    };
  }, []);

  // Lọc theo kỳ: ưu tiên dữ liệu API, fallback về store (kèm sinh bảng tạm tính).
  useEffect(() => {
    if (remoteCards) {
      const scoped = selectedPeriod === 'ALL' ? remoteCards : remoteCards.filter((s) => s.period === selectedPeriod);
      setScorecards(scoped.length > 0 ? scoped : getScorecardsByPeriod(selectedPeriod));
    } else {
      setScorecards(getScorecardsByPeriod(selectedPeriod));
    }
  }, [selectedPeriod, remoteCards]);

  // Đồng bộ DB kiểu fire-and-forget — nuốt lỗi im lặng.
  const syncPerformanceToApi = (method: 'POST' | 'PUT', payload: Record<string, unknown>, query = '') => {
    fetch(`/api/performance${query}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* im lặng: optimistic update phía client vẫn giữ nguyên */
    });
  };

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
      const created = createScorecard({ ...scData, period: selectedPeriod } as any);
      setScorecards(getScorecardsByPeriod(selectedPeriod));
      syncPerformanceToApi('POST', { ...scData, period: selectedPeriod } as Record<string, unknown>);
      setRemoteCards((prev) => (prev ? [created, ...prev] : prev));
    } else if (selectedScorecard) {
      const updated = updateScorecard(selectedScorecard.id, scData);
      setScorecards(getScorecardsByPeriod(selectedPeriod));
      syncPerformanceToApi('PUT', { id: selectedScorecard.id, ...scData });
      setRemoteCards((prev) => (prev ? prev.map((s) => (s.id === selectedScorecard.id ? updated : s)) : prev));
    }
  };

  const handleSaveFormulaWeights = (newWeights: FormulaWeights) => {
    const updated = updateFormulaWeights(newWeights);
    setWeights(updated);
    setScorecards(getScorecardsByPeriod(selectedPeriod));
  };

  const handleRunAutoBatch = () => {
    const updated = runAutomatedBatchEvaluation(selectedPeriod);
    const scoped = updated.filter((s) => s.period === selectedPeriod);
    setScorecards([...scoped]);
    setRemoteCards(updated);
    syncPerformanceToApi('POST', { period: selectedPeriod }, '?action=batch_auto_score');
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
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            {autoRunToast}
          </div>
          <button onClick={() => setAutoRunToast(null)} className="text-white/80 hover:text-white font-bold text-xs">
            Đóng
          </button>
        </div>
      )}

      {/* Header & Period Selector */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(46,92,230,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-blue-700">Chấm Điểm Hiệu Suất Cá Nhân</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
              Đánh giá hiệu suất nhân sự và xếp loại danh hiệu hàng tháng
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* MONTH / PERIOD SELECTOR DROP-DOWN */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-blue-100">
              <Calendar className="w-4 h-4 text-blue-600 ml-1" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer pr-2"
              >
                <option value="Tháng 07/2026">Tháng 07/2026</option>
                <option value="Tháng 06/2026">Tháng 06/2026</option>
                <option value="Tháng 05/2026">Tháng 05/2026</option>
                <option value="Tháng 08/2026">Tháng 08/2026</option>
              </select>
            </div>

            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-4 h-4 text-blue-600" /> Cấu Hình Trọng Số
            </button>
            <button
              onClick={handleRunAutoBatch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Send className="w-4 h-4 text-amber-300" /> Duyệt & Gửi HR
            </button>
          </div>
        </div>
      </div>

      {/* RATING GRADE THRESHOLDS BANNER */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wide">Thang Điểm & Xếp Loại Danh Hiệu:</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1 bg-amber-500 text-white rounded-xl shadow-xs">🏆 A+ Xuất sắc: ≥ {weights.grade_s_threshold}đ</span>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-xl">🥇 A Giỏi: ≥ {weights.grade_a_threshold}đ</span>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl">🥈 B Khá: ≥ {weights.grade_b_threshold}đ</span>
          <span className="px-3 py-1 bg-slate-600 text-white rounded-xl">🥉 C Trung bình: ≥ {weights.grade_c_threshold}đ</span>
          <span className="px-3 py-1 bg-red-600 text-white rounded-xl">⚠️ D Yếu: &lt; 60đ</span>
        </div>
      </div>

      {/* Scorecards Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm Nhân sự, Mã NV, Phòng ban..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'S', 'A', 'B', 'C', 'D'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGrade === g ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
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
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tạo Scorecard Mới
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Kỳ đánh giá: <strong className="text-blue-700 font-bold">{selectedPeriod}</strong> ({filteredScorecards.length} cán bộ)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10.5px] font-extrabold uppercase tracking-wide">
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
            <tbody className="divide-y divide-slate-100">
              {filteredScorecards.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy bảng điểm hiệu suất phù hợp cho {selectedPeriod}.
                  </td>
                </tr>
              ) : (
                filteredScorecards.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{sc.employee_name}</p>
                      <p className="text-slate-500 text-[11px] font-mono">{sc.employee_code} • {sc.department}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{sc.period}</p>
                      {sc.period.includes('Tạm Tính') ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded flex items-center gap-1 w-fit mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Tạm Tính từ KPIs
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded w-fit mt-0.5 block">
                          ✓ Đã Gửi HR
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-blue-600">{sc.kpi_score} / 10</td>
                    <td className="p-4 font-medium text-purple-700">{sc.compliance_score} / 10</td>
                    <td className="p-4 font-medium text-emerald-700">{sc.teamwork_score ?? 8.5} / 10</td>
                    <td className="p-4 font-medium text-amber-700">{sc.csat_score ?? 8.5} / 10</td>

                    <td className="p-4 font-medium">
                      <span className="text-emerald-600 font-bold">+{sc.bonus_score}đ</span> / <span className="text-red-500 font-bold">-{sc.penalty_score}đ</span>
                    </td>

                    <td className="p-4 font-mono font-extrabold text-blue-900 text-sm">
                      {sc.final_score.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">/ 100đ</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-xs ${
                        sc.rating_grade === 'S' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                        sc.rating_grade === 'A' ? 'bg-blue-600 text-white' :
                        sc.rating_grade === 'B' ? 'bg-emerald-600 text-white' :
                        sc.rating_grade === 'C' ? 'bg-slate-600 text-white' : 'bg-red-600 text-white'
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
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Chấm Sliders
                        </button>
                        <button
                          onClick={() => handleDeleteScorecard(sc.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
