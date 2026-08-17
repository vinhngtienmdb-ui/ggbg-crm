import { OfficialDocument } from '@/types';

export function exportDocumentsToCSV(documents: OfficialDocument[], ledgerTitle: string): void {
  const headers = [
    'STT',
    'Số/Mã Văn Bản',
    'Ngày Vào Sổ',
    'Tên/Trích Yếu Nội Dung',
    'Loại Văn Bản',
    'Cơ Quan Ban Hành',
    'Nơi Nhận',
    'Độ Khẩn',
    'Độ Mật',
    'Trạng Thái',
    'Đơn Vị Chủ Trì (Xử Lý Chính)',
    'Hạn Xử Lý SLA'
  ];

  const rows = documents.map((doc, idx) => [
    idx + 1,
    `"${doc.document_code}"`,
    `"${doc.received_date || doc.issued_date}"`,
    `"${doc.title.replace(/"/g, '""')}"`,
    `"${doc.category}"`,
    `"${doc.issuer_org.replace(/"/g, '""')}"`,
    `"${doc.recipient_org.replace(/"/g, '""')}"`,
    `"${doc.urgency_level}"`,
    `"${doc.security_level}"`,
    `"${doc.status}"`,
    `"${doc.assigned_department}"`,
    `"${doc.sla_deadline || 'Theo quy định'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${ledgerTitle.replace(/\s+/g, '_')}_ND30.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
