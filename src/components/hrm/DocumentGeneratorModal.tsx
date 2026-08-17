'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Download,
  Trash2,
  X,
  UserCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  Eye,
  Check
} from 'lucide-react';
import { DocumentTemplate, GeneratedDocument, EmployeeProfile, DocumentTemplateType } from '@/types';
import {
  getDocumentTemplates,
  getGeneratedDocuments,
  createGeneratedDocument,
  signGeneratedDocument,
  sendDocumentEmail,
  deleteGeneratedDocument,
  getEmployees
} from '@/lib/hrmStore';
import { formatCurrency } from '@/lib/formatters';

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentGeneratorModal({ isOpen, onClose }: DocumentGeneratorModalProps) {
  const [documents, setDocuments] = useState<GeneratedDocument[]>(() => getGeneratedDocuments());
  const [templates] = useState<DocumentTemplate[]>(() => getDocumentTemplates());
  const [employees] = useState<EmployeeProfile[]>(() => getEmployees());

  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocument | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State for creating new doc
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [customReason, setCustomReason] = useState('');
  const [newSalary, setNewSalary] = useState<number>(25000000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!tmpl || !emp) return;

    const docCode = `${tmpl.code.replace('-MAU', '')}/2026/${String(documents.length + 1).padStart(2, '0')}`;
    let content = tmpl.body_template_html;

    const allowancesText = (emp.allowances && emp.allowances.length > 0)
      ? emp.allowances.map((a) => `${a.name}: ${formatCurrency(a.amount)}/tháng`).join('; ')
      : 'Ăn trưa 730,000 ₫/tháng; Xăng xe 500,000 ₫/tháng';

    const replacements: Record<string, string> = {
      '{{employee_name}}': emp.full_name,
      '{{employee_code}}': emp.employee_code,
      '{{contract_number}}': emp.contract_number || `HĐLĐ-2026/${emp.employee_code}`,
      '{{id_card_number}}': emp.id_card_number || '001092837465',
      '{{permanent_address}}': emp.permanent_address || 'Hà Nội, Việt Nam',
      '{{phone}}': emp.phone,
      '{{email}}': emp.email,
      '{{position}}': emp.position,
      '{{department}}': emp.department,
      '{{base_salary}}': formatCurrency(emp.base_salary || 15000000),
      '{{previous_salary}}': formatCurrency(emp.base_salary || 15000000),
      '{{new_salary}}': formatCurrency(newSalary),
      '{{insurance_salary}}': formatCurrency(emp.insurance_salary || 8000000),
      '{{allowances_text}}': allowancesText,
      '{{shift_name}}': 'Hành Chính (08:30 - 17:30)',
      '{{effective_date}}': effectiveDate,
      '{{current_date}}': new Date().toLocaleDateString('vi-VN'),
    };

    Object.entries(replacements).forEach(([k, v]) => {
      content = content.replaceAll(k, v);
    });

    const newDoc = createGeneratedDocument({
      document_code: docCode,
      template_id: tmpl.id,
      template_type: tmpl.type,
      title: `${tmpl.name.toUpperCase()} - ${emp.full_name} (${emp.employee_code})`,
      employee_id: emp.id,
      employee_name: emp.full_name,
      department: emp.department,
      content_html: content,
      created_by_name: 'Đặng Kim Anh (HR Manager)',
    });

    setDocuments([...getGeneratedDocuments()]);
    setShowCreateModal(false);
    showToast(`Đã soạn thảo văn bản thành công: ${newDoc.document_code}`);
  };

  const handleSignDocument = (docId: string) => {
    signGeneratedDocument(docId, 'Phạm Minh Đức (Giám Đốc Kinh Doanh)');
    setDocuments([...getGeneratedDocuments()]);
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'APPROVED_SIGNED',
        signed_by_name: 'Phạm Minh Đức (Giám Đốc Kinh Doanh)',
        signed_at: new Date().toISOString().split('T')[0],
      });
    }
    showToast('Đã ký số và đóng dấu điện tử phê duyệt văn bản!');
  };

  const handleSendEmail = (doc: GeneratedDocument) => {
    const emp = employees.find((e) => e.id === doc.employee_id);
    const targetEmail = emp?.email || 'nhansu@ggbingo.vn';
    sendDocumentEmail(doc.id, targetEmail);
    setDocuments([...getGeneratedDocuments()]);
    if (selectedDoc && selectedDoc.id === doc.id) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'SENT_EMAIL',
        email_sent_to: targetEmail,
        email_sent_at: new Date().toLocaleString('vi-VN'),
      });
    }
    showToast(`Đã gửi email văn bản ký số thành công đến ${targetEmail}`);
  };

  const handleDeleteDoc = (docId: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa văn bản "${title}"?`)) {
      deleteGeneratedDocument(docId);
      setDocuments([...getGeneratedDocuments()]);
      setSelectedDoc(null);
      showToast('Đã xóa văn bản khỏi hệ thống');
    }
  };

  return ( <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in"> <Sparkles className="w-4 h-4 text-amber-400" /> <span className="text-sm font-semibold">{toastMsg}</span> </div> )} <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]"> {/* Modal Header */} <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900/80 dark:to-slate-900/60"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20"> <FileText className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2"> Soạn Thảo Văn Bản, Quyết Định & Hợp Đồng Tự Động <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-medium">HRM Generator</span> </h3> <p className="text-xs text-slate-500 font-medium">Tự động trích xuất thông tin nhân sự HRM ➔ Trình ký số điện tử ➔ Gửi Email tự động</p> </div> </div> <div className="flex items-center gap-2"> <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            > <Plus className="w-4 h-4" /> + Soạn Thảo Văn Bản Mới </button> <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
            > <X className="w-5 h-5" /> </button> </div> </div> {/* Modal Body */} <div className="p-6 overflow-y-auto flex-1 space-y-4"> <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/50"> <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Tổng Văn Bản Đã Tạo</span> <p className="text-2xl font-semibold font-mono text-blue-900 dark:text-blue-200 mt-1">{documents.length}</p> </div> <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50"> <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Đã Ký Số & Phê Duyệt</span> <p className="text-2xl font-semibold font-mono text-emerald-900 dark:text-emerald-200 mt-1"> {documents.filter((d) => d.status === 'APPROVED_SIGNED' || d.status === 'SENT_EMAIL').length} </p> </div> <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/50"> <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Chờ Giám Đốc Ký Duyệt</span> <p className="text-2xl font-semibold font-mono text-amber-900 dark:text-amber-200 mt-1"> {documents.filter((d) => d.status === 'PENDING_APPROVAL').length} </p> </div> </div> {/* Document Table */} <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <div className="overflow-x-auto"> <table className="w-full text-left text-xs"> <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5">Mã Văn Bản</th> <th className="p-3.5">Tiêu Đề / Loại Văn Bản</th> <th className="p-3.5">Nhân Sự Áp Dụng</th> <th className="p-3.5">Người Ký Duyệt</th> <th className="p-3.5">Trạng Thái</th> <th className="p-3.5 text-center">Thao Tác</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {documents.map((doc) => ( <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5 font-mono font-medium text-blue-600">{doc.document_code}</td> <td className="p-3.5"> <div className="font-medium text-slate-900 dark:text-white">{doc.title}</div> <div className="text-[10px] text-slate-400">Tạo ngày: {doc.created_at} bởi {doc.created_by_name}</div> </td> <td className="p-3.5"> <span className="font-medium text-slate-800 dark:text-slate-200">{doc.employee_name}</span> <div className="text-[10px] text-slate-400">{doc.department}</div> </td> <td className="p-3.5"> {doc.signed_by_name ? ( <div> <span className="font-medium text-emerald-600 flex items-center gap-1"> <ShieldCheck className="w-3.5 h-3.5" /> {doc.signed_by_name} </span> <span className="text-[10px] text-slate-400 font-mono">Ký ngày: {doc.signed_at}</span> </div> ) : ( <span className="text-amber-600 font-semibold flex items-center gap-1"> <Clock className="w-3.5 h-3.5" /> Chờ ký duyệt </span> )} </td> <td className="p-3.5"> {doc.status === 'APPROVED_SIGNED' && ( <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit"> <CheckCircle2 className="w-3 h-3" /> Đã Ký Số </span> )}
                        {doc.status === 'SENT_EMAIL' && ( <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit"> <Send className="w-3 h-3" /> Đã Gửi Email </span> )}
                        {doc.status === 'PENDING_APPROVAL' && ( <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit"> <Clock className="w-3 h-3" /> Chờ Duyệt </span> )} </td> <td className="p-3.5 text-center"> <div className="flex items-center justify-center gap-1.5"> <button
                            onClick={() => setSelectedDoc(doc)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Xem Bản Xem Trước Live"
                          > <Eye className="w-4 h-4" /> </button> {doc.status === 'PENDING_APPROVAL' && ( <button
                              onClick={() => handleSignDocument(doc.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-medium text-[11px] flex items-center gap-1 shadow-sm"
                              title="Ký Số Phê Duyệt"
                            > <ShieldCheck className="w-3 h-3" /> Ký Số </button> )}
                          {(doc.status === 'APPROVED_SIGNED' || doc.status === 'SENT_EMAIL') && ( <button
                              onClick={() => handleSendEmail(doc)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Gửi Email Văn Bản Cho Nhân Sự"
                            > <Send className="w-4 h-4" /> </button> )} <button
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                            title="Xóa Văn Bản"
                          > <Trash2 className="w-4 h-4" /> </button> </div> </td> </tr> ))} </tbody> </table> </div> </div> </div> {/* Footer */} <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end"> <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-medium"
          > Đóng </button> </div> </div> {/* VIEW LIVE DOCUMENT MODAL */}
      {selectedDoc && ( <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"> <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <div> <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{selectedDoc.title}</h4> <p className="text-[11px] text-slate-400 font-mono">Mã: {selectedDoc.document_code}</p> </div> <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              > <X className="w-5 h-5" /> </button> </div> {/* Document Content View */} <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-800 space-y-4 font-serif text-sm leading-relaxed border border-slate-100 mx-4 my-2 rounded-xl shadow-inner"> <div dangerouslySetInnerHTML={{ __html: selectedDoc.content_html }} /> {/* Digital Signature Stamp */}
              {selectedDoc.signed_by_name && ( <div className="pt-8 flex justify-end"> <div className="p-4 border-2 border-emerald-600 rounded-xl bg-emerald-50 text-center w-64 space-y-1"> <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-wide">CHỨNG THỰC CHỮ KÝ SỐ</p> <p className="font-semibold text-xs text-slate-900">{selectedDoc.signed_by_name}</p> <p className="text-[10px] text-emerald-700 font-mono">Ngày ký: {selectedDoc.signed_at}</p> <p className="text-[9px] text-slate-400">GGBingo Enterprise Cloud PKI CA</p> </div> </div> )} </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <div className="text-xs text-slate-500"> {selectedDoc.email_sent_to && ( <span>Đã gửi đến email: <strong>{selectedDoc.email_sent_to}</strong></span> )} </div> <div className="flex items-center gap-2"> {selectedDoc.status === 'PENDING_APPROVAL' && ( <button
                    onClick={() => handleSignDocument(selectedDoc.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md"
                  > <ShieldCheck className="w-4 h-4" /> Ký Số & Đóng Dấu </button> )} <button
                  onClick={() => handleSendEmail(selectedDoc)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md"
                > <Send className="w-4 h-4" /> Gửi Email Cho Nhân Sự </button> </div> </div> </div> </div> )}

      {/* CREATE NEW DOCUMENT FORM MODAL */}
      {showCreateModal && ( <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"> <form onSubmit={handleCreateDocument}> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Plus className="w-4 h-4 text-blue-600" /> Soạn Thảo Quyết Định / Hợp Đồng Mới </h3> <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">Chọn Loại Mẫu Văn Bản *</label> <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  > {templates.map((t) => ( <option key={t.id} value={t.id}> {t.name} ({t.code}) </option> ))} </select> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">Chọn Nhân Sự Áp Dụng (Dữ liệu từ HRM) *</label> <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  > {employees.map((emp) => ( <option key={emp.id} value={emp.id}> {emp.full_name} - {emp.employee_code} ({emp.position} · {emp.department}) </option> ))} </select> </div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mức Lương Mới Áp Dụng (VND)</label> <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-medium"
                    /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Ngày Có Hiệu Lực</label> <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    /> </div> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Lý Do / Căn Cứ Ban Hành</label> <textarea
                    rows={2}
                    placeholder="VD: Xét thành tích hoàn thành vượt 150% chỉ tiêu KPI quý 2/2026..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  /> </div> <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-800 dark:text-indigo-300"> ⚡ Hệ thống sẽ tự động điền họ tên, CCCD, địa chỉ, chức danh và danh mục phụ cấp của nhân viên vào nội dung văn bản. </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900"> <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                > Tạo Văn Bản Trình Ký </button> </div> </form> </div> </div> )} </div> );
}
