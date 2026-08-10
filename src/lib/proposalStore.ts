import { ProposalTemplate, ProposalSubmission } from '@/types';

export const INITIAL_PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  // --- NHÓM 1: HÀNH CHÍNH & NHÂN SỰ ---
  {
    id: 'tmpl_1',
    template_code: 'BM-PD-001',
    title: 'Đơn Xin Nghỉ Phép Năm & Nghỉ Việc Riêng',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Đăng ký nghỉ phép năm, nghỉ việc riêng gia đình, nghỉ bù OT hoặc nghỉ chế độ BHXH. Tự động đồng bộ số phép và chấm công HRM.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
    ],
    fields: [
      {
        id: 'f_leave_type',
        field_name: 'leave_type',
        field_label: 'Loại Hình Nghỉ Phép',
        data_type: 'SELECT_DROPDOWN',
        is_required: true,
        options: ['Phép Năm Hưởng Lương (Quỹ 12 ngày/năm)', 'Phép Nghỉ Bù OT', 'Nghỉ Chế Độ Chăm Sóc Con / Bệnh Hưởng BHXH', 'Nghỉ Việc Riêng Không Hưởng Lương', 'Nghỉ Hiếu Hỉ Gia Đình (Hưởng Lương)'],
      },
      {
        id: 'f_duration_mode',
        field_name: 'duration_mode',
        field_label: 'Thời Gian Nghỉ Đề Xuất',
        data_type: 'SELECT_DROPDOWN',
        is_required: true,
        options: ['Cả Ngày (1.0 ngày)', 'Nghỉ 1/2 Ngày Sáng (08:00 - 12:00)', 'Nghỉ 1/2 Ngày Chiều (13:30 - 17:30)', 'Khung Giờ Cụ Thể Trong Ngày'],
      },
      {
        id: 'f_start_date',
        field_name: 'start_date',
        field_label: 'Ngày Bắt Đầu Nghỉ',
        data_type: 'DATE_PICKER',
        is_required: true,
      },
      {
        id: 'f_end_date',
        field_name: 'end_date',
        field_label: 'Ngày Kết Thúc Nghỉ',
        data_type: 'DATE_PICKER',
        is_required: true,
      },
      {
        id: 'f_handover_person',
        field_name: 'handover_person',
        field_label: 'Nhân Sự Nhận Bàn Giao Công Việc',
        data_type: 'EMPLOYEE_SELECT',
        is_required: true,
        placeholder: 'Chọn nhân sự hỗ trợ bàn giao công việc...',
      },
      {
        id: 'f_reason',
        field_name: 'reason',
        field_label: 'Lý Do Xin Nghỉ Chi Tiết',
        data_type: 'TEXT_AREA',
        is_required: true,
        placeholder: 'Diễn giải lý do xin nghỉ phép...',
      },
      {
        id: 'f_attachment',
        field_name: 'attachment',
        field_label: 'Chứng Từ Đính Kèm (Giấy khám bệnh/Chứng từ)',
        data_type: 'FILE_UPLOAD',
        is_required: false,
      },
    ],
  },
  {
    id: 'tmpl_2',
    template_code: 'BM-PD-002',
    title: 'Đơn Đăng Ký Làm Thêm Giờ (Overtime / OT)',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Đăng ký OT làm ngoài giờ, cuối tuần hoặc ngày lễ tết. Tự động tính quỹ lương OT và phê duyệt cấp quản lý.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Giám Đốc Khối' },
    ],
    fields: [
      { id: 'f_ot_date', field_name: 'ot_date', field_label: 'Ngày Làm Thêm Giờ (OT)', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_ot_time_range', field_name: 'ot_time_range', field_label: 'Khung Giờ OT (Bắt đầu - Kết thúc)', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ví dụ: 18:00 - 21:30' },
      { id: 'f_total_hours', field_name: 'total_hours', field_label: 'Số Giờ OT Đề Xuất (Giờ)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '3.5' },
      { id: 'f_ot_type', field_name: 'ot_type', field_label: 'Loại Hình Làm Thêm Giờ', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['OT Ngày Thường (Hệ số 150%)', 'OT Ngày Nghỉ Cuối Tuần (Hệ số 200%)', 'OT Ngày Lễ Tết Quốc Gia (Hệ số 300%)'] },
      { id: 'f_ot_task', field_name: 'ot_task', field_label: 'Nội Dung Công Việc & Mục Tiêu OT', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Mô tả chi tiết công việc triển khai trong ca OT...' },
    ],
  },
  {
    id: 'tmpl_3',
    template_code: 'BM-PD-003',
    title: 'Đơn Đăng Ký Đi Công Tác & Di Chuyển',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Đăng ký công tác ngoại tỉnh, công tác chi nhánh và gặp đối tác. Phê duyệt vé máy bay, khách sạn & phụ cấp công tác.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_destination', field_name: 'destination', field_label: 'Địa Điểm Công Tác / Chi Nhánh', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ví dụ: Chi nhánh TP. Hồ Chí Minh & Gian hàng Shopee Mall...' },
      { id: 'f_ct_start', field_name: 'start_date', field_label: 'Ngày Bắt Đầu Công Tác', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_ct_end', field_name: 'end_date', field_label: 'Ngày Kết Thúc Công Tác', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_vehicle', field_name: 'vehicle', field_label: 'Phương Tiện Di Chuyển Chính', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Máy Bay (Vé Phổ Thông)', 'Tàu Hỏa / Xe Khách', 'Xe Ô Tô Công Ty', 'Phương Tiện Cá Nhân (Hoàn Phí Xăng)'] },
      { id: 'f_est_budget', field_name: 'estimated_budget', field_label: 'Chi Phí Dự Kiến Công Tác (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '12000000' },
      { id: 'f_purpose', field_name: 'purpose', field_label: 'Mục Đích & Kế Hoạch Làm Việc Chi Tiết', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Lịch trình gặp đối tác, nghiệm thu dự án...' },
    ],
  },
  {
    id: 'tmpl_4',
    template_code: 'BM-PD-004',
    title: 'Đơn Xin Đi Muộn / Về Sớm',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Báo đi muộn đầu giờ hoặc về sớm cuối ca làm việc do công việc đột xuất hoặc lý do cá nhân chính đáng.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
    ],
    fields: [
      { id: 'f_req_date', field_name: 'request_date', field_label: 'Ngày Xin Đi Muộn / Về Sớm', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_req_type', field_name: 'request_type', field_label: 'Hình Thức', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Đi Muộn Đầu Ca Sáng', 'Về Sớm Cuối Ca Chiều', 'Ra Ngoài Giữa Ca Làm Việc'] },
      { id: 'f_minutes', field_name: 'minutes_count', field_label: 'Thời Gian (Số phút / Số giờ)', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ví dụ: 45 phút (08:00 - 08:45)' },
      { id: 'f_late_reason', field_name: 'reason', field_label: 'Lý Do Cụ Thể', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Hỏng xe, gặp đối tác bất ngờ, khám sức khỏe...' },
    ],
  },
  {
    id: 'tmpl_5',
    template_code: 'BM-PD-005',
    title: 'Đơn Xin Làm Việc Từ Xa / Remote (WFH)',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Đăng ký làm việc tại nhà (Work From Home) kèm danh sách KPI công việc hoàn thành trong ngày.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
    ],
    fields: [
      { id: 'f_wfh_date', field_name: 'wfh_date', field_label: 'Ngày Làm Việc Từ Xa (WFH)', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_wfh_mode', field_name: 'wfh_mode', field_label: 'Thời Gian WFH', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Cả Ngày (1.0 ngày WFH)', 'Sáng WFH / Chiều Tại Văn Phòng', 'Chiều WFH / Sáng Tại Văn Phòng'] },
      { id: 'f_wfh_loc', field_name: 'work_location', field_label: 'Địa Điểm Làm Việc Remote', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Địa chỉ nhà riêng / Cafe...' },
      { id: 'f_wfh_plan', field_name: 'daily_plan', field_label: 'Kế Hoạch & Đầu Ra Công Việc Bàn Giao', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Danh sách KPI, nhiệm vụ hoàn thành trong ngày WFH...' },
    ],
  },
  {
    id: 'tmpl_6',
    template_code: 'BM-PD-006',
    title: 'Đơn Xin Nghỉ Thai Sản & Chế Độ BHXH',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Nộp đơn nghỉ thai sản dành cho lao động nữ (6 tháng) hoặc lao động nam khi vợ sinh con (5-14 ngày).',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
    ],
    fields: [
      { id: 'f_mat_type', field_name: 'maternity_type', field_label: 'Chế Độ Thai Sản Đăng Ký', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Nghỉ Thai Sản Lao Động Nữ (6 tháng)', 'Nghỉ Nam Khi Vợ Sinh Thường (5 ngày)', 'Nghỉ Nam Khi Vợ Sinh Mổ (7-14 ngày)', 'Nghỉ Dưỡng Sức Sau Thai Sản'] },
      { id: 'f_exp_birth', field_name: 'expected_birth_date', field_label: 'Ngày Dự Sinh / Ngày Sinh Con', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_mat_start', field_name: 'start_date', field_label: 'Ngày Bắt Đầu Nghỉ Thai Sản', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_hosp_doc', field_name: 'hospital_cert', field_label: 'Giấy Chứng Sinh / Giấy Ra Viện Đính Kèm', data_type: 'FILE_UPLOAD', is_required: false },
    ],
  },
  {
    id: 'tmpl_7',
    template_code: 'BM-PD-007',
    title: 'Đơn Xin Điều Chuyển Bộ Phận / Phòng Ban',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Trình duyệt chuyển giao vị trí công tác, điều chuyển phòng ban hoặc chi nhánh công ty.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Hiện Tại' },
      { step_order: 2, approver_role: 'Trưởng Phòng Mới' },
      { step_order: 3, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
      { step_order: 4, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_cur_dept', field_name: 'current_department', field_label: 'Phòng Ban / Vị Trí Hiện Tại', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Nhân viên Telesale - Khối Kinh Doanh' },
      { id: 'f_tar_dept', field_name: 'target_department', field_label: 'Phòng Ban / Vị Trí Muốn Chuyển Đến', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Chuyên viên Vận hành Shopee Mall - Khối TMĐT' },
      { id: 'f_trans_date', field_name: 'effective_date', field_label: 'Ngày Dự Kiến Áp Dụng Điều Chuyển', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_trans_reason', field_name: 'reason', field_label: 'Lý Do Điều Chuyển & Nguyện Vọng', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Diễn giải định hướng phát triển năng lực cá nhân...' },
    ],
  },
  {
    id: 'tmpl_8',
    template_code: 'BM-PD-008',
    title: 'Đơn Xin Nghỉ Việc & Kế Hoạch Bàn Giao',
    category_name: 'Hành Chính & Nhân Sự',
    description: 'Chính thức nộp đơn thôi việc, xác nhận số ngày báo trước theo hợp đồng lao động và quy trình bàn giao tài sản.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_last_day', field_name: 'last_working_day', field_label: 'Ngày Làm Việc Cuối Cùng Dự Kiến', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_notice_days', field_name: 'notice_period_days', field_label: 'Số Ngày Báo Trước (Theo HĐLĐ)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '30' },
      { id: 'f_res_reason', field_name: 'resignation_reason', field_label: 'Lý Do Xin Thôi Việc', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nhập lý do cá nhân hoặc định hướng sự nghiệp mới...' },
      { id: 'f_asset_handover', field_name: 'asset_handover_list', field_label: 'Danh Sách Tài Sản & Tài Khoản Bàn Giao', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Laptop Dell XPS, Thẻ nhân viên, Tài khoản CRM, Email...' },
    ],
  },

  // --- NHÓM 2: TÀI CHÍNH & KẾ TOÁN ---
  {
    id: 'tmpl_9',
    template_code: 'BM-PD-009',
    title: 'Tờ Trình Tạm Ứng Kinh Phí Công Tác / Mua Sắm',
    category_name: 'Tài Chính & Kế Toán',
    description: 'Tạm ứng kinh phí công tác, phụ cấp thị trường, mua sắm vật tư kho vận và triển khai sự kiện.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_purpose_title', field_name: 'purpose_title', field_label: 'Tiêu Đề / Mục Đích Tạm Ứng', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Tạm ứng kinh phí gặp khách hàng Agency Mỹ Phẩm An An...' },
      { id: 'f_adv_amount', field_name: 'advance_amount', field_label: 'Số Tiền Tạm Ứng Đề Xuất (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '15000000' },
      { id: 'f_settle_date', field_name: 'expected_settlement_date', field_label: 'Ngày Dự Kiến Hoàn Ứng', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_adv_reason', field_name: 'detailed_reason', field_label: 'Diễn Giải Chi Tiết Khoản Tạm Ứng', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nêu rõ cấu trúc chi phí (Vé máy bay, khách sạn, tiếp khách)...' },
      { id: 'f_quote_file', field_name: 'quote_attachment', field_label: 'Chứng Từ / Báo Giá Đính Kèm', data_type: 'FILE_UPLOAD', is_required: false },
    ],
  },
  {
    id: 'tmpl_10',
    template_code: 'BM-PD-010',
    title: 'Đề Nghị Thanh Toán & Hoàn Ứng Chi Phí',
    category_name: 'Tài Chính & Kế Toán',
    description: 'Thanh toán trực tiếp hóa đơn dịch vụ hoặc quyết toán hoàn ứng các khoản đã chi trả cho công ty.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng Ban' },
      { step_order: 2, approver_role: 'Kế Toán Viên' },
      { step_order: 3, approver_role: 'Kế Toán Trưởng' },
      { step_order: 4, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_pay_amount', field_name: 'payment_amount', field_label: 'Tổng Số Tiền Đề Nghị Thanh Toán (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '8500000' },
      { id: 'f_bank_info', field_name: 'bank_account_info', field_label: 'Thông Tin Tài Khoản Thụ Hưởng', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'STK: 1903xxx - MB Bank - NGUYEN VAN A' },
      { id: 'f_pay_type', field_name: 'payment_type', field_label: 'Hình Thức Thanh Toán', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Thanh Toán Trực Tiếp Cho Nhà Cung Cấp', 'Hoàn Ứng Chi Phí Nhân Viên Đã Chi', 'Quyết Toán Khoản Tạm Ứng'] },
      { id: 'f_inv_file', field_name: 'invoice_attachment', field_label: 'Hóa Đơn VAT / Biên Lai Đính Kèm', data_type: 'FILE_UPLOAD', is_required: true },
      { id: 'f_pay_note', field_name: 'payment_description', field_label: 'Nội Dung Trích Yếu Thanh Toán', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Chi tiết nội dung các khoản chi...' },
    ],
  },
  {
    id: 'tmpl_11',
    template_code: 'BM-PD-011',
    title: 'Tờ Trình Chi Phí Phát Sinh Chi Ngoài Ngân Sách',
    category_name: 'Tài Chính & Kế Toán',
    description: 'Trình duyệt cấp thẩm quyền các khoản chi đột xuất không nằm trong kế hoạch ngân sách quý/năm.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Kế Toán Trưởng' },
      { step_order: 2, approver_role: 'Giám Đốc Tài Chính (CFO)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_exp_cat', field_name: 'expense_category', field_label: 'Hạng Mục Chi Phí Phát Sinh', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Marketing & Quảng Cáo Sản Phẩm', 'Hạ Tầng Server & Phần Mềm IT', 'Pháp Lý & Tư Vấn Hợp Đồng', 'Vận Hành Kho Hàng & Tem Nhãn'] },
      { id: 'f_extra_amt', field_name: 'extra_amount', field_label: 'Số Tiền Chi Phí Phát Sinh (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '25000000' },
      { id: 'f_justification', field_name: 'justification', field_label: 'Giải Trình Lý Do Phát Sinh & Đánh Giá ROI', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nêu rõ lý do ngoài dự kiến và hiệu quả mang lại...' },
    ],
  },
  {
    id: 'tmpl_12',
    template_code: 'BM-PD-012',
    title: 'Đề Xuất Thanh Toán Hợp Đồng Nhà Cung Cấp',
    category_name: 'Tài Chính & Kế Toán',
    description: 'Trình giải ngân thanh toán theo đợt hợp đồng đã ký với nhà cung cấp, đơn vị vận chuyển hoặc agency.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Quản Lý Dự Án / Mua Sắm' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_vendor_name', field_name: 'vendor_name', field_label: 'Tên Nhà Cung Cấp / Đối Tác', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Công ty TNHH Logistics Việt Nam...' },
      { id: 'f_contract_num', field_name: 'contract_number', field_label: 'Số / Mã Hợp Đồng Đã Ký', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'HD-2026/GGBG-LOG-01' },
      { id: 'f_pay_stage', field_name: 'payment_stage', field_label: 'Đợt Thanh Toán', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Đợt 1: Tạm ứng đặt cọc (30%)', 'Đợt 2: Nghiệm thu giai đoạn (40%)', 'Đợt 3: Thanh lý hợp đồng (30%)'] },
      { id: 'f_stage_amt', field_name: 'stage_amount', field_label: 'Số Tiền Đợt Thanh Toán (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '45000000' },
      { id: 'f_accept_doc', field_name: 'acceptance_document', field_label: 'Biên Bản Nghiệm Thu & Hóa Đơn đính kèm', data_type: 'FILE_UPLOAD', is_required: true },
    ],
  },
  {
    id: 'tmpl_13',
    template_code: 'BM-PD-013',
    title: 'Đề Xuất Hoàn Tiền Khách Hàng & Chiết Khấu Đặc Biệt',
    category_name: 'Tài Chính & Kế Toán',
    description: 'Phê duyệt hoàn tiền đơn hàng bị lỗi hoặc duyệt chiết khấu đặc biệt vượt thẩm quyền cho khách hàng VIP.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Sales Manager / CSKH Manager' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
    ],
    fields: [
      { id: 'f_cust_name', field_name: 'customer_name', field_label: 'Tên Khách Hàng / Gian Hàng Shopee TikTok', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Khách hàng Nguyễn Văn B (Mã đơn: #18239)' },
      { id: 'f_ref_amt', field_name: 'refund_amount', field_label: 'Số Tiền Hoàn / Chiết Khấu (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '3500000' },
      { id: 'f_ref_reason', field_name: 'refund_reason', field_label: 'Lý Do Hoàn Tiền / Ưu Đãi', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Hàng Hóa Bị Lỗi Sản Xuất / Hư Hỏng Vận Chuyển', 'Khách Hàng Hủy Hợp Đồng Vận Hành Trước Hạn', 'Chiết Khấu Ưu Đãi Khách Hàng VIP / Đại Lý'] },
      { id: 'f_ref_notes', field_name: 'notes', field_label: 'Diễn Giải Chi Tiết Sự Việc', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Mô tả nguyên nhân và giải pháp chăm sóc khách hàng...' },
    ],
  },

  // --- NHÓM 3: MUA SẮM & QUẢN LÝ TÀI SẢN ---
  {
    id: 'tmpl_14',
    template_code: 'BM-PD-014',
    title: 'Đề Xuất Mua Sắm Trang Thiết Bị & Vật Tư Văn Phòng',
    category_name: 'Mua Sắm & Quản Lý Tài Sản',
    description: 'Đề xuất mua sắm bàn ghế, vật tư tiêu hao, văn phòng phẩm hoặc phụ kiện phòng họp.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Hành Chính Quản Trị' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_item_name', field_name: 'item_name', field_label: 'Tên Trang Thiết Bị / Vật Tư Cần Mua', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Ghế xoay công thái học cho nhân sự Design...' },
      { id: 'f_item_qty', field_name: 'quantity', field_label: 'Số Lượng Cần Mua', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '5' },
      { id: 'f_unit_price', field_name: 'estimated_unit_price', field_label: 'Đơn Giá Dự Kiến (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '2800000' },
      { id: 'f_urgency', field_name: 'urgency_level', field_label: 'Mức Độ Khẩn Cấp', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Bình Thường', 'Khẩn Cấp (Cấp trong 48h)', 'Thượng Khẩn'] },
      { id: 'f_quote_files', field_name: 'quote_files', field_label: 'File 3 Báo Giá So Sánh Đính Kèm', data_type: 'FILE_UPLOAD', is_required: false },
    ],
  },
  {
    id: 'tmpl_15',
    template_code: 'BM-PD-015',
    title: 'Đề Xuất Cấp Phát Máy Tính & Thiết Bị IT Làm Việc',
    category_name: 'Mua Sắm & Quản Lý Tài Sản',
    description: 'Cấp phát máy tính làm việc cho tân binh, nâng cấp cấu hình máy tính hoặc cấp máy in tem vận đơn.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Trưởng Phòng IT' },
      { step_order: 2, approver_role: 'Trưởng Phòng Nhân Sự (HRM)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_staff_name', field_name: 'staff_name', field_label: 'Tên Nhân Sự Được Cấp Phát', data_type: 'EMPLOYEE_SELECT', is_required: true, placeholder: 'Chọn nhân sự được cấp phát thiết bị...' },
      { id: 'f_device_type', field_name: 'device_type', field_label: 'Loại Thiết Bị Đề Xuất', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Laptop Windows (Core i7 / RAM 16GB)', 'Macbook Pro M3 (Dành cho Media/Design)', 'Màn Hình Mở Rộng 27 inch', 'Máy In Tem Vận Đơn Kho Hàng'] },
      { id: 'f_is_new_hire', field_name: 'is_new_hire', field_label: 'Dành Cho Nhân Sự Mới Onboard', data_type: 'CHECKBOX_BOOLEAN', is_required: false },
      { id: 'f_spec_req', field_name: 'spec_requirements', field_label: 'Yêu Cầu Cấu Hình Chi Tiết', data_type: 'TEXT_AREA', is_required: true, placeholder: 'SSD 512GB, Card đồ họa RTX 4060...' },
    ],
  },
  {
    id: 'tmpl_16',
    template_code: 'BM-PD-016',
    title: 'Phiếu Đăng Ký Mượn / Trả Tài Sản Doanh Nghiệp',
    category_name: 'Mua Sắm & Quản Lý Tài Sản',
    description: 'Đăng ký mượn máy ảnh, thiết bị livestream, xe công ty hoặc tài sản dùng chung ra khỏi văn phòng.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Quản Lý Tài Sản / IT' },
    ],
    fields: [
      { id: 'f_asset_code', field_name: 'asset_code_name', field_label: 'Mã & Tên Tài Sản Mượn', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Máy ảnh Sony A7IV & Đèn Studio Godox' },
      { id: 'f_borrow_date', field_name: 'borrow_date', field_label: 'Ngày Bắt Đầu Mượn', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_return_date', field_name: 'return_date', field_label: 'Ngày Dự Kiến Trả', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_borrow_purpose', field_name: 'purpose', field_label: 'Mục Đích Sử Dụng Mượn Tài Sản', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Quay chụp phiên livestream Shopee Super Brand Day...' },
    ],
  },
  {
    id: 'tmpl_17',
    template_code: 'BM-PD-017',
    title: 'Tờ Trình Đề Xuất Sửa Chữa & Bảo Trì Tài Sản',
    category_name: 'Mua Sắm & Quản Lý Tài Sản',
    description: 'Trình duyệt chi phí sửa chữa máy móc hỏng, bảo trì điều hòa văn phòng hoặc máy chủ IT.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Quản Lý Tài Sản' },
      { step_order: 2, approver_role: 'Kế Toán Trưởng' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_fix_asset', field_name: 'asset_name', field_label: 'Tên Thiết Bị / Tài Sản Cần Sửa Chữa', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Máy in tem Honeywell Kho Hà Nội...' },
      { id: 'f_damage_status', field_name: 'damage_status', field_label: 'Hiện Trạng Hư Hỏng & Sự Cố', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Hỏng đầu in nhiệt, không nhận giấy vận đơn...' },
      { id: 'f_repair_cost', field_name: 'repair_cost', field_label: 'Chi Phí Sửa Chữa Báo Giá (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '3200000' },
      { id: 'f_repair_quote', field_name: 'repair_quote', field_label: 'Phiếu Báo Giá Sửa Chữa Đính Kèm', data_type: 'FILE_UPLOAD', is_required: true },
    ],
  },

  // --- NHÓM 4: DỰ ÁN, KINH DOANH & VẬN HÀNH ---
  {
    id: 'tmpl_18',
    template_code: 'BM-PD-018',
    title: 'Tờ Trình Phê Duyệt Kế Hoạch / Chiến Dịch Marketing',
    category_name: 'Dự Án, Kinh Doanh & Vận Hành',
    description: 'Trình kế hoạch chạy quảng cáo Shopee/TikTok Ads, booking KOC và ngân sách chiến dịch Mega Sale.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Marketing Manager' },
      { step_order: 2, approver_role: 'Giám Đốc Tài Chính (CFO)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_camp_name', field_name: 'campaign_name', field_label: 'Tên Chiến Dịch Marketing', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Chiến dịch Mega Sale 9.9 - Vận hành Shopee & TikTok...' },
      { id: 'f_tot_budget', field_name: 'total_budget', field_label: 'Tổng Ngân Sách Đề Xuất (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '150000000' },
      { id: 'f_tar_gmv', field_name: 'target_gmv', field_label: 'Mục Tiêu Doanh Số GMV Cam Kết (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '1200000000' },
      { id: 'f_channel', field_name: 'channel', field_label: 'Kênh Triển Khai Chính', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Shopee Internal Ads & Affiliate', 'TikTok Shop Live & Shop Ads', 'Booking KOC/KOL Review', 'Omnichannel All-in-One'] },
      { id: 'f_prop_file', field_name: 'proposal_file', field_label: 'Slide / Proposal Kế Hoạch Chi Tiết Đính Kèm', data_type: 'FILE_UPLOAD', is_required: true },
    ],
  },
  {
    id: 'tmpl_19',
    template_code: 'BM-PD-019',
    title: 'Tờ Trình Ký Kết Hợp Đồng Đối Tác & Đại Lý TMĐT',
    category_name: 'Dự Án, Kinh Doanh & Vận Hành',
    description: 'Trình duyệt ký kết hợp đồng ủy quyền vận hành gian hàng Shopee/TikTok hoặc đối tác đại lý phân phối.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Sales Director' },
      { step_order: 2, approver_role: 'Phụ Trách Pháp Lý (Legal)' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_part_name', field_name: 'partner_name', field_label: 'Tên Đối Tác / Nhãn Hàng Ủy Quyền', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Công ty Cổ Phần Mỹ Phẩm An An' },
      { id: 'f_serv_pkg', field_name: 'service_package', field_label: 'Gói Dịch Vụ Ủy Quyền Vận Hành', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Gói Vận Hành Shopee Mall Toàn Diện', 'Gói TikTok Shop TSP & Livestream', 'Gói Lazada Mall & Amazon Global', 'Gói Phân Phối Sàn GGBingoVN Platform'] },
      { id: 'f_cont_val', field_name: 'contract_value', field_label: 'Giá Trị Hợp Đồng Dự Kiến (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '360000000' },
      { id: 'f_cont_draft', field_name: 'contract_draft', field_label: 'Dự Thảo Hợp Đồng Đính Kèm', data_type: 'FILE_UPLOAD', is_required: true },
    ],
  },
  {
    id: 'tmpl_20',
    template_code: 'BM-PD-020',
    title: 'Đề Xuất Thay Đổi Báo Giá & Chính Sách Bán Hàng',
    category_name: 'Dự Án, Kinh Doanh & Vận Hành',
    description: 'Trình duyệt bảng giá dịch vụ mới, điều chỉnh tỷ lệ hoa hồng chiết khấu cho khách hàng lớn.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Sales Manager' },
      { step_order: 2, approver_role: 'Marketing Manager' },
      { step_order: 3, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_pol_title', field_name: 'policy_title', field_label: 'Tiêu Đề Chính Sách / Bảng Giá Mới', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Chính sách chiết khấu Quý 3/2026 cho đại lý Mỹ Phẩm...' },
      { id: 'f_eff_date', field_name: 'effective_date', field_label: 'Ngày Hiệu Lực Áp Dụng', data_type: 'DATE_PICKER', is_required: true },
      { id: 'f_disc_rate', field_name: 'discount_rate', field_label: 'Tỷ Lệ Giảm Giá / Chiết Khấu Điều Chỉnh (%)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '15' },
      { id: 'f_pol_reason', field_name: 'reason', field_label: 'Lý Do Điều Chỉnh & Đánh Giá Cạnh Tranh', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Nêu căn cứ thị trường và đối thủ cạnh tranh...' },
    ],
  },
  {
    id: 'tmpl_21',
    template_code: 'BM-PD-021',
    title: 'Tờ Trình Tiêu Hủy Hàng Hóa & Xử Lý Tồn Kho Hư Hỏng',
    category_name: 'Dự Án, Kinh Doanh & Vận Hành',
    description: 'Trình tiêu hủy sản phẩm lỗi móp vỡ, hàng hết hạn sử dụng (Out of date) tại kho vận.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Quản Lý Kho Hàng' },
      { step_order: 2, approver_role: 'Kế Toán Kho' },
      { step_order: 3, approver_role: 'Giám Đốc Tài Chính (CFO)' },
      { step_order: 4, approver_role: 'Tổng Giám Đốc (CEO)' },
    ],
    fields: [
      { id: 'f_wh_name', field_name: 'warehouse_name', field_label: 'Kho Hàng Ghi Nhận Tiêu Hủy', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Kho Tổng Hà Nội (Hoài Đức)', 'Kho Chi Nhánh TP.HCM (Tân Bình)', 'Kho Hàng Trả Về TMĐT'] },
      { id: 'f_scrap_val', field_name: 'scrap_value', field_label: 'Tổng Giá Trị Hàng Tiêu Hủy (VND)', data_type: 'NUMBER_AMOUNT', is_required: true, placeholder: '18500000' },
      { id: 'f_scrap_list', field_name: 'scrap_list', field_label: 'Danh Sách SKU, Số Lượng & Lý Do Hỏng', data_type: 'TEXT_AREA', is_required: true, placeholder: 'SKU-001: 50 hộp móp vỡ vỏ hộp trong vận chuyển...' },
      { id: 'f_insp_doc', field_name: 'inspection_document', field_label: 'Biên Bản Kiểm Kê & Ảnh Hàng Hóa Đính Kèm', data_type: 'FILE_UPLOAD', is_required: true },
    ],
  },
  {
    id: 'tmpl_22',
    template_code: 'BM-PD-022',
    title: 'Đề Xuất Hỗ Trợ Kỹ Thuật & Cấu Hình Tính Năng Mới',
    category_name: 'Dự Án, Kinh Doanh & Vận Hành',
    description: 'Đề xuất phòng Tech/IT phát triển tính năng phần mềm CRM, tích hợp API sàn TMĐT mới hoặc sửa lỗi khẩn cấp.',
    is_active: true,
    approval_steps: [
      { step_order: 1, approver_role: 'Product Owner (PO)' },
      { step_order: 2, approver_role: 'Technical Lead' },
    ],
    fields: [
      { id: 'f_feat_title', field_name: 'feature_title', field_label: 'Tên Tính Năng / Yêu Cầu Kỹ Thuật', data_type: 'TEXT_INPUT', is_required: true, placeholder: 'Tích hợp Webhook tự động nhận Lead từ TikTok Shop Live...' },
      { id: 'f_priority', field_name: 'priority', field_label: 'Mức Độ Ưu Tiên', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Bình Thường', 'Ưu Tiên Cao (High Priority)', 'Khẩn Cấp (Blocker - Cần xử lý ngay)'] },
      { id: 'f_mod_aff', field_name: 'module_affected', field_label: 'Phân Hệ Liên Quan', data_type: 'SELECT_DROPDOWN', is_required: true, options: ['Quản Lý Customer & Lead', 'Live Chat CSKH Đa Kênh', 'HRM & Chấm Công KPIs', 'Báo Cáo Doanh Số & Kho Hàng'] },
      { id: 'f_feat_desc', field_name: 'description', field_label: 'Mô Tả Yêu Cầu & Kịch Bản Sử Dụng', data_type: 'TEXT_AREA', is_required: true, placeholder: 'Mô tả chi tiết luồng dữ liệu và giao diện mong muốn...' },
    ],
  },
];

export const INITIAL_SUBMISSIONS: ProposalSubmission[] = [];

let templatesStore: ProposalTemplate[] = [...INITIAL_PROPOSAL_TEMPLATES];
let submissionsStore: ProposalSubmission[] = [...INITIAL_SUBMISSIONS];

export function getProposalTemplates(): ProposalTemplate[] {
  return templatesStore;
}

export function addProposalTemplate(tmpl: ProposalTemplate): ProposalTemplate[] {
  templatesStore = [tmpl, ...templatesStore];
  return templatesStore;
}

export function updateProposalTemplate(updated: ProposalTemplate): ProposalTemplate[] {
  templatesStore = templatesStore.map(t => t.id === updated.id ? updated : t);
  return templatesStore;
}

export function deleteProposalTemplate(id: string): ProposalTemplate[] {
  templatesStore = templatesStore.filter(t => t.id !== id);
  return templatesStore;
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

export function deleteProposalSubmission(id: string): ProposalSubmission[] {
  submissionsStore = submissionsStore.filter(s => s.id !== id);
  return submissionsStore;
}
