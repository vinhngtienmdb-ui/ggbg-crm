'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  Building2,
  Award,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  ShieldAlert,
  Percent,
  Check,
  X,
  FileSpreadsheet,
  FileCheck2,
  CalendarDays,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Target,
  Sliders,
  ShieldCheck,
  Globe,
  Lock
} from 'lucide-react';
import OrgChartTree from '@/components/hrm/OrgChartTree';
import {
  OrgNode,
  SalaryGradeScale,
  SalaryStepItem,
  AllowanceCatalogItem,
  TaxAndInsurancePolicyVersion,
  HolidayDefinition,
  WeekendPolicySettings,
  WorkShift,
  AttendanceSettings,
  FormulaWeights,
  EvaluationCriterion,
  HrmCustomFieldDefinition
} from '@/types';
import {
  getSalaryGrades,
  saveSalaryGrade,
  deleteSalaryGrade,
  getAllowanceCatalog,
  createAllowanceCatalogItem,
  updateAllowanceCatalogItem,
  deleteAllowanceCatalogItem,
  getTaxPolicies,
  saveTaxPolicy,
  deleteTaxPolicy,
  getHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  getWeekendPolicy,
  saveWeekendPolicy,
  getWorkShifts,
  createWorkShift,
  updateWorkShift,
  deleteWorkShift,
  getHrmCustomFields,
  saveHrmCustomField,
  deleteHrmCustomField
} from '@/lib/hrmStore';
import {
  getAttendanceSettings,
  saveAttendanceSettings,
  PAYROLL_UPDATED_EVENT
} from '@/lib/payrollStore';
import {
  getFormulaWeights,
  updateFormulaWeights,
  DEFAULT_HR_CRITERIA,
  PERFORMANCE_UPDATED_EVENT
} from '@/lib/performanceStore';
import { formatCurrency } from '@/lib/formatters';

// Mock Org Chart Tree Root Node
const MOCK_ORG_TREE: OrgNode = {
  id: 'org_root',
  name: 'Nguyễn Tiến Vinh',
  title: 'Tổng Giám Đốc (CEO / Founder)',
  role: 'Ban Giám Đốc',
  department: 'Ban Giám Đốc GGBG CRM',
  children: [
    {
      id: 'org_dir_sales',
      name: 'Đặng Tuấn Tú',
      title: 'Giám Đốc Kinh Doanh & Vận Hành',
      role: 'Giám Đốc Khối',
      department: 'Khối Kinh Doanh & TMĐT',
      children: [
        {
          id: 'org_mgr_kd1',
          name: 'Nguyễn Văn Minh',
          title: 'Trưởng Phòng Kinh Doanh 1',
          role: 'Trưởng Phòng',
          department: 'Phòng Kinh Doanh 1',
          children: [
            {
              id: 'org_tl_team1',
              name: 'Trần Văn Hoàng',
              title: 'Trưởng Nhóm Sale Team 1',
              role: 'Leader',
              department: 'Phòng Kinh Doanh 1',
              children: [
                {
                  id: 'org_sale_1',
                  name: 'Lê Văn An',
                  title: 'Chuyên Viên Tư Vấn Sale 1',
                  role: 'Nhân Viên',
                  department: 'Phòng Kinh Doanh 1',
                },
                {
                  id: 'org_sale_2',
                  name: 'Phạm Thị Bình',
                  title: 'Chuyên Viên Tư Vấn Sale 2',
                  role: 'Nhân Viên',
                  department: 'Phòng Kinh Doanh 1',
                }
              ]
            }
          ]
        },
        {
          id: 'org_mgr_cskh',
          name: 'Lê Thị Mai',
          title: 'Trưởng Phòng CSKH & Xử Lý Đơn',
          role: 'Trưởng Phòng',
          department: 'Phòng CSKH & Vận Hành',
          children: []
        }
      ]
    },
    {
      id: 'org_dir_hr',
      name: 'Đặng Kim Anh',
      title: 'Trưởng Phòng Nhân Sự & Tiền Lương (HRM)',
      role: 'Trưởng Phòng',
      department: 'Phòng Nhân Sự (HR)',
      children: []
    }
  ]
};

// Initial Job Titles
const INITIAL_JOB_TITLES = [
  { id: 'jt_1', code: 'EXEC_DIR', name: 'Giám Đốc Điều Hành (CEO)', department: 'Ban Giám Đốc', level: 'Level 6 (C-Level)', min_salary: 40000000, max_salary: 80000000, grade_code: 'G6' },
  { id: 'jt_2', code: 'SALES_DIR', name: 'Giám Đốc Khối Kinh Doanh', department: 'Khối Kinh Doanh', level: 'Level 5 (Director)', min_salary: 30000000, max_salary: 50000000, grade_code: 'G5' },
  { id: 'jt_3', code: 'MGR_SALES', name: 'Trưởng Phòng Kinh Doanh', department: 'Phòng Kinh Doanh', level: 'Level 4 (Manager)', min_salary: 18000000, max_salary: 30000000, grade_code: 'G4' },
  { id: 'jt_4', code: 'LEAD_SALES', name: 'Trưởng Nhóm Sale / Team Leader', department: 'Phòng Kinh Doanh', level: 'Level 3 (Leader)', min_salary: 14000000, max_salary: 22000000, grade_code: 'G3' },
  { id: 'jt_5', code: 'SPEC_SALES', name: 'Chuyên Viên Tư Vấn TMĐT', department: 'Phòng Kinh Doanh', level: 'Level 2 (Senior / Specialist)', min_salary: 9500000, max_salary: 16000000, grade_code: 'G2' },
  { id: 'jt_6', code: 'STAFF_CSKH', name: 'Chuyên Viên CSKH & Vận Hành', department: 'Phòng CSKH', level: 'Level 1 (Junior / Staff)', min_salary: 7500000, max_salary: 12000000, grade_code: 'G1' },
];

function HrmSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<
    | 'SALARY_GRADES'
    | 'ALLOWANCES'
    | 'TAX_POLICIES'
    | 'ORG_CHART'
    | 'JOB_TITLES'
    | 'TIMEKEEPING_SHIFTS'
    | 'HOLIDAYS_WEEKENDS'
    | 'PERFORMANCE_FORMULA'
    | 'CUSTOM_FIELDS'
  >('SALARY_GRADES');

  // Handle URL Query Params
  useEffect(() => {
    if (initialTab === 'TIMEKEEPING_SHIFTS' || initialTab === 'TIMEKEEPING' || initialTab === 'SHIFTS') {
      setActiveTab('TIMEKEEPING_SHIFTS');
    } else if (initialTab === 'ALLOWANCES') {
      setActiveTab('ALLOWANCES');
    } else if (initialTab === 'TAX_POLICIES') {
      setActiveTab('TAX_POLICIES');
    } else if (initialTab === 'HOLIDAYS_WEEKENDS' || initialTab === 'HOLIDAYS') {
      setActiveTab('HOLIDAYS_WEEKENDS');
    } else if (initialTab === 'PERFORMANCE_FORMULA' || initialTab === 'FORMULA') {
      setActiveTab('PERFORMANCE_FORMULA');
    } else if (initialTab === 'ORG_CHART') {
      setActiveTab('ORG_CHART');
    } else if (initialTab === 'JOB_TITLES') {
      setActiveTab('JOB_TITLES');
    } else if (initialTab === 'SALARY_GRADES') {
      setActiveTab('SALARY_GRADES');
    } else if (initialTab === 'CUSTOM_FIELDS') {
      setActiveTab('CUSTOM_FIELDS');
    }
  }, [initialTab]);

  // Tab 1: Salary Grades State
  const [salaryGrades, setSalaryGrades] = useState<SalaryGradeScale[]>(() => getSalaryGrades());
  const [selectedGrade, setSelectedGrade] = useState<SalaryGradeScale>(salaryGrades[0]);

  // Tab 2: Allowances State
  const [allowanceCatalog, setAllowanceCatalog] = useState<AllowanceCatalogItem[]>(() => getAllowanceCatalog());
  const [editingAllowance, setEditingAllowance] = useState<AllowanceCatalogItem | null>(null);
  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);

  // Tab 3: Tax Policies State
  const [taxPolicies, setTaxPolicies] = useState<TaxAndInsurancePolicyVersion[]>(() => getTaxPolicies());
  const [editingPolicy, setEditingPolicy] = useState<TaxAndInsurancePolicyVersion | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Tab 5: Job Titles State
  const [jobTitles, setJobTitles] = useState(INITIAL_JOB_TITLES);

  // Tab 6: Shifts & Timekeeping Settings State
  const [workShifts, setWorkShifts] = useState<WorkShift[]>(() => getWorkShifts());
  const [attSettings, setAttSettings] = useState<AttendanceSettings>(() => getAttendanceSettings());
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  // Tab 7: Holidays & Weekend Policies State
  const [holidays, setHolidays] = useState<HolidayDefinition[]>(() => getHolidays());
  const [weekendPolicy, setWeekendPolicy] = useState<WeekendPolicySettings>(() => getWeekendPolicy());
  const [editingHoliday, setEditingHoliday] = useState<HolidayDefinition | null>(null);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  // Tab 8: Performance Formula Weights State
  const [formulaWeights, setFormulaWeights] = useState<FormulaWeights>(() => getFormulaWeights());

  // Tab 9: Custom Fields State
  const [customFields, setCustomFields] = useState<HrmCustomFieldDefinition[]>(() => getHrmCustomFields());
  const [editingCustomField, setEditingCustomField] = useState<HrmCustomFieldDefinition | null>(null);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [selectedTargetTabFilter, setSelectedTargetTabFilter] = useState<string>('ALL');

  const handleSaveCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomField) return;
    saveHrmCustomField(editingCustomField);
    setCustomFields([...getHrmCustomFields()]);
    setIsCustomFieldModalOpen(false);
    showToast(`💾 Đã lưu trường tùy biến: ${editingCustomField.label}`);
  };

  const handleDeleteCustomField = (id: string, label: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa trường tùy biến "${label}"?`)) {
      deleteHrmCustomField(id);
      setCustomFields([...getHrmCustomFields()]);
      showToast(`Đã xóa trường tùy biến: ${label}`);
    }
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reload data
  const reloadData = () => {
    setSalaryGrades(getSalaryGrades());
    setAllowanceCatalog(getAllowanceCatalog());
    setTaxPolicies(getTaxPolicies());
    setWorkShifts(getWorkShifts());
    setAttSettings(getAttendanceSettings());
    setHolidays(getHolidays());
    setWeekendPolicy(getWeekendPolicy());
    setFormulaWeights(getFormulaWeights());
  };

  useEffect(() => {
    window.addEventListener(PAYROLL_UPDATED_EVENT, reloadData);
    window.addEventListener(PERFORMANCE_UPDATED_EVENT, reloadData);
    return () => {
      window.removeEventListener(PAYROLL_UPDATED_EVENT, reloadData);
      window.removeEventListener(PERFORMANCE_UPDATED_EVENT, reloadData);
    };
  }, []);

  // Handlers for Salary Grades
  const handleUpdateStep = (stepNumber: number, field: keyof SalaryStepItem, value: any) => {
    if (!selectedGrade) return;
    const updatedSteps = selectedGrade.steps.map((s) => {
      if (s.step_number === stepNumber) {
        return { ...s, [field]: value };
      }
      return s;
    });

    const updatedGrade: SalaryGradeScale = {
      ...selectedGrade,
      steps: updatedSteps,
    };

    saveSalaryGrade(updatedGrade);
    setSelectedGrade(updatedGrade);
    setSalaryGrades(getSalaryGrades());
    showToast(`Đã lưu Bậc ${stepNumber} cho Ngạch ${selectedGrade.code}`);
  };

  // Handlers for Allowances
  const handleSaveAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAllowance) return;
    if (editingAllowance.id) {
      updateAllowanceCatalogItem(editingAllowance.id, editingAllowance);
      showToast(`Đã cập nhật phụ cấp: ${editingAllowance.name}`);
    } else {
      createAllowanceCatalogItem(editingAllowance);
      showToast(`Đã thêm mới phụ cấp: ${editingAllowance.name}`);
    }
    setAllowanceCatalog(getAllowanceCatalog());
    setIsAllowanceModalOpen(false);
  };

  const handleDeleteAllowance = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa loại phụ cấp "${name}"?`)) {
      deleteAllowanceCatalogItem(id);
      setAllowanceCatalog(getAllowanceCatalog());
      showToast(`Đã xóa phụ cấp: ${name}`);
    }
  };

  // Handlers for Tax Policies
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;
    saveTaxPolicy(editingPolicy);
    setTaxPolicies(getTaxPolicies());
    setIsPolicyModalOpen(false);
    showToast(`Đã lưu phiên bản chính sách: ${editingPolicy.version_name}`);
  };

  // Handlers for Work Shifts
  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    if (editingShift.id && editingShift.id.startsWith('shift_')) {
      updateWorkShift(editingShift.id, editingShift);
      showToast(`Đã cập nhật ca làm việc: ${editingShift.name}`);
    } else {
      createWorkShift(editingShift);
      showToast(`Đã thêm mới ca làm việc: ${editingShift.name}`);
    }
    setWorkShifts([...getWorkShifts()]);
    setIsShiftModalOpen(false);
  };

  const handleDeleteShift = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa ca làm việc "${name}"?`)) {
      deleteWorkShift(id);
      setWorkShifts([...getWorkShifts()]);
      showToast(`Đã xóa ca: ${name}`);
    }
  };

  // Handlers for Timekeeping & Scheduled Lock Settings
  const handleSaveTimekeepingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAttendanceSettings(attSettings);
    showToast('💾 Đã lưu cấu hình cài đặt chấm công & lịch tự động chốt công!');
  };

  // Handlers for Holidays & Weekend Policy
  const handleSaveWeekendPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    saveWeekendPolicy(weekendPolicy);
    showToast('💾 Đã lưu chính sách làm việc ngày nghỉ tuần & GPS trụ sở!');
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;
    if (editingHoliday.id && editingHoliday.id.startsWith('hol_')) {
      updateHoliday(editingHoliday.id, editingHoliday);
      showToast(`Đã cập nhật ngày lễ: ${editingHoliday.name}`);
    } else {
      addHoliday(editingHoliday);
      showToast(`Đã thêm ngày nghỉ lễ: ${editingHoliday.name}`);
    }
    setHolidays(getHolidays());
    setIsHolidayModalOpen(false);
  };

  const handleDeleteHoliday = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa ngày nghỉ lễ "${name}"?`)) {
      deleteHoliday(id);
      setHolidays(getHolidays());
      showToast(`Đã xóa ngày lễ: ${name}`);
    }
  };

  // Handlers for Performance Formula Weights
  const handleSaveFormulaWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      (formulaWeights.kpi_weight || 0) +
      (formulaWeights.compliance_weight || 0) +
      (formulaWeights.teamwork_weight || 0) +
      (formulaWeights.csat_weight || 0) +
      (formulaWeights.behavior_weight || 0);

    if (total !== 100) {
      alert(`Tổng tỷ trọng các tiêu chí phải bằng 100% (Hiện tại: ${total}%). Vui lòng điều chỉnh lại.`);
      return;
    }

    updateFormulaWeights(formulaWeights);
    showToast('💾 Đã lưu cấu hình trọng số công thức hiệu suất 3P & Ma trận thưởng!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900">
            <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Trung Tâm Cấu Hình Nhân Sự & Hiệu Suất Tập Trung GGBingo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Cấu Hình Nhân Sự, Ca Chấm Công & Tiền Lương 3P
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-2xl leading-relaxed">
            Hệ thống quản trị tập trung ngạch bậc lương, phụ cấp định mức, chính sách thuế/BHXH, ca kíp, lịch chốt công và công thức hiệu suất 3P.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Dữ liệu đã được đồng bộ tự động với HRM, Chấm Công & Bảng Lương 3P')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Đồng Bộ Hệ Thống</span>
          </button>
        </div>
      </div>

      {/* 8 Comprehensive Tabs Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-medium scrollbar-none touch-scroll">
        <button
          onClick={() => setActiveTab('SALARY_GRADES')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'SALARY_GRADES'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span>1. Ngạch & Bậc Lương</span>
        </button>
        <button
          onClick={() => setActiveTab('ALLOWANCES')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ALLOWANCES'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-purple-600" />
          <span>2. Phụ Cấp & Định Mức</span>
        </button>
        <button
          onClick={() => setActiveTab('TAX_POLICIES')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'TAX_POLICIES'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Thuế TNCN & BHXH</span>
        </button>
        <button
          onClick={() => setActiveTab('ORG_CHART')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ORG_CHART'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>4. Sơ Đồ Tổ Chức</span>
        </button>
        <button
          onClick={() => setActiveTab('JOB_TITLES')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'JOB_TITLES'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-amber-600" />
          <span>5. Chức Danh & Khung Lương</span>
        </button>
        <button
          onClick={() => setActiveTab('TIMEKEEPING_SHIFTS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'TIMEKEEPING_SHIFTS'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>6. Ca Làm Việc & Lịch Chốt Công</span>
        </button>
        <button
          onClick={() => setActiveTab('HOLIDAYS_WEEKENDS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'HOLIDAYS_WEEKENDS'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-600" />
          <span>7. Ngày Nghỉ Tuần, Lễ Tết & GPS</span>
        </button>
        <button
          onClick={() => setActiveTab('PERFORMANCE_FORMULA')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'PERFORMANCE_FORMULA'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span>8. Trọng Số Hiệu Suất 3P & Tiêu Chí</span>
        </button>
        <button
          onClick={() => setActiveTab('CUSTOM_FIELDS')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'CUSTOM_FIELDS'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>9. Trường Tùy Biến Hồ Sơ</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NGẠCH & BẬC LƯƠNG */}
      {/* ========================================================================= */}
      {activeTab === 'SALARY_GRADES' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Grade Picker */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                  Danh Sách Ngạch Lương (G1 - G6)
                </span>
                <div className="space-y-1.5">
                  {salaryGrades.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGrade(g)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        selectedGrade.id === g.id
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/50 dark:border-blue-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700 dark:text-blue-400">{g.code}</span>
                        <span className="text-[10px] text-slate-500 font-mono">5 Bậc</span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{g.name}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{g.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Grade Steps Matrix */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Chi Tiết Bậc Lương & Mức Đóng BHXH • {selectedGrade.code} - {selectedGrade.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Mức lương tối thiểu vùng chuẩn: {formatCurrency(4960000)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                      <th className="py-3 px-3">Bậc Lương</th>
                      <th className="py-3 px-3 text-center">Hệ Số Bậc</th>
                      <th className="py-3 px-3 text-right">Lương P1 Cứng</th>
                      <th className="py-3 px-3 text-right">Nền Đóng BHXH</th>
                      <th className="py-3 px-3 text-center">Thời Gian Nâng Bậc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {selectedGrade.steps.map((step) => (
                      <tr key={step.step_number} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                          Bậc {step.step_number}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-blue-600 font-bold">
                          <input
                            type="number"
                            step="0.05"
                            value={step.coefficient}
                            onChange={(e) => handleUpdateStep(step.step_number, 'coefficient', parseFloat(e.target.value) || 1)}
                            className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded text-center font-mono font-bold text-blue-700"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600">
                          <input
                            type="number"
                            step="100000"
                            value={step.base_salary}
                            onChange={(e) => handleUpdateStep(step.step_number, 'base_salary', parseInt(e.target.value) || 0)}
                            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded text-right font-mono font-bold text-emerald-600"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-purple-600">
                          <input
                            type="number"
                            step="100000"
                            value={step.insurance_salary}
                            onChange={(e) => handleUpdateStep(step.step_number, 'insurance_salary', parseInt(e.target.value) || 0)}
                            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded text-right font-mono font-bold text-purple-600"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {step.seniority_months_required || 12} Tháng
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DANH MỤC PHỤ CẤP & ĐỊNH MỨC */}
      {/* ========================================================================= */}
      {activeTab === 'ALLOWANCES' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-600" />
                Danh Mục Phụ Cấp & Định Mức Miễn Thuế TNCN / BHXH Theo Luật
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Các khoản chi vượt định mức miễn trừ sẽ tự động chịu thuế TNCN hoặc cộng vào nền đóng BHXH
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAllowance({
                  id: '',
                  code: '',
                  name: '',
                  default_amount: 500000,
                  is_taxable_pit: false,
                  tax_exempt_cap: 500000,
                  is_social_insurance: false,
                  insurance_exempt_cap: 500000,
                  calculation_type: 'FIXED_MONTHLY',
                  is_prorated_by_workdays: false,
                  description: '',
                  is_active: true,
                });
                setIsAllowanceModalOpen(true);
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + Thêm Loại Phụ Cấp
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                  <th className="py-3.5 px-4">Mã & Tên Phụ Cấp</th>
                  <th className="py-3.5 px-4 text-right">Mức Mặc Định</th>
                  <th className="py-3.5 px-4 text-center">Hình Thức Tính</th>
                  <th className="py-3.5 px-4 text-center">Thuế TNCN</th>
                  <th className="py-3.5 px-4 text-center">Bảo Hiểm Xã Hội</th>
                  <th className="py-3.5 px-4">Căn Cứ / Ghi Chú</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {allowanceCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-purple-600 font-bold block">{item.code}</span>
                      <span className="font-semibold text-slate-900 dark:text-white block">{item.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      {formatCurrency(item.default_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px]">
                        {item.calculation_type === 'FIXED_MONTHLY' ? 'Cố định tháng' : 'Theo ngày công'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.is_taxable_pit ? (
                        <div className="text-[10px]">
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded font-semibold">Chịu Thuế</span>
                          {item.tax_exempt_cap > 0 && (
                            <span className="block text-slate-400 font-mono mt-0.5">Miễn tối đa: {formatCurrency(item.tax_exempt_cap)}</span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold text-[10px]">Miễn 100%</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.is_social_insurance ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-semibold text-[10px]">Đóng BHXH</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-semibold text-[10px]">Không Đóng</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{item.description}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingAllowance(item);
                            setIsAllowanceModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAllowance(item.id, item.name)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* TAB 3: CHÍNH SÁCH THUẾ TNCN & BHXH THEO LUẬT */}
      {/* ========================================================================= */}
      {activeTab === 'TAX_POLICIES' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                Các Phiên Bản Chính Sách Thuế & BHXH Theo Mốc Thời Gian Áp Dụng
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Lưu lại lịch sử thay đổi luật lao động & thuế thu nhập cá nhân qua các năm
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPolicy({
                  id: '',
                  version_name: 'Luật Thuế Mới 2026',
                  effective_from_date: '2026-07-01',
                  personal_tax_deduction_self: 11000000,
                  personal_tax_deduction_dependent: 4400000,
                  bhxh_employee_rate: 8.0,
                  bhyt_employee_rate: 1.5,
                  bhtn_employee_rate: 1.0,
                  bhxh_employer_rate: 17.5,
                  bhyt_employer_rate: 3.0,
                  bhtn_employer_rate: 1.0,
                  kpcd_employer_rate: 2.0,
                  max_insurance_base_cap: 36000000,
                  legal_basis_note: 'Theo Nghị quyết Quốc Hội mới nhất',
                  is_current: false,
                });
                setIsPolicyModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + Thêm Phiên Bản Luật Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxPolicies.map((p) => (
              <div
                key={p.id}
                className={`p-5 rounded-xl border space-y-3 ${
                  p.is_current
                    ? 'bg-blue-50/40 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">{p.version_name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Hiệu lực từ: <strong>{p.effective_from_date}</strong></span>
                  </div>
                  {p.is_current ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                      ⭐ Đang Áp Dụng Hiện Hành
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">Phiên Bản Cũ</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Giảm trừ bản thân</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(p.personal_tax_deduction_self)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Giảm trừ người phụ thuộc</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(p.personal_tax_deduction_dependent)}/người</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Tỷ lệ trích đóng NLĐ</span>
                    <span className="font-bold text-purple-600">BHXH 8% + BHYT 1.5% + BHTN 1% = 10.5%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Trần tiền lương BHXH</span>
                    <span className="font-bold text-blue-600">{formatCurrency(p.max_insurance_base_cap)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">{p.legal_basis_note}</span>
                  <button
                    onClick={() => {
                      setEditingPolicy(p);
                      setIsPolicyModalOpen(true);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold text-[11px]"
                  >
                    Chỉnh Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SƠ ĐỒ TỔ CHỨC & KHỐI */}
      {/* ========================================================================= */}
      {activeTab === 'ORG_CHART' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Sơ Đồ Phân Cấp Cơ Cấu Tổ Chức Doanh Nghiệp
            </h3>
            <span className="text-xs text-slate-500">Kéo thả & phân tầng khối ban chức năng</span>
          </div>
          <OrgChartTree rootData={MOCK_ORG_TREE} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CHỨC DANH & KHUNG LƯƠNG */}
      {/* ========================================================================= */}
      {activeTab === 'JOB_TITLES' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              Danh Mục Chức Danh & Khung Lương Chuẩn Vị Trí P1
            </h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                <th className="py-3.5 px-4">Mã & Chức Danh</th>
                <th className="py-3.5 px-4">Bộ Phận / Khối</th>
                <th className="py-3.5 px-4">Cấp Bậc (Job Level)</th>
                <th className="py-3.5 px-4 text-center">Ngạch Gán</th>
                <th className="py-3.5 px-4 text-right">Khung Lương Min - Max P1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {jobTitles.map((jt) => (
                <tr key={jt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] text-amber-600 font-bold block">{jt.code}</span>
                    <span className="font-semibold text-slate-900 dark:text-white block">{jt.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{jt.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-600">{jt.level}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600">{jt.grade_code}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600">
                    {formatCurrency(jt.min_salary)} - {formatCurrency(jt.max_salary)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CA LÀM VIỆC & LỊCH CHỐT CÔNG TỰ ĐỘNG (CONSOLIDATED FROM ATTENDANCE) */}
      {/* ========================================================================= */}
      {activeTab === 'TIMEKEEPING_SHIFTS' && (
        <div className="space-y-6">
          {/* Section 1: Work Shifts List */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Danh Sách Ca Làm Việc Toàn Công Ty ({workShifts.length} Ca)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Nhân viên được gán ca cố định từ danh sách này; hệ thống tự động khóa ca khi chấm công
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingShift({
                    id: '',
                    shift_code: '',
                    name: '',
                    start_time: '08:00',
                    end_time: '17:30',
                    break_start: '12:00',
                    break_end: '13:30',
                    work_hours: 8.0,
                    night_shift_bonus_pct: 0,
                    grace_period_late_mins: 15,
                    grace_period_early_mins: 0,
                    is_active: true,
                    color: 'blue',
                  });
                  setIsShiftModalOpen(true);
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Thêm Ca Làm Việc
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {workShifts.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-mono text-[10px]">
                      {s.shift_code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono space-y-0.5">
                    <div>Giờ làm: <strong>{s.start_time} - {s.end_time}</strong> ({s.work_hours}h)</div>
                    <div>Nghỉ giữa ca: {s.break_start || '12:00'} - {s.break_end || '13:30'}</div>
                    <div>Phụ cấp ca đêm: <strong>{s.night_shift_bonus_pct || 0}%</strong></div>
                    <div>Ân hạn đi muộn: <strong>{s.grace_period_late_mins} phút</strong></div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      onClick={() => {
                        setEditingShift(s);
                        setIsShiftModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium text-[11px]"
                    >
                      Sửa Ca
                    </button>
                    <button
                      onClick={() => handleDeleteShift(s.id, s.name)}
                      className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-medium text-[11px]"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Scheduled Auto-Locking & Attendance Settings */}
          <form onSubmit={handleSaveTimekeepingSettings} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Cấu Hình Lịch Chốt Bảng Chấm Công Tự Động & Quy Định Công Chuẩn
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ngày Chốt Công Tự Động Trong Tháng
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={attSettings.auto_lock_day || 5}
                  onChange={(e) => setAttSettings({ ...attSettings, auto_lock_day: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">VD: Ngày 05 hàng tháng</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Giờ Tự Động Khóa Sổ
                </label>
                <input
                  type="time"
                  value={attSettings.auto_lock_time || '23:59'}
                  onChange={(e) => setAttSettings({ ...attSettings, auto_lock_time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nhắc Nhở Nhân Viên Trước (Ngày)
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={attSettings.reminder_days_before || 2}
                  onChange={(e) => setAttSettings({ ...attSettings, reminder_days_before: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Gửi thông báo hoàn tất giải trình</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Trạng Thái Tự Động Khóa
                </label>
                <select
                  value={attSettings.auto_lock_enabled ? 'TRUE' : 'FALSE'}
                  onChange={(e) => setAttSettings({ ...attSettings, auto_lock_enabled: e.target.value === 'TRUE' })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-emerald-600"
                >
                  <option value="TRUE">Bật Tự Động Chốt Theo Lịch</option>
                  <option value="FALSE">Tắt Tự Động (Chốt Thủ Công)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Số Ngày Công Chuẩn Trong Tháng
                </label>
                <input
                  type="number"
                  min={20}
                  max={31}
                  value={attSettings.standard_workdays}
                  onChange={(e) => setAttSettings({ ...attSettings, standard_workdays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Số Phút Cho Phép Đi Muộn Không Phạt (Ân Hạn)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={attSettings.late_grace_minutes}
                  onChange={(e) => setAttSettings({ ...attSettings, late_grace_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bán Kính Check-in GPS Định Vị Văn Phòng (Meters)
                </label>
                <input
                  type="number"
                  value={attSettings.gps_radius_meters}
                  onChange={(e) => setAttSettings({ ...attSettings, gps_radius_meters: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Lưu Cấu Hình Chấm Công & Ca
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: NGÀY NGHỈ TUẦN, LỄ TẾT & GPS TRỤ SỞ */}
      {/* ========================================================================= */}
      {activeTab === 'HOLIDAYS_WEEKENDS' && (
        <div className="space-y-6">
          {/* Section 1: Weekend & GPS Policy */}
          <form onSubmit={handleSaveWeekendPolicy} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chính Sách Ngày Nghỉ Tuần, Hệ Số Làm Thêm & Tọa Độ GPS Trụ Sở
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Chính Sách Thứ Bảy</label>
                <select
                  value={weekendPolicy.saturday_rule}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, saturday_rule: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="HALF_DAY_MORNING">Làm Buổi Sáng (08:00 - 12:00)</option>
                  <option value="OFF">Nghỉ Hoàn Toàn (Chế độ 5 ngày/tuần)</option>
                  <option value="FULL_WORK">Làm Cả Ngày Thứ Bảy</option>
                  <option value="ALTERNATE">Nghỉ Cách Tuần (1 tuần làm / 1 tuần nghỉ)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Chính Sách Chủ Nhật</label>
                <select
                  value={weekendPolicy.sunday_rule}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, sunday_rule: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="OFF">Nghỉ Toàn Bộ (Mặc Định)</option>
                  <option value="ROTATING">Xoay Ca Theo Phân Công</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Hệ Số Lương Ngày Nghỉ Tuần</label>
                <input
                  type="number"
                  value={weekendPolicy.weekend_pay_rate}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, weekend_pay_rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-purple-600"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Mặc định: 200% (x2.0)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Hệ Số Lương Ngày Lễ Tết</label>
                <input
                  type="number"
                  value={weekendPolicy.holiday_pay_rate}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, holiday_pay_rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-rose-600"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Chuẩn Luật Lao Động: 300% (x3.0)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Địa Chỉ Trụ Sở Công Ty (GPS)</label>
                <input
                  type="text"
                  value={weekendPolicy.office_address}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, office_address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Bán Kính Check-in Hợp Lệ (Meters)</label>
                <input
                  type="number"
                  value={weekendPolicy.office_radius_meters}
                  onChange={(e) => setWeekendPolicy({ ...weekendPolicy, office_radius_meters: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Lưu Chính Sách Nghỉ Tuần & GPS
              </button>
            </div>
          </form>

          {/* Section 2: Holidays List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Danh Mục Ngày Nghỉ Lễ Toàn Quốc & Doanh Nghiệp (Hưởng 100% Lương)
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingHoliday({
                    id: '',
                    name: '',
                    date: '2026-09-02',
                    year: 2026,
                    is_paid: true,
                    pay_multiplier: 3.0,
                    description: 'Nghỉ lễ theo Luật Lao Động',
                  });
                  setIsHolidayModalOpen(true);
                }}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Thêm Ngày Lễ
              </button>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                  <th className="py-3 px-4">Ngày Nghỉ</th>
                  <th className="py-3 px-4">Dịp Lễ / Sự Kiện</th>
                  <th className="py-3 px-4 text-center">Năm</th>
                  <th className="py-3 px-4 text-center">Chế Độ Nghỉ</th>
                  <th className="py-3 px-4 text-center">Hệ Số Đi Làm Lễ</th>
                  <th className="py-3 px-4">Mô Tả / Căn Cứ</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400">{h.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{h.name}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">{h.year}</td>
                    <td className="py-3.5 px-4 text-center">
                      {h.is_paid ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold text-[10px]">
                          Hưởng 100% Lương
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">Không Lương</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700 dark:text-purple-300">
                      x{h.pay_multiplier * 100}% (x{h.pay_multiplier})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{h.description}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingHoliday(h);
                            setIsHolidayModalOpen(true);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHoliday(h.id, h.name)}
                          className="p-1 text-slate-500 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* TAB 8: TRỌNG SỐ CÔNG THỨC HIỆU SUẤT 3P & MA TRẬN THƯỞNG */}
      {/* ========================================================================= */}
      {activeTab === 'PERFORMANCE_FORMULA' && (
        <form onSubmit={handleSaveFormulaWeights} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Cấu Hình Trọng Số Công Thức Tính Điểm Hiệu Suất 3P (Tổng = 100%)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600">
                Tổng hiện tại: {(formulaWeights.kpi_weight || 0) + (formulaWeights.compliance_weight || 0) + (formulaWeights.teamwork_weight || 0) + (formulaWeights.csat_weight || 0) + (formulaWeights.behavior_weight || 0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">1. Chỉ Tiêu KPI Doanh Số (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formulaWeights.kpi_weight}
                  onChange={(e) => setFormulaWeights({ ...formulaWeights, kpi_weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg font-mono font-bold text-blue-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 block">Đồng bộ từ Module KPIs</span>
              </div>

              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">2. Tuân Thủ & Chuyên Cần (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formulaWeights.compliance_weight}
                  onChange={(e) => setFormulaWeights({ ...formulaWeights, compliance_weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg font-mono font-bold text-purple-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 block">Tỷ lệ đi làm & đúng giờ</span>
              </div>

              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">3. Phối Hợp Teamwork (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formulaWeights.teamwork_weight}
                  onChange={(e) => setFormulaWeights({ ...formulaWeights, teamwork_weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg font-mono font-bold text-indigo-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 block">Đánh giá chéo / Leader</span>
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">4. CSAT Khách Hàng (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formulaWeights.csat_weight}
                  onChange={(e) => setFormulaWeights({ ...formulaWeights, csat_weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg font-mono font-bold text-emerald-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 block">Độ hài lòng đối tác</span>
              </div>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">5. Thái Độ & Động Lực (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formulaWeights.behavior_weight}
                  onChange={(e) => setFormulaWeights({ ...formulaWeights, behavior_weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-lg font-mono font-bold text-amber-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 block">Đóng góp & tự học hỏi</span>
              </div>
            </div>
          </div>

          {/* Section 2: Rating Grade Thresholds & P3 Multiplier Matrix */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ma Trận Xếp Loại Hiệu Suất & Hệ Số Thưởng Lương P3
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium uppercase">
                    <th className="py-3 px-4">Xếp Loại</th>
                    <th className="py-3 px-4">Tên Danh Hiệu</th>
                    <th className="py-3 px-4 text-center">Ngưỡng Điểm Tối Thiểu</th>
                    <th className="py-3 px-4 text-right">Hệ Số Thưởng Lương P3</th>
                    <th className="py-3 px-4 text-center">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-purple-700 text-sm">Hạng S (A+)</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Xuất Sắc Vượt Trội</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600">
                      ≥ {formulaWeights.grade_s_threshold} Điểm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      120% Lương P3 (x{formulaWeights.grade_s_p3_multiplier})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">Được đề xuất khen thưởng CEO</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-blue-700 text-sm">Hạng A</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Hoàn Thành Tốt</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600">
                      ≥ {formulaWeights.grade_a_threshold} Điểm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      100% Lương P3 (x{formulaWeights.grade_a_p3_multiplier})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">Hưởng trọn vẹn lương P3 mục tiêu</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">Hạng B</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Đạt Yêu Cầu / Khá</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      ≥ {formulaWeights.grade_b_threshold} Điểm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      85% Lương P3 (x{formulaWeights.grade_b_p3_multiplier})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">Đạt chỉ tiêu cơ bản</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-amber-700 text-sm">Hạng C</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Trung Bình / Cần Cải Thiện</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600">
                      ≥ {formulaWeights.grade_c_threshold} Điểm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600 text-sm">
                      50% Lương P3 (x{formulaWeights.grade_c_p3_multiplier})
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">Đưa vào danh sách đào tạo lại</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-rose-700 text-sm">Hạng D</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Không Đạt Yêu Cầu</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">
                      &lt; {formulaWeights.grade_c_threshold} Điểm
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 text-sm">
                      0% Lương P3 (x0.0)
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">Không hưởng lương P3 trong tháng</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Lưu Cấu Hình Trọng Số & Ma Trận Thưởng P3
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: QUẢN LÝ TRƯỜNG TÙY BIẾN HỒ SƠ NHÂN SỰ (CUSTOM FIELDS ENGINE) */}
      {/* ========================================================================= */}
      {activeTab === 'CUSTOM_FIELDS' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Quản Trị Danh Mục Trường Tùy Biến Hồ Sơ (Dynamic Custom Fields)
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Tự do mở rộng các trường thông tin cho từng Tab hồ sơ nhân viên. Áp dụng tức thì vào toàn bộ hệ thống.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCustomField({
                    id: `cf_${Date.now()}`,
                    field_key: '',
                    label: '',
                    target_tab: 'WORK_INFO',
                    data_type: 'TEXT',
                    placeholder: '',
                    options: [],
                    is_required: false,
                    is_active: true,
                  });
                  setIsCustomFieldModalOpen(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Trường Tùy Biến Mới
              </button>
            </div>

            {/* Filter by Target Tab */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
              {[
                { id: 'ALL', name: 'Tất Cả Tab' },
                { id: 'WORK_INFO', name: 'Tab 1: Làm Việc & Cá Nhân' },
                { id: 'OTHER_INFO', name: 'Tab 2: Học Vấn & Bằng Cấp' },
                { id: 'FAMILY_INFO', name: 'Tab 3: Gia Đình & NPT' },
                { id: 'DOCUMENTS_BAG', name: 'Tab 4: Túi Hồ Sơ' },
                { id: 'WORK_PROCESS', name: 'Tab 5: Quá Trình Làm Việc' },
                { id: 'REWARDS_DISCIPLINE', name: 'Tab 6: Khen Thưởng/Kỷ Luật' },
                { id: 'PERSONAL_HISTORY', name: 'Tab 7: Tiểu Sử' },
                { id: 'SALARY_HISTORY', name: 'Tab 8: Lịch Sử Lương' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedTargetTabFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedTargetTabFilter === f.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Custom Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {customFields
                .filter((cf) => selectedTargetTabFilter === 'ALL' || cf.target_tab === selectedTargetTabFilter)
                .map((cf) => (
                  <div
                    key={cf.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          {cf.field_key}
                        </span>
                        <div className="flex items-center gap-1">
                          {cf.is_required && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded font-semibold border border-rose-200">
                              Bắt Buộc
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              cf.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {cf.is_active ? 'Kích hoạt' : 'Tạm ẩn'}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{cf.label}</h3>
                      <p className="text-slate-500 text-xs">
                        Hiển thị tại: <strong className="text-slate-700 dark:text-slate-300">{cf.target_tab}</strong>
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span>Kiểu dữ liệu:</span>
                        <span className="font-semibold px-2 py-0.5 bg-white dark:bg-slate-700 border rounded text-slate-800 dark:text-slate-200">
                          {cf.data_type}
                        </span>
                      </div>

                      {cf.options && cf.options.length > 0 && (
                        <div className="text-[11px] text-slate-500">
                          <span>Lựa chọn: </span>
                          <span className="italic">{cf.options.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          setEditingCustomField({ ...cf });
                          setIsCustomFieldModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCustomField(cf.id, cf.label)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM / CHỈNH SỬA TRƯỜNG TÙY BIẾN HỒ SƠ */}
      {/* ========================================================================= */}
      {isCustomFieldModalOpen && editingCustomField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {editingCustomField.field_key ? 'Chỉnh Sửa Trường Tùy Biến' : 'Thêm Trường Tùy Biến Mới Cho Hồ Sơ'}
              </h3>
              <button onClick={() => setIsCustomFieldModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCustomField} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mã Trường (Field Key) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: work_laptop_serial"
                    value={editingCustomField.field_key}
                    onChange={(e) =>
                      setEditingCustomField({
                        ...editingCustomField,
                        field_key: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-semibold text-indigo-700 dark:text-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tiêu Đề / Nhãn Trường *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mã Số Máy Tính Cấp Phát"
                    value={editingCustomField.label}
                    onChange={(e) => setEditingCustomField({ ...editingCustomField, label: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Vị Trí Hiển Thị (Tab) *</label>
                  <select
                    value={editingCustomField.target_tab}
                    onChange={(e) => setEditingCustomField({ ...editingCustomField, target_tab: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  >
                    <option value="WORK_INFO">Tab 1: Làm Việc & Cá Nhân</option>
                    <option value="OTHER_INFO">Tab 2: Học Vấn & Bằng Cấp</option>
                    <option value="FAMILY_INFO">Tab 3: Gia Đình & NPT</option>
                    <option value="DOCUMENTS_BAG">Tab 4: Túi Hồ Sơ</option>
                    <option value="WORK_PROCESS">Tab 5: Quá Trình Làm Việc</option>
                    <option value="REWARDS_DISCIPLINE">Tab 6: Khen Thưởng/Kỷ Luật</option>
                    <option value="PERSONAL_HISTORY">Tab 7: Tiểu Sử</option>
                    <option value="SALARY_HISTORY">Tab 8: Lịch Sử Lương</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Loại Dữ Liệu *</label>
                  <select
                    value={editingCustomField.data_type}
                    onChange={(e) => setEditingCustomField({ ...editingCustomField, data_type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-blue-700 dark:text-blue-300"
                  >
                    <option value="TEXT">Văn bản (Text)</option>
                    <option value="NUMBER">Số lượng / Tiền (Number)</option>
                    <option value="DATE">Ngày tháng (Date)</option>
                    <option value="SELECT">Danh sách chọn (Select Dropdown)</option>
                    <option value="CHECKBOX">Hộp kiểm / Boolean (Checkbox)</option>
                  </select>
                </div>
              </div>

              {editingCustomField.data_type === 'SELECT' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Các Lựa Chọn (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Lựa chọn A, Lựa chọn B, Lựa chọn C"
                    value={editingCustomField.options?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingCustomField({
                        ...editingCustomField,
                        options: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Gợi Ý / Placeholder</label>
                <input
                  type="text"
                  placeholder="VD: Nhập mã số máy..."
                  value={editingCustomField.placeholder || ''}
                  onChange={(e) => setEditingCustomField({ ...editingCustomField, placeholder: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCustomField.is_required}
                    onChange={(e) => setEditingCustomField({ ...editingCustomField, is_required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Trường Bắt Buộc Nhập</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCustomField.is_active}
                    onChange={(e) => setEditingCustomField({ ...editingCustomField, is_active: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Đang Kích Hoạt</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomFieldModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Lưu Cấu Hình Trường
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA / THÊM CA LÀM VIỆC */}
      {/* ========================================================================= */}
      {isShiftModalOpen && editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {editingShift.id ? 'Cập Nhật Ca Làm Việc' : 'Thêm Mới Ca Làm Việc'}
              </h3>
              <button onClick={() => setIsShiftModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveShift} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Mã Ca *</label>
                  <input
                    type="text"
                    required
                    value={editingShift.shift_code}
                    onChange={(e) => setEditingShift({ ...editingShift, shift_code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold"
                    placeholder="VD: SHIFT_OFFICE"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Tên Ca *</label>
                  <input
                    type="text"
                    required
                    value={editingShift.name}
                    onChange={(e) => setEditingShift({ ...editingShift, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                    placeholder="VD: Ca Hành Chính"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Giờ Vào Ca *</label>
                  <input
                    type="time"
                    required
                    value={editingShift.start_time}
                    onChange={(e) => setEditingShift({ ...editingShift, start_time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Giờ Tan Ca *</label>
                  <input
                    type="time"
                    required
                    value={editingShift.end_time}
                    onChange={(e) => setEditingShift({ ...editingShift, end_time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Nghỉ Giữa Ca (Bắt đầu - Kết thúc)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      value={editingShift.break_start || '12:00'}
                      onChange={(e) => setEditingShift({ ...editingShift, break_start: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded px-2 py-1.5 font-mono text-[11px]"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={editingShift.break_end || '13:30'}
                      onChange={(e) => setEditingShift({ ...editingShift, break_end: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded px-2 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Phụ Cấp Ca Đêm (%)</label>
                  <input
                    type="number"
                    value={editingShift.night_shift_bonus_pct}
                    onChange={(e) => setEditingShift({ ...editingShift, night_shift_bonus_pct: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold text-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Số Giờ Công Chuẩn</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingShift.work_hours}
                    onChange={(e) => setEditingShift({ ...editingShift, work_hours: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Số Phút Ân Hạn Đi Muộn</label>
                  <input
                    type="number"
                    value={editingShift.grace_period_late_mins}
                    onChange={(e) => setEditingShift({ ...editingShift, grace_period_late_mins: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  Lưu Ca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA / THÊM NGÀY NGHỈ LỄ */}
      {/* ========================================================================= */}
      {isHolidayModalOpen && editingHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {editingHoliday.id ? 'Cập Nhật Ngày Nghỉ Lễ' : 'Thêm Mới Ngày Nghỉ Lễ'}
              </h3>
              <button onClick={() => setIsHolidayModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveHoliday} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Tên Dịp Lễ *</label>
                <input
                  type="text"
                  required
                  value={editingHoliday.name}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  placeholder="VD: Quốc Khánh 2/9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Ngày Nghỉ *</label>
                  <input
                    type="date"
                    required
                    value={editingHoliday.date}
                    onChange={(e) => {
                      const yr = new Date(e.target.value).getFullYear() || 2026;
                      setEditingHoliday({ ...editingHoliday, date: e.target.value, year: yr });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-semibold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Hệ Số Làm Việc Lễ</label>
                  <select
                    value={editingHoliday.pay_multiplier}
                    onChange={(e) => setEditingHoliday({ ...editingHoliday, pay_multiplier: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-purple-600"
                  >
                    <option value={3.0}>x300% (x3.0 - Chuẩn Luật)</option>
                    <option value={3.5}>x350% (x3.5)</option>
                    <option value={4.0}>x400% (x4.0 - Đêm Lễ)</option>
                    <option value={2.0}>x200% (x2.0)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Mô Tả & Ghi Chú</label>
                <textarea
                  rows={2}
                  value={editingHoliday.description || ''}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHoliday.is_paid}
                    onChange={(e) => setEditingHoliday({ ...editingHoliday, is_paid: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Hưởng 100% Lương</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHolidayModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA / THÊM PHỤ CẤP */}
      {/* ========================================================================= */}
      {isAllowanceModalOpen && editingAllowance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {editingAllowance.id ? 'Cấu Hình Phụ Cấp & Định Mức Miễn Trừ' : 'Thêm Mới Loại Phụ Cấp'}
              </h3>
              <button onClick={() => setIsAllowanceModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAllowance} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Mã Phụ Cấp *</label>
                  <input
                    type="text"
                    required
                    value={editingAllowance.code}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono font-medium"
                    placeholder="VD: AL_LUNCH"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Tên Phụ Cấp *</label>
                  <input
                    type="text"
                    required
                    value={editingAllowance.name}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                    placeholder="VD: Phụ Cấp Ăn Trưa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Mức Phụ Cấp Mặc Định (VNĐ)</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={editingAllowance.default_amount}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, default_amount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Hình Thức Tính</label>
                  <select
                    value={editingAllowance.calculation_type}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, calculation_type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                  >
                    <option value="FIXED_MONTHLY">Cố định nguyên tháng</option>
                    <option value="PRORATED_BY_WORKDAYS">Khấu trừ theo ngày công thực tế</option>
                  </select>
                </div>
              </div>
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-2">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAllowance.is_taxable_pit}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, is_taxable_pit: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Thuộc diện tính Thuế Thu Nhập Cá Nhân (TNCN)</span>
                </label>
                {editingAllowance.is_taxable_pit && (
                  <div>
                    <label className="block text-[11px] mb-1">Định mức tối đa Miễn Thuế (VNĐ/tháng)</label>
                    <input
                      type="number"
                      step="50000"
                      value={editingAllowance.tax_exempt_cap}
                      onChange={(e) => setEditingAllowance({ ...editingAllowance, tax_exempt_cap: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border rounded px-3 py-1.5 font-medium"
                    />
                  </div>
                )}
              </div>
              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-xl space-y-2">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAllowance.is_social_insurance}
                    onChange={(e) => setEditingAllowance({ ...editingAllowance, is_social_insurance: e.target.checked })}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <span>Thuộc diện cộng vào nền đóng BHXH</span>
                </label>
              </div>
              <div>
                <label className="block font-medium mb-1">Ghi Chú Căn Cứ</label>
                <textarea
                  rows={2}
                  value={editingAllowance.description}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAllowanceModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA / THÊM CHÍNH SÁCH THUẾ */}
      {/* ========================================================================= */}
      {isPolicyModalOpen && editingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Cập Nhật Chính Sách Thuế & BHXH Theo Luật
              </h3>
              <button onClick={() => setIsPolicyModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePolicy} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Tên Phiên Bản *</label>
                  <input
                    type="text"
                    required
                    value={editingPolicy.version_name}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, version_name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Mốc Bắt Đầu Áp Dụng *</label>
                  <input
                    type="date"
                    required
                    value={editingPolicy.effective_from_date}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, effective_from_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-blue-600 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Giảm Trừ Bản Thân (VNĐ)</label>
                  <input
                    type="number"
                    step="500000"
                    required
                    value={editingPolicy.personal_tax_deduction_self}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, personal_tax_deduction_self: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Giảm Trừ Người Phụ Thuộc (VNĐ)</label>
                  <input
                    type="number"
                    step="100000"
                    required
                    value={editingPolicy.personal_tax_deduction_dependent}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, personal_tax_deduction_dependent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-emerald-600 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">% BHXH (NLĐ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPolicy.bhxh_employee_rate}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, bhxh_employee_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">% BHYT (NLĐ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPolicy.bhyt_employee_rate}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, bhyt_employee_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">% BHTN (NLĐ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPolicy.bhtn_employee_rate}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, bhtn_employee_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Mức Trần Lương Đóng BHXH</label>
                <input
                  type="number"
                  step="500000"
                  value={editingPolicy.max_insurance_base_cap}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, max_insurance_base_cap: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold font-mono"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPolicy.is_current}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, is_current: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Đặt làm chính sách mặc định hiện hành</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPolicyModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HrmSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Đang tải cấu hình nhân sự...</div>}>
      <HrmSettingsContent />
    </Suspense>
  );
}
