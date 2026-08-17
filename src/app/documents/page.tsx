'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  Award,
  ExternalLink
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
import ExternalSignModal from '@/components/documents/ExternalSignModal';
import DocumentOverviewDashboard from '@/components/documents/DocumentOverviewDashboard';
import { exportDocumentsToCSV } from '@/lib/excelExportHelper';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ModuleBanner } from '@/components/ui';

function DocumentsContent() {
  const { user, simulatedRole } = useAuth();
  const activeRole = simulatedRole || user?.role || 'SALE_EXEC';
  const searchParams = useSearchParams();

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => getOfficialDocuments());
  const [ledgers, setLedgers] = useState<DocumentLedgerConfig[]>(() => getDocumentLedgers());
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INBOUND' | 'OUTBOUND' | 'INTERNAL_SOP' | 'DIRECTIVE_LOG' | 'DOC_CONFIG'>('OVERVIEW');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (!tab || tab === 'overview') setActiveTab('OVERVIEW');
    else if (tab === 'list' || tab === 'inbound') setActiveTab('INBOUND');
    else if (tab === 'dispatch' || tab === 'outbound') setActiveTab('OUTBOUND');
    else if (tab === 'digital_sign' || tab === 'doc_config') setActiveTab('DOC_CONFIG');
    else if (tab === 'audit_log' || tab === 'directive_log') setActiveTab('DIRECTIVE_LOG');
    else if (tab === 'internal_sop') setActiveTab('INTERNAL_SOP');
  }, [searchParams]);
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
  const [isExternalSignOpen, setIsExternalSignOpen] = useState(false);
  const [directiveInput, setDirectiveInput] = useState('');
  const [assigneeDeptInput, setAssigneeDeptInput] = useState('Khối Kinh Doanh & TMĐT');

  const handleExportExcel = () => {
    const title =
      activeTab === 'INBOUND'
        ? 'So_Van_Ban_Den_2026'
        : activeTab === 'OUTBOUND'
        ? 'So_Van_Ban_Di_2026'
        : 'So_Van_Ban_Noi_Bo_2026';
    exportDocumentsToCSV(filteredDocs, title);
    showToast(`📊 Đã xuất thành công dữ liệu Sổ Văn Bản ra tệp Excel CSV chuẩn NĐ 30/2020!`);
  };

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
    showToast(` Đã vào sổ công văn mới thành công: Số ${doc.document_code}`);
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
    showToast(` Đã cập nhật bút phê chỉ đạo của Ban Giám Đốc cho công văn ${selectedDoc.document_code}`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteOfficialDocument(id);
    setDocuments([...updated]);
    showToast('🗑 Đã lưu trữ / xóa công văn khỏi sổ');
  };

  const handleSaveDocConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('⚙️ Đã lưu cấu hình Tiền Tố Mã Công Văn, Định Mức SLA & Cổng Ký Số Cloud HSM!');
  };

  const filteredDocs = documents.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || d.title.toLowerCase().includes(q) || d.document_code.toLowerCase().includes(q) || d.issuer_org.toLowerCase().includes(q);

    let matchesTab = true;
    if (activeTab === 'INBOUND') {
      matchesTab = d.category === 'INBOUND';
    } else if (activeTab === 'OUTBOUND') {
      matchesTab = d.category === 'OUTBOUND';
    } else if (activeTab === 'INTERNAL_SOP') {
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
    } else if (activeTab === 'DIRECTIVE_LOG') {
      matchesTab = d.status === 'PENDING_DIRECTIVE' || !!d.directive_note;
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

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"> <Sparkles className="w-4 h-4 text-blue-400" /> {toastMsg} </div> )}

      {/* HEADER BANNER - THEO CHUẨN DASHBOARD */}
      <ModuleBanner
        badge={{
          label: 'Hệ Thống Quản Trị Văn Bản & Ký Số Điện Tử',
          icon: FileText,
          variant: 'blue',
        }}
        title="Quản Lý Hồ Sơ, Văn Bản & Trình Ký Số"
        subtitle="Quản lý Sổ Công văn Đến / Đi, phân loại Mật/Khẩn, quy trình ký số HSM & Bút phê chỉ đạo Ban Giám Đốc"
        kpis={[
          { label: 'Tổng Số Văn Bản', value: `${documents.length} Văn Bản`, subtext: `Đã đóng dấu: ${totalStamped}` },
          { label: 'Chờ Bút Phê', value: `${totalPendingDirective} Văn Bản`, subtext: 'Cần Ban GĐ xử lý' },
          { label: 'SOP & Quy Chế', value: `${totalInternal} Quy Trình`, subtext: 'Vận hành chuẩn hóa' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất Sổ CSV</span>
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tiếp Nhận / Phát Hành</span>
            </button>
          </div>
        }
      />

      {/* NỘI DUNG SỔ VĂN THƯ (HIỂN THỊ FULL-WIDTH THEO ĐIỀU HƯỚNG SIDEBAR CHÍNH) */}
      <div className="space-y-6">
        {activeTab === 'OVERVIEW' ? (
          <DocumentOverviewDashboard
            documents={documents}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCreate={() => setIsCreateOpen(true)}
            onViewDoc={(doc) => {
              setSelectedDoc(doc);
              setIsViewOpen(true);
            }}
          />
        ) : activeTab !== 'DOC_CONFIG' ? (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm số công văn, trích yếu, nơi gửi..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium shrink-0 tabular-nums">
                Hiển thị <strong className="text-slate-900 dark:text-white">{filteredDocs.length}</strong> văn bản
              </span>
            </div>

            {/* Document Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">Số & Ngày Công Văn</th>
                      <th className="p-3.5">Trích Yếu Nội Dung Văn Bản</th>
                      <th className="p-3.5">Cơ Quan Ban Hành / Nơi Gửi</th>
                      <th className="p-3.5 text-center">Độ Mật & Độ Khẩn</th>
                      <th className="p-3.5">Đơn Vị Chủ Trì Xử Lý</th>
                      <th className="p-3.5 text-center">Trạng Thái</th>
                      <th className="p-3.5 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <p className="font-mono font-semibold text-blue-700 dark:text-blue-400 text-xs">{doc.document_code}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">📅 {doc.received_date || doc.issued_date}</p>
                        </td>
                        <td className="p-3.5 max-w-md">
                          <p className="font-semibold text-slate-900 dark:text-white text-xs leading-snug line-clamp-2">{doc.title}</p>
                          {doc.directive_note && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200 dark:border-amber-800 mt-1 font-medium">
                              Bút phê: {doc.directive_note}
                            </p>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          {doc.issuer_org}
                          <span className="block text-[10.5px] text-slate-500 font-normal">Ký bởi: {doc.signee_name}</span>
                        </td>
                        <td className="p-3.5 text-center space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold block ${
                            doc.security_level === 'CONFIDENTIAL' ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            🔒 {doc.security_level === 'CONFIDENTIAL' ? 'Bảo Mật' : 'Công Khai'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold block ${
                            doc.urgency_level === 'HIGHLY_URGENT' || doc.urgency_level === 'EXPRESS'
                              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800 animate-pulse'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            ⚡ {doc.urgency_level === 'HIGHLY_URGENT' ? 'Thượng Khẩn' : doc.urgency_level === 'URGENT' ? 'Khẩn' : 'Thường'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{doc.assigned_department}</p>
                          <p className="text-[11px] text-slate-500">👤 {doc.assigned_assignee}</p>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-medium text-[10.5px] border ${
                            doc.status === 'PENDING_DIRECTIVE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                              : doc.status === 'IN_PROCESSING'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                          }`}>
                            {doc.status === 'PENDING_DIRECTIVE' ? '⏳ Chờ Bút Phê' : doc.status === 'IN_PROCESSING' ? '🔵 Đang Xử Lý' : '✓ Hoàn Thành'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsViewOpen(true);
                              }}
                              className="p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-all"
                              title="Xem File & Bút Phê"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1.5 bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-lg hover:bg-red-100 transition-all"
                              title="Xóa / Lưu Trữ"
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
          </div>
        ) : (
          /* TAB 5: CONFIGURATION PANEL */
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-6 text-xs font-medium shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Cấu Hình Sổ Văn Bản, Mã Ký Hiệu & Chứng Thư Số
                </h3>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Thiết lập tiền tố mã ký hiệu tự động, hạn xử lý công văn khẩn SLA & thông số Chứng thư chữ ký số PKI.
                </p>
              </div>
              <button
                onClick={() => showToast('💾 Đã lưu thành công cấu hình sổ công văn & ký số!')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình Văn Bản</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Cấu hình Đánh Số Công Văn */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. Cấu Hình Đánh Số Công Văn Tự Động
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Tiền tố Công Văn Đi *</label>
                    <input
                      type="text"
                      value={docConfig.outbound_prefix}
                      onChange={(e) => setDocConfig({ ...docConfig, outbound_prefix: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-blue-700 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Tiền tố Công Văn Đến *</label>
                    <input
                      type="text"
                      value={docConfig.inbound_prefix}
                      onChange={(e) => setDocConfig({ ...docConfig, inbound_prefix: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-blue-700 dark:text-blue-400"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Reset số công văn về 001 hàng năm:</span>
                  <input
                    type="checkbox"
                    checked={docConfig.reset_yearly}
                    onChange={(e) => setDocConfig({ ...docConfig, reset_yearly: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </div>
              </div>

              {/* Box 2: Cấu hình Hạn Xử Lý SLA */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  2. Cấu Hình Thời Hạn Xử Lý SLA (Giờ)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Công Văn Thượng Khẩn (Giờ) *</label>
                    <input
                      type="number"
                      value={docConfig.urgent_sla_hours}
                      onChange={(e) => setDocConfig({ ...docConfig, urgent_sla_hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-red-700 dark:text-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Công Văn Hỏa Tốc (Giờ) *</label>
                    <input
                      type="number"
                      value={docConfig.express_sla_hours}
                      onChange={(e) => setDocConfig({ ...docConfig, express_sla_hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-red-700 dark:text-red-400"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Tự động đóng Dấu Mộc Đỏ sau khi ký số:</span>
                  <input
                    type="checkbox"
                    checked={docConfig.auto_digital_seal}
                    onChange={(e) => setDocConfig({ ...docConfig, auto_digital_seal: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TIẾP NHẬN / PHÁT HÀNH CÔNG VĂN MỚI */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Tiếp Nhận / Phát Hành Văn Bản Mới
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">Loại Công Văn *</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as DocumentCategory })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="INBOUND">📥 Công Văn Đến (Gửi từ Cơ quan / Đối tác bên ngoài)</option>
                  <option value="OUTBOUND"> Công Văn Đi (GGBG CRM phát hành ra bên ngoài)</option>
                  <option value="INTERNAL_SOP"> Văn Bản Nội Bộ (Quy chế, Quy trình SOP)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Số / Mã Ký Hiệu Công Văn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 142/CV-BCT hoặc 88/QĐ-GGBG..."
                  value={newDoc.document_code}
                  onChange={(e) => setNewDoc({ ...newDoc, document_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-blue-700"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Trích Yếu Nội Dung Văn Bản *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nhập nội dung trích yếu của công văn..."
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Cơ Quan / Nơi Ban Hành *</label>
                  <input
                    type="text"
                    required
                    value={newDoc.issuer_org}
                    onChange={(e) => setNewDoc({ ...newDoc, issuer_org: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Người Ký Văn Bản *</label>
                  <input
                    type="text"
                    required
                    value={newDoc.signee_name}
                    onChange={(e) => setNewDoc({ ...newDoc, signee_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Mức Độ Bảo Mật</label>
                  <select
                    value={newDoc.security_level}
                    onChange={(e) => setNewDoc({ ...newDoc, security_level: e.target.value as SecurityLevel })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="NORMAL">Thường (Công khai)</option>
                    <option value="CONFIDENTIAL">🔒 Bảo Mật Nội Bộ</option>
                    <option value="SECRET">🔒 Mật</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Mức Độ Ưu Tiên / Khẩn</label>
                  <select
                    value={newDoc.urgency_level}
                    onChange={(e) => setNewDoc({ ...newDoc, urgency_level: e.target.value as UrgencyLevel })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="NORMAL">Thường</option>
                    <option value="URGENT">Khẩn</option>
                    <option value="HIGHLY_URGENT">⚡ Thượng Khẩn (Trong ngày)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Phòng Ban Phụ Trách *</label>
                  <select
                    value={newDoc.assigned_department}
                    onChange={(e) => setNewDoc({ ...newDoc, assigned_department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Khối Kinh Doanh & TMĐT">Khối Kinh Doanh & TMĐT</option>
                    <option value="Phòng Vận Hành TMĐT">Phòng Vận Hành TMĐT</option>
                    <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
                    <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Cán Bộ Chủ Trì *</label>
                  <input
                    type="text"
                    required
                    value={newDoc.assigned_assignee}
                    onChange={(e) => setNewDoc({ ...newDoc, assigned_assignee: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateLedgerOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Vào Sổ Văn Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM VĂN BẢN, PDF VIEWER & BÚT PHÊ GIÁM ĐỐC */}
      {isViewOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4 text-xs font-medium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-700">{selectedDoc.document_code}</span>
                <h3 className="font-semibold text-sm text-slate-900">Chi Tiết Văn Bản & Bút Phê Chỉ Đạo</h3>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm leading-snug">{selectedDoc.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium pt-2 border-t border-slate-200/80">
                <p>Nơi ban hành: <strong className="text-slate-900">{selectedDoc.issuer_org}</strong></p>
                <p>Người ký: <strong className="text-slate-900">{selectedDoc.signee_name}</strong></p>
                <p>Đơn vị xử lý: <strong className="text-slate-900">{selectedDoc.assigned_department}</strong></p>
                <p>Cán bộ chủ trì: <strong className="text-blue-700 font-semibold">{selectedDoc.assigned_assignee}</strong></p>
              </div>
            </div>
            {/* Direct File Attachment Viewer Card */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-medium">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedDoc.file_name || 'Văn-Bản-Dinh-Kem.pdf'}</p>
                  <p className="text-[11px] text-slate-500 font-normal">Dung lượng: {selectedDoc.file_size || '2.1 MB'} • Định dạng tệp PDF</p>
                </div>
              </div>
              <a
                href={selectedDoc.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-[11px] flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Xem / Tải File PDF
              </a>
            </div>
            {/* Digital Red Stamp Seal Badge */}
            <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center font-semibold text-xs uppercase tracking-wider rotate-[-12deg] bg-white shadow-sm">
                  GGBG
                </div>
                <div>
                  <p className="font-semibold text-red-900">
                    {selectedDoc.has_digital_stamp ? '🔴 Dấu Mộc Đỏ Điện Tử: ĐÃ ĐÓNG DẤU CHÍNH THỨC' : '⚪ Dấu Mộc Điện Tử: CHƯA ĐÓNG DẤU MỘC'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {selectedDoc.has_digital_stamp ? `Phát hành & xác thực ngày ${selectedDoc.stamped_at || selectedDoc.issued_date}` : 'Văn bản dự thảo chờ Giám đốc đóng dấu mộc'}
                  </p>
                </div>
              </div>
              {!selectedDoc.has_digital_stamp && (
                <button
                  onClick={() => {
                    const updated = {
                      ...selectedDoc,
                      has_digital_stamp: true,
                      stamped_at: new Date().toLocaleString('vi-VN'),
                    };
                    updateOfficialDocument(updated);
                    setSelectedDoc(updated);
                    setDocuments(getOfficialDocuments());
                    showToast(`🔴 Đã đóng dấu mộc đỏ điện tử chính thức cho văn bản ${selectedDoc.document_code}`);
                  }}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-[11px] flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all active:scale-95 shrink-0"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Đóng Dấu Mộc Đỏ
                </button>
              )}
            </div>
            {/* Bút Phê Chỉ Đạo Section */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
              <h4 className="font-semibold text-amber-900 text-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                Bút Phê Chỉ Đạo Của Ban Giám Đốc
              </h4>
              {selectedDoc.directive_note ? (
                <p className="p-3 bg-white border border-amber-200 rounded-xl font-semibold text-amber-900 leading-relaxed text-xs">
                  {selectedDoc.directive_note}
                </p>
              ) : (
                <p className="text-slate-500 font-normal text-[11px]">Chưa có bút phê chỉ đạo cho công văn này.</p>
              )}
              <form onSubmit={handleAddDirectiveNote} className="space-y-2 pt-2">
                <label className="block text-slate-700 font-medium">Cập Nhật Bút Phê Chỉ Đạo Mới (CEO / Director):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nhập nội dung chỉ đạo thực hiện và mốc thời gian hoàn thành..."
                    value={directiveInput}
                    onChange={(e) => setDirectiveInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md shrink-0"
                  >
                    Lưu Bút Phê
                  </button>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsSignModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                Trình Ký Số Điện Tử (E-Sign)
              </button>
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TRÌNH KÝ SỐ ĐIỆN TỬ */}
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
            showToast(` Đã ký số điện tử thành công cho văn bản ${selectedDoc.document_code}! Mã Checksum: ${sig.sha256_hash.slice(0, 18)}...`);
          }}
        />
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs font-medium text-slate-400">Đang tải phân hệ Quản Lý Văn Bản...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
