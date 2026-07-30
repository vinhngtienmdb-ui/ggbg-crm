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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Comprehensive HR Settings State
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
    annual_leave_default: 12,
    seniority_bonus_years: 5,
    carry_over_max_days: 5,
    carry_over_deadline: '03-31',
    marriage_leave_days: 3,
    bereavement_leave_days: 3,
    maternity_leave_months: 6,
  });

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

            <span className="text-slate-500 font-bold">
              Tổng số <strong className="text-slate-900">{filteredTitles.length} Chức Danh Công Việc</strong>
            </span>
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
                  <th className="p-3 text-center">Thao Tác</th>
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
                      <button
                        onClick={() => handleDeleteTitle(t.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Xóa Chức Danh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CA LÀM VIỆC, CHẤM CÔNG & GPS */}
      {activeTab === 'TIMEKEEPING_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <Clock className="w-4 h-4 text-emerald-600" /> Cấu Hình Ca Làm Việc, Đi Muộn & Bán Kính Chấm Công GPS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-emerald-700 uppercase font-black tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 1. Định Mức Thời Gian Ca Làm Việc
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Giờ Bắt Đầu Ca *</label>
                  <input
                    type="time"
                    value={timekeepingCfg.start_time}
                    onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Giờ Kết Thúc Ca *</label>
                  <input
                    type="time"
                    value={timekeepingCfg.end_time}
                    onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Phút Cho Phép Đi Muộn Không Trừ Công (Grace Period)</label>
                <input
                  type="number"
                  value={timekeepingCfg.grace_period_minutes}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, grace_period_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-amber-700 font-bold"
                />
                <p className="text-[11px] text-slate-500 font-normal">Đi muộn dưới {timekeepingCfg.grace_period_minutes} phút được tính đầy đủ 1 ngày công.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-blue-700 uppercase font-black tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 2. Vị Trí Vẫn Hành & Bán Kính GPS Check-in
              </h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Bán Kính Check-in Hợp Lệ (Meters)</label>
                <input
                  type="number"
                  step={50}
                  value={timekeepingCfg.gps_radius_meters}
                  onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, gps_radius_meters: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-blue-700 font-bold"
                />
                <p className="text-[11px] text-slate-500 font-normal">Khoảng cách tối đa từ vị trí điện thoại tới Tòa nhà trụ sở (Mặc định: {timekeepingCfg.gps_radius_meters}m).</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Vĩ Độ Office (Latitude)</label>
                  <input
                    type="number"
                    step={0.000001}
                    value={timekeepingCfg.office_lat}
                    onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, office_lat: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Kinh Độ Office (Longitude)</label>
                  <input
                    type="number"
                    step={0.000001}
                    value={timekeepingCfg.office_long}
                    onChange={(e) => setTimekeepingCfg({ ...timekeepingCfg, office_long: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => showToast('💾 Đã lưu thành công cấu hình ca làm việc & bán kính GPS!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Chấm Công
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PHÉP NĂM, NGHỈ LỄ & PHÚC LỢI */}
      {activeTab === 'LEAVES_CFG' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <Calendar className="w-4 h-4 text-amber-600" /> Cấu Hình Phép Năm, Hạn Dồn Phép & Chế Độ Phúc Lợi Nghỉ Lễ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-amber-700 uppercase font-black tracking-wider text-[11px]">1. Định Mức Phép Năm & Dồn Phép</h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Số Ngày Phép Năm Tiêu Chuẩn / Năm (Ngày)</label>
                <input
                  type="number"
                  value={leavesCfg.annual_leave_default}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, annual_leave_default: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-amber-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Số Ngày Phép Chuyển Tối Đa Sang Năm Sau (Ngày)</label>
                <input
                  type="number"
                  value={leavesCfg.carry_over_max_days}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, carry_over_max_days: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Hạn Cuối Dùng Phép Năm Cũ (MM-DD)</label>
                <input
                  type="text"
                  value={leavesCfg.carry_over_deadline}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, carry_over_deadline: e.target.value })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-purple-700"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-purple-700 uppercase font-black tracking-wider text-[11px]">2. Nghỉ Hưởng Lương Theo Luật Lao Động</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Nghỉ Kết Hôn (Ngày)</label>
                  <input
                    type="number"
                    value={leavesCfg.marriage_leave_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, marriage_leave_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Nghỉ Tang Chế (Ngày)</label>
                  <input
                    type="number"
                    value={leavesCfg.bereavement_leave_days}
                    onChange={(e) => setLeavesCfg({ ...leavesCfg, bereavement_leave_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-red-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Nghỉ Thai Sản Nữ Lao Động (Tháng)</label>
                <input
                  type="number"
                  value={leavesCfg.maternity_leave_months}
                  onChange={(e) => setLeavesCfg({ ...leavesCfg, maternity_leave_months: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-emerald-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => showToast('💾 Đã lưu thành công chế độ nghỉ phép & ngày nghỉ hưởng lương!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Nghỉ Phép
            </button>
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
    </div>
  );
}
