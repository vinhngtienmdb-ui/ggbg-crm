'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  FileText,
  Building2,
  Briefcase,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  Upload,
  FileCheck,
  Plus,
  Trash2,
  Camera,
  MapPin,
  HeartPulse,
  BadgeCheck,
  Paperclip,
  FolderPlus,
  User,
  GraduationCap,
  Wallet,
  CalendarDays,
  Award,
  ShieldAlert,
  LogOut,
  TrendingUp,
  Users,
  FileSpreadsheet,
  History,
  BookOpen,
  CheckCircle2,
  Save,
  Crown,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Sliders,
  Eye,
  Download,
  Layers,
  Settings2,
  Info,
  Edit,
  ExternalLink,
  FileUp
} from 'lucide-react';
import {
  EmployeeProfile,
  KycDocument,
  FamilyMember,
  EducationHistoryItem,
  WorkExperienceItem,
  CertificateItem,
  WorkProcessItem,
  RewardItem,
  DisciplinaryRecord,
  EmployeeAllowanceItem,
  CompensationHistoryRecord,
  HrmCustomFieldDefinition,
  JobTitleDefinition,
  SalaryGradeScale,
  SalaryStepItem
} from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { useAuth } from '@/context/AuthContext';
import { canViewPII, maskSalary } from '@/lib/pii';
import VietnamAddressPicker from '@/components/common/VietnamAddressPicker';
import {
  getEmployees,
  getSalaryGrades,
  getAllowanceCatalog,
  getCompensationHistory,
  getDepartmentsList,
  getJobTitles,
  getHrmCustomFields,
  getTaxPolicies,
  calculateSalaryFromGradeStep
} from '@/lib/hrmStore';

const formatVND = (n?: number) => {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return formatCurrency(n);
};

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emp: Partial<EmployeeProfile>) => void;
  initialData?: EmployeeProfile | null;
  mode?: 'create' | 'edit' | 'view';
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create',
}: EmployeeModalProps) {
  const { user, simulatedRole } = useAuth();
  const role = simulatedRole || user?.role;
  const showPII = canViewPII(role, user?.is_super_admin);

  // Active Tab State (8 Full Profile Tabs Preserved)
  const [activeTab, setActiveTab] = useState<
    | 'WORK_INFO'
    | 'OTHER_INFO'
    | 'FAMILY_INFO'
    | 'DOCUMENTS_BAG'
    | 'WORK_PROCESS'
    | 'REWARDS_DISCIPLINE'
    | 'PERSONAL_HISTORY'
    | 'SALARY_HISTORY'
  >('WORK_INFO');

  // Master Data Catalogs for Synchronization
  const [departmentsList, setDepartmentsList] = useState<string[]>([]);
  const [allJobTitles, setAllJobTitles] = useState<JobTitleDefinition[]>([]);
  const [salaryGradesList, setSalaryGradesList] = useState<SalaryGradeScale[]>([]);
  const [customFieldsDefs, setCustomFieldsDefs] = useState<HrmCustomFieldDefinition[]>([]);
  const [allEmployeesList, setAllEmployeesList] = useState<EmployeeProfile[]>([]);
  const [dependentDeductionRate, setDependentDeductionRate] = useState<number>(4400000);

  // Load Master Data
  useEffect(() => {
    setDepartmentsList(getDepartmentsList());
    setAllJobTitles(getJobTitles());
    setSalaryGradesList(getSalaryGrades());
    setCustomFieldsDefs(getHrmCustomFields());
    setAllEmployeesList(getEmployees());

    // Tax configuration from system
    const policies = getTaxPolicies();
    const currentPol = policies.find((p) => p.is_current) || policies[0];
    if (currentPol?.personal_tax_deduction_dependent) {
      setDependentDeductionRate(currentPol.personal_tax_deduction_dependent);
    }
  }, [isOpen]);

  const [formData, setFormData] = useState<Partial<EmployeeProfile>>({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 1',
    position: 'Trưởng Nhóm',
    job_title: 'Trưởng Nhóm Sale',
    joined_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    contract_number: '',
    contract_type: 'Chính thức',
    contract_file_r2: '',
    id_card_number: '',
    id_card_issue_date: '',
    id_card_issue_place: '',
    permanent_address: '',
    temporary_address: '',
    social_insurance_code: '',
    health_insurance_code: '',
    personal_tax_code: '',
    bank_account_holder: '',
    bank_account: '',
    bank_name: 'Techcombank',
    bank_branch: 'Chi nhánh Hà Nội',
    direct_manager_id: '',
    direct_manager_name: '',
    probation_rate: 85,
    kyc_documents: [],

    // 8 Tabs extended fields
    gender: 'Nam',
    date_of_birth: '1995-05-15',
    ethnicity: 'Kinh',
    religion: 'Không',
    hometown: 'Hà Nội',
    health_provider: 'Bệnh viện Bạch Mai - Hà Nội',
    bhxh_start_date: '2022-01-01',
    bhxh_status: 'Đang tham gia',
    base_salary: 18000000,
    salary_grade_id: 'sg_g4',
    salary_grade: 'G4',
    salary_step_number: 1,
    dependent_count: 1,
    probation_salary: 15300000,
    insurance_salary: 11000000,

    allowances: [
      { id: 'al_e1_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'al_e1_2', allowance_type_id: 'al_4', name: 'Phụ Cấp Trách Nhiệm Quản Lý', amount: 2000000, taxable: true, include_in_insurance: true },
      { id: 'al_e1_3', allowance_type_id: 'al_3', name: 'Phụ Cấp Điện Thoại', amount: 300000, taxable: false, tax_exempt_cap: 300000, include_in_insurance: false },
    ],

    family_members: [
      {
        id: 'fm_1',
        name: 'Nguyễn Thị Hoa',
        relationship: 'Vợ',
        date_of_birth: '1996-08-20',
        phone: '0987654321',
        tax_code: '8877665544',
        id_card_number: '001196009876',
        is_dependent: true,
        deduction_start_date: '2023-01-01',
        proof_document_name: 'Giay_xac_nhan_hon_thu.pdf',
      },
      {
        id: 'fm_2',
        name: 'Nguyễn Minh Quân',
        relationship: 'Con',
        date_of_birth: '2023-03-10',
        is_dependent: true,
        deduction_start_date: '2023-04-01',
        proof_document_name: 'Giay_khai_sinh_MinhQuan.pdf',
      },
    ],
    emergency_contact: {
      name: 'Nguyễn Văn Hùng',
      relationship: 'Bố đẻ',
      phone: '0912345678',
      address: 'Số 15 Lê Văn Lương, Cầu Giấy, Hà Nội',
    },
    education_history: [
      {
        id: 'edu_1',
        school_name: 'Đại Học Kinh Tế Quốc Dân',
        major: 'Quản Trị Kinh Doanh TMĐT',
        degree_level: 'Cử Nhân',
        graduation_year: '2017',
        grade: 'Giỏi',
      },
    ],
    work_experience: [
      {
        id: 'exp_1',
        company_name: 'Công ty Cổ Phần TMĐT Haravan',
        position: 'Chuyên Viên Tư Vấn Giải Pháp Gian Hàng',
        from_date: '2018-06',
        to_date: '2021-12',
        reason_for_leaving: 'Muốn phát triển sâu hơn về mảng Vận Hành Agency TMĐT 3P',
        achievements: 'Top 3 Sale xuất sắc nhất năm 2020',
      },
    ],
    certificates: [
      {
        id: 'cert_1',
        cert_name: 'Chứng Chỉ Vận Hành Gian Hàng Shopee Certified Master',
        issued_by: 'Shopee Vietnam Academy',
        issue_date: '2022-03-15',
        expiry_date: '2027-03-15',
        cert_type: 'Chuyên Môn TMĐT',
      },
      {
        id: 'cert_2',
        cert_name: 'TikTok Shop Partner Operation Specialist',
        issued_by: 'TikTok Vietnam',
        issue_date: '2023-01-10',
        expiry_date: '2026-01-10',
        cert_type: 'Chuyên Môn TMĐT',
      },
    ],
    work_process: [
      {
        id: 'wp_1',
        effective_date: '2024-01-01',
        decision_number: 'QĐ-2024/001-GGBG',
        old_position: 'Chuyên Viên Sale',
        new_position: 'Trưởng Nhóm Kinh Doanh',
        old_department: 'Phòng Kinh Doanh 1',
        new_department: 'Phòng Kinh Doanh 1',
        old_salary: 12000000,
        new_salary: 18000000,
        approved_by: 'Tổng Giám Đốc',
      },
    ],
    rewards: [
      {
        id: 'rw_1',
        decision_number: 'QĐKT-2025/08',
        reward_date: '2025-12-31',
        reward_type: 'Bằng Khen & Tiền Thưởng Top 1 Doanh Số Năm',
        amount: 20000000,
        reason: 'Đạt doanh số kỷ lục 5 tỷ VNĐ tư vấn gian hàng Shopee & TikTok Mall',
      },
    ],
    disciplinary_records: [],
    personal_biography:
      'Sinh ra và lớn lên tại Hà Nội. Đã tốt nghiệp Đại học Kinh tế Quốc dân chuyên ngành Quản trị Kinh doanh. Có 8 năm kinh nghiệm chuyên sâu trong lĩnh vực tư vấn giải pháp TMĐT và quản lý đội ngũ kinh doanh B2B.',
    special_notes: 'Lao động có năng lực lãnh đạo tốt, tác phong chuyên nghiệp, đủ điều kiện quy hoạch Trưởng Phòng Kinh Doanh.',
    custom_fields: {},
  });

  // Modal / Sub-form States for Inner Rows
  const [newDocCategory, setNewDocCategory] = useState<string>('HĐLĐ_SCAN');
  const [customDocTypeInput, setCustomDocTypeInput] = useState<string>('');
  const [isCustomDocMode, setIsCustomDocMode] = useState<boolean>(false);

  // Sub-modals for Tab 2 (Education, Experience, Certificates)
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationHistoryItem | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperienceItem | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  // Sub-modals for Tab 5 (Work Process) & Tab 6 (Rewards & Discipline)
  const [isWorkProcessModalOpen, setIsWorkProcessModalOpen] = useState(false);
  const [editingWorkProcess, setEditingWorkProcess] = useState<WorkProcessItem | null>(null);

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);

  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<DisciplinaryRecord | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData((prev) => ({
        ...prev,
        employee_code: `NV-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        contract_number: `HĐLĐ-2026/${String(Math.floor(Math.random() * 900) + 100)}`,
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isViewOnly = mode === 'view';

  // ==================== CƠ CHẾ ĐỒNG BỘ 3 CẤP (PHÒNG BAN ➔ CHỨC DANH/CHỨC VỤ ➔ NGẠCH BẬC LƯƠNG) ====================

  // 1. Khi chọn Phòng ban:
  const handleDepartmentChange = (newDept: string) => {
    const deptJobTitles = allJobTitles.filter((jt) => jt.department === newDept);
    const matchedJt = deptJobTitles[0] || allJobTitles[0];

    let newGradeId = formData.salary_grade_id || 'sg_g4';
    let newGradeCode = formData.salary_grade || 'G4';
    let newPosition = formData.position || 'Chuyên Viên';

    if (matchedJt) {
      newPosition = matchedJt.position_name || newPosition;
      const targetGrade = salaryGradesList.find((g) => g.code === matchedJt.grade_code);
      if (targetGrade) {
        newGradeId = targetGrade.id;
        newGradeCode = targetGrade.code;
      }
    }

    const calc = calculateSalaryFromGradeStep(newGradeId, 1);
    const rate = formData.probation_rate || 85;
    const pSalary = Math.round((calc.baseSalary * rate) / 100);

    setFormData((prev) => ({
      ...prev,
      department: newDept,
      job_title: matchedJt ? matchedJt.name : prev.job_title,
      position: newPosition,
      salary_grade_id: newGradeId,
      salary_grade: newGradeCode,
      salary_step_number: 1,
      base_salary: calc.baseSalary,
      insurance_salary: calc.insuranceSalary,
      probation_salary: pSalary,
    }));
  };

  // 2. Khi chọn Chức danh:
  const handleJobTitleChange = (jobTitleName: string) => {
    const targetJt = allJobTitles.find((jt) => jt.name === jobTitleName);
    if (targetJt) {
      const targetGrade = salaryGradesList.find((g) => g.code === targetJt.grade_code) || salaryGradesList[0];
      const calc = calculateSalaryFromGradeStep(targetGrade.id, 1);
      const rate = formData.probation_rate || 85;
      const pSalary = Math.round((calc.baseSalary * rate) / 100);

      setFormData((prev) => ({
        ...prev,
        job_title: targetJt.name,
        position: targetJt.position_name || prev.position,
        salary_grade_id: targetGrade.id,
        salary_grade: targetGrade.code,
        salary_step_number: 1,
        base_salary: calc.baseSalary,
        insurance_salary: calc.insuranceSalary,
        probation_salary: pSalary,
      }));
    } else {
      setFormData((prev) => ({ ...prev, job_title: jobTitleName }));
    }
  };

  // 3. Khi chọn Ngạch lương:
  const handleSalaryGradeChange = (gradeId: string) => {
    const targetGrade = salaryGradesList.find((g) => g.id === gradeId) || salaryGradesList[0];
    const calc = calculateSalaryFromGradeStep(targetGrade.id, formData.salary_step_number || 1);
    const rate = formData.probation_rate || 85;
    const pSalary = Math.round((calc.baseSalary * rate) / 100);

    setFormData((prev) => ({
      ...prev,
      salary_grade_id: targetGrade.id,
      salary_grade: targetGrade.code,
      base_salary: calc.baseSalary,
      insurance_salary: calc.insuranceSalary,
      probation_salary: pSalary,
    }));
  };

  // 4. Khi chọn Bậc lương:
  const handleSalaryStepChange = (stepNum: number) => {
    const calc = calculateSalaryFromGradeStep(formData.salary_grade_id || 'sg_g4', stepNum);
    const rate = formData.probation_rate || 85;
    const pSalary = Math.round((calc.baseSalary * rate) / 100);

    setFormData((prev) => ({
      ...prev,
      salary_step_number: stepNum,
      base_salary: calc.baseSalary,
      insurance_salary: calc.insuranceSalary,
      probation_salary: pSalary,
    }));
  };

  // 5. Khi đổi Tỷ lệ lương thử việc (85% hoặc 100%):
  const handleProbationRateChange = (rate: number) => {
    const pSalary = Math.round(((formData.base_salary || 0) * rate) / 100);
    setFormData((prev) => ({
      ...prev,
      probation_rate: rate,
      probation_salary: pSalary,
    }));
  };

  // ==================== QUẢN LÝ NGƯỜI PHỤ THUỘC & THUẾ TNCN ====================
  const handleToggleDependent = (memberId: string) => {
    const updatedMembers = (formData.family_members || []).map((fm) =>
      fm.id === memberId ? { ...fm, is_dependent: !fm.is_dependent } : fm
    );
    const count = updatedMembers.filter((fm) => fm.is_dependent).length;
    setFormData((prev) => ({
      ...prev,
      family_members: updatedMembers,
      dependent_count: count,
    }));
  };

  const handleAddFamilyMember = () => {
    const newFm: FamilyMember = {
      id: `fm_${Date.now()}`,
      name: '',
      relationship: 'Con',
      date_of_birth: '',
      tax_code: '',
      id_card_number: '',
      is_dependent: true,
      deduction_start_date: new Date().toISOString().split('T')[0],
    };
    const updated = [...(formData.family_members || []), newFm];
    setFormData((prev) => ({
      ...prev,
      family_members: updated,
      dependent_count: updated.filter((f) => f.is_dependent).length,
    }));
  };

  const handleRemoveFamilyMember = (id: string) => {
    const updated = (formData.family_members || []).filter((fm) => fm.id !== id);
    setFormData((prev) => ({
      ...prev,
      family_members: updated,
      dependent_count: updated.filter((f) => f.is_dependent).length,
    }));
  };

  // ==================== CHỨNG TỪ GIẢM TRỪ GIA CẢNH ====================
  const handleDependentProofUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updated = [...(formData.family_members || [])];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        proof_document_name: file.name,
        proof_document_url: `storage.ggbingo.vn/hrm/dependents/${file.name}`,
      };
      setFormData((prev) => ({ ...prev, family_members: updated }));
    }
  };

  // ==================== TÚI HỒ SƠ FILE UPLOAD ====================
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docType = isCustomDocMode && customDocTypeInput.trim()
      ? customDocTypeInput.trim()
      : newDocCategory;

    const newDocItem: KycDocument = {
      doc_id: `doc_${Date.now()}`,
      doc_type: docType as any,
      doc_name: file.name,
      file_r2_path: `storage.ggbingo.vn/hrm/docs/${file.name}`,
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VALID',
    };

    setFormData((prev) => ({
      ...prev,
      kyc_documents: [...(prev.kyc_documents || []), newDocItem],
    }));

    if (isCustomDocMode) {
      setCustomDocTypeInput('');
      setIsCustomDocMode(false);
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      kyc_documents: (prev.kyc_documents || []).filter((d) => d.doc_id !== docId),
    }));
  };

  // ==================== CUSTOM FIELDS HELPER ====================
  const renderCustomFieldsForTab = (targetTab: HrmCustomFieldDefinition['target_tab']) => {
    const tabFields = customFieldsDefs.filter((cf) => cf.target_tab === targetTab && cf.is_active);
    if (tabFields.length === 0) return null;

    return (
      <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Trường Tùy Biến Mở Rộng ({tabFields.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {tabFields.map((cf) => {
            const currentVal = formData.custom_fields?.[cf.field_key] ?? cf.default_value ?? '';
            return (
              <div key={cf.id} className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  {cf.label} {cf.is_required && <span className="text-rose-500">*</span>}
                </label>
                {cf.data_type === 'SELECT' ? (
                  <select
                    disabled={isViewOnly}
                    value={currentVal}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        custom_fields: { ...prev.custom_fields, [cf.field_key]: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  >
                    <option value="">-- Chọn {cf.label} --</option>
                    {cf.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : cf.data_type === 'CHECKBOX' ? (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      disabled={isViewOnly}
                      checked={Boolean(currentVal)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          custom_fields: { ...prev.custom_fields, [cf.field_key]: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Kích hoạt / Xác nhận</span>
                  </div>
                ) : (
                  <input
                    type={cf.data_type === 'NUMBER' ? 'number' : cf.data_type === 'DATE' ? 'date' : 'text'}
                    disabled={isViewOnly}
                    placeholder={cf.placeholder || `Nhập ${cf.label}`}
                    value={currentVal}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        custom_fields: { ...prev.custom_fields, [cf.field_key]: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const currentGrade = salaryGradesList.find((g) => g.id === formData.salary_grade_id) || salaryGradesList[0];
  const currentStep = currentGrade?.steps.find((s) => s.step_number === (formData.salary_step_number || 1)) || currentGrade?.steps[0];
  const filteredJobTitles = allJobTitles.filter(
    (jt) => !formData.department || jt.department === formData.department
  );

  // ==================== CẤP BẬC VÀ PHÂN NHÓM QUẢN LÝ TRỰC TIẾP HỢP LỆ ====================
  const getPositionHierarchyRank = (pos?: string): number => {
    if (!pos) return 1;
    const p = pos.toLowerCase();
    if (p.includes('ban giám đốc') || p.includes('tổng giám đốc') || p.includes('chủ tịch') || p.includes('ceo')) return 10;
    if (p.includes('giám đốc khối') || p.includes('cso') || p.includes('cmo') || p.includes('cto') || p.includes('coo')) return 8;
    if (p.includes('trưởng phòng') || p.includes('quản lý') || p.includes('trưởng ban') || p.includes('head')) return 6;
    if (p.includes('phó phòng') || p.includes('phó ban') || p.includes('deputy')) return 5;
    if (p.includes('trưởng nhóm') || p.includes('leader') || p.includes('lead')) return 4;
    if (p.includes('chuyên viên cao cấp') || p.includes('senior')) return 3;
    if (p.includes('chuyên viên') || p.includes('mid')) return 2;
    if (p.includes('nhân viên') || p.includes('junior')) return 1;
    return 0;
  };

  const currEmpRank = getPositionHierarchyRank(formData.position);
  const currDept = formData.department || '';

  // Danh sách các nhân sự khác (loại trừ chính nhân sự đang tạo/sửa)
  const candidatePool = allEmployeesList.filter((emp) => emp.id !== formData.id);

  // Nhóm 1: Ban Giám Đốc / Hội Đồng Quản Trị (Rank 10)
  const boardLeaders = candidatePool.filter((emp) => getPositionHierarchyRank(emp.position) >= 10);

  // Nhóm 2: Giám Đốc Khối (Rank 8) - chỉ hiện nếu có cấp bậc cao hơn nhân sự này
  const divisionDirectors = candidatePool.filter((emp) => {
    const r = getPositionHierarchyRank(emp.position);
    return r >= 8 && r < 10 && (r > currEmpRank || currEmpRank < 8);
  });

  // Nhóm 3: Lãnh Đạo Cùng Phòng Ban (Trưởng Phòng, Phó Phòng, Trưởng Nhóm) có cấp bậc cao hơn
  const sameDeptManagers = candidatePool.filter((emp) => {
    const r = getPositionHierarchyRank(emp.position);
    const isSameDept = emp.department === currDept;
    const isManagerRole = r >= 4 && r < 8;
    return isSameDept && isManagerRole && r > currEmpRank;
  });

  // Nhóm 4: Trưởng / Phó Phòng Ban Khác (nếu điều động / báo cáo chéo cấp cao)
  const otherDeptManagers = candidatePool.filter((emp) => {
    const r = getPositionHierarchyRank(emp.position);
    const isOtherDept = emp.department !== currDept && emp.department !== 'Ban Giám Đốc';
    const isHeadRole = r >= 5 && r < 8;
    return isOtherDept && isHeadRole && r > currEmpRank;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 overflow-y-auto flex flex-col w-full h-full animate-in fade-in duration-150">
      {/* Sticky Executive Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm w-full sticky top-0 z-20">
        <div className="max-w-7xl mx-auto p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại HRM</span>
            </button>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {mode === 'create' && 'Tạo Mới Hồ Sơ Nhân Sự (Đồng Bộ Ngạch Bậc Lương)'}
                  {mode === 'edit' && `Chỉnh Sửa Hồ Sơ Nhân Sự: ${formData.full_name}`}
                  {mode === 'view' && `Chi Tiết Hồ Sơ Nhân Sự: ${formData.full_name}`}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {formData.employee_code || 'NV-0000'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Phòng: <strong className="text-slate-800 dark:text-slate-200">{formData.department}</strong></span>
                <span>•</span>
                <span>Chức danh: <strong className="text-blue-700 dark:text-blue-400">{formData.job_title || formData.position}</strong></span>
                <span>•</span>
                <span>Ngạch lương: <strong className="text-emerald-700 dark:text-emerald-400">{formData.salary_grade} (Bậc {formData.salary_step_number || 1})</strong></span>
                <span>•</span>
                <span>Lương P1: <strong className="text-emerald-700">{formatCurrency(formData.base_salary || 0)}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            {!isViewOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" /> Lưu Hồ Sơ
              </button>
            )}
          </div>
        </div>

        {/* 8 FULL PROFILE TABS NAVIGATION (PRESERVED) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-5 flex items-center gap-1 overflow-x-auto border-t border-slate-100 dark:border-slate-800 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('WORK_INFO')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'WORK_INFO'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> 1. Thông Tin Làm Việc & Cá Nhân
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('OTHER_INFO')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'OTHER_INFO'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> 2. Thông Tin Khác (Học Vấn/Kinh Nghiệm)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FAMILY_INFO')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'FAMILY_INFO'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" /> 3. Thông Tin Gia Đình & Giảm Trừ Thuế ({formData.dependent_count || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DOCUMENTS_BAG')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'DOCUMENTS_BAG'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 text-amber-600" /> 4. Túi Hồ Sơ Số Hóa ({formData.kyc_documents?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WORK_PROCESS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'WORK_PROCESS'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> 5. Quá Trình Làm Việc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REWARDS_DISCIPLINE')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'REWARDS_DISCIPLINE'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" /> 6. Khen Thưởng & Kỷ Luật
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PERSONAL_HISTORY')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'PERSONAL_HISTORY'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> 7. Tiểu Sử & Trường Tùy Biến
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SALARY_HISTORY')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 text-xs font-semibold cursor-pointer ${
              activeTab === 'SALARY_HISTORY'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-600" /> 8. Lịch Sử Lương & Ngạch Bậc
          </button>
        </div>
      </div>

      {/* Main Full-Page Form Content */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: THÔNG TIN LÀM VIỆC & CÁ NHÂN (MA TRẬN ĐỒNG BỘ) */}
          {/* ======================================================== */}
          {activeTab === 'WORK_INFO' && (
            <div className="space-y-6">
              {/* 1.1: Đồng Bộ Cơ Cấu Tổ Chức & Ngạch Bậc Lương */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/80 dark:border-blue-900 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    1.1 Đồng Bộ Cơ Cấu Tổ Chức & Ngạch Bậc Lương Chuẩn
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Cấp 1: Phòng Ban Trực Thuộc */}
                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      1. Phòng Ban Trực Thuộc *
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.department || departmentsList[0] || 'Phòng Kinh Doanh 1'}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg font-semibold text-blue-900 dark:text-blue-100 shadow-xs"
                      required
                    >
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cấp 2: Chức Danh Chuyên Môn */}
                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      2. Chức Danh Chuyên Môn *
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.job_title || ''}
                      onChange={(e) => handleJobTitleChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg font-semibold text-indigo-900 dark:text-indigo-100 shadow-xs"
                      required
                    >
                      {filteredJobTitles.map((jt) => (
                        <option key={jt.id} value={jt.name}>
                          {jt.name} ({jt.grade_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cấp 2.1: Chức Vụ Quản Lý */}
                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      3. Chức Vụ Quản Lý
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.position || 'Chuyên Viên'}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-slate-100"
                    >
                      <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                      <option value="Giám Đốc Khối">Giám Đốc Khối</option>
                      <option value="Trưởng Phòng">Trưởng Phòng</option>
                      <option value="Phó Phòng">Phó Phòng</option>
                      <option value="Trưởng Nhóm">Trưởng Nhóm (Leader)</option>
                      <option value="Chuyên Viên Cao Cấp">Chuyên Viên Cao Cấp (Senior)</option>
                      <option value="Chuyên Viên">Chuyên Viên (Mid-level)</option>
                      <option value="Nhân Viên">Nhân Viên (Junior)</option>
                      <option value="Thực Tập Sinh">Thực Tập Sinh (Intern)</option>
                    </select>
                  </div>

                  {/* Quản Lý Trực Tiếp (Ưu tiên theo cấp bậc & bộ phận) */}
                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      4. Quản Lý Trực Tiếp
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.direct_manager_id || ''}
                      onChange={(e) => {
                        const mgrId = e.target.value;
                        if (!mgrId) {
                          setFormData((prev) => ({
                            ...prev,
                            direct_manager_id: undefined,
                            direct_manager_name: '',
                          }));
                        } else {
                          const found = allEmployeesList.find((emp) => emp.id === mgrId);
                          setFormData((prev) => ({
                            ...prev,
                            direct_manager_id: mgrId,
                            direct_manager_name: found ? `${found.full_name} (${found.job_title || found.position})` : '',
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
                    >
                      <option value="">-- Không có quản lý trực tiếp (Ban Giám Đốc / Vị trí độc lập) --</option>

                      {/* 1. Ban Giám Đốc & Ban Lãnh Đạo */}
                      {boardLeaders.length > 0 && (
                        <optgroup label="👑 Ban Giám Đốc & Hội Đồng Quản Trị">
                          {boardLeaders.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.full_name} ({emp.employee_code || emp.id}) — {emp.job_title || emp.position}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* 2. Giám Đốc Khối */}
                      {divisionDirectors.length > 0 && (
                        <optgroup label="🏛️ Giám Đốc Khối">
                          {divisionDirectors.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.full_name} ({emp.employee_code || emp.id}) — {emp.job_title || emp.position} ({emp.department})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* 3. Lãnh Đạo / Quản Lý Cùng Phòng Ban / Bộ Phận */}
                      {sameDeptManagers.length > 0 && (
                        <optgroup label={`🏢 Quản Lý Trực Thuộc (${currDept || 'Cùng Phòng Ban'})`}>
                          {sameDeptManagers.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.full_name} ({emp.employee_code || emp.id}) — {emp.job_title || emp.position}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* 4. Trưởng / Phó Phòng Ban Khác */}
                      {otherDeptManagers.length > 0 && (
                        <optgroup label="👥 Trưởng / Phó Phòng Ban Khác (Quản Lý Chéo)">
                          {otherDeptManagers.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.full_name} ({emp.employee_code || emp.id}) — {emp.job_title || emp.position} ({emp.department})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Fallback nếu quản lý đã gán trước đó không nằm trong các nhóm trên */}
                      {formData.direct_manager_id &&
                        !boardLeaders.some((e) => e.id === formData.direct_manager_id) &&
                        !divisionDirectors.some((e) => e.id === formData.direct_manager_id) &&
                        !sameDeptManagers.some((e) => e.id === formData.direct_manager_id) &&
                        !otherDeptManagers.some((e) => e.id === formData.direct_manager_id) && (
                          <optgroup label="📌 Quản Lý Đang Được Gán">
                            <option value={formData.direct_manager_id}>
                              {formData.direct_manager_name || `Mã Quản Lý: ${formData.direct_manager_id}`}
                            </option>
                          </optgroup>
                        )}
                    </select>
                  </div>
                </div>

                {/* Cấp 3: Ma trận Ngạch & Bậc Lương & Tỷ Lệ Thử Việc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs pt-2 border-t border-blue-200/60 dark:border-blue-900/60">
                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Ngạch Lương Chuẩn
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.salary_grade_id || 'sg_g4'}
                      onChange={(e) => handleSalaryGradeChange(e.target.value)}
                      className="w-full px-3 py-2 bg-blue-100/60 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded-lg font-bold text-blue-800 dark:text-blue-200"
                    >
                      {salaryGradesList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.code} - {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Bậc Lương (Step)
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.salary_step_number || 1}
                      onChange={(e) => handleSalaryStepChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-indigo-100/60 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 rounded-lg font-bold text-indigo-800 dark:text-indigo-200"
                    >
                      {currentGrade?.steps.map((s) => (
                        <option key={s.step_number} value={s.step_number}>
                          Bậc {s.step_number}: {s.step_name} (x{s.coefficient})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Lương P1 Chính Thức
                    </label>
                    <div className="px-3 py-2 bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-lg font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                      {formatCurrency(formData.base_salary || 0)}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Tỷ Lệ Lương Thử Việc
                    </label>
                    <select
                      disabled={isViewOnly}
                      value={formData.probation_rate || 85}
                      onChange={(e) => handleProbationRateChange(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-purple-100/60 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 rounded-lg font-bold text-purple-800 dark:text-purple-200"
                    >
                      <option value={85}>85% (Chuẩn Luật Lao Động)</option>
                      <option value={100}>100% (Hưởng Trọn Vẹn 100%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Lương Thử Việc / BHXH
                    </label>
                    <div className="px-3 py-2 bg-purple-100/70 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 rounded-lg font-semibold text-purple-800 dark:text-purple-300 text-xs">
                      Thử việc: {formatCurrency(formData.probation_salary || 0)} • BHXH: {formatCurrency(formData.insurance_salary || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.2: Thông Tin Nhân Thân & Căn Cước Công Dân (CCCD) */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  1.2 Thông Tin Cá Nhân & Pháp Lý CCCD
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Nhân Viên *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.employee_code || ''}
                      onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-blue-700 dark:text-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Họ Và Tên *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="Nguyễn Văn A"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày Sinh (DD/MM/YYYY)</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Giới Tính</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.gender || 'Nam'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Số Căn Cước / CCCD *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="001095001234"
                      value={formData.id_card_number || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-blue-700 dark:text-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày Cấp CCCD</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.id_card_issue_date || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_issue_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nơi Cấp CCCD</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="Cục Cảnh Sát QLHC"
                      value={formData.id_card_issue_place || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_issue_place: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nguyên Quán</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="Hà Nội / Hải Phòng..."
                      value={formData.hometown || ''}
                      onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email Công Ty *</label>
                    <input
                      type="email"
                      disabled={isViewOnly}
                      placeholder="hoang.tv@ggbingo.vn"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      disabled={isViewOnly}
                      placeholder="0912 345 678"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-blue-700 dark:text-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng Thái Làm Việc</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      <option value="Active">🟢 Chính Thức (Active)</option>
                      <option value="Probation">🟡 Thử Việc (Probation)</option>
                      <option value="Applicant">🔵 Ứng Viên / Tiếp Nhận</option>
                      <option value="Pending_Resign">🟠 Chờ Bàn Giao Nghỉ Việc</option>
                      <option value="Resigned">🔴 Đã Nghỉ Việc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày Vào Công Ty</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.joined_date || ''}
                      onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                {/* Vietnam Address Picker */}
                <div className="pt-2">
                  <VietnamAddressPicker
                    label="Địa Chỉ Thường Trú & Tạm Trú (Chuẩn 3 Cấp Tỉnh/Huyện/Xã)"
                    disabled={isViewOnly}
                    value={{ detailAddress: formData.permanent_address || formData.current_address || '' }}
                    onChange={(addr) =>
                      setFormData({
                        ...formData,
                        permanent_address: addr.fullAddress,
                        current_address: addr.fullAddress,
                        temporary_address: addr.fullAddress,
                      })
                    }
                  />
                </div>
              </div>

              {/* 1.3: Thông Tin Tài Khoản Ngân Hàng */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  1.3 Tài Khoản Ngân Hàng Nhận Lương
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Chủ Tài Khoản *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="VD: TRẦN VĂN HOÀNG"
                      value={formData.bank_account_holder || formData.full_name?.toUpperCase() || ''}
                      onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg uppercase font-semibold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Số Tài Khoản Ngân Hàng *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="19038271625401"
                      value={formData.bank_account || ''}
                      onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-blue-700 dark:text-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Ngân Hàng *</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.bank_name || 'Techcombank'}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                    >
                      <option value="Techcombank">Techcombank (TCB)</option>
                      <option value="MBBank">MBBank Quân Đội (MBB)</option>
                      <option value="Vietcombank">Vietcombank (VCB)</option>
                      <option value="VietinBank">VietinBank (CTG)</option>
                      <option value="BIDV">BIDV (BID)</option>
                      <option value="VPBank">VPBank (VPB)</option>
                      <option value="ACB">ACB - Á Châu (ACB)</option>
                      <option value="TPBank">TPBank (TPB)</option>
                      <option value="Sacombank">Sacombank (STB)</option>
                      <option value="VIB">VIB - Quốc Tế (VIB)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Chi Nhánh Mở Thẻ</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      placeholder="Chi nhánh Cầu Giấy, Hà Nội"
                      value={formData.bank_branch || ''}
                      onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Custom fields for Tab 1 */}
              {renderCustomFieldsForTab('WORK_INFO')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: THÔNG TIN KHÁC (HỌC VẤN / KINH NGHIỆM / CHỨNG CHỈ) */}
          {/* ======================================================== */}
          {activeTab === 'OTHER_INFO' && (
            <div className="space-y-6 text-xs">
              {/* 2.1: Trình Độ Học Vấn */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    2.1 Trình Độ Học Vấn & Bằng Cấp Chuyên Môn
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEdu({
                          id: `edu_${Date.now()}`,
                          school_name: '',
                          degree_level: 'Cử Nhân',
                          major: '',
                          graduation_year: String(new Date().getFullYear()),
                          grade: 'Giỏi',
                        });
                        setIsEduModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Bằng Cấp / Học Vấn
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.education_history && formData.education_history.length > 0 ? (
                    formData.education_history.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">{edu.school_name}</span>
                          <p className="text-slate-600 dark:text-slate-400 text-xs">
                            {edu.degree_level} • Chuyên ngành: <strong>{edu.major}</strong> • Năm tốt nghiệp: <strong>{edu.graduation_year}</strong> ({edu.grade || 'Khá/Giỏi'})
                          </p>
                        </div>
                        {!isViewOnly && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEdu({ ...edu });
                                setIsEduModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  education_history: prev.education_history?.filter((e) => e.id !== edu.id),
                                }))
                              }
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic py-2">Chưa có thông tin bằng cấp / học vấn.</p>
                  )}
                </div>
              </div>

              {/* 2.2: Kinh Nghiệm Làm Việc Trước Đây */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    2.2 Lịch Sử Kinh Nghiệm Làm Việc Trước Khi Gia Nhập
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExp({
                          id: `exp_${Date.now()}`,
                          company_name: '',
                          position: '',
                          from_date: '2020-01',
                          to_date: '2023-12',
                          achievements: '',
                          reason_for_leaving: '',
                        });
                        setIsExpModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Kinh Nghiệm Công Tác
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.work_experience && formData.work_experience.length > 0 ? (
                    formData.work_experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                          <span>{exp.company_name} — <span className="text-blue-600">{exp.position}</span></span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{exp.from_date} → {exp.to_date}</span>
                            {!isViewOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    work_experience: prev.work_experience?.filter((e) => e.id !== exp.id),
                                  }))
                                }
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        {exp.achievements && <p className="text-slate-600 dark:text-slate-400 text-[11px]">Thành tích: {exp.achievements}</p>}
                        {exp.reason_for_leaving && <p className="text-slate-500 text-[10px] italic">Lý do chuyển việc: {exp.reason_for_leaving}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic py-2">Chưa có bản ghi kinh nghiệm công tác trước đây.</p>
                  )}
                </div>
              </div>

              {/* 2.3: Danh Mục Chứng Chỉ & Kỹ Năng Nghề */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    2.3 Chứng Chỉ Nghề Nghiệp, Ngoại Ngữ & TMĐT
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCert({
                          id: `cert_${Date.now()}`,
                          cert_name: '',
                          issued_by: '',
                          issue_date: new Date().toISOString().split('T')[0],
                          expiry_date: '',
                          cert_type: 'Chuyên Môn TMĐT',
                        });
                        setIsCertModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Chứng Chỉ
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.certificates && formData.certificates.length > 0 ? (
                    formData.certificates.map((cert, idx) => (
                      <div key={cert.id || idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block">{cert.cert_name}</span>
                          <span className="text-[11px] text-slate-500 block">Đơn vị cấp: {cert.issued_by} • Hạn: {cert.expiry_date || 'Vô thời hạn'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                            {cert.cert_type || 'Chứng Chỉ'}
                          </span>
                          {!isViewOnly && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  certificates: prev.certificates?.filter((c) => c.id !== cert.id),
                                }))
                              }
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic col-span-full py-2">Chưa có chứng chỉ nghiệp vụ nào.</p>
                  )}
                </div>
              </div>

              {/* Custom fields for Tab 2 */}
              {renderCustomFieldsForTab('OTHER_INFO')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: THÔNG TIN GIA ĐÌNH & NGƯỜI PHỤ THUỘC THUẾ TNCN */}
          {/* ======================================================== */}
          {activeTab === 'FAMILY_INFO' && (
            <div className="space-y-6 text-xs">
              {/* Top KPI Box (Lấy từ cấu hình hệ thống) */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Chính Sách Giảm Trừ Gia Cảnh Thuế Thu Nhập Cá Nhân
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
                    Mức giảm trừ gia cảnh theo <strong>Cấu hình hệ thống hiện hành</strong>: <strong>{formatCurrency(dependentDeductionRate)} /người phụ thuộc/tháng</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 block uppercase font-bold">Tổng Giảm Trừ NPT / Tháng</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 text-base">
                      {formatCurrency((formData.dependent_count || 0) * dependentDeductionRate)}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-sm">
                    {formData.dependent_count || 0} Người
                  </span>
                </div>
              </div>

              {/* Danh Sách Thân Nhân & Người Phụ Thuộc */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    3.1 Danh Sách Thân Nhân, Người Phụ Thuộc & Chứng Từ Kèm Theo ({formData.family_members?.length || 0})
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={handleAddFamilyMember}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Thân Nhân / NPT
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {formData.family_members && formData.family_members.length > 0 ? (
                    formData.family_members.map((fm, idx) => (
                      <div
                        key={fm.id || idx}
                        className={`p-3.5 rounded-xl border flex flex-col gap-3 ${
                          fm.is_dependent
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Họ Và Tên</label>
                            <input
                              type="text"
                              disabled={isViewOnly}
                              placeholder="Họ tên thân nhân"
                              value={fm.name}
                              onChange={(e) => {
                                const updated = [...(formData.family_members || [])];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setFormData({ ...formData, family_members: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border rounded-lg font-semibold text-slate-900 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Quan Hệ</label>
                            <select
                              disabled={isViewOnly}
                              value={fm.relationship}
                              onChange={(e) => {
                                const updated = [...(formData.family_members || [])];
                                updated[idx] = { ...updated[idx], relationship: e.target.value as any };
                                setFormData({ ...formData, family_members: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border rounded-lg font-medium"
                            >
                              <option value="Vợ">Vợ</option>
                              <option value="Chồng">Chồng</option>
                              <option value="Con">Con</option>
                              <option value="Bố">Bố</option>
                              <option value="Mẹ">Mẹ</option>
                              <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">CCCD / MST NPT</label>
                            <input
                              type="text"
                              disabled={isViewOnly}
                              placeholder="Số CCCD hoặc MST"
                              value={fm.tax_code || fm.id_card_number || ''}
                              onChange={(e) => {
                                const updated = [...(formData.family_members || [])];
                                updated[idx] = { ...updated[idx], tax_code: e.target.value, id_card_number: e.target.value };
                                setFormData({ ...formData, family_members: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Ngày Sinh</label>
                            <input
                              type="date"
                              disabled={isViewOnly}
                              value={fm.date_of_birth || ''}
                              onChange={(e) => {
                                const updated = [...(formData.family_members || [])];
                                updated[idx] = { ...updated[idx], date_of_birth: e.target.value };
                                setFormData({ ...formData, family_members: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Row 2: Giảm trừ gia cảnh & Chứng từ đính kèm */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <input
                                type="checkbox"
                                disabled={isViewOnly}
                                checked={fm.is_dependent}
                                onChange={() => handleToggleDependent(fm.id)}
                                className="w-4 h-4 text-emerald-600 rounded"
                              />
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs">
                                Đăng ký giảm trừ gia cảnh ({formatCurrency(dependentDeductionRate)})
                              </span>
                            </label>

                            {/* Upload Chứng Từ Giảm Trừ */}
                            <div className="flex items-center gap-2">
                              {fm.proof_document_name ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 rounded-lg text-xs font-semibold">
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[180px]">{fm.proof_document_name}</span>
                                  {!isViewOnly && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...(formData.family_members || [])];
                                        updated[idx] = { ...updated[idx], proof_document_name: undefined, proof_document_url: undefined };
                                        setFormData({ ...formData, family_members: updated });
                                      }}
                                      className="text-rose-500 hover:text-rose-700 ml-1"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                !isViewOnly && (
                                  <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-600">
                                    <FileUp className="w-3.5 h-3.5 text-blue-600" /> Upload Chứng Từ Giảm Trừ (Giấy khai sinh/CCCD)
                                    <input type="file" onChange={(e) => handleDependentProofUpload(idx, e)} className="hidden" />
                                  </label>
                                )
                              )}
                            </div>
                          </div>

                          {!isViewOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFamilyMember(fm.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer self-end sm:self-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-center py-4">Chưa có thông tin thân nhân.</p>
                  )}
                </div>
              </div>

              {/* 3.2: Người Liên Hệ Khẩn Cấp */}
              <div className="space-y-3 pt-2">
                <h3 className="font-semibold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  3.2 Người Liên Hệ Trong Trường Hợp Khẩn Cấp
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.emergency_contact?.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: { ...(formData.emergency_contact || { name: '', relationship: '', phone: '' }), name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Mối Quan Hệ</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.emergency_contact?.relationship || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: { ...(formData.emergency_contact || { name: '', relationship: '', phone: '' }), relationship: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Số Điện Thoại Khẩn Cấp</label>
                    <input
                      type="tel"
                      disabled={isViewOnly}
                      value={formData.emergency_contact?.phone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: { ...(formData.emergency_contact || { name: '', relationship: '', phone: '' }), phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg font-bold text-rose-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Địa Chỉ Liên Hệ</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.emergency_contact?.address || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: { ...(formData.emergency_contact || { name: '', relationship: '', phone: '' }), address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Custom fields for Tab 3 */}
              {renderCustomFieldsForTab('FAMILY_INFO')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: TÚI HỒ SƠ SỐ HÓA (CHO PHÉP TẠO NHIỀU LOẠI CHỨNG TỪ) */}
          {/* ======================================================== */}
          {activeTab === 'DOCUMENTS_BAG' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-semibold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-amber-600" />
                    4. Túi Hồ Sơ & Giấy Tờ Số Hóa ({formData.kyc_documents?.length || 0})
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    HR có thể chọn danh mục mặc định hoặc tự tạo thêm các loại chứng từ tùy ý để tải lên hồ sơ.
                  </p>
                </div>

                {!isViewOnly && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {!isCustomDocMode ? (
                      <>
                        <select
                          value={newDocCategory}
                          onChange={(e) => {
                            if (e.target.value === '__NEW_CUSTOM_TYPE__') {
                              setIsCustomDocMode(true);
                            } else {
                              setNewDocCategory(e.target.value);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="HĐLĐ_SCAN">Hợp Đồng Lao Động (Scan)</option>
                          <option value="CCCD_FRONT">Căn Cước Công Dân (Mặt trước)</option>
                          <option value="CCCD_BACK">Căn Cước Công Dân (Mặt sau)</option>
                          <option value="DIPLOMA">Bằng Tốt Nghiệp / Cử Nhân</option>
                          <option value="CERTIFICATE">Chứng Chỉ Nghiệp Vụ</option>
                          <option value="HEALTH_CERT">Giấy Khám Sức Khỏe</option>
                          <option value="APPOINTMENT_DECISION">Quyết Định Bổ Nhiệm</option>
                          <option value="NDA_COMMITMENT">Bản Cam Kết Bảo Mật Thông Tin (NDA)</option>
                          <option value="CV_RESUME">CV / Sơ Yếu Lý Lịch</option>
                          <option value="__NEW_CUSTOM_TYPE__">➕ Tạo Loại Chứng Từ Mới...</option>
                        </select>

                        <label className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Tải Tệp Lên
                          <input type="file" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <input
                          type="text"
                          placeholder="Nhập tên loại chứng từ mới (VD: Giấy phép lái xe B2)..."
                          value={customDocTypeInput}
                          onChange={(e) => setCustomDocTypeInput(e.target.value)}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 border rounded text-xs w-64 font-medium"
                          autoFocus
                        />
                        <label className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Tải Lên Loại Này
                          <input type="file" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomDocMode(false)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-200 rounded"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.kyc_documents && formData.kyc_documents.length > 0 ? (
                  formData.kyc_documents.map((doc) => (
                    <div key={doc.doc_id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3">
                      <div className="space-y-1 truncate">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">{doc.doc_name}</span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">{doc.doc_type}</span>
                          <span className="text-slate-400">{doc.uploaded_at}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`https://${doc.file_r2_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem
                        </a>
                        {!isViewOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.doc_id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic col-span-full text-center py-6">Chưa có tài liệu đính kèm.</p>
                )}
              </div>

              {/* Custom fields for Tab 4 */}
              {renderCustomFieldsForTab('DOCUMENTS_BAG')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: QUÁ TRÌNH LÀM VIỆC (LẤY TỪ HỆ THỐNG) */}
          {/* ======================================================== */}
          {activeTab === 'WORK_PROCESS' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="font-semibold uppercase text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    5. Lịch Sử Điều Chuyển, Thăng Tiến & Quá Trình Công Tác Hệ Thống
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Dữ liệu được trích xuất trực tiếp từ các quyết định nhân sự và lịch sử điều chỉnh ngạch bậc trên hệ thống.
                  </p>
                </div>
                {!isViewOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWorkProcess({
                        id: `wp_${Date.now()}`,
                        effective_date: new Date().toISOString().split('T')[0],
                        decision_number: `QĐ-${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}-GGBG`,
                        old_position: formData.position || 'Chuyên Viên',
                        new_position: formData.position || 'Trưởng Nhóm',
                        old_department: formData.department || 'Phòng Kinh Doanh 1',
                        new_department: formData.department || 'Phòng Kinh Doanh 1',
                        old_salary: formData.base_salary || 15000000,
                        new_salary: formData.base_salary || 18000000,
                        approved_by: 'Tổng Giám Đốc',
                      });
                      setIsWorkProcessModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ghi Nhận Quyết Định Bổ Nhiệm / Điều Chuyển
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {formData.work_process && formData.work_process.length > 0 ? (
                  formData.work_process.map((wp, idx) => (
                    <div key={wp.id || idx} className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-200">
                        <span>Quyết Định: {wp.decision_number}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{wp.effective_date}</span>
                          {!isViewOnly && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  work_process: prev.work_process?.filter((w) => w.id !== wp.id),
                                }))
                              }
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Chức vụ & Vị trí: <span className="line-through text-slate-400">{wp.old_position}</span> ➔ <strong className="text-blue-700 dark:text-blue-300">{wp.new_position}</strong>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Phòng ban: {wp.old_department} ➔ <strong>{wp.new_department}</strong>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Mức lương thỏa thuận: {formatVND(wp.old_salary)} ➔ <strong className="text-emerald-700">{formatVND(wp.new_salary)}</strong> • Người duyệt: {wp.approved_by}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-center py-4">Chưa có biến động quá trình làm việc.</p>
                )}
              </div>

              {/* Custom fields for Tab 5 */}
              {renderCustomFieldsForTab('WORK_PROCESS')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: KHEN THƯỞNG & KỶ LUẬT (HR NHẬP TRỰC TIẾP) */}
          {/* ======================================================== */}
          {activeTab === 'REWARDS_DISCIPLINE' && (
            <div className="space-y-6 text-xs">
              {/* 6.1: Khen Thưởng */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    6.1 Danh Sách Khen Thưởng & Thành Tích Xuất Sắc
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReward({
                          id: `rw_${Date.now()}`,
                          decision_number: `QĐKT-${new Date().getFullYear()}/${String(Math.floor(Math.random() * 90) + 10)}`,
                          reward_date: new Date().toISOString().split('T')[0],
                          reward_type: 'Bằng Khen & Tiền Thưởng Xuất Sắc',
                          amount: 5000000,
                          reason: '',
                        });
                        setIsRewardModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Quyết Định Khen Thưởng
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.rewards && formData.rewards.length > 0 ? (
                    formData.rewards.map((rw, idx) => (
                      <div key={rw.id || idx} className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                        <div className="flex justify-between font-semibold text-amber-900 dark:text-amber-200">
                          <span>{rw.decision_number} — {rw.reward_type}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-700">+{formatVND(rw.amount)}</span>
                            {!isViewOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    rewards: prev.rewards?.filter((r) => r.id !== rw.id),
                                  }))
                                }
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{rw.reason}</p>
                        <span className="text-[10px] text-slate-400 block">Ngày quyết định: {rw.reward_date}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Chưa có bản ghi khen thưởng.</p>
                  )}
                </div>
              </div>

              {/* 6.2: Kỷ Luật */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    6.2 Lịch Sử Kỷ Luật Lao Động
                  </h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDiscipline({
                          id: `disc_${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          form: 'Khiển trách',
                          violation: '',
                          note: '',
                        });
                        setIsDisciplineModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ghi Nhận Xử Lý Kỷ Luật
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.disciplinary_records && formData.disciplinary_records.length > 0 ? (
                    formData.disciplinary_records.map((disc, idx) => (
                      <div key={disc.id || idx} className="p-3.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1">
                        <div className="flex justify-between font-semibold text-rose-900 dark:text-rose-200">
                          <span>Hình thức: <strong className="text-rose-700">{disc.form}</strong></span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{disc.date}</span>
                            {!isViewOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    disciplinary_records: prev.disciplinary_records?.filter((d) => d.id !== disc.id),
                                  }))
                                }
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">Hành vi vi phạm: {disc.violation}</p>
                        {disc.note && <p className="text-slate-500 text-[11px] italic">Ghi chú: {disc.note}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Không có quyết định kỷ luật nào đối với nhân sự này.</p>
                  )}
                </div>
              </div>

              {/* Custom fields for Tab 6 */}
              {renderCustomFieldsForTab('REWARDS_DISCIPLINE')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: TIỂU SỬ & TRƯỜNG TÙY BIẾN MỞ RỘNG */}
          {/* ======================================================== */}
          {activeTab === 'PERSONAL_HISTORY' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <h3 className="font-semibold uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  7.1 Sơ Lược Tiểu Sử Bản Thân & Đánh Giá Của HR
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                  <div>
                    <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">Tiểu Sử Quá Trình Phát Triển:</label>
                    <textarea
                      rows={3}
                      disabled={isViewOnly}
                      value={formData.personal_biography || ''}
                      onChange={(e) => setFormData({ ...formData, personal_biography: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">Ghi Chú Đánh Giá & Quy Hoạch Cán Bộ:</label>
                    <textarea
                      rows={2}
                      disabled={isViewOnly}
                      value={formData.special_notes || ''}
                      onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Custom Fields Section */}
              {renderCustomFieldsForTab('PERSONAL_HISTORY')}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: LỊCH SỬ LƯƠNG, NGẠCH BẬC & PHỤ CẤP CHI TIẾT */}
          {/* ======================================================== */}
          {activeTab === 'SALARY_HISTORY' && (
            <div className="space-y-6 text-xs">
              {/* 8.1: Bảng Ngạch Bậc Hiện Tại */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    8.1 Cấu Trúc Ngạch Lương & Bậc Lương Đang Áp Dụng
                  </h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                    {formData.salary_grade || 'G4'} — Bậc {formData.salary_step_number || 1} (Hệ số {currentStep?.coefficient || 1.6})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Lương P1 Chức Danh</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm block">
                      {formatCurrency(formData.base_salary || 0)}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Lương Căn Cứ Đóng BHXH</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 text-sm block">
                      {formatCurrency(formData.insurance_salary || 0)}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Lương Thử Việc ({formData.probation_rate || 85}%)</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400 text-sm block">
                      {formatCurrency(formData.probation_salary || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 8.2: Danh Mục Phụ Cấp Nhân Sự */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-semibold uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-600" />
                    8.2 Danh Mục Phụ Cấp Riêng ({formData.allowances?.length || 0})
                  </h3>
                  {!isViewOnly && (
                    <select
                      onChange={(e) => {
                        const catalogId = e.target.value;
                        if (!catalogId) return;
                        const catalogItem = getAllowanceCatalog().find((c) => c.id === catalogId);
                        if (catalogItem) {
                          const currentAllowances = formData.allowances || [];
                          setFormData({
                            ...formData,
                            allowances: [
                              ...currentAllowances,
                              {
                                id: `al_${Date.now()}`,
                                allowance_type_id: catalogItem.id,
                                name: catalogItem.name,
                                amount: catalogItem.default_amount,
                                taxable: catalogItem.is_taxable_pit,
                                tax_exempt_cap: catalogItem.tax_exempt_cap,
                                include_in_insurance: catalogItem.is_social_insurance,
                              },
                            ],
                          });
                        }
                        e.target.value = '';
                      }}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="">+ Thêm Từ Danh Mục Phụ Cấp</option>
                      {getAllowanceCatalog().map((al) => (
                        <option key={al.id} value={al.id}>
                          {al.name} ({formatCurrency(al.default_amount)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.allowances?.map((a, idx) => (
                    <div key={a.id || idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between gap-3">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">{a.name}</span>
                        <div className="flex items-center gap-2 text-[10px] mt-0.5">
                          {a.tax_exempt_cap && a.tax_exempt_cap > 0 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Miễn thuế đến {formatCurrency(a.tax_exempt_cap)}
                            </span>
                          ) : (
                            <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              Chịu thuế TNCN
                            </span>
                          )}
                          {a.include_in_insurance ? (
                            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                              Đóng BHXH
                            </span>
                          ) : (
                            <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Không BHXH
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700 text-sm">{formatCurrency(a.amount)}</span>
                        {!isViewOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.allowances || []).filter((_, i) => i !== idx);
                              setFormData({ ...formData, allowances: updated });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8.3: Lịch Sử Nâng Bậc Lương */}
              <div className="space-y-3">
                <h3 className="font-semibold uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  8.3 Nhật Ký Nâng Lương & Nâng Bậc Qua Các Thời Kỳ
                </h3>
                <div className="space-y-2">
                  {formData.salary_history?.map((sh, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">{sh.type} — {sh.note}</span>
                        <span className="text-[10px] text-slate-400">Hiệu lực từ: {sh.effective_date}</span>
                      </div>
                      <span className="font-bold text-emerald-700 text-sm">{formatCurrency(sh.to_salary)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom fields for Tab 8 */}
              {renderCustomFieldsForTab('SALARY_HISTORY')}
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-xs cursor-pointer"
            >
              Đóng
            </button>
            {!isViewOnly && (
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Lưu Hồ Sơ Nhân Sự (8 Mục)
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM / SỬA HỌC VẤN */}
      {/* ======================================================== */}
      {isEduModalOpen && editingEdu && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Thêm / Chỉnh Sửa Trình Độ Học Vấn
              </h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const exists = formData.education_history?.some((ed) => ed.id === editingEdu.id);
                if (exists) {
                  setFormData((prev) => ({
                    ...prev,
                    education_history: prev.education_history?.map((ed) => (ed.id === editingEdu.id ? editingEdu : ed)),
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    education_history: [...(prev.education_history || []), editingEdu],
                  }));
                }
                setIsEduModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-medium mb-1">Tên Trường Đại Học / Cao Đẳng *</label>
                <input
                  type="text"
                  required
                  list="ggbg-universities-list"
                  placeholder="Chọn từ danh sách hoặc tự nhập..."
                  value={editingEdu.school_name}
                  onChange={(e) => setEditingEdu({ ...editingEdu, school_name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Bằng Cấp *</label>
                  <select
                    value={editingEdu.degree_level}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree_level: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                  >
                    <option value="Cử Nhân">Cử Nhân</option>
                    <option value="Thạc Sĩ">Thạc Sĩ</option>
                    <option value="Tiến Sĩ">Tiến Sĩ</option>
                    <option value="Kỹ Sư">Kỹ Sư</option>
                    <option value="Cao Đẳng">Cao Đẳng</option>
                    <option value="Trung Cấp">Trung Cấp</option>
                    <option value="Chứng Chỉ Nghề">Chứng Chỉ Nghề</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Năm Tốt Nghiệp</label>
                  <input
                    type="number"
                    value={editingEdu.graduation_year}
                    onChange={(e) => setEditingEdu({ ...editingEdu, graduation_year: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Chuyên Ngành Đào Tạo *</label>
                <input
                  type="text"
                  required
                  list="ggbg-majors-list"
                  placeholder="Chọn chuyên ngành hoặc tự nhập..."
                  value={editingEdu.major}
                  onChange={(e) => setEditingEdu({ ...editingEdu, major: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Xếp Loại Tốt Nghiệp</label>
                <select
                  value={editingEdu.grade || 'Giỏi'}
                  onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                >
                  <option value="Xuất Sắc">Xuất Sắc</option>
                  <option value="Giỏi">Giỏi</option>
                  <option value="Khá">Khá</option>
                  <option value="Trung Bình">Trung Bình</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM KINH NGHIỆM */}
      {/* ======================================================== */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Thêm Kinh Nghiệm Làm Việc
              </h3>
              <button onClick={() => setIsExpModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  work_experience: [...(prev.work_experience || []), editingExp],
                }));
                setIsExpModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-medium mb-1">Công Ty / Tổ Chức *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty Cổ phần Vận Hành TMĐT..."
                  value={editingExp.company_name}
                  onChange={(e) => setEditingExp({ ...editingExp, company_name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Vị Trí / Chức Danh *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Chuyên Viên Vận Hành Shopee"
                  value={editingExp.position}
                  onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Từ Tháng/Năm</label>
                  <input
                    type="text"
                    placeholder="2020-01"
                    value={editingExp.from_date}
                    onChange={(e) => setEditingExp({ ...editingExp, from_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Đến Tháng/Năm</label>
                  <input
                    type="text"
                    placeholder="2023-12"
                    value={editingExp.to_date}
                    onChange={(e) => setEditingExp({ ...editingExp, to_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Thành Tích Đạt Được</label>
                <input
                  type="text"
                  placeholder="VD: Tăng 200% doanh số chi nhánh..."
                  value={editingExp.achievements || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, achievements: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Lý Do Chuyển Việc</label>
                <input
                  type="text"
                  placeholder="VD: Tìm kiếm cơ hội thăng tiến..."
                  value={editingExp.reason_for_leaving || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, reason_for_leaving: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM CHỨNG CHỈ */}
      {/* ======================================================== */}
      {isCertModalOpen && editingCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Thêm Chứng Chỉ Nghề Nghiệp & TMĐT
              </h3>
              <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  certificates: [...(prev.certificates || []), editingCert],
                }));
                setIsCertModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-medium mb-1">Tên Chứng Chỉ *</label>
                <input
                  type="text"
                  required
                  list="ggbg-certs-list"
                  placeholder="Chọn chứng chỉ gợi ý hoặc tự nhập..."
                  value={editingCert.cert_name}
                  onChange={(e) => setEditingCert({ ...editingCert, cert_name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Đơn Vị Cấp *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Shopee Vietnam Academy, TikTok Shop, RMIT..."
                  value={editingCert.issued_by}
                  onChange={(e) => setEditingCert({ ...editingCert, issued_by: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Ngày Cấp</label>
                  <input
                    type="date"
                    value={editingCert.issue_date}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ngày Hết Hạn</label>
                  <input
                    type="date"
                    value={editingCert.expiry_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiry_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Phân Loại Chứng Chỉ</label>
                <select
                  value={editingCert.cert_type || 'Chuyên Môn TMĐT'}
                  onChange={(e) => setEditingCert({ ...editingCert, cert_type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-medium"
                >
                  <option value="Chuyên Môn TMĐT">Chuyên Môn TMĐT</option>
                  <option value="Ngoại Ngữ">Ngoại Ngữ</option>
                  <option value="Quản Lý / Agile">Quản Lý / Agile</option>
                  <option value="Kỹ Thuật / Cloud">Kỹ Thuật / Cloud</option>
                  <option value="Chứng Chỉ Khác">Chứng Chỉ Khác</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM QUÁ TRÌNH LÀM VIỆC / ĐIỀU CHUYỂN */}
      {/* ======================================================== */}
      {isWorkProcessModalOpen && editingWorkProcess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Ghi Nhận Biến Động Công Tác / Bổ Nhiệm
              </h3>
              <button onClick={() => setIsWorkProcessModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  work_process: [...(prev.work_process || []), editingWorkProcess],
                }));
                setIsWorkProcessModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Số Quyết Định *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkProcess.decision_number}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, decision_number: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ngày Hiệu Lực *</label>
                  <input
                    type="date"
                    required
                    value={editingWorkProcess.effective_date}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, effective_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Vị Trí Cũ</label>
                  <input
                    type="text"
                    value={editingWorkProcess.old_position}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, old_position: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Vị Trí Mới (Bổ Nhiệm) *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkProcess.new_position}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, new_position: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-blue-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Phòng Ban Cũ</label>
                  <input
                    type="text"
                    value={editingWorkProcess.old_department}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, old_department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Phòng Ban Mới *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkProcess.new_department}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, new_department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Mức Lương Mới (VNĐ)</label>
                  <input
                    type="number"
                    step="500000"
                    value={editingWorkProcess.new_salary || 0}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, new_salary: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Người Ký Duyệt *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkProcess.approved_by}
                    onChange={(e) => setEditingWorkProcess({ ...editingWorkProcess, approved_by: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWorkProcessModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                  Lưu Quyết Định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM KHEN THƯỞNG */}
      {/* ======================================================== */}
      {isRewardModalOpen && editingReward && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Ghi Nhận Quyết Định Khen Thưởng
              </h3>
              <button onClick={() => setIsRewardModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  rewards: [...(prev.rewards || []), editingReward],
                }));
                setIsRewardModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Số Quyết Định *</label>
                  <input
                    type="text"
                    required
                    value={editingReward.decision_number}
                    onChange={(e) => setEditingReward({ ...editingReward, decision_number: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ngày Khen Thưởng *</label>
                  <input
                    type="date"
                    required
                    value={editingReward.reward_date}
                    onChange={(e) => setEditingReward({ ...editingReward, reward_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Hình Thức Khen Thưởng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bằng khen Tổng Giám Đốc, Thưởng nóng dự án..."
                  value={editingReward.reward_type}
                  onChange={(e) => setEditingReward({ ...editingReward, reward_type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Số Tiền Thưởng (VNĐ)</label>
                <input
                  type="number"
                  step="500000"
                  value={editingReward.amount || 0}
                  onChange={(e) => setEditingReward({ ...editingReward, amount: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-bold text-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Lý Do / Thành Tích Khen Thưởng *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả thành tích xuất sắc..."
                  value={editingReward.reason}
                  onChange={(e) => setEditingReward({ ...editingReward, reason: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRewardModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold">
                  Lưu Quyết Định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: THÊM KỶ LUẬT */}
      {/* ======================================================== */}
      {isDisciplineModalOpen && editingDiscipline && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Ghi Nhận Xử Lý Kỷ Luật Lao Động
              </h3>
              <button onClick={() => setIsDisciplineModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData((prev) => ({
                  ...prev,
                  disciplinary_records: [...(prev.disciplinary_records || []), editingDiscipline],
                }));
                setIsDisciplineModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Hình Thức Kỷ Luật *</label>
                  <select
                    value={editingDiscipline.form}
                    onChange={(e) => setEditingDiscipline({ ...editingDiscipline, form: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2 font-semibold text-rose-700"
                  >
                    <option value="Khiển trách">Khiển trách</option>
                    <option value="Kéo dài thời hạn nâng lương">Kéo dài thời hạn nâng lương</option>
                    <option value="Cách chức">Cách chức</option>
                    <option value="Sa thải">Sa thải</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Ngày Xử Lý *</label>
                  <input
                    type="date"
                    required
                    value={editingDiscipline.date}
                    onChange={(e) => setEditingDiscipline({ ...editingDiscipline, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Hành Vi Vi Phạm *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả chi tiết hành vi vi phạm nội quy..."
                  value={editingDiscipline.violation}
                  onChange={(e) => setEditingDiscipline({ ...editingDiscipline, violation: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Ghi Chú & Biện Pháp Khắc Phục</label>
                <input
                  type="text"
                  placeholder="Thời hạn chấp hành..."
                  value={editingDiscipline.note || ''}
                  onChange={(e) => setEditingDiscipline({ ...editingDiscipline, note: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDisciplineModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold">
                  Lưu Kỷ Luật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Datalists for Tab 2 Quick Autocomplete / Droplists */}
      <datalist id="ggbg-universities-list">
        <option value="Đại Học Kinh Tế Quốc Dân (NEU)" />
        <option value="Đại Học Ngoại Thương (FTU)" />
        <option value="Đại Học Bách Khoa Hà Nội (HUST)" />
        <option value="Đại Học Quốc Gia Hà Nội (VNU)" />
        <option value="Đại Học Thương Mại (TMU)" />
        <option value="Học Viện Tài Chính (AOF)" />
        <option value="Học Viện Ngân Hàng (BAV)" />
        <option value="Học Viện Công Nghệ Bưu Chính Viễn Thông (PTIT)" />
        <option value="Đại Học RMIT Việt Nam" />
        <option value="Đại Học FPT" />
        <option value="Đại Học Kinh Tế TP.HCM (UEH)" />
        <option value="Đại Học Bách Khoa TP.HCM" />
      </datalist>

      <datalist id="ggbg-majors-list">
        <option value="Quản Trị Kinh Doanh (E-Commerce)" />
        <option value="Marketing & Truyền Thông Số" />
        <option value="Kinh Doanh Quốc Tế & Logistics" />
        <option value="Công Nghệ Thông Tin / Khoa Học Máy Tính" />
        <option value="Hệ Thống Thông Tin Quản Lý (MIS)" />
        <option value="Kế Toán & Kiểm Toán Doanh Nghiệp" />
        <option value="Tài Chính - Ngân Hàng" />
        <option value="Quản Trị Nhân Lực & Quan Hệ Lao Động" />
        <option value="Thiết Kế Đồ Họa & UI/UX" />
        <option value="Ngôn Ngữ Anh Thương Mại" />
        <option value="Ngôn Ngữ Trung Quốc Thương Mại" />
      </datalist>

      <datalist id="ggbg-certs-list">
        <option value="Shopee Certified Master - Vận Hành Gian Hàng TMĐT" />
        <option value="TikTok Shop Partner (TSP) Certified Specialist" />
        <option value="Lazada Certified Seller & Store Operations" />
        <option value="Google Ads Search & Performance Max Certification" />
        <option value="Meta Certified Digital Marketing Associate" />
        <option value="IELTS Academic 7.5+" />
        <option value="TOEIC 850+" />
        <option value="HSK 5 / HSK 6 Tiếng Trung" />
        <option value="PMP - Project Management Professional" />
        <option value="Scrum Master Certified (PSM I)" />
        <option value="Chứng Chỉ Kế Toán Trưởng Doanh Nghiệp" />
      </datalist>
    </div>
  );
}
