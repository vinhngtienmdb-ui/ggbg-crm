import { ProposalTemplate, ProposalSubmission } from '@/types';

export const INITIAL_PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: 'tmpl_1',
    template_code: 'BM-DX-001',
    title: 'Tờ Trình Tạm Ứng Kinh Phí Công Tác / Mua Sắm',
    category_name: 'Đề Xuất Tài Chính & Mua Sắm',
    description: 'Áp dụng cho tạm ứng chi phí công tác chi nhánh, mua sắm vật tư kho vận & phụ cấp gặp khách hàng.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f1', field_name: 'purpose_title', field_label: 'Tiêu Đề / Mục Đích Tạm Ứng', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ví dụ: Tạm ứng phí gặp khách hàng Agency Mỹ Phẩm An An...' },
      { id: 'f2', field_name: 'advance_amount', field_label: 'Số Tiền Đề Xuất Tạm Ứng (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '15000000' },
      { id: 'f3', field_name: 'expected_settlement_date', field_label: 'Ngày Dự Kiến Hoàn Ứng / Thanh Toán', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f4', field_name: 'detailed_reason', field_label: 'Lý Do & Diễn Giải Chi Tiết', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nhập nội dung trích yếu lý do tạm ứng...' },
      { id: 'f5', field_name: 'quote_attachment', field_label: 'Tệp Đính Kèm (Báo giá / Chứng từ)', data_type: 'FILE_UPLOAD', is_required: false },
    ],
  },
  {
    id: 'tmpl_2',
    template_code: 'BM-DX-002',
    title: 'Đơn Đăng Ký Nghỉ Phép Năm & Nghỉ Việc Riêng (Đồng Bộ HRM)',
    category_name: 'Đề Xuất Nhân Sự & Phép',
    description: 'Đăng ký nghỉ phép năm, nghỉ 1/2 ngày, nghỉ việc riêng gia đình. Tự động đồng bộ số phép và chấm công HRM.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
    ],
    fields: [
      { id: 'f6', field_name: 'leave_type', field_label: 'Loại Hình Nghỉ Phép (Đồng Bộ Phép NV)', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Phép Năm Hưởng Lương (Quỹ phép còn 9.5 ngày)', 'Phép Nghỉ Bù OT (Còn 2.0 ngày)', 'Nghỉ Chế Độ Chăm Sóc Con / Bệnh Hưởng BHXH', 'Nghỉ Việc Riêng Không Hưởng Lương'] },
      { id: 'f_dur', field_name: 'duration_mode', field_label: 'Thời Gian Nghỉ (1/2 Ngày / Cả Ngày)', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Cả Ngày (1.0 ngày)', 'Nghỉ 1/2 Ngày Sáng (08:00 - 12:00)', 'Nghỉ 1/2 Ngày Chiều (13:30 - 17:30)', 'Giờ Cụ Thể Trong Ngày'] },
      { id: 'f_time', field_name: 'specific_time_range', field_label: 'Khung Giờ Cụ Thể (Nếu Chọn Giờ Cụ Thể)', data_type: 'TEXT_INPUT', is_required: false, placeholder: 'Ví dụ: 09:00 - 11:30 hoặc 14:00 - 16:30...' },
      { id: 'f7', field_name: 'start_date', field_label: 'Ngày Bắt Đầu Nghỉ', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f8', field_name: 'end_date', field_label: 'Ngày Kết Thúc Nghỉ', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f9', field_name: 'handover_notes', field_label: 'Nội Dung Bàn Giao Công Việc', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nhập thông tin nhân sự thay thế xử lý công việc...' },
    ],
  },
  {
    id: 'tmpl_resign',
    template_code: 'BM-DX-004',
    title: 'Đơn Xin Nghỉ Việc & Bàn Giao Công Việc (Đồng Bộ HRM)',
    category_name: 'Đề Xuất Nhân Sự & Phép',
    description: 'Nộp đơn xin nghỉ việc chính thức, thông báo thời gian báo trước 30-45 ngày & kế hoạch bàn giao tài sản.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_r1', field_name: 'resignation_reason', field_label: 'Lý Do Xin Nghỉ Việc', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nhập lý do cá nhân / định hướng công việc...' },
      { id: 'f_r2', field_name: 'last_working_day', field_label: 'Ngày Làm Việc Cuối Cùng Dự Kiến', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_r3', field_name: 'notice_period_days', field_label: 'Số Ngày Báo Trước (Theo HĐLĐ)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '30' },
      { id: 'f_r4', field_name: 'asset_handover_list', field_label: 'Danh Sách Tài Sản & Hồ Sơ Bàn Giao', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nhập danh sách Laptop, Thẻ nhân viên, Tài khoản hệ thống...' },
    ],
  },
  {
    id: 'tmpl_3',
    template_code: 'BM-DX-003',
    title: 'Đề Xuất Cấp Phát Máy Tính & Thiết Bị Làm Việc',
    category_name: 'Đề Xuất Tài Sản & IT',
    description: 'Cấp phát máy tính làm việc tân binh, máy in tem vận đơn hoặc thiết bị văn phòng.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng IT' },
      { step_order: 2, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f10', field_name: 'device_name', field_label: 'Tên Thiết Bị Yêu Cầu Cấp Phát', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ví dụ: Laptop Dell XPS 15 cho Nhân sự Design...' },
      { id: 'f11', field_name: 'urgency_level', field_label: 'Mức Độ Khẩn Cấp', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Bình Thường', 'Khẩn (Cấp trong 48h)', 'Thượng Khẩn (Cấp ngay)'] },
      { id: 'f12', field_name: 'is_probation_staff', field_label: 'Dành Cho Nhân Sự Thử Việc Tân Binh', data_type: 'CHECKBOX_BOOLEAN', is_required: false },
    ],
  },
];

export const INITIAL_SUBMISSIONS: ProposalSubmission[] = [
  {
    id: 'sub_1',
    proposal_code: 'TT-2026-0701',
    template_id: 'tmpl_1',
    template_title: 'Tờ Trình Tạm Ứng Kinh Phí Công Tác / Mua Sắm',
    applicant_name: 'Vũ Quốc Anh',
    applicant_department: 'Khối Kinh Doanh & TMĐT',
    submitted_date: '2026-07-28',
    field_values: {
      purpose_title: 'Tạm ứng phí gặp khách hàng Agency Mỹ Phẩm An An tại TP.HCM',
      advance_amount: 15000000,
      expected_settlement_date: '2026-08-15',
      detailed_reason: 'Công tác 3 ngày ký kết phụ lục hợp đồng ủy quyền Shopee Mall và đặt gian hàng TikTok Live.',
      quote_attachment: 'Bao-Gia-Ve-May-Bay-Khach-San.pdf',
    },
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban', approver_name: 'Đặng Tuấn Tú', status: 'APPROVED', approved_at: '2026-07-28 14:00', comment: 'Đã duyệt trình Kế toán kiểm tra.' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng', approver_name: 'Trần Thị Mai', status: 'PENDING' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)', approver_name: 'Nguyễn Tiến Vinh', status: 'PENDING' },
    ],
    current_step_order: 2,
    status: 'PENDING',
  },
];

let templatesStore: ProposalTemplate[] = [...INITIAL_PROPOSAL_TEMPLATES];
let submissionsStore: ProposalSubmission[] = [...INITIAL_SUBMISSIONS];

export function getProposalTemplates(): ProposalTemplate[] {
  return templatesStore;
}

export function addProposalTemplate(tmpl: ProposalTemplate): ProposalTemplate[] {
  templatesStore = [tmpl, ...templatesStore];
  return templatesStore;
}

export function getProposalSubmissions(): ProposalSubmission[] {
  return submissionsStore;
}

export function addProposalSubmission(sub: ProposalSubmission): ProposalSubmission[] {
  submissionsStore = [sub, ...submissionsStore];
  return submissionsStore;
}

export function updateProposalSubmission(updated: ProposalSubmission): ProposalSubmission[] {
  submissionsStore = submissionsStore.map(s => s.id === updated.id ? updated : s);
  return submissionsStore;
}

export function toggleProposalTemplateActive(id: string): ProposalTemplate[] {
  templatesStore = templatesStore.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t);
  return templatesStore;
}

export function duplicateProposalTemplate(id: string): ProposalTemplate[] {
  const target = templatesStore.find(t => t.id === id);
  if (target) {
    const copy: ProposalTemplate = {
      ...target,
      id: `tmpl_${Date.now()}`,
      template_code: `${target.template_code}-COPY`,
      title: `${target.title} (Bản sao)`,
    };
    templatesStore = [copy, ...templatesStore];
  }
  return templatesStore;
}

export function deleteProposalTemplate(id: string): ProposalTemplate[] {
  templatesStore = templatesStore.filter(t => t.id !== id);
  return templatesStore;
}
