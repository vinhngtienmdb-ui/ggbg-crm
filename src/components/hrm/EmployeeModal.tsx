'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
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
  Save
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
  DisciplinaryRecord
} from '@/types';
import { useAuth } from '@/context/AuthContext';
import { canViewPII, maskSalary } from '@/lib/pii';
import VietnamAddressPicker from '@/components/common/VietnamAddressPicker';

const formatVND = (n?: number) => {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
};

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emp: Partial<EmployeeProfile>) => void;
  initialData?: EmployeeProfile | null;
  mode?: 'create' | 'edit' | 'view';
}

export interface UploadRow {
  id: string;
  category: string;
  fileName: string;
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

  // Active Tab State (7 Main Profile Tabs)
  const [activeTab, setActiveTab] = useState<
    'WORK_INFO' | 'OTHER_INFO' | 'FAMILY_INFO' | 'DOCUMENTS_BAG' | 'WORK_PROCESS' | 'REWARDS_DISCIPLINE' | 'PERSONAL_HISTORY'
  >('WORK_INFO');

  const [formData, setFormData] = useState<Partial<EmployeeProfile>>({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'Phòng Kinh Doanh 1',
    team: 'Đội 1',
    position: 'Chuyên Viên Sale',
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
    bank_account: '',
    bank_name: 'Techcombank - CN Cầu Giấy',
    direct_manager_name: '',
    kyc_documents: [],

    // 7 Tabs extended fields
    gender: 'Nam',
    date_of_birth: '1995-05-15',
    ethnicity: 'Kinh',
    religion: 'Không',
    hometown: 'Hà Nội',
    health_provider: 'Bệnh viện Bạch Mai - Hà Nội',
    bhxh_start_date: '2022-01-01',
    bhxh_status: 'Đang tham gia',
    base_salary: 15000000,
    salary_grade: 'G3-2',

    family_members: [
      {
        id: 'fm_1',
        name: 'Nguyễn Thị Hoa',
        relationship: 'Vợ',
        date_of_birth: '1996-08-20',
        phone: '0987654321',
        tax_code: '8877665544',
        is_dependent: true,
      },
      {
        id: 'fm_2',
        name: 'Nguyễn Minh Quân',
        relationship: 'Con',
        date_of_birth: '2023-03-10',
        is_dependent: true,
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
        school_name: 'Đại Học Kinh Tế Quốc Dân (NEU)',
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
        new_position: 'Trưởng Nhóm Sale (Team Lead)',
        old_department: 'Phòng Kinh Doanh 1',
        new_department: 'Phòng Kinh Doanh 1',
        old_salary: 12000000,
        new_salary: 18000000,
        approved_by: 'Tổng Giám Đốc (Giám Đốc Nhân Sự)',
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
  });

  // Dynamic File Upload Rows
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([
    { id: 'row_1', category: 'CCCD_FRONT', fileName: '' },
  ]);

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
    setUploadRows([{ id: `row_${Date.now()}`, category: 'CCCD_FRONT', fileName: '' }]);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isViewOnly = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold shadow-md">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                {mode === 'create' && 'Tạo Mới Hồ Sơ Nhân Sự Đầy Đủ 7 Mục'}
                {mode === 'edit' && `Chỉnh Sửa Hồ Sơ Nhân Sự: ${formData.full_name}`}
                {mode === 'view' && `Chi Tiết Hồ Sơ Nhân Sự: ${formData.full_name}`}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Mã NV: <span className="text-amber-400 font-bold">{formData.employee_code || 'NV-0000'}</span> · Phòng Ban: {formData.department} · Chức Danh: {formData.position}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 FULL PROFILE TABS NAVIGATION */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('WORK_INFO')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'WORK_INFO' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" /> 1. Thông Tin Làm Việc & Cá Nhân
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OTHER_INFO')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'OTHER_INFO' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> 2. Thông Tin Khác (Học Vấn/Kinh Nghiệm)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FAMILY_INFO')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'FAMILY_INFO' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" /> 3. Thông Tin Gia Đình
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DOCUMENTS_BAG')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'DOCUMENTS_BAG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 text-amber-400" /> 4. Túi Hồ Sơ ({formData.kyc_documents?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WORK_PROCESS')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'WORK_PROCESS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> 5. Quá Trình Làm Việc
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REWARDS_DISCIPLINE')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'REWARDS_DISCIPLINE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" /> 6. Khen Thưởng & Kỷ Luật
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PERSONAL_HISTORY')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PERSONAL_HISTORY' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 7. Lịch Sử Bản Thân
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: THÔNG TIN LÀM VIỆC & CÁ NHÂN & BẢO HIỂM */}
          {activeTab === 'WORK_INFO' && (
            <div className="space-y-6">
              {/* Section 1.1: Thông tin cá nhân */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <User className="w-4 h-4 text-blue-600" /> 1.1 Thông Tin Cá Nhân & Căn Cước Công Dân (CCCD)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mã Nhân Viên *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.employee_code || ''}
                      onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ Và Tên Nhân Sự *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 border rounded-xl font-extrabold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày Sinh (DD/MM/YYYY)</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Giới Tính</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.gender || 'Nam'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dân Tộc</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.ethnicity || 'Kinh'}
                      onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tôn Giáo</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.religion || 'Không'}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Căn Cước / CCCD *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.id_card_number || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                      placeholder="001095001234"
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày Cấp CCCD</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.id_card_issue_date || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_issue_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nơi Cấp CCCD</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.id_card_issue_place || ''}
                      onChange={(e) => setFormData({ ...formData, id_card_issue_place: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại Liên Hệ *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Công Ty *</label>
                    <input
                      type="email"
                      disabled={isViewOnly}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nguyên Quán</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.hometown || ''}
                      onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-4 pt-2 border-t border-slate-200/80">
                    <VietnamAddressPicker
                      label="🏠 Địa Chỉ Thường Trú (Hộ Khẩu Thường Trú HKTT)"
                      disabled={isViewOnly}
                      value={{ detailAddress: formData.permanent_address || '' }}
                      onChange={(addr) => setFormData({ ...formData, permanent_address: addr.fullAddress })}
                    />

                    <VietnamAddressPicker
                      label="📍 Địa Chỉ Hiện Trú (Nơi Ở Hiện Tại)"
                      disabled={isViewOnly}
                      value={{ detailAddress: formData.current_address || formData.temporary_address || '' }}
                      onChange={(addr) => setFormData({ ...formData, current_address: addr.fullAddress, temporary_address: addr.fullAddress })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 1.2: Thông tin làm việc */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Briefcase className="w-4 h-4 text-purple-600" /> 1.2 Thông Tin Làm Việc & Hợp Đồng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phòng Ban Trực Thuộc *</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.department || 'Phòng Kinh Doanh 1'}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    >
                      <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
                      <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
                      <option value="Phòng CSKH">Phòng CSKH</option>
                      <option value="Phòng Marketing">Phòng Marketing</option>
                      <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                      <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chức Danh Công Việc *</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.position || ''}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Loại Hợp Đồng Lao Động</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.contract_type || 'Chính thức'}
                      onChange={(e) => setFormData({ ...formData, contract_type: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    >
                      <option value="Chính thức">Chính thức (Xác định thời hạn / Vô thời hạn)</option>
                      <option value="Thử việc">Thử việc (60 ngày)</option>
                      <option value="Hợp đồng dự án">Hợp đồng dự án / CTV</option>
                      <option value="Thời vụ">Thời vụ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Hợp Đồng Lao Động</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.contract_number || ''}
                      onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày Vào Công Ty</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.joined_date || ''}
                      onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mức Lương Hợp Đồng (VND)</label>
                    <input
                      type="number"
                      step={500000}
                      disabled={isViewOnly}
                      value={formData.base_salary || 12000000}
                      onChange={(e) => setFormData({ ...formData, base_salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-black text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Section 1.3: Thông tin bảo hiểm */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 1.3 Thông Tin Bảo Hiểm (BHXH, BHYT) & Thuế
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mã Số Bảo Hiểm Xã Hội (BHXH)</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.social_insurance_code || ''}
                      onChange={(e) => setFormData({ ...formData, social_insurance_code: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Thẻ Bảo Hiểm Y Tế (BHYT)</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.health_insurance_code || ''}
                      onChange={(e) => setFormData({ ...formData, health_insurance_code: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mã Số Thuế Cá Nhân (MST)</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.personal_tax_code || ''}
                      onChange={(e) => setFormData({ ...formData, personal_tax_code: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nơi Đăng Ký KCB Ban Đầu</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.health_provider || ''}
                      onChange={(e) => setFormData({ ...formData, health_provider: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày Bắt Đầu Tham Gia BHXH</label>
                    <input
                      type="date"
                      disabled={isViewOnly}
                      value={formData.bhxh_start_date || ''}
                      onChange={(e) => setFormData({ ...formData, bhxh_start_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Trạng Thái Sổ BHXH</label>
                    <select
                      disabled={isViewOnly}
                      value={formData.bhxh_status || 'Đang tham gia'}
                      onChange={(e) => setFormData({ ...formData, bhxh_status: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl font-bold"
                    >
                      <option value="Đang tham gia">🟢 Đang tham gia trích nộp</option>
                      <option value="Chưa tham gia">⚪ Chưa tham gia</option>
                      <option value="Tạm dừng">🟠 Tạm dừng đóng</option>
                      <option value="Đã chốt sổ">🔵 Đã chốt sổ BHXH</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THÔNG TIN KHÁC (HỌC VẤN / KINH NGHIỆM / CHỨNG CHỈ) */}
          {activeTab === 'OTHER_INFO' && (
            <div className="space-y-6 text-xs">
              {/* Trình độ học vấn */}
              <div className="space-y-3">
                <h3 className="font-black uppercase text-purple-700 flex items-center gap-1.5 border-b pb-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" /> 2.1 Trình Độ Học Vấn & Bằng Cấp
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  {formData.education_history?.map((edu) => (
                    <div key={edu.id} className="p-3 bg-white rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 block">{edu.school_name}</span>
                        <span className="text-[11px] text-slate-500 block">{edu.degree_level} · Chuyên ngành: {edu.major} · Tốt nghiệp năm {edu.graduation_year} ({edu.grade})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kinh nghiệm làm việc */}
              <div className="space-y-3 pt-2">
                <h3 className="font-black uppercase text-blue-700 flex items-center gap-1.5 border-b pb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> 2.2 Kinh Nghiệm Làm Việc Trước Đây
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  {formData.work_experience?.map((exp) => (
                    <div key={exp.id} className="p-3 bg-white rounded-xl border space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{exp.company_name} — {exp.position}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{exp.from_date} → {exp.to_date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Lý do chuyển: {exp.reason_for_leaving}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chứng chỉ */}
              <div className="space-y-3 pt-2">
                <h3 className="font-black uppercase text-amber-700 flex items-center gap-1.5 border-b pb-2">
                  <Award className="w-4 h-4 text-amber-600" /> 2.3 Chứng Chỉ Nghề Nghiệp & TMĐT
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.certificates?.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{cert.cert_name}</span>
                        <span className="text-[11px] text-slate-500 block">Đơn vị cấp: {cert.issued_by} · Hạn: {cert.expiry_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THÔNG TIN GIA ĐÌNH */}
          {activeTab === 'FAMILY_INFO' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <h3 className="font-black uppercase text-emerald-700 flex items-center gap-1.5 border-b pb-2">
                  <Users className="w-4 h-4 text-emerald-600" /> 3.1 Thân Nhân & Người Phụ Thuộc (Giảm Trừ Gia Cảnh Tax)
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                  {formData.family_members?.map((fm) => (
                    <div key={fm.id} className="p-3 bg-white rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 block">{fm.name} ({fm.relationship})</span>
                        <span className="text-[11px] text-slate-500 block">Ngày sinh: {fm.date_of_birth} · MST NPT: {fm.tax_code || '—'}</span>
                      </div>
                      {fm.is_dependent && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ✅ Giảm Trừ Thuế TNCN (4.4 Tr/tháng)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-black uppercase text-red-700 flex items-center gap-1.5 border-b pb-2">
                  <Phone className="w-4 h-4 text-red-600" /> 3.2 Người Liên Hệ Trong Trường Hợp Khẩn Cấp
                </h3>
                <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl space-y-2">
                  <p className="font-bold text-slate-900">Họ tên: {formData.emergency_contact?.name} ({formData.emergency_contact?.relationship})</p>
                  <p className="font-mono text-red-700 font-bold">Số điện thoại: {formData.emergency_contact?.phone}</p>
                  <p className="text-slate-600">Địa chỉ: {formData.emergency_contact?.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TÚI HỒ SƠ */}
          {activeTab === 'DOCUMENTS_BAG' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-black uppercase text-amber-700 flex items-center gap-1.5 border-b pb-2">
                <Paperclip className="w-4 h-4 text-amber-600" /> 4. Túi Hồ Sơ & Giấy Tờ Đính Kèm ({formData.kyc_documents?.length || 0})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.kyc_documents?.map((doc) => (
                  <div key={doc.doc_id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.doc_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{doc.file_r2_path}</span>
                    </div>
                    <a
                      href={`https://${doc.file_r2_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      Xem File
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: QUÁ TRÌNH LÀM VIỆC */}
          {activeTab === 'WORK_PROCESS' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-black uppercase text-blue-700 flex items-center gap-1.5 border-b pb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> 5. Lịch Sử Điều Chuyển & Thăng Tiến
              </h3>
              <div className="space-y-3">
                {formData.work_process?.map((wp) => (
                  <div key={wp.id} className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between font-extrabold text-blue-900">
                      <span>Quyết Định: {wp.decision_number}</span>
                      <span className="font-mono text-slate-500">{wp.effective_date}</span>
                    </div>
                    <p className="text-slate-800 font-bold">Chức danh: {wp.old_position} → <span className="text-blue-700">{wp.new_position}</span></p>
                    <p className="text-slate-600">Lương hợp đồng: {formatVND(wp.old_salary)} → <span className="text-emerald-700 font-bold">{formatVND(wp.new_salary)}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KHEN THƯỞNG & KỶ LUẬT */}
          {activeTab === 'REWARDS_DISCIPLINE' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <h3 className="font-black uppercase text-amber-700 flex items-center gap-1.5 border-b pb-2">
                  <Award className="w-4 h-4 text-amber-600" /> 6.1 Quyết Định Khen Thưởng
                </h3>
                {formData.rewards?.map((rw) => (
                  <div key={rw.id} className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-amber-900">
                      <span>{rw.decision_number} — {rw.reward_type}</span>
                      <span className="font-mono text-emerald-700">+{formatVND(rw.amount)}</span>
                    </div>
                    <p className="text-slate-700">{rw.reason}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-black uppercase text-red-700 flex items-center gap-1.5 border-b pb-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> 6.2 Lịch Sử Kỷ Luật Lao Động
                </h3>
                <p className="text-slate-400 italic">Không có quyết định kỷ luật nào.</p>
              </div>
            </div>
          )}

          {/* TAB 7: LỊCH SỬ BẢN THÂN */}
          {activeTab === 'PERSONAL_HISTORY' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-black uppercase text-indigo-700 flex items-center gap-1.5 border-b pb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> 7. Sơ Lược Tiểu Sử Bản Thân & Ghi Chú HR
              </h3>
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Tiểu Sử Bản Thân:</span>
                  <p className="text-slate-900 leading-relaxed font-medium">{formData.personal_biography}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Ghi Chú Đánh Giá HR:</span>
                  <p className="text-slate-900 leading-relaxed font-medium">{formData.special_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Đóng
            </button>

            {!isViewOnly && (
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Lưu Hồ Sơ Nhân Sự (7 Mục)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
