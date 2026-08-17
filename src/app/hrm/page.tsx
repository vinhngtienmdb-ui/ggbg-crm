'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  Users,
  FileText,
  Building2,
  Plus,
  Search,
  Download,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Edit3,
  User,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert,
  FileCheck,
  Award,
  Trash2,
  Wallet,
  Mail,
  CheckSquare,
  Square,
  UserCheck,
} from 'lucide-react';
import { EmployeeProfile } from '@/types';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  changeEmployeeStatus,
  getOrgChartTree,
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';
import {
  ModuleBanner,
  ModuleLayoutWithRail,
  ViewModeSwitcher,
  ViewMode,
} from '@/components/ui';
import dynamic from 'next/dynamic';

// Dynamic loaded components
const EmployeeModal = dynamic(() => import('@/components/hrm/EmployeeModal'), { ssr: false });
const ContractPdfModal = dynamic(() => import('@/components/hrm/ContractPdfModal'), { ssr: false });
const OrgChartTree = dynamic(() => import('@/components/hrm/OrgChartTree'), { ssr: false });
const HrmDashboard = dynamic(() => import('@/components/hrm/HrmDashboard'), { ssr: false });
const LaborBook = dynamic(() => import('@/components/hrm/LaborBook'), { ssr: false });
const VietnamEmployeeDistributionMap = dynamic(() => import('@/components/hrm/VietnamEmployeeDistributionMap'), { ssr: false });

const RecruitmentPipelineView = dynamic(() => import('@/components/hrm/RecruitmentPipelineView'), { ssr: false });
const DocumentGeneratorModal = dynamic(() => import('@/components/hrm/DocumentGeneratorModal'), { ssr: false });
const CompensationHistoryModal = dynamic(() => import('@/components/hrm/CompensationHistoryModal'), { ssr: false });
const SocialInsuranceTrackingView = dynamic(() => import('@/components/hrm/SocialInsuranceTrackingView'), { ssr: false });
const ShiftScheduleRoster = dynamic(() => import('@/components/hrm/ShiftScheduleRoster'), { ssr: false });
const EmailAutomationSettingsModal = dynamic(() => import('@/components/hrm/EmailAutomationSettingsModal'), { ssr: false });
import ColumnVisibilityPopover, { DEFAULT_VISIBLE_COLUMNS } from '@/components/hrm/ColumnVisibilityPopover';

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

const INITIAL_ONBOARDING: OnboardingTask[] = [
  { id: 'onb_1', employee_name: 'Trần Văn Hoàng', position: 'Trưởng Nhóm Sale', department: 'Phòng Kinh Doanh 1', joined_date: '2026-08-01', equipment_delivered: true, crm_account_created: true, training_completed: true },
  { id: 'onb_2', employee_name: 'Lê Thị Mai', position: 'Chuyên Viên Sale', department: 'Phòng Kinh Doanh 2', joined_date: '2026-08-10', equipment_delivered: true, crm_account_created: true, training_completed: false },
  { id: 'onb_3', employee_name: 'Vũ Minh Khôi', position: 'Chuyên Viên Marketing Ads', department: 'Phòng Marketing', joined_date: '2026-08-15', equipment_delivered: true, crm_account_created: false, training_completed: false },
];

type HRMTabType =
  | 'DASHBOARD'
  | 'PROFILE'
  | 'RECRUITMENT'
  | 'DOCUMENTS'
  | 'BHXH'
  | 'COMPENSATION'
  | 'ONBOARDING'
  | 'SHIFTS'
  | 'LABOR_BOOK'
  | 'ORG_GIS';

function HRMContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get('tab');

  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => getEmployees());
  const [onboardingList, setOnboardingList] = useState<OnboardingTask[]>(INITIAL_ONBOARDING);
  const [activeTab, setActiveTab] = useState<HRMTabType>('DASHBOARD');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // CUSTOMIZABLE COLUMN VISIBILITY STATE (PERSISTED TO LOCALSTORAGE)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ggbg_hrm_visible_columns');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_VISIBLE_COLUMNS;
  });

  const handleColumnsChange = (newCols: string[]) => {
    setVisibleColumns(newCols);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ggbg_hrm_visible_columns', JSON.stringify(newCols));
    }
  };

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractEmployee, setContractEmployee] = useState<EmployeeProfile | null>(null);

  const [isDocGeneratorOpen, setIsDocGeneratorOpen] = useState(false);
  const [isCompensationHistoryOpen, setIsCompensationHistoryOpen] = useState(false);
  const [isEmailAutomationOpen, setIsEmailAutomationOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTabParam === 'recruitment') {
      setActiveTab('RECRUITMENT');
    } else if (initialTabParam === 'bhxh') {
      setActiveTab('BHXH');
    } else if (initialTabParam === 'shifts') {
      setActiveTab('SHIFTS');
    } else if (initialTabParam === 'documents') {
      setActiveTab('DOCUMENTS');
    }
  }, [initialTabParam]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const reloadEmployees = () => {
    setEmployees([...getEmployees()]);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
    const matchGrade =
      selectedGrade === 'ALL' ||
      emp.salary_grade_id === selectedGrade ||
      emp.salary_grade === selectedGrade;
    return matchSearch && matchDept && matchStatus && matchGrade;
  });

  const handleOpenCreateModal = () => {
    setSelectedEmployee(null);
    setEmployeeModalMode('create');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditModal = (emp: EmployeeProfile) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode('edit');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenViewModal = (emp: EmployeeProfile) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode('view');
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (empData: Partial<EmployeeProfile>) => {
    if (employeeModalMode === 'create') {
      const created = createEmployee(empData as any);
      showToast(`Đã tạo mới nhân sự: ${created.full_name} (${created.employee_code})`);
    } else if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, empData);
      showToast(`Đã cập nhật hồ sơ: ${empData.full_name || selectedEmployee.full_name}`);
    }
    reloadEmployees();
    setIsEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (empId: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn chuyển trạng thái nhân sự "${name}" sang đã nghỉ việc?`)) {
      changeEmployeeStatus(empId, 'Resigned');
      showToast(`Đã chuyển trạng thái nhân sự ${name} sang Đã nghỉ việc (Resigned)`);
      reloadEmployees();
    }
  };

  const toggleOnboardingTask = (taskId: string, field: 'equipment_delivered' | 'crm_account_created' | 'training_completed') => {
    setOnboardingList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, [field]: !t[field] } : t))
    );
    showToast('Đã cập nhật tiến độ checklist nhận việc Onboarding!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER - DASHBOARD STANDARD */}
      <ModuleBanner
        badge={{
          label: 'Hệ Thống Quản Trị Nhân Sự 3P & Cơ Cấu Tổ Chức',
          icon: Briefcase,
          variant: 'purple',
        }}
        title="Quản Trị Nhân Sự & Phát Triển Nguồn Nhân Lực"
        subtitle="Quản lý hồ sơ 360°, tuyển dụng, onboarding, chấm công, BHXH, sổ lao động và cấu hình chức danh cấp bậc"
        kpis={[
          { label: 'Quy Mô Nhân Sự', value: `${employees.length} Nhân Sự`, subtext: 'Chính thức: 94%' },
          { label: 'Đang Thử Việc', value: `${employees.filter(e => e.status === 'Probation').length} Nhân Sự`, subtext: 'Kỳ 60 ngày' },
          { label: 'Đang Hoạt Động', value: `${employees.filter(e => e.status === 'Active').length} Active`, subtext: 'Đầy đủ hồ sơ' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEmailAutomationOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Mẫu Email</span>
            </button>
            <button
              onClick={() => setIsCompensationHistoryOpen(true)}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Lịch Sử Lương</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Nhân Sự</span>
            </button>
          </div>
        }
      />

      {/* MULTI-FUNCTION VERTICAL RAIL (THAY THẾ TAB NGANG DÀN TRẢI) */}
      <ModuleLayoutWithRail
        railTitle="Phân Hệ Nghiệp Vụ HRM"
        railSubtitle="10 chuyên mục nghiệp vụ nhân sự"
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as HRMTabType)}
        sections={[
          {
            title: 'I. Hồ Sơ & Tổ Chức',
            items: [
              { id: 'DASHBOARD', label: '1. Tổng Quan HRM', icon: Sparkles, badge: 'BI', badgeVariant: 'blue' },
              { id: 'PROFILE', label: '2. Hồ Sơ Nhân Sự 360°', icon: User, badge: employees.length, badgeVariant: 'purple' },
              { id: 'ORG_GIS', label: '3. Sơ Đồ & Bản Đồ GIS', icon: Building2, badgeVariant: 'slate' },
              { id: 'LABOR_BOOK', label: '4. Sổ Quản Lý Lao Động', icon: FileCheck, badgeVariant: 'emerald' },
            ],
          },
          {
            title: 'II. Tuyển Dụng & Hội Nhập',
            items: [
              { id: 'RECRUITMENT', label: '5. Tuyển Dụng & Ứng Viên', icon: Users, badge: 'Phễu', badgeVariant: 'emerald' },
              { id: 'ONBOARDING', label: '6. Checklist Onboarding', icon: Award, badge: `${onboardingList.filter(t => t.equipment_delivered && t.crm_account_created && t.training_completed).length}/${onboardingList.length}`, badgeVariant: 'amber' },
              { id: 'DOCUMENTS', label: '7. Soạn Thảo & Trình Ký', icon: FileText, badgeVariant: 'blue' },
            ],
          },
          {
            title: 'III. Chế Độ & Chấm Công',
            items: [
              { id: 'SHIFTS', label: '8. Phân Ca & Chấm Công', icon: Clock, badgeVariant: 'amber' },
              { id: 'COMPENSATION', label: '9. Đãi Ngộ & Lương P1', icon: Wallet, badgeVariant: 'emerald' },
              { id: 'BHXH', label: '10. Biến Động BHXH & Y Tế', icon: ShieldAlert, badgeVariant: 'rose' },
            ],
          },
        ]}
      >
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && <HrmDashboard employees={employees} />}

        {/* TAB 2: STAFF PROFILES (TABLE & GRID) */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-4">
            {/* Filter Bar with Unified ViewModeSwitcher */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo họ tên, mã NV, email, chức danh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="ALL">Tất Cả Phòng Ban</option>
                  <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                  <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                  <option value="Phòng Marketing">Phòng Marketing</option>
                  <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                  <option value="Phòng CSKH">Phòng CSKH</option>
                  <option value="Phòng Nhân Sự (HR)">Phòng Nhân Sự (HR)</option>
                  <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                </select>

                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300"
                >
                  <option value="ALL">Tất Cả Ngạch Lương</option>
                  <option value="sg_g6">G6 - Lãnh đạo</option>
                  <option value="sg_g5">G5 - Quản lý</option>
                  <option value="sg_g4">G4 - Senior/Trưởng nhóm</option>
                  <option value="sg_g3">G3 - Chuyên viên</option>
                  <option value="sg_g2">G2 - Junior/Nhân viên</option>
                  <option value="sg_g1">G1 - Thực tập sinh</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="ALL">Tất Cả Trạng Thái</option>
                  <option value="Active">🟢 Đang làm việc (Active)</option>
                  <option value="Probation">🔵 Thử việc (Probation)</option>
                  <option value="Pending_Resign">🟠 Chờ bàn giao (Pending)</option>
                  <option value="Resigned">🔴 Đã nghỉ việc (Resigned)</option>
                </select>
              </div>

              {/* UNIFIED VIEW MODE SWITCHER & COLUMN VISIBILITY */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <ColumnVisibilityPopover
                  visibleKeys={visibleColumns}
                  onChange={handleColumnsChange}
                />

                <ViewModeSwitcher
                  currentMode={viewMode}
                  onChange={setViewMode}
                  listLabel="Bảng"
                  kanbanLabel="Thẻ (Grid)"
                />

                <span className="text-xs text-slate-500 font-medium shrink-0 tabular-nums">
                  Tổng: <strong className="text-slate-900 dark:text-white">{filteredEmployees.length}</strong> NV
                </span>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        {(visibleColumns.includes('employee_code') || visibleColumns.includes('full_name')) && (
                          <th className="p-3.5">Mã & Họ Tên</th>
                        )}
                        {visibleColumns.includes('gender') && <th className="p-3.5">Giới Tính</th>}
                        {visibleColumns.includes('date_of_birth') && <th className="p-3.5">Ngày Sinh</th>}
                        {visibleColumns.includes('position') && <th className="p-3.5">Chức Vụ</th>}
                        {visibleColumns.includes('job_title') && <th className="p-3.5">Chức Danh</th>}
                        {visibleColumns.includes('work_phone') && <th className="p-3.5">SĐT Công Việc</th>}
                        {visibleColumns.includes('work_email') && <th className="p-3.5">Email Công Việc</th>}
                        {visibleColumns.includes('department') && <th className="p-3.5">Phòng Ban</th>}
                        {visibleColumns.includes('team') && <th className="p-3.5">Đội / Nhóm</th>}
                        {visibleColumns.includes('status') && <th className="p-3.5">Trạng Thái</th>}
                        {visibleColumns.includes('joined_date') && <th className="p-3.5">Ngày Vào Làm</th>}
                        {visibleColumns.includes('salary_grade') && <th className="p-3.5">Ngạch & Bậc Lương</th>}
                        {visibleColumns.includes('base_salary') && <th className="p-3.5">Lương P1 (Thực Nhận)</th>}
                        {visibleColumns.includes('bank_account') && <th className="p-3.5">Tài Khoản Ngân Hàng</th>}
                        {visibleColumns.includes('allowances') && <th className="p-3.5">Phụ Cấp</th>}
                        {visibleColumns.includes('bhxh_status') && <th className="p-3.5">BHXH</th>}
                        {visibleColumns.includes('contract_number') && <th className="p-3.5">Số Hợp Đồng</th>}
                        <th className="p-3.5 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={visibleColumns.length + 1} className="p-8 text-center text-slate-400 italic">
                            Không tìm thấy nhân sự phù hợp với bộ lọc.
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            {/* Mã & Họ Tên */}
                            {(visibleColumns.includes('employee_code') || visibleColumns.includes('full_name')) && (
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center justify-center border border-purple-200 dark:border-purple-800 shrink-0">
                                    {emp.full_name.charAt(0)}
                                  </div>
                                  <div>
                                    {visibleColumns.includes('full_name') && (
                                      <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                                        {emp.full_name}
                                      </span>
                                    )}
                                    {visibleColumns.includes('employee_code') && (
                                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px] font-mono">
                                        {emp.employee_code}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            )}

                            {/* Giới tính */}
                            {visibleColumns.includes('gender') && (
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                                  emp.gender === 'Nữ'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                    : emp.gender === 'Nam'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                }`}>
                                  {emp.gender || 'Nam'}
                                </span>
                              </td>
                            )}

                            {/* Ngày sinh */}
                            {visibleColumns.includes('date_of_birth') && (
                              <td className="p-3.5 tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                                {emp.date_of_birth ? (
                                  emp.date_of_birth.includes('-')
                                    ? emp.date_of_birth.split('-').reverse().join('/')
                                    : emp.date_of_birth
                                ) : '12/04/1992'}
                              </td>
                            )}

                            {/* Chức vụ */}
                            {visibleColumns.includes('position') && (
                              <td className="p-3.5">
                                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                                  {emp.position}
                                </span>
                              </td>
                            )}

                            {/* Chức danh */}
                            {visibleColumns.includes('job_title') && (
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                                  {emp.job_title || emp.position}
                                </span>
                              </td>
                            )}

                            {/* SĐT Công Việc */}
                            {visibleColumns.includes('work_phone') && (
                              <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200 text-xs">
                                {emp.phone || '0912 345 678'}
                              </td>
                            )}

                            {/* Email Công Việc */}
                            {visibleColumns.includes('work_email') && (
                              <td className="p-3.5 font-mono text-blue-600 dark:text-blue-400 text-xs">
                                {emp.email || `${emp.employee_code.toLowerCase()}@ggbingo.vn`}
                              </td>
                            )}

                            {/* Phòng Ban */}
                            {visibleColumns.includes('department') && (
                              <td className="p-3.5 text-slate-700 dark:text-slate-300 text-xs">
                                {emp.department}
                              </td>
                            )}

                            {/* Đội / Nhóm */}
                            {visibleColumns.includes('team') && (
                              <td className="p-3.5 text-slate-600 dark:text-slate-400 text-xs">
                                {emp.team || 'Đội 1'}
                              </td>
                            )}

                            {/* Trạng Thái */}
                            {visibleColumns.includes('status') && (
                              <td className="p-3.5">
                                <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-medium border ${
                                  emp.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                    : emp.status === 'Probation'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                }`}>
                                  {emp.status}
                                </span>
                              </td>
                            )}

                            {/* Ngày vào làm */}
                            {visibleColumns.includes('joined_date') && (
                              <td className="p-3.5 tabular-nums text-slate-600 dark:text-slate-400">
                                {emp.joined_date}
                              </td>
                            )}

                            {/* Ngạch & Bậc Lương */}
                            {visibleColumns.includes('salary_grade') && (
                              <td className="p-3.5">
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-semibold border border-blue-200 dark:border-blue-800/60 inline-flex items-center gap-1">
                                  <span>{emp.salary_grade || 'G4'}</span>
                                  <span className="text-slate-400 font-normal">·</span>
                                  <span>Bậc {emp.salary_step_number || 1}</span>
                                </span>
                              </td>
                            )}

                            {/* Lương P1 */}
                            {visibleColumns.includes('base_salary') && (
                              <td className="p-3.5 tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(emp.base_salary || 15000000)}
                              </td>
                            )}

                            {/* Tài Khoản Ngân Hàng */}
                            {visibleColumns.includes('bank_account') && (
                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900 dark:text-white text-xs">{emp.bank_name || 'Techcombank'}</span>
                                    <span className="text-[10px] text-slate-400">({emp.bank_branch || 'CN Hà Nội'})</span>
                                  </div>
                                  <div className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold tabular-nums">
                                    STK: {emp.bank_account || '0988888888'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 uppercase font-medium">
                                    Chủ TK: {emp.bank_account_holder || emp.full_name.toUpperCase()}
                                  </div>
                                </div>
                              </td>
                            )}

                            {/* Phụ Cấp */}
                            {visibleColumns.includes('allowances') && (
                              <td className="p-3.5">
                                {emp.allowances && emp.allowances.length > 0 ? (
                                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                                    {formatCurrency(emp.allowances.reduce((s, a) => s + a.amount, 0))}
                                    <span className="text-[10px] text-slate-400 font-normal ml-1">({emp.allowances.length} khoản)</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">Chưa thiết lập</span>
                                )}
                              </td>
                            )}

                            {/* BHXH */}
                            {visibleColumns.includes('bhxh_status') && (
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 rounded text-[10px] font-medium border border-purple-200 dark:border-purple-800">
                                  {emp.bhxh_status || 'Đang tham gia'}
                                </span>
                              </td>
                            )}

                            {/* Số Hợp Đồng */}
                            {visibleColumns.includes('contract_number') && (
                              <td className="p-3.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                                {emp.contract_number}
                              </td>
                            )}

                            {/* Thao Tác */}
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenViewModal(emp)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                                  title="Xem Hồ Sơ 360°"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(emp)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
                                  title="Chỉnh Sửa Hồ Sơ & Lương"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setContractEmployee(emp);
                                    setIsContractModalOpen(true);
                                  }}
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                                  title="Xem Hợp Đồng Lao Động"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id, emp.full_name)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                                  title="Lưu Trữ / Nghỉ Việc"
                                >
                                  <Trash2 className="w-4 h-4" />
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
            ) : (
              /* GRID CARD VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-sm flex items-center justify-center border border-purple-200 dark:border-purple-800 shrink-0">
                          {emp.full_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{emp.full_name}</h4>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-medium">{emp.employee_code}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded text-[10px] font-medium">
                        {emp.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{emp.position}</p>
                      <p className="text-slate-400">{emp.department}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px]">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded font-semibold border border-blue-200/60 dark:border-blue-900">
                          {emp.salary_grade || 'G4'} · Bậc {emp.salary_step_number || 1}
                        </span>
                        <span className="tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                          {formatCurrency(emp.base_salary || 15000000)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenViewModal(emp)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[11px] font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem 360°</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                          title="Sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id, emp.full_name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECRUITMENT PIPELINE */}
        {activeTab === 'RECRUITMENT' && <RecruitmentPipelineView onCandidateConverted={reloadEmployees} />}

        {/* TAB 4: DOCUMENT GENERATOR (EMBEDDED VIEW) */}
        {activeTab === 'DOCUMENTS' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Hệ Thống Soạn Thảo Văn Bản & Trình Ký Số Tự Động
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trích xuất tự động dữ liệu từ HRM, tự động lập HĐLĐ, Quyết định Bổ nhiệm, Nâng lương, Khen thưởng, Kỷ luật và gửi Email
                </p>
              </div>
              <button
                onClick={() => setIsDocGeneratorOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Mở Trình Soạn Thảo Văn Bản</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL INSURANCE TRACKING */}
        {activeTab === 'BHXH' && <SocialInsuranceTrackingView />}

        {/* TAB 6: COMPENSATION & ALLOWANCES */}
        {activeTab === 'COMPENSATION' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Quản Trị Lương Đa Tầng & Lịch Sử Biến Động Phụ Cấp
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Theo dõi toàn bộ lịch sử nâng lương, điều chỉnh phụ cấp chức vụ và quyết định phê duyệt của từng nhân sự
                </p>
              </div>
              <button
                onClick={() => setIsCompensationHistoryOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Xem & Tạo Điều Chỉnh Lương</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: ONBOARDING CHECKLIST */}
        {activeTab === 'ONBOARDING' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Quy Trình Onboarding & Bàn Giao Thiết Bị
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Checklist bàn giao máy tính Laptop, tạo tài khoản CRM nội bộ và đào tạo hội nhập
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {onboardingList.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{task.employee_name}</h4>
                    <p className="text-xs text-slate-500">{task.position} · {task.department} · Nhận việc: {task.joined_date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleOnboardingTask(task.id, 'equipment_delivered')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        task.equipment_delivered
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {task.equipment_delivered ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                      Bàn Giao Laptop & Thiết Bị
                    </button>
                    <button
                      onClick={() => toggleOnboardingTask(task.id, 'crm_account_created')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        task.crm_account_created
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {task.crm_account_created ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                      Cấp Tài Khoản CRM
                    </button>
                    <button
                      onClick={() => toggleOnboardingTask(task.id, 'training_completed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        task.training_completed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {task.training_completed ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                      Đào Tạo Hội Nhập
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SHIFT ROSTER & SCHEDULING */}
        {activeTab === 'SHIFTS' && <ShiftScheduleRoster />}

        {/* TAB 9: LABOR BOOK (NĐ 145) */}
        {activeTab === 'LABOR_BOOK' && <LaborBook employees={employees} />}

        {/* TAB 10: ORG CHART TREE & GIS MAP */}
        {activeTab === 'ORG_GIS' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Sơ Đồ Cây Phân Cấp Tổ Chức (Org Chart)
              </h3>
              <OrgChartTree rootData={getOrgChartTree()} />
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Bản Đồ Phân Bổ Nhân Lực 63 Tỉnh Thành
              </h3>
              <VietnamEmployeeDistributionMap employees={employees} />
            </div>
          </div>
        )}
      </ModuleLayoutWithRail>

      {/* MODALS */}
      {isEmployeeModalOpen && (
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          mode={employeeModalMode}
          initialData={selectedEmployee}
          onClose={() => setIsEmployeeModalOpen(false)}
          onSave={handleSaveEmployee}
        />
      )}

      {isContractModalOpen && contractEmployee && (
        <ContractPdfModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          employee={contractEmployee}
        />
      )}

      {isDocGeneratorOpen && (
        <DocumentGeneratorModal
          isOpen={isDocGeneratorOpen}
          onClose={() => setIsDocGeneratorOpen(false)}
        />
      )}

      {isCompensationHistoryOpen && (
        <CompensationHistoryModal
          isOpen={isCompensationHistoryOpen}
          onClose={() => setIsCompensationHistoryOpen(false)}
          employee={selectedEmployee}
        />
      )}

      {isEmailAutomationOpen && (
        <EmailAutomationSettingsModal
          isOpen={isEmailAutomationOpen}
          onClose={() => setIsEmailAutomationOpen(false)}
        />
      )}
    </div>
  );
}

export default function HRMPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs font-medium text-slate-400">Đang tải phân hệ Quản Trị Nhân Sự...</div>}>
      <HRMContent />
    </Suspense>
  );
}
