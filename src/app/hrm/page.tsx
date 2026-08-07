'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  FileText,
  Building2,
  Plus,
  Search,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Upload,
  Filter,
  Eye,
  Edit3,
  Cloud,
  UserCheck,
  Lock,
  UserPlus,
  CheckSquare,
  Square,
  Laptop,
  Key,
  GraduationCap,
  Sparkles,
  ArrowRight,
  DollarSign,
  MapPin,
  HeartPulse,
  Camera,
  BadgeCheck,
  Paperclip,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  UserCheck2,
  ShieldAlert,
  History,
  LayoutGrid,
  List,
  ChevronRight,
  FileCheck,
  X,
  MessageSquare,
  Award,
  Sliders,
  Save
} from 'lucide-react';
import { EmployeeProfile, EmployeeApprovalStatus, Candidate, CandidateAuditLog, RecruitmentStage } from '@/types';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  changeEmployeeStatus,
  getOrgChartTree,
  approveByDirectManager,
  approveBySalesDirector,
  rejectEmployeeApproval,
  getJobTitles,
  createJobTitle,
  deleteJobTitle,
  JobTitleDefinition,
  getPositionCategories,
  createPositionCategory,
  deletePositionCategory,
  PositionCategoryDefinition,
  getGradeLevels,
  createGradeLevel,
  deleteGradeLevel,
  GradeLevelDefinition
} from '@/lib/hrmStore';
import dynamic from 'next/dynamic';
import VietnamEmployeeDistributionMap from '@/components/hrm/VietnamEmployeeDistributionMap';

const EmployeeModal = dynamic(() => import('@/components/hrm/EmployeeModal'), { ssr: false });
const ContractPdfModal = dynamic(() => import('@/components/hrm/ContractPdfModal'), { ssr: false });
const OrgChartTree = dynamic(() => import('@/components/hrm/OrgChartTree'), { ssr: false });
const HrmDashboard = dynamic(() => import('@/components/hrm/HrmDashboard'), { ssr: false });
const LaborBook = dynamic(() => import('@/components/hrm/LaborBook'), { ssr: false });

interface OnboardingTask {
  id: string;
  employee_name: string;
  position: string;
  department: string;
  joined_date: string;
  equipment_delivered: boolean;
  crm_account_created: boolean;
  training_completed: boolean;
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    candidate_code: 'UV-2026/001',
    name: 'Đỗ Thị Quyên',
    position: 'Chuyên Viên Marketing',
    department: 'Phòng Marketing',
    phone: '0988 111 222',
    email: 'quyen.do@gmail.com',
    stage: 'INTERVIEW',
    applied_date: '2026-07-15',
    salary_expectation: 18000000,
    interviewer_name: 'Nguyễn Hải Yến (Leader)',
    audit_logs: [
      { id: 'log_1_1', candidate_id: 'cand_1', candidate_name: 'Đỗ Thị Quyên', actor_name: 'Đặng Kim Anh (HR Manager)', action_type: 'CREATE', stage_to: 'APPLIED', note: 'Nộp hồ sơ ứng tuyển từ VietnamWorks', timestamp: '2026-07-15 09:00' },
      { id: 'log_1_2', candidate_id: 'cand_1', candidate_name: 'Đỗ Thị Quyên', actor_name: 'Đặng Kim Anh (HR Manager)', action_type: 'STAGE_CHANGE', stage_from: 'APPLIED', stage_to: 'INTERVIEW', note: 'Duyệt CV phù hợp, mời phỏng vấn Vòng 1', timestamp: '2026-07-16 14:20' }
    ]
  },
  {
    id: 'cand_2',
    candidate_code: 'UV-2026/002',
    name: 'Nguyễn Văn Minh',
    position: 'Sale Exec Senior',
    department: 'Phòng Kinh Doanh 1',
    phone: '0977 333 444',
    email: 'minh.nguyen@gmail.com',
    stage: 'OFFER',
    applied_date: '2026-07-18',
    salary_expectation: 22000000,
    interviewer_name: 'Trần Văn Hoàng (Trưởng Nhóm)',
    audit_logs: [
      { id: 'log_2_1', candidate_id: 'cand_2', candidate_name: 'Nguyễn Văn Minh', actor_name: 'Đặng Kim Anh (HR Manager)', action_type: 'CREATE', stage_to: 'APPLIED', note: 'Ứng tuyển qua Referral giới thiệu', timestamp: '2026-07-18 10:00' },
      { id: 'log_2_2', candidate_id: 'cand_2', candidate_name: 'Nguyễn Văn Minh', actor_name: 'Trần Văn Hoàng (Leader)', action_type: 'STAGE_CHANGE', stage_from: 'APPLIED', stage_to: 'INTERVIEW', note: 'Phỏng vấn đạt 9/10 chuyên môn', timestamp: '2026-07-19 11:30' },
      { id: 'log_2_3', candidate_id: 'cand_2', candidate_name: 'Nguyễn Văn Minh', actor_name: 'Phạm Minh Đức (Sales Director)', action_type: 'STAGE_CHANGE', stage_from: 'INTERVIEW', stage_to: 'OFFER', note: 'Gửi thư mời nhận việc Offer Lương 22Tr', timestamp: '2026-07-21 16:45' }
    ]
  },
  {
    id: 'cand_3',
    candidate_code: 'UV-2026/003',
    name: 'Trần Thị Thu',
    position: 'Chuyên Viên CSKH',
    department: 'Phòng CSKH',
    phone: '0912 555 666',
    email: 'thu.tran@gmail.com',
    stage: 'HIRED',
    applied_date: '2026-07-10',
    salary_expectation: 15000000,
    interviewer_name: 'Đặng Kim Anh (HR Manager)',
    audit_logs: [
      { id: 'log_3_1', candidate_id: 'cand_3', candidate_name: 'Trần Thị Thu', actor_name: 'Đặng Kim Anh (HR)', action_type: 'CREATE', stage_to: 'APPLIED', note: 'Nộp CV qua Zalo Hotline', timestamp: '2026-07-10 08:00' },
      { id: 'log_3_2', candidate_id: 'cand_3', candidate_name: 'Trần Thị Thu', actor_name: 'Đặng Kim Anh (HR)', action_type: 'STAGE_CHANGE', stage_from: 'OFFER', stage_to: 'HIRED', note: 'Ứng viên đã ký hợp đồng nhận việc', timestamp: '2026-07-22 09:30' }
    ]
  },
  {
    id: 'cand_4',
    candidate_code: 'UV-2026/004',
    name: 'Lê Hoàng Nam',
    position: 'Kỹ Sư Hạ Tầng Cloud',
    department: 'Phòng Kỹ Thuật',
    phone: '0933 777 888',
    email: 'nam.le@gmail.com',
    stage: 'APPLIED',
    applied_date: '2026-07-20',
    salary_expectation: 25000000,
    audit_logs: [
      { id: 'log_4_1', candidate_id: 'cand_4', candidate_name: 'Lê Hoàng Nam', actor_name: 'Lê Hoàng Nam', action_type: 'CREATE', stage_to: 'APPLIED', note: 'Ứng tuyển trực tiếp trên Website GGBingoVN', timestamp: '2026-07-20 15:00' }
    ]
  },
];

const INITIAL_ONBOARDING: OnboardingTask[] = [
  { id: 'onb_1', employee_name: 'Trần Văn Hoàng', position: 'Trưởng Phòng Kinh Doanh', department: 'Phòng Kinh Doanh', joined_date: '2026-07-01', equipment_delivered: true, crm_account_created: true, training_completed: true },
  { id: 'onb_2', employee_name: 'Nguyễn Quốc Tuấn', position: 'Sale Executive Senior', department: 'Phòng Kinh Doanh', joined_date: '2026-07-10', equipment_delivered: true, crm_account_created: true, training_completed: false },
  { id: 'onb_3', employee_name: 'Lê Thị Mai', position: 'Chuyên Viên CSKH', department: 'Phòng CSKH', joined_date: '2026-07-15', equipment_delivered: true, crm_account_created: false, training_completed: false },
];

export default function HRMPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => getEmployees());
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [onboardingList, setOnboardingList] = useState<OnboardingTask[]>(INITIAL_ONBOARDING);

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'DASHBOARD' | 'LABOR_BOOK' | 'APPROVAL_PIPELINE' | 'RECRUITMENT' | 'CONTRACTS' | 'ONBOARDING' | 'ORG_CHART' | 'JOB_TITLES' | 'MAP' | 'CONFIG'>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // HRM Module Configuration State
  const [hrmConfig, setHrmConfig] = useState({
    emp_prefix: 'NV-2026-',
    cand_prefix: 'UV-2026-',
    probation_days: 60,
    annual_leave_quota: 12,
    company_bhxh_percent: 17.5,
    company_bhyt_percent: 3.0,
    company_bhtn_percent: 1.0,
    user_bhxh_percent: 8.0,
    user_bhyt_percent: 1.5,
    user_bhtn_percent: 1.0,
    shift_start_time: '08:00',
    shift_end_time: '17:30',
    work_hours_per_day: 8.0,
    ot_weekday_rate: 1.5,
    ot_weekend_rate: 2.0,
  });

  // Sub-Tab inside Tab 7: TITLES (Chức danh chuyên môn), POSITIONS (Chức vụ quản lý), GRADES (Cấp bậc G1-G6)
  const [jobSubTab, setJobSubTab] = useState<'TITLES' | 'POSITIONS' | 'GRADES'>('TITLES');

  // Job Titles Management & Real-Time Auto Sync State
  const [jobTitlesList, setJobTitlesList] = useState<JobTitleDefinition[]>(() => getJobTitles());
  const [positionsList, setPositionsList] = useState<PositionCategoryDefinition[]>(() => getPositionCategories());
  const [gradeLevelsList, setGradeLevelsList] = useState<GradeLevelDefinition[]>(() => getGradeLevels());

  const [isJobTitleModalOpen, setIsJobTitleModalOpen] = useState(false);
  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState('');
  const [newJtCode, setNewJtCode] = useState('');
  const [newJtName, setNewJtName] = useState('');
  const [newJtPosName, setNewJtPosName] = useState('Chuyên Viên / Nhân Viên');
  const [newJtGradeCode, setNewJtGradeCode] = useState('G4');
  const [newJtDept, setNewJtDept] = useState('Phòng Kinh Doanh 1');
  const [newJtRank, setNewJtRank] = useState<number>(3);
  const [newJtDesc, setNewJtDesc] = useState('');

  // Position Modal Form State
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [newPosCode, setNewPosCode] = useState('');
  const [newPosName, setNewPosName] = useState('');
  const [newPosDesc, setNewPosDesc] = useState('');

  // Grade Level Modal Form State
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [newGrCode, setNewGrCode] = useState('');
  const [newGrName, setNewGrName] = useState('');
  const [newGrMinSal, setNewGrMinSal] = useState<number>(10000000);
  const [newGrMaxSal, setNewGrMaxSal] = useState<number>(20000000);
  const [newGrDesc, setNewGrDesc] = useState('');

  React.useEffect(() => {
    const handleSync = () => {
      setJobTitlesList([...getJobTitles()]);
      setPositionsList([...getPositionCategories()]);
      setGradeLevelsList([...getGradeLevels()]);
    };
    window.addEventListener('ggbg_hrm_job_titles_updated', handleSync);
    return () => window.removeEventListener('ggbg_hrm_job_titles_updated', handleSync);
  }, []);

  const handleCreateJobTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJtName.trim()) return;

    const code = newJtCode.trim() || `POS_${newJtName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    createJobTitle({
      code,
      name: newJtName.trim(),
      position_name: newJtPosName,
      grade_code: newJtGradeCode,
      department: newJtDept,
      rank_level: newJtRank,
      description: newJtDesc.trim() || 'Chức danh công việc mới tại HRM',
      is_active: true,
    });

    setJobTitlesList([...getJobTitles()]);
    setIsJobTitleModalOpen(false);
    setNewJtCode('');
    setNewJtName('');
    setNewJtDesc('');
    setStatusToast(`⚡ Đã khởi tạo & TỰ ĐỘNG ĐỒNG BỘ 100% chức danh "${newJtName.trim()}" sang RBAC & System Users!`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleDeleteJobTitleSubmit = (id: string, name: string) => {
    deleteJobTitle(id);
    setJobTitlesList([...getJobTitles()]);
    setStatusToast(`Đã xóa & cập nhật tự động chức danh "${name}".`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleCreatePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosName.trim()) return;

    const code = newPosCode.trim() || `POS_${newPosName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    createPositionCategory({
      code,
      name: newPosName.trim(),
      description: newPosDesc.trim() || 'Cấp chức vụ quản lý hành chính trong doanh nghiệp',
    });

    setPositionsList([...getPositionCategories()]);
    setIsPositionModalOpen(false);
    setNewPosCode('');
    setNewPosName('');
    setNewPosDesc('');
    setStatusToast(`⚡ Đã khởi tạo & tự động đồng bộ chức vụ "${newPosName.trim()}"!`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleDeletePositionSubmit = (id: string, name: string) => {
    deletePositionCategory(id);
    setPositionsList([...getPositionCategories()]);
    setStatusToast(`Đã xóa chức vụ "${name}".`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleCreateGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrCode.trim() || !newGrName.trim()) return;

    createGradeLevel({
      code: newGrCode.trim().toUpperCase(),
      name: newGrName.trim(),
      min_salary: newGrMinSal,
      max_salary: newGrMaxSal,
      description: newGrDesc.trim() || 'Khung cấp bậc & băng ngạch năng lực nhân sự',
    });

    setGradeLevelsList([...getGradeLevels()]);
    setIsGradeModalOpen(false);
    setNewGrCode('');
    setNewGrName('');
    setNewGrDesc('');
    setStatusToast(`⚡ Đã khởi tạo cấp bậc băng ngạch "${newGrCode.trim().toUpperCase()}"!`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleDeleteGradeSubmit = (id: string, code: string) => {
    deleteGradeLevel(id);
    setGradeLevelsList([...getGradeLevels()]);
    setStatusToast(`Đã xóa cấp bậc "${code}".`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  // Recruitment View Mode (Kanban vs Table)
  const [recruitmentViewMode, setRecruitmentViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [stageChangeNote, setStageChangeNote] = useState('');
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // New Candidate Form State
  const [newCandData, setNewCandData] = useState<Partial<Candidate>>({
    name: '',
    position: 'Chuyên Viên Sale Exec',
    department: 'Phòng Kinh Doanh 1',
    phone: '',
    email: '',
    salary_expectation: 15000000,
  });
  const [isNewCandModalOpen, setIsNewCandModalOpen] = useState(false);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractEmployee, setContractEmployee] = useState<EmployeeProfile | null>(null);

  // Approval Modal Note state
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedApprovalEmp, setSelectedApprovalEmp] = useState<EmployeeProfile | null>(null);

  // Status Change Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTargetEmp, setStatusTargetEmp] = useState<EmployeeProfile | null>(null);
  const [statusNewValue, setStatusNewValue] = useState<'Active' | 'Probation' | 'Pending_Resign' | 'Resigned' | 'Suspended'>('Active');
  const [statusReasonNote, setStatusReasonNote] = useState('');
  const [statusToast, setStatusToast] = useState('');

  const renderEmployeeStatusBadge = (status?: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🟢 Đang Làm Việc
          </span>
        );
      case 'Probation':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🔵 Thử Việc
          </span>
        );
      case 'Pending_Resign':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit animate-pulse">
            🟠 Chờ Nghỉ Việc
          </span>
        );
      case 'Resigned':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🔴 Đã Nghỉ Việc
          </span>
        );
      case 'Suspended':
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🟣 Tạm Hoãn HĐ
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            ⚪ Ứng Viên Mới
          </span>
        );
    }
  };

  const handleOpenStatusModal = (emp: EmployeeProfile) => {
    setStatusTargetEmp(emp);
    setStatusNewValue((emp.status as any) || 'Active');
    setStatusReasonNote('');
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusTargetEmp) return;

    changeEmployeeStatus(
      statusTargetEmp.id,
      statusNewValue,
      'Đặng Kim Anh (HR Admin)',
      statusReasonNote || `Chuyển trạng thái nhân sự sang ${statusNewValue}`
    );

    setEmployees(getEmployees());
    setIsStatusModalOpen(false);
    setStatusToast(`Đã chuyển trạng thái nhân sự [${statusTargetEmp.full_name}] thành công!`);
    setTimeout(() => setStatusToast(''), 4000);
  };

  const handleSignContractAndActivate = (item: OnboardingTask) => {
    const targetEmp = employees.find((e) => e.full_name === item.employee_name);
    if (targetEmp) {
      changeEmployeeStatus(
        targetEmp.id,
        'Active',
        'Đặng Kim Anh (HR Admin)',
        'Ký hợp đồng lao động & kích hoạt trạng thái Đang Làm Việc'
      );
      setEmployees(getEmployees());
      setStatusToast(`🎯 Ký HĐLĐ thành công! Nhân sự [${targetEmp.full_name}] đã chuyển sang "Đang làm việc".`);
      setTimeout(() => setStatusToast(''), 4000);
    }
  };

  const pendingApprovalCount = employees.filter(
    (e) => e.approval_status === 'PENDING_DIRECT_MANAGER' || e.approval_status === 'PENDING_SALES_DIRECTOR'
  ).length;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.id_card_number && emp.id_card_number.includes(searchTerm));

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Recruitment Candidate Stage Change with Audit Logging
  const handleUpdateCandidateStage = (candidateId: string, newStage: RecruitmentStage, noteMsg?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const oldStage = c.stage;
          const newLog: CandidateAuditLog = {
            id: `log_${Date.now()}`,
            candidate_id: c.id,
            candidate_name: c.name,
            actor_name: 'Đặng Kim Anh (HR Manager)',
            action_type: 'STAGE_CHANGE',
            stage_from: oldStage,
            stage_to: newStage,
            note: noteMsg || `Chuyển trạng thái phễu từ ${oldStage} sang ${newStage}`,
            timestamp: now,
          };
          return {
            ...c,
            stage: newStage,
            audit_logs: [newLog, ...(c.audit_logs || [])],
          };
        }
        return c;
      })
    );
    setStageChangeNote('');
  };

  const handleCreateNewCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandData.name || !newCandData.phone) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newId = `cand_${Date.now()}`;
    const initialLog: CandidateAuditLog = {
      id: `log_${Date.now()}`,
      candidate_id: newId,
      candidate_name: newCandData.name,
      actor_name: 'Đặng Kim Anh (HR Manager)',
      action_type: 'CREATE',
      stage_to: 'APPLIED',
      note: 'Khởi tạo ứng viên mới trong phễu tuyển dụng',
      timestamp: now,
    };

    const newCandidate: Candidate = {
      id: newId,
      candidate_code: `UV-2026/${String(candidates.length + 1).padStart(3, '0')}`,
      name: newCandData.name,
      position: newCandData.position || 'Chuyên Viên Sale',
      department: newCandData.department || 'Phòng Kinh Doanh 1',
      phone: newCandData.phone,
      email: newCandData.email || `${newCandData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      stage: 'APPLIED',
      applied_date: new Date().toISOString().split('T')[0],
      salary_expectation: Number(newCandData.salary_expectation) || 15000000,
      audit_logs: [initialLog],
    };

    setCandidates([newCandidate, ...candidates]);
    setIsNewCandModalOpen(false);
    setNewCandData({ name: '', position: 'Chuyên Viên Sale Exec', department: 'Phòng Kinh Doanh 1', phone: '', email: '', salary_expectation: 15000000 });
  };

  const handleSaveEmployee = (empData: Partial<EmployeeProfile>) => {
    if (employeeModalMode === 'create') {
      createEmployee(empData as any);
      setEmployees(getEmployees());
    } else if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, empData);
      setEmployees(getEmployees());
    }
  };

  const handleUpdateR2Url = (empId: string, newUrl: string) => {
    updateEmployee(empId, { contract_file_r2: newUrl });
    setEmployees(getEmployees());
    if (contractEmployee && contractEmployee.id === empId) {
      setContractEmployee({ ...contractEmployee, contract_file_r2: newUrl });
    }
  };

  const handleOpenContractModal = (emp: EmployeeProfile) => {
    setContractEmployee(emp);
    setIsContractModalOpen(true);
  };

  // Approval Action Handlers
  const handleApproveDirectManager = (emp: EmployeeProfile) => {
    approveByDirectManager(emp.id, 'Trưởng Nhóm / Manager', approvalNote || 'Đã duyệt sơ bộ');
    setEmployees(getEmployees());
    setSelectedApprovalEmp(null);
    setApprovalNote('');
  };

  const handleApproveSalesDirector = (emp: EmployeeProfile) => {
    const updated = approveBySalesDirector(emp.id, 'Phạm Minh Đức (Giám Đốc Kinh Doanh)', approvalNote || 'Duyệt cuối - Tiếp nhận nhân sự');
    setEmployees(getEmployees());

    if (updated) {
      const newOnboardingItem: OnboardingTask = {
        id: `onb_${Date.now()}`,
        employee_name: updated.full_name,
        position: updated.position,
        department: updated.department,
        joined_date: updated.joined_date || new Date().toISOString().split('T')[0],
        equipment_delivered: false,
        crm_account_created: false,
        training_completed: false,
      };
      setOnboardingList((prev) => [newOnboardingItem, ...prev]);
    }

    setSelectedApprovalEmp(null);
    setApprovalNote('');
  };

  const handleRejectApproval = (emp: EmployeeProfile) => {
    const reason = approvalNote || 'Hồ sơ chưa đạt tiêu chuẩn kinh doanh';
    rejectEmployeeApproval(emp.id, 'Cấp Quản Lý', reason);
    setEmployees(getEmployees());
    setSelectedApprovalEmp(null);
    setApprovalNote('');
  };

  const toggleOnboardingTask = (id: string, field: 'equipment_delivered' | 'crm_account_created' | 'training_completed') => {
    setOnboardingList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: !item[field] };
        }
        return item;
      })
    );
  };

  const renderApprovalBadge = (status?: EmployeeApprovalStatus) => {
    switch (status) {
      case 'PENDING_DIRECT_MANAGER':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> 1️⃣ Chờ Quản Lý Trực Tiếp Duyệt
          </span>
        );
      case 'PENDING_SALES_DIRECTOR':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> 2️⃣ Chờ GĐ Kinh Doanh Duyệt (Duyệt Cuối)
          </span>
        );
      case 'APPROVED_FOR_ONBOARDING':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 3️⃣ Đã Duyệt ➔ Chuyển HR Onboard / Ký HĐ
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> ❌ Từ Chối Phê Duyệt
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-xl text-[11px]">
            Đã Duyệt
          </span>
        );
    }
  };

  const renderRankBadge = (rank?: number) => {
    switch (rank) {
      case 1:
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-semibold uppercase">Cấp 1: Ban Giám Đốc</span>;
      case 2:
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-bold uppercase">Cấp 2: Quản Lý & Lead</span>;
      case 3:
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase">Cấp 3: Chuyên Viên</span>;
      case 4:
      default:
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold uppercase">Cấp 4: Thử Việc / Mới</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusToast && (
        <div className="p-4 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-200" />
            <span>{statusToast}</span>
          </div>
          <button onClick={() => setStatusToast('')} className="p-1 hover:bg-purple-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Nhân Sự</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hồ sơ nhân viên, quy trình phê duyệt và phễu tuyển dụng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (employees.length > 0) handleOpenContractModal(employees[0]);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            Xem Hợp Đồng PDF
          </button>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setEmployeeModalMode('create');
              setIsEmployeeModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Nhân Sự Mới
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'DASHBOARD' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📊 1. Báo Cáo & Dashboard HR
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PROFILE' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          👤 2. Hồ Sơ Nhân Sự ({employees.length})
        </button>



        <button
          onClick={() => setActiveTab('CONTRACTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CONTRACTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📄 Quản Lý Hợp Đồng & Lương
        </button>

        <button
          onClick={() => setActiveTab('MAP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'MAP' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
          }`}
        >
          🗺️ Bản Đồ Phân Bổ Nhân Sự
        </button>

        <button
          onClick={() => setActiveTab('CONFIG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CONFIG' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          ⚙️ Cấu Hình Nhân Sự & BHXH
        </button>
      </div>

      {/* TAB 1: HỒ SƠ NHÂN SỰ & SỔ QUẢN LÝ LAO ĐỘNG (NĐ 145/2020/NĐ-CP) */}
      {activeTab === 'PROFILE' && (
        <LaborBook
          employees={employees}
          onSelect={(emp) => {
            setSelectedEmployee(emp);
            setEmployeeModalMode('view');
            setIsEmployeeModalOpen(true);
          }}
        />
      )}



      {/* TAB 3: PHỄU TUYỂN DỤNG DUAL-VIEW (KANBAN VS LIST) KÈM GHI LOG 100% */}
      {activeTab === 'RECRUITMENT' && (
        <div className="space-y-4">
          {/* Controls & View Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Chế Độ Xem Phễu:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setRecruitmentViewMode('KANBAN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    recruitmentViewMode === 'KANBAN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Dạng Thẻ Kanban (5 Bước)
                </button>
                <button
                  onClick={() => setRecruitmentViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    recruitmentViewMode === 'LIST' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Dạng Bảng Danh Sách
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuditDrawerOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <History className="w-4 h-4 text-blue-600" /> Nhật Ký Ghi Log Tuyển Dụng
              </button>
              <button
                onClick={() => setIsNewCandModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm Ứng Viên Mới
              </button>
            </div>
          </div>

          {/* DẠNG 1: THẺ KANBAN 5 BƯỚC */}
          {recruitmentViewMode === 'KANBAN' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
              {[
                { stageId: 'APPLIED', name: '1. Ứng Tuyển Mới', color: '#3B82F6' },
                { stageId: 'INTERVIEW', name: '2. Phỏng Vấn', color: '#F59E0B' },
                { stageId: 'OFFER', name: '3. Đề Nghị HĐ (Offer)', color: '#8B5CF6' },
                { stageId: 'HIRED', name: '4. Nhận Việc (Hired)', color: '#10B981' },
                { stageId: 'REJECTED', name: '5. Từ Chối / Loại', color: '#EF4444' },
              ].map((col) => {
                const stageCands = candidates.filter((c) => c.stage === col.stageId);
                return (
                  <div key={col.stageId} className="bg-slate-100/80 p-3 rounded-2xl border border-slate-200/90 min-h-[550px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-800 text-[11px]" style={{ color: col.color }}>{col.name}</span>
                        <span className="px-2 py-0.5 bg-slate-200 rounded-full font-semibold text-[10px] text-slate-700">{stageCands.length}</span>
                      </div>

                      <div className="space-y-3">
                        {stageCands.map((cand) => (
                          <div key={cand.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-slate-900 text-xs">{cand.name}</p>
                                <p className="text-[10px] font-mono text-blue-600">{cand.candidate_code || 'UV-2026'}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setIsCandidateModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 rounded"
                                title="Xem Chi Tiết & Log"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-600 font-semibold">{cand.position}</p>
                            <p className="text-[10px] text-slate-500">{cand.department}</p>
                            <p className="text-[10px] font-mono text-slate-400">{cand.phone} • {cand.email}</p>

                            {/* Quick Stage Transition Dropdown */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400">Đổi Bước:</span>
                              <select
                                value={cand.stage}
                                onChange={(e) => handleUpdateCandidateStage(cand.id, e.target.value as RecruitmentStage)}
                                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-800 focus:outline-none"
                              >
                                <option value="APPLIED">1. Ứng Tuyển</option>
                                <option value="INTERVIEW">2. Phỏng Vấn</option>
                                <option value="OFFER">3. Offer HĐ</option>
                                <option value="HIRED">4. Nhận Việc</option>
                                <option value="REJECTED">5. Từ Chối</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DẠNG 2: BẢNG DANH SÁCH CHI TIẾT */}
          {recruitmentViewMode === 'LIST' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                    <th className="p-4">Mã UV & Họ Tên</th>
                    <th className="p-4">Vị Trí & Phòng Ban</th>
                    <th className="p-4">SĐT & Email</th>
                    <th className="p-4">Lương Kỳ Vọng</th>
                    <th className="p-4">Trạng Thái Phễu</th>
                    <th className="p-4">Nhật Ký Thao Tác (Logs)</th>
                    <th className="p-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm">{cand.name}</p>
                        <p className="font-mono text-blue-700 text-[11px]">{cand.candidate_code || 'UV-2026'}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800">{cand.position}</p>
                        <p className="text-slate-500 text-[11px]">{cand.department}</p>
                      </td>

                      <td className="p-4 font-mono text-slate-700">
                        <p className="font-bold">{cand.phone}</p>
                        <p className="text-slate-400 text-[10px] font-sans">{cand.email}</p>
                      </td>

                      <td className="p-4 font-mono font-bold text-emerald-700">
                        {(cand.salary_expectation || 15000000).toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="p-4">
                        <select
                          value={cand.stage}
                          onChange={(e) => handleUpdateCandidateStage(cand.id, e.target.value as RecruitmentStage)}
                          className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        >
                          <option value="APPLIED">1. Ứng Tuyển Mới</option>
                          <option value="INTERVIEW">2. Phỏng Vấn</option>
                          <option value="OFFER">3. Đề Nghị HĐ (Offer)</option>
                          <option value="HIRED">4. Nhận Việc (Hired)</option>
                          <option value="REJECTED">5. Từ Chối / Loại</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold rounded">
                          {cand.audit_logs?.length || 0} Lần Ghi Log
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setIsCandidateModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-100 transition-all flex items-center gap-1 mx-auto"
                        >
                          <History className="w-3.5 h-3.5" /> Xem Log & Lịch Sử
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUẢN LÝ HỢP ĐỒNG & LƯƠNG CƠ BẢN */}
      {activeTab === 'CONTRACTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 text-slate-900 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-700 font-bold uppercase">Hạ Tầng Lưu Trữ Hợp Đồng</p>
              <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <Lock className="w-4 h-4" /> Đã Mã Hóa An Toàn Bảo Mật
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">Tổng Hợp Đồng Đã Lưu</p>
              <p className="text-xl font-bold text-slate-900">{filteredEmployees.length} File PDF</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">Tổng Quỹ Lương Cơ Bản</p>
              <p className="text-xl font-bold text-emerald-700">185.000.000 ₫/tháng</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                  <th className="p-4">Số Hợp Đồng</th>
                  <th className="p-4">Nhân Sự</th>
                  <th className="p-4">Loại HĐ</th>
                  <th className="p-4">Lương Cơ Bản</th>
                  <th className="p-4">File Chứng Từ</th>
                  <th className="p-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-blue-700">{emp.contract_number}</td>
                    <td className="p-4 font-bold text-slate-900">{emp.full_name}</td>
                    <td className="p-4 font-semibold text-slate-700">{emp.contract_type || 'Chính thức'}</td>
                    <td className="p-4 font-mono font-bold text-emerald-700">15.000.000 ₫</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold text-[10px]">🔒 Đã Lưu</span></td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleOpenContractModal(emp)} className="px-3 py-1 bg-blue-600 text-white font-bold rounded-xl text-xs">
                        Xem PDF Hợp Đồng
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CHECKLIST ONBOARDING NHÂN SỰ MỚI */}
      {activeTab === 'ONBOARDING' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Checklist Bàn Giao & Đào Tạo Nhân Sự Mới</h3>
          <div className="space-y-3">
            {onboardingList.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.employee_name}</p>
                  <p className="text-slate-500">{item.position} • {item.department} (Ngày vào: {item.joined_date})</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'equipment_delivered')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.equipment_delivered ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Laptop className="w-4 h-4" /> {item.equipment_delivered ? '✓ Bàn Giao Thiết Bị' : 'Chưa Giao Thiết Bị'}
                  </button>

                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'crm_account_created')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.crm_account_created ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Key className="w-4 h-4" /> {item.crm_account_created ? '✓ Cấp TK CRM' : 'Chưa Cấp TK CRM'}
                  </button>

                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'training_completed')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.training_completed ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> {item.training_completed ? '✓ Hoàn Thành Đào Tạo' : 'Đang Đào Tạo'}
                  </button>

                  <button
                    onClick={() => handleSignContractAndActivate(item)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95 ml-2"
                  >
                    <FileCheck className="w-4 h-4" /> Ký HĐ & Kích Hoạt "Đang Làm Việc"
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ORG CHART */}
      {activeTab === 'ORG_CHART' && (
        <OrgChartTree
          rootData={getOrgChartTree()}
          onSelectMember={(name) => {
            const found = employees.find((e) => e.full_name.includes(name));
            if (found) {
              setSelectedEmployee(found);
              setEmployeeModalMode('view');
              setIsEmployeeModalOpen(true);
            }
          }}
        />
      )}

      {/* TAB 7: QUẢN LÝ CHỨC DANH, CHỨC VỤ & CẤP BẬC (G1-G6) - REAL-TIME AUTO SYNC */}
      {activeTab === 'JOB_TITLES' && (
        <div className="space-y-6">
          {/* Header & Auto-Sync Alert */}
          <div className="gg-hero p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">Quản Lý Chức Danh, Chức Vụ & Cấp Bậc (G1-G6)</h3>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span> Auto Synced
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Phân biệt rõ <strong>Chức Vụ</strong> (Giám Đốc, Trưởng Phòng...), <strong>Chức Danh</strong> (GĐ Kinh Doanh, GĐ Thị Trường...) và <strong>Khung Cấp Bậc</strong> (G1 ➔ G6 tùy biến). Tự động đồng bộ 100% thời gian thực sang RBAC & System Users.
                </p>
              </div>
            </div>

            {/* Quick Create Buttons depending on SubTab */}
            {jobSubTab === 'TITLES' && (
              <button
                onClick={() => setIsJobTitleModalOpen(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Chức Danh Mới
              </button>
            )}

            {jobSubTab === 'POSITIONS' && (
              <button
                onClick={() => setIsPositionModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Chức Vụ Mới
              </button>
            )}

            {jobSubTab === 'GRADES' && (
              <button
                onClick={() => setIsGradeModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Cấp Bậc G-Series
              </button>
            )}
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 w-fit text-xs font-bold">
            <button
              onClick={() => setJobSubTab('TITLES')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'TITLES' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🏅 1. Quản Lý Chức Danh ({jobTitlesList.length})
            </button>

            <button
              onClick={() => setJobSubTab('POSITIONS')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'POSITIONS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🏢 2. Quản Lý Chức Vụ ({positionsList.length})
            </button>

            <button
              onClick={() => setJobSubTab('GRADES')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'GRADES' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📊 3. Khung Cấp Bậc (G1 - G6) ({gradeLevelsList.length})
            </button>
          </div>

          {/* SUB-TAB 1: CHỨC DANH CHUYÊN MÔN (JOB TITLES) */}
          {jobSubTab === 'TITLES' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" /> Danh Mục Chức Danh Chuyên Môn
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ví dụ: Giám Đốc Kinh Doanh, Giám Đốc Thị Trường, Trưởng Phòng Kinh Doanh...
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={jobTitleSearchTerm}
                    onChange={(e) => setJobTitleSearchTerm(e.target.value)}
                    placeholder="Tìm theo mã, tên chức danh..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                      <th className="p-3.5">Mã Chức Danh</th>
                      <th className="p-3.5">Tên Chức Danh Chuyên Môn</th>
                      <th className="p-3.5">Chức Vụ Tương Ứng</th>
                      <th className="p-3.5">Cấp Bậc Băng Ngạch</th>
                      <th className="p-3.5">Thuộc Phòng Ban</th>
                      <th className="p-3.5 text-center">Trạng Thái Đồng Bộ</th>
                      <th className="p-3.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobTitlesList
                      .filter((jt) => {
                        if (!jobTitleSearchTerm.trim()) return true;
                        const term = jobTitleSearchTerm.toLowerCase();
                        return (
                          jt.name.toLowerCase().includes(term) ||
                          jt.code.toLowerCase().includes(term) ||
                          jt.department.toLowerCase().includes(term)
                        );
                      })
                      .map((jt) => (
                        <tr key={jt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-purple-700">{jt.code}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{jt.name}</p>
                            <p className="text-[11px] text-slate-500">{jt.description}</p>
                          </td>
                          <td className="p-3.5 font-bold text-blue-700">{jt.position_name || 'N/A'}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded border border-emerald-200">
                              {jt.grade_code || 'G4'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-700 font-medium">{jt.department}</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-Synced RBAC
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteJobTitleSubmit(jt.id, jt.name)}
                              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition-colors text-[11px]"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: CHỨC VỤ QUẢN LÝ (POSITIONS) */}
          {jobSubTab === 'POSITIONS' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" /> Danh Mục Chức Vụ Hành Chính / Quản Lý
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ví dụ: Giám Đốc, Trưởng Phòng, Trưởng Nhóm, Chuyên Viên / Nhân Viên, Thử Việc...
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positionsList.map((pos) => (
                  <div key={pos.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-[11px] font-bold rounded border border-blue-200">
                        {pos.code}
                      </span>
                      <button
                        onClick={() => handleDeletePositionSubmit(pos.id, pos.name)}
                        className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900">{pos.name}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">{pos.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: KHUNG CẤP BẬC G-SERIES (GRADE LEVELS) */}
          {jobSubTab === 'GRADES' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" /> Thang Cấp Bậc & Khung Băng Ngạch Năng Lực (G-Series)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tùy biến cấp bậc G1, G2, G3, G4, G5, G6... tương ứng với dải lương trần / sàn doanh nghiệp
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeLevelsList.map((gr) => (
                  <div key={gr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-mono text-xs font-semibold rounded">
                        {gr.code}
                      </span>
                      <button
                        onClick={() => handleDeleteGradeSubmit(gr.id, gr.code)}
                        className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{gr.name}</h5>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800">
                      <span>Dải Lương: </span>
                      <span className="text-emerald-700">{gr.min_salary.toLocaleString('vi-VN')} ₫</span>
                      <span> - </span>
                      <span className="text-emerald-700">{gr.max_salary.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{gr.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: BẢN ĐỒ PHÂN BỔ NHÂN SỰ KINH DOANH VIỆT NAM (GIS HEATMAP) */}
      {activeTab === 'MAP' && (
        <VietnamEmployeeDistributionMap employees={employees} />
      )}

      {/* TAB 9: CẤU HÌNH THAM SỐ QUẢN LÝ NHÂN SỰ & BẢO HIỂM */}
      {activeTab === 'CONFIG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" /> Cấu Hình Tham Số Phân Hệ Quản Lý Nhân Sự (HRM Configuration)
              </h3>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                Thiết lập quy tắc mã số nhân viên, tỷ lệ BHXH/BHYT, quỹ phép năm & khung giờ ca kíp làm việc.
              </p>
            </div>

            <button
              onClick={() => {
                setStatusToast('✅ Đã lưu thành công Cấu hình Phân Hệ Quản Lý Nhân Sự!');
                setTimeout(() => setStatusToast(''), 4000);
              }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Nhân Sự
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Mã NV & Quy Tắc Thử Việc */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs text-purple-700 uppercase tracking-wider">
                1. Quy Tắc Định Dạng Mã & Thử Việc
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Tiền Tố Mã Nhân Viên</label>
                  <input
                    type="text"
                    value={hrmConfig.emp_prefix}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, emp_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Tiền Tố Mã Ứng Viên</label>
                  <input
                    type="text"
                    value={hrmConfig.cand_prefix}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, cand_prefix: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Số Ngày Thử Việc Tiêu Chuẩn</label>
                  <input
                    type="number"
                    value={hrmConfig.probation_days}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, probation_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Quỹ Phép Năm Mặc Định (Ngày)</label>
                  <input
                    type="number"
                    value={hrmConfig.annual_leave_quota}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, annual_leave_quota: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Tỷ Lệ BHXH */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs text-blue-700 uppercase tracking-wider">
                2. Tỷ Lệ Trích Nộp Bảo Hiểm Xã Hội (BHXH/BHYT/BHTN)
              </h4>

              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 font-normal">Tỷ lệ Doanh Nghiệp đóng (Tổng 21.5%):</p>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHXH (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.company_bhxh_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, company_bhxh_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHYT (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.company_bhyt_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, company_bhyt_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHTN (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.company_bhtn_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, company_bhtn_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-normal pt-1">Tỷ lệ Người Lao Động đóng (Tổng 10.5%):</p>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHXH (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.user_bhxh_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, user_bhxh_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-purple-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHYT (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.user_bhyt_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, user_bhyt_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-purple-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-slate-600 mb-0.5">BHTN (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={hrmConfig.user_bhtn_percent}
                      onChange={(e) => setHrmConfig({ ...hrmConfig, user_bhtn_percent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-purple-700 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Khung Giờ Làm Việc & Shift Rules */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 md:col-span-2">
              <h4 className="font-bold text-slate-900 text-xs text-amber-700 uppercase tracking-wider">
                3. Khung Giờ Làm Việc Tiêu Chuẩn & Hệ Số Tăng Ca (Shift & OT Rules)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block text-slate-700 mb-1">Giờ Vào Ca Sáng</label>
                  <input
                    type="time"
                    value={hrmConfig.shift_start_time}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, shift_start_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Giờ Tan Ca Chiều</label>
                  <input
                    type="time"
                    value={hrmConfig.shift_end_time}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, shift_end_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Hệ Số OT Ngày Thường</label>
                  <input
                    type="number"
                    step={0.1}
                    value={hrmConfig.ot_weekday_rate}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, ot_weekday_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Hệ Số OT Cuối Tuần</label>
                  <input
                    type="number"
                    step={0.1}
                    value={hrmConfig.ot_weekend_rate}
                    onChange={(e) => setHrmConfig({ ...hrmConfig, ot_weekend_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-amber-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DASHBOARD NHÂN SỰ (Dựng từ sổ quản lý lao động) */}
      {activeTab === 'DASHBOARD' && (
        <HrmDashboard employees={employees} />
      )}



      {/* MODAL 1: THÊM ỨNG VIÊN MỚI TRONG PHỄU TUYỂN DỤNG */}
      {isNewCandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Thêm Ứng Viên Tuyển Dụng Mới</h3>
              </div>
              <button onClick={() => setIsNewCandModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ Và Tên Ứng Viên *</label>
                <input
                  type="text"
                  value={newCandData.name || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, name: e.target.value })}
                  placeholder="Ví dụ: Đỗ Hoàng Long"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Điện Thoại *</label>
                <input
                  type="text"
                  value={newCandData.phone || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, phone: e.target.value })}
                  placeholder="0988 999 888"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vị Trí Ứng Tuyển</label>
                <input
                  type="text"
                  value={newCandData.position || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, position: e.target.value })}
                  placeholder="Chuyên Viên Sale Exec / Marketing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng Ban</label>
                <select
                  value={newCandData.department || 'Phòng Kinh Doanh 1'}
                  onChange={(e) => setNewCandData({ ...newCandData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                  <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                  <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                  <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCandModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md">
                  Tạo Ứng Viên & Ghi Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM AUDIT LOGS CHI TIẾT THEO ỨNG VIÊN */}
      {isCandidateModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" /> Nhật Ký Ghi Log Thao Tác: {selectedCandidate.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedCandidate.candidate_code} • {selectedCandidate.position} ({selectedCandidate.department})
                </p>
              </div>
              <button onClick={() => setIsCandidateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <p>SĐT: <strong className="font-mono text-slate-900">{selectedCandidate.phone}</strong></p>
                  <p>Email: <strong className="text-slate-900">{selectedCandidate.email}</strong></p>
                  <p>Trạng thái phễu: <strong className="text-blue-700 font-bold">{selectedCandidate.stage}</strong></p>
                  <p>Lương kỳ vọng: <strong className="text-emerald-700 font-bold font-mono">{(selectedCandidate.salary_expectation || 15000000).toLocaleString('vi-VN')} ₫</strong></p>
                </div>
              </div>

              {/* Timeline Logs */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Lịch Sử Ghi Log Thao Tác (Audit History):
                </h4>

                <div className="space-y-3 pl-4 border-l-2 border-blue-500">
                  {selectedCandidate.audit_logs?.map((log) => (
                    <div key={log.id} className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-900">{log.actor_name}</span>
                        <span className="font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-800 font-semibold">{log.note}</p>
                      {log.stage_from && log.stage_to && (
                        <p className="text-[10px] text-blue-700 font-mono">
                          Chuyển phễu: <span>{log.stage_from}</span> ➔ <strong>{log.stage_to}</strong>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: KHAI THÁC NHẬT KÝ LOG TOÀN BỘ PHỄU TUYỂN DỤNG */}
      {isAuditDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" /> Toàn Bộ Log Phễu Tuyển Dụng
              </h3>
              <button onClick={() => setIsAuditDrawerOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {candidates.flatMap((c) => c.audit_logs || []).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{log.candidate_name}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{log.note}</p>
                  <p className="text-[10px] text-blue-600 font-mono">Người thực hiện: {log.actor_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHUYỂN TRẠNG THÁI NHÂN SỰ */}
      {isStatusModalOpen && statusTargetEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Chuyển Trạng Thái Nhân Sự</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {statusTargetEmp.full_name} ({statusTargetEmp.employee_code})
                  </p>
                </div>
              </div>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusChange} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <span className="font-bold text-slate-600">Trạng Thái Hiện Tại:</span>
                {renderEmployeeStatusBadge(statusTargetEmp.status)}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Chọn Trạng Thái Mới *</label>
                <select
                  value={statusNewValue}
                  onChange={(e) => setStatusNewValue(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Active">🟢 Đang Làm Việc (Active)</option>
                  <option value="Probation">🔵 Thử Việc (Probation)</option>
                  <option value="Pending_Resign">🟠 Chờ Nghỉ Việc (Pending Resignation)</option>
                  <option value="Resigned">🔴 Đã Nghỉ Việc (Resigned)</option>
                  <option value="Suspended">🟣 Tạm Hoãn Hợp Đồng (Suspended)</option>
                  <option value="Applicant">⚪ Ứng Viên Mới (Applicant)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi Chú / Lý Do Chuyển Trạng Thái</label>
                <textarea
                  rows={3}
                  value={statusReasonNote}
                  onChange={(e) => setStatusReasonNote(e.target.value)}
                  placeholder="Nhập lý do (ví dụ: Đã nộp đơn xin nghỉ việc, Đạt thử việc ký HĐ chính thức, Hoàn tất ký HĐLĐ...)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  Lưu Cập Nhật Trạng Thái
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: THÊM CHỨC DANH MỚI (JOB TITLE) */}
      {isJobTitleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-purple-50 text-slate-900 border-b border-purple-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 border border-purple-200 rounded-xl text-purple-700">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Chức Danh Chuyên Môn Mới</h3>
                  <p className="text-[11px] text-purple-700">Ví dụ: Giám Đốc Kinh Doanh, Giám Đốc Thị Trường...</p>
                </div>
              </div>
              <button onClick={() => setIsJobTitleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobTitleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Chức Danh Chuyên Môn *:</label>
                <input
                  type="text"
                  required
                  value={newJtName}
                  onChange={(e) => setNewJtName(e.target.value)}
                  placeholder="VD: Giám Đốc Kinh Doanh, Trưởng Phòng HR..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chức Vụ Hành Chính:</label>
                  <select
                    value={newJtPosName}
                    onChange={(e) => setNewJtPosName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 focus:outline-none"
                  >
                    {positionsList.map((p) => (
                      <option key={p.id} value={p.name}>
                        🏢 {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khung Cấp Bậc (Grade):</label>
                  <select
                    value={newJtGradeCode}
                    onChange={(e) => setNewJtGradeCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700 focus:outline-none"
                  >
                    {gradeLevelsList.map((g) => (
                      <option key={g.id} value={g.code}>
                        📊 {g.code} ({g.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã Chức Danh (Code):</label>
                <input
                  type="text"
                  value={newJtCode}
                  onChange={(e) => setNewJtCode(e.target.value)}
                  placeholder="VD: DIR_SALES, MGR_HR... (Tự tạo nếu trống)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thuộc Phòng Ban:</label>
                <select
                  value={newJtDept}
                  onChange={(e) => setNewJtDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                  <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                  <option value="Phòng Marketing">Phòng Marketing</option>
                  <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                  <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
                  <option value="Phòng CSKH">Phòng CSKH</option>
                  <option value="Phòng Kiểm Toán & An Ninh">Phòng Kiểm Toán & An Ninh</option>
                  <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Trách Nhiệm:</label>
                <textarea
                  rows={2}
                  value={newJtDesc}
                  onChange={(e) => setNewJtDesc(e.target.value)}
                  placeholder="Mô tả phạm vi chiến lược / công việc chuyên môn..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsJobTitleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM CHỨC VỤ MỚI (POSITION) */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl text-blue-700">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Chức Vụ Quản Lý Mới</h3>
                  <p className="text-[11px] text-blue-700">Ví dụ: Giám Đốc, Trưởng Phòng, Trưởng Nhóm, Nhân Viên...</p>
                </div>
              </div>
              <button onClick={() => setIsPositionModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePositionSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Chức Vụ Hành Chính *:</label>
                <input
                  type="text"
                  required
                  value={newPosName}
                  onChange={(e) => setNewPosName(e.target.value)}
                  placeholder="VD: Phó Giám Đốc, Trưởng Bộ Phận, Trợ Lý Executive..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã Chức Vụ (Code):</label>
                <input
                  type="text"
                  value={newPosCode}
                  onChange={(e) => setNewPosCode(e.target.value)}
                  placeholder="VD: POS_VP, POS_HEAD... (Tự tạo nếu trống)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Vai Trò:</label>
                <textarea
                  rows={2}
                  value={newPosDesc}
                  onChange={(e) => setNewPosDesc(e.target.value)}
                  placeholder="Mô tả quyền hạn quản lý hành chính..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPositionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Chức Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: THÊM CẤP BẬC G-SERIES MỚI (GRADE LEVEL) */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-50 text-slate-900 border-b border-emerald-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Cấp Bậc (Grade Matrix) Mới</h3>
                  <p className="text-[11px] text-emerald-700">Thang ngạch bậc G1, G2, G3, G4, G5, G6...</p>
                </div>
              </div>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGradeSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Cấp Bậc (Grade Code) *:</label>
                  <input
                    type="text"
                    required
                    value={newGrCode}
                    onChange={(e) => setNewGrCode(e.target.value)}
                    placeholder="VD: G1, G2, G3, G7..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Gọi Ngạch Bậc *:</label>
                  <input
                    type="text"
                    required
                    value={newGrName}
                    onChange={(e) => setNewGrName(e.target.value)}
                    placeholder="VD: G7 - Chuyên Gia Cao Cấp..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Lương Sàn (Sàn VNĐ):</label>
                  <input
                    type="number"
                    value={newGrMinSal}
                    onChange={(e) => setNewGrMinSal(Number(e.target.value))}
                    step={500000}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Lương Trần (Trần VNĐ):</label>
                  <input
                    type="number"
                    value={newGrMaxSal}
                    onChange={(e) => setNewGrMaxSal(Number(e.target.value))}
                    step={500000}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Năng Lực Năng Định:</label>
                <textarea
                  rows={2}
                  value={newGrDesc}
                  onChange={(e) => setNewGrDesc(e.target.value)}
                  placeholder="Mô tả yêu cầu tiêu chuẩn kinh nghiệm & năng lực..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Cấp Bậc G-Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={selectedEmployee}
        mode={employeeModalMode}
      />

      <ContractPdfModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        employee={contractEmployee}
        onUpdateR2Url={handleUpdateR2Url}
      />
    </div>
  );
}
