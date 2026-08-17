import {
  EmployeeProfile,
  OrgNode,
  ApprovalAuditStep,
  EmployeeAllowanceItem,
  AllowanceCatalogItem,
  SalaryGradeScale,
  SalaryStepItem,
  TaxAndInsurancePolicyVersion,
  CompensationHistoryRecord,
  WorkShift,
  ShiftAssignment,
  RecruitmentEmailTemplate,
  EmailLogEntry,
  DocumentTemplate,
  GeneratedDocument,
  SocialInsuranceProfile,
  BhxhChangeLogRecord,
  SocialInsuranceConfig,
  Candidate,
  BhxhParticipationStatus,
  EmailTemplateType,
  HolidayDefinition,
  WeekendPolicySettings
} from '@/types';

export const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'e1',
    gender: 'Nam', date_of_birth: '1992-04-12', nationality: 'Việt Nam',
    education_level: 'Đại học', skill_level: 'Bậc 4/5',
    bhxh_status: 'Đang tham gia', base_salary: 26000000, probation_salary: 22100000, insurance_salary: 17000000, target_p3_salary: 8000000,
    salary_grade: 'G4', salary_grade_id: 'sg_g4', salary_step_number: 3, dependent_count: 1,
    default_shift_id: 'shift_office',
    allowances: [
      { id: 'al_e1_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'al_e1_2', allowance_type_id: 'al_4', name: 'Phụ Cấp Trách Nhiệm Quản Lý', amount: 2000000, taxable: true, include_in_insurance: true },
      { id: 'al_e1_3', allowance_type_id: 'al_3', name: 'Phụ Cấp Điện Thoại', amount: 300000, taxable: false, tax_exempt_cap: 300000, include_in_insurance: false },
    ],
    salary_history: [
      { effective_date: '2025-03-15', type: 'Nâng bậc', from_salary: 18000000, to_salary: 22000000, note: 'Bậc 1 → Bậc 2 (G4)' },
      { effective_date: '2025-09-01', type: 'Nâng bậc', from_salary: 22000000, to_salary: 26000000, note: 'Nâng Bậc 3 (G4) - Đạt 150% KPI Quý 2' },
    ],
    annual_leave_days: 12, leave_taken_days: 5, overtime_hours: 24,
    training_records: [
      { name: 'Kỹ năng quản lý đội nhóm Sale', type: 'Bồi dưỡng', institution: 'GGBingo Academy', start_date: '2025-05-10', end_date: '2025-05-14', result: 'Đạt' },
    ],
    disciplinary_records: [], occupational_incidents: [],
    employee_code: 'NV-00101',
    full_name: 'Trần Văn Hoàng',
    email: 'hoang.tv@ggbingo.vn',
    phone: '0912 345 678',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 1',
    position: 'Trưởng Nhóm Sale',
    job_title: 'Chuyên Viên Tư Vấn Giải Pháp',
    joined_date: '2025-03-15',
    status: 'Active',
    contract_number: 'HĐLĐ-2025/001',
    contract_type: 'Chính thức',
    contract_start_date: '2025-03-15',
    contract_end_date: '2028-03-14',
    contract_file_r2: 'storage.ggbingo.vn/contracts/HDLD_NV00101.pdf',
    id_card_number: '001092837465',
    id_card_issue_date: '2021-05-10',
    id_card_issue_place: 'Cục Cảnh Sát QLHC về Trật Tự Xã Hội',
    permanent_address: 'Số 18 Nguyễn Chánh, Q. Cầu Giấy, Hà Nội',
    temporary_address: 'Đường Lê Lai, Quận 1, TP. Hồ Chí Minh',
    social_insurance_code: '7910928374',
    health_insurance_code: 'DN4010928374',
    personal_tax_code: '8091823746',
    bank_account_holder: 'TRẦN VĂN HOÀNG',
    bank_account: '19038271625401',
    bank_name: 'Techcombank',
    bank_branch: 'Chi nhánh Cầu Giấy, Hà Nội',
    direct_manager_name: 'Phạm Minh Đức (Giám Đốc Kinh Doanh)',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    direct_manager_approved: true,
    sales_director_approved: true,
    approval_history: [
      { stage_name: 'Đề xuất tạo nhân sự', actor_name: 'Đặng Kim Anh', actor_role: 'HR Manager', action: 'SUBMIT', timestamp: '2025-03-10 09:00' },
      { stage_name: 'Phê duyệt Quản lý Trực tiếp', actor_name: 'Trần Văn Hoàng', actor_role: 'Leader', action: 'APPROVE', note: 'Đạt yêu cầu thử việc', timestamp: '2025-03-11 14:30' },
      { stage_name: 'Phê duyệt Giám đốc Kinh doanh', actor_name: 'Phạm Minh Đức', actor_role: 'Sales Director', action: 'APPROVE', note: 'Đồng ý tiếp nhận nhân sự', timestamp: '2025-03-12 10:15' }
    ],
    created_at: '2025-03-15',
  },
  {
    id: 'e2',
    gender: 'Nữ', date_of_birth: '1996-09-20', nationality: 'Việt Nam',
    education_level: 'Cao đẳng', skill_level: 'Bậc 3/5',
    bhxh_status: 'Đang tham gia', base_salary: 14500000, probation_salary: 12325000, insurance_salary: 8500000, target_p3_salary: 5000000,
    salary_grade: 'G3', salary_grade_id: 'sg_g3', salary_step_number: 2, dependent_count: 0,
    allowances: [
      { id: 'al_e2_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'al_e2_2', allowance_type_id: 'al_2', name: 'Phụ Cấp Xăng Xe & Đi Lại', amount: 500000, taxable: false, tax_exempt_cap: 500000, include_in_insurance: false },
    ],
    salary_history: [
      { effective_date: '2025-06-01', type: 'Nâng bậc', from_salary: 12000000, to_salary: 14500000, note: 'Hết thử việc ➔ Ký HĐLĐ Bậc 2 (G3)' },
    ],
    annual_leave_days: 12, leave_taken_days: 3, overtime_hours: 10,
    training_records: [
      { name: 'Nghiệp vụ tư vấn khách hàng TMĐT', type: 'Đào tạo', institution: 'GGBingo Academy', start_date: '2025-06-05', end_date: '2025-06-07', result: 'Đạt' },
    ],
    employee_code: 'NV-00102',
    full_name: 'Lê Thị Mai',
    email: 'mai.lt@ggbingo.vn',
    phone: '0988 765 432',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 2',
    team: 'Đội 3',
    position: 'Chuyên Viên Sale',
    job_title: 'Chuyên Viên Phát Triển Khách Hàng',
    joined_date: '2025-06-01',
    status: 'Active',
    contract_number: 'HĐLĐ-2025/042',
    contract_type: 'Chính thức',
    contract_start_date: '2025-06-01',
    contract_end_date: '2027-06-01',
    contract_file_r2: 'storage.ggbingo.vn/contracts/HDLD_NV00102.pdf',
    id_card_number: '031094857362',
    id_card_issue_date: '2022-01-15',
    id_card_issue_place: 'Cục Cảnh Sát QLHC',
    permanent_address: 'Quận Hai Bà Trưng, Hà Nội',
    temporary_address: 'Quận Đống Đa, Hà Nội',
    social_insurance_code: '7910928888',
    health_insurance_code: 'DN4010928888',
    personal_tax_code: '8392019485',
    bank_account_holder: 'LÊ THỊ MAI',
    bank_account: '1029384756',
    bank_name: 'MBBank',
    bank_branch: 'Chi nhánh Hoàn Kiếm, Hà Nội',
    direct_manager_name: 'Trần Văn Hoàng (Trưởng Nhóm Sale)',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    direct_manager_approved: true,
    sales_director_approved: true,
    created_at: '2025-06-01',
  },
  {
    id: 'e3',
    gender: 'Nữ', date_of_birth: '1990-02-05', nationality: 'Việt Nam',
    education_level: 'Đại học', skill_level: 'Bậc 5/5',
    bhxh_status: 'Đang tham gia', base_salary: 32000000, probation_salary: 27200000, insurance_salary: 20000000, target_p3_salary: 10000000,
    salary_grade: 'G5', salary_grade_id: 'sg_g5', salary_step_number: 2, dependent_count: 2,
    allowances: [
      { id: 'al_e3_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'al_e3_2', allowance_type_id: 'al_4', name: 'Phụ Cấp Trách Nhiệm Quản Lý', amount: 3000000, taxable: true, include_in_insurance: true },
      { id: 'al_e3_3', allowance_type_id: 'al_3', name: 'Phụ Cấp Điện Thoại', amount: 500000, taxable: true, tax_exempt_cap: 300000, include_in_insurance: false },
    ],
    salary_history: [
      { effective_date: '2024-11-10', type: 'Nâng bậc', from_salary: 26000000, to_salary: 26000000, note: 'Bổ nhiệm G5 - Bậc 1' },
      { effective_date: '2025-11-01', type: 'Nâng bậc', from_salary: 26000000, to_salary: 32000000, note: 'Nâng G5 - Bậc 2 theo thâm niên 12 tháng' },
    ],
    annual_leave_days: 14, leave_taken_days: 8, overtime_hours: 6,
    employee_code: 'NV-00103',
    full_name: 'Đặng Kim Anh',
    email: 'anh.dk@ggbingo.vn',
    phone: '0936 123 999',
    avatar_url: '',
    department: 'Phòng Nhân Sự (HR)',
    team: 'HR Admin',
    position: 'Quản Lý HR',
    job_title: 'Chuyên Gia Quản Trị Nhân Sự & C&B',
    joined_date: '2024-11-10',
    status: 'Active',
    contract_number: 'HĐLĐ-2024/088',
    contract_type: 'Chính thức',
    contract_start_date: '2024-11-10',
    contract_end_date: '2027-11-10',
    contract_file_r2: 'storage.ggbingo.vn/contracts/HDLD_NV00103.pdf',
    id_card_number: '001193847261',
    id_card_issue_date: '2020-08-20',
    id_card_issue_place: 'Cục Cảnh Sát QLHC',
    permanent_address: 'Quận Ba Đình, Hà Nội',
    temporary_address: 'Quận Tây Hồ, Hà Nội',
    social_insurance_code: '7910929999',
    health_insurance_code: 'DN4010929999',
    personal_tax_code: '8102938471',
    bank_account_holder: 'ĐẶNG KIM ANH',
    bank_account: '999888777666',
    bank_name: 'Vietcombank',
    bank_branch: 'Chi nhánh Ba Đình, Hà Nội',
    direct_manager_name: 'Super Admin GGBingo',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    direct_manager_approved: true,
    sales_director_approved: true,
    created_at: '2024-11-10',
  },
  {
    id: 'e4',
    gender: 'Nam', date_of_birth: '1999-11-30', nationality: 'Việt Nam',
    education_level: 'Cao đẳng', skill_level: 'Bậc 2/5',
    bhxh_status: 'Chưa tham gia', base_salary: 11500000, probation_salary: 9775000, insurance_salary: 7500000, target_p3_salary: 4000000,
    salary_grade: 'G2', salary_grade_id: 'sg_g2', salary_step_number: 3, dependent_count: 0,
    allowances: [
      { id: 'al_e4_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    ],
    annual_leave_days: 6, leave_taken_days: 1, overtime_hours: 12,
    training_records: [
      { name: 'Vận hành & tối ưu gian hàng Shopee/TikTok', type: 'Học nghề', institution: 'GGBingo Academy', start_date: '2026-01-16', end_date: '2026-01-20', result: 'Đang học' },
    ],
    employee_code: 'NV-00104',
    full_name: 'Nguyễn Quốc Tuấn',
    email: 'tuan.nq@ggbingo.vn',
    phone: '0977 888 111',
    avatar_url: '',
    department: 'Phòng Vận Hành TMĐT',
    team: 'Đội Shopee/TikTok',
    position: 'Chuyên Viên Tối Ưu Gian Hàng',
    job_title: 'Kỹ Thuật Viên Vận Hành Sàn TMĐT',
    joined_date: '2026-01-15',
    status: 'Probation',
    contract_number: 'HĐTV-2026/005',
    contract_type: 'Thử việc',
    contract_start_date: '2026-01-15',
    contract_end_date: '2026-03-15',
    contract_file_r2: 'storage.ggbingo.vn/contracts/HDTV_NV00104.pdf',
    id_card_number: '025091827364',
    id_card_issue_date: '2023-03-12',
    id_card_issue_place: 'Cục Cảnh Sát QLHC',
    permanent_address: 'TP. Hải Phòng',
    temporary_address: 'Quận Cầu Giấy, Hà Nội',
    social_insurance_code: '7910927777',
    health_insurance_code: 'DN4010927777',
    personal_tax_code: '8493029184',
    bank_account_holder: 'NGUYỄN QUỐC TUẤN',
    bank_account: '0977888111',
    bank_name: 'VPBank',
    bank_branch: 'Chi nhánh Hà Nội',
    direct_manager_name: 'Vũ Nam Khánh (Trưởng Phòng Vận Hành)',
    approval_status: 'PENDING_SALES_DIRECTOR',
    direct_manager_approved: true,
    sales_director_approved: false,
    approval_history: [
      { stage_name: 'Tạo mới hồ sơ', actor_name: 'Đặng Kim Anh', actor_role: 'HR Admin', action: 'SUBMIT', timestamp: '2026-01-14 08:30' },
      { stage_name: 'Duyệt Quản lý trực tiếp', actor_name: 'Vũ Nam Khánh', actor_role: 'Trưởng Phòng Vận Hành', action: 'APPROVE', note: 'Văn phong và kinh nghiệm phù hợp', timestamp: '2026-01-14 11:00' }
    ],
    created_at: '2026-01-15',
  },
  {
    id: 'e5',
    gender: 'Nữ', date_of_birth: '2001-07-14', nationality: 'Việt Nam',
    education_level: 'Trung cấp', skill_level: 'Bậc 1/5',
    bhxh_status: 'Chưa tham gia', base_salary: 6000000, probation_salary: 5100000, insurance_salary: 5000000, target_p3_salary: 2000000,
    salary_grade: 'G1', salary_grade_id: 'sg_g1', salary_step_number: 2, dependent_count: 0,
    allowances: [
      { id: 'al_e5_1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    ],
    annual_leave_days: 0, leave_taken_days: 0, overtime_hours: 0,
    employee_code: 'NV-00105',
    full_name: 'Phạm Thanh Hương',
    email: 'huong.pt@ggbingo.vn',
    phone: '0915 678 999',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 2',
    position: 'Chuyên Viên Tư Vấn Gói Dịch Vụ',
    job_title: 'Chuyên Viên Tư Vấn Dịch Vụ Mới',
    joined_date: '2026-07-23',
    status: 'Applicant',
    contract_number: 'HĐTV-2026/012',
    contract_type: 'Thử việc',
    contract_start_date: '2026-08-01',
    contract_end_date: '2026-10-01',
    contract_file_r2: 'storage.ggbingo.vn/contracts/HDTV_NV00105.pdf',
    id_card_number: '001099238475',
    id_card_issue_date: '2022-04-10',
    id_card_issue_place: 'Cục Cảnh Sát QLHC',
    permanent_address: 'Quận Thanh Xuân, Hà Nội',
    temporary_address: 'Quận Cầu Giấy, Hà Nội',
    social_insurance_code: '7910926666',
    health_insurance_code: 'DN4010926666',
    personal_tax_code: '8594039281',
    bank_account_holder: 'PHẠM THANH HƯƠNG',
    bank_account: '0915678999',
    bank_name: 'Techcombank',
    bank_branch: 'Chi nhánh Hà Nội',
    direct_manager_name: 'Trần Văn Hoàng (Trưởng Nhóm Sale)',
    approval_status: 'PENDING_DIRECT_MANAGER',
    direct_manager_approved: false,
    sales_director_approved: false,
    approval_history: [
      { stage_name: 'Tạo mới hồ sơ', actor_name: 'Đặng Kim Anh', actor_role: 'HR Admin', action: 'SUBMIT', timestamp: '2026-07-23 09:15' }
    ],
    created_at: '2026-07-23',
  }
];

export const INITIAL_ORG_TREE: OrgNode = {
  id: 'org-root',
  name: 'GGBINGO GROUP',
  title: 'Ban Giám Đốc & Tổng Công Ty',
  role: 'Ban Giám Đốc',
  department: 'Hội Đồng Quản Trị',
  email: 'board@ggbingo.vn',
  memberCount: 524,
  children: [
    {
      id: 'org-dept-1',
      name: 'Phòng Kinh Doanh 1',
      title: 'Trưởng Phòng: Phạm Minh Đức',
      role: 'Head of Sales 1',
      department: 'Phòng Kinh Doanh 1',
      memberCount: 140,
      children: [
        {
          id: 'org-team-1-1',
          name: 'Đội Sale 1 (Shopee Mall)',
          title: 'Đội Trưởng: Trần Văn Hoàng',
          role: 'Trưởng Nhóm Sale',
          department: 'Phòng Kinh Doanh 1',
          team: 'Đội 1',
          email: 'hoang.tv@ggbingo.vn',
          phone: '0912 345 678',
          memberCount: 45,
        },
      ],
    },
  ],
};

let employees = [...INITIAL_EMPLOYEES];

export function getEmployees(): EmployeeProfile[] {
  return employees;
}

export function getEmployeeById(id: string): EmployeeProfile | undefined {
  return employees.find((e) => e.id === id);
}

export function createEmployee(newEmp: Omit<EmployeeProfile, 'id' | 'created_at'>): EmployeeProfile {
  const empCode = newEmp.employee_code || `NV-${String(employees.length + 101).padStart(5, '0')}`;
  const contractNum = newEmp.contract_number || `HĐLĐ-2026/${String(employees.length + 1).padStart(3, '0')}`;
  const r2Url = newEmp.contract_file_r2 || `storage.ggbingo.vn/contracts/HDLD_${empCode.replace('-', '')}.pdf`;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const initialHistory: ApprovalAuditStep[] = [
    {
      stage_name: 'Đề xuất tạo mới nhân sự',
      actor_name: 'HR Admin / Quản Lý',
      actor_role: 'Khai báo hồ sơ',
      action: 'SUBMIT',
      note: 'Khởi tạo hồ sơ chờ Quản lý trực tiếp duyệt',
      timestamp: now,
    },
  ];

  const created: EmployeeProfile = {
    ...newEmp,
    id: `e_${Date.now()}`,
    employee_code: empCode,
    contract_number: contractNum,
    contract_file_r2: r2Url,
    approval_status: 'PENDING_DIRECT_MANAGER', // Bắt đầu ở bước 1: Chờ Quản lý trực tiếp duyệt
    direct_manager_approved: false,
    sales_director_approved: false,
    approval_history: initialHistory,
    created_at: new Date().toISOString().split('T')[0],
  };

  employees = [created, ...employees];
  return created;
}

export function approveByDirectManager(empId: string, actorName: string, note?: string): EmployeeProfile | undefined {
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return undefined;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newStep: ApprovalAuditStep = {
    stage_name: 'Phê duyệt Quản lý Trực tiếp',
    actor_name: actorName || emp.direct_manager_name || 'Trưởng Nhóm / Manager',
    actor_role: 'Quản Lý Trực Tiếp',
    action: 'APPROVE',
    note: note || 'Đã đồng ý phê duyệt nhân sự mới',
    timestamp: now,
  };

  emp.direct_manager_approved = true;
  emp.approval_status = 'PENDING_SALES_DIRECTOR'; // Chuyển sang bước 2: Chờ Giám đốc Kinh doanh duyệt
  emp.approval_history = [...(emp.approval_history || []), newStep];

  return emp;
}

export function approveBySalesDirector(empId: string, actorName: string, note?: string): EmployeeProfile | undefined {
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return undefined;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newStep: ApprovalAuditStep = {
    stage_name: 'Phê duyệt Giám Đốc Kinh Doanh (Duyệt Cuối)',
    actor_name: actorName || 'Phạm Minh Đức (Giám Đốc Kinh Doanh)',
    actor_role: 'Sales Director',
    action: 'APPROVE',
    note: note || 'Đã phê duyệt cuối - Chuyển HR Onboarding & Ký Hợp Đồng',
    timestamp: now,
  };

  emp.sales_director_approved = true;
  emp.approval_status = 'APPROVED_FOR_ONBOARDING'; // Hoàn tất duyệt -> Chuyển HR Onboard
  emp.approval_history = [...(emp.approval_history || []), newStep];

  return emp;
}

export function rejectEmployeeApproval(empId: string, actorName: string, reason: string): EmployeeProfile | undefined {
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return undefined;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newStep: ApprovalAuditStep = {
    stage_name: 'Từ Chối Phê Duyệt',
    actor_name: actorName || 'Cấp Quản Lý',
    actor_role: 'Approver',
    action: 'REJECT',
    note: reason || 'Không đạt tiêu chuẩn tuyển dụng',
    timestamp: now,
  };

  emp.approval_status = 'REJECTED';
  emp.rejection_reason = reason;
  emp.approval_history = [...(emp.approval_history || []), newStep];

  return emp;
}

export function updateEmployee(id: string, updatedFields: Partial<EmployeeProfile>): EmployeeProfile | undefined {
  const idx = employees.findIndex((e) => e.id === id);
  if (idx !== -1) {
    employees[idx] = { ...employees[idx], ...updatedFields };
    return employees[idx];
  }
  return undefined;
}

export function changeEmployeeStatus(
  empId: string,
  newStatus: 'Applicant' | 'Probation' | 'Active' | 'Pending_Resign' | 'Resigned' | 'Suspended',
  actorName: string = 'Đặng Kim Anh (HR Admin)',
  reasonNote?: string
): EmployeeProfile | undefined {
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return undefined;

  const statusLabels: Record<string, string> = {
    Active: 'Đang làm việc',
    Probation: 'Thử việc',
    Pending_Resign: 'Chờ nghỉ việc',
    Resigned: 'Đã nghỉ việc',
    Suspended: 'Tạm hoãn hợp đồng',
    Applicant: 'Ứng viên mới',
  };

  const oldStatusLabel = statusLabels[emp.status] || emp.status;
  const newStatusLabel = statusLabels[newStatus] || newStatus;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const auditStep: ApprovalAuditStep = {
    stage_name: `Chuyển Trạng Thái: ${oldStatusLabel} ➔ ${newStatusLabel}`,
    actor_name: actorName,
    actor_role: 'HR Admin / Quản Lý',
    action: 'APPROVE',
    note: reasonNote || `Thay đổi trạng thái nhân sự sang ${newStatusLabel}`,
    timestamp: now,
  };

  emp.status = newStatus;
  emp.approval_history = [...(emp.approval_history || []), auditStep];

  return emp;
}

export function getOrgChartTree(): OrgNode {
  return INITIAL_ORG_TREE;
}

// ==================== 1. CHỨC VỤ (POSITIONS / ADMINISTRATIVE ROLES) ====================
export interface PositionCategoryDefinition {
  id: string;
  code: string;
  name: string; // Giám Đốc, Trưởng Phòng, Trưởng Nhóm, Nhân Viên...
  description: string;
  created_at: string;
}

export const INITIAL_POSITIONS: PositionCategoryDefinition[] = [
  { id: 'pos_1', code: 'POS_DIR', name: 'Giám Đốc', description: 'Cấp điều hành tối cao công ty và quản lý các khối', created_at: '2025-01-01' },
  { id: 'pos_2', code: 'POS_HEAD', name: 'Trưởng Phòng', description: 'Quản lý điều hành phòng ban chuyên môn', created_at: '2025-01-01' },
  { id: 'pos_3', code: 'POS_LEAD', name: 'Trưởng Nhóm', description: 'Quản lý đội ngũ tác nghiệp trực tiếp', created_at: '2025-01-01' },
  { id: 'pos_4', code: 'POS_STAFF', name: 'Chuyên Viên / Nhân Viên', description: 'Nhân sự thực thi công việc chuyên môn', created_at: '2025-01-01' },
  { id: 'pos_5', code: 'POS_INTERN', name: 'Thử Việc / Thực Tập Sinh', description: 'Nhân sự mới nhận việc hoặc đang thử thách năng lực', created_at: '2025-01-01' },
];

let positionCategories = [...INITIAL_POSITIONS];

export function getPositionCategories(): PositionCategoryDefinition[] {
  return positionCategories;
}

export function createPositionCategory(newPos: Omit<PositionCategoryDefinition, 'id' | 'created_at'>): PositionCategoryDefinition {
  const created: PositionCategoryDefinition = {
    ...newPos,
    id: `pos_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };
  positionCategories = [created, ...positionCategories];
  syncJobTitlesToSystem();
  return created;
}

export function deletePositionCategory(id: string): boolean {
  positionCategories = positionCategories.filter((p) => p.id !== id);
  syncJobTitlesToSystem();
  return true;
}

// ==================== 2. CẤP BẬC / NĂNG LỰC (GRADE LEVELS: G1, G2, G3...) ====================
export interface GradeLevelDefinition {
  id: string;
  code: string; // G1, G2, G3, G4, G5, G6...
  name: string;
  min_salary: number;
  max_salary: number;
  description: string;
  created_at: string;
}

export const INITIAL_GRADE_LEVELS: GradeLevelDefinition[] = [
  { id: 'gr_1', code: 'G1', name: 'G1 - Ban Điều Hành Tối Cao', min_salary: 40000000, max_salary: 120000000, description: 'Cấp độ quyết định chiến lược doanh nghiệp & đầu tư', created_at: '2025-01-01' },
  { id: 'gr_2', code: 'G2', name: 'G2 - Quản Lý Cấp Cao', min_salary: 25000000, max_salary: 50000000, description: 'Cấp độ Giám đốc khối & Trưởng phòng trọng điểm', created_at: '2025-01-01' },
  { id: 'gr_3', code: 'G3', name: 'G3 - Quản Lý Cấp Trung / Team Lead', min_salary: 15000000, max_salary: 30000000, description: 'Cấp độ Trưởng nhóm & Quản lý đội ngũ', created_at: '2025-01-01' },
  { id: 'gr_4', code: 'G4', name: 'G4 - Chuyên Viên Senior', min_salary: 11000000, max_salary: 20000000, description: 'Chuyên viên lành nghề, xử lý tác nghiệp độc lập', created_at: '2025-01-01' },
  { id: 'gr_5', code: 'G5', name: 'G5 - Chuyên Viên Junior / Executive', min_salary: 8000000, max_salary: 13000000, description: 'Nhân sự thực thi công việc định kỳ', created_at: '2025-01-01' },
  { id: 'gr_6', code: 'G6', name: 'G6 - Thử Việc & Intern', min_salary: 5000000, max_salary: 9000000, description: 'Nhân sự mới gia nhập đang đào tạo onboarding', created_at: '2025-01-01' },
];

let gradeLevels = [...INITIAL_GRADE_LEVELS];

export function getGradeLevels(): GradeLevelDefinition[] {
  return gradeLevels;
}

export function createGradeLevel(newGrade: Omit<GradeLevelDefinition, 'id' | 'created_at'>): GradeLevelDefinition {
  const created: GradeLevelDefinition = {
    ...newGrade,
    id: `gr_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };
  gradeLevels = [...gradeLevels, created];
  syncJobTitlesToSystem();
  return created;
}

export function deleteGradeLevel(id: string): boolean {
  gradeLevels = gradeLevels.filter((g) => g.id !== id);
  syncJobTitlesToSystem();
  return true;
}

// ==================== 3. CHỨC DANH CHUYÊN MÔN (JOB TITLES) ====================
export interface JobTitleDefinition {
  id: string;
  code: string;
  name: string;
  position_name: string;
  grade_code: string;
  department: string;
  rank_level: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const INITIAL_JOB_TITLES: JobTitleDefinition[] = [
  { id: 'jt_1', code: 'DIR_SALES', name: 'Giám Đốc Kinh Doanh', position_name: 'Giám Đốc', grade_code: 'G1', department: 'Phòng Kinh Doanh 1', rank_level: 1, description: 'Chịu trách nhiệm chiến lược doanh số toàn công ty', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_2', code: 'DIR_MKT', name: 'Giám Đốc Thị Trường', position_name: 'Giám Đốc', grade_code: 'G1', department: 'Phòng Marketing', rank_level: 1, description: 'Phát triển thương hiệu & mở rộng thị phần đa sàn TMĐT', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_3', code: 'MGR_SALES', name: 'Trưởng Phòng Kinh Doanh', position_name: 'Trưởng Phòng', grade_code: 'G2', department: 'Phòng Kinh Doanh 1', rank_level: 2, description: 'Quản lý phòng kinh doanh & điều phối KPI đội nhóm', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_4', code: 'LEAD_SALES', name: 'Trưởng Nhóm Sale', position_name: 'Trưởng Nhóm', grade_code: 'G3', department: 'Phòng Kinh Doanh 1', rank_level: 2, description: 'Quản lý đội sale & giao chỉ tiêu GMV hàng tháng', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_5', code: 'EXEC_SALES', name: 'Chuyên Viên Sale', position_name: 'Chuyên Viên / Nhân Viên', grade_code: 'G4', department: 'Phòng Kinh Doanh 1', rank_level: 3, description: 'Chăm sóc Lead & tư vấn chốt hợp đồng', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_6', code: 'MGR_HR', name: 'Quản Lý HR', position_name: 'Trưởng Phòng', grade_code: 'G2', department: 'Phòng Nhân Sự (HR)', rank_level: 2, description: 'Quản lý hồ sơ nhân sự, tuyển dụng & đánh giá 360°', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_7', code: 'SPEC_CSKH', name: 'Specialist CSKH', position_name: 'Chuyên Viên / Nhân Viên', grade_code: 'G5', department: 'Phòng CSKH', rank_level: 3, description: 'Tiếp nhận live chat đa kênh & hỗ trợ khách hàng', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_8', code: 'SPEC_OPS', name: 'Chuyên Viên Tối Ưu Gian Hàng', position_name: 'Chuyên Viên / Nhân Viên', grade_code: 'G4', department: 'Phòng Vận Hành TMĐT', rank_level: 3, description: 'Quản lý gian hàng Shopee, TikTok Shop, Lazada', is_active: true, created_at: '2025-01-01' },
  { id: 'jt_9', code: 'AUDITOR_SYS', name: 'Chuyên Viên Kiểm Toán', position_name: 'Chuyên Viên / Nhân Viên', grade_code: 'G4', department: 'Phòng Kiểm Toán & An Ninh', rank_level: 3, description: 'Kiểm tra nhật ký hệ thống & bảo mật dữ liệu', is_active: true, created_at: '2025-01-01' },
];

let jobTitles = [...INITIAL_JOB_TITLES];

export function getJobTitles(): JobTitleDefinition[] {
  return jobTitles;
}

export function syncJobTitlesToSystem() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ggbg_hrm_job_titles_updated', {
        detail: { jobTitles, positions: positionCategories, grades: gradeLevels },
      })
    );
  }
}

export function createJobTitle(newTitle: Omit<JobTitleDefinition, 'id' | 'created_at'>): JobTitleDefinition {
  const created: JobTitleDefinition = {
    ...newTitle,
    id: `jt_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };
  jobTitles = [created, ...jobTitles];
  syncJobTitlesToSystem();
  return created;
}

export function updateJobTitle(id: string, fields: Partial<JobTitleDefinition>): JobTitleDefinition | undefined {
  const idx = jobTitles.findIndex((jt) => jt.id === id);
  if (idx !== -1) {
    jobTitles[idx] = { ...jobTitles[idx], ...fields };
    syncJobTitlesToSystem();
    return jobTitles[idx];
  }
  return undefined;
}

export function deleteJobTitle(id: string): boolean {
  jobTitles = jobTitles.filter((jt) => jt.id !== id);
  syncJobTitlesToSystem();
  return true;
}

// ==================== 4. CẤP BẬC / NGẠCH BẬC LƯƠNG (SALARY SCALES & STEPS) ====================
export const INITIAL_SALARY_GRADES: SalaryGradeScale[] = [
  {
    id: 'sg_g6',
    code: 'G6',
    name: 'G6 - Ban Giám Đốc & Lãnh Đạo Cấp Cao',
    category: 'EXECUTIVE',
    description: 'Bao gồm CEO, CHRO, CTO, Giám Đốc Khối điều hành chiến lược doanh nghiệp',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Khởi điểm)', coefficient: 3.5, base_salary: 45000000, insurance_salary: 30000000, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Tiêu chuẩn)', coefficient: 4.2, base_salary: 55000000, insurance_salary: 36000000, seniority_months_required: 12 },
      { step_number: 3, step_name: 'Bậc 3 (Nâng cao)', coefficient: 5.0, base_salary: 68000000, insurance_salary: 42000000, seniority_months_required: 24 },
      { step_number: 4, step_name: 'Bậc 4 (Xuất sắc)', coefficient: 6.0, base_salary: 85000000, insurance_salary: 46800000, seniority_months_required: 36 },
      { step_number: 5, step_name: 'Bậc 5 (Tối cao)', coefficient: 7.5, base_salary: 110000000, insurance_salary: 46800000, seniority_months_required: 48 },
    ],
  },
  {
    id: 'sg_g5',
    code: 'G5',
    name: 'G5 - Trưởng Phòng & Quản Lý Cấp Trung',
    category: 'MANAGEMENT',
    description: 'Bao gồm Trưởng Phòng Kinh Doanh, Trưởng Phòng Vận Hành TMĐT, Quản Lý HR',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Khởi điểm)', coefficient: 2.2, base_salary: 26000000, insurance_salary: 16000000, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Tiêu chuẩn)', coefficient: 2.6, base_salary: 32000000, insurance_salary: 20000000, seniority_months_required: 12 },
      { step_number: 3, step_name: 'Bậc 3 (Nâng cao)', coefficient: 3.0, base_salary: 38000000, insurance_salary: 24000000, seniority_months_required: 24 },
      { step_number: 4, step_name: 'Bậc 4 (Vững vàng)', coefficient: 3.5, base_salary: 45000000, insurance_salary: 28000000, seniority_months_required: 36 },
      { step_number: 5, step_name: 'Bậc 5 (Xuất sắc)', coefficient: 4.0, base_salary: 52000000, insurance_salary: 32000000, seniority_months_required: 48 },
    ],
  },
  {
    id: 'sg_g4',
    code: 'G4',
    name: 'G4 - Trưởng Nhóm (Leader) & Chuyên Viên Cao Cấp (Senior)',
    category: 'PROFESSIONAL',
    description: 'Bao gồm Team Lead Sale, Senior Key Account Ecom, Senior Developer',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Khởi điểm)', coefficient: 1.6, base_salary: 18000000, insurance_salary: 11000000, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Tiêu chuẩn)', coefficient: 1.9, base_salary: 22000000, insurance_salary: 14000000, seniority_months_required: 12 },
      { step_number: 3, step_name: 'Bậc 3 (Nâng cao)', coefficient: 2.2, base_salary: 26000000, insurance_salary: 16000000, seniority_months_required: 24 },
      { step_number: 4, step_name: 'Bậc 4 (Vững vàng)', coefficient: 2.5, base_salary: 30000000, insurance_salary: 18000000, seniority_months_required: 36 },
      { step_number: 5, step_name: 'Bậc 5 (Xuất sắc)', coefficient: 2.8, base_salary: 35000000, insurance_salary: 20000000, seniority_months_required: 48 },
    ],
  },
  {
    id: 'sg_g3',
    code: 'G3',
    name: 'G3 - Chuyên Viên Chính (Mid-level)',
    category: 'PROFESSIONAL',
    description: 'Bao gồm Chuyên viên Sale, Chuyên viên Vận hành Shopee/TikTok Shop, Chuyên viên C&B',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Khởi điểm)', coefficient: 1.2, base_salary: 12000000, insurance_salary: 7500000, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Tiêu chuẩn)', coefficient: 1.4, base_salary: 14500000, insurance_salary: 9000000, seniority_months_required: 12 },
      { step_number: 3, step_name: 'Bậc 3 (Nâng cao)', coefficient: 1.6, base_salary: 17000000, insurance_salary: 11000000, seniority_months_required: 24 },
      { step_number: 4, step_name: 'Bậc 4 (Vững vàng)', coefficient: 1.8, base_salary: 20000000, insurance_salary: 13000000, seniority_months_required: 36 },
      { step_number: 5, step_name: 'Bậc 5 (Xuất sắc)', coefficient: 2.0, base_salary: 23000000, insurance_salary: 15000000, seniority_months_required: 48 },
    ],
  },
  {
    id: 'sg_g2',
    code: 'G2',
    name: 'G2 - Nhân Viên / Chuyên Viên Junior',
    category: 'OPERATIONAL',
    description: 'Bao gồm Nhân viên CSKH, Nhân viên xử lý đơn hàng, Nhân viên thiết kế đồ họa',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Khởi điểm)', coefficient: 0.9, base_salary: 8500000, insurance_salary: 5500000, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Tiêu chuẩn)', coefficient: 1.05, base_salary: 10000000, insurance_salary: 6500000, seniority_months_required: 6 },
      { step_number: 3, step_name: 'Bậc 3 (Nâng cao)', coefficient: 1.2, base_salary: 11500000, insurance_salary: 7500000, seniority_months_required: 12 },
      { step_number: 4, step_name: 'Bậc 4 (Vững vàng)', coefficient: 1.35, base_salary: 13000000, insurance_salary: 8500000, seniority_months_required: 24 },
    ],
  },
  {
    id: 'sg_g1',
    code: 'G1',
    name: 'G1 - Học Việc & Thực Tập Sinh (Intern)',
    category: 'INTERN',
    description: 'Nhân sự sinh viên thực tập, cộng tác viên bán thời gian',
    is_active: true,
    steps: [
      { step_number: 1, step_name: 'Bậc 1 (Thực tập part-time)', coefficient: 0.4, base_salary: 3500000, insurance_salary: 0, seniority_months_required: 0 },
      { step_number: 2, step_name: 'Bậc 2 (Thực tập full-time)', coefficient: 0.6, base_salary: 5000000, insurance_salary: 0, seniority_months_required: 3 },
      { step_number: 3, step_name: 'Bậc 3 (Thử việc chính thức)', coefficient: 0.75, base_salary: 6500000, insurance_salary: 5000000, seniority_months_required: 6 },
    ],
  },
];

let salaryGrades = [...INITIAL_SALARY_GRADES];

export function getSalaryGrades(): SalaryGradeScale[] {
  return salaryGrades;
}

export function saveSalaryGrade(grade: SalaryGradeScale): SalaryGradeScale {
  const idx = salaryGrades.findIndex((g) => g.id === grade.id);
  if (idx !== -1) {
    salaryGrades[idx] = grade;
  } else {
    salaryGrades = [grade, ...salaryGrades];
  }
  return grade;
}

export function deleteSalaryGrade(id: string): boolean {
  salaryGrades = salaryGrades.filter((g) => g.id !== id);
  return true;
}

export function getSalaryStep(gradeIdOrCode: string, stepNumber: number): SalaryStepItem | undefined {
  const grade = salaryGrades.find((g) => g.id === gradeIdOrCode || g.code === gradeIdOrCode);
  if (!grade) return undefined;
  return grade.steps.find((s) => s.step_number === stepNumber);
}

// ==================== 4. DANH MỤC PHỤ CẤP CÔNG TY & ĐỊNH MỨC MIỄN TRỪ (ALLOWANCE CATALOG) ====================
export const INITIAL_ALLOWANCE_CATALOG: AllowanceCatalogItem[] = [
  {
    id: 'al_1',
    code: 'MEAL',
    name: 'Phụ Cấp Ăn Trưa',
    default_amount: 730000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 730000, // Miễn thuế đến 730k theo TT 26/2015/TT-BTC, vượt tính thuế TNCN
    is_social_insurance: false,
    insurance_exempt_cap: 999999999, // Toàn bộ không tính đóng BHXH
    is_prorated_by_workdays: true,
    description: 'Phụ cấp bữa ăn ca giữa ca, miễn thuế TNCN tối đa 730.000 ₫/tháng theo luật thuế hiện hành',
    is_active: true,
  },
  {
    id: 'al_2',
    code: 'TRAVEL',
    name: 'Phụ Cấp Xăng Xe & Đi Lại',
    default_amount: 500000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 500000, // Định mức công tác khoáng miễn thuế 500k
    is_social_insurance: false,
    insurance_exempt_cap: 999999999,
    is_prorated_by_workdays: true,
    description: 'Hỗ trợ chi phí đi lại, tiếp khách thị trường và làm việc tại các kho vận TMĐT',
    is_active: true,
  },
  {
    id: 'al_3',
    code: 'PHONE',
    name: 'Phụ Cấp Điện Thoại & Internet',
    default_amount: 300000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 300000, // Khoán tiền điện thoại công việc miễn thuế theo quy chế
    is_social_insurance: false,
    insurance_exempt_cap: 999999999,
    is_prorated_by_workdays: false,
    description: 'Hỗ trợ cước viễn thông liên lạc CSKH và Merchant đối tác đa sàn',
    is_active: true,
  },
  {
    id: 'al_4',
    code: 'RESPONSIBILITY',
    name: 'Phụ Cấp Trách Nhiệm Quản Lý',
    default_amount: 2000000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 0, // Không miễn thuế -> Tính thuế 100%
    is_social_insurance: true,
    insurance_exempt_cap: 0, // Bắt buộc cộng vào nền đóng BHXH theo Luật BHXH
    is_prorated_by_workdays: true,
    description: 'Phụ cấp chức vụ, trách nhiệm quản lý đội nhóm và ký duyệt hồ sơ (Thuộc diện đóng BHXH & tính thuế)',
    is_active: true,
  },
  {
    id: 'al_5',
    code: 'HAZARD',
    name: 'Phụ Cấp Trực Đêm & Ca Livestream',
    default_amount: 1000000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 0,
    is_social_insurance: false,
    insurance_exempt_cap: 999999999,
    is_prorated_by_workdays: true,
    description: 'Phụ cấp làm thêm ca đêm và trực chiến dịch Flash Sale Mega (Chịu thuế TNCN, không đóng BHXH)',
    is_active: true,
  },
  {
    id: 'al_6',
    code: 'HOUSING',
    name: 'Hỗ Trợ Nhà Ở & Chuyên Gia',
    default_amount: 1500000,
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 0, // Tính thuế phần tiền nhà theo quy định 15% tổng thu nhập chịu thuế
    is_social_insurance: false,
    insurance_exempt_cap: 999999999,
    is_prorated_by_workdays: false,
    description: 'Hỗ trợ chi phí nhà ở cho chuyên gia và nhân sự ngoại tỉnh',
    is_active: true,
  },
  {
    id: 'al_7',
    code: 'CLOTHES',
    name: 'Phụ Cấp Trang Phục Đồng Phục',
    default_amount: 416666, // 5.000.000 / 12 tháng
    calculation_type: 'FIXED_MONTHLY',
    is_taxable_pit: true,
    tax_exempt_cap: 416666, // Miễn thuế tối đa 5tr/năm bằng tiền theo luật thuế TNCN
    is_social_insurance: false,
    insurance_exempt_cap: 999999999,
    is_prorated_by_workdays: false,
    description: 'Trang phục công sở theo quy chế, miễn thuế TNCN tối đa 5.000.000 ₫/người/năm',
    is_active: true,
  },
];

let allowanceCatalog = [...INITIAL_ALLOWANCE_CATALOG];

export function getAllowanceCatalog(): AllowanceCatalogItem[] {
  return allowanceCatalog;
}

export function createAllowanceCatalogItem(item: Omit<AllowanceCatalogItem, 'id'>): AllowanceCatalogItem {
  const created: AllowanceCatalogItem = {
    ...item,
    id: `al_${Date.now()}`,
  };
  allowanceCatalog = [created, ...allowanceCatalog];
  return created;
}

export function updateAllowanceCatalogItem(id: string, fields: Partial<AllowanceCatalogItem>): AllowanceCatalogItem | undefined {
  const idx = allowanceCatalog.findIndex((al) => al.id === id);
  if (idx !== -1) {
    allowanceCatalog[idx] = { ...allowanceCatalog[idx], ...fields };
    return allowanceCatalog[idx];
  }
  return undefined;
}

export function deleteAllowanceCatalogItem(id: string): boolean {
  allowanceCatalog = allowanceCatalog.filter((al) => al.id !== id);
  return true;
}

// ==================== 5. CHÍNH SÁCH THUẾ TNCN & TỶ LỆ BHXH THEO MỐC THỜI GIAN ====================
export const INITIAL_TAX_POLICIES: TaxAndInsurancePolicyVersion[] = [
  {
    id: 'pol_2026_current',
    version_name: 'Quy Định Thuế & BHXH Hiện Hành (2026)',
    effective_from_date: '2026-01-01',
    personal_tax_deduction_self: 11000000,
    personal_tax_deduction_dependent: 4400000,
    bhxh_employee_rate: 8.0,
    bhyt_employee_rate: 1.5,
    bhtn_employee_rate: 1.0,
    bhxh_employer_rate: 17.5,
    bhyt_employer_rate: 3.0,
    bhtn_employer_rate: 1.0,
    kpcd_employer_rate: 2.0,
    max_insurance_base_cap: 46800000, // 20 x 2.340.000 ₫
    legal_basis_note: 'Nghị quyết 954/2020/UBTVQH14, Nghị định 73/2024/NĐ-CP mức lương cơ sở 2.34tr',
    is_current: true,
  },
  {
    id: 'pol_2025_prev',
    version_name: 'Quy Định Thuế & BHXH Năm 2025',
    effective_from_date: '2025-01-01',
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
    legal_basis_note: 'Mức lương cơ sở cũ 1.800.000 ₫',
    is_current: false,
  },
];

let taxPolicies = [...INITIAL_TAX_POLICIES];

export function getTaxPolicies(): TaxAndInsurancePolicyVersion[] {
  return taxPolicies;
}

export function saveTaxPolicy(policy: TaxAndInsurancePolicyVersion): TaxAndInsurancePolicyVersion {
  if (policy.is_current) {
    taxPolicies = taxPolicies.map((p) => ({ ...p, is_current: p.id === policy.id }));
  }
  const idx = taxPolicies.findIndex((p) => p.id === policy.id);
  if (idx !== -1) {
    taxPolicies[idx] = policy;
  } else {
    taxPolicies = [policy, ...taxPolicies];
  }
  return policy;
}

export function deleteTaxPolicy(id: string): boolean {
  taxPolicies = taxPolicies.filter((p) => p.id !== id);
  return true;
}

export function getTaxPolicyByDate(dateStr: string): TaxAndInsurancePolicyVersion {
  // Sort policies by effective_from_date descending
  const sorted = [...taxPolicies].sort((a, b) => b.effective_from_date.localeCompare(a.effective_from_date));
  const matched = sorted.find((p) => p.effective_from_date <= dateStr);
  return matched || sorted[0] || INITIAL_TAX_POLICIES[0];
}

// ==================== 5. CA LÀM VIỆC (WORK SHIFTS) ====================
export const INITIAL_WORK_SHIFTS: WorkShift[] = [
  { id: 'shift_office', shift_code: 'SHIFT_OFFICE', name: 'Ca Hành Chính', start_time: '08:30', end_time: '17:30', break_start: '12:00', break_end: '13:30', work_hours: 8.0, night_shift_bonus_pct: 0, grace_period_late_mins: 15, grace_period_early_mins: 5, is_active: true, color: 'emerald' },
  { id: 'shift_morning', shift_code: 'SHIFT_MORNING', name: 'Ca Sáng (06:00 - 14:00)', start_time: '06:00', end_time: '14:00', break_start: '10:00', break_end: '10:30', work_hours: 8.0, night_shift_bonus_pct: 0, grace_period_late_mins: 10, grace_period_early_mins: 5, is_active: true, color: 'blue' },
  { id: 'shift_evening', shift_code: 'SHIFT_EVENING', name: 'Ca Chiều (14:00 - 22:00)', start_time: '14:00', end_time: '22:00', break_start: '18:00', break_end: '18:30', work_hours: 8.0, night_shift_bonus_pct: 0, grace_period_late_mins: 10, grace_period_early_mins: 5, is_active: true, color: 'amber' },
  { id: 'shift_night', shift_code: 'SHIFT_NIGHT', name: 'Ca Đêm (22:00 - 06:00)', start_time: '22:00', end_time: '06:00', break_start: '02:00', break_end: '02:30', work_hours: 8.0, night_shift_bonus_pct: 30, grace_period_late_mins: 10, grace_period_early_mins: 5, is_active: true, color: 'purple' },
  { id: 'shift_live', shift_code: 'SHIFT_LIVE', name: 'Ca Livestream TMĐT Mega Sale (19:00 - 01:00)', start_time: '19:00', end_time: '01:00', break_start: '21:00', break_end: '21:30', work_hours: 6.0, night_shift_bonus_pct: 30, grace_period_late_mins: 5, grace_period_early_mins: 0, is_active: true, color: 'rose' },
];

let workShifts = [...INITIAL_WORK_SHIFTS];

export function getWorkShifts(): WorkShift[] {
  return workShifts;
}

export function createWorkShift(shift: Omit<WorkShift, 'id'>): WorkShift {
  const created: WorkShift = { ...shift, id: `shift_${Date.now()}` };
  workShifts = [...workShifts, created];
  return created;
}

export function updateWorkShift(id: string, fields: Partial<WorkShift>): WorkShift | undefined {
  const idx = workShifts.findIndex((s) => s.id === id);
  if (idx !== -1) {
    workShifts[idx] = { ...workShifts[idx], ...fields };
    return workShifts[idx];
  }
  return undefined;
}

export function deleteWorkShift(id: string): boolean {
  workShifts = workShifts.filter((s) => s.id !== id);
  return true;
}

// ==================== 6. PHÂN CA LÀM VIỆC (SHIFT ASSIGNMENTS) ====================
export const INITIAL_SHIFT_ASSIGNMENTS: ShiftAssignment[] = [
  { id: 'sa_1', employee_id: 'e1', employee_name: 'Trần Văn Hoàng', department: 'Phòng Kinh Doanh 1', date: '2026-08-17', shift_id: 'shift_office', shift_name: 'Ca Hành Chính', shift_color: 'emerald' },
  { id: 'sa_2', employee_id: 'e1', employee_name: 'Trần Văn Hoàng', department: 'Phòng Kinh Doanh 1', date: '2026-08-18', shift_id: 'shift_office', shift_name: 'Ca Hành Chính', shift_color: 'emerald' },
  { id: 'sa_3', employee_id: 'e2', employee_name: 'Lê Thị Mai', department: 'Phòng Kinh Doanh 2', date: '2026-08-17', shift_id: 'shift_live', shift_name: 'Ca Livestream TMĐT', shift_color: 'rose' },
  { id: 'sa_4', employee_id: 'e3', employee_name: 'Phạm Minh Đức', department: 'Ban Giám Đốc', date: '2026-08-17', shift_id: 'shift_office', shift_name: 'Ca Hành Chính', shift_color: 'emerald' },
  { id: 'sa_5', employee_id: 'e4', employee_name: 'Đặng Kim Anh', department: 'Phòng Nhân Sự (HR)', date: '2026-08-17', shift_id: 'shift_office', shift_name: 'Ca Hành Chính', shift_color: 'emerald' },
  { id: 'sa_6', employee_id: 'e5', employee_name: 'Nguyễn Văn Tuấn', department: 'Phòng Marketing', date: '2026-08-17', shift_id: 'shift_evening', shift_name: 'Ca Chiều', shift_color: 'amber' },
];

let shiftAssignments = [...INITIAL_SHIFT_ASSIGNMENTS];

export function getShiftAssignments(): ShiftAssignment[] {
  return shiftAssignments;
}

export function saveShiftAssignment(assignment: Omit<ShiftAssignment, 'id'>): ShiftAssignment {
  const existingIdx = shiftAssignments.findIndex(
    (sa) => sa.employee_id === assignment.employee_id && sa.date === assignment.date
  );
  if (existingIdx !== -1) {
    shiftAssignments[existingIdx] = { ...shiftAssignments[existingIdx], ...assignment };
    return shiftAssignments[existingIdx];
  } else {
    const created: ShiftAssignment = { ...assignment, id: `sa_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` };
    shiftAssignments = [...shiftAssignments, created];
    return created;
  }
}

export function deleteShiftAssignment(employee_id: string, date: string): boolean {
  shiftAssignments = shiftAssignments.filter((sa) => !(sa.employee_id === employee_id && sa.date === date));
  return true;
}

// ==================== 7. LỊCH SỬ BIẾN ĐỘNG LƯƠNG & PHỤ CẤP ====================
export const INITIAL_COMPENSATION_HISTORY: CompensationHistoryRecord[] = [
  {
    id: 'ch_1',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    effective_date: '2025-09-01',
    change_type: 'PERIODIC_RAISE',
    from_grade_id: 'sg_g4',
    from_grade_code: 'G4',
    from_step_number: 2,
    to_grade_id: 'sg_g4',
    to_grade_code: 'G4',
    to_step_number: 3,
    previous_base_salary: 22000000,
    new_base_salary: 26000000,
    previous_insurance_salary: 14000000,
    new_insurance_salary: 17000000,
    previous_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    ],
    new_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'a2', allowance_type_id: 'al_4', name: 'Phụ Cấp Trách Nhiệm Quản Lý', amount: 2000000, taxable: true, include_in_insurance: true },
      { id: 'a3', allowance_type_id: 'al_3', name: 'Phụ Cấp Điện Thoại', amount: 300000, taxable: false, tax_exempt_cap: 300000, include_in_insurance: false },
    ],
    is_out_of_scale: false,
    approval_status: 'APPROVED',
    decision_number: 'QĐ-NL/2025/08-01',
    approved_by_name: 'Phạm Minh Đức (Giám Đốc)',
    reason: 'Đạt 150% chỉ tiêu GMV Quý 2/2025 và thăng cấp Bậc 3 (G4)',
    created_at: '2025-08-25',
  },
  {
    id: 'ch_2',
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    effective_date: '2025-06-01',
    change_type: 'PROBATION_TO_OFFICIAL',
    from_grade_id: 'sg_g3',
    from_grade_code: 'G3',
    from_step_number: 1,
    to_grade_id: 'sg_g3',
    to_grade_code: 'G3',
    to_step_number: 2,
    previous_base_salary: 12325000,
    new_base_salary: 14500000,
    previous_insurance_salary: 0,
    new_insurance_salary: 8500000,
    previous_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    ],
    new_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'a2', allowance_type_id: 'al_2', name: 'Phụ Cấp Xăng Xe & Đi Lại', amount: 500000, taxable: false, tax_exempt_cap: 500000, include_in_insurance: false },
    ],
    is_out_of_scale: false,
    approval_status: 'APPROVED',
    decision_number: 'QĐ-CT/2025/07-04',
    approved_by_name: 'Đặng Kim Anh (HR Manager)',
    reason: 'Hoàn thành thử việc xuất sắc 2 tháng với 12 hợp đồng mới',
    created_at: '2025-07-28',
  },
  {
    id: 'ch_3',
    employee_id: 'e4',
    employee_name: 'Nguyễn Quốc Tuấn',
    effective_date: '2026-08-01',
    change_type: 'SPECIAL_ADJUSTMENT',
    from_grade_id: 'sg_g2',
    from_grade_code: 'G2',
    from_step_number: 3,
    to_grade_id: 'sg_g4',
    to_grade_code: 'G4',
    to_step_number: 2,
    previous_base_salary: 11500000,
    new_base_salary: 22000000,
    previous_insurance_salary: 7500000,
    new_insurance_salary: 14000000,
    previous_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
    ],
    new_allowances: [
      { id: 'a1', allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, tax_exempt_cap: 730000, include_in_insurance: false },
      { id: 'a2', allowance_type_id: 'al_4', name: 'Phụ Cấp Trách Nhiệm Quản Lý', amount: 1500000, taxable: true, include_in_insurance: true },
    ],
    is_out_of_scale: true,
    out_of_scale_reason: 'Nhảy vượt cấp đặc cách từ Ngạch G2 lên Ngạch G4 (Senior Lead Ecom) trước thời hạn thâm niên quy định',
    approval_status: 'PENDING_CEO_APPROVAL',
    decision_number: 'TTr-ĐK/2026/08-02',
    approved_by_name: 'Vũ Nam Khánh (Trưởng Phòng Vận Hành)',
    reason: 'Đóng góp sáng kiến tự động hóa livestream đem lại GMV 4.2 tỷ/tháng',
    created_at: '2026-08-10',
  }
];

let compensationHistory = [...INITIAL_COMPENSATION_HISTORY];

export function getCompensationHistory(employeeId?: string): CompensationHistoryRecord[] {
  if (employeeId) {
    return compensationHistory.filter((ch) => ch.employee_id === employeeId);
  }
  return compensationHistory;
}

export function addCompensationRecord(record: Omit<CompensationHistoryRecord, 'id' | 'created_at'>): CompensationHistoryRecord {
  const isOutOfScale = !!record.is_out_of_scale;
  const initialStatus = isOutOfScale ? 'PENDING_CEO_APPROVAL' : (record.approval_status || 'APPROVED');

  const created: CompensationHistoryRecord = {
    ...record,
    id: `ch_${Date.now()}`,
    is_out_of_scale: isOutOfScale,
    approval_status: initialStatus,
    created_at: new Date().toISOString().split('T')[0],
  };
  compensationHistory = [created, ...compensationHistory];

  // Nếu không vượt khung hoặc đã duyệt -> Cập nhật trực tiếp vào EmployeeProfile
  if (initialStatus === 'APPROVED') {
    applyCompensationToEmployee(created);
  }

  return created;
}

export function applyCompensationToEmployee(record: CompensationHistoryRecord) {
  const empIdx = employees.findIndex((e) => e.id === record.employee_id);
  if (empIdx !== -1) {
    employees[empIdx] = {
      ...employees[empIdx],
      salary_grade_id: record.to_grade_id || employees[empIdx].salary_grade_id,
      salary_step_number: record.to_step_number !== undefined ? record.to_step_number : employees[empIdx].salary_step_number,
      salary_grade: record.to_grade_code || employees[empIdx].salary_grade,
      base_salary: record.new_base_salary,
      insurance_salary: record.new_insurance_salary || employees[empIdx].insurance_salary,
      allowances: record.new_allowances,
    };
  }
}

export function approveCompensationRecordByCeo(
  recordId: string,
  ceoName: string = 'CEO GGBingo',
  notes: string = 'Phê duyệt quyết định đặc cách'
): CompensationHistoryRecord | undefined {
  const idx = compensationHistory.findIndex((c) => c.id === recordId);
  if (idx !== -1) {
    compensationHistory[idx] = {
      ...compensationHistory[idx],
      approval_status: 'APPROVED',
      ceo_approved_by: ceoName,
      ceo_approved_at: new Date().toISOString().split('T')[0],
      ceo_notes: notes,
    };
    applyCompensationToEmployee(compensationHistory[idx]);
    return compensationHistory[idx];
  }
  return undefined;
}

export function rejectCompensationRecordByCeo(
  recordId: string,
  rejectionReason: string,
  ceoName: string = 'CEO GGBingo'
): CompensationHistoryRecord | undefined {
  const idx = compensationHistory.findIndex((c) => c.id === recordId);
  if (idx !== -1) {
    compensationHistory[idx] = {
      ...compensationHistory[idx],
      approval_status: 'REJECTED_BY_CEO',
      ceo_approved_by: ceoName,
      ceo_approved_at: new Date().toISOString().split('T')[0],
      ceo_notes: `Từ chối: ${rejectionReason}`,
    };
    return compensationHistory[idx];
  }
  return undefined;
}

// ==================== 8. ỨNG VIÊN TUYỂN DỤNG (CANDIDATES STORE) ====================
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    candidate_code: 'UV-2026-001',
    full_name: 'Trần Vũ Hoàng',
    email: 'hoang.tv@gmail.com',
    phone: '0981 234 567',
    position_applied: 'Chuyên Viên Tư Vấn TMĐT',
    department: 'Phòng Kinh Doanh 1',
    source: 'TopCV',
    stage: 'INTERVIEW',
    expected_salary: 15000000,
    experience_years: 2,
    cv_file: 'storage.ggbingo.vn/cv/tran_vu_hoang_cv.pdf',
    applied_date: '2026-08-01',
    interview_date: '2026-08-18 14:00',
    interview_score: 85,
    interviewer_name: 'Trần Văn Hoàng (Leader)',
    approval_status: 'PENDING_DIRECT_MANAGER',
    direct_manager_name: 'Trần Văn Hoàng',
    status: 'In_Progress',
  },
  {
    id: 'cand_2',
    candidate_code: 'UV-2026-002',
    full_name: 'Nguyễn Thị Bích Trâm',
    email: 'bichtram.ng@gmail.com',
    phone: '0903 888 999',
    position_applied: 'Specialist CSKH & Live Chat',
    department: 'Phòng CSKH',
    source: 'LinkedIn',
    stage: 'OFFER',
    expected_salary: 12000000,
    experience_years: 3,
    cv_file: 'storage.ggbingo.vn/cv/nguyen_thi_bich_tram_cv.pdf',
    applied_date: '2026-08-03',
    interview_date: '2026-08-10',
    interview_score: 92,
    interviewer_name: 'Đặng Kim Anh (HR)',
    approval_status: 'APPROVED',
    direct_manager_name: 'Đặng Kim Anh',
    status: 'Passed',
  },
  {
    id: 'cand_3',
    candidate_code: 'UV-2026-003',
    full_name: 'Lê Hoàng Long',
    email: 'long.lh@gmail.com',
    phone: '0919 777 666',
    position_applied: 'Chuyên Viên Tối Ưu Gian Hàng',
    department: 'Phòng Vận Hành TMĐT',
    source: 'Facebook Ads',
    stage: 'SCREENING',
    expected_salary: 16000000,
    experience_years: 4,
    cv_file: 'storage.ggbingo.vn/cv/le_hoang_long_cv.pdf',
    applied_date: '2026-08-05',
    status: 'In_Progress',
  },
  {
    id: 'cand_4',
    candidate_code: 'UV-2026-004',
    full_name: 'Vũ Minh Khôi',
    email: 'khoi.vm@gmail.com',
    phone: '0977 112 233',
    position_applied: 'Chuyên Viên Marketing Ads',
    department: 'Phòng Marketing',
    source: 'Referral',
    stage: 'HIRED_ONBOARDING',
    expected_salary: 18000000,
    experience_years: 3,
    cv_file: 'storage.ggbingo.vn/cv/vu_minh_khoi_cv.pdf',
    applied_date: '2026-07-25',
    interview_date: '2026-08-02',
    interview_score: 95,
    onboarding_progress: 75,
    approval_status: 'APPROVED',
    status: 'Onboarded',
  },
];

let candidates = [...INITIAL_CANDIDATES];

export function getCandidates(): Candidate[] {
  return candidates;
}

export function createCandidate(cand: Omit<Candidate, 'id' | 'candidate_code' | 'applied_date'>): Candidate {
  const code = `UV-2026-${String(candidates.length + 1).padStart(3, '0')}`;
  const created: Candidate = {
    ...cand,
    id: `cand_${Date.now()}`,
    candidate_code: code,
    applied_date: new Date().toISOString().split('T')[0],
  };
  candidates = [created, ...candidates];
  return created;
}

export function updateCandidate(id: string, fields: Partial<Candidate>): Candidate | undefined {
  const idx = candidates.findIndex((c) => c.id === id);
  if (idx !== -1) {
    candidates[idx] = { ...candidates[idx], ...fields };
    return candidates[idx];
  }
  return undefined;
}

export function deleteCandidate(id: string): boolean {
  candidates = candidates.filter((c) => c.id !== id);
  return true;
}

// 1-Click / Wizard chuyển ứng viên trúng tuyển thành nhân viên mới trong HRM
export function convertCandidateToEmployee(
  candidateId: string,
  customEmployeeData?: Partial<EmployeeProfile>
): EmployeeProfile | undefined {
  const cand = candidates.find((c) => c.id === candidateId);
  if (!cand) return undefined;

  const newEmpCode = customEmployeeData?.employee_code || `NV-00${String(employees.length + 101).padStart(3, '0')}`;
  const candSalary = customEmployeeData?.base_salary || cand.expected_salary || cand.salary_expectation || 15000000;

  const createdEmp: EmployeeProfile = {
    id: `emp_${Date.now()}`,
    employee_code: newEmpCode,
    full_name: customEmployeeData?.full_name || cand.full_name || cand.name || 'Nhân Viên Mới',
    email: customEmployeeData?.email || cand.email,
    phone: customEmployeeData?.phone || cand.phone,
    department: customEmployeeData?.department || cand.department || 'Phòng Kinh Doanh 1',
    team: customEmployeeData?.team || 'Đội 1',
    position: customEmployeeData?.position || cand.position_applied || cand.position || 'Chuyên Viên',
    joined_date: customEmployeeData?.joined_date || new Date().toISOString().split('T')[0],
    status: customEmployeeData?.status || 'Probation',
    contract_number: customEmployeeData?.contract_number || `HĐTV-2026/${newEmpCode}`,
    contract_type: customEmployeeData?.contract_type || 'Thử việc',
    contract_start_date: customEmployeeData?.contract_start_date || new Date().toISOString().split('T')[0],
    contract_file_r2: cand.cv_file || cand.cv_file_url || '',
    salary_grade: customEmployeeData?.salary_grade || 'G4',
    salary_grade_id: customEmployeeData?.salary_grade_id || 'sg_g4',
    salary_step_number: customEmployeeData?.salary_step_number || 1,
    base_salary: candSalary,
    probation_salary: customEmployeeData?.probation_salary || Math.round(candSalary * 0.85),
    insurance_salary: customEmployeeData?.insurance_salary || 6000000,
    bhxh_status: customEmployeeData?.bhxh_status || 'Chưa tham gia',
    dependent_count: customEmployeeData?.dependent_count ?? 0,
    allowances: customEmployeeData?.allowances || [
      { id: `al_${Date.now()}_1`, allowance_type_id: 'al_1', name: 'Phụ Cấp Ăn Trưa', amount: 730000, taxable: false, include_in_insurance: false },
      { id: `al_${Date.now()}_2`, allowance_type_id: 'al_2', name: 'Phụ Cấp Xăng Xe & Đi Lại', amount: 500000, taxable: false, include_in_insurance: false },
    ],
    default_shift_id: customEmployeeData?.default_shift_id || 'shift_office',
    id_card_number: customEmployeeData?.id_card_number || '',
    permanent_address: customEmployeeData?.permanent_address || '',
    current_address: customEmployeeData?.current_address || '',
    bank_account: customEmployeeData?.bank_account || '',
    bank_name: customEmployeeData?.bank_name || 'Techcombank',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    created_at: new Date().toISOString().split('T')[0],
    ...customEmployeeData,
  };

  employees = [createdEmp, ...employees];
  updateCandidate(candidateId, { stage: 'HIRED_ONBOARDING', notes: 'Đã hoàn tất chuyển sang nhân sự chính thức trong HRM' });
  return createdEmp;
}

// ==================== 9. TỰ ĐỘNG HÓA EMAIL TUYỂN DỤNG & ONBOARDING ====================
export const INITIAL_RECRUITMENT_EMAIL_TEMPLATES: RecruitmentEmailTemplate[] = [
  {
    id: 'tmpl_1',
    type: 'APPLY_RECEIVED',
    name: '1. Thư Xác Nhận Tiếp Nhận Hồ Sơ Ứng Tuyển',
    subject: '[GGBingo CRM] Xác Nhận Tiếp Nhận Hồ Sơ Ứng Tuyển Vị Trí {{position}}',
    body_html: `<p>Kính gửi <strong>{{candidate_name}}</strong>,</p>
<p>Cảm ơn bạn đã quan tâm và ứng tuyển vị trí <strong>{{position}}</strong> tại <strong>{{company_name}}</strong>.</p>
<p>Hội đồng Tuyển dụng đã nhận được CV của bạn và đang tiến hành đánh giá. Bộ phận Nhân sự sẽ phản hồi kết quả sàng lọc trong vòng <strong>48 giờ làm việc</strong>.</p>
<p>Trân trọng,<br/><strong>Phòng Tuyển Dụng & Nhân Lực - {{company_name}}</strong></p>`,
    sender_name: 'Ban Tuyển Dụng GGBingo (hr@ggbingo.vn)',
    is_auto_send_enabled: true,
    trigger_stage: 'APPLIED',
    variables_supported: ['{{candidate_name}}', '{{position}}', '{{company_name}}'],
  },
  {
    id: 'tmpl_2',
    type: 'INTERVIEW_INVITATION',
    name: '2. Thư Mời Tham Dự Phỏng Vấn (Google Meet / Trực Tiếp)',
    subject: '[GGBingo CRM] Thư Mời Tham Dự Phỏng Vấn Vị Trí {{position}}',
    body_html: `<p>Chào <strong>{{candidate_name}}</strong>,</p>
<p>Sau khi đánh giá hồ sơ, <strong>{{company_name}}</strong> rất ấn tượng với năng lực của bạn và trân trọng mời bạn tham dự buổi phỏng vấn chuyên môn:</p>
<ul>
  <li><strong>Vị trí:</strong> {{position}}</li>
  <li><strong>Thời gian:</strong> {{interview_time}}</li>
  <li><strong>Hình thức:</strong> Phỏng vấn Trực tuyến / Trực tiếp</li>
  <li><strong>Link Google Meet / Địa điểm:</strong> {{interview_link}}</li>
  <li><strong>Người phỏng vấn:</strong> {{interviewer_name}}</li>
</ul>
<p>Bạn vui lòng phản hồi email này để xác nhận lịch hẹn nhé.</p>
<p>Thân mến,<br/><strong>{{company_name}} Recruitment Team</strong></p>`,
    sender_name: 'Phòng Nhân Sự GGBingo',
    is_auto_send_enabled: true,
    trigger_stage: 'INTERVIEW',
    variables_supported: ['{{candidate_name}}', '{{position}}', '{{interview_time}}', '{{interview_link}}', '{{interviewer_name}}', '{{company_name}}'],
  },
  {
    id: 'tmpl_3',
    type: 'OFFER_LETTER',
    name: '3. Thư Mời Nhận Việc (Official Job Offer Letter)',
    subject: '[GGBingo CRM] Thư Mời Nhận Việc (Job Offer Letter) - {{candidate_name}}',
    body_html: `<p>Kính gửi <strong>{{candidate_name}}</strong>,</p>
<p>Chúc mừng bạn đã vượt qua các vòng phỏng vấn xuất sắc! <strong>{{company_name}}</strong> trân trọng gửi đến bạn Lời Mời Nhận Việc với các điều khoản đãi ngộ như sau:</p>
<ul>
  <li><strong>Chức danh công việc:</strong> {{position}} (Phòng: {{department}})</li>
  <li><strong>Mức lương thỏa thuận:</strong> <strong>{{salary_offer}}</strong> / tháng</li>
  <li><strong>Chế độ phụ cấp:</strong> Ăn trưa 730,000 ₫ + Xăng xe 500,000 ₫ + Thưởng KPI P3</li>
  <li><strong>Ngày bắt đầu nhận việc:</strong> {{start_date}}</li>
  <li><strong>Địa điểm làm việc:</strong> Tòa nhà GGBingo Enterprise, Cầu Giấy, Hà Nội</li>
</ul>
<p>Chi tiết Hợp đồng Thử việc và bản ký số vui lòng xem tệp đính kèm. Trân trọng chào đón bạn gia nhập đại gia đình GGBingo!</p>`,
    sender_name: 'Ban Giám Đốc & HR GGBingo',
    is_auto_send_enabled: false,
    trigger_stage: 'OFFER',
    variables_supported: ['{{candidate_name}}', '{{position}}', '{{department}}', '{{salary_offer}}', '{{start_date}}', '{{company_name}}'],
  },
  {
    id: 'tmpl_4',
    type: 'ONBOARDING_WELCOME',
    name: '4. Thư Chào Đón Nhân Viên Mới & Welcome Kit',
    subject: '🎉 Chào mừng {{candidate_name}} gia nhập đại gia đình {{company_name}}!',
    body_html: `<p>Chào mừng <strong>{{candidate_name}}</strong> đến với <strong>{{company_name}}</strong>!</p>
<p>Để chuẩn bị cho ngày đầu tiên làm việc <strong>{{start_date}}</strong>, Bộ phận Nhân sự gửi bạn một số hướng dẫn quan trọng:</p>
<ol>
  <li><strong>Tài khoản hệ thống:</strong> Đã tạo tài khoản CRM nội bộ theo email {{candidate_email}}.</li>
  <li><strong>Bàn giao thiết bị:</strong> Bạn sẽ nhận Laptop và Thẻ nhân viên tại Quầy IT lúc 08:30 sáng.</li>
  <li><strong>Checklist Onboarding:</strong> Vui lòng truy cập module Onboarding để hoàn thiện hồ sơ 7 bước.</li>
</ol>
<p>Chúc bạn có một hành trình phát triển rực rỡ cùng GGBingo!</p>`,
    sender_name: 'GGBingo Onboarding Support',
    is_auto_send_enabled: true,
    trigger_stage: 'HIRED_ONBOARDING',
    variables_supported: ['{{candidate_name}}', '{{candidate_email}}', '{{start_date}}', '{{company_name}}'],
  },
  {
    id: 'tmpl_5',
    type: 'CANDIDATE_REJECTION',
    name: '5. Thư Cảm Ơn & Thông Báo Chưa Phù Hợp',
    subject: '[GGBingo CRM] Cảm Ơn Ứng Tuyển Vị Trí {{position}}',
    body_html: `<p>Kính gửi <strong>{{candidate_name}}</strong>,</p>
<p>Cảm ơn bạn đã dành thời gian tham gia ứng tuyển và phỏng vấn vị trí <strong>{{position}}</strong> tại <strong>{{company_name}}</strong>.</p>
<p>Mặc dù rất ấn tượng với hồ sơ của bạn, hiện tại hồ sơ của bạn chưa hoàn toàn phù hợp với tiêu chí tuyển dụng đợt này. Chúng tôi xin phép lưu lại thông tin của bạn vào hệ thống cơ sở dữ liệu nhân tài (Talent Pool) và sẽ liên hệ lại khi có cơ hội phù hợp hơn trong tương lai.</p>
<p>Chúc bạn luôn thành công trên con đường sự nghiệp!</p>`,
    sender_name: 'Ban Tuyển Dụng GGBingo',
    is_auto_send_enabled: false,
    trigger_stage: 'REJECTED',
    variables_supported: ['{{candidate_name}}', '{{position}}', '{{company_name}}'],
  },
];

let recruitmentEmailTemplates = [...INITIAL_RECRUITMENT_EMAIL_TEMPLATES];
let emailLogs: EmailLogEntry[] = [
  {
    id: 'elog_1',
    candidate_id: 'cand_2',
    candidate_name: 'Nguyễn Thị Bích Trâm',
    candidate_email: 'bichtram.ng@gmail.com',
    template_type: 'OFFER_LETTER',
    subject: '[GGBingo CRM] Thư Mời Nhận Việc (Job Offer Letter) - Nguyễn Thị Bích Trâm',
    content_preview: 'Mức lương đề xuất 12,000,000 ₫/tháng + Phụ cấp ăn trưa 730,000 ₫...',
    sent_at: '2026-08-11 10:30',
    sender: 'Đặng Kim Anh (HR)',
    status: 'OPENED',
  },
  {
    id: 'elog_2',
    candidate_id: 'cand_1',
    candidate_name: 'Trần Vũ Hoàng',
    candidate_email: 'hoang.tv@gmail.com',
    template_type: 'INTERVIEW_INVITATION',
    subject: '[GGBingo CRM] Thư Mời Tham Dự Phỏng Vấn Vị Trí Chuyên Viên Tư Vấn TMĐT',
    content_preview: 'Thời gian: 2026-08-18 14:00 qua Google Meet...',
    sent_at: '2026-08-12 15:45',
    sender: 'Đặng Kim Anh (HR)',
    status: 'SENT',
  },
];

export function getRecruitmentEmailTemplates(): RecruitmentEmailTemplate[] {
  return recruitmentEmailTemplates;
}

export function updateRecruitmentEmailTemplate(id: string, fields: Partial<RecruitmentEmailTemplate>): RecruitmentEmailTemplate | undefined {
  const idx = recruitmentEmailTemplates.findIndex((t) => t.id === id);
  if (idx !== -1) {
    recruitmentEmailTemplates[idx] = { ...recruitmentEmailTemplates[idx], ...fields };
    return recruitmentEmailTemplates[idx];
  }
  return undefined;
}

export function sendRecruitmentEmail(
  candidate: Candidate,
  templateType: EmailTemplateType,
  customVariables?: Record<string, string>
): EmailLogEntry {
  const tmpl = recruitmentEmailTemplates.find((t) => t.type === templateType) || recruitmentEmailTemplates[0];
  let subject = tmpl.subject;
  let body = tmpl.body_html;

  const candName = candidate.full_name || candidate.name || 'Ứng Viên';
  const candPos = candidate.position_applied || candidate.position || 'Chuyên Viên';
  const candSal = candidate.expected_salary || candidate.salary_expectation || 15000000;

  const vars: Record<string, string> = {
    '{{candidate_name}}': candName,
    '{{candidate_email}}': candidate.email,
    '{{position}}': candPos,
    '{{department}}': candidate.department || 'Phòng Kinh Doanh',
    '{{interview_time}}': candidate.interview_date || '14:00 Thứ 3 tới',
    '{{interview_link}}': 'https://meet.google.com/ggb-hire-2026',
    '{{interviewer_name}}': candidate.interviewer_name || 'Hội Đồng Tuyển Dụng GGBingo',
    '{{salary_offer}}': `${candSal.toLocaleString('en-US')} ₫`,
    '{{start_date}}': '01/09/2026',
    '{{company_name}}': 'GGBingo Platform',
    ...(customVariables || {}),
  };

  Object.entries(vars).forEach(([k, v]) => {
    subject = subject.replaceAll(k, v);
    body = body.replaceAll(k, v);
  });

  const newLog: EmailLogEntry = {
    id: `elog_${Date.now()}`,
    candidate_id: candidate.id,
    candidate_name: candName,
    candidate_email: candidate.email,
    template_type: templateType,
    subject: subject,
    content_preview: body.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...',
    sent_at: new Date().toLocaleString('vi-VN'),
    sender: 'Đặng Kim Anh (HR Manager)',
    status: 'SENT',
  };

  emailLogs = [newLog, ...emailLogs];
  return newLog;
}

export function getEmailLogs(): EmailLogEntry[] {
  return emailLogs;
}

// ==================== 10. SOẠN THẢO VĂN BẢN & TRÌNH KÝ SỐ (DOCUMENT GENERATOR) ====================
export const INITIAL_DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'dt_1',
    type: 'LABOR_CONTRACT',
    name: 'Hợp Đồng Lao Động Chuẩn (Nghị Định 145)',
    code: 'HDLD-MAU-01',
    title_template: 'HỢP ĐỒNG LAO ĐỘNG - {{employee_name}} (Mã NV: {{employee_code}})',
    body_template_html: `<h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
<p><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
<hr/>
<h2 style="text-align:center;">HỢP ĐỒNG LAO ĐỘNG</h2>
<p style="text-align:center;">Số: <strong>{{contract_number}}</strong></p>
<p>Hôm nay, ngày {{current_date}}, tại Văn phòng Công ty Cổ phần Công nghệ GGBingo, chúng tôi gồm có:</p>
<h4>BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</h4>
<ul>
  <li>Tên công ty: <strong>CÔNG TY CỔ PHẦN CÔNG NGHỆ GGBINGO VIỆT NAM</strong></li>
  <li>Đại diện: Ông <strong>Phạm Minh Đức</strong> - Chức vụ: Giám Đốc Kinh Doanh</li>
  <li>Địa chỉ: Tòa nhà GGBingo Tower, Cầu Giấy, Hà Nội</li>
</ul>
<h4>BÊN B: NGƯỜI LAO ĐỘNG</h4>
<ul>
  <li>Họ và tên: <strong>{{employee_name}}</strong></li>
  <li>Mã nhân viên: <strong>{{employee_code}}</strong> - CCCD: <strong>{{id_card_number}}</strong></li>
  <li>Địa chỉ thường trú: {{permanent_address}}</li>
  <li>Số điện thoại: {{phone}} - Email: {{email}}</li>
</ul>
<h4>ĐIỀU KHOẢN HỢP ĐỒNG:</h4>
<ol>
  <li><strong>Vị trí công tác:</strong> {{position}} thuộc {{department}}.</li>
  <li><strong>Mức lương chính (P1):</strong> <strong>{{base_salary}}</strong> / tháng.</li>
  <li><strong>Chế độ phụ cấp:</strong> {{allowances_text}}.</li>
  <li><strong>Mức lương đóng BHXH:</strong> {{insurance_salary}} (Trích nộp theo đúng luật lao động).</li>
  <li><strong>Thời giờ làm việc:</strong> Ca {{shift_name}} (8 giờ/ngày theo quy định).</li>
</ol>`,
    placeholders: ['{{employee_name}}', '{{employee_code}}', '{{contract_number}}', '{{id_card_number}}', '{{position}}', '{{department}}', '{{base_salary}}', '{{allowances_text}}', '{{insurance_salary}}', '{{shift_name}}'],
    is_active: true,
  },
  {
    id: 'dt_2',
    type: 'SALARY_ADJUSTMENT_DECISION',
    name: 'Quyết Định Nâng Lương & Điều Chỉnh Phụ Cấp',
    code: 'QD-NL-01',
    title_template: 'QUYẾT ĐỊNH ĐIỀU CHỈNH LƯƠNG & PHỤ CẤP - {{employee_name}}',
    body_template_html: `<h3>CÔNG TY CỔ PHẦN CÔNG NGHỆ GGBINGO</h3>
<h2 style="text-align:center;">QUYẾT ĐỊNH</h2>
<p style="text-align:center;"><em>(V/v: Nâng bậc lương và điều chỉnh phụ cấp chức vụ)</em></p>
<p><strong>TỔNG GIÁM ĐỐC CÔNG TY GGBINGO</strong></p>
<ul>
  <li>Căn cứ Điều lệ tổ chức và hoạt động của Công ty;</li>
  <li>Xét đề nghị của Giám đốc Nhân sự và Trưởng phòng {{department}};</li>
  <li>Xét thành tích đóng góp và kết quả đánh giá KPI của Ông/Bà <strong>{{employee_name}}</strong>.</li>
</ul>
<p><strong>QUYẾT ĐỊNH:</strong></p>
<p><strong>Điều 1:</strong> Điều chỉnh mức lương chính thức của Ông/Bà <strong>{{employee_name}}</strong> (Mã NV: {{employee_code}}) - Chức vụ: {{position}} từ mức <strong>{{previous_salary}}</strong> lên mức <strong>{{new_salary}}</strong> / tháng.</p>
<p><strong>Điều 2:</strong> Áp dụng các khoản phụ cấp hàng tháng: {{allowances_text}}.</p>
<p><strong>Điều 3:</strong> Quyết định có hiệu lực thi hành kể từ ngày <strong>{{effective_date}}</strong>.</p>`,
    placeholders: ['{{employee_name}}', '{{employee_code}}', '{{department}}', '{{position}}', '{{previous_salary}}', '{{new_salary}}', '{{allowances_text}}', '{{effective_date}}'],
    is_active: true,
  },
  {
    id: 'dt_3',
    type: 'APPOINTMENT_DECISION',
    name: 'Quyết Định Bổ Nhiệm Chức Vụ Quản Lý',
    code: 'QD-BN-01',
    title_template: 'QUYẾT ĐỊNH BỔ NHIỆM CHỨC VỤ - {{employee_name}}',
    body_template_html: `<h3>CÔNG TY CỔ PHẦN CÔNG NGHỆ GGBINGO</h3>
<h2 style="text-align:center;">QUYẾT ĐỊNH BỔ NHIỆM</h2>
<p><strong>Điều 1:</strong> Bổ nhiệm Ông/Bà <strong>{{employee_name}}</strong> giữ chức vụ <strong>{{position}}</strong> trực thuộc <strong>{{department}}</strong>.</p>
<p><strong>Điều 2:</strong> Ông/Bà {{employee_name}} có trách nhiệm quản lý, điều hành toàn bộ công việc chuyên môn và chỉ tiêu GMV được giao.</p>
<p><strong>Điều 3:</strong> Quyết định có hiệu lực từ ngày {{effective_date}}.</p>`,
    placeholders: ['{{employee_name}}', '{{position}}', '{{department}}', '{{effective_date}}'],
    is_active: true,
  },
  {
    id: 'dt_4',
    type: 'NDA_SECURITY_AGREEMENT',
    name: 'Thỏa Thuận Bảo Mật Thông Tin & Dữ Liệu Khách Hàng (NDA)',
    code: 'NDA-01',
    title_template: 'THỎA THUẬN BẢO MẬT THÔNG TIN (NDA) - {{employee_name}}',
    body_template_html: `<h3>THỎA THUẬN BẢO MẬT THÔNG TIN VÀ AN TOÀN DỮ LIỆU</h3>
<p>Người lao động: <strong>{{employee_name}}</strong> (Mã NV: {{employee_code}}) cam kết tuyệt đối bảo mật thông tin khách hàng, số điện thoại, doanh số GMV gian hàng TMĐT và mã nguồn hệ thống GGBingo CRM.</p>`,
    placeholders: ['{{employee_name}}', '{{employee_code}}'],
    is_active: true,
  },
];

let generatedDocuments: GeneratedDocument[] = [
  {
    id: 'gdoc_1',
    document_code: 'QĐ-NL/2025/08-01',
    template_id: 'dt_2',
    template_type: 'SALARY_ADJUSTMENT_DECISION',
    title: 'QUYẾT ĐỊNH ĐIỀU CHỈNH LƯƠNG & PHỤ CẤP - Trần Văn Hoàng',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    department: 'Phòng Kinh Doanh 1',
    content_html: '<p>Quyết định nâng mức lương từ 22,000,000 ₫ lên 25,000,000 ₫ kèm phụ cấp trách nhiệm 2,000,000 ₫...</p>',
    status: 'APPROVED_SIGNED',
    created_by_name: 'Đặng Kim Anh (HR)',
    created_at: '2025-08-25',
    signed_by_name: 'Phạm Minh Đức (Giám Đốc)',
    signed_at: '2025-08-26',
    pdf_file_url: 'storage.ggbingo.vn/documents/QD_NL_NV00101.pdf',
    email_sent_to: 'hoang.tv@ggbingo.vn',
    email_sent_at: '2025-08-26 14:00',
  },
  {
    id: 'gdoc_2',
    document_code: 'HĐLĐ-2025/001',
    template_id: 'dt_1',
    template_type: 'LABOR_CONTRACT',
    title: 'HỢP ĐỒNG LAO ĐỘNG - Trần Văn Hoàng (Mã NV: NV-00101)',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    department: 'Phòng Kinh Doanh 1',
    content_html: '<p>Hợp đồng lao động chính thức thời hạn 3 năm...</p>',
    status: 'APPROVED_SIGNED',
    created_by_name: 'Đặng Kim Anh (HR)',
    created_at: '2025-03-15',
    signed_by_name: 'Phạm Minh Đức (Giám Đốc)',
    signed_at: '2025-03-15',
    pdf_file_url: 'storage.ggbingo.vn/contracts/HDLD_NV00101.pdf',
  },
];

export function getDocumentTemplates(): DocumentTemplate[] {
  return INITIAL_DOCUMENT_TEMPLATES;
}

export function getGeneratedDocuments(): GeneratedDocument[] {
  return generatedDocuments;
}

export function createGeneratedDocument(doc: Omit<GeneratedDocument, 'id' | 'created_at' | 'status'>): GeneratedDocument {
  const created: GeneratedDocument = {
    ...doc,
    id: `gdoc_${Date.now()}`,
    status: 'PENDING_APPROVAL',
    created_at: new Date().toISOString().split('T')[0],
  };
  generatedDocuments = [created, ...generatedDocuments];
  return created;
}

export function signGeneratedDocument(docId: string, signerName: string): GeneratedDocument | undefined {
  const idx = generatedDocuments.findIndex((d) => d.id === docId);
  if (idx !== -1) {
    generatedDocuments[idx] = {
      ...generatedDocuments[idx],
      status: 'APPROVED_SIGNED',
      signed_by_name: signerName,
      signed_at: new Date().toISOString().split('T')[0],
    };
    return generatedDocuments[idx];
  }
  return undefined;
}

export function sendDocumentEmail(docId: string, recipientEmail: string): GeneratedDocument | undefined {
  const idx = generatedDocuments.findIndex((d) => d.id === docId);
  if (idx !== -1) {
    generatedDocuments[idx] = {
      ...generatedDocuments[idx],
      status: 'SENT_EMAIL',
      email_sent_to: recipientEmail,
      email_sent_at: new Date().toLocaleString('vi-VN'),
    };
    return generatedDocuments[idx];
  }
  return undefined;
}

export function deleteGeneratedDocument(docId: string): boolean {
  generatedDocuments = generatedDocuments.filter((d) => d.id !== docId);
  return true;
}

// ==================== 11. QUẢN LÝ & THEO DÕI BHXH CHUYÊN SÂU ====================
export const DEFAULT_SOCIAL_INSURANCE_CONFIG: SocialInsuranceConfig = {
  bhxh_employee_rate: 8.0,
  bhxh_company_rate: 17.5,
  bhyt_employee_rate: 1.5,
  bhyt_company_rate: 3.0,
  bhtn_employee_rate: 1.0,
  bhtn_company_rate: 1.0,
  union_company_rate: 2.0,
  min_regional_salary: 4960000,
  max_salary_cap_bhxh: 46800000,
  max_salary_cap_bhtn: 99200000,
  standard_monthly_workdays: 26,
  ot_rate_weekday: 150,
  ot_rate_weekend: 200,
  ot_rate_holiday: 300,
  cutoff_day_of_month: 20,
};

let socialInsuranceConfig = { ...DEFAULT_SOCIAL_INSURANCE_CONFIG };

export const INITIAL_SOCIAL_INSURANCE_PROFILES: SocialInsuranceProfile[] = [
  {
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    department: 'Phòng Kinh Doanh 1',
    social_insurance_code: '7910928374',
    health_insurance_code: 'DN4010928374',
    health_provider: 'Bệnh Viện Đa Khoa Y Học Cổ Truyền Hà Nội (01-018)',
    health_provider_code: '01-018',
    bhxh_start_date: '2025-03-15',
    bhxh_first_joined_date: '2016-08',
    bhxh_status: 'ACTIVE',
    insurance_salary: 12000000,
    monthly_employee_deduction: 1260000, // 10.5%
    monthly_company_contribution: 2580000, // 21.5%
    trade_union_fee: 240000, // 2%
  },
  {
    employee_id: 'e2',
    employee_name: 'Lê Thị Mai',
    department: 'Phòng Kinh Doanh 2',
    social_insurance_code: '7910837465',
    health_insurance_code: 'DN4010837465',
    health_provider: 'Bệnh Viện Giao Thông Vận Tải (01-006)',
    health_provider_code: '01-006',
    bhxh_start_date: '2025-08-01',
    bhxh_first_joined_date: '2019-01',
    bhxh_status: 'ACTIVE',
    insurance_salary: 8000000,
    monthly_employee_deduction: 840000,
    monthly_company_contribution: 1720000,
    trade_union_fee: 160000,
  },
  {
    employee_id: 'e3',
    employee_name: 'Phạm Minh Đức',
    department: 'Ban Giám Đốc',
    social_insurance_code: '7910112233',
    health_insurance_code: 'DN4010112233',
    health_provider: 'Bệnh Viện Hữu Nghị Việt Đức (01-001)',
    health_provider_code: '01-001',
    bhxh_start_date: '2024-01-01',
    bhxh_first_joined_date: '2012-05',
    bhxh_status: 'ACTIVE',
    insurance_salary: 35000000,
    monthly_employee_deduction: 3675000,
    monthly_company_contribution: 7525000,
    trade_union_fee: 700000,
  },
  {
    employee_id: 'e4',
    employee_name: 'Đặng Kim Anh',
    department: 'Phòng Nhân Sự (HR)',
    social_insurance_code: '7910556677',
    health_insurance_code: 'DN4010556677',
    health_provider: 'Bệnh Viện Đại Học Y Hà Nội (01-015)',
    health_provider_code: '01-015',
    bhxh_start_date: '2024-06-01',
    bhxh_first_joined_date: '2015-09',
    bhxh_status: 'ACTIVE',
    insurance_salary: 15000000,
    monthly_employee_deduction: 1575000,
    monthly_company_contribution: 3225000,
    trade_union_fee: 300000,
  },
  {
    employee_id: 'e5',
    employee_name: 'Nguyễn Văn Tuấn',
    department: 'Phòng Marketing',
    social_insurance_code: '7910998877',
    health_insurance_code: 'DN4010998877',
    health_provider: 'Bệnh Viện Thanh Nhàn (01-012)',
    health_provider_code: '01-012',
    bhxh_start_date: '2025-05-01',
    bhxh_status: 'SUSPENDED_UNPAID_LEAVE',
    insurance_salary: 10000000,
    monthly_employee_deduction: 0,
    monthly_company_contribution: 0,
    trade_union_fee: 0,
    notes: 'Tạm dừng đóng BHXH do nghỉ việc riêng không lương 2 tháng',
  },
];

let socialInsuranceProfiles = [...INITIAL_SOCIAL_INSURANCE_PROFILES];

export const INITIAL_BHXH_CHANGELOGS: BhxhChangeLogRecord[] = [
  {
    id: 'bcl_1',
    period: 'Tháng 08/2026',
    employee_id: 'e1',
    employee_name: 'Trần Văn Hoàng',
    social_insurance_code: '7910928374',
    change_type: 'ĐIỀU_CHỈNH_LƯƠNG',
    old_salary: 10000000,
    new_salary: 12000000,
    effective_month: '08/2026',
    status: 'CƠ_QUAN_BHXH_ĐÃ_DUYỆT',
    submission_date: '2026-08-05',
    note: 'Tăng mức đóng BHXH theo Quyết định nâng lương số QĐ-NL/2025/08-01',
  },
  {
    id: 'bcl_2',
    period: 'Tháng 08/2026',
    employee_id: 'cand_4',
    employee_name: 'Vũ Minh Khôi',
    social_insurance_code: '7910445566',
    change_type: 'TĂNG_MỚI',
    new_salary: 12000000,
    effective_month: '08/2026',
    status: 'ĐÃ_NỘP_CƠ_QUAN_BHXH',
    submission_date: '2026-08-10',
    note: 'Báo tăng mới lao động ký HĐLĐ chính thức sau thử việc',
  },
];

let bhxhChangeLogs = [...INITIAL_BHXH_CHANGELOGS];

export function getSocialInsuranceProfiles(): SocialInsuranceProfile[] {
  return socialInsuranceProfiles;
}

export function updateSocialInsuranceProfile(employeeId: string, fields: Partial<SocialInsuranceProfile>): SocialInsuranceProfile | undefined {
  const idx = socialInsuranceProfiles.findIndex((p) => p.employee_id === employeeId);
  if (idx !== -1) {
    socialInsuranceProfiles[idx] = { ...socialInsuranceProfiles[idx], ...fields };
    return socialInsuranceProfiles[idx];
  } else {
    const created: SocialInsuranceProfile = {
      employee_id: employeeId,
      bhxh_status: fields.bhxh_status || 'NOT_ENROLLED',
      insurance_salary: fields.insurance_salary || 6000000,
      monthly_employee_deduction: (fields.insurance_salary || 6000000) * 0.105,
      monthly_company_contribution: (fields.insurance_salary || 6000000) * 0.215,
      trade_union_fee: (fields.insurance_salary || 6000000) * 0.02,
      ...fields,
    };
    socialInsuranceProfiles = [created, ...socialInsuranceProfiles];
    return created;
  }
}

export function getSocialInsuranceConfig(): SocialInsuranceConfig {
  return socialInsuranceConfig;
}

export function saveSocialInsuranceConfig(newConfig: Partial<SocialInsuranceConfig>): SocialInsuranceConfig {
  socialInsuranceConfig = { ...socialInsuranceConfig, ...newConfig };
  return socialInsuranceConfig;
}

export function getBhxhChangeLogs(): BhxhChangeLogRecord[] {
  return bhxhChangeLogs;
}

export function addBhxhChangeLog(record: Omit<BhxhChangeLogRecord, 'id'>): BhxhChangeLogRecord {
  const created: BhxhChangeLogRecord = {
    ...record,
    id: `bcl_${Date.now()}`,
  };
  bhxhChangeLogs = [created, ...bhxhChangeLogs];
  return created;
}

// ==================== 10. QUẢN LÝ NGÀY NGHỈ LỄ & CHÍNH SÁCH NGHỈ TUẦN ====================
export const INITIAL_HOLIDAYS: HolidayDefinition[] = [
  { id: 'hol_1', date: '2026-01-01', name: 'Tết Dương Lịch 2026', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ 1 ngày hưởng 100% lương theo Luật Lao Động' },
  { id: 'hol_2', date: '2026-02-16', name: 'Tết Nguyên Đán Bính Ngọ (29 Tết)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ âm lịch cổ truyền' },
  { id: 'hol_3', date: '2026-02-17', name: 'Tết Nguyên Đán Bính Ngọ (Mùng 1)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ âm lịch cổ truyền' },
  { id: 'hol_4', date: '2026-02-18', name: 'Tết Nguyên Đán Bính Ngọ (Mùng 2)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ âm lịch cổ truyền' },
  { id: 'hol_5', date: '2026-02-19', name: 'Tết Nguyên Đán Bính Ngọ (Mùng 3)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ âm lịch cổ truyền' },
  { id: 'hol_6', date: '2026-02-20', name: 'Tết Nguyên Đán Bính Ngọ (Mùng 4)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ âm lịch cổ truyền' },
  { id: 'hol_7', date: '2026-04-26', name: 'Giỗ Tổ Hùng Vương (10/3 Âm Lịch)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ lễ Giỗ Tổ toàn quốc' },
  { id: 'hol_8', date: '2026-04-30', name: 'Ngày Giải Phóng Miền Nam (30/4)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Kỷ niệm 30/4' },
  { id: 'hol_9', date: '2026-05-01', name: 'Ngày Quốc Tế Lao Động (1/5)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Kỷ niệm 1/5' },
  { id: 'hol_10', date: '2026-09-01', name: 'Nghỉ Liền Kề Quốc Khánh', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Nghỉ 1 ngày trước/sau lễ 2/9 theo quy định Chính phủ' },
  { id: 'hol_11', date: '2026-09-02', name: 'Ngày Quốc Khánh Nước CHXHCN Việt Nam (2/9)', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Quốc khánh Việt Nam' },
  { id: 'hol_12', date: '2026-11-15', name: 'Ngày Thành Lập Tập Đoàn GGBingo', year: 2026, is_paid: true, pay_multiplier: 3.0, description: 'Ngày truyền thống nội bộ công ty (Hưởng 100% lương)' },
];

export const INITIAL_WEEKEND_POLICY: WeekendPolicySettings = {
  saturday_rule: 'HALF_DAY_MORNING',
  sunday_rule: 'OFF',
  holiday_pay_rate: 300,
  weekend_pay_rate: 200,
  allow_outside_checkin: true,
  require_face_capture_outside: true,
  office_lat: 21.03472,
  office_lng: 105.78306,
  office_address: 'Tòa nhà Leadvisors Tower, 643 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội',
  office_radius_meters: 200,
};

let holidaysList = [...INITIAL_HOLIDAYS];
let weekendPolicy = { ...INITIAL_WEEKEND_POLICY };

export function getHolidays(year?: number): HolidayDefinition[] {
  if (year) {
    return holidaysList.filter((h) => h.year === year);
  }
  return holidaysList;
}

export function addHoliday(holiday: Omit<HolidayDefinition, 'id'>): HolidayDefinition {
  const created: HolidayDefinition = {
    ...holiday,
    id: `hol_${Date.now()}`,
  };
  holidaysList = [created, ...holidaysList];
  return created;
}

export function updateHoliday(id: string, fields: Partial<HolidayDefinition>): HolidayDefinition | undefined {
  const idx = holidaysList.findIndex((h) => h.id === id);
  if (idx !== -1) {
    holidaysList[idx] = { ...holidaysList[idx], ...fields };
    return holidaysList[idx];
  }
  return undefined;
}

export function deleteHoliday(id: string): boolean {
  holidaysList = holidaysList.filter((h) => h.id !== id);
  return true;
}

export function getWeekendPolicy(): WeekendPolicySettings {
  return weekendPolicy;
}

export function saveWeekendPolicy(newPolicy: Partial<WeekendPolicySettings>): WeekendPolicySettings {
  weekendPolicy = { ...weekendPolicy, ...newPolicy };
  return weekendPolicy;
}

