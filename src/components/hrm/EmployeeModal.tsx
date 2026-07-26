'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Upload,
  FileCheck,
  Plus,
  Trash2,
  MapPin,
  HeartPulse,
  BadgeCheck,
  FolderPlus,
} from 'lucide-react';
import { EmployeeProfile, KycDocument } from '@/types';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-line shadow-cardLg w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-200/30 flex items-center justify-center text-brand-600 font-bold shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'create' && 'Thêm Hồ Sơ Nhân Sự Mới'}
                {mode === 'edit' && `Chỉnh Sửa Hồ Sơ: ${formData.full_name}`}
                {mode === 'view' && `Chi Tiết Hồ Sơ Nhân Sự: ${formData.full_name}`}
              </h2>
              <p className="text-xs text-ink-400">
                {formData.employee_code || 'Mã NV Tự Động'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-900 hover:bg-line-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5 border-b border-line pb-2">
              <BadgeCheck className="w-4 h-4" /> Thông Tin Cá Nhân & CCCD
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Mã Nhân Viên *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.employee_code || ''}
                  onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-subtle border border-line rounded-xl text-xs font-mono font-bold text-ink-900 focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Họ Và Tên *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900 focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Số Căn Cước / CCCD *</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.id_card_number || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                  placeholder="001098002345"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono font-bold text-brand-800 focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Ngày Cấp</label>
                <input
                  type="date"
                  disabled={isViewOnly}
                  value={formData.id_card_issue_date || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Nơi Cấp</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.id_card_issue_place || ''}
                  onChange={(e) => setFormData({ ...formData, id_card_issue_place: e.target.value })}
                  placeholder="Cục Cảnh Sát QLHC về Trật Tự Xã Hội"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Trạng Thái Nhân Sự *</label>
                <select
                  disabled={isViewOnly}
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-line rounded-xl text-xs font-bold text-ink-900 focus:ring-2 focus:ring-brand-600"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5 border-b border-line pb-2">
              <MapPin className="w-4 h-4" /> Liên Hệ & Địa Chỉ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0988123456"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono text-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Email Doanh Nghiệp</label>
                <input
                  type="email"
                  disabled={isViewOnly}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="a.nv@ggbingo.vn"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Địa Chỉ Thường Trú</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.permanent_address || ''}
                  onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                  placeholder="Số 18 Nguyễn Chánh, Q. Cầu Giấy, Hà Nội"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Địa Chỉ Tạm Trú</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.temporary_address || ''}
                  onChange={(e) => setFormData({ ...formData, temporary_address: e.target.value })}
                  placeholder="Đường Lê Lai, Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs text-ink-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5 border-b border-line pb-2">
              <HeartPulse className="w-4 h-4" /> Bảo Hiểm Xã Hội & Thuế
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Mã Số BHXH</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.social_insurance_code || ''}
                  onChange={(e) => setFormData({ ...formData, social_insurance_code: e.target.value })}
                  placeholder="7910928374"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono font-bold text-success-fg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Số Thẻ BHYT</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.health_insurance_code || ''}
                  onChange={(e) => setFormData({ ...formData, health_insurance_code: e.target.value })}
                  placeholder="DN4010928374"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono text-plum-fg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Mã Số Thuế Cá Nhân (MST)</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.personal_tax_code || ''}
                  onChange={(e) => setFormData({ ...formData, personal_tax_code: e.target.value })}
                  placeholder="8091823746"
                  className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono font-bold text-ink-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5 border-b border-line pb-2">
              <FolderPlus className="w-4 h-4" /> Chứng Từ
            </h3>

            <div className="mb-4">
              {(!formData.kyc_documents || formData.kyc_documents.length === 0) ? (
                <div className="p-3 bg-surface-subtle border border-dashed border-line-strong rounded-xl text-center text-xs text-ink-500 italic">
                  Chưa có ảnh CCCD hay tệp chứng từ nào được đính kèm.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.kyc_documents.map((doc) => (
                    <div key={doc.doc_id} className="p-3 bg-surface-subtle border border-line rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-success-fg" />
                        <span className="font-bold text-ink-900">{doc.doc_name}</span>
                        <span className="px-2 py-0.5 bg-brand-300 text-brand-800 text-[10px] rounded font-mono">{doc.doc_type}</span>
                      </div>

                      {!isViewOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.doc_id)}
                          className="p-1 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded"
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
              <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-brand-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-brand-600" /> Tải Lên Tệp Chứng Từ
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddUploadRow}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-brand-600/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Thêm Dòng File Mới
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadRows.map((row, idx) => (
                    <div key={row.id} className="p-3 bg-white border border-line rounded-xl flex items-center gap-3 text-xs animate-in fade-in duration-200">
                      <span className="font-bold text-ink-400 text-[11px] w-5 text-center">{idx + 1}.</span>

                      <div className="w-1/3">
                        <select
                          value={row.category}
                          onChange={(e) => handleRowCategoryChange(row.id, e.target.value)}
                          className="w-full p-2 bg-surface-subtle border border-line rounded-xl font-semibold text-ink-900 text-xs"
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
                          className="w-full p-2 bg-surface-subtle border border-line rounded-xl text-xs text-ink-900 font-mono"
                        />
                      </div>

                      {uploadRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadRow(row.id)}
                          className="p-2 text-ink-400 hover:text-danger-fg hover:bg-danger-bg rounded-xl transition-colors"
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
                    className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Upload className="w-4 h-4" /> Đính Kèm Tệp Vừa Chọn ({uploadRows.filter((r) => r.fileName.trim()).length} File)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-line-soft hover:bg-line text-ink-700 rounded-xl text-xs font-bold transition-colors"
            >
              {isViewOnly ? 'Đóng' : 'Hủy bỏ'}
            </button>
            {!isViewOnly && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
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
