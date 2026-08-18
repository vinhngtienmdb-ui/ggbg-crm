'use client';

import React, { useState } from 'react';
import {
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
  UserCheck,
  Award,
  ChevronRight,
  TrendingUp,
  XCircle,
  X,
  Send,
  Eye,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import { Candidate, EmailTemplateType } from '@/types';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  convertCandidateToEmployee,
  sendRecruitmentEmail,
  getRecruitmentEmailTemplates
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';
import CandidateOnboardingWizardModal from '@/components/hrm/CandidateOnboardingWizardModal';

interface RecruitmentPipelineViewProps {
  onCandidateConverted?: () => void;
}

const STAGES = [
  { id: 'APPLIED', label: '1. Ứng Tuyển Mới', color: 'border-blue-400 bg-blue-50/50', badge: 'bg-blue-100 text-blue-800' },
  { id: 'SCREENING', label: '2. Sàng Lọc CV', color: 'border-purple-400 bg-purple-50/50', badge: 'bg-purple-100 text-purple-800' },
  { id: 'INTERVIEW', label: '3. Phỏng Vấn', color: 'border-amber-400 bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' },
  { id: 'OFFER', label: '4. Đề Nghị Offer', color: 'border-emerald-400 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'HIRED_ONBOARDING', label: '5. Nhận Việc (Onboarding)', color: 'border-indigo-400 bg-indigo-50/50', badge: 'bg-indigo-100 text-indigo-800' }
];

export default function RecruitmentPipelineView({ onCandidateConverted }: RecruitmentPipelineViewProps) {
  React.useEffect(() => {
    const handleUpdate = () => {
      try { setCandidates(getCandidates()); } catch(e){}
    };
    window.addEventListener('hrm-update', handleUpdate);
    return () => window.removeEventListener('hrm-update', handleUpdate);
  }, []);

  const [candidates, setCandidates] = useState<Candidate[]>(() => getCandidates());
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [selectedEmailType, setSelectedEmailType] = useState<EmailTemplateType>('INTERVIEW_INVITATION');
  const [customEmailNote, setCustomEmailNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Onboarding Wizard Modal State
  const [onboardingCandidate, setOnboardingCandidate] = useState<Candidate | null>(null);

  // Form State for new candidate
  const [formData, setFormData] = useState({

  
    full_name: '',
    email: '',
    phone: '',
    position_applied: 'Chuyên Viên Tư Vấn TMĐT',
    department: 'Phòng Kinh Doanh 1',
    source: 'TopCV' as const,
    stage: 'APPLIED' as const,
    expected_salary: 15000000,
    experience_years: 2,
    cv_file: '',
    status: 'In_Progress' as const,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCandidates = candidates.filter((c) => {
    const name = c.full_name || c.name || '';
    const pos = c.position_applied || c.position || '';
    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.candidate_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'ALL' || c.department === deptFilter;
    return matchSearch && matchDept;
  });

  const handleStageChange = (candId: string, newStage: Candidate['stage']) => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;

    if (newStage === 'HIRED_ONBOARDING') {
      setOnboardingCandidate(cand);
      return;
    }

    updateCandidate(candId, { stage: newStage });
    setCandidates([...getCandidates()]);

    // Check auto-email prompt
    if (newStage === 'INTERVIEW') {
      setEmailCandidate(cand);
      setSelectedEmailType('INTERVIEW_INVITATION');
      setShowEmailModal(true);
    } else if (newStage === 'OFFER') {
      setEmailCandidate(cand);
      setSelectedEmailType('OFFER_LETTER');
      setShowEmailModal(true);
    }

    showToast(`Đã chuyển ứng viên ${cand.full_name || cand.name} sang bước: ${STAGES.find((s) => s.id === newStage)?.label}`);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      showToast('⚠️ Vui lòng nhập họ tên và email ứng viên');
      return;
    }

    const created = createCandidate({
      ...formData,
    });

    setCandidates([...getCandidates()]);
    setShowAddModal(false);
    showToast(`Đã thêm ứng viên mới: ${created.full_name || created.name} (${created.candidate_code})`);

    // Reset form
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      position_applied: 'Chuyên Viên Tư Vấn TMĐT',
      department: 'Phòng Kinh Doanh 1',
      source: 'TopCV',
      stage: 'APPLIED',
      expected_salary: 15000000,
      experience_years: 2,
      cv_file: '',
      status: 'In_Progress',
    });
  };

  const handleDeleteCandidate = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ứng viên "${name}" khỏi cơ sở dữ liệu?`)) {
      deleteCandidate(id);
      setCandidates([...getCandidates()]);
      setSelectedCandidate(null);
      showToast(`Đã xóa ứng viên ${name}`);
    }
  };

  const handleConvertCandidate = (candId: string) => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;
    setOnboardingCandidate(cand);
  };

  const handleSendEmail = () => {
    if (!emailCandidate) return;
    sendRecruitmentEmail(emailCandidate, selectedEmailType, {
      '{{interview_time}}': customEmailNote || '14:00 Thứ 3 tới',
    });
    setShowEmailModal(false);
    showToast(`Đã gửi email thành công đến ${emailCandidate.email}`);
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4"> <Sparkles className="w-4 h-4 text-amber-400" /> <span className="text-sm font-semibold">{toastMsg}</span> </div> )}

      {onboardingCandidate && (
        <CandidateOnboardingWizardModal
          isOpen={!!onboardingCandidate}
          candidate={onboardingCandidate}
          onClose={() => {
            setOnboardingCandidate(null);
            setCandidates([...getCandidates()]);
          }}
          onSuccess={() => {
            setOnboardingCandidate(null);
            setCandidates([...getCandidates()]);
            if (onCandidateConverted) onCandidateConverted();
            showToast(`🎉 Chúc mừng! Ứng viên đã trở thành nhân sự chính thức.`);
          }}
        />
      )}

      {/* Top Controls & Metrics */} <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"> <div className="flex items-center gap-3 flex-1 flex-wrap"> <div className="relative flex-1 min-w-[240px]"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
              type="text"
              placeholder="Tìm kiếm ứng viên theo tên, email, vị trí, mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
            /> </div> <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          > <option value="ALL">Tất Cả Phòng Ban</option> <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option> <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option> <option value="Phòng Marketing">Phòng Marketing</option> <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option> <option value="Phòng CSKH">Phòng CSKH</option> <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option> </select> <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700"> <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'KANBAN'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            > Phễu Kanban </button> <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            > Bảng Danh Sách </button> </div> </div> <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all shrink-0"
        > <Plus className="w-4 h-4" /> Thêm Ứng Viên Mới </button> </div> {/* KANBAN VIEW */}
      {viewMode === 'KANBAN' ? ( <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {STAGES.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);
            return ( <div
                key={stage.id}
                className="bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col min-h-[500px]"
              > {/* Stage Header */} <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800"> <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{stage.label}</span> <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${stage.badge}`}> {stageCandidates.length} </span> </div> {/* Candidate Cards */} <div className="space-y-3 flex-1 overflow-y-auto"> {stageCandidates.map((cand) => ( <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group space-y-2 relative"
                    > <div className="flex items-start justify-between gap-1"> <div> <p className="font-medium text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors"> {cand.full_name || cand.name} </p> <p className="text-[10px] font-mono text-slate-400">{cand.candidate_code}</p> </div> <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-medium"> {cand.source || 'TopCV'} </span> </div> <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium"> <Briefcase className="w-3 h-3 text-slate-400 shrink-0" /> <span className="truncate">{cand.position_applied || cand.position}</span> </div> <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-700/60 font-mono"> <span className="text-slate-400">{cand.experience_years || 2} năm KN</span> <span className="font-medium text-emerald-600 dark:text-emerald-400"> {formatCurrency(cand.expected_salary || cand.salary_expectation || 0)} </span> </div> {/* Stage Quick Switch Controls */} <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-100 dark:border-slate-700/60"> <select
                          value={cand.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(cand.id, e.target.value as Candidate['stage']);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 w-full"
                        > {STAGES.map((s) => ( <option key={s.id} value={s.id}> ➔ {s.label} </option> ))} </select> </div> </div> ))}

                  {stageCandidates.length === 0 && ( <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-[11px] font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center"> Trống </div> )} </div> </div> );
          })} </div> ) : (
        /* TABLE VIEW */ <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"> <div className="overflow-x-auto"> <table className="w-full text-left text-xs"> <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5">Ứng Viên</th> <th className="p-3.5">Vị Trí Ứng Tuyển</th> <th className="p-3.5">Phòng Ban</th> <th className="p-3.5">Nguồn</th> <th className="p-3.5">Lương Kỳ Vọng</th> <th className="p-3.5">Bước Tuyển Dụng</th> <th className="p-3.5 text-center">Thao Tác</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {filteredCandidates.map((cand) => ( <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5"> <div className="font-medium text-slate-900 dark:text-white">{cand.full_name || cand.name}</div> <div className="text-[10px] text-slate-400 font-mono">{cand.email} · {cand.phone}</div> </td> <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{cand.position_applied || cand.position}</td> <td className="p-3.5 text-slate-600 dark:text-slate-300">{cand.department}</td> <td className="p-3.5"> <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md text-[10px] font-medium text-slate-700 dark:text-slate-300"> {cand.source || 'TopCV'} </span> </td> <td className="p-3.5 font-mono font-medium text-emerald-600"> {formatCurrency(cand.expected_salary || cand.salary_expectation || 0)} </td> <td className="p-3.5"> <select
                        value={cand.stage}
                        onChange={(e) => handleStageChange(cand.id, e.target.value as Candidate['stage'])}
                        className="text-[11px] font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                      > {STAGES.map((s) => ( <option key={s.id} value={s.id}> {s.label} </option> ))} </select> </td> <td className="p-3.5 text-center"> <div className="flex items-center justify-center gap-1.5"> <button
                          onClick={() => setSelectedCandidate(cand)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem Chi Tiết & CV"
                        > <Eye className="w-4 h-4" /> </button> <button
                          onClick={() => {
                            setEmailCandidate(cand);
                            setShowEmailModal(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Gửi Email Mẫu"
                        > <Mail className="w-4 h-4" /> </button> <button
                          onClick={() => handleConvertCandidate(cand.id)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Tuyển dụng ➔ Chuyển thành Nhân sự"
                        > <UserCheck className="w-4 h-4" /> </button> <button
                          onClick={() => handleDeleteCandidate(cand.id, cand.full_name || cand.name || 'Ứng viên')}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa Ứng Viên"
                        > <Trash2 className="w-4 h-4" /> </button> </div> </td> </tr> ))} </tbody> </table> </div> </div> )}

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && ( <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center shadow-md shadow-blue-500/20"> {(selectedCandidate.full_name || selectedCandidate.name || 'U').charAt(0)} </div> <div> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> {selectedCandidate.full_name || selectedCandidate.name} <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded-md text-[10px] font-mono"> {selectedCandidate.candidate_code} </span> </h3> <p className="text-xs text-slate-500 font-medium">{selectedCandidate.position_applied || selectedCandidate.position} · {selectedCandidate.department}</p> </div> </div> <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
              > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"> <div className="grid grid-cols-2 md:grid-cols-3 gap-3"> <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700"> <span className="text-slate-400 font-medium">Số điện thoại:</span> <p className="font-medium text-slate-800 dark:text-slate-200 font-mono mt-0.5">{selectedCandidate.phone}</p> </div> <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700"> <span className="text-slate-400 font-medium">Email:</span> <p className="font-medium text-slate-800 dark:text-slate-200 font-mono mt-0.5 truncate">{selectedCandidate.email}</p> </div> <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700"> <span className="text-slate-400 font-medium">Lương kỳ vọng:</span> <p className="font-medium text-emerald-600 font-mono mt-0.5">{formatCurrency(selectedCandidate.expected_salary || selectedCandidate.salary_expectation || 0)}</p> </div> </div> {/* CV Viewer Box */} <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between"> <div className="flex items-center gap-3"> <FileText className="w-8 h-8 text-purple-600" /> <div> <h4 className="font-semibold text-slate-900 dark:text-white">Tệp Hồ Sơ CV (Cloudflare R2)</h4> <p className="text-[11px] text-slate-500 font-mono">{selectedCandidate.cv_file || selectedCandidate.cv_file_url || 'CV_Full_2026.pdf'}</p> </div> </div> <a
                  href={`https://${selectedCandidate.cv_file || selectedCandidate.cv_file_url || 'storage.ggbingo.vn/cv/sample.pdf'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-sm"
                > <Eye className="w-3.5 h-3.5" /> Xem CV Online </a> </div> {/* Phỏng vấn & Đánh giá */}
              {selectedCandidate.interview_date && ( <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-1.5"> <h4 className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5"> <Calendar className="w-4 h-4" /> Lịch & Kết Quả Phỏng Vấn </h4> <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px]"> <p><strong>Thời gian:</strong> {selectedCandidate.interview_date}</p> <p><strong>Điểm chuyên môn:</strong> <span className="font-medium text-amber-600">{selectedCandidate.interview_score || 85}/100</span></p> <p><strong>Người phỏng vấn:</strong> {selectedCandidate.interviewer_name || 'HR Manager'}</p> </div> </div> )} </div> {/* Modal Actions */} <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3"> <button
                onClick={() => handleDeleteCandidate(selectedCandidate.id, selectedCandidate.full_name || selectedCandidate.name || 'Ứng viên')}
                className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              > <Trash2 className="w-4 h-4" /> Xóa Ứng Viên </button> <div className="flex items-center gap-2"> <button
                  onClick={() => {
                    setEmailCandidate(selectedCandidate);
                    setShowEmailModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
                > <Mail className="w-4 h-4" /> Gửi Email Theo Mẫu </button> <button
                  onClick={() => handleConvertCandidate(selectedCandidate.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                > <UserCheck className="w-4 h-4" /> Ký HĐ & Nhận Việc (Onboarding) </button> </div> </div> </div> </div> )}

      {/* SEND EMAIL MODAL */}
      {showEmailModal && emailCandidate && ( <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Mail className="w-4 h-4 text-blue-600" /> Gửi Email Cho Ứng Viên: {emailCandidate.full_name || emailCandidate.name} </h3> <button
                onClick={() => setShowEmailModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">Chọn Mẫu Email Tuyển Dụng:</label> <select
                  value={selectedEmailType}
                  onChange={(e) => setSelectedEmailType(e.target.value as EmailTemplateType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
                > <option value="APPLY_RECEIVED">1. Thư Xác Nhận Tiếp Nhận Hồ Sơ (Auto Apply)</option> <option value="INTERVIEW_INVITATION">2. Thư Mời Tham Dự Phỏng Vấn (Google Meet / Trực Tiếp)</option> <option value="OFFER_LETTER">3. Thư Mời Nhận Việc (Job Offer Letter)</option> <option value="ONBOARDING_WELCOME">4. Thư Chào Đón & Hướng Dẫn Ngày Đầu Tiên (Welcome Kit)</option> <option value="CANDIDATE_REJECTION">5. Thư Cảm Ơn & Thông Báo Chưa Phù Hợp</option> </select> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">Ghi Chú Bổ Sung / Thời Gian Phỏng Vấn:</label> <input
                  type="text"
                  placeholder="VD: 14:00 Chiều Thứ 3 (18/08/2026) qua Google Meet"
                  value={customEmailNote}
                  onChange={(e) => setCustomEmailNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                /> </div> <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300"> ⚡ Hệ thống sẽ tự động thay thế các biến <code className="font-medium font-mono">{'{{candidate_name}}'}</code>, <code className="font-medium font-mono">{'{{position}}'}</code>, <code className="font-medium font-mono">{'{{salary_offer}}'}</code> vào mẫu thư gửi đi. </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50"> <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
              > Hủy </button> <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              > <Send className="w-4 h-4" /> Gửi Email Ngay </button> </div> </div> </div> )}

      {/* ADD CANDIDATE MODAL */}
      {showAddModal && ( <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <form onSubmit={handleCreateCandidate}> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Plus className="w-4 h-4 text-blue-600" /> Thêm Hồ Sơ Ứng Viên Tuyển Dụng Mới </h3> <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-3.5 text-xs"> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Họ và Tên Ứng Viên *</label> <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn An"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Điện Thoại</label> <input
                      type="text"
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    /> </div> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Email *</label> <input
                      type="email"
                      required
                      placeholder="an.nv@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nguồn Ứng Tuyển</label> <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    > <option value="TopCV">TopCV</option> <option value="LinkedIn">LinkedIn</option> <option value="Facebook Ads">Facebook Ads</option> <option value="Referral">Người quen giới thiệu (Referral)</option> <option value="Website">Website Công Ty</option> </select> </div> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Vị Trí Ứng Tuyển</label> <input
                      type="text"
                      value={formData.position_applied}
                      onChange={(e) => setFormData({ ...formData, position_applied: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Phòng Ban</label> <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                    > <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option> <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option> <option value="Phòng Marketing">Phòng Marketing</option> <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option> <option value="Phòng CSKH">Phòng CSKH</option> <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option> </select> </div> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lương Kỳ Vọng (VND)</label> <input
                      type="number"
                      value={formData.expected_salary}
                      onChange={(e) => setFormData({ ...formData, expected_salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Số Năm Kinh Nghiệm</label> <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50"> <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                > Lưu Ứng Viên </button> </div> </form> </div> </div> )} </div> );
}
