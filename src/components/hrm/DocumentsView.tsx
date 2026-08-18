'use client';

import React, { useState, useMemo } from 'react';
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
  UserCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  Eye,
  Check,
  Filter,
  Printer,
  FileCheck,
  ChevronRight,
  X
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

const TEMPLATE_TYPE_LABELS: Record<DocumentTemplateType, string> = {
  LABOR_CONTRACT: 'Hợp Đồng Lao Động',
  APPOINTMENT_DECISION: 'QĐ Bổ Nhiệm',
  SALARY_ADJUSTMENT_DECISION: 'QĐ Nâng Lương',
  REWARD_DISCIPLINE_DECISION: 'QĐ Khen Thưởng & Kỷ Luật',
  TERMINATION_DECISION: 'QĐ Thôi Việc',
  NDA_SECURITY_AGREEMENT: 'Thỏa Thuận Bảo Mật (NDA)',
  EMPLOYMENT_CONFIRMATION: 'Xác Nhận Công Tác',
};

export default function DocumentsView() {
  React.useEffect(() => {
    const handleUpdate = () => {
      try { setDocuments(getGeneratedDocuments()); } catch(e){}
      try { set_templates(getDocumentTemplates()); } catch(e){}
      try { set_employees(getEmployees()); } catch(e){}
    };
    window.addEventListener('hrm-update', handleUpdate);
    return () => window.removeEventListener('hrm-update', handleUpdate);
  }, []);

  const [documents, setDocuments] = useState<GeneratedDocument[]>(() => getGeneratedDocuments());
  const [templates, set_templates] = useState<DocumentTemplate[]>(() => getDocumentTemplates());
  const [employees, set_employees] = useState<EmployeeProfile[]>(() => getEmployees());

  const [activeSubTab, setActiveSubTab] = useState<'DOCS' | 'TEMPLATES'>('DOCS');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocument | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State for creating new doc
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [newSalary, setNewSalary] = useState<number>(25000000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const reloadDocs = () => {
    setDocuments([...getGeneratedDocuments()]);
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || doc.template_type === filterType;
      const matchStatus = filterStatus === 'ALL' || doc.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [documents, searchTerm, filterType, filterStatus]);

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

    reloadDocs();
    setShowCreateModal(false);
    setSelectedDoc(newDoc);
    showToast(`Đã soạn thảo văn bản thành công: ${newDoc.document_code}`);
  };

  const handleSignDocument = (docId: string) => {
    signGeneratedDocument(docId, 'Phạm Minh Đức (Giám Đốc Kinh Doanh)');
    reloadDocs();
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'APPROVED_SIGNED',
        signed_at: new Date().toISOString().split('T')[0],
        signed_by_name: 'Phạm Minh Đức (Giám Đốc Kinh Doanh)',
      });
    }
    showToast('Ký số điện tử văn bản thành công!');
  };

  const handleSendEmail = (doc: GeneratedDocument) => {
    const emp = employees.find((e) => e.id === doc.employee_id);
    const targetEmail = emp?.email || 'nhansu@ggbingo.vn';
    sendDocumentEmail(doc.id, targetEmail);
    reloadDocs();
    if (selectedDoc && selectedDoc.id === doc.id) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'SENT_EMAIL',
        email_sent_to: targetEmail,
        email_sent_at: new Date().toLocaleString('vi-VN'),
      });
    }
    showToast(`Đã gửi thông báo và bản sao văn bản qua Email: ${targetEmail}!`);
  };

  const handleDelete = (docId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa văn bản này?')) {
      deleteGeneratedDocument(docId);
      reloadDocs();
      if (selectedDoc?.id === docId) setSelectedDoc(null);
      showToast('Đã xóa văn bản.');
    }
  };

  const stats = useMemo(() => {
    const total = documents.length;
    const signed = documents.filter((d) => d.status === 'APPROVED_SIGNED' || d.status === 'SENT_EMAIL').length;
    const pending = documents.filter((d) => d.status === 'DRAFT' || d.status === 'PENDING_APPROVAL').length;
    const templatesCount = templates.length;
    return { total, signed, pending, templatesCount };
  }, [documents, templates]);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng Văn Bản Đã Lập</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stats.total} Hồ sơ</p>
            <span className="text-[11px] text-blue-600 font-medium">HĐLĐ & Quyết định</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Đã Ký Số Ban Hành</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.signed} Văn bản</p>
            <span className="text-[11px] text-emerald-600 font-medium">Đầy đủ giá trị pháp lý</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Chờ Trình Ký (Draft)</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pending} Dự thảo</p>
            <span className="text-[11px] text-amber-600 font-medium">Cần Ban Giám Đốc duyệt</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Kho Biểu Mẫu Chuẩn</span>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.templatesCount} Mẫu Form</p>
            <span className="text-[11px] text-purple-600 font-medium">Theo Luật Lao Động 2019</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SUB TAB CONTROLS & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('DOCS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'DOCS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Danh Sách HĐLĐ & Quyết Định ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TEMPLATES')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'TEMPLATES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kho Biểu Mẫu Chuẩn ({templates.length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Soạn Văn Bản / HĐLĐ Mới</span>
        </button>
      </div>

      {/* VIEW 1: DOCUMENTS LIST */}
      {activeSubTab === 'DOCS' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo số hiệu, tên nhân sự, tiêu đề văn bản..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Tất Cả Loại Văn Bản</option>
                <option value="LABOR_CONTRACT">Hợp Đồng Lao Động (HĐLĐ)</option>
                <option value="APPOINTMENT_DECISION">Quyết Định Bổ Nhiệm</option>
                <option value="SALARY_ADJUSTMENT_DECISION">Quyết Định Nâng Lương</option>
                <option value="REWARD_DISCIPLINE_DECISION">QĐ Khen Thưởng & Kỷ Luật</option>
                <option value="TERMINATION_DECISION">Quyết Định Thôi Việc</option>
                <option value="NDA_SECURITY_AGREEMENT">Thỏa Thuận Bảo Mật (NDA)</option>
                <option value="EMPLOYMENT_CONFIRMATION">Xác Nhận Công Tác</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Tất Cả Trạng Thái</option>
                <option value="DRAFT">Chờ Ký Duyệt (Draft)</option>
                <option value="APPROVED_SIGNED">Đã Ký Số (Signed)</option>
                <option value="SENT_EMAIL">Đã Gửi Email (Sent)</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-medium shrink-0">
              Tổng số: <strong className="text-slate-900 dark:text-white">{filteredDocs.length}</strong> văn bản
            </span>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Số Hiệu & Tiêu Đề</th>
                    <th className="p-3.5">Nhân Sự Áp Dụng</th>
                    <th className="p-3.5">Loại Văn Bản</th>
                    <th className="p-3.5">Ngày Lập</th>
                    <th className="p-3.5">Trạng Thái Ký Số</th>
                    <th className="p-3.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Không tìm thấy văn bản phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div>
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-xs block">
                              {doc.document_code}
                            </span>
                            <span className="text-slate-900 dark:text-white text-xs font-semibold line-clamp-1">
                              {doc.title}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                              {doc.employee_name}
                            </span>
                            <span className="text-slate-400 text-[11px]">{doc.department}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {TEMPLATE_TYPE_LABELS[doc.template_type] || doc.template_type}
                          </span>
                        </td>

                        <td className="p-3.5 tabular-nums text-slate-600 dark:text-slate-400">
                          {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold border inline-flex items-center gap-1 ${
                              doc.status === 'SENT_EMAIL'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                : doc.status === 'APPROVED_SIGNED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {doc.status === 'SENT_EMAIL' ? (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Đã Gửi Email</span>
                              </>
                            ) : doc.status === 'APPROVED_SIGNED' ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Đã Ký Số</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>Chờ Duyệt Ký</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                              title="Xem chi tiết & In"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem</span>
                            </button>

                            {doc.status !== 'APPROVED_SIGNED' && doc.status !== 'SENT_EMAIL' && (
                              <button
                                onClick={() => handleSignDocument(doc.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Ký duyệt điện tử"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Ký Số</span>
                              </button>
                            )}

                            {doc.status === 'APPROVED_SIGNED' && (
                              <button
                                onClick={() => handleSendEmail(doc)}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Gửi Email cho nhân sự"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Gửi Mail</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TEMPLATES CATALOG */}
      {activeSubTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {tmpl.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Biểu Mẫu Chuẩn</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{tmpl.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{tmpl.title_template}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Luật LĐ 2019 Chuẩn
                </span>
                <button
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setShowCreateModal(true);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Soạn Văn Bản</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE DOCUMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Soạn Thảo Văn Bản & Trình Ký Số Mới
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tự động điền dữ liệu hồ sơ nhân sự vào mẫu văn bản chuẩn.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Chọn Mẫu Văn Bản *</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-blue-700 dark:text-blue-300"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nhân Sự Áp Dụng *</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_code}) - {e.department} - {e.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ngày Hiệu Lực *</label>
                  <input
                    type="date"
                    required
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mức Lương Mới (Nếu có QĐ Lương)</label>
                  <input
                    type="number"
                    step={500000}
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Cơ chế tự động trích xuất thông tin:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Hệ thống tự động điền Họ tên, Số CMND/CCCD, Địa chỉ thường trú, Lương P1, Phụ cấp và Số hợp đồng vào văn bản theo mẫu biểu chuẩn.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all"
                >
                  Tạo & Trích Xuất Văn Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW & PRINT DOCUMENT MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedDoc.title}</h3>
                  <p className="text-[11px] text-slate-500">Mã văn bản: {selectedDoc.document_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Văn Bản</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Paper */}
            <div className="p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div
                className="bg-white text-slate-900 p-8 rounded shadow-lg max-w-2xl w-full text-xs leading-relaxed space-y-4 border border-slate-200"
                dangerouslySetInnerHTML={{ __html: selectedDoc.content_html }}
              />
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs text-slate-500">
                Trạng thái: <strong className="text-blue-600">{selectedDoc.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                {selectedDoc.status !== 'APPROVED_SIGNED' && selectedDoc.status !== 'SENT_EMAIL' && (
                  <button
                    onClick={() => handleSignDocument(selectedDoc.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Ký Số Điện Tử (Giám Đốc)</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
