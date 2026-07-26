'use client';

import React, { useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  Plus,
  Sliders,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Eye,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Building2,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import { Review360Session, ReviewCyclePeriodType, EvaluationCriterion } from '@/types';
import {
  get360Sessions,
  get360SessionsByPeriod,
  create360Session,
  get360Criteria,
  update360Criteria,
} from '@/lib/review360Store';
import dynamic from 'next/dynamic';

const Review360Modal = dynamic(() => import('@/components/reviews/Review360Modal'), { ssr: false });

export default function Review360Page() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Quý 3/2026');
  const [sessions, setSessions] = useState<Review360Session[]>(() => get360SessionsByPeriod('Quý 3/2026'));
  const [criteriaList, setCriteriaList] = useState<EvaluationCriterion[]>(() => get360Criteria());
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedSession, setSelectedSession] = useState<Review360Session | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // New Session Form State
  const [newSessionData, setNewSessionData] = useState({
    employee_name: 'Trần Văn Hoàng',
    employee_code: 'NV-00101',
    department: 'Phòng Kinh Doanh 1',
    position: 'Trưởng Nhóm Sale',
    period_type: 'QUARTERLY' as ReviewCyclePeriodType,
    period_name: 'Quý 3/2026',
  });

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setSessions(get360SessionsByPeriod(period));
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    create360Session({
      ...newSessionData,
      status: 'IN_PROGRESS',
    });
    setSessions(get360SessionsByPeriod(selectedPeriod));
    setIsNewSessionModalOpen(false);
  };

  const handleUpdateCriteriaWeight = (critId: string, newWeight: number) => {
    const updated = criteriaList.map((c) => (c.id === critId ? { ...c, weight: newWeight } : c));
    setCriteriaList(updated);
    update360Criteria(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Đánh Giá 360°</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá đa chiều giữa nhân viên và các cấp quản lý theo định kỳ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PERIOD FILTER SELECTOR */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600 ml-1" />
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="Quý 3/2026">Quý 3/2026</option>
              <option value="6 Tháng Đầu Năm (H1/2026)">6 Tháng H1/2026</option>
              <option value="Cả Năm 2026 (Annual 2026)">Cả Năm 2026</option>
              <option value="ALL">Tất Cả Các Kỳ</option>
            </select>
          </div>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-slate-500" /> Cấu Hình Tiêu Chí
          </button>
          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo Phiên Đánh Giá Mới
          </button>
        </div>
      </div>

      {/* OVERVIEW STAT CARDS FOR 360 PERSPECTIVES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Phiên Đánh Giá</p>
          <p className="text-2xl font-extrabold text-blue-700">{filteredSessions.length} Nhân Sự</p>
          <p className="text-[10px] text-slate-500 font-mono">{selectedPeriod}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            👤 Tự Đánh Giá
          </p>
          <p className="text-xl font-extrabold text-blue-600">92.5 / 100đ</p>
          <p className="text-[10px] text-slate-400">Trung bình nhân viên tự chấm</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            👔 Quản Lý
          </p>
          <p className="text-xl font-extrabold text-purple-600">95.0 / 100đ</p>
          <p className="text-[10px] text-slate-400">Trung bình Trưởng phòng chấm</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            🤝 Đồng Nghiệp
          </p>
          <p className="text-xl font-extrabold text-emerald-600">88.0 / 100đ</p>
          <p className="text-[10px] text-slate-400">Đồng nghiệp ngang cấp đánh giá</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            👥 Cấp Dưới
          </p>
          <p className="text-xl font-extrabold text-amber-600">90.5 / 100đ</p>
          <p className="text-[10px] text-slate-400">Cấp dưới đánh giá Leader</p>
        </div>
      </div>

      {/* SESSIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        {/* Search & Period Indicator */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm Nhân sự, Mã NV, Phòng ban..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Kỳ Đánh Giá: <strong className="text-blue-700 font-bold">{selectedPeriod}</strong>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10.5px]">
                <th className="p-4">Họ Và Tên</th>
                <th className="p-4">Phòng Ban & Vị Trí</th>
                <th className="p-4">Kỳ Đánh Giá</th>
                <th className="p-4">Tự Đánh Giá</th>
                <th className="p-4">Quản Lý</th>
                <th className="p-4">Đồng Nghiệp</th>
                <th className="p-4">Cấp Dưới</th>
                <th className="p-4">Điểm Tổng Kết</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy phiên đánh giá 360° nào phù hợp với kỳ {selectedPeriod}.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{session.employee_name}</p>
                      <p className="font-mono text-blue-700 text-[11px]">{session.review_code}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{session.department}</p>
                      <p className="text-slate-500 text-[11px]">{session.position}</p>
                    </td>

                    <td className="p-4 font-bold text-purple-700">{session.period_name}</td>

                    <td className="p-4 font-mono font-bold text-blue-600">
                      {session.self_score ? `${session.self_score}đ` : '—'}
                    </td>

                    <td className="p-4 font-mono font-bold text-purple-600">
                      {session.manager_score ? `${session.manager_score}đ` : '—'}
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-600">
                      {session.peer_score ? `${session.peer_score}đ` : '—'}
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-600">
                      {session.subordinate_score ? `${session.subordinate_score}đ` : '—'}
                    </td>

                    <td className="p-4 font-mono font-extrabold text-slate-900 text-sm">
                      {session.overall_360_score.toFixed(1)} / 100đ
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedSession(session);
                          setIsReviewModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md mx-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chấm Điểm 360°
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TẠO PHIÊN ĐÁNH GIÁ 360° MỚI */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 text-blue-700">
                <Plus className="w-5 h-5 text-blue-600" /> Khởi Tạo Phiên Đánh Giá 360° Mới
              </h3>
              <button onClick={() => setIsNewSessionModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ & Tên Nhân Sự *</label>
                <input
                  type="text"
                  value={newSessionData.employee_name}
                  onChange={(e) => setNewSessionData({ ...newSessionData, employee_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Loại Kỳ Đánh Giá *</label>
                <select
                  value={newSessionData.period_type}
                  onChange={(e) => {
                    const t = e.target.value as ReviewCyclePeriodType;
                    const name = t === 'QUARTERLY' ? 'Quý 3/2026' : t === 'HALF_YEARLY' ? '6 Tháng H1/2026' : 'Cả Năm 2026';
                    setNewSessionData({ ...newSessionData, period_type: t, period_name: name });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="QUARTERLY">Đánh Giá Theo Quý (Quarterly)</option>
                  <option value="HALF_YEARLY">Đánh Giá Nửa Năm (6 Tháng H1/H2)</option>
                  <option value="ANNUAL">Đánh Giá Cả Năm (Annual 2026)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Kỳ Đánh Giá *</label>
                <input
                  type="text"
                  value={newSessionData.period_name}
                  onChange={(e) => setNewSessionData({ ...newSessionData, period_name: e.target.value })}
                  placeholder="Ví dụ: Quý 3/2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md">
                  Khởi Tạo Phiên 360°
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TUỲ BIẾN BỘ TIÊU CHÍ ĐÁNH GIÁ 360° (CUSTOM CRITERIA FRAMEWORK) */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 text-blue-700">
                <Sliders className="w-5 h-5 text-blue-600" /> Cấu Hình Khung Tiêu Chí & Trọng Số 360°
              </h3>
              <button onClick={() => setIsConfigModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-slate-500">
                Tùy chỉnh tỷ trọng % các tiêu chí để phù hợp với đặc thù từng vị trí trong công ty
              </p>

              <div className="space-y-3">
                {criteriaList.map((crit) => (
                  <div key={crit.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{crit.name}</p>
                      <p className="text-[11px] text-slate-500">{crit.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="text-[11px] font-bold text-slate-700">Trọng số (%):</label>
                      <input
                        type="number"
                        value={crit.weight}
                        onChange={(e) => handleUpdateCriteriaWeight(crit.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-blue-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Lưu Khung Tiêu Chí 360°
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      <Review360Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        session={selectedSession}
        onSubmitted={() => setSessions(get360SessionsByPeriod(selectedPeriod))}
      />
    </div>
  );
}
