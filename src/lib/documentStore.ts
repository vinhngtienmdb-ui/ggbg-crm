import { OfficialDocument, DocumentLedgerConfig } from '@/types';

export const INITIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'doc_1',
    document_code: '142/CV-BCT',
    title: 'V/v Hướng dẫn đăng ký Gian hàng TMĐT Xuyên Biên Giới & Kiểm soát Thuế e-Commerce 2026',
    category: 'INBOUND',
    issuer_org: 'Bộ Công Thương - Cục Thương Mại Điện Tử',
    recipient_org: 'Ban Giám Đốc GGBG CRM',
    issued_date: '2026-07-20',
    received_date: '2026-07-21',
    signee_name: 'Thứ Trưởng Trần Quốc Khánh',
    security_level: 'NORMAL',
    urgency_level: 'HIGHLY_URGENT',
    status: 'IN_PROCESSING',
    assigned_department: 'Khối Kinh Doanh & TMĐT',
    assigned_assignee: 'Đặng Tuấn Tú',
    directive_note: 'Giao Trưởng phòng Vận hành TMĐT cập nhật đúng quy trình khai báo thuế cho 100% gian hàng merchant trước 15/08.',
    sla_deadline: '2026-08-10 17:00',
    file_name: 'Cong-Van-142-Cuc-TMDT-Bo-Cong-Thuong.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '2.4 MB',
    comments: [
      { id: 'c1', author_name: 'Nguyễn Tiến Vinh', author_role: 'CEO', comment: 'Phê duyệt bút phê chuyển Khối KD triển khai ngay.', created_at: '2026-07-21 09:30' },
    ],
    process_logs: [
      { id: 'l1', actor_name: 'Phạm Thị Lan', actor_role: 'Văn Thư', action: 'TIẾP NHẬN', note: 'Đã vào sổ công văn đến', timestamp: '2026-07-21 08:30' },
      { id: 'l2', actor_name: 'Nguyễn Tiến Vinh', actor_role: 'CEO', action: 'BÚT PHÊ', note: 'Chỉ đạo Trưởng phòng Vận hành TMĐT triển khai', timestamp: '2026-07-21 09:30' },
    ],
    created_at: '2026-07-21',
  },
  {
    id: 'doc_2',
    document_code: '88/QĐ-GGBG',
    title: 'Quyết Định Ban Hành Quy Trình Thao Tác Chuẩn SOP Quản Lý Lead & Chăm Sóc Khách Hàng Agency',
    category: 'DECISION',
    issuer_org: 'Ban Giám Đốc GGBG CRM',
    recipient_org: 'Toàn thể Cán bộ Nhân viên GGBG',
    issued_date: '2026-07-15',
    received_date: '2026-07-15',
    signee_name: 'CEO Nguyễn Tiến Vinh',
    security_level: 'CONFIDENTIAL',
    urgency_level: 'URGENT',
    status: 'COMPLETED',
    assigned_department: 'Phòng Kinh Doanh 1',
    assigned_assignee: 'Nguyễn Văn Minh',
    directive_note: 'Phổ biến toàn bộ 100% nhân viên tư vấn áp dụng chuẩn khung thông tin khách hàng và 2 cấp địa chỉ hành chính.',
    file_name: 'Quyet-Dinh-88-SOP-Lead-Intake.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '1.8 MB',
    has_digital_stamp: true,
    stamped_at: '2026-07-15 10:00:00',
    digital_signature_meta: {
      signed_by: 'Nguyễn Tiến Vinh (Tổng Giám Đốc)',
      signed_at: '2026-07-15 10:00:00',
      ca_provider: 'VNPT-CA Enterprise Root',
      seal_applied: true,
    },
    qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GGBG-DOC-88-QD',
    comments: [],
    created_at: '2026-07-15',
  },
  {
    id: 'doc_3',
    document_code: '05/TTr-GGBG',
    title: 'Tờ Trình Xin Phê Duyệt Ngân Sách Đầu Tư Hệ Thống Ký Số Cloud HSM & Máy Chủ Dự Phòng Đa Vùng T8/2026',
    category: 'SUBMISSION_STATEMENT',
    issuer_org: 'Khối Công Nghệ & Hạ Tầng IT',
    recipient_org: 'Ban Giám Đốc GGBG CRM',
    issued_date: '2026-07-28',
    received_date: '2026-07-28',
    signee_name: 'CTO Phạm Hoàng Anh',
    security_level: 'SECRET',
    urgency_level: 'HIGHLY_URGENT',
    status: 'PENDING_DIRECTIVE',
    assigned_department: 'Ban Giám Đốc',
    assigned_assignee: 'Nguyễn Tiến Vinh',
    directive_note: '',
    sla_deadline: '2026-07-30 12:00',
    file_name: 'To-Trinh-05-Ngan-Sach-Cloud-HSM.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '3.5 MB',
    comments: [],
    created_at: '2026-07-28',
  },
  {
    id: 'doc_4',
    document_code: '12/TB-GGBG',
    title: 'Thông Báo Lịch Nghỉ Lễ Quốc Khánh 02/09 & Kế Hoạch Trực Tổng Đài CSKH Hotlines 24/7',
    category: 'ANNOUNCEMENT',
    issuer_org: 'Khối Nhân Sự & Hành Chính',
    recipient_org: 'Toàn Thể Nhân Sự Công Ty',
    issued_date: '2026-07-25',
    received_date: '2026-07-25',
    signee_name: 'CHRO Nguyễn Thị Bích Ngọc',
    security_level: 'NORMAL',
    urgency_level: 'NORMAL',
    status: 'COMPLETED',
    assigned_department: 'Khối Nhân Sự (HRM)',
    assigned_assignee: 'Đỗ Thị Hương',
    directive_note: 'Đã phát hành rộng rãi trên Bảng tin Công ty & Zalo OA Nội bộ.',
    file_name: 'Thong-Bao-12-Lich-Nghi-Le-2-9.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '1.2 MB',
    has_digital_stamp: true,
    stamped_at: '2026-07-25 14:30:00',
    comments: [],
    created_at: '2026-07-25',
  },
  {
    id: 'doc_5',
    document_code: '05/QC-GGBG',
    title: 'Quy Chế Quản Lý & Trích Lập Quỹ Lương Hiệu Suất 3P Doanh Nghiệp Năm 2026',
    category: 'INTERNAL_SOP',
    issuer_org: 'Khối Nhân Sự (HRM)',
    recipient_org: 'Tất cả các Khối / Phòng Ban',
    issued_date: '2026-06-01',
    received_date: '2026-06-01',
    signee_name: 'CHRO Nguyễn Thị Bích Ngọc',
    security_level: 'CONFIDENTIAL',
    urgency_level: 'NORMAL',
    status: 'COMPLETED',
    assigned_department: 'Khối Nhân Sự (HRM)',
    assigned_assignee: 'Đỗ Thị Hương',
    directive_note: 'Áp dụng liên thông tự động từ tỷ lệ KPI sang Điểm P3 đánh giá xếp loại nhân sự ABCD.',
    file_name: 'Quy-Che-Luong-3P-GGBG-2026.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '3.1 MB',
    comments: [],
    created_at: '2026-06-01',
  },
  {
    id: 'doc_6',
    document_code: '99/BB-GGBG',
    title: 'Biên Bản Ghi Nhớ Hợp Tác MOU Triển Khai Giải Pháp CRM & Omnichannel Cho Tập Đoàn Bán Lẻ SunGroup',
    category: 'CONTRACT_MINUTES',
    issuer_org: 'Phòng Pháp Chế & Ban Dự Án',
    recipient_org: 'Tập đoàn SunGroup Việt Nam',
    issued_date: '2026-07-10',
    received_date: '2026-07-10',
    signee_name: 'Phó Tổng Giám Đốc Lê Văn Tùng',
    security_level: 'SECRET',
    urgency_level: 'URGENT',
    status: 'COMPLETED',
    assigned_department: 'Ban Dự Án',
    assigned_assignee: 'Trần Văn Hoàng',
    directive_note: 'Lưu trữ bản gốc tại phòng Pháp chế, bản mềm mã hóa lưu Sổ Văn Thư.',
    file_name: 'Bien-Ban-MOU-SunGroup-2026.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '4.2 MB',
    has_digital_stamp: true,
    stamped_at: '2026-07-10 16:00:00',
    comments: [],
    created_at: '2026-07-10',
  },
  {
    id: 'doc_7',
    document_code: '02/BC-GGBG',
    title: 'Báo Cáo Đánh Giá Rủi Ro An Ninh Thông Tin & Chuẩn Tuân Thủ ISO 27001 Quý II/2026',
    category: 'PERIODIC_REPORT',
    issuer_org: 'Ban Kiểm Soát Nội Bộ & Security',
    recipient_org: 'Ban Giám Đốc & Hội Đồng Quản Trị',
    issued_date: '2026-07-05',
    received_date: '2026-07-05',
    signee_name: 'Trưởng Ban Kiểm Soát Đỗ Minh Khang',
    security_level: 'TOP_SECRET',
    urgency_level: 'NORMAL',
    status: 'COMPLETED',
    assigned_department: 'Ban Kiểm Soát',
    assigned_assignee: 'Đỗ Minh Khang',
    directive_note: 'Mật - Chỉ gửi cho HĐQT và Ban Giám Đốc.',
    file_name: 'Bao-Cao-Security-Audit-Q2-2026.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '5.8 MB',
    comments: [],
    created_at: '2026-07-05',
  },
  {
    id: 'doc_8',
    document_code: '315/CV-GGBG',
    title: 'Công Văn Gửi Cục Thuế TP. Hà Nội V/v Giải Trình Chi Phí Khuyến Mại & Chi Khấu Trừ Thuế TNCN Tháng 6',
    category: 'OUTBOUND',
    issuer_org: 'Ban Giám Đốc GGBG CRM',
    recipient_org: 'Cục Thuế TP. Hà Nội',
    issued_date: '2026-07-02',
    received_date: '2026-07-02',
    signee_name: 'CEO Nguyễn Tiến Vinh',
    security_level: 'CONFIDENTIAL',
    urgency_level: 'EXPRESS',
    status: 'COMPLETED',
    assigned_department: 'Phòng Kế Toán',
    assigned_assignee: 'Vũ Thị Hằng',
    directive_note: 'Đã nộp qua Cổng Kê Khai Thuế Điện Tử Thường Trực.',
    file_name: 'Cong-Van-315-Giai-Trinh-Thue-T6.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '2.9 MB',
    has_digital_stamp: true,
    stamped_at: '2026-07-02 11:15:00',
    comments: [],
    created_at: '2026-07-02',
  },
];

export const INITIAL_LEDGERS: DocumentLedgerConfig[] = [
  {
    id: 'ledger_inbound_2026',
    ledger_name: 'Sổ Công Văn Đến Năm 2026',
    ledger_type: 'INBOUND',
    prefix: 'CV-BCT',
    suffix: '/2026',
    current_number: 142,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: '10_YEARS',
    allowed_categories: ['INBOUND'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_outbound_2026',
    ledger_name: 'Sổ Công Văn Đi Doanh Nghiệp',
    ledger_type: 'OUTBOUND',
    prefix: 'CV-GGBG',
    suffix: '/GGBG',
    current_number: 315,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: '10_YEARS',
    allowed_categories: ['OUTBOUND'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_internal_decisions',
    ledger_name: 'Sổ Quyết Định & Tờ Trình Ban Giám Đốc',
    ledger_type: 'INTERNAL',
    prefix: 'QĐ-GGBG',
    suffix: '/QĐ-2026',
    current_number: 88,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: 'PERMANENT',
    allowed_categories: ['DECISION', 'SUBMISSION_STATEMENT', 'ANNOUNCEMENT'],
    is_active: true,
    created_at: '2026-01-01',
  },
  {
    id: 'ledger_internal_sop',
    ledger_name: 'Sổ Quy Chế SOP & Biên Bản HĐQT',
    ledger_type: 'INTERNAL',
    prefix: 'QC-GGBG',
    suffix: '/SOP',
    current_number: 15,
    number_padding: 3,
    reset_frequency: 'NEVER',
    retention_period: 'PERMANENT',
    allowed_categories: ['INTERNAL_SOP', 'CONTRACT_MINUTES', 'PERIODIC_REPORT'],
    is_active: true,
    created_at: '2026-01-01',
  },
];

let docStore: OfficialDocument[] = [...INITIAL_DOCUMENTS];
let ledgerStore: DocumentLedgerConfig[] = [...INITIAL_LEDGERS];

export function getOfficialDocuments(): OfficialDocument[] {
  return docStore;
}

export function addOfficialDocument(doc: OfficialDocument): OfficialDocument[] {
  docStore = [doc, ...docStore];
  return docStore;
}

export function updateOfficialDocument(updated: OfficialDocument): OfficialDocument[] {
  docStore = docStore.map(d => d.id === updated.id ? updated : d);
  return docStore;
}

export function deleteOfficialDocument(id: string): OfficialDocument[] {
  docStore = docStore.filter(d => d.id !== id);
  return docStore;
}

export function getDocumentLedgers(): DocumentLedgerConfig[] {
  return ledgerStore;
}

export function addDocumentLedger(ledger: DocumentLedgerConfig): DocumentLedgerConfig[] {
  ledgerStore = [ledger, ...ledgerStore];
  return ledgerStore;
}

export function updateDocumentLedger(updated: DocumentLedgerConfig): DocumentLedgerConfig[] {
  ledgerStore = ledgerStore.map(l => l.id === updated.id ? updated : l);
  return ledgerStore;
}

export function deleteDocumentLedger(id: string): DocumentLedgerConfig[] {
  ledgerStore = ledgerStore.filter(l => l.id !== id);
  return ledgerStore;
}
