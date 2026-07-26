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
  Award
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

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'APPROVAL_PIPELINE' | 'RECRUITMENT' | 'CONTRACTS' | 'ONBOARDING' | 'ORG_CHART' | 'JOB_TITLES' | 'MAP'>('PROFILE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

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
          <span className="px-2.5 py-1 bg-success-bg text-success-fg border border-success-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🟢 Đang Làm Việc
          </span>
        );
      case 'Probation':
        return (
          <span className="px-2.5 py-1 bg-brand-300 text-brand-800 border border-brand-100 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🔵 Thử Việc
          </span>
        );
      case 'Pending_Resign':
        return (
          <span className="px-2.5 py-1 bg-warn-bg text-warn-fg border border-gold-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit animate-pulse">
            🟠 Chờ Nghỉ Việc
          </span>
        );
      case 'Resigned':
        return (
          <span className="px-2.5 py-1 bg-danger-bg text-danger-fg border border-danger-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🔴 Đã Nghỉ Việc
          </span>
        );
      case 'Suspended':
        return (
          <span className="px-2.5 py-1 bg-plum-bg text-plum-fg border border-plum-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            🟣 Tạm Hoãn HĐ
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-line-soft text-ink-700 border border-line font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
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
          <span className="px-2.5 py-1 bg-warn-bg text-warn-fg border border-gold-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 text-warn-fg" /> 1️⃣ Chờ Quản Lý Trực Tiếp Duyệt
          </span>
        );
      case 'PENDING_SALES_DIRECTOR':
        return (
          <span className="px-2.5 py-1 bg-brand-300 text-brand-800 border border-brand-100 font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 text-brand-600" /> 2️⃣ Chờ GĐ Kinh Doanh Duyệt (Duyệt Cuối)
          </span>
        );
      case 'APPROVED_FOR_ONBOARDING':
        return (
          <span className="px-2.5 py-1 bg-success-bg text-success-fg border border-success-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5 text-success-fg" /> 3️⃣ Đã Duyệt ➔ Chuyển HR Onboard / Ký HĐ
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 bg-danger-bg text-danger-fg border border-danger-border font-bold rounded-xl text-[11px] flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5 text-danger-fg" /> ❌ Từ Chối Phê Duyệt
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-line-soft text-ink-700 font-bold rounded-xl text-[11px]">
            Đã Duyệt
          </span>
        );
    }
  };

  const renderRankBadge = (rank?: number) => {
    switch (rank) {
      case 1:
        return <span className="px-2 py-0.5 bg-danger-bg text-danger-fg border border-danger-border rounded text-[10px] font-black uppercase">Cấp 1: Ban Giám Đốc</span>;
      case 2:
        return <span className="px-2 py-0.5 bg-brand-300 text-brand-800 border border-brand-100 rounded text-[10px] font-bold uppercase">Cấp 2: Quản Lý & Lead</span>;
      case 3:
        return <span className="px-2 py-0.5 bg-success-bg text-success-fg border border-success-border rounded text-[10px] font-bold uppercase">Cấp 3: Chuyên Viên</span>;
      case 4:
      default:
        return <span className="px-2 py-0.5 bg-warn-bg text-warn-fg border border-gold-border rounded text-[10px] font-bold uppercase">Cấp 4: Thử Việc / Mới</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusToast && (
        <div className="p-4 rounded-2xl bg-plum-fg text-white font-bold text-xs shadow-cardLg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-plum-deep" />
            <span>{statusToast}</span>
          </div>
          <button onClick={() => setStatusToast('')} className="p-1 hover:bg-plum-fg rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">Quản Lý Nhân Sự</h1>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Quản lý hồ sơ nhân viên, quy trình phê duyệt và phễu tuyển dụng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (employees.length > 0) handleOpenContractModal(employees[0]);
            }}
            className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-brand-600" />
            Xem Hợp Đồng PDF
          </button>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setEmployeeModalMode('create');
              setIsEmployeeModalOpen(true);
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Nhân Sự Mới
          </button>
        </div>
      </div>

      {/* Navigation tabs — one chip style for all eight, per the redesign. */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: 'PROFILE', label: `👤 Hồ Sơ Nhân Sự (${filteredEmployees.length})` },
            { id: 'APPROVAL_PIPELINE', label: '⏳ Phê Duyệt Nhân Sự Mới', badge: pendingApprovalCount },
            { id: 'RECRUITMENT', label: `💼 Phễu Tuyển Dụng (${candidates.length})` },
            { id: 'CONTRACTS', label: '📄 Hợp Đồng & Lương' },
            { id: 'ONBOARDING', label: `📋 Checklist Onboarding (${onboardingList.length})` },
            { id: 'ORG_CHART', label: '🏛️ Sơ Đồ Tổ Chức' },
            { id: 'JOB_TITLES', label: `🏅 Chức Danh & Chức Vụ (${jobTitlesList.length})` },
            { id: 'MAP', label: '🗺️ Bản Đồ Phân Bổ Nhân Sự' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-[9px] border px-4 py-2 text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-line bg-white text-ink-700 hover:border-line-strong'
            }`}
          >
            {tab.label}
            {'badge' in tab && tab.badge > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === tab.id ? 'bg-white text-brand-600' : 'bg-danger-fg text-white'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: HỒ SƠ NHÂN SỰ ĐỊNH DANH CHI TIẾT */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên, Mã NV, CCCD, Phòng ban..."
                  className="w-full pl-9 pr-3 py-2 bg-surface-subtle border border-line rounded-xl text-xs"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-surface-subtle border border-line rounded-xl text-xs font-bold text-ink-900 focus:outline-none"
              >
                <option value="ALL">Tất Cả Trạng Thái</option>
                <option value="Active">🟢 Đang Làm Việc</option>
                <option value="Probation">🔵 Thử Việc</option>
                <option value="Pending_Resign">🟠 Chờ Nghỉ Việc</option>
                <option value="Resigned">🔴 Đã Nghỉ Việc</option>
                <option value="Suspended">🟣 Tạm Hoãn HĐ</option>
                <option value="Applicant">⚪ Ứng Viên Mới</option>
              </select>
            </div>

            <span className="text-xs font-bold text-ink-500">
              Đang hiển thị <strong className="text-ink-900">{filteredEmployees.length} Nhân Sự</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Mã NV & Họ Tên</th>
                  <th className="p-4">Phòng Ban & Vị Trí</th>
                  <th className="p-4">Trạng Thái Làm Việc</th>
                  <th className="p-4">Trạng Thái Phê Duyệt</th>
                  <th className="p-4">BHXH / BHYT</th>
                  <th className="p-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-ink-900 text-sm">{emp.full_name}</p>
                      <p className="font-mono text-brand-800 text-[11px]">{emp.employee_code}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-ink-900">{emp.department}</p>
                      <p className="text-ink-500">{emp.position}</p>
                    </td>

                    <td className="p-4">{renderEmployeeStatusBadge(emp.status)}</td>

                    <td className="p-4">{renderApprovalBadge(emp.approval_status)}</td>

                    <td className="p-4 font-mono">
                      <p className="text-success-fg font-bold text-[11px]">BHXH: {emp.social_insurance_code || '7910928374'}</p>
                      <p className="text-plum-fg text-[10px]">BHYT: {emp.health_insurance_code || 'DN4010928'}</p>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenStatusModal(emp)}
                          className="px-2.5 py-1.5 bg-plum-bg text-plum-fg font-bold rounded-xl text-[11px] hover:bg-plum-bg transition-all border border-plum-border"
                        >
                          Đổi Trạng Thái
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setEmployeeModalMode('view');
                            setIsEmployeeModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-brand-50 text-brand-800 font-bold rounded-xl text-[11px] hover:bg-brand-300 transition-all"
                        >
                          Chi Tiết
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setEmployeeModalMode('edit');
                            setIsEmployeeModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-warn-bg text-warn-fg font-bold rounded-xl text-[11px] hover:bg-warn-bg transition-all"
                        >
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUY TRÌNH PHÊ DUYỆT NHÂN SỰ MỚI (MULTI-STAGE APPROVAL PIPELINE) */}
      {activeTab === 'APPROVAL_PIPELINE' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-brand-50 via-white to-white p-6 rounded-2xl text-white shadow-md space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-warn-fg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-warn-fg" /> Sơ Đồ Quy Trình Phê Duyệt Nhân Sự Nối Tiếp (3 Cấp):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-xs font-bold text-warn-fg">Bước 1: Quản Lý Trực Tiếp</p>
                <p className="text-[11px] text-ink-400 mt-1">Trưởng nhóm (Leader) / Trưởng phòng trực tiếp kiểm tra hồ sơ & phê duyệt vòng sơ bộ.</p>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-xs font-bold text-brand-400">Bước 2: Giám Đốc Kinh Doanh (Duyệt Cuối)</p>
                <p className="text-[11px] text-ink-400 mt-1">Giám đốc Kinh doanh xem xét định mức định biên & phê duyệt quyết định tiếp nhận chính thức.</p>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <p className="text-xs font-bold text-success-dot">Bước 3: HR Onboarding & Ký HĐ</p>
                <p className="text-[11px] text-ink-400 mt-1">Bộ phận HR tiếp nhận nhân sự đã duyệt, lập Checklist Onboard (giao máy, cấp tài khoản, ký HĐLĐ).</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-ink-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-warn-fg" /> Danh Sách Hồ Sơ Đang Chờ Phê Duyệt ({pendingApprovalCount})
            </h3>

            <div className="space-y-4">
              {employees
                .filter((e) => e.approval_status === 'PENDING_DIRECT_MANAGER' || e.approval_status === 'PENDING_SALES_DIRECTOR')
                .map((emp) => (
                  <div key={emp.id} className="p-5 bg-surface-subtle border border-line rounded-2xl space-y-3 hover:border-brand-200 transition-all">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-line pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-ink-900">{emp.full_name}</h4>
                          <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">{emp.employee_code}</span>
                        </div>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {emp.position} • {emp.department} • Quản lý trực tiếp: <strong>{emp.direct_manager_name || 'Chưa chỉ định'}</strong>
                        </p>
                      </div>

                      {renderApprovalBadge(emp.approval_status)}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-line flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-semibold text-ink-500 mb-1">Ghi Chú Phê Duyệt / Lý Do:</label>
                        <input
                          type="text"
                          value={selectedApprovalEmp?.id === emp.id ? approvalNote : ''}
                          onChange={(e) => {
                            setSelectedApprovalEmp(emp);
                            setApprovalNote(e.target.value);
                          }}
                          placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..."
                          className="w-full px-3 py-1.5 border border-line rounded-xl text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        {emp.approval_status === 'PENDING_DIRECT_MANAGER' && (
                          <button
                            onClick={() => handleApproveDirectManager(emp)}
                            className="px-4 py-2 bg-warn-fg hover:bg-warn-fg text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> 1️⃣ Quản Lý Trực Tiếp Duyệt
                          </button>
                        )}

                        {emp.approval_status === 'PENDING_SALES_DIRECTOR' && (
                          <button
                            onClick={() => handleApproveSalesDirector(emp)}
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <ShieldCheck className="w-4 h-4" /> 2️⃣ Giám Đốc Kinh Doanh Duyệt (Duyệt Cuối)
                          </button>
                        )}

                        <button
                          onClick={() => handleRejectApproval(emp)}
                          className="px-3.5 py-2 bg-danger-bg hover:bg-danger-bg text-danger-fg font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
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

      {/* TAB 3: PHỄU TUYỂN DỤNG DUAL-VIEW (KANBAN VS LIST) KÈM GHI LOG 100% */}
      {activeTab === 'RECRUITMENT' && (
        <div className="space-y-4">
          {/* Controls & View Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-line shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider">Chế Độ Xem Phễu:</span>
              <div className="flex items-center gap-1 bg-line-soft p-1 rounded-xl">
                <button
                  onClick={() => setRecruitmentViewMode('KANBAN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    recruitmentViewMode === 'KANBAN' ? 'bg-brand-600 text-white ' : 'text-ink-500 hover:bg-line'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Dạng Thẻ Kanban (5 Bước)
                </button>
                <button
                  onClick={() => setRecruitmentViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    recruitmentViewMode === 'LIST' ? 'bg-brand-600 text-white ' : 'text-ink-500 hover:bg-line'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Dạng Bảng Danh Sách
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuditDrawerOpen(true)}
                className="px-3.5 py-2 bg-line-soft hover:bg-line text-ink-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <History className="w-4 h-4 text-brand-600" /> Nhật Ký Ghi Log Tuyển Dụng
              </button>
              <button
                onClick={() => setIsNewCandModalOpen(true)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
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
                  <div key={col.stageId} className="bg-line-soft p-3 rounded-2xl border border-line min-h-[550px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
                        <span className="font-bold text-ink-900 text-[11px]" style={{ color: col.color }}>{col.name}</span>
                        <span className="px-2 py-0.5 bg-line rounded-full font-black text-[10px] text-ink-700">{stageCands.length}</span>
                      </div>

                      <div className="space-y-3">
                        {stageCands.map((cand) => (
                          <div key={cand.id} className="bg-white p-3.5 rounded-2xl border border-line shadow-sm space-y-2 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-extrabold text-ink-900 text-xs">{cand.name}</p>
                                <p className="text-[10px] font-mono text-brand-600">{cand.candidate_code || 'UV-2026'}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setIsCandidateModalOpen(true);
                                }}
                                className="p-1 text-ink-400 hover:text-brand-600 rounded"
                                title="Xem Chi Tiết & Log"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-ink-500 font-semibold">{cand.position}</p>
                            <p className="text-[10px] text-ink-500">{cand.department}</p>
                            <p className="text-[10px] font-mono text-ink-400">{cand.phone} • {cand.email}</p>

                            {/* Quick Stage Transition Dropdown */}
                            <div className="pt-2 border-t border-line flex items-center justify-between">
                              <span className="text-[10px] font-bold text-ink-400">Đổi Bước:</span>
                              <select
                                value={cand.stage}
                                onChange={(e) => handleUpdateCandidateStage(cand.id, e.target.value as RecruitmentStage)}
                                className="px-2 py-1 bg-surface-subtle border border-line rounded-lg text-[10px] font-bold text-ink-900 focus:outline-none"
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
            <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Mã UV & Họ Tên</th>
                    <th className="p-4">Vị Trí & Phòng Ban</th>
                    <th className="p-4">SĐT & Email</th>
                    <th className="p-4">Lương Kỳ Vọng</th>
                    <th className="p-4">Trạng Thái Phễu</th>
                    <th className="p-4">Nhật Ký Thao Tác (Logs)</th>
                    <th className="p-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-ink-900 text-sm">{cand.name}</p>
                        <p className="font-mono text-brand-800 text-[11px]">{cand.candidate_code || 'UV-2026'}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-ink-900">{cand.position}</p>
                        <p className="text-ink-500 text-[11px]">{cand.department}</p>
                      </td>

                      <td className="p-4 font-mono text-ink-700">
                        <p className="font-bold">{cand.phone}</p>
                        <p className="text-ink-400 text-[10px] font-sans">{cand.email}</p>
                      </td>

                      <td className="p-4 font-mono font-extrabold text-success-fg">
                        {(cand.salary_expectation || 15000000).toLocaleString('vi-VN')} ₫
                      </td>

                      <td className="p-4">
                        <select
                          value={cand.stage}
                          onChange={(e) => handleUpdateCandidateStage(cand.id, e.target.value as RecruitmentStage)}
                          className="px-2.5 py-1 bg-line-soft border border-line rounded-xl text-xs font-bold text-ink-900"
                        >
                          <option value="APPLIED">1. Ứng Tuyển Mới</option>
                          <option value="INTERVIEW">2. Phỏng Vấn</option>
                          <option value="OFFER">3. Đề Nghị HĐ (Offer)</option>
                          <option value="HIRED">4. Nhận Việc (Hired)</option>
                          <option value="REJECTED">5. Từ Chối / Loại</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-800 border border-brand-100 font-mono text-[10px] font-bold rounded">
                          {cand.audit_logs?.length || 0} Lần Ghi Log
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setIsCandidateModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-brand-50 text-brand-800 font-bold rounded-xl text-xs hover:bg-brand-300 transition-all flex items-center gap-1 mx-auto"
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
            <div className="p-4 bg-brand-50 text-brand-800 rounded-2xl border border-line">
              <p className="text-xs text-ink-400 font-bold uppercase">Hạ Tầng Lưu Trữ Hợp Đồng</p>
              <p className="text-sm font-bold text-success-dot mt-1 flex items-center gap-1">
                <Lock className="w-4 h-4" /> Đã Mã Hóa An Toàn Bảo Mật
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-line">
              <p className="text-xs text-ink-500 font-semibold">Tổng Hợp Đồng Đã Lưu</p>
              <p className="text-xl font-extrabold text-ink-900">{filteredEmployees.length} File PDF</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-line">
              <p className="text-xs text-ink-500 font-semibold">Tổng Quỹ Lương Cơ Bản</p>
              <p className="text-xl font-extrabold text-success-fg">185.000.000 ₫/tháng</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-line-soft border-b border-line font-bold text-ink-500">
                  <th className="p-4">Số Hợp Đồng</th>
                  <th className="p-4">Nhân Sự</th>
                  <th className="p-4">Loại HĐ</th>
                  <th className="p-4">Lương Cơ Bản</th>
                  <th className="p-4">File Chứng Từ</th>
                  <th className="p-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-subtle">
                    <td className="p-4 font-mono font-bold text-brand-800">{emp.contract_number}</td>
                    <td className="p-4 font-bold text-ink-900">{emp.full_name}</td>
                    <td className="p-4 font-semibold text-ink-700">{emp.contract_type || 'Chính thức'}</td>
                    <td className="p-4 font-mono font-extrabold text-success-fg">15.000.000 ₫</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-success-bg text-success-fg rounded font-bold text-[10px]">🔒 Đã Lưu</span></td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleOpenContractModal(emp)} className="px-3 py-1 bg-brand-600 text-white font-bold rounded-xl text-xs">
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
        <div className="bg-white rounded-2xl border border-line p-6 space-y-4">
          <h3 className="font-bold text-sm text-ink-900">Checklist Bàn Giao & Đào Tạo Nhân Sự Mới</h3>
          <div className="space-y-3">
            {onboardingList.map((item) => (
              <div key={item.id} className="p-4 bg-surface-subtle border border-line rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-ink-900 text-sm">{item.employee_name}</p>
                  <p className="text-ink-500">{item.position} • {item.department} (Ngày vào: {item.joined_date})</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'equipment_delivered')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.equipment_delivered ? 'bg-success-bg text-success-fg border border-success-border' : 'bg-line text-ink-500'
                    }`}
                  >
                    <Laptop className="w-4 h-4" /> {item.equipment_delivered ? '✓ Bàn Giao Thiết Bị' : 'Chưa Giao Thiết Bị'}
                  </button>

                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'crm_account_created')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.crm_account_created ? 'bg-brand-300 text-brand-800 border border-brand-100' : 'bg-line text-ink-500'
                    }`}
                  >
                    <Key className="w-4 h-4" /> {item.crm_account_created ? '✓ Cấp TK CRM' : 'Chưa Cấp TK CRM'}
                  </button>

                  <button
                    onClick={() => toggleOnboardingTask(item.id, 'training_completed')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      item.training_completed ? 'bg-plum-bg text-plum-fg border border-plum-border' : 'bg-line text-ink-500'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> {item.training_completed ? '✓ Hoàn Thành Đào Tạo' : 'Đang Đào Tạo'}
                  </button>

                  <button
                    onClick={() => handleSignContractAndActivate(item)}
                    className="px-3.5 py-1.5 bg-success-fg hover:bg-success-fg text-white font-bold rounded-xl text-xs shadow-md shadow-card/20 flex items-center gap-1.5 transition-all active:scale-95 ml-2"
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
          <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-6 rounded-3xl border border-plum-border/40 shadow-cardLg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-plum-fg/20 border border-plum-border/30 text-plum-deep flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                <Briefcase className="w-6 h-6 text-plum-deep" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">Quản Lý Chức Danh, Chức Vụ & Cấp Bậc (G1-G6)</h3>
                  <span className="px-2.5 py-0.5 bg-success-dot text-ink-900 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-subtle animate-ping"></span> Auto Synced
                  </span>
                </div>
                <p className="text-xs text-ink-400 mt-1 max-w-2xl leading-relaxed">
                  Phân biệt rõ <strong>Chức Vụ</strong> (Giám Đốc, Trưởng Phòng...), <strong>Chức Danh</strong> (GĐ Kinh Doanh, GĐ Thị Trường...) và <strong>Khung Cấp Bậc</strong> (G1 ➔ G6 tùy biến). Tự động đồng bộ 100% thời gian thực sang RBAC & System Users.
                </p>
              </div>
            </div>

            {/* Quick Create Buttons depending on SubTab */}
            {jobSubTab === 'TITLES' && (
              <button
                onClick={() => setIsJobTitleModalOpen(true)}
                className="px-4 py-2.5 bg-plum-fg hover:bg-plum-fg text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-card/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Chức Danh Mới
              </button>
            )}

            {jobSubTab === 'POSITIONS' && (
              <button
                onClick={() => setIsPositionModalOpen(true)}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Chức Vụ Mới
              </button>
            )}

            {jobSubTab === 'GRADES' && (
              <button
                onClick={() => setIsGradeModalOpen(true)}
                className="px-4 py-2.5 bg-success-fg hover:bg-success-fg text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-card/30 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tạo Cấp Bậc G-Series
              </button>
            )}
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-line w-fit text-xs font-extrabold">
            <button
              onClick={() => setJobSubTab('TITLES')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'TITLES' ? 'bg-plum-fg text-white shadow-sm' : 'text-ink-500 hover:bg-line-soft'
              }`}
            >
              🏅 1. Quản Lý Chức Danh ({jobTitlesList.length})
            </button>

            <button
              onClick={() => setJobSubTab('POSITIONS')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'POSITIONS' ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-500 hover:bg-line-soft'
              }`}
            >
              🏢 2. Quản Lý Chức Vụ ({positionsList.length})
            </button>

            <button
              onClick={() => setJobSubTab('GRADES')}
              className={`px-4 py-2 rounded-xl transition-all ${
                jobSubTab === 'GRADES' ? 'bg-success-fg text-white shadow-sm' : 'text-ink-500 hover:bg-line-soft'
              }`}
            >
              📊 3. Khung Cấp Bậc (G1 - G6) ({gradeLevelsList.length})
            </button>
          </div>

          {/* SUB-TAB 1: CHỨC DANH CHUYÊN MÔN (JOB TITLES) */}
          {jobSubTab === 'TITLES' && (
            <div className="bg-white rounded-3xl border border-line shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-ink-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-plum-fg" /> Danh Mục Chức Danh Chuyên Môn
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Ví dụ: Giám Đốc Kinh Doanh, Giám Đốc Thị Trường, Trưởng Phòng Kinh Doanh...
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    value={jobTitleSearchTerm}
                    onChange={(e) => setJobTitleSearchTerm(e.target.value)}
                    placeholder="Tìm theo mã, tên chức danh..."
                    className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-line rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-line-soft border-b border-line text-ink-700 font-extrabold uppercase tracking-wider">
                      <th className="p-3.5">Mã Chức Danh</th>
                      <th className="p-3.5">Tên Chức Danh Chuyên Môn</th>
                      <th className="p-3.5">Chức Vụ Tương Ứng</th>
                      <th className="p-3.5">Cấp Bậc Băng Ngạch</th>
                      <th className="p-3.5">Thuộc Phòng Ban</th>
                      <th className="p-3.5 text-center">Trạng Thái Đồng Bộ</th>
                      <th className="p-3.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
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
                        <tr key={jt.id} className="hover:bg-surface-subtle transition-colors">
                          <td className="p-3.5 font-mono font-bold text-plum-fg">{jt.code}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-ink-900">{jt.name}</p>
                            <p className="text-[11px] text-ink-500">{jt.description}</p>
                          </td>
                          <td className="p-3.5 font-bold text-brand-800">{jt.position_name || 'N/A'}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-success-bg text-success-fg font-mono font-bold rounded border border-success-border">
                              {jt.grade_code || 'G4'}
                            </span>
                          </td>
                          <td className="p-3.5 text-ink-700 font-medium">{jt.department}</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 bg-success-bg text-success-fg border border-success-border rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success-fg" /> Auto-Synced RBAC
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteJobTitleSubmit(jt.id, jt.name)}
                              className="px-3 py-1 bg-danger-bg hover:bg-danger-bg text-danger-fg font-bold rounded-lg transition-colors text-[11px]"
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
            <div className="bg-white rounded-3xl border border-line shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-ink-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-600" /> Danh Mục Chức Vụ Hành Chính / Quản Lý
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Ví dụ: Giám Đốc, Trưởng Phòng, Trưởng Nhóm, Chuyên Viên / Nhân Viên, Thử Việc...
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positionsList.map((pos) => (
                  <div key={pos.id} className="p-4 rounded-2xl bg-surface-subtle border border-line space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-brand-300 text-brand-800 font-mono text-[11px] font-bold rounded border border-brand-100">
                        {pos.code}
                      </span>
                      <button
                        onClick={() => handleDeletePositionSubmit(pos.id, pos.name)}
                        className="text-danger-fg hover:text-danger-fg text-[11px] font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                    <h5 className="font-extrabold text-sm text-ink-900">{pos.name}</h5>
                    <p className="text-xs text-ink-500 leading-relaxed">{pos.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: KHUNG CẤP BẬC G-SERIES (GRADE LEVELS) */}
          {jobSubTab === 'GRADES' && (
            <div className="bg-white rounded-3xl border border-line shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-ink-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-success-fg" /> Thang Cấp Bậc & Khung Băng Ngạch Năng Lực (G-Series)
                  </h4>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Tùy biến cấp bậc G1, G2, G3, G4, G5, G6... tương ứng với dải lương trần / sàn doanh nghiệp
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeLevelsList.map((gr) => (
                  <div key={gr.id} className="p-4 rounded-2xl bg-surface-subtle border border-line space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-success-fg text-white font-mono text-xs font-black rounded">
                        {gr.code}
                      </span>
                      <button
                        onClick={() => handleDeleteGradeSubmit(gr.id, gr.code)}
                        className="text-danger-fg hover:text-danger-fg text-[11px] font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                    <h5 className="font-extrabold text-xs text-ink-900">{gr.name}</h5>
                    <div className="p-2.5 bg-white rounded-xl border border-line text-xs font-mono font-bold text-ink-900">
                      <span>Dải Lương: </span>
                      <span className="text-success-fg">{gr.min_salary.toLocaleString('vi-VN')} ₫</span>
                      <span> - </span>
                      <span className="text-success-fg">{gr.max_salary.toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <p className="text-[11px] text-ink-500 leading-relaxed">{gr.description}</p>
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

      {/* MODAL 1: THÊM ỨNG VIÊN MỚI TRONG PHỄU TUYỂN DỤNG */}
      {isNewCandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-50 text-brand-800 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-base">Thêm Ứng Viên Tuyển Dụng Mới</h3>
              </div>
              <button onClick={() => setIsNewCandModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Họ Và Tên Ứng Viên *</label>
                <input
                  type="text"
                  value={newCandData.name || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, name: e.target.value })}
                  placeholder="Ví dụ: Đỗ Hoàng Long"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Số Điện Thoại *</label>
                <input
                  type="text"
                  value={newCandData.phone || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, phone: e.target.value })}
                  placeholder="0988 999 888"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Vị Trí Ứng Tuyển</label>
                <input
                  type="text"
                  value={newCandData.position || ''}
                  onChange={(e) => setNewCandData({ ...newCandData, position: e.target.value })}
                  placeholder="Chuyên Viên Sale Exec / Marketing"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Phòng Ban</label>
                <select
                  value={newCandData.department || 'Phòng Kinh Doanh 1'}
                  onChange={(e) => setNewCandData({ ...newCandData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs"
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
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-bold rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md">
                  Tạo Ứng Viên & Ghi Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM AUDIT LOGS CHI TIẾT THEO ỨNG VIÊN */}
      {isCandidateModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <History className="w-5 h-5 text-brand-400" /> Nhật Ký Ghi Log Thao Tác: {selectedCandidate.name}
                </h3>
                <p className="text-xs text-ink-400 font-mono mt-0.5">
                  {selectedCandidate.candidate_code} • {selectedCandidate.position} ({selectedCandidate.department})
                </p>
              </div>
              <button onClick={() => setIsCandidateModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="p-4 bg-surface-subtle rounded-2xl border border-line space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <p>SĐT: <strong className="font-mono text-ink-900">{selectedCandidate.phone}</strong></p>
                  <p>Email: <strong className="text-ink-900">{selectedCandidate.email}</strong></p>
                  <p>Trạng thái phễu: <strong className="text-brand-800 font-bold">{selectedCandidate.stage}</strong></p>
                  <p>Lương kỳ vọng: <strong className="text-success-fg font-bold font-mono">{(selectedCandidate.salary_expectation || 15000000).toLocaleString('vi-VN')} ₫</strong></p>
                </div>
              </div>

              {/* Timeline Logs */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-ink-700 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" /> Lịch Sử Ghi Log Thao Tác (Audit History):
                </h4>

                <div className="space-y-3 pl-4 border-l-2 border-brand-600">
                  {selectedCandidate.audit_logs?.map((log) => (
                    <div key={log.id} className="p-3 bg-brand-50/60 border border-brand-100 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-900">{log.actor_name}</span>
                        <span className="font-mono text-ink-400">{log.timestamp}</span>
                      </div>
                      <p className="text-ink-900 font-semibold">{log.note}</p>
                      {log.stage_from && log.stage_to && (
                        <p className="text-[10px] text-brand-800 font-mono">
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
        <div className="fixed inset-0 z-50 flex justify-end bg-white">
          <div className="bg-white w-full max-w-md h-full shadow-cardLg p-6 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-base text-ink-900 flex items-center gap-2">
                <History className="w-5 h-5 text-brand-600" /> Toàn Bộ Log Phễu Tuyển Dụng
              </h3>
              <button onClick={() => setIsAuditDrawerOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {candidates.flatMap((c) => c.audit_logs || []).map((log) => (
                <div key={log.id} className="p-3 bg-surface-subtle border border-line rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-ink-900">{log.candidate_name}</span>
                    <span className="font-mono text-ink-400 text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-ink-700">{log.note}</p>
                  <p className="text-[10px] text-brand-600 font-mono">Người thực hiện: {log.actor_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHUYỂN TRẠNG THÁI NHÂN SỰ */}
      {isStatusModalOpen && statusTargetEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-plum-fg/20 border border-plum-border/30 flex items-center justify-center text-plum-deep font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Chuyển Trạng Thái Nhân Sự</h3>
                  <p className="text-xs text-ink-400 font-mono">
                    {statusTargetEmp.full_name} ({statusTargetEmp.employee_code})
                  </p>
                </div>
              </div>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusChange} className="p-6 space-y-4">
              <div className="p-3 bg-surface-subtle border border-line rounded-xl text-xs flex items-center justify-between">
                <span className="font-bold text-ink-500">Trạng Thái Hiện Tại:</span>
                {renderEmployeeStatusBadge(statusTargetEmp.status)}
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5">Chọn Trạng Thái Mới *</label>
                <select
                  value={statusNewValue}
                  onChange={(e) => setStatusNewValue(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-surface-subtle border border-line rounded-xl text-xs font-bold text-ink-900 focus:ring-2 focus:ring-brand-600"
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
                <label className="block text-xs font-semibold text-ink-700 mb-1">Ghi Chú / Lý Do Chuyển Trạng Thái</label>
                <textarea
                  rows={3}
                  value={statusReasonNote}
                  onChange={(e) => setStatusReasonNote(e.target.value)}
                  placeholder="Nhập lý do (ví dụ: Đã nộp đơn xin nghỉ việc, Đạt thử việc ký HĐ chính thức, Hoàn tất ký HĐLĐ...)"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/20 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-plum-fg/20 border border-plum-border/30 rounded-xl text-plum-deep">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Chức Danh Chuyên Môn Mới</h3>
                  <p className="text-[11px] text-plum-deep">Ví dụ: Giám Đốc Kinh Doanh, Giám Đốc Thị Trường...</p>
                </div>
              </div>
              <button onClick={() => setIsJobTitleModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobTitleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Tên Chức Danh Chuyên Môn *:</label>
                <input
                  type="text"
                  required
                  value={newJtName}
                  onChange={(e) => setNewJtName(e.target.value)}
                  placeholder="VD: Giám Đốc Kinh Doanh, Trưởng Phòng HR..."
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Chức Vụ Hành Chính:</label>
                  <select
                    value={newJtPosName}
                    onChange={(e) => setNewJtPosName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-bold text-brand-800 focus:outline-none"
                  >
                    {positionsList.map((p) => (
                      <option key={p.id} value={p.name}>
                        🏢 {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Khung Cấp Bậc (Grade):</label>
                  <select
                    value={newJtGradeCode}
                    onChange={(e) => setNewJtGradeCode(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono font-bold text-success-fg focus:outline-none"
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
                <label className="block text-xs font-bold text-ink-700 mb-1">Mã Chức Danh (Code):</label>
                <input
                  type="text"
                  value={newJtCode}
                  onChange={(e) => setNewJtCode(e.target.value)}
                  placeholder="VD: DIR_SALES, MGR_HR... (Tự tạo nếu trống)"
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Thuộc Phòng Ban:</label>
                <select
                  value={newJtDept}
                  onChange={(e) => setNewJtDept(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
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
                <label className="block text-xs font-bold text-ink-700 mb-1">Mô Tả Trách Nhiệm:</label>
                <textarea
                  rows={2}
                  value={newJtDesc}
                  onChange={(e) => setNewJtDesc(e.target.value)}
                  placeholder="Mô tả phạm vi chiến lược / công việc chuyên môn..."
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-fg/20"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsJobTitleModalOpen(false)}
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-plum-fg hover:bg-plum-fg text-white font-extrabold rounded-xl text-xs shadow-md shadow-card/20 transition-all flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-500/20 border border-brand-200/30 rounded-xl text-brand-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Chức Vụ Quản Lý Mới</h3>
                  <p className="text-[11px] text-brand-400">Ví dụ: Giám Đốc, Trưởng Phòng, Trưởng Nhóm, Nhân Viên...</p>
                </div>
              </div>
              <button onClick={() => setIsPositionModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePositionSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Tên Chức Vụ Hành Chính *:</label>
                <input
                  type="text"
                  required
                  value={newPosName}
                  onChange={(e) => setNewPosName(e.target.value)}
                  placeholder="VD: Phó Giám Đốc, Trưởng Bộ Phận, Trợ Lý Executive..."
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Mã Chức Vụ (Code):</label>
                <input
                  type="text"
                  value={newPosCode}
                  onChange={(e) => setNewPosCode(e.target.value)}
                  placeholder="VD: POS_VP, POS_HEAD... (Tự tạo nếu trống)"
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Mô Tả Vai Trò:</label>
                <textarea
                  rows={2}
                  value={newPosDesc}
                  onChange={(e) => setNewPosDesc(e.target.value)}
                  placeholder="Mô tả quyền hạn quản lý hành chính..."
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPositionModalOpen(false)}
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-success-dot/20 border border-success-border/30 rounded-xl text-success-dot">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Khai Báo Cấp Bậc (Grade Matrix) Mới</h3>
                  <p className="text-[11px] text-success-dot">Thang ngạch bậc G1, G2, G3, G4, G5, G6...</p>
                </div>
              </div>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-ink-400 hover:text-brand-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGradeSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Mã Cấp Bậc (Grade Code) *:</label>
                  <input
                    type="text"
                    required
                    value={newGrCode}
                    onChange={(e) => setNewGrCode(e.target.value)}
                    placeholder="VD: G1, G2, G3, G7..."
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono font-bold text-success-fg focus:bg-white focus:outline-none focus:ring-2 focus:ring-success-fg/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Tên Gọi Ngạch Bậc *:</label>
                  <input
                    type="text"
                    required
                    value={newGrName}
                    onChange={(e) => setNewGrName(e.target.value)}
                    placeholder="VD: G7 - Chuyên Gia Cao Cấp..."
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-success-fg/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Mức Lương Sàn (Sàn VNĐ):</label>
                  <input
                    type="number"
                    value={newGrMinSal}
                    onChange={(e) => setNewGrMinSal(Number(e.target.value))}
                    step={500000}
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono text-ink-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Mức Lương Trần (Trần VNĐ):</label>
                  <input
                    type="number"
                    value={newGrMaxSal}
                    onChange={(e) => setNewGrMaxSal(Number(e.target.value))}
                    step={500000}
                    className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl font-mono text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Mô Tả Năng Lực Năng Định:</label>
                <textarea
                  rows={2}
                  value={newGrDesc}
                  onChange={(e) => setNewGrDesc(e.target.value)}
                  placeholder="Mô tả yêu cầu tiêu chuẩn kinh nghiệm & năng lực..."
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-success-fg/20"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-success-fg hover:bg-success-fg text-white font-extrabold rounded-xl text-xs shadow-md shadow-card/20 transition-all flex items-center gap-1.5"
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
