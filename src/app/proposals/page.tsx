'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Paperclip,
  Building2,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  ChevronRight,
  MessageSquare,
  Save,
  X,
  FileText,
  Layers,
  Settings,
  PlusCircle,
  Copy,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import {
  ProposalTemplate,
  ProposalSubmission,
  ProposalFormField,
  FieldDataType
} from '@/types';
import {
  getProposalTemplates,
  addProposalTemplate,
  getProposalSubmissions,
  addProposalSubmission,
  updateProposalSubmission,
  toggleProposalTemplateActive,
  duplicateProposalTemplate,
  deleteProposalTemplate
} from '@/lib/proposalStore';
import { createLeaveRequest } from '@/lib/payrollStore';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters';

export default function ProposalsPage() {
  const [templates, setTemplates] = useState<ProposalTemplate[]>(() => getProposalTemplates());
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>(() => getProposalSubmissions());
  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'CREATE_NEW' | 'BUILDER_CONFIG'>('SUBMISSIONS');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form Submission State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [formDataValues, setFormDataValues] = useState<Record<string, any>>({});

  // View & Approval Modal State
  const [selectedSub, setSelectedSub] = useState<ProposalSubmission | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Form Builder Admin State
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderCategory, setBuilderCategory] = useState('Đề Xuất Tài Chính & Mua Sắm');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderFields, setBuilderFields] = useState<ProposalFormField[]>([
    { id: 'f_new_1', field_name: 'title', field_label: 'Tiêu Đề Đề Xuất', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Nhập tiêu đề...' },
    { id: 'f_new_2', field_name: 'amount', field_label: 'Số Tiền Đề Xuất (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '0' },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleFieldInputChange = (fieldName: string, value: any) => {
    setFormDataValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCreateSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    const subCode = `TT-2026-${String(submissions.length + 101).padStart(4, '0')}`;
    const approvalSteps = currentTemplate.approval_steps.map((st) => ({
      step_order: st.step_order,
      approver_role: st.approver_role,
      status: 'PENDING' as const,
    }));

    const newSub: ProposalSubmission = {
      id: `sub_${Date.now()}`,
      proposal_code: subCode,
      template_id: currentTemplate.id,
      template_title: currentTemplate.title,
      applicant_name: 'Vũ Quốc Anh',
      applicant_department: 'Khối Kinh Doanh & TMĐT',
      submitted_date: new Date().toISOString().slice(0, 10),
      field_values: formDataValues,
      approval_steps: approvalSteps,
      current_step_order: 1,
      status: 'PENDING',
    };

    const updated = addProposalSubmission(newSub);
    setSubmissions([...updated]);
    setFormDataValues({});
    setActiveTab('SUBMISSIONS');
    showToast(`✅ Đã gửi Tờ trình đề xuất mới thành công: Mã số ${subCode}`);
  };

  const handleApproveCurrentStep = () => {
    if (!selectedSub) return;
    const steps = [...selectedSub.approval_steps];
    const currentStepIdx = steps.findIndex((s) => s.step_order === selectedSub.current_step_order);

    if (currentStepIdx !== -1) {
      steps[currentStepIdx] = {
        ...steps[currentStepIdx],
        status: 'APPROVED',
        approver_name: 'Nguyễn Tiến Vinh (CEO)',
        approved_at: new Date().toLocaleString('vi-VN'),
        comment: approvalComment || 'Đã kiểm tra nội dung form và phê duyệt.',
      };
    }

    const nextStepOrder = selectedSub.current_step_order + 1;
    const isFullyApproved = nextStepOrder > steps.length;

    const updatedSub: ProposalSubmission = {
      ...selectedSub,
      approval_steps: steps,
      current_step_order: isFullyApproved ? selectedSub.current_step_order : nextStepOrder,
      status: isFullyApproved ? 'APPROVED' : 'PENDING',
    };

    if (isFullyApproved) {
      // Sync with HRM & Attendance if Leave/Resignation Proposal
      if (selectedSub.template_id === 'tmpl_2' || selectedSub.template_title.includes('Nghỉ Phép')) {
        const leaveMode = selectedSub.field_values['duration_mode'] || 'Cả Ngày';
        const specificTime = selectedSub.field_values['specific_time_range'] ? ` (${selectedSub.field_values['specific_time_range']})` : '';
        const totalDays = leaveMode.includes('1/2') ? 0.5 : 1.0;

        createLeaveRequest({
          employee_id: 'e1',
          employee_name: selectedSub.applicant_name,
          employee_code: 'NV-00101',
          department: selectedSub.applicant_department,
          leave_type: 'ANNUAL',
          start_date: selectedSub.field_values['start_date'] || selectedSub.submitted_date,
          end_date: selectedSub.field_values['end_date'] || selectedSub.submitted_date,
          total_days: totalDays,
          reason: `[Tờ trình ${selectedSub.proposal_code}] ${leaveMode}${specificTime} - ${selectedSub.field_values['leave_type'] || 'Phép năm'}`,
          approver_note: 'Đã tự động đồng bộ từ Phân Hệ Tờ Trình Đề Xuất Phê Duyệt',
        });
      }
    }

    const updated = updateProposalSubmission(updatedSub);
    setSubmissions([...updated]);
    setSelectedSub(updatedSub);
    setApprovalComment('');
    showToast(
      isFullyApproved
        ? `🎉 Tờ trình ${selectedSub.proposal_code} đã được PHÊ DUYỆT & ĐỒNG BỘ HRM THÀNH CÔNG!`
        : `✅ Đã phê duyệt Bước ${selectedSub.current_step_order}. Chuyển duyệt cấp tiếp theo.`
    );
  };

  const handleRejectProposal = () => {
    if (!selectedSub || !rejectionReason) return;

    const updatedSub: ProposalSubmission = {
      ...selectedSub,
      status: 'REJECTED',
      rejection_reason: rejectionReason,
    };

    const updated = updateProposalSubmission(updatedSub);
    setSubmissions([...updated]);
    setSelectedSub(updatedSub);
    setRejectionReason('');
    showToast(`❌ Đã từ chối Tờ trình ${selectedSub.proposal_code}`);
  };

  // Form Builder Handlers
  const handleAddFieldToBuilder = () => {
    const newF: ProposalFormField = {
      id: `f_${Date.now()}`,
      field_name: `custom_field_${builderFields.length + 1}`,
      field_label: `Trường Thông Tin ${builderFields.length + 1}`,
      data_type: 'TEXT_INPUT',
      is_required: true,
      placeholder: 'Nhập thông tin...',
    };
    setBuilderFields([...builderFields, newF]);
  };

  const handleSaveNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderTitle) return;

    const newTmpl: ProposalTemplate = {
      id: `tmpl_${Date.now()}`,
      template_code: `BM-DX-${String(templates.length + 1).padStart(3, '0')}`,
      title: builderTitle,
      category_name: builderCategory,
      description: builderDesc || 'Biểu mẫu đề xuất tùy chỉnh mới được khởi tạo bởi Admin.',
      is_active: true,
      approval_steps: [
        { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
        { step_order: 2, approver_role: 'Tổng Giám Đốc (CEO)' },
      ],
      fields: builderFields,
    };

    const updated = addProposalTemplate(newTmpl);
    setTemplates([...updated]);
    setBuilderTitle('');
    setBuilderDesc('');
    setActiveTab('CREATE_NEW');
    showToast(`⚙️ Đã thiết kế & lưu Mẫu Form Đề Xuất mới thành công: ${newTmpl.title}`);
  };

  // Multi-Template Management Handlers
  const handleToggleTemplateActive = (id: string) => {
    const updated = toggleProposalTemplateActive(id);
    setTemplates([...updated]);
    showToast('⚙️ Đã cập nhật trạng thái Bật / Tắt của Mẫu Form Đề Xuất!');
  };

  const handleDuplicateTemplate = (id: string) => {
    const updated = duplicateProposalTemplate(id);
    setTemplates([...updated]);
    showToast('📋 Đã nhân bản 1-Click Mẫu Form Đề Xuất mới thành công!');
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa mẫu biểu đề xuất này?')) {
      const updated = deleteProposalTemplate(id);
      setTemplates([...updated]);
      showToast('🗑️ Đã xóa Mẫu Form Đề Xuất khỏi hệ thống!');
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const q = searchTerm.toLowerCase();
    return !q || s.proposal_code.toLowerCase().includes(q) || s.template_title.toLowerCase().includes(q) || s.applicant_name.toLowerCase().includes(q);
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

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Tờ Trình & Đề Xuất Phê Duyệt (Approvals)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Dynamic Proposal Builder
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tờ trình đề xuất mua sắm, kinh phí, nghỉ phép, cấp phát thiết bị với Trình thiết kế Form linh hoạt & Luồng phê duyệt đa cấp.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('CREATE_NEW')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Gửi Đề Xuất Mới
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-xs font-bold">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('SUBMISSIONS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'SUBMISSIONS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" /> 📋 1. Sổ Tờ Trình Đề Xuất ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('CREATE_NEW')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'CREATE_NEW' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> ✍️ 2. Gửi Đề Xuất Mới (Form Renderer)
          </button>

          <button
            onClick={() => setActiveTab('BUILDER_CONFIG')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'BUILDER_CONFIG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" /> ⚙️ 3. Thiết Kế Mẫu Form & Luồng Duyệt (Admin Builder)
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS LIST */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm mã tờ trình, tên đề xuất, người gửi..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <span className="text-slate-500">
                Hiển thị <strong className="text-slate-900">{filteredSubmissions.length}</strong> tờ trình đề xuất
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10.5px]">
                    <th className="p-3">Mã & Tên Tờ Trình</th>
                    <th className="p-3">Người Gửi & Phòng Ban</th>
                    <th className="p-3">Ngày Trình Ký</th>
                    <th className="p-3 text-center">Tiến Độ Phê Duyệt</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                    <th className="p-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900 text-sm leading-snug">{sub.template_title}</p>
                        <p className="font-mono text-purple-700 text-[11px] font-bold">Mã số: {sub.proposal_code}</p>
                      </td>

                      <td className="p-3">
                        <p className="font-bold text-slate-800">{sub.applicant_name}</p>
                        <p className="text-[11px] text-slate-500">🏢 {sub.applicant_department}</p>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-600">📅 {formatDate(sub.submitted_date)}</td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono text-[10.5px]">
                          {sub.approval_steps.map((st) => (
                            <span
                              key={st.step_order}
                              className={`px-2 py-0.5 rounded font-black border ${
                                st.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : st.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                              title={`Bước ${st.step_order}: ${st.approver_role}`}
                            >
                              {st.status === 'APPROVED' ? '✓' : st.status === 'REJECTED' ? '✕' : st.step_order}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10.5px] ${
                          sub.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.status === 'PENDING' ? '⏳ Đang Trình Duyệt' : sub.status === 'APPROVED' ? '✅ Đã Phê Duyệt' : '❌ Từ Chối'}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setIsViewOpen(true);
                          }}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-extrabold flex items-center gap-1 mx-auto transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem Form & Duyệt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DYNAMIC FORM RENDERER FOR CREATING NEW SUBMISSION */}
        {activeTab === 'CREATE_NEW' && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Gửi Tờ Trình Đề Xuất Mới (Form Renderer)</h3>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">Chọn mẫu biểu đề xuất và điền thông tin chi tiết.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmissionSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <label className="block text-slate-700 mb-1">Chọn Mẫu Biểu Đề Xuất *</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    setFormDataValues({});
                  }}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 bg-slate-50"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.template_code} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {currentTemplate && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <p className="text-purple-900 font-extrabold">{currentTemplate.category_name}</p>
                  <p className="text-purple-700 font-normal text-[11px]">{currentTemplate.description}</p>
                  <p className="text-purple-900 font-bold text-[11px] pt-1">
                    Luồng duyệt ({currentTemplate.approval_steps.length} cấp): {currentTemplate.approval_steps.map((st) => `Cấp ${st.step_order}: ${st.approver_role}`).join(' ➔ ')}
                  </p>
                </div>
              )}

              {/* RENDER DYNAMIC FIELDS BASED ON DATA TYPE */}
              {currentTemplate?.fields.map((f) => (
                <div key={f.id} className="space-y-1">
                  <label className="block text-slate-800 font-bold">
                    {f.field_label} {f.is_required && <span className="text-red-500">*</span>}
                    <span className="text-[10px] text-slate-400 font-mono ml-2 font-normal">[{f.data_type}]</span>
                  </label>

                  {f.data_type === 'TEXT_INPUT' && (
                    <input
                      type="text"
                      required={f.is_required}
                      placeholder={f.placeholder}
                      value={formDataValues[f.field_name] || ''}
                      onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  )}

                  {f.data_type === 'TEXT_AREA' && (
                    <textarea
                      rows={3}
                      required={f.is_required}
                      placeholder={f.placeholder}
                      value={formDataValues[f.field_name] || ''}
                      onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  )}

                  {f.data_type === 'NUMBER_AMOUNT' && (
                    <input
                      type="number"
                      required={f.is_required}
                      placeholder={f.placeholder}
                      value={formDataValues[f.field_name] || ''}
                      onChange={(e) => handleFieldInputChange(f.field_name, Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700 font-bold"
                    />
                  )}

                  {f.data_type === 'DATE_PICKER' && (
                    <input
                      type="date"
                      required={f.is_required}
                      value={formDataValues[f.field_name] || ''}
                      onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  )}

                  {f.data_type === 'SELECT_DROPDOWN' && (
                    <select
                      required={f.is_required}
                      value={formDataValues[f.field_name] || f.options?.[0] || ''}
                      onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    >
                      {f.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {f.data_type === 'FILE_UPLOAD' && (
                    <input
                      type="file"
                      required={f.is_required}
                      onChange={(e) => handleFieldInputChange(f.field_name, e.target.files?.[0]?.name || 'Tep-Dinh-Kem-Chung-Tu.pdf')}
                      className="w-full p-2 border rounded-xl bg-slate-50 text-[11px]"
                    />
                  )}

                  {f.data_type === 'CHECKBOX_BOOLEAN' && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={!!formDataValues[f.field_name]}
                        onChange={(e) => handleFieldInputChange(f.field_name, e.target.checked)}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                      <span className="text-slate-700 font-medium">Xác nhận checkbox tùy chọn</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setActiveTab('SUBMISSIONS')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" /> Gửi Tờ Trình Đề Xuất
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ADMIN FORM BUILDER CONFIGURATION */}
        {activeTab === 'BUILDER_CONFIG' && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" /> Trình Thiết Kế Form Mẫu & Loại Dữ Liệu Trường (Form Builder)
                </h3>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Tự do thiết kế Biểu mẫu Tờ trình mới, cấu hình từng loại dữ liệu trường thông tin (Text, Number, Date, Select, File) & Cấu hình luồng duyệt.
                </p>
              </div>
            </div>

            {/* MULTI-TEMPLATE CATALOG TABLE */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-xs text-amber-600 uppercase tracking-wider">
                1. Danh Sách Các Loại Mẫu Form Tờ Trình Đề Xuất ({templates.length} Mẫu Form)
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10.5px]">
                      <th className="p-3">Mã & Tên Mẫu Form</th>
                      <th className="p-3">Nhóm Danh Mục</th>
                      <th className="p-3 text-center">Số Trường Form</th>
                      <th className="p-3 text-center">Các Bước Duyệt</th>
                      <th className="p-3 text-center">Trạng Thái</th>
                      <th className="p-3 text-center">Thao Tác Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {templates.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900 text-xs leading-snug">{t.title}</p>
                          <p className="font-mono text-purple-700 text-[11px] font-bold">Mã biểu mẫu: {t.template_code}</p>
                        </td>

                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10.5px]">
                            {t.category_name}
                          </span>
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-slate-700">
                          {t.fields.length} Trường Dữ Liệu
                        </td>

                        <td className="p-3 text-center font-mono text-[10.5px] text-purple-700 font-bold">
                          {t.approval_steps.length} Cấp Duyệt
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10.5px] ${
                            t.is_active ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {t.is_active ? '🟢 Bật (Active)' : '⚪ Tắt (Inactive)'}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleTemplateActive(t.id)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                              title={t.is_active ? 'Tắt Form Mẫu' : 'Bật Form Mẫu'}
                            >
                              {t.is_active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                            </button>

                            <button
                              onClick={() => handleDuplicateTemplate(t.id)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl"
                              title="Nhân bản Mẫu Form 1-Click"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteTemplate(t.id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                              title="Xóa Mẫu Form"
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

            <form onSubmit={handleSaveNewTemplate} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Tên Mẫu Biểu Đề Xuất Mới *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đề xuất kinh phí tổ chức Event Mega Sale..."
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Nhóm Danh Mục *</label>
                  <select
                    value={builderCategory}
                    onChange={(e) => setBuilderCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Đề Xuất Tài Chính & Mua Sắm">Đề Xuất Tài Chính & Mua Sắm</option>
                    <option value="Đề Xuất Nhân Sự & Phép">Đề Xuất Nhân Sự & Phép</option>
                    <option value="Đề Xuất Tài Sản & IT">Đề Xuất Tài Sản & IT</option>
                    <option value="Đề Xuất Nghiệp Vụ Khác">Đề Xuất Nghiệp Vụ Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Mô Tả Quy Định Mẫu Biểu</label>
                <input
                  type="text"
                  placeholder="Nhập ghi chú hướng dẫn nhân sự..."
                  value={builderDesc}
                  onChange={(e) => setBuilderDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* Dynamic Fields Configuration List */}
              <div className="pt-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs text-purple-700 uppercase tracking-wider">
                    Danh Sách Trường Thông Tin Điền Dữ Liệu ({builderFields.length} Trường)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFieldToBuilder}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Trường Mới
                  </button>
                </div>

                <div className="space-y-2">
                  {builderFields.map((f, idx) => (
                    <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="text-[10.5px] text-slate-500 block">Tên Nhãn Trường #{idx + 1}</label>
                        <input
                          type="text"
                          value={f.field_label}
                          onChange={(e) => {
                            const updated = [...builderFields];
                            updated[idx].field_label = e.target.value;
                            setBuilderFields(updated);
                          }}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] text-slate-500 block">Cấu Hình Loại Dữ Liệu Trường *</label>
                        <select
                          value={f.data_type}
                          onChange={(e) => {
                            const updated = [...builderFields];
                            updated[idx].data_type = e.target.value as FieldDataType;
                            setBuilderFields(updated);
                          }}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-mono text-[11px] text-purple-700"
                        >
                          <option value="TEXT_INPUT">🔤 TEXT_INPUT (Văn bản ngắn)</option>
                          <option value="TEXT_AREA">📝 TEXT_AREA (Văn bản dài)</option>
                          <option value="NUMBER_AMOUNT">🔢 NUMBER_AMOUNT (Số tiền/Số lượng)</option>
                          <option value="DATE_PICKER">📅 DATE_PICKER (Chọn Ngày)</option>
                          <option value="SELECT_DROPDOWN">📋 SELECT_DROPDOWN (Danh sách chọn)</option>
                          <option value="FILE_UPLOAD">📎 FILE_UPLOAD (File đính kèm)</option>
                          <option value="CHECKBOX_BOOLEAN">☑️ CHECKBOX_BOOLEAN (Hộp chọn)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          checked={f.is_required}
                          onChange={(e) => {
                            const updated = [...builderFields];
                            updated[idx].is_required = e.target.checked;
                            setBuilderFields(updated);
                          }}
                          className="w-4 h-4 accent-purple-600 rounded"
                        />
                        <span className="text-slate-700 font-bold text-[11px]">Bắt buộc nhập</span>
                      </div>

                      <div className="text-right pt-4">
                        <button
                          type="button"
                          onClick={() => setBuilderFields(builderFields.filter((_, i) => i !== idx))}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Lưu Mẫu Form Vừa Thiết Kế
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL XEM CHI TIẾT FORM & THAO TÁC PHÊ DUYỆT / TỪ CHỐI */}
      {isViewOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4 text-xs font-bold max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-black text-purple-700">{selectedSub.proposal_code}</span>
                <h3 className="font-extrabold text-sm text-slate-900">Chi Tiết Form Mẫu Tờ Trình & Phê Duyệt</h3>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">{selectedSub.template_title}</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium pt-2 border-t border-slate-200/80">
                <p>Người làm đơn: <strong className="text-slate-900">{selectedSub.applicant_name}</strong></p>
                <p>Đơn vị / Phòng ban: <strong className="text-slate-900">{selectedSub.applicant_department}</strong></p>
                <p>Ngày nộp tờ trình: <strong className="text-slate-900 font-mono">{selectedSub.submitted_date}</strong></p>
                <p>Trạng thái: <strong className="text-purple-700">{selectedSub.status}</strong></p>
              </div>
            </div>

            {/* DISPLAY ALL FILLED FORM DATA FIELDS */}
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-purple-900 text-xs uppercase tracking-wider">
                📄 Dữ Liệu Chi Tiết Đã Điền Trong Form Đề Xuất:
              </h4>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-purple-100 font-medium">
                {Object.entries(selectedSub.field_values).map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-bold">{key}:</span>
                    <span className="text-slate-900 font-extrabold font-mono">
                      {typeof val === 'number' ? formatCurrency(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* APPROVAL STEPS PROGRESSION */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                🔄 Tiến Độ Luồng Duyệt ({selectedSub.approval_steps.length} Cấp):
              </h4>

              <div className="space-y-1.5">
                {selectedSub.approval_steps.map((st) => (
                  <div key={st.step_order} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Bước {st.step_order}: {st.approver_role}</p>
                      {st.approver_name && <p className="text-[11px] text-slate-500">👤 {st.approver_name} • {st.approved_at}</p>}
                      {st.comment && <p className="text-[11px] text-emerald-700 italic">💬 "{st.comment}"</p>}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded font-black text-[10.5px] ${
                      st.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      st.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {st.status === 'APPROVED' ? '✓ Đã Duyệt' : st.status === 'REJECTED' ? '✕ Từ Chối' : '⏳ Chờ Duyệt'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION SECTION FOR APPROVER */}
            {selectedSub.status === 'PENDING' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-amber-900 text-xs">✍️ Phê Duyệt Hoặc Từ Chối Tờ Trình:</h4>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nhập ghi chú ý kiến chỉ đạo phê duyệt..."
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border rounded-xl"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleApproveCurrentStep}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> ✅ Phê Duyệt Cấp {selectedSub.current_step_order}
                    </button>

                    <button
                      onClick={handleRejectProposal}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" /> ❌ Từ Chối
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Bắt buộc nhập lý do nếu nhấn Từ chối..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-xl text-[11px]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-extrabold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
