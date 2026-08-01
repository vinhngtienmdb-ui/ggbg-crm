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
  ToggleRight,
  Edit,
  Sliders,
  Check,
  FolderTree,
  Users,
  UserCheck,
  Briefcase,
  Coins,
  ArrowRight,
  ArrowLeft
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
  updateProposalTemplate,
  getProposalSubmissions,
  addProposalSubmission,
  updateProposalSubmission,
  deleteProposalSubmission,
  toggleProposalTemplateActive,
  duplicateProposalTemplate,
  deleteProposalTemplate
} from '@/lib/proposalStore';
import { getEmployees } from '@/lib/hrmStore';
import { createLeaveRequest } from '@/lib/payrollStore';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters';

const CATEGORIES = [
  'Tất Cả Danh Mục',
  'Hành Chính & Nhân Sự',
  'Tài Chính & Kế Toán',
  'Mua Sắm & Quản Lý Tài Sản',
  'Dự Án, Kinh Doanh & Vận Hành'
];

// Smart HRM Employee Picker Component
function EmployeePickerSelect({
  value,
  onChange,
  isRequired,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  isRequired?: boolean;
  placeholder?: string;
}) {
  const employees = getEmployees();
  // Current user context mock: Trần Văn Hoàng (NV-00101) - Phòng Kinh Doanh 1 - Trưởng Nhóm Sale
  const currentUser = employees[0] || {
    department: 'Phòng Kinh Doanh 1',
    position: 'Trưởng Nhóm Sale',
    direct_manager_name: 'Phạm Minh Đức (Giám Đốc Kinh Doanh)',
  };

  const [filterMode, setFilterMode] = useState<'ALL' | 'SAME_DEPT' | 'SAME_POS' | 'DIRECT_MANAGER'>('ALL');
  const [empSearch, setEmpSearch] = useState('');

  const filteredEmployees = employees.filter((emp) => {
    const q = empSearch.toLowerCase();
    const matchesSearch =
      !q ||
      emp.full_name.toLowerCase().includes(q) ||
      emp.employee_code.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterMode === 'SAME_DEPT') {
      return emp.department === currentUser.department;
    }
    if (filterMode === 'SAME_POS') {
      return emp.position === currentUser.position;
    }
    if (filterMode === 'DIRECT_MANAGER') {
      return (
        emp.full_name.includes('Phạm Minh Đức') ||
        emp.position.includes('Giám Đốc') ||
        emp.position.includes('Trưởng Phòng') ||
        emp.position.includes('Manager') ||
        (currentUser.direct_manager_name && currentUser.direct_manager_name.includes(emp.full_name))
      );
    }
    return true;
  });

  return (
    <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
      {/* Criteria Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold pb-2 border-b">
        <span className="text-slate-500 font-semibold mr-1">🎯 Tiêu chí chọn NV từ HRM:</span>
        <button
          type="button"
          onClick={() => setFilterMode('ALL')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            filterMode === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🌐 Tất Cả ({employees.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('SAME_DEPT')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            filterMode === 'SAME_DEPT' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          🏢 Cùng Bộ Phận
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('SAME_POS')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            filterMode === 'SAME_POS' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          💼 Cùng Chức Danh
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('DIRECT_MANAGER')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            filterMode === 'DIRECT_MANAGER' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          👔 Cấp Trên Trực Tiếp
        </button>
      </div>

      {/* Search & Select Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={empSearch}
          onChange={(e) => setEmpSearch(e.target.value)}
          placeholder="Lọc tên, mã NV..."
          className="w-full sm:w-1/3 px-2.5 py-1.5 bg-slate-50 border rounded-lg text-xs"
        />

        <select
          required={isRequired}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full sm:w-2/3 px-3 py-1.5 bg-white border rounded-lg font-bold text-slate-900 text-xs"
        >
          <option value="">-- {placeholder || 'Chọn nhân sự từ hệ thống HRM'} --</option>
          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={`${emp.full_name} (${emp.employee_code} - ${emp.position})`}>
              [{emp.employee_code}] {emp.full_name} - {emp.position} ({emp.department})
            </option>
          ))}
        </select>
      </div>

      {value && (
        <div className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-purple-200">
          <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Đã chọn nhân sự: <strong className="text-slate-900">{value}</strong>
        </div>
      )}
    </div>
  );
}

export default function ProposalsPage() {
  const [templates, setTemplates] = useState<ProposalTemplate[]>(() => getProposalTemplates());
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>(() => getProposalSubmissions());
  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'CREATE_NEW' | 'TEMPLATE_CONFIG'>('SUBMISSIONS');
  const [createFormStep, setCreateFormStep] = useState<'SELECT_TEMPLATE' | 'FILL_FORM'>('SELECT_TEMPLATE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Tất Cả Danh Mục');
  const [selectedCategoryGroupTab, setSelectedCategoryGroupTab] = useState<string>('Hành Chính & Nhân Sự');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form Submission State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [formDataValues, setFormDataValues] = useState<Record<string, any>>({});

  // View Submission & Approval Modal State
  const [selectedSub, setSelectedSub] = useState<ProposalSubmission | null>(null);
  const [isViewSubOpen, setIsViewSubOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // View Template Schema Modal State
  const [previewTemplate, setPreviewTemplate] = useState<ProposalTemplate | null>(null);
  const [isPreviewTmplOpen, setIsPreviewTmplOpen] = useState(false);

  // Edit / Create Template Modal State
  const [editingTemplate, setEditingTemplate] = useState<ProposalTemplate | null>(null);
  const [isEditTmplOpen, setIsEditTmplOpen] = useState(false);
  const [isCreatingNewTmpl, setIsCreatingNewTmpl] = useState(false);

  // Form Builder Fields & Steps state inside Edit Modal
  const [editTmplTitle, setEditTmplTitle] = useState('');
  const [editTmplCode, setEditTmplCode] = useState('');
  const [editTmplCategory, setEditTmplCategory] = useState('Hành Chính & Nhân Sự');
  const [editTmplDesc, setEditTmplDesc] = useState('');
  const [editTmplFields, setEditTmplFields] = useState<ProposalFormField[]>([]);
  const [editTmplSteps, setEditTmplSteps] = useState<{ step_order: number; approver_role: string }[]>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleFieldInputChange = (fieldName: string, value: any) => {
    setFormDataValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Submit new Approval request
  const handleCreateSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    const subCode = `PD-2026-${String(submissions.length + 101).padStart(4, '0')}`;
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
    setCreateFormStep('SELECT_TEMPLATE');
    setActiveTab('SUBMISSIONS');
    showToast(`✅ Đã nộp phiếu phê duyệt mới thành công: Mã phiếu ${subCode}`);
  };

  // Approve current step
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
        comment: approvalComment || 'Đã kiểm tra nội dung và phê duyệt.',
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
      // Sync with HRM if leave request
      if (selectedSub.template_id === 'tmpl_1' || selectedSub.template_title.includes('Nghỉ Phép')) {
        const leaveMode = selectedSub.field_values['duration_mode'] || 'Cả Ngày';
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
          reason: `[Phiếu Phê Duyệt ${selectedSub.proposal_code}] ${selectedSub.field_values['reason'] || 'Nghỉ phép năm'}`,
          approver_note: 'Đã tự động đồng bộ từ Module Phê Duyệt',
        });
      }
    }

    const updated = updateProposalSubmission(updatedSub);
    setSubmissions([...updated]);
    setSelectedSub(updatedSub);
    setApprovalComment('');
    showToast(
      isFullyApproved
        ? `🎉 Phiếu phê duyệt ${selectedSub.proposal_code} đã được PHÊ DUYỆT HOÀN TẤT & ĐỒNG BỘ NỘI BỘ!`
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
    showToast(`❌ Đã từ chối phiếu phê duyệt ${selectedSub.proposal_code}`);
  };

  // Open Modal to Create New Template
  const handleOpenCreateTemplateModal = () => {
    setIsCreatingNewTmpl(true);
    setEditingTemplate(null);
    setEditTmplTitle('');
    setEditTmplCode(`BM-PD-${String(templates.length + 1).padStart(3, '0')}`);
    setEditTmplCategory('Hành Chính & Nhân Sự');
    setEditTmplDesc('');
    setEditTmplFields([
      { id: 'f_init_1', field_name: 'title', field_label: 'Tiêu Đề Trích Yếu', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Nhập nội dung trích yếu...' },
      { id: 'f_init_2', field_name: 'handover_person', field_label: 'Nhân Sự Liên Quan / Bàn Giao', data_type: 'EMPLOYEE_SELECT', is_required: true, placeholder: 'Chọn nhân sự...' },
      { id: 'f_init_3', field_name: 'amount', field_label: 'Số Tiền / Giá Trị Đề Xuất (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '0' },
      { id: 'f_init_4', field_name: 'reason', field_label: 'Diễn Giải Chi Tiết', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Mô tả chi tiết...' },
    ]);
    setEditTmplSteps([
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Tổng Giám Đốc (CEO)' },
    ]);
    setIsEditTmplOpen(true);
  };

  // Open Modal to Edit Template
  const handleOpenEditTemplateModal = (tmpl: ProposalTemplate) => {
    setIsCreatingNewTmpl(false);
    setEditingTemplate(tmpl);
    setEditTmplTitle(tmpl.title);
    setEditTmplCode(tmpl.template_code);
    setEditTmplCategory(tmpl.category_name);
    setEditTmplDesc(tmpl.description);
    setEditTmplFields([...tmpl.fields]);
    setEditTmplSteps([...tmpl.approval_steps]);
    setIsEditTmplOpen(true);
  };

  // Save Template (Create or Update)
  const handleSaveTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTmplTitle || !editTmplCode) return;

    if (isCreatingNewTmpl) {
      const newTmpl: ProposalTemplate = {
        id: `tmpl_${Date.now()}`,
        template_code: editTmplCode,
        title: editTmplTitle,
        category_name: editTmplCategory,
        description: editTmplDesc || 'Mẫu phiếu phê duyệt mới khởi tạo.',
        is_active: true,
        approval_steps: editTmplSteps,
        fields: editTmplFields,
      };
      const updated = addProposalTemplate(newTmpl);
      setTemplates([...updated]);
      showToast(`⚙️ Đã tạo mới Mẫu Phiếu Phê Duyệt: ${newTmpl.title}`);
    } else if (editingTemplate) {
      const updatedTmpl: ProposalTemplate = {
        ...editingTemplate,
        template_code: editTmplCode,
        title: editTmplTitle,
        category_name: editTmplCategory,
        description: editTmplDesc,
        approval_steps: editTmplSteps,
        fields: editTmplFields,
      };
      const updated = updateProposalTemplate(updatedTmpl);
      setTemplates([...updated]);
      showToast(`✏️ Đã cập nhật cấu hình Mẫu Phiếu: ${updatedTmpl.title}`);
    }

    setIsEditTmplOpen(false);
  };

  // Template Management Handlers
  const handleToggleTemplateActive = (id: string) => {
    const updated = toggleProposalTemplateActive(id);
    setTemplates([...updated]);
    showToast('⚙️ Đã cập nhật trạng thái Bật / Tắt của Mẫu Phiếu!');
  };

  const handleDuplicateTemplate = (id: string) => {
    const updated = duplicateProposalTemplate(id);
    setTemplates([...updated]);
    showToast('📋 Đã nhân bản 1-Click Mẫu Phiếu Phê Duyệt mới thành công!');
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa loại phiếu phê duyệt này khỏi hệ thống?')) {
      const updated = deleteProposalTemplate(id);
      setTemplates([...updated]);
      showToast('🗑️ Đã xóa Mẫu Phiếu Phê Duyệt khỏi hệ thống!');
    }
  };

  // Field manipulation in Edit Modal
  const handleAddFieldInEditModal = () => {
    const newF: ProposalFormField = {
      id: `f_${Date.now()}`,
      field_name: `field_${editTmplFields.length + 1}`,
      field_label: `Trường Thông Tin ${editTmplFields.length + 1}`,
      data_type: 'TEXT_INPUT',
      is_required: true,
      placeholder: 'Nhập thông tin...',
    };
    setEditTmplFields([...editTmplFields, newF]);
  };

  const handleAddStepInEditModal = () => {
    const nextOrder = editTmplSteps.length + 1;
    setEditTmplSteps([...editTmplSteps, { step_order: nextOrder, approver_role: `Duyệt Cấp ${nextOrder}` }]);
  };

  // Filters
  const filteredSubmissions = submissions.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || s.proposal_code.toLowerCase().includes(q) || s.template_title.toLowerCase().includes(q) || s.applicant_name.toLowerCase().includes(q);
    const matchesStatus = submissionStatusFilter === 'ALL' || s.status === submissionStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = templates.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.template_code.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchesCategory = selectedCategoryFilter === 'Tất Cả Danh Mục' || t.category_name === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' ? true : selectedStatusFilter === 'ACTIVE' ? t.is_active : !t.is_active;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Grouped active templates for Tab 2 Card Selector
  const groupedActiveTemplates = CATEGORIES.filter(c => c !== 'Tất Cả Danh Mục').map((cat) => ({
    category: cat,
    templates: templates.filter((t) => t.is_active && t.category_name === cat),
  }));

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
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Phê Duyệt (Approval Management Engine)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Lark Approval Standards (22 Mẫu Phiếu)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống quản lý quy trình phê duyệt đa cấp chuẩn doanh nghiệp. Tích hợp 22 loại phiếu phân nhóm trực quan & Chọn Nhân viên HRM (Cùng bộ phận, Cùng chức danh, Cấp trên).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('CREATE_NEW');
              setCreateFormStep('SELECT_TEMPLATE');
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Nộp Phiếu Phê Duyệt Mới
          </button>
        </div>
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
            <FileCheck className="w-4 h-4" /> 📋 1. Sổ Phiếu Phê Duyệt ({submissions.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('CREATE_NEW');
              setCreateFormStep('SELECT_TEMPLATE');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'CREATE_NEW' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> ✍️ 2. Nộp Phiếu Mới (Luồng 2 Bước)
          </button>

          <button
            onClick={() => setActiveTab('TEMPLATE_CONFIG')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'TEMPLATE_CONFIG' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" /> ⚙️ 3. Cấu Hình Loại Phiếu (Template Manager - 22 Mẫu)
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS LIST */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm mã phiếu, tên đơn, người nộp..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>

                <select
                  value={submissionStatusFilter}
                  onChange={(e) => setSubmissionStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border rounded-xl font-bold text-slate-700"
                >
                  <option value="ALL">Tất Cả Trạng Thái</option>
                  <option value="PENDING">⏳ Đang Trình Duyệt</option>
                  <option value="APPROVED">✅ Đã Phê Duyệt</option>
                  <option value="REJECTED">❌ Từ Chối</option>
                </select>
              </div>

              <span className="text-slate-500">
                Hiển thị <strong className="text-slate-900">{filteredSubmissions.length}</strong> phiếu phê duyệt
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10.5px]">
                    <th className="p-3">Mã & Loại Phiếu Phê Duyệt</th>
                    <th className="p-3">Người Nộp & Phòng Ban</th>
                    <th className="p-3">Ngày Trình Ký</th>
                    <th className="p-3 text-center">Tiến Độ Các Bước Duyệt</th>
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
                            setIsViewSubOpen(true);
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

        {/* TAB 2: 2-STEP FORM CREATION (STEP 1: SELECT TEMPLATE CARD -> STEP 2: DEDICATED FORM SCREEN) */}
        {activeTab === 'CREATE_NEW' && (
          <div className="space-y-6">
            {/* STEP 1: SELECT TEMPLATE CARD SCREEN */}
            {createFormStep === 'SELECT_TEMPLATE' && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-xs font-bold animate-in fade-in duration-200">
                <div className="border-b pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Bước 1: Chọn Loại Phiếu Phê Duyệt</h3>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">Vui lòng bấm vào một mẫu phiếu dưới đây để chuyển sang màn hình điền thông tin chi tiết.</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-[11px] font-extrabold">
                    Bước 1 / 2
                  </span>
                </div>

                {/* CATEGORY GROUP TABS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {groupedActiveTemplates.map((grp) => (
                    <button
                      key={grp.category}
                      type="button"
                      onClick={() => setSelectedCategoryGroupTab(grp.category)}
                      className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 border ${
                        selectedCategoryGroupTab === grp.category
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {grp.category === 'Hành Chính & Nhân Sự' && <Users className="w-4 h-4 text-blue-300" />}
                      {grp.category === 'Tài Chính & Kế Toán' && <Coins className="w-4 h-4 text-emerald-300" />}
                      {grp.category === 'Mua Sắm & Quản Lý Tài Sản' && <Building2 className="w-4 h-4 text-amber-300" />}
                      {grp.category === 'Dự Án, Kinh Doanh & Vận Hành' && <Sparkles className="w-4 h-4 text-pink-300" />}
                      {grp.category} ({grp.templates.length})
                    </button>
                  ))}
                </div>

                {/* CARD GRID OF TEMPLATES IN SELECTED CATEGORY GROUP */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4" /> Danh Sách Các Loại Phiếu Thuộc Nhóm: {selectedCategoryGroupTab}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupedActiveTemplates
                      .find((g) => g.category === selectedCategoryGroupTab)
                      ?.templates.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          onClick={() => {
                            setSelectedTemplateId(tmpl.id);
                            setFormDataValues({});
                            setCreateFormStep('FILL_FORM');
                          }}
                          className="p-5 rounded-2xl border cursor-pointer transition-all space-y-3 bg-white border-slate-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 group relative flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono text-[10.5px] font-black border border-purple-200">
                                {tmpl.template_code}
                              </span>
                              <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs flex items-center gap-0.5">
                                Chọn điền form <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>

                            <h5 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-purple-700 transition-colors">{tmpl.title}</h5>
                            <p className="text-[11px] text-slate-500 font-normal line-clamp-3 leading-relaxed">{tmpl.description}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-600 font-mono font-bold">
                            <span>📄 {tmpl.fields.length} Trường</span>
                            <span className="text-purple-700">🔄 {tmpl.approval_steps.length} Cấp duyệt</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DEDICATED FORM FILLING SCREEN */}
            {createFormStep === 'FILL_FORM' && currentTemplate && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                {/* NAVIGATION BACK BAR */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-purple-200 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setCreateFormStep('SELECT_TEMPLATE')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-purple-600" /> Quay Lại Chọn Loại Phiếu Khác
                  </button>

                  <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-extrabold">
                    Bước 2 / 2: Điền Thông Tin Phiếu Phê Duyệt
                  </span>
                </div>

                {/* FORM CONTAINER */}
                <form onSubmit={handleCreateSubmissionSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-purple-300 shadow-2xl">
                  <div className="border-b border-purple-100 pb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono text-xs font-black">
                          {currentTemplate.template_code}
                        </span>
                        <span className="px-3 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full font-bold text-xs">
                          {currentTemplate.category_name}
                        </span>
                      </div>
                      <h2 className="font-black text-lg text-slate-900 mt-2">{currentTemplate.title}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">{currentTemplate.description}</p>
                    </div>
                  </div>

                  {/* APPROVAL STEPS FLOW PREVIEW */}
                  <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-purple-900 font-bold text-xs space-y-1.5">
                    <p className="text-purple-950 font-extrabold">🔄 Luồng Ký Phê Duyệt Đa Cấp ({currentTemplate.approval_steps.length} cấp):</p>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-purple-800 text-[11px]">
                      {currentTemplate.approval_steps.map((st, idx) => (
                        <React.Fragment key={st.step_order}>
                          <span className="px-2.5 py-1 bg-white border border-purple-300 rounded-lg shadow-2xs">
                            Cấp {st.step_order}: {st.approver_role}
                          </span>
                          {idx < currentTemplate.approval_steps.length - 1 && <span className="text-purple-400">➔</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* RENDER FORM FIELDS WITH EMPLOYEE_SELECT INTEGRATION */}
                  <div className="space-y-5 pt-2">
                    <h3 className="font-extrabold text-sm text-slate-900 border-b pb-2">📋 Điền Thông Tin Dữ Liệu Trường</h3>

                    {currentTemplate.fields.map((f) => (
                      <div key={f.id} className="space-y-1.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-slate-800 font-bold text-xs">
                          {f.field_label} {f.is_required && <span className="text-red-500">*</span>}
                          <span className="text-[10px] text-purple-600 font-mono ml-2 font-semibold">[{f.data_type}]</span>
                        </label>

                        {/* EMPLOYEE SELECT COMPONENT */}
                        {f.data_type === 'EMPLOYEE_SELECT' && (
                          <EmployeePickerSelect
                            value={formDataValues[f.field_name] || ''}
                            onChange={(val) => handleFieldInputChange(f.field_name, val)}
                            isRequired={f.is_required}
                            placeholder={f.placeholder}
                          />
                        )}

                        {f.data_type === 'TEXT_INPUT' && (
                          <input
                            type="text"
                            required={f.is_required}
                            placeholder={f.placeholder || 'Nhập văn bản...'}
                            value={formDataValues[f.field_name] || ''}
                            onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border rounded-xl font-medium text-xs shadow-2xs"
                          />
                        )}

                        {f.data_type === 'TEXT_AREA' && (
                          <textarea
                            rows={3}
                            required={f.is_required}
                            placeholder={f.placeholder || 'Nhập nội dung diễn giải chi tiết...'}
                            value={formDataValues[f.field_name] || ''}
                            onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border rounded-xl font-medium text-xs shadow-2xs"
                          />
                        )}

                        {f.data_type === 'NUMBER_AMOUNT' && (
                          <input
                            type="number"
                            required={f.is_required}
                            placeholder={f.placeholder || '0'}
                            value={formDataValues[f.field_name] || ''}
                            onChange={(e) => handleFieldInputChange(f.field_name, Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 bg-white border rounded-xl font-mono text-purple-700 font-bold text-sm shadow-2xs"
                          />
                        )}

                        {f.data_type === 'DATE_PICKER' && (
                          <input
                            type="date"
                            required={f.is_required}
                            value={formDataValues[f.field_name] || ''}
                            onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border rounded-xl font-mono text-xs shadow-2xs"
                          />
                        )}

                        {f.data_type === 'SELECT_DROPDOWN' && (
                          <select
                            required={f.is_required}
                            value={formDataValues[f.field_name] || f.options?.[0] || ''}
                            onChange={(e) => handleFieldInputChange(f.field_name, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border rounded-xl font-bold text-slate-800 text-xs shadow-2xs"
                          >
                            <option value="">-- Chọn tùy chọn --</option>
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
                            className="w-full p-2.5 border rounded-xl bg-white text-[11px]"
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
                            <span className="text-slate-700 font-medium text-xs">Đồng ý & Xác nhận điều khoản</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCreateFormStep('SELECT_TEMPLATE')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 text-xs transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" /> Quay Lại
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-xl shadow-purple-600/30 flex items-center gap-2 text-xs transition-all active:scale-95"
                    >
                      <FileCheck className="w-4 h-4" /> Nộp Phiếu Phê Duyệt Này
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN TEMPLATE CONFIGURATOR (XEM, SỬA, XÓA, BẬT/TẮT CÁC LOẠI PHIẾU) */}
        {activeTab === 'TEMPLATE_CONFIG' && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 text-xs font-bold">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" /> Trình Cấu Hình Loại Phiếu Phê Duyệt (Template Manager)
                </h3>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Quản lý 22 mẫu phiếu phê duyệt chuẩn Lark Approval. Hỗ trợ Admin: <strong>Xem cấu hình</strong>, <strong>Chỉnh sửa trường & luồng duyệt</strong>, <strong>Xóa</strong>, <strong>Bật/Tắt active</strong> và <strong>Tạo mẫu phiếu mới</strong>.
                </p>
              </div>

              <button
                onClick={handleOpenCreateTemplateModal}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-400" /> ➕ Tạo Mẫu Phiếu Mới
              </button>
            </div>

            {/* FILTER BAR FOR TEMPLATES */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên mẫu, mã BM-PD-xxx..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border rounded-xl font-bold text-slate-700 text-xs"
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border rounded-xl font-bold text-slate-700 text-xs"
                >
                  <option value="ALL">Tất Cả Trạng Thái</option>
                  <option value="ACTIVE">🟢 Đang Bật (Active)</option>
                  <option value="INACTIVE">⚪ Đang Tắt (Inactive)</option>
                </select>
              </div>

              <span className="text-slate-500 font-semibold shrink-0">
                Hiển thị <strong className="text-purple-700">{filteredTemplates.length}</strong> / 22 Mẫu Phiếu
              </span>
            </div>

            {/* TEMPLATES TABLE WITH FULL ACTION BUTTONS (XEM, SỬA, XÓA, BẬT/TẮT) */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10.5px]">
                    <th className="p-3">Mã & Tên Mẫu Phiếu</th>
                    <th className="p-3">Nhóm Danh Mục</th>
                    <th className="p-3 text-center">Số Trường Form</th>
                    <th className="p-3 text-center">Số Cấp Duyệt</th>
                    <th className="p-3 text-center">Trạng Thái (Bật/Tắt)</th>
                    <th className="p-3 text-center">Thao Tác Cấu Hình</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTemplates.map((t) => (
                    <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${!t.is_active ? 'opacity-60 bg-slate-50/50' : ''}`}>
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900 text-xs leading-snug">{t.title}</p>
                        <p className="font-mono text-purple-700 text-[11px] font-bold">Mã phiếu: {t.template_code}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{t.description}</p>
                      </td>

                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10.5px] inline-block">
                          {t.category_name}
                        </span>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-700">
                        {t.fields.length} Trường
                      </td>

                      <td className="p-3 text-center font-mono text-[10.5px] text-purple-700 font-bold">
                        {t.approval_steps.length} Cấp Duyệt
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleTemplateActive(t.id)}
                          className={`px-3 py-1 rounded-full font-extrabold text-[10.5px] border transition-all flex items-center gap-1.5 mx-auto ${
                            t.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'
                          }`}
                        >
                          {t.is_active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                          {t.is_active ? '🟢 Đang Bật' : '⚪ Đang Tắt'}
                        </button>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* VIEW PREVIEW SCHEMA */}
                          <button
                            onClick={() => {
                              setPreviewTemplate(t);
                              setIsPreviewTmplOpen(true);
                            }}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
                            title="Xem Cấu Hình Mẫu Form & Luồng Duyệt"
                          >
                            <Eye className="w-3.5 h-3.5" /> Xem
                          </button>

                          {/* EDIT TEMPLATE */}
                          <button
                            onClick={() => handleOpenEditTemplateModal(t)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
                            title="Sửa Mẫu Phiếu, Trường & Luồng Duyệt"
                          >
                            <Edit className="w-3.5 h-3.5" /> Sửa
                          </button>

                          {/* DUPLICATE */}
                          <button
                            onClick={() => handleDuplicateTemplate(t.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            title="Nhân bản Mẫu Form 1-Click"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDeleteTemplate(t.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                            title="Xóa Mẫu Phiếu"
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
      </div>

      {/* MODAL 1: XEM CHI TIẾT CẤU HÌNH LOẠI PHIẾU (SCHEMA PREVIEW) */}
      {isPreviewTmplOpen && previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4 text-xs font-bold max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-[10.5px] font-black">{previewTemplate.template_code}</span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">{previewTemplate.title}</h3>
              </div>
              <button onClick={() => setIsPreviewTmplOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
              <p className="text-purple-900 font-extrabold">{previewTemplate.category_name}</p>
              <p className="text-purple-800 font-normal text-[11.5px]">{previewTemplate.description}</p>
            </div>

            {/* FIELDS SCHEMA LIST */}
            <div className="space-y-2 pt-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-700">
                📄 Danh Sách {previewTemplate.fields.length} Trường Dữ Liệu Form:
              </h4>

              <div className="space-y-2">
                {previewTemplate.fields.map((f, idx) => (
                  <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900">{idx + 1}. {f.field_label}</span>
                      {f.is_required && <span className="text-red-500 ml-1">* (Bắt buộc)</span>}
                      {f.options && (
                        <p className="text-[10.5px] text-slate-500 mt-0.5">Options: {f.options.join(', ')}</p>
                      )}
                    </div>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-mono text-[10.5px] rounded-full font-bold">
                      {f.data_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* APPROVAL STEPS */}
            <div className="space-y-2 pt-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-amber-700">
                🔄 Cấu Hình Luồng Duyệt ({previewTemplate.approval_steps.length} Cấp):
              </h4>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl font-mono text-purple-900">
                {previewTemplate.approval_steps.map((st) => `Bước ${st.step_order}: ${st.approver_role}`).join(' ➔ ')}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t">
              <button
                onClick={() => setIsPreviewTmplOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-extrabold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / CREATE TEMPLATE MODAL (SỬA VÀ THÊM MỚI LOẠI PHIẾU) */}
      {isEditTmplOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden p-6 space-y-4 text-xs font-bold max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-purple-600" />
                  {isCreatingNewTmpl ? 'Tạo Mới Loại Phiếu Phê Duyệt' : `Chỉnh Sửa Mẫu Phiếu: ${editTmplTitle}`}
                </h3>
              </div>
              <button onClick={() => setIsEditTmplOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Mã Mẫu Biểu *</label>
                  <input
                    type="text"
                    required
                    value={editTmplCode}
                    onChange={(e) => setEditTmplCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-purple-700 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 mb-1">Tên Mẫu Biểu Phê Duyệt *</label>
                  <input
                    type="text"
                    required
                    value={editTmplTitle}
                    onChange={(e) => setEditTmplTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-extrabold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Nhóm Danh Mục *</label>
                  <select
                    value={editTmplCategory}
                    onChange={(e) => setEditTmplCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  >
                    {CATEGORIES.filter(c => c !== 'Tất Cả Danh Mục').map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Mô Tả Quy Định Mẫu Biểu</label>
                  <input
                    type="text"
                    value={editTmplDesc}
                    onChange={(e) => setEditTmplDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* DYNAMIC FIELDS EDITOR */}
              <div className="pt-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-purple-700 text-xs uppercase tracking-wider">
                    📄 Cấu Hình Danh Sách Trường Thông Tin ({editTmplFields.length} Trường)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFieldInEditModal}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Trường Mới
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {editTmplFields.map((f, idx) => (
                    <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Tên Nhãn Trường #{idx + 1}</label>
                        <input
                          type="text"
                          value={f.field_label}
                          onChange={(e) => {
                            const updated = [...editTmplFields];
                            updated[idx].field_label = e.target.value;
                            setEditTmplFields(updated);
                          }}
                          className="w-full px-2 py-1 border rounded bg-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block">Kiểu Dữ Liệu Trường *</label>
                        <select
                          value={f.data_type}
                          onChange={(e) => {
                            const updated = [...editTmplFields];
                            updated[idx].data_type = e.target.value as FieldDataType;
                            setEditTmplFields(updated);
                          }}
                          className="w-full px-2 py-1 border rounded bg-white font-mono text-[10.5px] text-purple-700"
                        >
                          <option value="TEXT_INPUT">TEXT_INPUT (Chữ ngắn)</option>
                          <option value="TEXT_AREA">TEXT_AREA (Diễn giải)</option>
                          <option value="NUMBER_AMOUNT">NUMBER_AMOUNT (Số tiền/Số)</option>
                          <option value="DATE_PICKER">DATE_PICKER (Chọn ngày)</option>
                          <option value="SELECT_DROPDOWN">SELECT_DROPDOWN (Danh sách)</option>
                          <option value="FILE_UPLOAD">FILE_UPLOAD (Tệp đính kèm)</option>
                          <option value="CHECKBOX_BOOLEAN">CHECKBOX_BOOLEAN (Hộp chọn)</option>
                          <option value="EMPLOYEE_SELECT">👤 EMPLOYEE_SELECT (Chọn Nhân Viên HRM)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-3">
                        <input
                          type="checkbox"
                          checked={f.is_required}
                          onChange={(e) => {
                            const updated = [...editTmplFields];
                            updated[idx].is_required = e.target.checked;
                            setEditTmplFields(updated);
                          }}
                          className="w-4 h-4 accent-purple-600 rounded"
                        />
                        <span className="text-slate-700 font-bold text-[11px]">Bắt buộc</span>
                      </div>

                      <div className="text-right pt-3">
                        <button
                          type="button"
                          onClick={() => setEditTmplFields(editTmplFields.filter((_, i) => i !== idx))}
                          className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* APPROVAL STEPS EDITOR */}
              <div className="pt-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-amber-700 text-xs uppercase tracking-wider">
                    🔄 Cấu Hình Luồng Duyệt Đa Cấp ({editTmplSteps.length} Cấp)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddStepInEditModal}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Cấp Duyệt
                  </button>
                </div>

                <div className="space-y-2">
                  {editTmplSteps.map((st, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-900">Bước {idx + 1}:</span>
                      <input
                        type="text"
                        value={st.approver_role}
                        onChange={(e) => {
                          const updated = [...editTmplSteps];
                          updated[idx].approver_role = e.target.value;
                          setEditTmplSteps(updated);
                        }}
                        className="flex-1 px-3 py-1 border rounded-lg bg-white font-bold"
                        placeholder="Vai trò duyệt (Ví dụ: Kế Toán Trưởng)..."
                      />
                      <button
                        type="button"
                        onClick={() => setEditTmplSteps(editTmplSteps.filter((_, i) => i !== idx))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditTmplOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-400" /> Lưu Cấu Hình Mẫu Phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XEM CHI TIẾT PHIẾU ĐÃ NỘP & THAO TÁC PHÊ DUYỆT */}
      {isViewSubOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4 text-xs font-bold max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-black text-purple-700">{selectedSub.proposal_code}</span>
                <h3 className="font-extrabold text-sm text-slate-900">Chi Tiết Phiếu Phê Duyệt & Ký Duyệt</h3>
              </div>
              <button onClick={() => setIsViewSubOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">{selectedSub.template_title}</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium pt-2 border-t border-slate-200/80">
                <p>Người làm đơn: <strong className="text-slate-900">{selectedSub.applicant_name}</strong></p>
                <p>Đơn vị / Phòng ban: <strong className="text-slate-900">{selectedSub.applicant_department}</strong></p>
                <p>Ngày nộp phiếu: <strong className="text-slate-900 font-mono">{selectedSub.submitted_date}</strong></p>
                <p>Trạng thái: <strong className="text-purple-700">{selectedSub.status}</strong></p>
              </div>
            </div>

            {/* DISPLAY ALL FILLED FORM DATA FIELDS */}
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-purple-900 text-xs uppercase tracking-wider">
                📄 Dữ Liệu Chi Tiết Đã Điền Trong Form Phiếu Phê Duyệt:
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
                <h4 className="font-extrabold text-amber-900 text-xs">✍️ Ký Phê Duyệt Hoặc Từ Chối Phiếu:</h4>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nhập ghi chú ý kiến chỉ đạo..."
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
                    placeholder="Nhập lý do nếu nhấn Từ chối..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-xl text-[11px]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setIsViewSubOpen(false)}
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
