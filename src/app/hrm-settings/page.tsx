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
    headcount_count: 24,
    description: 'Tiếp nhận Lead intake, tư vấn giải pháp gian hàng Shopee/TikTok/Lazada.',
  },
  {
    id: 'jt_6',
    code: 'CD-EXEC-CSKH',
    title_name: 'Chuyên Viên CSKH VIP',
    department: 'Phòng CSKH',
    salary_grade: 'G2 (Senior Executive)',
    min_salary: 9000000,
    max_salary: 15000000,
    headcount_count: 12,
    description: 'Chăm sóc và tiếp nhận xử lý yêu cầu phản hồi từ Merchant VIP.',
  },
];

export default function HrmSettingsPage() {
  const [activeTab, setActiveTab] = useState<'ORG_CHART' | 'JOB_TITLES' | 'HR_PARAMS'>('ORG_CHART');
  const [jobTitles, setJobTitles] = useState<JobTitleConfig[]>(INITIAL_JOB_TITLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Params State
  const [params, setParams] = useState({
    annual_leave_days: 12,
    workday_standard: 26,
    probation_days: 60,
    bhxh_employee_rate: 8.0,
    bhxh_company_rate: 17.5,
    ot_weekday_multiplier: 1.5,
    ot_weekend_multiplier: 2.0,
  });

  const [newTitle, setNewTitle] = useState({
    title_name: '',
    department: 'Phòng Kinh Doanh 1',
    salary_grade: 'G3 (Team Lead)',
    min_salary: 15000000,
    max_salary: 25000000,
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
            <h1 className="text-xl font-bold text-slate-900">Cấu Hình Nhân Sự & Sơ Đồ Tổ Chức</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              HR Setup & Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý Sơ đồ cây tổ chức doanh nghiệp, danh mục Chức danh - Chức vụ, Khung ngạch/bậc lương và Tham số quy trình HR.
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

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('ORG_CHART')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ORG_CHART' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" /> 🏛️ 1. Sơ Đồ Tổ Chức (Org Chart Tree)
        </button>

        <button
          onClick={() => setActiveTab('JOB_TITLES')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'JOB_TITLES' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" /> 🏅 2. Danh Mục Chức Danh & Chức Vụ ({jobTitles.length})
        </button>

        <button
          onClick={() => setActiveTab('HR_PARAMS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'HR_PARAMS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400" /> ⚙️ 3. Quy Trình & Tham Số Cấu Hình HR
        </button>
      </div>

      {/* TAB 1: SƠ ĐỒ TỔ CHỨC */}
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

      {/* TAB 2: DANH MỤC CHỨC DANH & CHỨC VỤ */}
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

      {/* TAB 3: QUY TRÌNH & THAM SỐ CẤU HÌNH HR */}
      {activeTab === 'HR_PARAMS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b pb-3">
            <Settings className="w-4 h-4 text-emerald-600" /> Tham Số Quy Trình & Đợi Định Định Mức HR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-purple-700 uppercase font-black tracking-wider text-[11px]">1. Định Mức Ngày Công & Phép Năm</h4>
              
              <div className="space-y-2">
                <label className="block text-slate-700">Số Ngày Công Chuẩn Trong Tháng (Công)</label>
                <input
                  type="number"
                  value={params.workday_standard}
                  onChange={(e) => setParams({ ...params, workday_standard: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Số Ngày Phép Năm Mặc Định / Năm (Ngày)</label>
                <input
                  type="number"
                  value={params.annual_leave_days}
                  onChange={(e) => setParams({ ...params, annual_leave_days: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Số Ngày Thử Việc Tiêu Chuẩn (Ngày)</label>
                <input
                  type="number"
                  value={params.probation_days}
                  onChange={(e) => setParams({ ...params, probation_days: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-blue-700 uppercase font-black tracking-wider text-[11px]">2. Tỷ Lệ Trích Nộp BHXH & Hệ Số OT</h4>

              <div className="space-y-2">
                <label className="block text-slate-700">Tỷ Lệ Khấu Trừ BHXH Nhân Viên (%)</label>
                <input
                  type="number"
                  step={0.5}
                  value={params.bhxh_employee_rate}
                  onChange={(e) => setParams({ ...params, bhxh_employee_rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-purple-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Tỷ Lệ Doanh Nghiệp Đóng BHXH (%)</label>
                <input
                  type="number"
                  step={0.5}
                  value={params.bhxh_company_rate}
                  onChange={(e) => setParams({ ...params, bhxh_company_rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-blue-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700">Hệ Số Lương Làm Thêm Ngày Thường (OT)</label>
                <input
                  type="number"
                  step={0.1}
                  value={params.ot_weekday_multiplier}
                  onChange={(e) => setParams({ ...params, ot_weekday_multiplier: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-amber-700"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => showToast('💾 Đã lưu thành công các tham số cấu hình HR vào hệ thống!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Cấu Hình Tham Số
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
