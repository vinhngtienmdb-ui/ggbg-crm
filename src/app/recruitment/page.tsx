'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  Building2,
  FileText,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Download,
  Upload,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  XCircle,
  X,
  History,
  LayoutGrid,
  List
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export interface Candidate {
  id: string;
  candidate_code: string;
  full_name: string;
  email: string;
  phone: string;
  position_applied: string;
  department: string;
  source: 'TopCV' | 'LinkedIn' | 'Facebook Ads' | 'Referral' | 'Website';
  stage: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED_ONBOARDING';
  expected_salary: number;
  experience_years: number;
  cv_file: string;
  applied_date: string;
  interview_date?: string;
  interview_score?: number;
  interviewer_name?: string;
  onboarding_progress?: number; // 0 - 100%
  approval_status?: 'PENDING_DIRECT_MANAGER' | 'PENDING_SALES_DIRECTOR' | 'APPROVED' | 'REJECTED';
  direct_manager_name?: string;
  status: 'In_Progress' | 'Passed' | 'Rejected' | 'Onboarded';
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    candidate_code: 'UV-2026-001',
    full_name: 'Trần Vũ Hoàng',
    email: 'hoang.tv@gmail.com',
    phone: '0981234567',
    position_applied: 'Chuyên Viên Tư Vấn TMĐT',
    department: 'Phòng Kinh Doanh 1',
    source: 'TopCV',
    stage: 'HIRED_ONBOARDING',
    expected_salary: 15000000,
    experience_years: 3,
    cv_file: 'storage.ggbingo.vn/cv/TranVuHoang_CV.pdf',
    applied_date: '2026-07-01',
    interview_date: '2026-07-05',
    interview_score: 8.5,
    interviewer_name: 'Nguyễn Văn Minh (Trưởng Phòng KD1)',
    onboarding_progress: 80,
    approval_status: 'APPROVED',
    direct_manager_name: 'Trần Văn Hoàng (Leader Team 1)',
    status: 'Onboarded',
  },
  {
    id: 'cand_2',
    candidate_code: 'UV-2026-002',
    full_name: 'Phạm Thị Bích',
    email: 'bich.pham@gmail.com',
    phone: '0912345678',
    position_applied: 'Trưởng Nhóm Vận Hành Shopee',
    department: 'Phòng Vận Hành TMĐT',
    source: 'LinkedIn',
    stage: 'OFFER',
    expected_salary: 22000000,
    experience_years: 5,
    cv_file: 'storage.ggbingo.vn/cv/PhamThiBich_CV.pdf',
    applied_date: '2026-07-10',
    interview_date: '2026-07-15',
    interview_score: 9.0,
    interviewer_name: 'Đặng Tuấn Tú (Giám Đốc Vận Hành)',
    onboarding_progress: 20,
    approval_status: 'PENDING_SALES_DIRECTOR',
    direct_manager_name: 'Đặng Tuấn Tú (Giám Đốc Vận Hành)',
    status: 'Passed',
  },
  {
    id: 'cand_3',
    candidate_code: 'UV-2026-003',
    full_name: 'Lê Văn An',
    email: 'an.le@gmail.com',
    phone: '0976543210',
    position_applied: 'Chuyên Viên CSKH VIP',
    department: 'Phòng CSKH',
    source: 'Referral',
    stage: 'INTERVIEW',
    expected_salary: 12000000,
    experience_years: 2,
    cv_file: 'storage.ggbingo.vn/cv/LeVanAn_CV.pdf',
    applied_date: '2026-07-18',
    interview_date: '2026-07-25',
    interview_score: 7.5,
    interviewer_name: 'Hoàng Kim Ngân (Trưởng Phòng CSKH)',
    onboarding_progress: 0,
    approval_status: 'PENDING_DIRECT_MANAGER',
    direct_manager_name: 'Hoàng Kim Ngân (Trưởng Phòng CSKH)',
    status: 'In_Progress',
  },
  {
    id: 'cand_4',
    candidate_code: 'UV-2026-004',
    full_name: 'Đỗ Mạnh Cường',
    email: 'cuong.dm@gmail.com',
    phone: '0934567890',
    position_applied: 'Digital Marketing Lead',
    department: 'Phòng Marketing',
    source: 'Facebook Ads',
    stage: 'SCREENING',
    expected_salary: 25000000,
    experience_years: 6,
    cv_file: 'storage.ggbingo.vn/cv/DoManhCuong_CV.pdf',
    applied_date: '2026-07-22',
    onboarding_progress: 0,
    approval_status: 'PENDING_DIRECT_MANAGER',
    direct_manager_name: 'Nguyễn Tiến Vinh (CEO)',
    status: 'In_Progress',
  },
  {
    id: 'cand_5',
    candidate_code: 'UV-2026-005',
    full_name: 'Nguyễn Thị Mai',
    email: 'mai.nt@gmail.com',
    phone: '0967890123',
    position_applied: 'Chuyên Viên Tuyển Dụng & C&B',
    department: 'Khối Nhân Sự (HRM)',
    source: 'TopCV',
    stage: 'APPLIED',
    expected_salary: 14000000,
    experience_years: 3,
    cv_file: 'storage.ggbingo.vn/cv/NguyenThiMai_CV.pdf',
    applied_date: '2026-07-28',
    onboarding_progress: 0,
    approval_status: 'PENDING_DIRECT_MANAGER',
    direct_manager_name: 'Nguyễn Thị Bích Ngọc (CHRO)',
    status: 'In_Progress',
  },
];

const STAGE_CONFIG: Record<string, { label: string; cls: string; border: string }> = {
  APPLIED: { label: '⚪ 1. Ứng Viên Mới', cls: 'bg-slate-100 text-slate-800', border: 'border-slate-300' },
  SCREENING: { label: '🔵 2. Sàng Lọc CV', cls: 'bg-blue-100 text-blue-900', border: 'border-blue-300' },
  INTERVIEW: { label: '🟡 3. Phỏng Vấn', cls: 'bg-amber-100 text-amber-900', border: 'border-amber-300' },
  OFFER: { label: '🟢 4. Gửi Offer', cls: 'bg-emerald-100 text-emerald-900', border: 'border-emerald-300' },
  HIRED_ONBOARDING: { label: '🟣 5. Trúng Tuyển & Onboarding', cls: 'bg-purple-100 text-purple-900', border: 'border-purple-300' },
};

const FUNNEL_CHART_DATA = [
  { stage: 'Ứng Viên Mới', count: 45 },
  { stage: 'Sàng Lọc CV', count: 28 },
  { stage: 'Phỏng Vấn', count: 14 },
  { stage: 'Gửi Offer', count: 8 },
  { stage: 'Trúng Tuyển Onboarding', count: 6 },
];

const SOURCE_CHART_DATA = [
  { name: 'TopCV', value: 40, color: '#3B82F6' },
  { name: 'LinkedIn', value: 25, color: '#8B5CF6' },
  { name: 'Referral', value: 20, color: '#10B981' },
  { name: 'Facebook Ads', value: 15, color: '#F59E0B' },
];

export default function RecruitmentModulePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PIPELINE' | 'ONBOARDING' | 'APPROVAL_PIPELINE'>('PIPELINE');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedApprovalCand, setSelectedApprovalCand] = useState<Candidate | null>(null);

  const [newForm, setNewForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    position_applied: 'Chuyên Viên Tư Vấn TMĐT',
    department: 'Phòng Kinh Doanh 1',
    source: 'TopCV' as const,
    expected_salary: 12000000,
    experience_years: 2,
    direct_manager_name: 'Nguyễn Văn Minh (Trưởng Phòng KD1)',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCand: Candidate = {
      id: `cand_${Date.now()}`,
      candidate_code: `UV-2026-${String(candidates.length + 1).padStart(3, '0')}`,
      full_name: newForm.full_name,
      email: newForm.email,
      phone: newForm.phone,
      position_applied: newForm.position_applied,
      department: newForm.department,
      source: newForm.source,
      stage: 'APPLIED',
      expected_salary: Number(newForm.expected_salary),
      experience_years: Number(newForm.experience_years),
      cv_file: `storage.ggbingo.vn/cv/${newForm.full_name.replace(/\s+/g, '')}_CV.pdf`,
      applied_date: new Date().toISOString().split('T')[0],
      onboarding_progress: 0,
      approval_status: 'PENDING_DIRECT_MANAGER',
      direct_manager_name: newForm.direct_manager_name,
      status: 'In_Progress',
    };
    setCandidates([newCand, ...candidates]);
    setIsModalOpen(false);
    showToast(`✅ Đã tiếp nhận ứng viên mới: ${newCand.full_name} (${newCand.candidate_code})`);
  };

  const handleStageChange = (candId: string, newStage: Candidate['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: newStage } : c))
    );
    showToast(`🔄 Đã chuyển bước ứng viên sang: ${STAGE_CONFIG[newStage].label}`);
  };

  const handleCvFileUpload = (candId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const path = `storage.ggbingo.vn/cv/${file.name}`;
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, cv_file: path } : c))
    );
    showToast(`📄 Đã upload CV thành công: ${file.name}`);
  };

  const handleApproveDirectManager = (cand: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, approval_status: 'PENDING_SALES_DIRECTOR' } : c))
    );
    showToast(`✅ Quản lý trực tiếp đã duyệt hồ sơ ${cand.full_name} → Chuyển Giám Đốc Kinh Doanh duyệt cuối!`);
  };

  const handleApproveSalesDirector = (cand: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, approval_status: 'APPROVED', stage: 'HIRED_ONBOARDING' } : c))
    );
    showToast(`🎉 Giám Đốc Kinh Doanh đã duyệt thành công! Nhân sự ${cand.full_name} đã chuyển sang bước Onboarding Thử Việc.`);
  };

  const handleRejectApproval = (cand: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, approval_status: 'REJECTED', status: 'Rejected' } : c))
    );
    showToast(`❌ Đã từ chối duyệt hồ sơ tuyển dụng nhân sự ${cand.full_name}`);
  };

  const pendingCount = candidates.filter(
    (c) => c.approval_status === 'PENDING_DIRECT_MANAGER' || c.approval_status === 'PENDING_SALES_DIRECTOR'
  ).length;

  const filteredCandidates = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      c.full_name.toLowerCase().includes(q) ||
      c.candidate_code.toLowerCase().includes(q) ||
      c.position_applied.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'ALL' || c.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Module Tuyển Dụng, Phê Duyệt & Onboarding Nhân Sự</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Recruitment Engine & Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống quản lý phễu tuyển dụng Dual-View (Kanban 5 bước & Bảng Danh Sách), Upload CV, Phê duyệt nhân sự mới 3 cấp và Onboarding 60 ngày.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tiếp Nhận Ứng Viên Mới
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('PIPELINE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'PIPELINE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4 text-amber-400" /> 🎯 1. Tuyển Dụng ({filteredCandidates.length})
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ANALYTICS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart className="w-4 h-4 text-blue-400" /> 📊 2. Báo Cáo Tuyển Dụng & Onboarding
        </button>

        <button
          onClick={() => setActiveTab('ONBOARDING')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ONBOARDING' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-purple-400" /> 🚀 3. Quy Trình Onboarding (Hội Nhập 60 Ngày)
        </button>

        <button
          onClick={() => setActiveTab('APPROVAL_PIPELINE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'APPROVAL_PIPELINE' ? 'bg-amber-600 text-white shadow-md' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          ⏳ 4. Phê Duyệt Nhân Sự Mới (3 Cấp)
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* MERGED TAB 1: PHỄU TUYỂN DỤNG & DANH SÁCH ỨNG VIÊN (DUAL-VIEW: KANBAN VS LIST) */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-4 text-xs">
          {/* Controls Bar & View Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên ứng viên, mã UV, vị trí..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="ALL">Tất Cả Phòng Ban</option>
                <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                <option value="Phòng CSKH">Phòng CSKH</option>
                <option value="Phòng Marketing">Phòng Marketing</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[10.5px]">Chế Độ Xem:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('KANBAN')}
                  className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all ${
                    viewMode === 'KANBAN' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Dạng Thẻ Kanban (5 Bước)
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all ${
                    viewMode === 'LIST' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Dạng Bảng Danh Sách
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: KANBAN PIPELINE 5 BƯỚC */}
          {viewMode === 'KANBAN' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
              {(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED_ONBOARDING'] as const).map((stgKey) => {
                const stgCand = filteredCandidates.filter((c) => c.stage === stgKey);
                const cfg = STAGE_CONFIG[stgKey];
                return (
                  <div key={stgKey} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3 min-w-[220px]">
                    <div className={`p-2.5 rounded-xl border font-black flex items-center justify-between ${cfg.cls} ${cfg.border}`}>
                      <span>{cfg.label}</span>
                      <span className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] shadow-sm">
                        {stgCand.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {stgCand.map((cand) => (
                        <div key={cand.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-blue-700">{cand.candidate_code}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">{cand.source}</span>
                          </div>
                          <p className="font-extrabold text-slate-900 text-xs">{cand.full_name}</p>
                          <p className="text-[11px] text-slate-500">{cand.position_applied}</p>
                          <p className="text-[10px] text-slate-400">{cand.department}</p>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <a
                              href={`https://${cand.cv_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-blue-500" /> Xem CV
                            </a>
                            <label className="cursor-pointer text-amber-700 hover:text-amber-800 font-extrabold flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 transition-colors">
                              <Upload className="w-3 h-3 text-amber-600" /> Upload CV
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleCvFileUpload(cand.id, e)}
                              />
                            </label>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="font-mono font-black text-emerald-700">
                              {new Intl.NumberFormat('vi-VN').format(cand.expected_salary)} ₫
                            </span>
                            <select
                              value={cand.stage}
                              onChange={(e) => handleStageChange(cand.id, e.target.value as any)}
                              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-800 focus:outline-none"
                            >
                              <option value="APPLIED">1. Ứng Viên Mới</option>
                              <option value="SCREENING">2. Sàng Lọc CV</option>
                              <option value="INTERVIEW">3. Phỏng Vấn</option>
                              <option value="OFFER">4. Gửi Offer</option>
                              <option value="HIRED_ONBOARDING">5. Onboarding</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: BẢNG DANH SÁCH ỨNG VIÊN */}
          {viewMode === 'LIST' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10.5px]">
                      <th className="p-3">Mã & Họ Tên Ứng Viên</th>
                      <th className="p-3">Vị Trí & Phòng Ban</th>
                      <th className="p-3">Kinh Nghiệm & Lương Kỳ Vọng</th>
                      <th className="p-3">Nguồn Tuyển Dụng</th>
                      <th className="p-3">Bước Phễu Hiện Tại</th>
                      <th className="p-3 text-center">Thao Tác File CV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{c.full_name}</p>
                          <p className="font-mono text-blue-700 text-[11px]">{c.candidate_code} · {c.phone}</p>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-slate-800">{c.position_applied}</p>
                          <p className="text-slate-500 text-[11px]">{c.department}</p>
                        </td>

                        <td className="p-3 font-mono">
                          <p className="font-black text-emerald-700">
                            {new Intl.NumberFormat('vi-VN').format(c.expected_salary)} ₫
                          </p>
                          <p className="text-slate-500 text-[10px]">{c.experience_years} năm kinh nghiệm</p>
                        </td>

                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-full font-bold text-slate-700">
                            {c.source}
                          </span>
                        </td>

                        <td className="p-3">
                          <select
                            value={c.stage}
                            onChange={(e) => handleStageChange(c.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] focus:outline-none ${STAGE_CONFIG[c.stage].cls}`}
                          >
                            <option value="APPLIED">⚪ 1. Ứng Viên Mới</option>
                            <option value="SCREENING">🔵 2. Sàng Lọc CV</option>
                            <option value="INTERVIEW">🟡 3. Phỏng Vấn</option>
                            <option value="OFFER">🟢 4. Gửi Offer</option>
                            <option value="HIRED_ONBOARDING">🟣 5. Onboarding</option>
                          </select>
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={`https://${c.cv_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 font-extrabold rounded-xl hover:bg-blue-100 transition-all inline-block border border-blue-200"
                            >
                              📄 Xem CV
                            </a>
                            <label className="cursor-pointer px-3 py-1.5 bg-amber-50 text-amber-800 font-extrabold rounded-xl hover:bg-amber-100 transition-all inline-block border border-amber-200">
                              📤 Upload CV
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleCvFileUpload(c.id, e)}
                              />
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BÁO CÁO & DASHBOARD */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-bold">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Tổng Ứng Viên Tiếp Nhận</span>
              <p className="text-2xl font-black text-slate-900">45 Ứng Viên</p>
              <span className="text-emerald-600 text-[11px] font-semibold">↑ +12% so với tháng trước</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Đã Phỏng Vấn (Round 1/2)</span>
              <p className="text-2xl font-black text-amber-600">14 Ứng Viên</p>
              <span className="text-slate-500 text-[11px] font-semibold">Tỷ lệ đạt CV: 31.1%</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Đã Gửi Offer Nhận Việc</span>
              <p className="text-2xl font-black text-emerald-600">8 Ứng Viên</p>
              <span className="text-emerald-600 text-[11px] font-semibold">Tỷ lệ chấp nhận offer: 87.5%</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-slate-500 uppercase text-[10.5px]">Đang Onboarding (Thử Việc)</span>
              <p className="text-2xl font-black text-purple-600">6 Nhân Sự</p>
              <span className="text-purple-600 text-[11px] font-semibold">Tiến độ hoàn thành: 78%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600" /> Biểu Đồ Phễu Tuyển Dụng Qua Các Bước
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FUNNEL_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2E5CE6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> Phân Bổ Nguồn Ứng Viên (Channel Intake)
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SOURCE_CHART_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {SOURCE_CHART_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUY TRÌNH ONBOARDING HỘI NHẬP */}
      {activeTab === 'ONBOARDING' && (
        <div className="space-y-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-purple-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" /> Danh Sách Nhân Sự Đang Trong Quá Trình Onboarding (Thử Việc 60 Ngày)
            </h3>

            <div className="space-y-4">
              {candidates
                .filter((c) => c.stage === 'HIRED_ONBOARDING')
                .map((cand) => (
                  <div key={cand.id} className="p-5 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <p className="font-black text-base text-slate-900">{cand.full_name} ({cand.candidate_code})</p>
                        <p className="text-slate-600">Vị trí: <strong className="text-purple-700">{cand.position_applied}</strong> · Phòng Ban: {cand.department}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-purple-800">Tiến độ Onboarding: {cand.onboarding_progress}%</span>
                        <button
                          onClick={() => showToast(`🎉 Đã hoàn tất thử việc & Chuyển nhân sự ${cand.full_name} sang Hợp Đồng Chính Thức!`)}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md"
                        >
                          ✅ Chuyển Chính Thức
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full transition-all" style={{ width: `${cand.onboarding_progress}%` }} />
                    </div>

                    {/* Checklist Onboarding 6 Bước */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Khởi tạo Email & CRM Account
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Ký HĐLĐ Thử Việc (60 ngày)
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Bàn giao Laptop & Thẻ Từ
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. Đào tạo Quy định Nội quy
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 5. Phân công Mentor Hướng Dẫn
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border flex items-center gap-2 font-bold text-slate-800">
                        <Clock className="w-4 h-4 text-amber-500" /> 6. Đánh Giá Đạt Thử Việc (Day 60)
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PHÊ DUYỆT NHÂN SỰ MỚI (MULTI-STAGE APPROVAL PIPELINE) */}
      {activeTab === 'APPROVAL_PIPELINE' && (
        <div className="space-y-6 text-xs">
          <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" /> Sơ Đồ Quy Trình Phê Duyệt Nhân Sự Mới (3 Cấp Nối Tiếp):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-sm">
                <p className="font-bold text-amber-800">Bước 1: Quản Lý Trực Tiếp</p>
                <p className="text-[11px] text-slate-500 mt-1">Trưởng phòng / Leader kiểm tra năng lực ứng viên & duyệt đề xuất nhận việc sơ bộ.</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-sm">
                <p className="font-bold text-blue-800">Bước 2: Giám Đốc Kinh Doanh (Duyệt Cuối)</p>
                <p className="text-[11px] text-slate-500 mt-1">Giám đốc Khối xem xét định biên ngân sách & quyết định tiếp nhận chính thức.</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-sm">
                <p className="font-bold text-emerald-800">Bước 3: HR Onboarding & Thử Việc</p>
                <p className="text-[11px] text-slate-500 mt-1">HR tiếp nhận nhân sự đã duyệt, phát hành Offer letter, cấp tài khoản & mở Checklist Onboarding.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Danh Sách Hồ Sơ Đang Chờ Phê Duyệt ({pendingCount})
            </h3>

            <div className="space-y-4">
              {candidates
                .filter((c) => c.approval_status === 'PENDING_DIRECT_MANAGER' || c.approval_status === 'PENDING_SALES_DIRECTOR')
                .map((cand) => (
                  <div key={cand.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-blue-300 transition-all">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">{cand.full_name}</h4>
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{cand.candidate_code}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Vị trí: <strong>{cand.position_applied}</strong> • Phòng Ban: {cand.department} • Người duyệt cấp 1: <strong>{cand.direct_manager_name || 'Trưởng Phòng KD1'}</strong>
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                        cand.approval_status === 'PENDING_DIRECT_MANAGER' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {cand.approval_status === 'PENDING_DIRECT_MANAGER' ? '⏳ Chờ QL Trực Tiếp Duyệt' : '⏳ Chờ Giám Đốc Duyệt Cuối'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ghi Chú Ý Kiến Phê Duyệt:</label>
                        <input
                          type="text"
                          value={selectedApprovalCand?.id === cand.id ? approvalNote : ''}
                          onChange={(e) => {
                            setSelectedApprovalCand(cand);
                            setApprovalNote(e.target.value);
                          }}
                          placeholder="Nhập ghi chú hoặc lý do..."
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end font-bold">
                        {cand.approval_status === 'PENDING_DIRECT_MANAGER' && (
                          <button
                            onClick={() => handleApproveDirectManager(cand)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> 1️⃣ QL Trực Tiếp Duyệt
                          </button>
                        )}

                        {cand.approval_status === 'PENDING_SALES_DIRECTOR' && (
                          <button
                            onClick={() => handleApproveSalesDirector(cand)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <ShieldCheck className="w-4 h-4" /> 2️⃣ Giám Đốc Duyệt Cuối
                          </button>
                        )}

                        <button
                          onClick={() => handleRejectApproval(cand)}
                          className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs flex items-center gap-1 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Từ Chối
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM ỨNG VIÊN MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Tiếp Nhận Hồ Sơ Ứng Viên Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Họ Và Tên Ứng Viên *</label>
                <input
                  type="text"
                  required
                  value={newForm.full_name}
                  onChange={(e) => setNewForm({ ...newForm, full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  className="w-full px-3 py-2 border rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Email Liên Hệ *</label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Số Điện Thoại *</label>
                  <input
                    type="text"
                    required
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Vị Trí Ứng Tuyển *</label>
                  <input
                    type="text"
                    required
                    value={newForm.position_applied}
                    onChange={(e) => setNewForm({ ...newForm, position_applied: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Phòng Ban *</label>
                  <select
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                    <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                    <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                    <option value="Phòng CSKH">Phòng CSKH</option>
                    <option value="Phòng Marketing">Phòng Marketing</option>
                    <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Nguồn Tuyển Dụng</label>
                  <select
                    value={newForm.source}
                    onChange={(e) => setNewForm({ ...newForm, source: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="TopCV">TopCV</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Referral">Referral (Giới thiệu)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Lương Kỳ Vọng (VND)</label>
                  <input
                    type="number"
                    step={1000000}
                    value={newForm.expected_salary}
                    onChange={(e) => setNewForm({ ...newForm, expected_salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700 font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">File CV Đính Kèm (.pdf, .doc, .docx)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 border border-dashed border-blue-300 rounded-xl text-blue-700 font-bold hover:bg-blue-100 transition-colors">
                    <Upload className="w-4 h-4" /> Tải Lên File CV Tốt Nhất
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          showToast(`📄 Đã chọn file CV: ${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Lưu Hồ Sơ Ứng Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
