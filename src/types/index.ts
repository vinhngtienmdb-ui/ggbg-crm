export type UserRole = 'SUPER_ADMIN' | 'SALES_MANAGER' | 'SALES_REP' | 'SALE_EXEC' | 'TEAM_LEADER' | 'CSKH' | 'AUDITOR' | 'DIRECTOR' | 'HR_MANAGER';

export interface UserAccount {
  id: string;
  profile_id: string;
  employee_code: string;
  employee_name: string;
  username: string;
  email: string;
  role: UserRole;
  role_name: string;
  account_status: 'Active' | 'Locked' | 'Inactive';
  is_super_admin: boolean;
  must_change_password?: boolean;
  last_login_at?: string;
  created_at: string;
  permissions?: string[];
}

export type CustomerType = 'B2B_Agency_Service' | 'GGBingoVN_Merchant';
export type CustomerTier = 'Standard' | 'Silver' | 'Gold' | 'VIP';
export type LifecycleStage = 'VIP' | 'Regular' | 'Prospect' | 'At-Risk' | 'Churned';
export type CustomerEntityType = 'ENTERPRISE' | 'INDIVIDUAL';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycDocument {
  doc_id: string;
  doc_type: 'GPKD' | 'CCCD_FRONT' | 'CCCD_BACK' | 'AUTHORIZATION_LETTER' | 'PASSPORT' | 'AVATAR_PHOTO' | 'APPLICATION_FORM' | 'HEALTH_CERT' | 'DIPLOMA' | 'CONTRACT';
  doc_name: string;
  file_r2_path: string;
  uploaded_at: string;
  status: 'VALID' | 'PENDING';
}

export interface Customer {
  id: string;
  customer_code: string;
  name: string;
  entity_type: CustomerEntityType;
  company_name?: string;
  tax_code?: string;
  id_card_number?: string;
  id_card_issue_date?: string;
  id_card_issue_place?: string;
  representative_name?: string;
  phone: string;
  email?: string;
  address?: string;
  customer_type: CustomerType;
  tier: CustomerTier;
  lifecycle_stage: LifecycleStage;
  health_score: number;
  ltv_total_spent: number;
  ecom_platforms: ('Shopee' | 'TikTokShop' | 'Lazada' | 'Amazon' | 'GGBingoVN')[];
  avg_monthly_gmv: number;
  owner_name: string;
  ops_manager_name?: string;
  cskh_task_assigned?: string;
  contract_r2_file?: string;
  kyc_status: KycStatus;
  kyc_documents?: KycDocument[];
  tags: string[];
  created_at: string;
}

export type LeadSource =
  | 'Facebook Ads'
  | 'Facebook Lead Ads'
  | 'TikTok Ads'
  | 'TikTok Lead Gen'
  | 'Google Ads'
  | 'Google Ads Form'
  | 'Zalo OA Form'
  | 'Hotline Zalo'
  | 'Website GGBingoVN'
  | 'Event / Hội Thảo'
  | 'Referral / Giới Thiệu'
  | 'Bulk Import Excel'
  | 'Universal Webhook';

export interface Lead {
  id: string;
  lead_code: string;
  customer_id?: string;
  full_name: string;
  entity_type: CustomerEntityType;
  phone: string;
  email?: string;
  company_name?: string;
  tax_code?: string;
  id_card_number?: string;
  interested_product_id?: string;
  interested_product_name?: string;
  address?: string;
  shop_link?: string;
  source_name: LeadSource;
  pipeline_id: string;
  stage_id: string;
  stage_name: string;
  assigned_sale_name: string;
  estimated_budget: number;
  lead_score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Negotiating' | 'Converted' | 'Lost';
  kyc_status?: KycStatus;
  created_at: string;
}

export interface BulkImportRow {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  company_name?: string;
  source_name: LeadSource;
  estimated_budget: number;
  entity_type: CustomerEntityType;
  is_duplicate: boolean;
  duplicate_reason?: string;
}

export interface LeadChannelStats {
  source_name: string;
  total_leads: number;
  converted_count: number;
  conversion_rate: number;
  total_budget: number;
  color?: string;
}

export interface VoIPCallLog {
  id: string;
  call_id: string;
  caller_name: string;
  customer_name: string;
  phone_number: string;
  direction: 'Inbound' | 'Outbound';
  duration_seconds: number;
  status: 'Answered' | 'Missed' | 'Busy';
  recording_r2_url?: string;
  created_at: string;
}

export type KpiAssigneeType = 'Company' | 'Department' | 'Team' | 'Individual';
export type KpiCategory = 'REVENUE' | 'LEADS' | 'CALLS' | 'CONTRACTS' | 'CONVERSION' | 'CSAT' | 'OTHER';
export type KpiMetricType = 'Currency' | 'Count' | 'Percentage' | 'Score';

export interface KPIAssignment {
  id: string;
  kpi_code?: string;
  kpi_name: string;
  category?: KpiCategory;
  category_label?: string;
  metric_type?: KpiMetricType;
  unit: string;
  assignee_type: KpiAssigneeType;
  assignee_id?: string;
  assignee_name: string;
  department?: string;
  region?: 'Sale Miền Bắc' | 'Sale Miền Nam' | 'Khối Enterprise';
  period: string;
  target_value: number;
  actual_value: number;
  progress_percentage: number;
  weight?: number;
  notes?: string;
  created_at?: string;
}

export type RatingGrade = 'S' | 'A' | 'B' | 'C' | 'D';
export type ScorecardStatus = 'Draft' | 'Submitted' | 'Approved' | 'Locked' | 'DRAFT_SELF' | 'SUBMITTED_MANAGER' | 'REVIEWING_HR' | 'FINAL_LOCKED';
export type AssessorRole = 'DIRECT_MANAGER' | 'INDIRECT_MANAGER' | 'HR' | 'SELF';

export interface SelfWorkItem {
  id: string;
  work_title: string;
  result_summary: string;
  proof_note?: string;
  linked_kpi_id?: string;
  self_score: number;
  manager_score?: number;
  created_at?: string;
}

export interface CustomCriterionScore {
  criterion_id: string;
  criterion_name: string;
  assessor_role: AssessorRole;
  weight: number;
  score: number;
  assessor_name?: string;
  notes?: string;
}

export interface EvaluationCriterion {
  id: string;
  code: string;
  name: string;
  category?: string;
  assessor_role?: AssessorRole;
  weight: number;
  max_score?: number;
  description?: string;
  assigned_positions?: string[];
  assigned_departments?: string[];
}

export interface PerformanceScorecard {
  id: string;
  employee_id?: string;
  employee_name: string;
  employee_code: string;
  department: string;
  position?: string;
  region?: 'Sale Miền Bắc' | 'Sale Miền Nam' | 'Khối Enterprise';
  period: string;
  kpi_score: number;
  compliance_score: number;
  teamwork_score?: number;
  csat_score?: number;
  behavior_score: number;
  bonus_score: number;
  penalty_score: number;
  final_score: number;
  achievement_percentage?: number;
  rating_grade: RatingGrade;
  status: ScorecardStatus;
  reviewer_notes?: string;
  self_work_items?: SelfWorkItem[];
  custom_criteria_scores?: CustomCriterionScore[];
  base_p3_salary?: number;
  calculated_p3_salary?: number;
  p3_multiplier?: number;
  auto_synced_kpis?: boolean;
  direct_manager_name?: string;
  indirect_manager_name?: string;
  hr_evaluator_name?: string;
  created_at?: string;
}

export interface FormulaWeights {
  kpi_weight: number;
  compliance_weight: number;
  teamwork_weight?: number;
  csat_weight?: number;
  behavior_weight: number;
  grade_s_threshold: number;
  grade_a_threshold: number;
  grade_b_threshold: number;
  grade_c_threshold: number;
  grade_s_p3_multiplier?: number; // e.g. 1.2 (120%)
  grade_a_p3_multiplier?: number; // e.g. 1.0 (100%)
  grade_b_p3_multiplier?: number; // e.g. 0.85 (85%)
  grade_c_p3_multiplier?: number; // e.g. 0.50 (50%)
  grade_d_p3_multiplier?: number; // e.g. 0.00 (0%)
}

// ===== CHẤM CÔNG, NGHỈ PHÉP & TÍNH LƯƠNG =====
export type AttendanceStatus = 'ON_TIME' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'PAID_LEAVE' | 'UNPAID_LEAVE' | 'OVERTIME';
export type LeaveType = 'ANNUAL' | 'SICK' | 'MATERNITY' | 'UNPAID' | 'COMPENSATORY';
export type LeaveStatus = 'PENDING' | 'MANAGER_APPROVED' | 'HR_APPROVED' | 'REJECTED';
export type PayrollStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'SENT_PAYSTUB';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: AttendanceStatus;
  late_minutes: number;
  early_minutes: number;
  ot_hours: number;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  request_code: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  approver_note?: string;
  created_at: string;
}

export interface TimekeepingSummary {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  period: string;
  standard_workdays: number;
  actual_workdays: number;
  paid_leave_days: number;
  unpaid_leave_days: number;
  absent_unexcused_days: number;
  late_count: number;
  total_late_minutes: number;
  total_ot_hours: number;
  billable_workdays: number;
}

export interface PayrollSheet {
  id: string;
  payroll_code: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  position: string;
  bank_name?: string;
  bank_account?: string;
  period: string;
  base_salary: number;
  p1_calculated_salary: number;
  p2_allowances: number;
  p3_performance_salary: number;
  ot_salary: number;
  bonus_amount: number;
  total_gross_income: number;
  bhxh_deduction: number;
  bhyt_deduction: number;
  bhtn_deduction: number;
  late_penalty_deduction: number;
  personal_income_tax: number;
  total_deductions: number;
  net_salary: number;
  status: PayrollStatus;
  paystub_sent_at?: string;
  notes?: string;
}

export interface AttendanceSettings {
  standard_workdays: number;
  work_start_time: string;
  work_end_time: string;
  late_grace_minutes: number;
  ot_min_hours: number;
  annual_leave_quota: number;
  gps_radius_meters: number;
  allowed_ip_range?: string;
}

export interface PayrollSettings {
  p2_lunch_allowance: number;
  p2_phone_allowance: number;
  p2_transport_allowance: number;
  bhxh_percent: number;
  bhyt_percent: number;
  bhtn_percent: number;
  late_penalty_per_instance: number;
  ot_multiplier_standard: number;
  ot_multiplier_weekend: number;
  ot_multiplier_holiday: number;
  personal_tax_deduction_self: number;
  personal_tax_deduction_dependent: number;
}

export type EcomPlatform = 'Shopee' | 'TikTokShop' | 'Lazada' | 'Amazon' | 'GGBingoVN';

export interface ProductPackage {
  id: string;
  sku_code: string;
  name: string;
  category: string;
  unit: string;
  base_price: number;
  vat_rate: number;
  platforms: EcomPlatform[];
  attributes: Record<string, any>;
  is_active: boolean;
  created_at?: string;
}

export type EmployeeApprovalStatus =
  | 'PENDING_DIRECT_MANAGER'
  | 'PENDING_SALES_DIRECTOR'
  | 'APPROVED_FOR_ONBOARDING'
  | 'REJECTED';

export interface ApprovalAuditStep {
  stage_name: string;
  actor_name: string;
  actor_role: string;
  action: 'SUBMIT' | 'APPROVE' | 'REJECT';
  note?: string;
  timestamp: string;
}

export interface EmployeeProfile {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  department: string;
  region?: 'Sale Miền Bắc' | 'Sale Miền Nam' | 'Khối Enterprise';
  team: string;
  position: string;
  joined_date: string;
  status: 'Applicant' | 'Probation' | 'Active' | 'Pending_Resign' | 'Resigned' | 'Suspended';
  contract_number: string;
  contract_type?: 'Chính thức' | 'Thử việc' | 'Hợp đồng dự án' | 'Thời vụ';
  contract_start_date?: string;
  contract_end_date?: string;
  contract_file_r2: string;
  id_card_number?: string;
  id_card_issue_date?: string;
  id_card_issue_place?: string;
  permanent_address?: string;
  temporary_address?: string;
  social_insurance_code?: string;
  health_insurance_code?: string;
  personal_tax_code?: string;
  bank_account?: string;
  bank_name?: string;
  direct_manager_name?: string;
  approval_status?: EmployeeApprovalStatus;
  direct_manager_approved?: boolean;
  sales_director_approved?: boolean;
  rejection_reason?: string;
  approval_history?: ApprovalAuditStep[];
  kyc_documents?: KycDocument[];
  created_at?: string;

  // ===== 7 TABS PROFILE FULL SUPPORT =====
  ethnicity?: string; // Dân tộc
  religion?: string; // Tôn giáo
  hometown?: string; // Nguyên quán
  health_provider?: string; // Nơi KCB ban đầu
  bhxh_start_date?: string; // Ngày tham gia BHXH

  family_members?: FamilyMember[];
  emergency_contact?: EmergencyContact;
  education_history?: EducationHistoryItem[];
  work_experience?: WorkExperienceItem[];
  certificates?: CertificateItem[];
  work_process?: WorkProcessItem[];
  rewards?: RewardItem[];

  personal_biography?: string;
  special_notes?: string;

  // ===== SỔ QUẢN LÝ LAO ĐỘNG (Nghị định 145/2020/NĐ-CP) =====
  // Thông tin nhân thân
  gender?: 'Nam' | 'Nữ' | 'Khác';
  date_of_birth?: string;
  nationality?: string; // Quốc tịch (mặc định Việt Nam)
  // Chuyên môn & công việc
  education_level?: string; // Trình độ chuyên môn kỹ thuật
  skill_level?: string;     // Bậc kỹ năng nghề
  // Tiền lương & bảo hiểm
  bhxh_status?: 'Đang tham gia' | 'Chưa tham gia' | 'Tạm dừng' | 'Đã chốt sổ';
  base_salary?: number;     // Tiền lương (VND/tháng)
  salary_grade?: string;    // Bậc/ngạch lương (VD: G1-G6)
  salary_history?: SalaryChange[]; // Nâng bậc, nâng lương
  // Thời giờ làm việc & nghỉ ngơi
  annual_leave_days?: number; // Tổng phép năm
  leave_taken_days?: number;  // Số ngày đã nghỉ
  overtime_hours?: number;    // Số giờ làm thêm (lũy kế)
  // Đào tạo & phát triển
  training_records?: TrainingRecord[];
  // Quản lý trong quá trình làm việc
  disciplinary_records?: DisciplinaryRecord[]; // Kỷ luật lao động
  material_liability?: string; // Trách nhiệm vật chất
  occupational_incidents?: OccupationalIncident[]; // TNLĐ & bệnh nghề nghiệp
  // Chấm dứt quan hệ lao động
  termination_date?: string;
  termination_reason?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Bố' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Con' | 'Anh/Chị/Em' | 'Khác';
  date_of_birth?: string;
  tax_code?: string;
  phone?: string;
  is_dependent: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface EducationHistoryItem {
  id: string;
  school_name: string;
  major: string;
  degree_level: string;
  graduation_year: string;
  grade?: string;
}

export interface WorkExperienceItem {
  id: string;
  company_name: string;
  position: string;
  from_date: string;
  to_date: string;
  reason_for_leaving?: string;
  achievements?: string;
}

export interface CertificateItem {
  id: string;
  cert_name: string;
  issued_by: string;
  issue_date: string;
  expiry_date?: string;
  cert_type?: string;
}

export interface WorkProcessItem {
  id: string;
  effective_date: string;
  decision_number: string;
  old_position: string;
  new_position: string;
  old_department: string;
  new_department: string;
  old_salary?: number;
  new_salary?: number;
  approved_by: string;
}

export interface RewardItem {
  id: string;
  decision_number: string;
  reward_date: string;
  reward_type: string;
  amount?: number;
  reason: string;
}

export interface SalaryChange {
  id?: string;
  effective_date: string;
  type: 'Nâng lương' | 'Nâng bậc' | 'Điều chỉnh';
  from_salary?: number;
  to_salary: number;
  note?: string;
}

export interface TrainingRecord {
  id?: string;
  name: string;
  type: 'Học nghề' | 'Đào tạo' | 'Bồi dưỡng' | 'Nâng cao kỹ năng nghề';
  institution?: string;
  start_date?: string;
  end_date?: string;
  result?: string;
}

export interface DisciplinaryRecord {
  id?: string;
  date: string;
  violation: string;
  form: 'Khiển trách' | 'Kéo dài thời hạn nâng lương' | 'Cách chức' | 'Sa thải';
  note?: string;
}

export interface OccupationalIncident {
  id?: string;
  date: string;
  type: 'Tai nạn lao động' | 'Bệnh nghề nghiệp';
  description: string;
  severity?: 'Nhẹ' | 'Nặng' | 'Nghiêm trọng';
  days_off?: number;
}

export type RecruitmentStage = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

export interface CandidateAuditLog {
  id: string;
  candidate_id: string;
  candidate_name: string;
  actor_name: string;
  action_type: 'STAGE_CHANGE' | 'CREATE' | 'UPDATE' | 'REJECT' | 'NOTE';
  stage_from?: RecruitmentStage;
  stage_to?: RecruitmentStage;
  note?: string;
  timestamp: string;
}

export interface Candidate {
  id: string;
  candidate_code?: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  stage: RecruitmentStage;
  applied_date: string;
  salary_expectation?: number;
  interviewer_name?: string;
  cv_file_url?: string;
  notes?: string;
  audit_logs?: CandidateAuditLog[];
}

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  role: string;
  department: string;
  team?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  memberCount?: number;
  children?: OrgNode[];
}

export type ReviewCyclePeriodType = 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL';
export type ReviewerPerspective = 'SELF' | 'MANAGER' | 'PEER' | 'SUBORDINATE';


export interface FeedbackSubmission {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  perspective: ReviewerPerspective;
  scores: Record<string, number>;
  strengths_comment?: string;
  improvements_comment?: string;
  submitted_at: string;
}

export interface Review360Session {
  id: string;
  review_code: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department: string;
  position: string;
  period_type: ReviewCyclePeriodType;
  period_name: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  self_score?: number;
  manager_score?: number;
  peer_score?: number;
  subordinate_score?: number;
  overall_360_score: number;
  submissions: FeedbackSubmission[];
  criteria_framework: EvaluationCriterion[];
  created_at: string;
}

// ==================== ENTERPRISE RBAC & DATA SCOPE BOUNDARIES ====================
export type GranularPermission =
  | 'leads:read'
  | 'leads:create'
  | 'leads:update'
  | 'leads:delete'
  | 'leads:assign'
  | 'customers:read'
  | 'customers:edit'
  | 'customers:export'
  | 'teams:manage'
  | 'rbac:manage'
  | 'audit:read'
  | 'ai:use';

export type DataScopeBoundary = 'ALL_COMPANY' | 'DEPARTMENT' | 'TEAM' | 'OWNER_ONLY';

export interface RoleMatrixDefinition {
  role: UserRole | string;
  role_name: string;
  description: string;
  data_scope: DataScopeBoundary;
  permissions: GranularPermission[];
  rank_level?: number; // 1: Executive / Ban Giám Đốc, 2: Management / Quản Lý, 3: Operational / Chuyên Viên, 4: Entry / Thử Việc
  hrm_position_name?: string;
  is_custom?: boolean;
}

// ==================== EXTENDED SYSTEM CONFIGURATION ====================
export interface EcomApiKeysConfig {
  shopee_app_key: string;
  shopee_app_secret: string;
  tiktok_app_key: string;
  tiktok_app_secret: string;
  lazada_app_key: string;
  lazada_app_secret: string;
  amazon_seller_id: string;
  amazon_lwa_client_id: string;
  gemini_api_key: string;
  openai_api_key: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  encryption: 'SSL' | 'TLS' | 'NONE';
  username: string;
  password_masked: string;
  sender_email: string;
  sender_name: string;
}

export interface WebhookConfig {
  telegram_bot_token: string;
  telegram_chat_id: string;
  zalo_zns_webhook_url: string;
  zalo_app_id: string;
  notify_on_new_lead: boolean;
  notify_on_kpi_deadline: boolean;
  notify_on_employee_onboard: boolean;
}

export interface SecuritySystemConfig {
  max_file_size_mb: number;
  session_timeout_mins: number;
  max_failed_logins: number;
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface ConfigAuditLog {
  id: string;
  section: string;
  actor_name: string;
  action: string;
  details: string;
  timestamp: string;
}

// ==================== OMNICHANNEL LIVE CHAT CSKH ====================
export type ChatChannelType = 'ZALO_PERSONAL' | 'ZALO_OA' | 'FACEBOOK_FANPAGE';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  sender_name: string;
  content: string;
  attachment_url?: string;
  timestamp: string;
  is_read: boolean;
}

export interface QuickReplyMacro {
  id: string;
  title: string;
  category: 'Gói Dịch Vụ' | 'Báo Giá' | 'Hợp Đồng' | 'Hỗ Trợ Gian Hàng';
  content: string;
}

export interface ChatConversation {
  id: string;
  channel_type: ChatChannelType;
  channel_name: string;
  customer_name: string;
  customer_avatar?: string;
  customer_phone?: string;
  customer_email?: string;
  crm_customer_id?: string;
  crm_lead_id?: string;
  assigned_rep_name: string;
  unread_count: number;
  status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED';
  tags: string[];
  last_message: string;
  last_message_at: string;
  messages: ChatMessage[];
}

export type AssetCategory = 'IT_EQUIPMENT' | 'OFFICE_FURNITURE' | 'VEHICLES' | 'ECOM_MACHINERY' | 'REAL_ESTATE';
export type AssetStatus = 'IN_USE' | 'UNDER_MAINTENANCE' | 'DEPRECATED' | 'LIQUIDATED';

export interface FixedAsset {
  id: string;
  asset_code: string;
  name: string;
  category: AssetCategory;
  category_name: string;
  purchase_date: string;
  purchase_price: number;
  depreciation_months: number;
  monthly_depreciation: number;
  accumulated_depreciation: number;
  net_book_value: number;
  department: string;
  assigned_to: string;
  status: AssetStatus;
  notes?: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  assignee_name: string;
  start_date: string;
  due_date: string;
  progress_pct: number;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

export interface EnterpriseProject {
  id: string;
  project_code: string;
  name: string;
  client_name?: string;
  department: string;
  manager_name: string;
  start_date: string;
  end_date: string;
  budget: number;
  actual_cost: number;
  progress_pct: number;
  status: ProjectStatus;
  description: string;
  tasks: ProjectTask[];
}

export type DocumentCategory = 'INBOUND' | 'OUTBOUND' | 'INTERNAL_SOP';
export type SecurityLevel = 'NORMAL' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'HIGHLY_URGENT' | 'EXPRESS';
export type DocProcessStatus = 'PENDING_DIRECTIVE' | 'IN_PROCESSING' | 'COMPLETED' | 'ARCHIVED';

export interface DocumentComment {
  id: string;
  author_name: string;
  author_role: string;
  comment: string;
  created_at: string;
}

export interface OfficialDocument {
  id: string;
  document_code: string;
  title: string;
  category: DocumentCategory;
  issuer_org: string;
  recipient_org: string;
  issued_date: string;
  received_date: string;
  signee_name: string;
  security_level: SecurityLevel;
  urgency_level: UrgencyLevel;
  status: DocProcessStatus;
  assigned_department: string;
  assigned_assignee: string;
  directive_note?: string;
  file_name?: string;
  file_url?: string;
  file_size?: string;
  has_digital_stamp?: boolean;
  stamped_at?: string;
  comments?: DocumentComment[];
  created_at: string;
}

export type FieldDataType =
  | 'TEXT_INPUT'
  | 'TEXT_AREA'
  | 'NUMBER_AMOUNT'
  | 'DATE_PICKER'
  | 'SELECT_DROPDOWN'
  | 'FILE_UPLOAD'
  | 'CHECKBOX_BOOLEAN';

export interface ProposalFormField {
  id: string;
  field_name: string;
  field_label: string;
  data_type: FieldDataType;
  is_required: boolean;
  options?: string[];
  placeholder?: string;
  default_value?: any;
}

export interface ApprovalStep {
  step_order: number;
  approver_role: string;
  approver_name?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_at?: string;
  comment?: string;
}

export interface ProposalTemplate {
  id: string;
  template_code: string;
  title: string;
  category_name: string;
  description: string;
  fields: ProposalFormField[];
  approval_steps: { step_order: number; approver_role: string }[];
  is_active: boolean;
}

export interface ProposalSubmission {
  id: string;
  proposal_code: string;
  template_id: string;
  template_title: string;
  applicant_name: string;
  applicant_department: string;
  submitted_date: string;
  field_values: Record<string, any>;
  approval_steps: ApprovalStep[];
  current_step_order: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
}

export interface Supplier {
  id: string;
  supplier_code: string;
  name: string;
  tax_code: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  rating: 'A' | 'B' | 'C' | 'D';
  payable_balance: number;
  category: string;
  created_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface PurchaseOrder {
  id: string;
  po_code: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  payment_status: 'UNPAID' | 'PARTIAL' | 'PAID';
  delivery_status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  items: PurchaseOrderItem[];
  notes?: string;
}

export interface InvoiceVAT {
  id: string;
  invoice_number: string;
  invoice_symbol: string;
  tax_authority_code: string;
  issue_date: string;
  buyer_name: string;
  buyer_tax_code: string;
  buyer_address: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED';
  created_at: string;
}
