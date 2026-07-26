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
  TrendingUp
} from 'lucide-react';
import { EmployeeProfile, KycDocument } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { canViewPII, maskSalary } from '@/lib/pii';

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
  });

  // Dynamic Multi-File Upload Rows (+ Button)
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([
    { id: 'row_1', category: 'CCCD_FRONT', fileName: '' },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        employee_code: `NV-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        full_name: '',
        email: '',
        phone: '',
        department: 'Phòng Kinh Doanh 1',
        team: 'Đội 1',
        position: 'Chuyên Viên Sale',
        joined_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        contract_number: `HĐLĐ-2026/${String(Math.floor(Math.random() * 900) + 100)}`,
        contract_type: 'Chính thức',
        contract_file_r2: 'storage.ggbingo.vn/contracts/HDLD_NEW.pdf',
        id_card_number: '',
        id_card_issue_date: '2021-05-10',
        id_card_issue_place: 'Cục Cảnh Sát QLHC về Trật Tự Xã Hội',
        permanent_address: '',
        temporary_address: '',
        social_insurance_code: '',
        health_insurance_code: '',
        personal_tax_code: '',
        bank_account: '',
        bank_name: 'Techcombank - CN Cầu Giấy',
        direct_manager_name: 'Trần Văn Hoàng (Trưởng Nhóm Sale)',
        kyc_documents: [],
      });
    }
    setUploadRows([{ id: `row_${Date.now()}`, category: 'CCCD_FRONT', fileName: '' }]);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isViewOnly = mode === 'view';

  // Dynamic Row Handlers (+ Button)
  const handleAddUploadRow = () => {
    const newRow: UploadRow = {
      id: `row_${Date.now()}`,
      category: 'CCCD_FRONT',
      fileName: '',
    };
    setUploadRows([...uploadRows, newRow]);
  };

  const handleRemoveUploadRow = (rowId: string) => {
    if (uploadRows.length === 1) return;
    setUploadRows(uploadRows.filter((r) => r.id !== rowId));
  };

  const handleRowCategoryChange = (rowId: string, category: string) => {
    setUploadRows(uploadRows.map((r) => (r.id === rowId ? { ...r, category } : r)));
  };

  const handleRowFileNameChange = (rowId: string, fileName: string) => {
    setUploadRows(uploadRows.map((r) => (r.id === rowId ? { ...r, fileName } : r)));
  };

  const handleBatchUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = uploadRows.filter((r) => r.fileName.trim().length > 0);
    if (validRows.length === 0) return;

    const newDocs: KycDocument[] = validRows.map((r, idx) => ({
      doc_id: `doc_${Date.now()}_${idx}`,
      doc_type: r.category as any,
      doc_name: r.fileName.trim(),
      file_r2_path: `storage.ggbingo.vn/hrm/${r.fileName.trim()}`,
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VALID',
    }));

    setFormData((prev) => ({
      ...prev,
      kyc_documents: [...(prev.kyc_documents || []), ...newDocs],
    }));

    setUploadRows([{ id: `row_${Date.now()}`, category: 'CCCD_FRONT', fileName: '' }]);
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      kyc_documents: (prev.kyc_documents || []).filter((d) => d.doc_id !== docId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'create' && 'Thêm Hồ Sơ Nhân Sự Mới'}
                {mode === 'edit' && `Chỉnh Sửa Hồ Sơ: ${formData.full_name}`}
                {mode === 'view' && `Chi Tiết Hồ Sơ Nhân Sự: ${formData.full_name}`}
              </h2>
              <p className="text-xs text-slate-500">
                {formData.employee_code || 'Mã NV Tự Động'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <BadgeCheck className="w-4 h-4" /> Thông Tin Cá Nhân & CCCD
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Nhân Viên *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.employee_code || ''}
                  onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ Và Tên *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Căn Cước / CCCD *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.id_card_number || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                  placeholder="001098002345"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày Cấp</label>
                <input
                  type="date"
                  disabled={isViewOnly}
                  value={formData.id_card_issue_date || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nơi Cấp</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.id_card_issue_place || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_issue_place: e.target.value })}
                  placeholder="Cục Cảnh Sát QLHC về Trật Tự Xã Hội"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng Thái Nhân Sự *</label>
                <select
                  disabled={isViewOnly}
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">🟢 Đang Làm Việc</option>
                  <option value="Probation">🔵 Thử Việc</option>
                  <option value="Pending_Resign">🟠 Chờ Nghỉ Việc</option>
                  <option value="Resigned">🔴 Đã Nghỉ Việc</option>
                  <option value="Suspended">🟣 Tạm Hoãn HĐ</option>
                  <option value="Applicant">⚪ Ứng Viên Mới</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4" /> Liên Hệ & Địa Chỉ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0988123456"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Doanh Nghiệp</label>
                <input
                  type="email"
                  disabled={isViewOnly}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="a.nv@ggbingo.vn"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ Thường Trú</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.permanent_address || ''}
                  onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                  placeholder="Số 18 Nguyễn Chánh, Q. Cầu Giấy, Hà Nội"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ Tạm Trú</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.temporary_address || ''}
                  onChange={(e) => setFormData({ ...formData, temporary_address: e.target.value })}
                  placeholder="Đường Lê Lai, Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <HeartPulse className="w-4 h-4" /> Bảo Hiểm Xã Hội & Thuế
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Số BHXH</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.social_insurance_code || ''}
                  onChange={(e) => setFormData({ ...formData, social_insurance_code: e.target.value })}
                  placeholder="7910928374"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Thẻ BHYT</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.health_insurance_code || ''}
                  onChange={(e) => setFormData({ ...formData, health_insurance_code: e.target.value })}
                  placeholder="DN4010928374"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Số Thuế Cá Nhân (MST)</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.personal_tax_code || ''}
                  onChange={(e) => setFormData({ ...formData, personal_tax_code: e.target.value })}
                  placeholder="8091823746"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* ===== SỔ QUẢN LÝ LAO ĐỘNG (NĐ 145/2020/NĐ-CP) ===== */}

          {/* Nhân thân */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <User className="w-4 h-4" /> Nhân Thân (Sổ Lao Động)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giới Tính</label>
                <select
                  disabled={isViewOnly}
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: (e.target.value || undefined) as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Chọn —</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày Sinh</label>
                <input
                  type="date"
                  disabled={isViewOnly}
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quốc Tịch</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.nationality || ''}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Việt Nam"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Chuyên môn */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <GraduationCap className="w-4 h-4" /> Chuyên Môn & Trình Độ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trình Độ CMKT</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.education_level || ''}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                  placeholder="VD: Đại học, Cao đẳng, Trung cấp..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bậc Kỹ Năng Nghề</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.skill_level || ''}
                  onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                  placeholder="VD: Bậc 4/5"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Lương & BHXH */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Wallet className="w-4 h-4" /> Tiền Lương & Bảo Hiểm Xã Hội
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mức Lương (VND/tháng)</label>
                {showPII ? (
                  <input
                    type="number"
                    disabled={isViewOnly}
                    value={formData.base_salary ?? ''}
                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value ? Number(e.target.value) : undefined })}
                    step={500000}
                    placeholder="25000000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-500">
                    {maskSalary(false, formatVND(formData.base_salary))}
                  </div>
                )}
                {showPII && formData.base_salary ? (
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatVND(formData.base_salary)}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bậc / Ngạch Lương</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.salary_grade || ''}
                  onChange={(e) => setFormData({ ...formData, salary_grade: e.target.value })}
                  placeholder="VD: G4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tình Trạng BHXH</label>
                <select
                  disabled={isViewOnly}
                  value={formData.bhxh_status || ''}
                  onChange={(e) => setFormData({ ...formData, bhxh_status: (e.target.value || undefined) as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Chọn —</option>
                  <option value="Đang tham gia">Đang tham gia</option>
                  <option value="Chưa tham gia">Chưa tham gia</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                  <option value="Đã chốt sổ">Đã chốt sổ</option>
                </select>
              </div>
            </div>

            {/* Lịch sử nâng lương */}
            <div className="mt-4">
              <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Lịch Sử Nâng Lương / Nâng Bậc
              </p>
              {(!formData.salary_history || formData.salary_history.length === 0) ? (
                <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl">Chưa có lịch sử điều chỉnh lương.</p>
              ) : (
                <div className="space-y-2">
                  {formData.salary_history.map((s, idx) => (
                    <div key={s.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">{s.type}</span>
                        <span className="ml-2 text-slate-500">{s.effective_date}</span>
                        {s.note ? <p className="text-[11px] text-slate-500 mt-1">{s.note}</p> : null}
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-right">
                        {s.from_salary ? `${maskSalary(showPII, formatVND(s.from_salary))} → ` : ''}
                        {maskSalary(showPII, formatVND(s.to_salary))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nghỉ phép & OT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <CalendarDays className="w-4 h-4" /> Nghỉ Phép & Làm Thêm Giờ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phép Năm (ngày)</label>
                <input
                  type="number"
                  disabled={isViewOnly}
                  value={formData.annual_leave_days ?? ''}
                  onChange={(e) => setFormData({ ...formData, annual_leave_days: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="12"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đã Nghỉ (ngày)</label>
                <input
                  type="number"
                  disabled={isViewOnly}
                  value={formData.leave_taken_days ?? ''}
                  onChange={(e) => setFormData({ ...formData, leave_taken_days: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="5"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ OT Lũy Kế</label>
                <input
                  type="number"
                  disabled={isViewOnly}
                  value={formData.overtime_hours ?? ''}
                  onChange={(e) => setFormData({ ...formData, overtime_hours: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="24"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Đào tạo */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Award className="w-4 h-4" /> Đào Tạo & Phát Triển
            </h3>
            {(!formData.training_records || formData.training_records.length === 0) ? (
              <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl">Chưa có ghi nhận đào tạo.</p>
            ) : (
              <div className="space-y-2">
                {formData.training_records.map((t, idx) => (
                  <div key={t.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.name}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-bold">{t.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t.institution || '—'} • {t.start_date || '?'} → {t.end_date || '?'}
                      {t.result ? ` • Kết quả: ${t.result}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kỷ luật & TNLĐ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ShieldAlert className="w-4 h-4" /> Kỷ Luật & Tai Nạn Lao Động
            </h3>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trách Nhiệm Vật Chất</label>
              <input
                type="text"
                disabled={isViewOnly}
                value={formData.material_liability || ''}
                onChange={(e) => setFormData({ ...formData, material_liability: e.target.value })}
                placeholder="VD: Không có / Bồi thường thiết bị..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <p className="text-[11px] font-bold text-slate-600 mb-2">Kỷ Luật Lao Động</p>
            {(!formData.disciplinary_records || formData.disciplinary_records.length === 0) ? (
              <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl">Không có hồ sơ kỷ luật.</p>
            ) : (
              <div className="space-y-2">
                {formData.disciplinary_records.map((d, idx) => (
                  <div key={d.id || idx} className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{d.violation}</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] rounded font-bold">{d.form}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{d.date}{d.note ? ` • ${d.note}` : ''}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] font-bold text-slate-600 mb-2 mt-3">Tai Nạn Lao Động & Bệnh Nghề Nghiệp</p>
            {(!formData.occupational_incidents || formData.occupational_incidents.length === 0) ? (
              <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl">Không có ghi nhận TNLĐ / bệnh nghề nghiệp.</p>
            ) : (
              <div className="space-y-2">
                {formData.occupational_incidents.map((o, idx) => (
                  <div key={o.id || idx} className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{o.type}</span>
                      {o.severity ? <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] rounded font-bold">{o.severity}</span> : null}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {o.date} • {o.description}{o.days_off ? ` • Nghỉ ${o.days_off} ngày` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chấm dứt QHLĐ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <LogOut className="w-4 h-4" /> Chấm Dứt Quan Hệ Lao Động
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày Chấm Dứt</label>
                <input
                  type="date"
                  disabled={isViewOnly}
                  value={formData.termination_date || ''}
                  onChange={(e) => setFormData({ ...formData, termination_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lý Do Chấm Dứt</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.termination_reason || ''}
                  onChange={(e) => setFormData({ ...formData, termination_reason: e.target.value })}
                  placeholder="VD: Hết hạn HĐ / Nghỉ theo nguyện vọng..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <FolderPlus className="w-4 h-4" /> Chứng Từ
            </h3>

            <div className="mb-4">
              {(!formData.kyc_documents || formData.kyc_documents.length === 0) ? (
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500 italic">
                  Chưa có ảnh CCCD hay tệp chứng từ nào được đính kèm.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.kyc_documents.map((doc) => (
                    <div key={doc.doc_id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">{doc.doc_name}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-mono">{doc.doc_type}</span>
                      </div>

                      {!isViewOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.doc_id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isViewOnly && (
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" /> Tải Lên Tệp Chứng Từ
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddUploadRow}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Thêm Dòng File Mới
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadRows.map((row, idx) => (
                    <div key={row.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-xs shadow-xs animate-in fade-in duration-200">
                      <span className="font-bold text-slate-400 text-[11px] w-5 text-center">{idx + 1}.</span>

                      <div className="w-1/3">
                        <select
                          value={row.category}
                          onChange={(e) => handleRowCategoryChange(row.id, e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs"
                        >
                          <option value="CCCD_FRONT">📷 Ảnh CCCD Mặt Trước</option>
                          <option value="CCCD_BACK">📷 Ảnh CCCD Mặt Sau</option>
                          <option value="AVATAR_PHOTO">👤 Ảnh Chân Dung 3x4</option>
                          <option value="APPLICATION_FORM">📝 Form Ứng Tuyển / Sơ Yếu Lý Lịch</option>
                          <option value="HEALTH_CERT">🏥 Giấy Khám Sức Khỏe</option>
                          <option value="DIPLOMA">🎓 Bằng Cấp / Chứng Chỉ</option>
                          <option value="CONTRACT">📄 Hợp Đồng Lao Động PDF</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={row.fileName}
                          onChange={(e) => handleRowFileNameChange(row.id, e.target.value)}
                          placeholder="Tên tệp tin (VD: CCCD_Mat_Truoc_2026.jpg, Bang_Cap.pdf...)"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                        />
                      </div>

                      {uploadRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadRow(row.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleBatchUploadSubmit}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Upload className="w-4 h-4" /> Đính Kèm Tệp Vừa Chọn ({uploadRows.filter((r) => r.fileName.trim()).length} File)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              {isViewOnly ? 'Đóng' : 'Hủy bỏ'}
            </button>
            {!isViewOnly && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                {mode === 'create' ? 'Tạo Hồ Sơ Nhân Sự' : 'Lưu Thay Đổi Hồ Sơ'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
