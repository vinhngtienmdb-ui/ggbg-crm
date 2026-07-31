import { OfficialDocument } from '@/types';

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
    file_name: 'Cong-Van-142-Cuc-TMDT-Bo-Cong-Thuong.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_size: '2.4 MB',
    comments: [
      { id: 'c1', author_name: 'Nguyễn Tiến Vinh', author_role: 'CEO', comment: 'Phê duyệt bút phê chuyển Khối KD triển khai ngay.', created_at: '2026-07-21 09:30' },
    ],
    created_at: '2026-07-21',
  },
  {
    id: 'doc_2',
    document_code: '88/QĐ-GGBG',
    title: 'Quyết Định Ban Hành Quy Trình Thao Tác Chuẩn SOP Quản Lý Lead & Chăm Sóc Khách Hàng Agency',
    category: 'OUTBOUND',
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
    comments: [],
    created_at: '2026-07-15',
  },
  {
    id: 'doc_3',
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
];

let docStore: OfficialDocument[] = [...INITIAL_DOCUMENTS];

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
