'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Inbox,
  Send,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Paperclip,
  Building2,
  User,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronRight,
  MessageSquare,
  Save,
  X,
  FileCheck,
  Download,
  QrCode,
  SlidersHorizontal,
  Lock,
  Layers,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import {
  OfficialDocument,
  DocumentCategory,
  SecurityLevel,
  UrgencyLevel,
  DocProcessStatus,
  DocumentLedgerConfig,
  LedgerResetFrequency,
  LedgerRetentionPeriod,
  AssignmentTargetType
} from '@/types';
import {
  getOfficialDocuments,
  addOfficialDocument,
  updateOfficialDocument,
  deleteOfficialDocument,
  getDocumentLedgers,
  addDocumentLedger,
  updateDocumentLedger,
  deleteDocumentLedger
} from '@/lib/documentStore';
import DigitalSignatureModal from '@/components/documents/DigitalSignatureModal';
import { useAuth } from '@/context/AuthContext';
import { canAccessSettings } from '@/lib/permissions';

export default function DocumentsPage() {
  const { user, simulatedRole } = useAuth();
  const activeRole = simulatedRole || user?.role || 'SALE_EXEC';

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => getOfficialDocuments());
  const [ledgers, setLedgers] = useState<DocumentLedgerConfig[]>(() => getDocumentLedgers());
  const [activeTab, setActiveTab] = useState<'INBOUND_LEDGER' | 'OUTBOUND_LEDGER' | 'INTERNAL_LEDGER' | 'PENDING_DIRECTIVE' | 'DIGITAL_STAMP' | 'DOC_CONFIG'>('INBOUND_LEDGER');
  const [selectedInternalCategory, setSelectedInternalCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Configuration State for 8 Document Types
  const [docConfig, setDocConfig] = useState({
    inbound_prefix: 'CV-BCT',
    outbound_prefix: 'CV-GGBG',
    decision_prefix: 'QĐ-GGBG',
    submission_prefix: 'TTr-GGBG',
    announcement_prefix: 'TB-GGBG',
    sop_prefix: 'QC-GGBG',
    contract_prefix: 'BB-GGBG',
    report_prefix: 'BC-GGBG',
    reset_yearly: true,
    urgent_sla_hours: 24,
    express_sla_hours: 4,
    cert_provider: 'VNPT-CA / Viettel-CA Enterprise Root Cloud HSM',
    auto_digital_seal: true,
    confidential_roles: ['SUPER_ADMIN', 'DIRECTOR', 'HR_MANAGER'],
  });

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OfficialDocument | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [directiveInput, setDirectiveInput] = useState('');
  const [assigneeDeptInput, setAssigneeDeptInput] = useState('Khối Kinh Doanh & TMĐT');

  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'INBOUND' as DocumentCategory,
    document_code: '',
    issuer_org: 'Bộ Công Thương - Cục TMĐT',
    recipient_org: 'Ban Giám Đốc GGBG CRM',
    issued_date: '2026-07-28',
    received_date: '2026-07-29',
    signee_name: 'Thứ Trưởng Trần Quốc Khánh',
    security_level: 'NORMAL' as SecurityLevel,
    urgency_level: 'URGENT' as UrgencyLevel,
    assigned_department: 'Khối Kinh Doanh & TMĐT',
    assigned_assignee: 'Đặng Tuấn Tú',
    directive_note: '',
  });

  const [isCreateLedgerOpen, setIsCreateLedgerOpen] = useState(false);
  const [newLedger, setNewLedger] = useState<{
    ledger_name: string;
    ledger_type: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
    prefix: string;
    suffix: string;
    current_number: number;
    number_padding: number;
    reset_frequency: LedgerResetFrequency;
    retention_period: LedgerRetentionPeriod;
  }>({
    ledger_name: 'Sổ Công Văn Mới 2026',
    ledger_type: 'INBOUND',
    prefix: 'CV-NEW',
    suffix: '/2026',
    current_number: 1,
    number_padding: 3,
    reset_frequency: 'YEARLY',
    retention_period: '10_YEARS',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateLedgerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DocumentLedgerConfig = {
      id: `ledger_${Date.now()}`,
      ledger_name: newLedger.ledger_name,
      ledger_type: newLedger.ledger_type,
      prefix: newLedger.prefix,
      suffix: newLedger.suffix,
      current_number: newLedger.current_number,
      number_padding: newLedger.number_padding,
      reset_frequency: newLedger.reset_frequency,
      retention_period: newLedger.retention_period,
      allowed_categories: newLedger.ledger_type === 'INBOUND' ? ['INBOUND'] : newLedger.ledger_type === 'OUTBOUND' ? ['OUTBOUND'] : ['DECISION', 'SUBMISSION_STATEMENT', 'ANNOUNCEMENT'],
      is_active: true,
      created_at: new Date().toISOString().split('T')[0],
    };
    const updatedLedgers = addDocumentLedger(created);
    setLedgers([...updatedLedgers]);
    setIsCreateLedgerOpen(false);
    showToast(`📚 Đã tạo thành công sổ văn bản mới: "${newLedger.ledger_name}"!`);
  };

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${(file.size / 1024).toFixed(1)} KB`;
    setAttachedFile({
      name: file.name,
      size: sizeStr,
    });
    showToast(`📎 Đã chọn tệp đính kèm: ${file.name} (${sizeStr})`);
  };

  const getPrefixForCategory = (cat: DocumentCategory) => {
    switch (cat) {
      case 'INBOUND': return docConfig.inbound_prefix;
      case 'OUTBOUND': return docConfig.outbound_prefix;
      case 'DECISION': return docConfig.decision_prefix;
      case 'SUBMISSION_STATEMENT': return docConfig.submission_prefix;
      case 'ANNOUNCEMENT': return docConfig.announcement_prefix;
      case 'INTERNAL_SOP': return docConfig.sop_prefix;
      case 'CONTRACT_MINUTES': return docConfig.contract_prefix;
      case 'PERIODIC_REPORT': return docConfig.report_prefix;
      default: return 'CV-GGBG';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = getPrefixForCategory(newDoc.category);
    const docCode = newDoc.document_code || `${documents.length + 101}/${prefix}`;
    const finalFileName = attachedFile ? attachedFile.name : `Van-Ban-${docCode.replace(/\//g, '-')}.pdf`;
    const finalFileSize = attachedFile ? attachedFile.size : '2.1 MB';

    const doc: OfficialDocument = {
      id: `doc_${Date.now()}`,
      document_code: docCode,
      title: newDoc.title,
      category: newDoc.category,
      issuer_org: newDoc.issuer_org,
      recipient_org: newDoc.recipient_org,
      issued_date: newDoc.issued_date,
      received_date: newDoc.received_date,
      signee_name: newDoc.signee_name,
      security_level: newDoc.security_level,
      urgency_level: newDoc.urgency_level,
      status: 'PENDING_DIRECTIVE',
      assigned_department: newDoc.assigned_department,
      assigned_assignee: newDoc.assigned_assignee,
      directive_note: newDoc.directive_note,
      sla_deadline: '2026-08-15 17:00',
      file_name: finalFileName,
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      file_size: finalFileSize,
      comments: [],
      process_logs: [
        { id: `l_${Date.now()}`, actor_name: 'Phạm Thị Lan', actor_role: 'Văn Thư', action: 'TIẾP NHẬN', note: 'Đã vào sổ văn thư điện tử', timestamp: new Date().toLocaleString('vi-VN') }
      ],
      created_at: new Date().toISOString().slice(0, 10),
    };

    const updated = addOfficialDocument(doc);
    setDocuments([...updated]);
    setIsCreateOpen(false);
    setAttachedFile(null);
    showToast(`✅ Đã vào sổ văn thư thành công: Mã số ${doc.document_code}`);
  };

  const [assignTargetType, setAssignTargetType] = useState<AssignmentTargetType>('DEPARTMENT');
  const [primaryAssigneeInput, setPrimaryAssigneeInput] = useState('Khối Kinh Doanh & TMĐT');
  const [coopAssigneesInput, setCoopAssigneesInput] = useState('Phòng Kế Toán & Tài Chính, Ban Tech');
  const [infoAssigneesInput, setInfoAssigneesInput] = useState('Khối Nhân Sự (HRM), Văn Thư');

  const handleAddDirectiveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !directiveInput) return;

    const assignmentMeta = {
      target_type: assignTargetType,
      primary_dept: assignTargetType === 'DEPARTMENT' ? primaryAssigneeInput : 'Khối Kinh Doanh & TMĐT',
      primary_assignee: assignTargetType === 'DIRECT_EMPLOYEE' ? primaryAssigneeInput : 'Đặng Tuấn Tú',
      coop_depts: assignTargetType === 'DEPARTMENT' ? coopAssigneesInput.split(',').map(s => s.trim()) : ['Phòng Kế Toán'],
      coop_assignees: assignTargetType === 'DIRECT_EMPLOYEE' ? coopAssigneesInput.split(',').map(s => s.trim()) : ['Vũ Thị Hằng'],
      info_depts: assignTargetType === 'DEPARTMENT' ? infoAssigneesInput.split(',').map(s => s.trim()) : ['Khối Nhân Sự'],
      info_assignees: assignTargetType === 'DIRECT_EMPLOYEE' ? infoAssigneesInput.split(',').map(s => s.trim()) : ['Phạm Thị Lan'],
    };

    const updatedDoc: OfficialDocument = {
      ...selectedDoc,
      directive_note: directiveInput,
      assigned_department: primaryAssigneeInput,
      assigned_assignee: assignTargetType === 'DIRECT_EMPLOYEE' ? primaryAssigneeInput : 'Đặng Tuấn Tú',
      assignment_meta: assignmentMeta,
      status: 'IN_PROCESSING',
      comments: [
        ...(selectedDoc.comments || []),
        {
          id: `c_${Date.now()}`,
          author_name: 'Nguyễn Tiến Vinh',
          author_role: 'CEO / Ban Giám Đốc',
          comment: `[Bút Phê Chỉ Đạo]: ${directiveInput} | 🔴 Xử lý chính: ${primaryAssigneeInput} | 🟡 Phối hợp: ${coopAssigneesInput} | 🔵 Nhận để biết: ${infoAssigneesInput}`,
          created_at: new Date().toLocaleString('vi-VN'),
        },
      ],
      process_logs: [
        ...(selectedDoc.process_logs || []),
        {
          id: `l_${Date.now()}`,
          actor_name: 'Nguyễn Tiến Vinh',
          actor_role: 'CEO / Ban Giám Đốc',
          action: 'BÚT PHÊ & PHÂN CÔNG 3 VAI TRÒ',
          note: `${directiveInput} (🔴 Xử lý chính: ${primaryAssigneeInput} | 🟡 Phối hợp: ${coopAssigneesInput} | 🔵 Nhận để biết: ${infoAssigneesInput})`,
          timestamp: new Date().toLocaleString('vi-VN'),
        }
      ]
    };

    const updated = updateOfficialDocument(updatedDoc);
    setDocuments([...updated]);
    setSelectedDoc(updatedDoc);
    setDirectiveInput('');
    showToast(`✍️ Đã lưu bút phê chỉ đạo và phân công 3 vai trò cho công văn ${selectedDoc.document_code}`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteOfficialDocument(id);
    setDocuments([...updated]);
    showToast('🗑️ Đã lưu trữ / xóa công văn khỏi sổ');
  };

  const handleSaveDocConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('⚙️ Đã lưu cấu hình Tiền Tố Mã Công Văn, Định Mức SLA & Cổng Ký Số Cloud HSM!');
  };

  const filteredDocs = documents.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || d.title.toLowerCase().includes(q) || d.document_code.toLowerCase().includes(q) || d.issuer_org.toLowerCase().includes(q);

    let matchesTab = true;
    if (activeTab === 'INBOUND_LEDGER') {
      matchesTab = d.category === 'INBOUND';
    } else if (activeTab === 'OUTBOUND_LEDGER') {
      matchesTab = d.category === 'OUTBOUND';
    } else if (activeTab === 'INTERNAL_LEDGER') {
      // Sổ Văn Bản Nội Bộ bao gồm Quyết Định, Tờ Trình, Thông Báo, SOP, Biên Bản, Báo Cáo
      const internalCategories: DocumentCategory[] = [
        'DECISION',
        'SUBMISSION_STATEMENT',
        'ANNOUNCEMENT',
        'INTERNAL_SOP',
        'CONTRACT_MINUTES',
        'PERIODIC_REPORT',
      ];
      const isInternal = internalCategories.includes(d.category);
      const matchesSubCat = selectedInternalCategory === 'ALL' || d.category === selectedInternalCategory;
      matchesTab = isInternal && matchesSubCat;
    } else if (activeTab === 'PENDING_DIRECTIVE') {
      matchesTab = d.status === 'PENDING_DIRECTIVE';
    } else if (activeTab === 'DIGITAL_STAMP') {
      matchesTab = !!d.has_digital_stamp;
    }

    return matchesSearch && matchesTab;
  });

  const totalInbound = documents.filter((d) => d.category === 'INBOUND').length;
  const totalOutbound = documents.filter((d) => d.category === 'OUTBOUND').length;
  const totalInternal = documents.filter((d) =>
    ['DECISION', 'SUBMISSION_STATEMENT', 'ANNOUNCEMENT', 'INTERNAL_SOP', 'CONTRACT_MINUTES', 'PERIODIC_REPORT'].includes(d.category)
  ).length;
  const totalPendingDirective = documents.filter((d) => d.status === 'PENDING_DIRECTIVE').length;
  const totalStamped = documents.filter((d) => d.has_digital_stamp).length;

  const renderCategoryLabel = (cat: DocumentCategory) => {
    switch (cat) {
      case 'INBOUND': return 'Công Văn Đến';
      case 'OUTBOUND': return 'Công Văn Đi';
      case 'DECISION': return 'Quyết Định Ban Hành';
      case 'SUBMISSION_STATEMENT': return 'Tờ Trình Nội Bộ';
      case 'ANNOUNCEMENT': return 'Thông Báo Doanh Nghiệp';
      case 'INTERNAL_SOP': return 'Quy Chế & SOP';
      case 'CONTRACT_MINUTES': return 'Hợp Đồng & Biên Bản';
      case 'PERIODIC_REPORT': return 'Báo Cáo Chuyên Đề';
      default: return cat;
    }
  };

  const renderCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'INBOUND':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">📩 Công Văn Đến</span>;
      case 'OUTBOUND':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">📤 Công Văn Đi</span>;
      case 'DECISION':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">📜 Quyết Định</span>;
      case 'SUBMISSION_STATEMENT':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px]">📋 Tờ Trình</span>;
      case 'ANNOUNCEMENT':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px]">📢 Thông Báo</span>;
      case 'INTERNAL_SOP':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">📑 Quy Chế SOP</span>;
      case 'CONTRACT_MINUTES':
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[11px]">🤝 Hợp Đồng/BB</span>;
      case 'PERIODIC_REPORT':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">📊 Báo Cáo</span>;
    }
  };

  const renderUrgencyBadge = (urg: UrgencyLevel) => {
    switch (urg) {
      case 'EXPRESS':
        return <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">🔥 HỎA TỐC</span>;
      case 'HIGHLY_URGENT':
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">⚡ THƯỢNG KHẨN</span>;
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold text-[10px]">⚠️ KHẨN</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">THƯỜNG</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Header Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Văn Bản & Công Văn Điện Tử</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Chuẩn Nghị Định 30/2020/NĐ-CP
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sổ văn thư điện tử 8 loại văn bản, Bút phê chỉ đạo Ban Giám Đốc, Ký số PKI/HSM gắn mộc đỏ doanh nghiệp & QR Tra cứu.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Vào Sổ / Phát Hành Văn Bản Mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Tổng Sổ Công Văn</span>
          <p className="text-xl font-semibold text-blue-700">{documents.length} Văn Bản</p>
          <p className="text-blue-600 font-semibold text-[11px]">📑 8 danh mục văn bản hành chính</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Chờ Ban Giám Đốc Bút Phê</span>
          <p className="text-xl font-semibold text-amber-600">{totalPendingDirective} Công Văn</p>
          <p className="text-amber-600 font-semibold text-[11px]">✍️ Cần CEO/Giám đốc chỉ đạo SLA</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Đã Ký Số & Đóng Mộc Đỏ</span>
          <p className="text-xl font-semibold text-emerald-700">{totalStamped} Văn Bản</p>
          <p className="text-emerald-600 font-semibold text-[11px]">🛡️ Xác thực VNPT/Viettel Cloud HSM</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-slate-500 uppercase text-[10.5px]">Văn Bản Nội Bộ</span>
          <p className="text-xl font-semibold text-purple-700">{totalInternal} Văn Bản</p>
          <p className="text-purple-600 font-semibold text-[11px]">⚡ Quy trình 4 bước tự động</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 text-xs font-bold">
        {/* Navigation Tabs (3 Dedicated Document Ledgers) */}
        <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('INBOUND_LEDGER')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
              activeTab === 'INBOUND_LEDGER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4 text-blue-200" /> Sổ Văn Bản Đến ({totalInbound})
          </button>

          <button
            onClick={() => setActiveTab('OUTBOUND_LEDGER')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
              activeTab === 'OUTBOUND_LEDGER' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4 text-purple-200" /> Sổ Văn Bản Đi ({totalOutbound})
          </button>

          <button
            onClick={() => setActiveTab('INTERNAL_LEDGER')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
              activeTab === 'INTERNAL_LEDGER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-200" /> Sổ Văn Bản Nội Bộ ({totalInternal})
          </button>

          <button
            onClick={() => setActiveTab('PENDING_DIRECTIVE')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
              activeTab === 'PENDING_DIRECTIVE' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-200" /> Chờ Lãnh Đạo Bút Phê ({totalPendingDirective})
          </button>

          <button
            onClick={() => setActiveTab('DIGITAL_STAMP')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
              activeTab === 'DIGITAL_STAMP' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Đã Ký Số & Mộc Đỏ ({totalStamped})
          </button>

          {canAccessSettings(activeRole) && (
            <button
              onClick={() => setActiveTab('DOC_CONFIG')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 font-bold ${
                activeTab === 'DOC_CONFIG' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-white" /> Cấu Hình Văn Thư & Ký Số
            </button>
          )}
        </div>

        {/* Sub-Category Pills for Internal Document Register */}
        {activeTab === 'INTERNAL_LEDGER' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-bold mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc Theo Loại Nội Bộ:
            </span>
            <button
              onClick={() => setSelectedInternalCategory('ALL')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'ALL' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất Cả Sổ Nội Bộ
            </button>
            <button
              onClick={() => setSelectedInternalCategory('DECISION')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'DECISION' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📜 Quyết Định
            </button>
            <button
              onClick={() => setSelectedInternalCategory('SUBMISSION_STATEMENT')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'SUBMISSION_STATEMENT' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📋 Tờ Trình
            </button>
            <button
              onClick={() => setSelectedInternalCategory('ANNOUNCEMENT')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'ANNOUNCEMENT' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📢 Thông Báo
            </button>
            <button
              onClick={() => setSelectedInternalCategory('INTERNAL_SOP')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'INTERNAL_SOP' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📑 Quy Chế & SOP
            </button>
            <button
              onClick={() => setSelectedInternalCategory('CONTRACT_MINUTES')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'CONTRACT_MINUTES' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🤝 Hợp Đồng & BB
            </button>
            <button
              onClick={() => setSelectedInternalCategory('PERIODIC_REPORT')}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                selectedInternalCategory === 'PERIODIC_REPORT' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📊 Báo Cáo Chuyên Đề
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        {activeTab !== 'DOC_CONFIG' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm số công văn, trích yếu nội dung, nơi gửi..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
              />
            </div>

            <span className="text-slate-500 font-bold">
              Hiển thị <strong className="text-slate-900">{filteredDocs.length}</strong> / {documents.length} văn bản
            </span>
          </div>
        )}

        {/* TAB CONTENT 1: LIST OF DOCUMENTS (8 TYPES) */}
        {activeTab !== 'DOC_CONFIG' && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Số / Mã Văn Bản</th>
                  <th className="py-3 px-4">Loại Văn Bản</th>
                  <th className="py-3 px-4">Trích Yếu Nội Dung</th>
                  <th className="py-3 px-4">Cơ Quan Ban Hành / Nơi Nhận</th>
                  <th className="py-3 px-4">Độ Khẩn / Mật</th>
                  <th className="py-3 px-4">Bút Phê & Phân Công</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 tabular-nums font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{doc.document_code}</span>
                        {doc.has_digital_stamp && (
                          <span title="Đã ký số & đóng mộc đỏ HSM">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{renderCategoryBadge(doc.category)}</td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2">{doc.title}</p>
                      <span className="text-[11px] text-slate-500 block mt-0.5 tabular-nums">
                        📅 Ban hành: {doc.issued_date}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{doc.issuer_org}</p>
                      <span className="text-[11px] text-slate-500 block">➡️ {doc.recipient_org}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {renderUrgencyBadge(doc.urgency_level)}
                        {doc.security_level !== 'NORMAL' && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px] block w-fit">
                            🔒 {doc.security_level === 'TOP_SECRET' ? 'TỐI MẬT' : doc.security_level === 'SECRET' ? 'MẬT' : 'BẢO MẬT'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {doc.directive_note ? (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-[11px] font-bold text-amber-900 line-clamp-2">
                            ✍️ {doc.directive_note}
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-1 font-semibold">
                            🏢 Đơn vị: {doc.assigned_department}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-bold text-[11px]">📝 Chờ CEO bút phê</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {doc.status === 'COMPLETED' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                          ✅ Hoàn Tất / Lưu Trữ
                        </span>
                      ) : doc.status === 'IN_PROCESSING' ? (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-[11px]">
                          🔄 Đang Xử Lý (SLA)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-[11px]">
                          ⏳ Chờ Chỉ Đạo
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsViewOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-bold"
                          title="Xem Chi Tiết & Bút Phê"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.has_digital_stamp && doc.qr_code_url && (
                          <a
                            href={doc.qr_code_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg font-bold"
                            title="Mã QR Tra Cứu Xác Thực Văn Bản"
                          >
                            <QrCode className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Lưu Trữ / Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB CONTENT 2: MULTI-LEDGER MANAGEMENT & SYSTEM CONFIGURATION */}
        {activeTab === 'DOC_CONFIG' && canAccessSettings(activeRole) && (
          <div className="space-y-6">
            {/* SUB-SECTION 1: MULTI-LEDGER MANAGEMENT LIST */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Quản Lý Nhiều Sổ Văn Bản Doanh Nghiệp (Multi-Ledger)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Tạo và quản lý các sổ công văn đến, sổ công văn đi và sổ văn bản nội bộ độc lập theo năm hoặc phòng ban.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateLedgerOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Thêm Sổ Văn Bản Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ledgers.map((lg) => (
                  <div key={lg.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {lg.ledger_type === 'INBOUND' ? '📩' : lg.ledger_type === 'OUTBOUND' ? '📤' : '🏢'} {lg.ledger_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lg.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {lg.is_active ? '● Đang Hoạt Động' : 'Tạm Dừng'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-normal text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>Tiền tố: <strong className="text-blue-700">{lg.prefix}</strong></div>
                      <div>Hậu tố: <strong className="text-purple-700">{lg.suffix}</strong></div>
                      <div>Số hiện tại: <strong className="text-emerald-700 tabular-nums">{lg.current_number}</strong></div>
                      <div>Quy tắc Reset: <strong className="text-amber-800">{lg.reset_frequency === 'YEARLY' ? 'Theo Năm (01/01)' : lg.reset_frequency === 'MONTHLY' ? 'Theo Tháng' : 'Liên Tục'}</strong></div>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium pt-1">
                      <span>Thời gian lưu trữ sổ: <strong className="text-slate-900">{lg.retention_period === 'PERMANENT' ? 'Vĩnh Viễn' : lg.retention_period === '10_YEARS' ? '10 Năm' : '5 Năm'}</strong></span>
                      <button
                        onClick={() => {
                          const updated = updateDocumentLedger({ ...lg, is_active: !lg.is_active });
                          setLedgers([...updated]);
                          showToast(`Đã cập nhật trạng thái sổ ${lg.ledger_name}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        {lg.is_active ? 'Đổi sang Tạm dừng' : 'Bật hoạt động'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: DETAILED FORM FOR NUMBERING, SLA, RESET & RETENTION */}
            <form onSubmit={handleSaveDocConfig} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Category Prefix & Reset Rules */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Cấu Hình Tiền Tố & Đánh Số Công Văn (NĐ 30/2020)
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="block text-slate-700 mb-1">1. Công Văn Đến (Inbound):</label>
                      <input
                        type="text"
                        value={docConfig.inbound_prefix}
                        onChange={(e) => setDocConfig({ ...docConfig, inbound_prefix: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">2. Công Văn Đi (Outbound):</label>
                      <input
                        type="text"
                        value={docConfig.outbound_prefix}
                        onChange={(e) => setDocConfig({ ...docConfig, outbound_prefix: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">3. Quyết Định (Decision):</label>
                      <input
                        type="text"
                        value={docConfig.decision_prefix}
                        onChange={(e) => setDocConfig({ ...docConfig, decision_prefix: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">4. Tờ Trình Nội Bộ:</label>
                      <input
                        type="text"
                        value={docConfig.submission_prefix}
                        onChange={(e) => setDocConfig({ ...docConfig, submission_prefix: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs font-bold text-blue-900">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="reset_yearly"
                        checked={docConfig.reset_yearly}
                        onChange={(e) => setDocConfig({ ...docConfig, reset_yearly: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <label htmlFor="reset_yearly">Tự động Reset số thứ tự tất cả sổ văn bản về 001 vào ngày 01/01 hàng năm</label>
                    </div>
                    <p className="text-[11px] text-blue-700 font-normal">
                      Quy định theo Luật Lưu trữ và Nghị định 30/2020/NĐ-CP của Chính phủ về công tác văn thư.
                    </p>
                  </div>
                </div>

                {/* Card 2: Retention Period & Digital HSM Signing */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cấu Hình Lưu Trữ Sổ & Cổng Ký Số Cloud HSM
                  </h3>

                  <div className="space-y-3 text-xs font-bold">
                    <div>
                      <label className="block text-slate-700 mb-1">Thời Gian Lưu Trữ Sổ Văn Thư Mặc Định:</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                        <option value="PERMANENT">🏛️ Lưu trữ vĩnh viễn (Quyết định, SOP, BB HĐQT)</option>
                        <option value="10_YEARS">📜 Lưu trữ 10 năm (Công văn đến/đi, Hợp đồng)</option>
                        <option value="5_YEARS">📋 Lưu trữ 5 năm (Tờ trình, Thông báo nội bộ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Nhà Cung Cấp Chứng Thư Số (CA / HSM Gateway):</label>
                      <input
                        type="text"
                        value={docConfig.cert_provider}
                        onChange={(e) => setDocConfig({ ...docConfig, cert_provider: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1">SLA Công Văn Khẩn (Giờ):</label>
                        <input
                          type="number"
                          value={docConfig.urgent_sla_hours}
                          onChange={(e) => setDocConfig({ ...docConfig, urgent_sla_hours: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">SLA Hỏa Tốc (Giờ):</label>
                        <input
                          type="number"
                          value={docConfig.express_sla_hours}
                          onChange={(e) => setDocConfig({ ...docConfig, express_sla_hours: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" /> Lưu Tất Cả Cấu Hình Văn Thư & Đa Sổ
                </button>
              </div>
            </form>
          </div>
        )}

      {/* MODAL TẠO MỚI SỔ VĂN BẢN (CREATE NEW DOCUMENT LEDGER) */}
      {isCreateLedgerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Khởi Tạo Sổ Văn Bản Mới</h3>
              </div>
              <button onClick={() => setIsCreateLedgerOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateLedgerSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-1">Tên Sổ Văn Bản *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sổ Công Văn Đến Khối Kinh Doanh 2026..."
                  value={newLedger.ledger_name}
                  onChange={(e) => setNewLedger({ ...newLedger, ledger_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phân Loại Sổ *</label>
                  <select
                    value={newLedger.ledger_type}
                    onChange={(e) => setNewLedger({ ...newLedger, ledger_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="INBOUND">📩 Sổ Công Văn Đến</option>
                    <option value="OUTBOUND">📤 Sổ Công Văn Đi</option>
                    <option value="INTERNAL">🏢 Sổ Văn Bản Nội Bộ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Tiền Tố Mã (Prefix) *</label>
                  <input
                    type="text"
                    required
                    value={newLedger.prefix}
                    onChange={(e) => setNewLedger({ ...newLedger, prefix: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Quy Tắc Reset Sổ *</label>
                  <select
                    value={newLedger.reset_frequency}
                    onChange={(e) => setNewLedger({ ...newLedger, reset_frequency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="YEARLY">Theo Năm (01/01)</option>
                    <option value="MONTHLY">Theo Tháng</option>
                    <option value="NEVER">Duy Trì Liên Tục</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Thời Gian Lưu Trữ *</label>
                  <select
                    value={newLedger.retention_period}
                    onChange={(e) => setNewLedger({ ...newLedger, retention_period: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="PERMANENT">Vĩnh Viễn</option>
                    <option value="10_YEARS">10 Năm</option>
                    <option value="5_YEARS">5 Năm</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateLedgerOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Sổ Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* MODAL VÀO SỔ / TẠO MỚI VĂN BẢN (SUPPORTING ALL 8 TYPES) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Vào Sổ / Khởi Tạo Văn Bản Mới</h3>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Loại Văn Bản (8 Danh Mục):</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as DocumentCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  >
                    <option value="INBOUND">📩 Công Văn Đến (Inbound)</option>
                    <option value="OUTBOUND">📤 Công Văn Đi (Outbound)</option>
                    <option value="DECISION">📜 Quyết Định Ban Hành (Decision)</option>
                    <option value="SUBMISSION_STATEMENT">📋 Tờ Trình Nội Bộ (Submission)</option>
                    <option value="ANNOUNCEMENT">📢 Thông Báo Doanh Nghiệp (Announcement)</option>
                    <option value="INTERNAL_SOP">📑 Quy Chế & SOP Vận Hành</option>
                    <option value="CONTRACT_MINUTES">🤝 Hợp Đồng & Biên Bản Meeting</option>
                    <option value="PERIODIC_REPORT">📊 Báo Cáo Chuyên Đề</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Số / Mã Văn Bản (Cấp Tự Động):</label>
                  <input
                    type="text"
                    placeholder={`Ví dụ: 142/${getPrefixForCategory(newDoc.category)}`}
                    value={newDoc.document_code}
                    onChange={(e) => setNewDoc({ ...newDoc, document_code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Trích Yếu Nội Dung Văn Bản:</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề hoặc trích yếu nội dung văn bản..."
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Cơ Quan / Đơn Vị Ban Hành:</label>
                  <input
                    type="text"
                    required
                    value={newDoc.issuer_org}
                    onChange={(e) => setNewDoc({ ...newDoc, issuer_org: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Nơi Nhận / Đơn Vị Tiếp Nhận:</label>
                  <input
                    type="text"
                    required
                    value={newDoc.recipient_org}
                    onChange={(e) => setNewDoc({ ...newDoc, recipient_org: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Độ Khẩn:</label>
                  <select
                    value={newDoc.urgency_level}
                    onChange={(e) => setNewDoc({ ...newDoc, urgency_level: e.target.value as UrgencyLevel })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  >
                    <option value="NORMAL">THƯỜNG</option>
                    <option value="URGENT">KHẨN (24h)</option>
                    <option value="HIGHLY_URGENT">THƯỢNG KHẨN (12h)</option>
                    <option value="EXPRESS">HỎA TỐC (4h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Độ Mật:</label>
                  <select
                    value={newDoc.security_level}
                    onChange={(e) => setNewDoc({ ...newDoc, security_level: e.target.value as SecurityLevel })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  >
                    <option value="NORMAL">THƯỜNG</option>
                    <option value="CONFIDENTIAL">BẢO MẬT</option>
                    <option value="SECRET">MẬT</option>
                    <option value="TOP_SECRET">TỐI MẬT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Đơn Vị Phụ Trách Xử Lý:</label>
                  <select
                    value={newDoc.assigned_department}
                    onChange={(e) => setNewDoc({ ...newDoc, assigned_department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl"
                  >
                    <option value="Khối Kinh Doanh & TMĐT">Khối Kinh Doanh & TMĐT</option>
                    <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
                    <option value="Phòng Kế Toán">Phòng Kế Toán & Tài Chính</option>
                    <option value="Ban Dự Án">Ban Dự Án & Tech</option>
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  </select>
                </div>
              </div>

              {/* File Attachment */}
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" /> Tệp Văn Bản Đính Kèm (PDF / Word):
                  </span>
                  <label className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer text-[11px] font-bold">
                    Chọn File PDF
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleDocFileSelect} className="hidden" />
                  </label>
                </div>
                {attachedFile && (
                  <p className="text-emerald-700 font-bold text-[11px]">
                    📄 File đã chọn: {attachedFile.name} ({attachedFile.size})
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Vào Sổ Văn Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT VĂN BẢN & BÚT PHÊ CHỈ ĐẠO BAN GIÁM ĐỐC */}
      {isViewOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto sleeker-scrollbar text-xs font-bold">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[11px] text-blue-600 uppercase font-bold block">
                  {renderCategoryLabel(selectedDoc.category)} • Số: {selectedDoc.document_code}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10.5px] uppercase block">Cơ Quan Ban Hành</span>
                <p className="text-slate-900 font-bold">{selectedDoc.issuer_org}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10.5px] uppercase block">Nơi Nhận</span>
                <p className="text-slate-900 font-bold">{selectedDoc.recipient_org}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10.5px] uppercase block">Độ Khẩn / Mật</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {renderUrgencyBadge(selectedDoc.urgency_level)}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10.5px] uppercase block">Trạng Thái Ký Số</span>
                <p className="text-emerald-700 font-bold">
                  {selectedDoc.has_digital_stamp ? '🛡️ Đã Ký Số Cloud HSM' : '📝 Bản Thảo'}
                </p>
              </div>
            </div>

            {/* Bút Phê Chỉ Đạo Section */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-amber-900 text-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" /> Bút Phê Chỉ Đạo Của Ban Giám Đốc
              </h4>

              {selectedDoc.directive_note ? (
                <p className="p-3 bg-white border border-amber-200 rounded-xl font-bold text-amber-900 leading-relaxed text-xs">
                  ✍️ {selectedDoc.directive_note}
                </p>
              ) : (
                <p className="text-slate-500 font-normal text-[11px]">Chưa có bút phê chỉ đạo cho công văn này.</p>
              )}

              <form onSubmit={handleAddDirectiveNote} className="space-y-3 pt-2 border-t border-amber-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" /> Chế Độ Phân Công Nhiệm Vụ:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignTargetType('DEPARTMENT')}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        assignTargetType === 'DEPARTMENT'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      🏢 Theo Phòng Ban / Trưởng Đơn Vị
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignTargetType('DIRECT_EMPLOYEE')}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        assignTargetType === 'DIRECT_EMPLOYEE'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      👤 Trực Tiếp Nhân Sự Cụ Thể
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                  {/* Role 1: Primary Lead */}
                  <div className="p-2.5 bg-red-50/60 border border-red-200 rounded-xl space-y-1">
                    <label className="block text-red-900 font-bold">🔴 1. Xử Lý Chính (Lead Handler) *</label>
                    <input
                      type="text"
                      required
                      value={primaryAssigneeInput}
                      onChange={(e) => setPrimaryAssigneeInput(e.target.value)}
                      placeholder={assignTargetType === 'DEPARTMENT' ? 'Nhập tên phòng ban chủ trì...' : 'Nhập tên nhân sự xử lý chính...'}
                      className="w-full px-2.5 py-1.5 bg-white border border-red-200 rounded-lg text-slate-900 text-[11px]"
                    />
                  </div>

                  {/* Role 2: Cooperating */}
                  <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                    <label className="block text-amber-900 font-bold">🟡 2. Phối Hợp Xử Lý (Cooperating)</label>
                    <input
                      type="text"
                      value={coopAssigneesInput}
                      onChange={(e) => setCoopAssigneesInput(e.target.value)}
                      placeholder="Phòng Kế Toán, Ban Tech..."
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-slate-900 text-[11px]"
                    />
                  </div>

                  {/* Role 3: Info Only */}
                  <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                    <label className="block text-blue-900 font-bold">🔵 3. Nhận Để Biết / Báo Cáo (Info Only)</label>
                    <input
                      type="text"
                      value={infoAssigneesInput}
                      onChange={(e) => setInfoAssigneesInput(e.target.value)}
                      placeholder="Khối Nhân Sự, Văn Thư..."
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-slate-900 text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 font-bold mb-1">Bút Phê Chỉ Đạo Cụ Thể Ban Giám Đốc *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập nội dung chỉ đạo thực hiện và mốc thời gian hoàn thành..."
                    value={directiveInput}
                    onChange={(e) => setDirectiveInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> Lưu Bút Phê & Phân Công 3 Vai Trò
                  </button>
                </div>
              </form>
            </div>

            {/* Timeline Process Logs */}
            {selectedDoc.process_logs && selectedDoc.process_logs.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Nhật Ký Xử Lý Xuyên Suốt Luồng Công Văn:
                </h4>
                <div className="space-y-2">
                  {selectedDoc.process_logs.map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-50 border rounded-xl flex items-start justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-blue-700">[{log.action}]</span> <span className="font-bold text-slate-900">{log.actor_name}</span> ({log.actor_role})
                        <p className="text-slate-600 font-normal mt-0.5">{log.note}</p>
                      </div>
                      <span className="text-slate-400 tabular-nums font-normal shrink-0 ml-2">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4 Signature Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedDoc(selectedDoc);
                    setIsSignModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                >
                  ✍️ Ký Nháy
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc(selectedDoc);
                    setIsSignModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                >
                  📋 Ký Trình
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc(selectedDoc);
                    setIsSignModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-md shadow-purple-600/30 transition-all active:scale-95"
                >
                  📜 CEO Ký Phê Duyệt
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc(selectedDoc);
                    setIsSignModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-md shadow-red-600/30 transition-all active:scale-95"
                >
                  🛡️ Ký Đóng Dấu Mộc Đỏ
                </button>
              </div>

              <button
                onClick={() => setIsViewOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl shrink-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TRÌNH KÝ SỐ ĐIỆN TỬ PKI/HSM CLOUD (SUPPORTING 4 LEGAL SIGNATURE TYPES) */}
      {selectedDoc && (
        <DigitalSignatureModal
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          documentCode={selectedDoc.document_code}
          documentTitle={selectedDoc.title}
          signerName="Nguyễn Tiến Vinh"
          signerRole="CEO / Ban Giám Đốc"
          defaultSignatureType="APPROVAL"
          onSignComplete={(sig) => {
            const sigTypeLabel =
              sig.signature_type === 'MARGINAL'
                ? 'Ký Nháy (Marginal)'
                : sig.signature_type === 'SUBMISSION'
                ? 'Ký Trình (Submission)'
                : sig.signature_type === 'APPROVAL'
                ? 'Ký Phê Duyệt (Executive Approval)'
                : 'Ký Đóng Dấu Mộc Đỏ (Official Seal)';

            const newLog = {
              id: `l_${Date.now()}`,
              actor_name: sig.signer_name,
              actor_role: sig.signer_role,
              action: `KÝ SỐ: ${sigTypeLabel}`,
              note: `Đã đóng chữ ký số điện tử. Hash SHA-256: ${sig.sha256_hash.slice(0, 20)}...`,
              timestamp: sig.signed_at,
            };

            const updated: OfficialDocument = {
              ...selectedDoc,
              has_digital_stamp: sig.seal_applied || selectedDoc.has_digital_stamp,
              stamped_at: sig.seal_applied ? sig.signed_at : selectedDoc.stamped_at,
              qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedDoc.document_code)}`,
              directive_note:
                (selectedDoc.directive_note ? selectedDoc.directive_note + ' | ' : '') +
                `[Chữ ký số: ${sigTypeLabel} • ${sig.sha256_hash.slice(0, 16)}...]`,
              process_logs: [...(selectedDoc.process_logs || []), newLog],
            };

            updateOfficialDocument(updated);
            setSelectedDoc(updated);
            setDocuments(getOfficialDocuments());
            showToast(
              `✍️ Đã ký số [${sigTypeLabel}] thành công cho văn bản ${selectedDoc.document_code}! SHA-256: ${sig.sha256_hash.slice(0, 18)}...`
            );
          }}
        />
      )}
    </div>
  );
}
