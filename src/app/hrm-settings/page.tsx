'use client';

import React, { useState } from 'react';
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
  Sparkles,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  ShieldAlert,
  Bell,
  HeartPulse,
  Gift,
  Lock,
  X
} from 'lucide-react';
import OrgChartTree from '@/components/hrm/OrgChartTree';
import { OrgNode } from '@/types';

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
                },
              ],
            },
          ],
        },
        {
          id: 'org_mgr_ops',
          name: 'Hoàng Kim Ngân',
          title: 'Trưởng Phòng Vận Hành TMĐT',
          role: 'Trưởng Phòng',
          department: 'Phòng Vận Hành TMĐT',
          children: [
            {
              id: 'org_ops_1',
              name: 'Vũ Quốc Anh',
              title: 'Chuyên Viên Vận Hành Shopee & TikTok',
              role: 'Nhân Viên',
              department: 'Phòng Vận Hành TMĐT',
            },
          ],
        },
      ],
    },
    {
      id: 'org_dir_hr',
      name: 'Nguyễn Thị Bích Ngọc',
      title: 'Giám Đốc Nhân Sự (CHRO)',
      role: 'Giám Đốc Khối',
      department: 'Khối Nhân Sự (HRM)',
      children: [
        {
          id: 'org_hr_lead',
          name: 'Đỗ Thị Hương',
          title: 'Trưởng Nhóm C&B & Tuyển Dụng',
          role: 'Leader',
          department: 'Khối Nhân Sự (HRM)',
        },
      ],
    },
  ],
};

export interface JobTitleConfig {
  id: string;
  code: string;
  title_name: string;
  department: string;
  salary_grade: string;
  min_salary: number;
  max_salary: number;
  lunch_allowance: number;
  travel_allowance: number;
  headcount_count: number;
  description: string;
}

const INITIAL_JOB_TITLES: JobTitleConfig[] = [
  {
    id: 'jt_1',
    code: 'CD-CEO',
    title_name: 'Tổng Giám Đốc (CEO)',
    department: 'Ban Giám Đốc',
    salary_grade: 'G6 (Executive)',
    min_salary: 50000000,
    max_salary: 100000000,
    lunch_allowance: 1500000,
    travel_allowance: 3000000,
    headcount_count: 1,
    description: 'Điều hành chiến lược toàn bộ hệ thống GGBG CRM & Agency TMĐT.',
  },
  {
    id: 'jt_2',
    code: 'CD-DIR-SALES',
    title_name: 'Giám Đốc Kinh Doanh (Sales Director)',
    department: 'Khối Kinh Doanh & TMĐT',
    salary_grade: 'G5 (Director)',
    min_salary: 35000000,
    max_salary: 60000000,
    lunch_allowance: 1200000,
    travel_allowance: 2000000,
    headcount_count: 2,
    description: 'Chịu trách nhiệm chỉ tiêu doanh số tổng & phát triển kênh bán hàng.',
  },
  {
    id: 'jt_3',
    code: 'CD-MGR-SALES',
    title_name: 'Trưởng Phòng Kinh Doanh',
    department: 'Phòng Kinh Doanh 1',
    salary_grade: 'G4 (Manager)',
    min_salary: 20000000,
    max_salary: 35000000,
    lunch_allowance: 1000000,
    travel_allowance: 1500000,
    headcount_count: 3,
    description: 'Quản lý đội ngũ Trưởng nhóm & Chuyên viên tư vấn giải pháp TMĐT.',
  },
  {
    id: 'jt_4',
    code: 'CD-LEAD-SALES',
    title_name: 'Trưởng Nhóm Kinh Doanh (Team Lead)',
    department: 'Phòng Kinh Doanh 1',
    salary_grade: 'G3 (Team Lead)',
    min_salary: 15000000,
    max_salary: 25000000,
    lunch_allowance: 800000,
    travel_allowance: 1000000,
    headcount_count: 6,
    description: 'Dẫn dắt 5-8 nhân viên tư vấn chốt đơn dịch vụ gian hàng.',
  },
  {
    id: 'jt_5',
    code: 'CD-EXEC-SALES',
    title_name: 'Chuyên Viên Tư Vấn TMĐT',
    department: 'Phòng Kinh Doanh 1',
    salary_grade: 'G2 (Senior Executive)',
    min_salary: 10000000,
    max_salary: 18000000,
    lunch_allowance: 730000,
    travel_allowance: 500000,
    headcount_count: 24,
    description: 'Tiếp nhận Lead intake, tư vấn giải pháp gian hàng Shopee/TikTok/Lazada.',
  },
];

export default function HrmSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'ORG_CHART' | 'JOB_TITLES' | 'TIMEKEEPING_CFG' | 'LEAVES_CFG' | 'PAYROLL_CFG' | 'APPROVAL_CFG'
  >('ORG_CHART');

  const [jobTitles, setJobTitles] = useState<JobTitleConfig[]>(INITIAL_JOB_TITLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<JobTitleConfig | null>(null);
  const [viewingTitle, setViewingTitle] = useState<JobTitleConfig | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Comprehensive HR Settings State
  const [shiftsList, setShiftsList] = useState([
    { id: 's1', name: 'Ca Hành Chính Standard', start: '08:00', end: '17:30', lunch: '12:00-13:30', hours: 8.0, active: true },
    { id: 's2', name: 'Ca Sáng (Morning Shift)', start: '06:00', end: '14:00', lunch: 'Nghỉ 30p', hours: 8.0, active: true },
    { id: 's3', name: 'Ca Chiều / Tối (Evening Shift)', start: '14:00', end: '22:00', lunch: 'Nghỉ 30p', hours: 8.0, active: true },
    { id: 's4', name: 'Ca Đêm (Overnight +30%)', start: '22:00', end: '06:00', lunch: 'Nghỉ 30p', hours: 8.0, active: true },
    { id: 's5', name: 'Ca Part-Time Linh Hoạt', start: '08:00', end: '12:00', lunch: 'Không', hours: 4.0, active: true },
  ]);

  const [locationsList, setLocationsList] = useState([
    { id: 'loc1', name: 'Trụ Sở Chính Hà Nội', address: 'Tòa nhà Leadvisors, 188 Nguyễn Trãi, Cầu Giấy', lat: 21.028511, long: 105.782345, radius: 200, active: true },
    { id: 'loc2', name: 'Chi Nhánh TP. Hồ Chí Minh', address: 'Tòa nhà Landmark 81, Bình Thạnh, TP.HCM', lat: 10.795000, long: 106.721800, radius: 250, active: true },
    { id: 'loc3', name: 'Kho Vận TMĐT Bắc Ninh', address: 'KCN VSIP, Thị xã Từ Sơn, Bắc Ninh', lat: 21.145000, long: 106.078000, radius: 300, active: true },
  ]);

  const [timekeepingCfg, setTimekeepingCfg] = useState({
    shift_name: 'Ca Hành Chính Standard',
    start_time: '08:00',
    end_time: '17:30',
    lunch_start: '12:00',
    lunch_end: '13:30',
    grace_period_minutes: 15,
    gps_radius_meters: 200,
    office_lat: 21.028511,
    office_long: 105.782345,
    max_ot_monthly_hours: 40,
    ot_weekday_mult: 1.5,
    ot_weekend_mult: 2.0,
    ot_holiday_mult: 3.0,
  });

  const [leavesCfg, setLeavesCfg] = useState({
    accrual_method: 'MONTHLY' as 'MONTHLY' | 'FULL_GRANT',
    probation_leave_enabled: true,
    annual_leave_default: 12,
    manager_leave_default: 15,
    seniority_bonus_years: 5,
    seniority_bonus_days: 1,
    carry_over_max_days: 5,
    carry_over_deadline: '03-31',
    encashment_policy: 'PAY_FULL_AVERAGE' as 'PAY_FULL_AVERAGE' | 'FORFEIT' | 'EXPIRE',
    marriage_self_days: 3,
    marriage_child_days: 1,
    bereavement_leave_days: 3,
    maternity_female_months: 6,
    maternity_male_days: 5,
    maternity_bonus_vnd: 1000000,
    unpaid_leave_max_days: 30,
    birthday_gift_vnd: 500000,
    team_building_budget_monthly: 500000,
    health_check_budget_annual: 2500000,
    seniority_reward_1y: 1000000,
    seniority_reward_3y: 3000000,
    seniority_reward_5y: 10000000,
  });

  const [holidaysList, setHolidaysList] = useState([
    { id: 'h1', name: 'Tết Dương Lịch 2026', date: '01/01/2026', days: 1, type: 'Statutory', active: true },
    { id: 'h2', name: 'Tết Nguyên Đán (Âm Lịch 2026)', date: '16/02/2026 - 20/02/2026', days: 5, type: 'Statutory', active: true },
    { id: 'h3', name: 'Giỗ Tổ Hùng Vương (10/3 Âm Lịch)', date: '26/04/2026', days: 1, type: 'Statutory', active: true },
    { id: 'h4', name: 'Ngày Giải Phóng Miền Nam (30/04)', date: '30/04/2026', days: 1, type: 'Statutory', active: true },
    { id: 'h5', name: 'Quốc Tế Lao Động (01/05)', date: '01/05/2026', days: 1, type: 'Statutory', active: true },
    { id: 'h6', name: 'Quốc Khánh 02/09', date: '01/09/2026 - 02/09/2026', days: 2, type: 'Statutory', active: true },
    { id: 'h7', name: 'Sinh Nhật Công Ty GGBG CRM', date: '15/10/2026', days: 1, type: 'Corporate', active: true },
    { id: 'h8', name: 'Nghỉ Du Lịch Team Building', date: '18/07/2026 - 19/07/2026', days: 2, type: 'Corporate', active: true },
  ]);

  const [payrollCfg, setPayrollCfg] = useState({
    bhxh_employee_pct: 8.0,
    bhyt_employee_pct: 1.5,
    bhtn_employee_pct: 1.0,
    bhxh_company_pct: 17.5,
    bhyt_company_pct: 3.0,
    bhtn_company_pct: 1.0,
    union_fee_pct: 1.0,
    min_region_salary: 4960000,
    personal_deduction: 11000000,
    dependent_deduction: 4400000,
    p3_pool_profit_share_pct: 5.0,
  });

  const [approvalCfg, setApprovalCfg] = useState({
    leave_approval_levels: '2_LEVELS', // 1_LEVEL | 2_LEVELS
    ot_approval_levels: '2_LEVELS',
    contract_expiry_alert_days: 30,
    birthday_alert: true,
    checkin_reminder_time: '07:50',
  });

  const [newTitle, setNewTitle] = useState({
    title_name: '',
    department: 'Phòng Kinh Doanh 1',
    salary_grade: 'G3 (Team Lead)',
    min_salary: 15000000,
    max_salary: 25000000,
    lunch_allowance: 730000,
    travel_allowance: 500000,
    description: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddJobTitle = (e: React.FormEvent) => {
    e.preventDefault();
    const item: JobTitleConfig = {
      id: `jt_${Date.now()}`,
      code: `CD-${String(jobTitles.length + 1).padStart(3, '0')}`,
      title_name: newTitle.title_name,
      department: newTitle.department,
      salary_grade: newTitle.salary_grade,
      min_salary: Number(newTitle.min_salary),
      max_salary: Number(newTitle.max_salary),
      lunch_allowance: Number(newTitle.lunch_allowance),
      travel_allowance: Number(newTitle.travel_allowance),
      headcount_count: 0,
      description: newTitle.description,
    };
    setJobTitles([...jobTitles, item]);
    setIsModalOpen(false);
    showToast(`✅ Đã bổ sung Chức danh mới: ${item.title_name}`);
  };

  const handleDeleteTitle = (id: string) => {
    setJobTitles(jobTitles.filter((j) => j.id !== id));
    showToast(`🗑️ Đã xóa chức danh khỏi hệ thống`);
  };

  const handleFetchCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Math.round(pos.coords.latitude * 1000000) / 1000000;
          const long = Math.round(pos.coords.longitude * 1000000) / 1000000;
          setTimekeepingCfg((prev) => ({
            ...prev,
            office_lat: lat,
            office_long: long,
          }));
          showToast(`📍 Đã tự động cập nhật tọa độ GPS thực tế: ${lat}, ${long}`);
        },
        () => {
          showToast('⚠️ Không thể lấy tọa độ GPS từ trình duyệt. Vui lòng cho phép quyền truy cập vị trí!');
        }
      );
    } else {
      showToast('⚠️ Trình duyệt của bạn không hỗ trợ Geolocation API!');
    }
  };

  const filteredTitles = jobTitles.filter((j) => {
    const q = searchTerm.toLowerCase();
    return !q || j.title_name.toLowerCase().includes(q) || j.code.toLowerCase().includes(q) || j.department.toLowerCase().includes(q);
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Cấu Hình Nhân Sự & Sơ Đồ Tổ Chức Toàn Diện</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              HR Enterprise Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trung tâm cấu hình Sơ đồ cây tổ chức, Chức danh ngạch lương, Ca làm việc GPS, Phép năm nghỉ lễ, Tỷ lệ bảo hiểm & Quy trình duyệt HR tự động.
          </p>
        </div>

        {activeTab === 'JOB_TITLES' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Thêm Chức Danh Mới
          </button>
        )}
      </div>

      {/* Navigation Tabs (6 Comprehensive HR Settings Tabs) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('ORG_CHART')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ORG_CHART' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" /> 🏛️ 1. Cơ Cấu Tổ Chức & Phòng Ban
        </button>

        <button
          onClick={() => setActiveTab('JOB_TITLES')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'JOB_TITLES' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" /> 🏅 2. Chức Danh, Ngạch Lương & Phụ Cấp ({jobTitles.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMEKEEPING_CFG')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'TIMEKEEPING_CFG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" /> ⏰ 3. Ca Làm Việc, Chấm Công & GPS
        </button>

        <button
          onClick={() => setActiveTab('LEAVES_CFG')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'LEAVES_CFG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" /> 🌴 4. Phép Năm, Nghỉ Lễ & Phúc Lợi
        </button>

        <button
          onClick={() => setActiveTab('PAYROLL_CFG')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'PAYROLL_CFG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-blue-400" /> 💰 5. Tỷ Lệ Bảo Hiểm, Thuế TNCN & Quỹ P3
        </button>

        <button
          onClick={() => setActiveTab('APPROVAL_CFG')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'APPROVAL_CFG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> 🔐 6. Phân Quyền & Quy Trình Duyệt HR
        </button>
      </div>

      {/* TAB 1: SƠ ĐỒ TỔ CHỨC & PHÒNG BAN */}
      {activeTab === 'ORG_CHART' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Cấu Trúc Cây Tổ Chức Đa Cấp Doanh Nghiệp GGBG
              </h3>
              <p className="text-xs text-slate-500">Ban Giám Đốc → Khối Kinh Doanh / Vận Hành / HR → Phòng Ban → Đội Nhóm → Nhân Viên</p>
            </div>
          </div>

          <div className="overflow-x-auto py-4">
            <OrgChartTree rootData={MOCK_ORG_TREE} />
          </div>
        </div>
      )}

      {/* TAB 2: CHỨC DANH, NGẠCH LƯƠNG & PHỤ CẤP */}
      {activeTab === 'JOB_TITLES' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã, tên chức danh, phòng ban..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-bold hidden md:inline">
                Tổng số <strong className="text-slate-900">{filteredTitles.length} Chức Danh Công Việc</strong>
              </span>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Thêm Chức Danh Mới
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10.5px]">
                  <th className="p-3">Mã & Tên Chức Danh</th>
                  <th className="p-3">Phòng Ban Trực Thuộc</th>
                  <th className="p-3">Ngạch/Bậc Lương</th>
                  <th className="p-3">Khung Lương Min - Max</th>
                  <th className="p-3">Định Mức Phụ Cấp</th>
                  <th className="p-3 text-center">Số Nhân Sự</th>
                  <th className="p-3 text-center">Thao Tác CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTitles.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900 text-sm">{t.title_name}</p>
                      <p className="font-mono text-purple-700 text-[11px]">{t.code}</p>
                    </td>

                    <td className="p-3 font-bold text-slate-800">{t.department}</td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full font-extrabold border border-purple-200 text-[11px]">
                        {t.salary_grade}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-extrabold text-emerald-700">
                      {new Intl.NumberFormat('vi-VN').format(t.min_salary)} ₫ — {new Intl.NumberFormat('vi-VN').format(t.max_salary)} ₫
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <p className="text-slate-700">Ăn trưa: <strong>{new Intl.NumberFormat('vi-VN').format(t.lunch_allowance)} ₫</strong></p>
                      <p className="text-slate-500">Đi lại: <strong>{new Intl.NumberFormat('vi-VN').format(t.travel_allowance)} ₫</strong></p>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-900">
                      {t.headcount_count} NV
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingTitle(t)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                          title="Xem Chi Tiết"
                        >
                          👁️
                        </button>

                        <button
                          onClick={() => setEditingTitle(t)}
                          className="p-1.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all"
                          title="Chỉnh Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTitle(t.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                          title="Xóa Chức Danh"
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

      {/* TAB 3: CA LÀM VIỆC, CHẤM CÔNG & GPS (MULTI-SHIFT & GEOLOCATION ENHANCED) */}
      {activeTab === 'TIMEKEEPING_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Hệ Thống Cấu Hình Ca Làm Việc Đa Ca, Đi Muộn & Bán Kính Chấm Công GPS
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Cấu hình định mức ca làm việc, thời gian linh hoạt, bán kính Geofencing GPS đa trụ sở & tỷ lệ tính tăng ca OT.
              </p>
            </div>

            <button
              onClick={() => showToast('💾 Đã lưu thành công cấu hình ca làm việc đa ca & bán kính GPS!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Chấm Công
            </button>
          </div>

          {/* SECTION 1: DANH SÁCH CÁC CA LÀM VIỆC ĐA DẠNG (MULTI-SHIFT CONFIGURATION) */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-emerald-700 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> 1. Quản Lý Danh Sách Các Ca Làm Việc Doanh Nghiệp (Multi-Shift)
              </h4>
              <button
                onClick={() => {
                  const newShift = {
                    id: `s_${Date.now()}`,
                    name: `Ca Mới ${shiftsList.length + 1}`,
                    start: '09:00',
                    end: '18:00',
                    lunch: '12:00-13:00',
                    hours: 8.0,
                    active: true,
                  };
                  setShiftsList([...shiftsList, newShift]);
                  showToast(`⚡ Đã bổ sung ca làm việc mới: ${newShift.name}`);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Ca Làm Việc
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold">
                    <th className="p-3">Tên Ca Làm Việc</th>
                    <th className="p-3">Giờ Bắt Đầu</th>
                    <th className="p-3">Giờ Kết Thúc</th>
                    <th className="p-3">Thời Gian Nghỉ Trưa</th>
                    <th className="p-3 text-center">Số Giờ Công</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {shiftsList.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {shift.name}
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-700">{shift.start}</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{shift.end}</td>
                      <td className="p-3 text-slate-600">{shift.lunch}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700">{shift.hours}h</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setShiftsList(shiftsList.map(s => s.id === shift.id ? { ...s, active: !s.active } : s));
                            showToast(`⚙️ Đã cập nhật trạng thái ca: ${shift.name}`);
                          }}
                          className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                            shift.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {shift.active ? '🟢 Đang Áp Dụng' : '⚪ Tạm Dừng'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setShiftsList(shiftsList.filter(s => s.id !== shift.id));
                            showToast(`🗑️ Đã xóa ca làm việc`);
                          }}
                          className="p-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          title="Xóa Ca"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-slate-700 font-extrabold">Số Phút Cho Phép Đi Muộn Không Trừ Công (Grace Period)</label>
                <input
                  type="number"
                  value={timekeepingCfg.grace_period_minutes}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, grace_period_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-amber-700 font-bold"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Đi muộn dưới {timekeepingCfg.grace_period_minutes} phút được tính đầy đủ 1 ngày công.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-slate-700 font-extrabold">Giới Hạn Tăng Ca OT Tối Đa (Giờ / Tháng)</label>
                <input
                  type="number"
                  value={timekeepingCfg.max_ot_monthly_hours}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, max_ot_monthly_hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-blue-700 font-bold"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Theo Luật Lao động Việt Nam (Tối đa 40 giờ OT/tháng).</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: QUẢN LÝ ĐỊA ĐIỂM VĂN PHÒNG & BÁN KÍNH GPS CHECK-IN (MULTI-LOCATION GEOFENCING) */}
          <div className="p-5 bg-blue-50/40 border border-blue-200/80 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h4 className="text-blue-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> 2. Danh Sách Địa Điểm Văn Phòng & Bán Kính Chấm Công GPS Geofencing
                </h4>
                <p className="text-[11px] text-slate-500 font-normal">Cho phép nhân sự check-in đúng tọa độ GPS của trụ sở được phân công.</p>
              </div>

              <button
                onClick={handleFetchCurrentLocation}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95 shrink-0"
              >
                <MapPin className="w-4 h-4" /> 📍 Lấy Tọa Độ GPS Hiện Tại (Browser)
              </button>
            </div>

            <div className="overflow-x-auto border border-blue-200 rounded-xl bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-100/60 border-b border-blue-200 text-blue-900 font-extrabold">
                    <th className="p-3">Tên Trụ Sở / Chi Nhánh</th>
                    <th className="p-3">Địa Chỉ Chi Tiết</th>
                    <th className="p-3 font-mono">Tọa Độ GPS (Lat, Long)</th>
                    <th className="p-3 text-center">Bán Kính Check-in</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {locationsList.map((loc) => (
                    <tr key={loc.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                        {loc.name}
                      </td>
                      <td className="p-3 text-slate-600">{loc.address}</td>
                      <td className="p-3 font-mono text-[11px] font-bold text-slate-800">
                        {loc.lat}, {loc.long}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-blue-700">
                        {loc.radius}m
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-extrabold text-[10px]">
                          🟢 Đang Hoạt Động
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-blue-100">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Vĩ Độ Văn Phòng Hiện Tại (Latitude)</label>
                <input
                  type="number"
                  step={0.000001}
                  value={timekeepingCfg.office_lat}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, office_lat: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-[11px] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Kinh Độ Văn Phòng Hiện Tại (Longitude)</label>
                <input
                  type="number"
                  step={0.000001}
                  value={timekeepingCfg.office_long}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, office_long: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-[11px] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Bán Kính Geofencing Hợp Lệ (Meters)</label>
                <input
                  type="number"
                  step={50}
                  value={timekeepingCfg.gps_radius_meters}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, gps_radius_meters: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold text-blue-700"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: HỆ SỐ TÍNH TĂNG CA OT (OVERTIME MULTIPLIER CONFIG) */}
          <div className="p-5 bg-purple-50/40 border border-purple-200/80 rounded-2xl space-y-4">
            <h4 className="text-purple-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" /> 3. Quy Tắc Hệ Số Tính Lương Làm Thêm Giờ (Overtime Multipliers)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">OT Ngày Thường (Weekday OT Rate)</label>
                <input
                  type="number"
                  step={0.1}
                  value={timekeepingCfg.ot_weekday_mult}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, ot_weekday_mult: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-purple-700 font-black"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Áp dụng cho giờ làm ngoài giờ từ Thứ 2 đến Thứ 6 (x1.5).</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">OT Cuối Tuần (Weekend OT Rate)</label>
                <input
                  type="number"
                  step={0.1}
                  value={timekeepingCfg.ot_weekend_mult}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, ot_weekend_mult: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-purple-700 font-black"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Áp dụng cho ngày nghỉ hằng tuần Thứ 7 & Chủ Nhật (x2.0).</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">OT Ngày Lễ Tết (Holiday OT Rate)</label>
                <input
                  type="number"
                  step={0.1}
                  value={timekeepingCfg.ot_holiday_mult}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, ot_holiday_mult: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-purple-700 font-black"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Áp dụng cho các ngày Lễ Tết quốc gia được hưởng nguyên lương (x3.0).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PHÉP NĂM, NGHỈ LỄ & PHÚC LỢI (UPGRADED ENTERPRISE LEAVES ENGINE) */}
      {activeTab === 'LEAVES_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-8 text-xs font-bold">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" /> Hệ Thống Cấu Hình Phép Năm, Lịch Nghỉ Lễ & Chế Độ Phúc Lợi Chuyên Sâu
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Chuẩn hóa quy tắc cấp phép năm, dồn phép, chi trả phép tồn, lịch nghỉ lễ Tết quốc gia/công ty & ngân sách phúc lợi hiếu hỷ, thâm niên.
              </p>
            </div>

            <button
              onClick={() => showToast('💾 Đã lưu thành công toàn bộ cấu hình Phép năm, Lịch nghỉ lễ & Phúc lợi!')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Toàn Bộ
            </button>
          </div>

          {/* SECTION 1: CẤU HÌNH QUY TẮC PHÉP NĂM & THÂM NIÊN */}
          <div className="p-5 bg-amber-50/40 border border-amber-200/80 rounded-2xl space-y-4">
            <h4 className="text-amber-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" /> 1. Quy Tắc Cấp Phép Năm, Tích Lũy & Thanh Toán Phép Tồn (Accrual & Encashment)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Phương Thức Cấp Phép Năm</label>
                <select
                  value={leavesCfg.accrual_method}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, accrual_method: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="MONTHLY">Tích lũy từng tháng (+1 ngày / tháng)</option>
                  <option value="FULL_GRANT">Cấp trọn gói từ đầu năm (12 ngày / năm)</option>
                </select>
                <p className="text-[10.5px] text-slate-500 font-normal">Quy định thời điểm nhân viên được ghi nhận số ngày phép sử dụng.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Định Mức Phép Năm Nhân Viên (Ngày/Năm)</label>
                <input
                  type="number"
                  value={leavesCfg.annual_leave_default}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, annual_leave_default: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-amber-700 font-black"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Áp dụng cho Hợp đồng lao động chính thức từ 1 năm trở lên.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Định Mức Phép Cấp Quản Lý (Ngày/Năm)</label>
                <input
                  type="number"
                  value={leavesCfg.manager_leave_default}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, manager_leave_default: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-purple-700 font-black"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Dành cho cấp Trưởng phòng, Giám đốc Khối & C-Level.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Phép Thâm Niên (+Ngày/Số Năm)</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600">Cộng</span>
                  <input
                    type="number"
                    value={leavesCfg.seniority_bonus_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, seniority_bonus_days: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-slate-50 border rounded-lg font-mono text-center text-amber-700 font-bold"
                  />
                  <span className="text-[11px] text-slate-600">ngày mỗi</span>
                  <input
                    type="number"
                    value={leavesCfg.seniority_bonus_years}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, seniority_bonus_years: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-slate-50 border rounded-lg font-mono text-center font-bold"
                  />
                  <span className="text-[11px] text-slate-600">năm thâm niên</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Dồn Phép Sang Năm Sau</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600">Tối đa</span>
                  <input
                    type="number"
                    value={leavesCfg.carry_over_max_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, carry_over_max_days: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-slate-50 border rounded-lg font-mono text-center font-bold"
                  />
                  <span className="text-[11px] text-slate-600">ngày, hạn</span>
                  <input
                    type="text"
                    value={leavesCfg.carry_over_deadline}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, carry_over_deadline: e.target.value })}
                    className="w-20 px-2 py-1 bg-slate-50 border rounded-lg font-mono text-center text-purple-700 font-bold"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Quy Định Chi Trả Tiền Phép Tồn</label>
                <select
                  value={leavesCfg.encashment_policy}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, encashment_policy: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="PAY_FULL_AVERAGE">Thanh toán 100% lương bình quân khi thôi việc</option>
                  <option value="EXPIRE">Tự động hủy số phép dư hết hạn ngày 31/03</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: QUẢN LÝ LỊCH NGÀY NGHỈ LỄ TẾT QUỐC GIA & CÔNG TY */}
          <div className="p-5 bg-purple-50/40 border border-purple-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-purple-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" /> 2. Danh Mục Các Ngày Nghỉ Lễ / Tết Hưởng Nguyên Lương ({holidaysList.length} Dịp)
              </h4>
              <button
                onClick={() => showToast('➕ Đã thêm dịp Nghỉ Lễ mới vào danh mục')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Ngày Nghỉ Lễ Mới
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-purple-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/50 text-purple-900 font-extrabold text-[10.5px]">
                    <th className="p-3">Tên Dịp Nghỉ Lễ / Tết</th>
                    <th className="p-3">Thời Gian / Ngày Nghỉ</th>
                    <th className="p-3 text-center">Số Ngày Nghỉ Hưởng Lương</th>
                    <th className="p-3">Phân Loại Nghỉ</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {holidaysList.map((h) => (
                    <tr key={h.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3 font-extrabold text-slate-900">{h.name}</td>
                      <td className="p-3 font-mono text-purple-700">{h.date}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700">{h.days} ngày</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          h.type === 'Statutory' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {h.type === 'Statutory' ? '🏛️ Luật Lao Động' : '🏢 Ngày Nghỉ Công Ty'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={h.active}
                          onChange={() => {
                            setHolidaysList(
                              holidaysList.map((item) => (item.id === h.id ? { ...item, active: !item.active } : item))
                            );
                          }}
                          className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: NGHỈ CHẾ ĐỘ ĐẶC BIỆT & THAI SẢN */}
          <div className="p-5 bg-blue-50/40 border border-blue-200/80 rounded-2xl space-y-4">
            <h4 className="text-blue-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-blue-600" /> 3. Chế Độ Nghỉ Việc Riêng, Tang Chế & Thai Sản (Statutory Leave Policy)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Nghỉ Kết Hôn Bản Thân</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.marriage_self_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, marriage_self_days: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-purple-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">ngày</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Nghỉ Kết Hôn Con Cái</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.marriage_child_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, marriage_child_days: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-purple-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">ngày</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Nghỉ Tang Chế (Tứ Thân)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.bereavement_leave_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, bereavement_leave_days: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-red-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">ngày</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Nghỉ Không Hưởng Lương Max</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.unpaid_leave_max_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, unpaid_leave_max_days: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-slate-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">ngày/năm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Thai Sản Nữ Lao Động</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.maternity_female_months}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, maternity_female_months: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-emerald-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">tháng</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Thai Sản Nam Lao Động (Vợ Sinh)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={leavesCfg.maternity_male_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, maternity_male_days: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-blue-700 font-bold"
                  />
                  <span className="text-slate-500 shrink-0">ngày</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Trợ Cấp Sinh Con Công Ty Tặng</label>
                <input
                  type="number"
                  step={500000}
                  value={leavesCfg.maternity_bonus_vnd}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, maternity_bonus_vnd: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-emerald-700 font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: CHẾ ĐỘ PHÚC LỢI, THÂM NIÊN & THĂM HỎI HIẾU HỶ */}
          <div className="p-5 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4">
            <h4 className="text-emerald-900 uppercase font-black tracking-wider text-[11.5px] flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" /> 4. Chế Độ Phúc Lợi, Quà Sinh Nhật, Thâm Niên & Thăm Hỏi Hiếu Hỷ
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Quà Mừng Sinh Nhật Nhân Sự</label>
                <input
                  type="number"
                  step={100000}
                  value={leavesCfg.birthday_gift_vnd}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, birthday_gift_vnd: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-emerald-700 font-bold"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Gửi quà tặng kèm thiệp chúc mừng tự động vào ngày sinh nhật.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Ngân Sách Team Building Hàng Tháng</label>
                <input
                  type="number"
                  step={100000}
                  value={leavesCfg.team_building_budget_monthly}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, team_building_budget_monthly: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-blue-700 font-bold"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Quỹ ăn uống & gắn kết đội nhóm (VND/nhân sự/tháng).</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <label className="block text-slate-700 font-extrabold">Định Mức Khám Sức Khỏe Định Kỳ</label>
                <input
                  type="number"
                  step={500000}
                  value={leavesCfg.health_check_budget_annual}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, health_check_budget_annual: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-purple-700 font-bold"
                />
                <p className="text-[10.5px] text-slate-500 font-normal">Gói khám sức khỏe tổng quát hàng năm tại Bệnh viện Quốc tế.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Thưởng Thâm Niên 1 Năm</label>
                <input
                  type="number"
                  step={500000}
                  value={leavesCfg.seniority_reward_1y}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, seniority_reward_1y: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-slate-900 font-bold"
                />
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Thưởng Thâm Niên 3 Năm</label>
                <input
                  type="number"
                  step={1000000}
                  value={leavesCfg.seniority_reward_3y}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, seniority_reward_3y: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-blue-700 font-bold"
                />
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-1">
                <label className="block text-slate-700 font-extrabold text-[11px]">Thưởng Thâm Niên 5 Năm (VIP)</label>
                <input
                  type="number"
                  step={2000000}
                  value={leavesCfg.seniority_reward_5y}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, seniority_reward_5y: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-xl font-mono text-amber-700 font-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BẢO HIỂM, THUẾ TNCN & QUỸ LƯƠNG P3 */}
      {activeTab === 'PAYROLL_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <DollarSign className="w-4 h-4 text-blue-600" /> Tỷ Lệ Trích Nộp BHXH, Thuế TNCN & Quỹ Thưởng Lương P3
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-blue-700 uppercase font-black tracking-wider text-[11px]">1. Tỷ Lệ Đóng BHXH Nhân Viên & Doanh Nghiệp</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">BHXH Nhân Viên (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={payrollCfg.bhxh_employee_pct}
                    onChange={(e) => setPayrollCfg({ ...payrollCfg, bhxh_employee_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">BHXH Doanh Nghiệp (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={payrollCfg.bhxh_company_pct}
                    onChange={(e) => setPayrollCfg({ ...payrollCfg, bhxh_company_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-purple-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Mức Lương Tối Thiểu Vùng Căn Cứ BHXH (VND)</label>
                <input
                  type="number"
                  step={100000}
                  value={payrollCfg.min_region_salary}
                  onChange={(e) => setPayrollCfg({ ...payrollCfg, min_region_salary: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-emerald-700"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-emerald-700 uppercase font-black tracking-wider text-[11px]">2. Giảm Trừ Thuế TNCN & Quỹ Lương P3</h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Mức Giảm Trừ Bản Thân (VND/tháng)</label>
                <input
                  type="number"
                  step={500000}
                  value={payrollCfg.personal_deduction}
                  onChange={(e) => setPayrollCfg({ ...payrollCfg, personal_deduction: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-emerald-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Mức Giảm Trừ Người Phụ Thuộc (VND/người/tháng)</label>
                <input
                  type="number"
                  step={100000}
                  value={payrollCfg.dependent_deduction}
                  onChange={(e) => setPayrollCfg({ ...payrollCfg, dependent_deduction: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-blue-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Tỷ Lệ Trích Lợi Nhuận Gộp Vào Quỹ Lương P3 (%)</label>
                <input
                  type="number"
                  step={0.5}
                  value={payrollCfg.p3_pool_profit_share_pct}
                  onChange={(e) => setPayrollCfg({ ...payrollCfg, p3_pool_profit_share_pct: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-amber-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => showToast('💾 Đã lưu thành công định mức tỷ lệ đóng BHXH, Thuế TNCN & Quỹ Lương P3!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Lương & Thuế
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: PHÂN QUYỀN & QUY TRÌNH DUYỆT HR */}
      {activeTab === 'APPROVAL_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Phân Quyền Vai Trò & Quy Trình Duyệt Đơn Tự Động
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-indigo-700 uppercase font-black tracking-wider text-[11px]">1. Quy Trình Phê Duyệt Đơn Nghỉ Phép / OT</h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Quy Trình Duyệt Đơn Nghỉ Phép</label>
                <select
                  value={approvalCfg.leave_approval_levels}
                  onChange={(e) => setApprovalCfg({ ...approvalCfg, leave_approval_levels: e.target.value })}
                  className="w-full px-3 py-2 bg-white border rounded-xl"
                >
                  <option value="1_LEVEL">1 Cấp Duyệt (Quản lý trực tiếp duyệt)</option>
                  <option value="2_LEVELS">2 Cấp Duyệt (Quản lý trực tiếp → HR Manager)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Quy Trình Duyệt Làm Thêm Giờ (OT)</label>
                <select
                  value={approvalCfg.ot_approval_levels}
                  onChange={(e) => setApprovalCfg({ ...approvalCfg, ot_approval_levels: e.target.value })}
                  className="w-full px-3 py-2 bg-white border rounded-xl"
                >
                  <option value="1_LEVEL">1 Cấp Duyệt (Quản lý trực tiếp duyệt)</option>
                  <option value="2_LEVELS">2 Cấp Duyệt (Quản lý trực tiếp → Giám đốc Khối)</option>
                </select>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-purple-700 uppercase font-black tracking-wider text-[11px]">2. Nhắc Nhở Tự Động Hệ Thống</h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Cảnh Báo Hợp Đồng Sắp Hết Hạn Trước (Ngày)</label>
                <input
                  type="number"
                  value={approvalCfg.contract_expiry_alert_days}
                  onChange={(e) => setApprovalCfg({ ...approvalCfg, contract_expiry_alert_days: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-purple-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Giờ Nhắc Nhở Chấm Công Hàng Ngày</label>
                <input
                  type="time"
                  value={approvalCfg.checkin_reminder_time}
                  onChange={(e) => setApprovalCfg({ ...approvalCfg, checkin_reminder_time: e.target.value })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-blue-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => showToast('💾 Đã lưu thành công quy trình phê duyệt & hệ thống nhắc nhở tự động!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Quy Trình Phê Duyệt
            </button>
          </div>
        </div>
      )}

      {/* MODAL THÊM CHỨC DANH MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-purple-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Award className="w-5 h-5" /> Thêm Chức Danh Công Việc Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJobTitle} className="p-6 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Tên Chức Danh Công Việc *</label>
                <input
                  type="text"
                  required
                  value={newTitle.title_name}
                  onChange={(e) => setNewTitle({ ...newTitle, title_name: e.target.value })}
                  placeholder="Ví dụ: Trưởng Nhóm Marketing"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Khối / Phòng Ban *</label>
                <select
                  value={newTitle.department}
                  onChange={(e) => setNewTitle({ ...newTitle, department: e.target.value })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Ngạch / Bậc Lương</label>
                  <input
                    type="text"
                    value={newTitle.salary_grade}
                    onChange={(e) => setNewTitle({ ...newTitle, salary_grade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Mức Lương Khung Min (VND)</label>
                  <input
                    type="number"
                    step={1000000}
                    value={newTitle.min_salary}
                    onChange={(e) => setNewTitle({ ...newTitle, min_salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700 font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phụ Cấp Ăn Trưa (VND)</label>
                  <input
                    type="number"
                    step={50000}
                    value={newTitle.lunch_allowance}
                    onChange={(e) => setNewTitle({ ...newTitle, lunch_allowance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Phụ Cấp Đi Lại (VND)</label>
                  <input
                    type="number"
                    step={50000}
                    value={newTitle.travel_allowance}
                    onChange={(e) => setNewTitle({ ...newTitle, travel_allowance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Mô Tả Nhiệm Vụ Chức Danh (JD)</label>
                <textarea
                  rows={3}
                  value={newTitle.description}
                  onChange={(e) => setNewTitle({ ...newTitle, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
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
                  className="px-5 py-2 bg-purple-600 text-white font-extrabold rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Lưu Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT CHỨC DANH (VIEW DETAIL) */}
      {viewingTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Chi Tiết Chức Danh: {viewingTitle.title_name}</h3>
              </div>
              <button onClick={() => setViewingTitle(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-bold block">Mã Chức Danh:</span>
                  <span className="font-mono font-bold text-purple-700">{viewingTitle.code}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Ngạch / Bậc Lương:</span>
                  <span className="font-bold text-slate-900">{viewingTitle.salary_grade}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Phòng Ban Trực Thuộc:</span>
                <span className="font-extrabold text-slate-800 text-sm">{viewingTitle.department}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Dải Lương Cơ Bản (Min - Max):</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {new Intl.NumberFormat('vi-VN').format(viewingTitle.min_salary)} ₫ — {new Intl.NumberFormat('vi-VN').format(viewingTitle.max_salary)} ₫
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block">Phụ Cấp Ăn Trưa:</span>
                  <span className="font-mono font-bold text-blue-700">{new Intl.NumberFormat('vi-VN').format(viewingTitle.lunch_allowance)} ₫</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Phụ Cấp Đi Lại:</span>
                  <span className="font-mono font-bold text-amber-700">{new Intl.NumberFormat('vi-VN').format(viewingTitle.travel_allowance)} ₫</span>
                </div>
              </div>

              {viewingTitle.description && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1">Mô Tả Công Việc (JD):</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-normal leading-relaxed">
                    {viewingTitle.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setViewingTitle(null)}
                className="px-5 py-2 bg-slate-900 text-white font-extrabold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA CHỨC DANH (EDIT) */}
      {editingTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Chỉnh Sửa Chức Danh: {editingTitle.code}</h3>
              <button onClick={() => setEditingTitle(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setJobTitles(jobTitles.map(j => j.id === editingTitle.id ? editingTitle : j));
                setEditingTitle(null);
                showToast(`✅ Đã cập nhật thông tin chức danh: ${editingTitle.title_name}`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-700 mb-1">Tên Chức Danh *</label>
                <input
                  type="text"
                  required
                  value={editingTitle.title_name}
                  onChange={(e) => setEditingTitle({ ...editingTitle, title_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phòng Ban *</label>
                  <select
                    value={editingTitle.department}
                    onChange={(e) => setEditingTitle({ ...editingTitle, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                    <option value="Khối Kinh Doanh & TMĐT">Khối Kinh Doanh & TMĐT</option>
                    <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                    <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                    <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Ngạch Lương *</label>
                  <input
                    type="text"
                    required
                    value={editingTitle.salary_grade}
                    onChange={(e) => setEditingTitle({ ...editingTitle, salary_grade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Lương Tối Thiểu (VND)</label>
                  <input
                    type="number"
                    step={1000000}
                    value={editingTitle.min_salary}
                    onChange={(e) => setEditingTitle({ ...editingTitle, min_salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Lương Tối Đa (VND)</label>
                  <input
                    type="number"
                    step={1000000}
                    value={editingTitle.max_salary}
                    onChange={(e) => setEditingTitle({ ...editingTitle, max_salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phụ Cấp Ăn Trưa (VND)</label>
                  <input
                    type="number"
                    step={50000}
                    value={editingTitle.lunch_allowance}
                    onChange={(e) => setEditingTitle({ ...editingTitle, lunch_allowance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Phụ Cấp Đi Lại (VND)</label>
                  <input
                    type="number"
                    step={50000}
                    value={editingTitle.travel_allowance}
                    onChange={(e) => setEditingTitle({ ...editingTitle, travel_allowance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Mô Tả Nhiệm Vụ (JD)</label>
                <textarea
                  rows={2}
                  value={editingTitle.description}
                  onChange={(e) => setEditingTitle({ ...editingTitle, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTitle(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-lg shadow-amber-600/30"
                >
                  Cập Nhật Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
