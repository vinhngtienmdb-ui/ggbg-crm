import { EmployeeProfile, OrgNode, ApprovalAuditStep } from '@/types';
export const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'e1',
    employee_code: 'NV-00101',
    full_name: 'Trần Văn Hoàng',
    email: 'hoang.tv@ggbingo.vn',
    phone: '0912 345 678',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 1',
    position: 'Trưởng Nhóm Sale',
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
    bank_account: '19038271625401',
    bank_name: 'Techcombank - CN Cầu Giấy',
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
    employee_code: 'NV-00102',
    full_name: 'Lê Thị Mai',
    email: 'mai.lt@ggbingo.vn',
    phone: '0988 765 432',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 2',
    team: 'Đội 3',
    position: 'Chuyên Viên Sale',
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
    bank_account: '1029384756',
    bank_name: 'MB Bank - CN Hoàn Kiếm',
    direct_manager_name: 'Trần Văn Hoàng (Trưởng Nhóm Sale)',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    direct_manager_approved: true,
    sales_director_approved: true,
    created_at: '2025-06-01',
  },
  {
    id: 'e3',
    employee_code: 'NV-00103',
    full_name: 'Đặng Kim Anh',
    email: 'anh.dk@ggbingo.vn',
    phone: '0936 123 999',
    avatar_url: '',
    department: 'Phòng Nhân Sự (HR)',
    team: 'HR Admin',
    position: 'Quản Lý HR',
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
    bank_account: '999888777666',
    bank_name: 'Vietcombank - CN Ba Đình',
    direct_manager_name: 'Super Admin GGBingo',
    approval_status: 'APPROVED_FOR_ONBOARDING',
    direct_manager_approved: true,
    sales_director_approved: true,
    created_at: '2024-11-10',
  },
  {
    id: 'e4',
    employee_code: 'NV-00104',
    full_name: 'Nguyễn Quốc Tuấn',
    email: 'tuan.nq@ggbingo.vn',
    phone: '0977 888 111',
    avatar_url: '',
    department: 'Phòng Vận Hành TMĐT',
    team: 'Đội Shopee/TikTok',
    position: 'Chuyên Viên Tối Ưu Gian Hàng',
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
    bank_account: '0977888111',
    bank_name: 'VPBank - CN Hà Nội',
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
    employee_code: 'NV-00105',
    full_name: 'Phạm Thanh Hương',
    email: 'huong.pt@ggbingo.vn',
    phone: '0915 678 999',
    avatar_url: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 2',
    position: 'Chuyên Viên Tư Vấn Gói Dịch Vụ',
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
    bank_account: '0915678999',
    bank_name: 'Techcombank - CN Hà Nội',
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
  name: string; // Giám Đốc Kinh Doanh, Giám Đốc Thị Trường, Trưởng Phòng Kinh Doanh...
  position_name: string; // Giám Đốc, Trưởng Phòng...
  grade_code: string; // G1, G2, G3...
  department: string;
  rank_level: number; // 1: Ban Giám Đốc, 2: Quản Lý & Trưởng Phòng, 3: Chuyên Viên Thực Thao, 4: Thử Việc
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
