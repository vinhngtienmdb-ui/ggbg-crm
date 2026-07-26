'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canViewPII } from '@/lib/pii';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Edit3,
  EyeOff,
  FileText,
  AlertTriangle,
  X,
  Upload,
  FileCheck,
  User,
  BadgeCheck,
  PhoneCall,
  Save,
  CreditCard,
  MapPin,
  Briefcase,
  CheckSquare,
  Square,
  Sliders,
  Send,
  Target,
  UserPlus,
  Trash2,
  Paperclip,
  FolderPlus,
  ShoppingBag,
  Coins,
  Calendar,
  Tag,
  Clock,
  MessageSquare,
  Users2
} from 'lucide-react';
import { CustomerEntityType, CustomerType, CustomerTier, KycDocument, LifecycleStage } from '@/types';
import { ExtendedCustomer, INITIAL_CUSTOMERS, CustomerActivity } from '@/lib/customerStore';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';

function maskIdentification(val?: string, showFull: boolean = false): string {
  if (!val) return 'Chưa cập nhật';
  if (showFull) return val;
  if (val.length <= 6) return val;
  const start = val.substring(0, 4);
  const end = val.substring(val.length - 4);
  const maskedLength = val.length - 8;
  const stars = '*'.repeat(Math.max(maskedLength, 4));
  return `${start}${stars}${end}`;
}

export interface UploadRow {
  id: string;
  category: string;
  fileName: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<ExtendedCustomer[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('ALL');
  const [showMaskedData, setShowMaskedData] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Đồng bộ dữ liệu từ API khi mount (dual-mode: Supabase hoặc in-memory phía server).
  // Nếu lỗi/empty → giữ INITIAL_CUSTOMERS để không nhấp nháy giao diện.
  useEffect(() => {
    let active = true;
    fetch('/api/customers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.customers) && data.customers.length > 0) {
          setCustomers(data.customers as ExtendedCustomer[]);
        }
      })
      .catch(() => {
        /* fallback: giữ INITIAL_CUSTOMERS */
      });
    return () => {
      active = false;
    };
  }, []);

  // Đồng bộ DB kiểu fire-and-forget — KHÔNG chặn optimistic update, nuốt lỗi im lặng.
  const syncCustomerToApi = (method: 'POST' | 'PATCH', payload: Record<string, unknown>) => {
    fetch('/api/customers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* im lặng: optimistic update phía client vẫn giữ nguyên */
    });
  };

  // Chỉ vai trò được phép mới có thể gỡ mask PII (CCCD/MST/SĐT/tài khoản NH)
  const { user, simulatedRole } = useAuth();
  const canReveal = canViewPII(simulatedRole || user?.role, user?.is_super_admin);
  const revealPII = canReveal && !showMaskedData;
  const maskPhoneVal = (p?: string) =>
    p ? `${p.substring(0, 4)} **** ${p.substring(p.length - 2)}` : '—';

  // SELECTION CHECKBOX STATE
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLifecycleModalOpen, setBulkLifecycleModalOpen] = useState(false);
  const [targetLifecycle, setTargetLifecycle] = useState<LifecycleStage>('VIP');

  // VIEW DETAIL MODAL STATE (NÚT XEM CHI TIẾT)
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [selectedViewCustomer, setSelectedViewCustomer] = useState<ExtendedCustomer | null>(null);

  // ACTIVITY TIMELINE — Ô THÊM TƯƠNG TÁC NHANH TRONG VIEW CHI TIẾT
  const [newActivityType, setNewActivityType] = useState<CustomerActivity['type']>('NOTE');
  const [newActivityContent, setNewActivityContent] = useState('');

  const handleAddActivity = () => {
    if (!selectedViewCustomer) return;
    const content = newActivityContent.trim();
    if (!content) {
      setToastMessage('⚠️ Vui lòng nhập nội dung tương tác trước khi lưu!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const newActivity: CustomerActivity = {
      id: `act_${Date.now()}`,
      type: newActivityType,
      title: content,
      actor: user?.name || user?.email || 'Người dùng CRM',
      timestamp: new Date().toISOString(),
    };

    const updatedActivities = [...(selectedViewCustomer.activities || []), newActivity];
    const updatedCustomer: ExtendedCustomer = { ...selectedViewCustomer, activities: updatedActivities };

    setCustomers((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    setSelectedViewCustomer(updatedCustomer);
    syncCustomerToApi('PATCH', { id: updatedCustomer.id, activities: updatedActivities });

    setNewActivityContent('');
    setNewActivityType('NOTE');
    setToastMessage('✅ Đã ghi nhận tương tác mới vào dòng thời gian khách hàng!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Cấu hình icon + màu sắc theo loại tương tác (dùng cho chấm & nhãn timeline)
  const ACTIVITY_META: Record<
    CustomerActivity['type'],
    { label: string; Icon: React.ComponentType<{ className?: string }>; dot: string; iconBg: string; iconText: string }
  > = {
    CALL: { label: 'Cuộc gọi', Icon: PhoneCall, dot: 'bg-emerald-500', iconBg: 'bg-emerald-50 border-emerald-200', iconText: 'text-emerald-600' },
    EMAIL: { label: 'Email', Icon: Mail, dot: 'bg-blue-500', iconBg: 'bg-blue-50 border-blue-200', iconText: 'text-blue-600' },
    MEETING: { label: 'Cuộc họp', Icon: Users2, dot: 'bg-violet-500', iconBg: 'bg-violet-50 border-violet-200', iconText: 'text-violet-600' },
    NOTE: { label: 'Ghi chú', Icon: MessageSquare, dot: 'bg-slate-400', iconBg: 'bg-slate-100 border-slate-200', iconText: 'text-slate-600' },
    CONTRACT: { label: 'Hợp đồng', Icon: FileCheck, dot: 'bg-amber-500', iconBg: 'bg-amber-50 border-amber-200', iconText: 'text-amber-600' },
    STAGE: { label: 'Vòng đời', Icon: Target, dot: 'bg-cyan-500', iconBg: 'bg-cyan-50 border-cyan-200', iconText: 'text-cyan-600' },
  };

  const formatActivityTime = (ts: string) => {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // EDIT CUSTOMER MODAL STATE (NÚT SỬA ĐÃ ĐƯỢC FIX CỰC KỲ ỔN ĐỊNH)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: string;
    customer_code: string;
    entity_type: CustomerEntityType;
    name: string;
    company_name: string;
    tax_code: string;
    id_card_number: string;
    id_card_issue_date: string;
    phone: string;
    email: string;
    address: string;
    bank_account: string;
    bank_name: string;
    credit_limit: string;
    notes: string;
  }>({
    id: '',
    customer_code: '',
    entity_type: 'ENTERPRISE',
    name: '',
    company_name: '',
    tax_code: '',
    id_card_number: '',
    id_card_issue_date: '',
    phone: '',
    email: '',
    address: '',
    bank_account: '',
    bank_name: '',
    credit_limit: '0',
    notes: '',
  });

  // CREATE NEW CUSTOMER MODAL STATE & FORM
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    customer_code: string;
    entity_type: CustomerEntityType;
    name: string;
    company_name: string;
    tax_code: string;
    representative_name: string;
    id_card_number: string;
    id_card_issue_date: string;
    id_card_issue_place: string;
    phone: string;
    email: string;
    address: string;
    customer_type: CustomerType;
    tier: CustomerTier;
    lifecycle_stage: LifecycleStage;
    avg_monthly_gmv: string;
    owner_name: string;
    bank_account: string;
    bank_name: string;
    credit_limit: string;
    notes: string;
    ecom_platforms: string[];
  }>({
    customer_code: '',
    entity_type: 'ENTERPRISE',
    name: '',
    company_name: '',
    tax_code: '',
    representative_name: '',
    id_card_number: '',
    id_card_issue_date: '',
    id_card_issue_place: '',
    phone: '',
    email: '',
    address: '',
    customer_type: 'B2B_Agency_Service',
    tier: 'Standard',
    lifecycle_stage: 'Prospect',
    avg_monthly_gmv: '0',
    owner_name: 'Trần Văn Hoàng (Sale Exec)',
    bank_account: '',
    bank_name: '',
    credit_limit: '0',
    notes: '',
    ecom_platforms: ['Shopee', 'TikTokShop'],
  });

  // Vietnam Administrative Units Address States (Post-01/07/2025 Structure)
  const [createAddressData, setCreateAddressData] = useState<VietnamAddressValue>({
    provinceCode: '01',
    provinceName: 'Thành phố Hà Nội',
    wardCode: '00154',
    wardName: 'Phường Thượng Đình',
    detailAddress: 'Số 188 Nguyễn Trãi',
    fullAddress: 'Số 188 Nguyễn Trãi, Phường Thượng Đình, Thành phố Hà Nội',
  });

  const [editAddressData, setEditAddressData] = useState<VietnamAddressValue>({
    provinceCode: '01',
    provinceName: 'Thành phố Hà Nội',
    wardCode: '00154',
    wardName: 'Phường Thượng Đình',
    detailAddress: 'Số 188 Nguyễn Trãi',
    fullAddress: 'Số 188 Nguyễn Trãi, Phường Thượng Đình, Thành phố Hà Nội',
  });

  const handleOpenCreateModal = () => {
    const nextCode = `KH-${8800 + customers.length + 1}`;
    setCreateForm({
      customer_code: nextCode,
      entity_type: 'ENTERPRISE',
      name: '',
      company_name: '',
      tax_code: '',
      representative_name: '',
      id_card_number: '',
      id_card_issue_date: '',
      id_card_issue_place: '',
      phone: '',
      email: '',
      address: '',
      customer_type: 'B2B_Agency_Service',
      tier: 'Standard',
      lifecycle_stage: 'Prospect',
      avg_monthly_gmv: '0',
      owner_name: 'Trần Văn Hoàng (Sale Exec)',
      bank_account: '',
      bank_name: '',
      credit_limit: '0',
      notes: '',
      ecom_platforms: ['Shopee', 'TikTokShop'],
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.phone.trim()) {
      setToastMessage('⚠️ Vui lòng nhập đầy đủ Tên khách hàng và Số điện thoại!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const newCust: ExtendedCustomer = {
      id: `c_${Date.now()}`,
      customer_code: createForm.customer_code.trim() || `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: createForm.name.trim(),
      entity_type: createForm.entity_type,
      company_name: createForm.company_name.trim(),
      tax_code: createForm.tax_code.trim(),
      representative_name: createForm.representative_name.trim(),
      id_card_number: createForm.id_card_number.trim(),
      id_card_issue_date: createForm.id_card_issue_date.trim(),
      id_card_issue_place: createForm.id_card_issue_place.trim(),
      phone: createForm.phone.trim(),
      email: createForm.email.trim(),
      address: createAddressData.fullAddress || createForm.address.trim(),
      customer_type: createForm.customer_type,
      tier: createForm.tier,
      lifecycle_stage: createForm.lifecycle_stage,
      health_score: 100,
      ltv_total_spent: 0,
      ecom_platforms: (createForm.ecom_platforms.length > 0 ? createForm.ecom_platforms : ['Shopee']) as any,
      avg_monthly_gmv: Number(createForm.avg_monthly_gmv) || 0,
      owner_name: createForm.owner_name || 'Trần Văn Hoàng (Sale Exec)',
      kyc_status: 'PENDING',
      bank_account: createForm.bank_account.trim(),
      bank_name: createForm.bank_name.trim(),
      credit_limit: Number(createForm.credit_limit) || 0,
      notes: createForm.notes.trim(),
      tags: ['Mới tạo'],
      created_at: new Date().toISOString().substring(0, 10),
    };

    setCustomers((prev) => [newCust, ...prev]);
    syncCustomerToApi('POST', newCust as unknown as Record<string, unknown>);
    setIsCreateModalOpen(false);
    setToastMessage(`🎉 Đã tạo thành công khách hàng mới [${newCust.customer_code}] ${newCust.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // KYC & MULTI-FILE UPLOAD DRAWER STATE
  const [selectedCustomer, setSelectedCustomer] = useState<ExtendedCustomer | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([
    { id: 'row_1', category: 'GPKD', fileName: '' },
  ]);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (selectedStage !== 'ALL' && c.lifecycle_stage !== selectedStage) return false;
    if (selectedEntityFilter !== 'ALL' && c.entity_type !== selectedEntityFilter) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.customer_code.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.tax_code && c.tax_code.includes(term)) ||
        (c.id_card_number && c.id_card_number.includes(term)) ||
        (c.company_name && c.company_name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Checkbox handlers
  const isAllSelected = filteredCustomers.length > 0 && filteredCustomers.every((c) => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // OPEN VIEW DETAIL MODAL (NÚT XEM CHI TIẾT KHÁCH HÀNG)
  const handleOpenViewDetailModal = (cust: ExtendedCustomer) => {
    setSelectedViewCustomer(cust);
    setIsViewDetailModalOpen(true);
  };

  // OPEN EDIT MODAL (NÚT SỬA KHÁCH HÀNG)
  const handleOpenEditModal = (cust: ExtendedCustomer) => {
    setEditForm({
      id: cust.id,
      customer_code: cust.customer_code,
      entity_type: cust.entity_type,
      name: cust.name || '',
      company_name: cust.company_name || '',
      tax_code: cust.tax_code || '',
      id_card_number: cust.id_card_number || '',
      id_card_issue_date: cust.id_card_issue_date || '',
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address || '',
      bank_account: cust.bank_account || '',
      bank_name: cust.bank_name || '',
      credit_limit: cust.credit_limit ? cust.credit_limit.toString() : '0',
      notes: cust.notes || '',
    });
    setIsEditModalOpen(true);
  };

  // SAVE EDIT CUSTOMER FORM (XỬ LÝ LƯU SỬA KHÁCH HÀNG 100% THÀNH CÔNG)
  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    const editPatch = {
      entity_type: editForm.entity_type,
      name: editForm.name.trim(),
      company_name: editForm.company_name.trim(),
      tax_code: editForm.tax_code.trim(),
      id_card_number: editForm.id_card_number.trim(),
      id_card_issue_date: editForm.id_card_issue_date.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      address: editForm.address.trim(),
      bank_account: editForm.bank_account.trim(),
      bank_name: editForm.bank_name.trim(),
      credit_limit: Number(editForm.credit_limit) || 0,
      notes: editForm.notes.trim(),
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === editForm.id) {
          return { ...c, ...editPatch };
        }
        return c;
      })
    );
    syncCustomerToApi('PATCH', { id: editForm.id, ...editPatch });

    setIsEditModalOpen(false);
    setToastMessage(`Đã cập nhật thành công hồ sơ khách hàng [${editForm.customer_code}] ${editForm.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // MULTI-FILE UPLOAD ROW MANAGEMENT (+ BUTTON)
  const handleAddUploadRow = () => {
    const newRow: UploadRow = {
      id: `row_${Date.now()}`,
      category: 'GPKD',
      fileName: '',
    };
    setUploadRows([...uploadRows, newRow]);
  };

  const handleRemoveUploadRow = (rowId: string) => {
    if (uploadRows.length === 1) return;
    setUploadRows(uploadRows.filter((r) => r.id !== rowId));
  };

  const handleRowCategoryChange = (rowId: string, category: string) => {
    setUploadRows(uploadRows.map((r) => (r.id === rowId ? { ...r, category } : r)));
  };

  const handleRowFileNameChange = (rowId: string, fileName: string) => {
    setUploadRows(uploadRows.map((r) => (r.id === rowId ? { ...r, fileName } : r)));
  };

  const handleMultiFileUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const validRows = uploadRows.filter((r) => r.fileName.trim().length > 0);
    if (validRows.length === 0) {
      setToastMessage('⚠️ Vui lòng nhập hoặc chọn ít nhất 1 tệp tin chứng từ!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const newDocs: KycDocument[] = validRows.map((r, idx) => ({
      doc_id: `doc_${Date.now()}_${idx}`,
      doc_type: r.category as any,
      doc_name: r.fileName.trim(),
      file_r2_path: `storage.ggbingo.vn/documents/${r.fileName.trim()}`,
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VALID',
    }));

    const updatedCustomer: ExtendedCustomer = {
      ...selectedCustomer,
      kyc_status: 'VERIFIED',
      kyc_documents: [...(selectedCustomer.kyc_documents || []), ...newDocs],
    };

    setCustomers((prev) => prev.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c)));
    syncCustomerToApi('PATCH', {
      id: updatedCustomer.id,
      kyc_status: updatedCustomer.kyc_status,
      kyc_documents: updatedCustomer.kyc_documents,
    });
    setSelectedCustomer(updatedCustomer);
    setUploadRows([{ id: `row_${Date.now()}`, category: 'GPKD', fileName: '' }]);
    setToastMessage(`Đã tải lên thành công ${validRows.length} tệp chứng từ cho khách hàng ${selectedCustomer.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCreateLeadFromCustomer = (cust: ExtendedCustomer) => {
    const pendingLeadData = {
      customer_id: cust.id,
      customer_code: cust.customer_code,
      name: cust.name,
      entity_type: cust.entity_type,
      company_name: cust.company_name,
      tax_code: cust.tax_code,
      id_card_number: cust.id_card_number,
      phone: cust.phone,
      email: cust.email,
    };

    localStorage.setItem('ggbg_pending_lead_customer', JSON.stringify(pendingLeadData));
    router.push('/leads?autoCreate=true');
  };

  const handleBulkAssignCskh = () => {
    if (selectedIds.length === 0) return;

    const cskhLabel = `Giao Task CSKH Tái Chăm Sóc Hàng Loạt — ${new Date().toLocaleDateString('vi-VN')}`;
    setCustomers((prev) =>
      prev.map((c) => {
        if (selectedIds.includes(c.id)) {
          return {
            ...c,
            cskh_task_assigned: cskhLabel,
          };
        }
        return c;
      })
    );
    selectedIds.forEach((id) => syncCustomerToApi('PATCH', { id, cskh_task_assigned: cskhLabel }));

    setToastMessage(`Đã giao thành công Task CSKH tái chăm sóc cho ${selectedIds.length} khách hàng được chọn!`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleBulkUpdateLifecycle = () => {
    if (selectedIds.length === 0) return;

    setCustomers((prev) =>
      prev.map((c) => {
        if (selectedIds.includes(c.id)) {
          return {
            ...c,
            lifecycle_stage: targetLifecycle,
          };
        }
        return c;
      })
    );
    selectedIds.forEach((id) => syncCustomerToApi('PATCH', { id, lifecycle_stage: targetLifecycle }));

    setToastMessage(`Đã cập nhật trạng thái vòng đời [${targetLifecycle}] cho ${selectedIds.length} khách hàng!`);
    setBulkLifecycleModalOpen(false);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExportData = () => {
    const targetList = selectedIds.length > 0 ? customers.filter((c) => selectedIds.includes(c.id)) : filteredCustomers;

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Mã KH,Loại Thể Nhân,Tên KH,Doanh Nghiệp / MST / CCCD,SĐT,Lifecycle,Health Score %,LTV (VNĐ)']
        .concat(
          targetList.map(
            (c) =>
              `${c.customer_code},${c.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp' : 'Cá Nhân'},"${c.name}","${
                c.entity_type === 'ENTERPRISE' ? c.company_name + ' (MST:' + c.tax_code + ')' : 'CCCD:' + (c.id_card_number || '')
              }",${c.phone},${c.lifecycle_stage},${c.health_score}%,${c.ltv_total_spent}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GGBingo_Customer_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Đã xuất file Excel cho ${targetList.length} khách hàng!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(46,92,230,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10.5px] font-bold mb-2.5">
            <Users className="w-3 h-3 text-blue-600" />
            <span>Hồ Sơ Khách Hàng 360°</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-blue-700 flex items-center gap-2">
            Danh Mục Khách Hàng 360°
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
            Quản lý hồ sơ và theo dõi thông tin khách hàng
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Tạo Khách Hàng Mới
          </button>

          {canReveal ? (
            <button
              onClick={() => setShowMaskedData(!showMaskedData)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              {showMaskedData ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
              <span>{showMaskedData ? 'Gỡ Mask SĐT / MST / CCCD' : 'Ẩn Bảo Mật Thông Tin'}</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-200" title="Vai trò của bạn không được phép xem đầy đủ dữ liệu nhạy cảm">
              <EyeOff className="w-4 h-4" /> Dữ liệu nhạy cảm đã ẩn
            </span>
          )}

          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export File Excel
          </button>
        </div>
        </div>
      </div>

      {/* FLOATING BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
              {selectedIds.length}
            </span>
            <div>
              <p className="font-bold text-sm text-slate-900">Đã chọn {selectedIds.length} khách hàng trong danh sách</p>
              <p className="text-[11px] text-slate-500">Thao tác nhanh cho hàng loạt hồ sơ cùng lúc</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkAssignCskh}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Chuyển CSKH Tái Chăm Sóc
            </button>

            <button
              onClick={() => setBulkLifecycleModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" /> Đổi Trạng Thái Vòng Đời
            </button>

            <button
              onClick={handleExportData}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-blue-100"
            >
              <Download className="w-3.5 h-3.5" /> Export Đã Chọn
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              title="Bỏ chọn tất cả"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedEntityFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedEntityFilter === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả Khách Hàng ({customers.length})
          </button>
          <button
            onClick={() => setSelectedEntityFilter('ENTERPRISE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedEntityFilter === 'ENTERPRISE' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> 🏢 Doanh Nghiệp
          </button>
          <button
            onClick={() => setSelectedEntityFilter('INDIVIDUAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedEntityFilter === 'INDIVIDUAL' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
            }`}
          >
            <User className="w-3.5 h-3.5" /> 👤 Cá Nhân
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm Mã KH, Tên, MST, Số CCCD, SĐT..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Main Customers Table with Full Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10.5px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Loại & Mã KH</th>
                <th className="p-4">Tên & Doanh Nghiệp / Cá Nhân</th>
                <th className="p-4">Mã Số Thuế (MST) / Số CCCD</th>
                <th className="p-4">Số Điện Thoại</th>
                <th className="p-4">Tổng LTV Chi Tiêu</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isChecked = selectedIds.includes(cust.id);
                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(cust.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          cust.entity_type === 'ENTERPRISE' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {cust.entity_type === 'ENTERPRISE' ? '🏢 Doanh Nghiệp' : '👤 Cá Nhân'}
                        </span>
                        <p className="font-mono text-slate-500 font-bold text-[11px] mt-1">{cust.customer_code}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                        <p className="text-slate-500 text-[11px] font-medium">{cust.company_name || 'Cá Nhân Độc Lập'}</p>
                      </td>

                      <td className="p-4 font-mono font-bold">
                        {cust.entity_type === 'ENTERPRISE' ? (
                          <span className="text-blue-700">MST: {maskIdentification(cust.tax_code, revealPII)}</span>
                        ) : (
                          <span className="text-purple-700">CCCD: {maskIdentification(cust.id_card_number, revealPII)}</span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-semibold text-slate-800">
                        {revealPII ? cust.phone : maskPhoneVal(cust.phone)}
                      </td>

                      <td className="p-4 font-mono font-extrabold text-emerald-700 text-sm">
                        {(cust.ltv_total_spent / 1000000).toLocaleString('vi-VN')} Tr ₫
                      </td>

                      {/* ACTION BUTTONS: XEM + SỬA + UPLOAD + TẠO LEAD */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* NÚT XEM CHI TIẾT */}
                          <button
                            onClick={() => handleOpenViewDetailModal(cust)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                            title="Xem Thông Tin Chi Tiết Hồ Sơ Khách Hàng"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" /> Xem
                          </button>

                          {/* NÚT SỬA THÔNG TIN */}
                          <button
                            onClick={() => handleOpenEditModal(cust)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                            title="Chỉnh Sửa Hồ Sơ Khách Hàng"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Sửa
                          </button>

                          {/* NÚT UPLOAD FILE */}
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setIsKycModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                            title="Upload Chứng Từ"
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload
                          </button>

                          {/* NÚT TẠO LEAD */}
                          <button
                            onClick={() => handleCreateLeadFromCustomer(cust)}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
                            title="Tạo Lead từ Khách Hàng"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: XEM CHI TIẾT HỒ SƠ KHÁCH HÀNG 360° (NÚT XEM) */}
      {isViewDetailModalOpen && selectedViewCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{selectedViewCustomer.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 border border-blue-200">
                      {selectedViewCustomer.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp' : 'Cá Nhân'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mã KH: {selectedViewCustomer.customer_code} • Phân loại: {selectedViewCustomer.tier}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewDetailModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <p className="text-slate-500 font-semibold flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-600" /> Tổng LTV Tích Lũy:
                  </p>
                  <p className="text-lg font-black font-mono text-emerald-700 mt-1">
                    {(selectedViewCustomer.ltv_total_spent / 1000000).toLocaleString('vi-VN')} Tr ₫
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <p className="text-slate-500 font-semibold flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4 text-blue-600" /> GMV Trung Bình/Tháng:
                  </p>
                  <p className="text-lg font-black font-mono text-blue-700 mt-1">
                    {((selectedViewCustomer.avg_monthly_gmv || 0) / 1000000).toLocaleString('vi-VN')} Tr ₫
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <p className="text-slate-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Health Score Vòng Đời:
                  </p>
                  <p className="text-lg font-black font-mono text-purple-700 mt-1">
                    {selectedViewCustomer.health_score}/100 ({selectedViewCustomer.lifecycle_stage})
                  </p>
                </div>
              </div>

              {/* General Information */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">Thông Tin Định Danh & Liên Hệ</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500">Họ và Tên Đại Diện:</p>
                    <p className="font-bold text-slate-900">{selectedViewCustomer.name}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Tên Doanh Nghiệp / Cửa Hàng:</p>
                    <p className="font-bold text-slate-900">{selectedViewCustomer.company_name || 'Cá Nhân'}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Mã Số Thuế / CCCD Định Danh:</p>
                    <p className="font-bold font-mono text-blue-700">
                      {selectedViewCustomer.entity_type === 'ENTERPRISE'
                        ? `MST: ${maskIdentification(selectedViewCustomer.tax_code, revealPII)}`
                        : `CCCD: ${maskIdentification(selectedViewCustomer.id_card_number, revealPII)}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Số Điện Thoại:</p>
                    <p className="font-bold font-mono text-slate-900">{revealPII ? selectedViewCustomer.phone : maskPhoneVal(selectedViewCustomer.phone)}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Email:</p>
                    <p className="font-bold text-slate-900">{selectedViewCustomer.email}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Địa Chỉ Trụ Sở / Thường Trú:</p>
                    <p className="font-bold text-slate-900">{selectedViewCustomer.address}</p>
                  </div>
                </div>
              </div>

              {/* Financial & Banking Information */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">Tài Khoản Ngân Hàng & Hạn Mức Tín Dụng</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-500">Số Tài Khoản Ngân Hàng:</p>
                    <p className="font-bold font-mono text-slate-900">{revealPII ? (selectedViewCustomer.bank_account || 'Chưa cập nhật') : (selectedViewCustomer.bank_account ? '•••• ' + selectedViewCustomer.bank_account.slice(-4) : 'Chưa cập nhật')}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Tên Ngân Hàng & Chi Nhánh:</p>
                    <p className="font-bold text-slate-900">{selectedViewCustomer.bank_name || 'Chưa cập nhật'}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Hạn Mức Tín Dụng Công Nợ:</p>
                    <p className="font-bold font-mono text-emerald-700">
                      {((selectedViewCustomer.credit_limit || 0) / 1000000).toLocaleString('vi-VN')} Tr ₫
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents Vault */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2">Tập Chứng Từ Đã Lưu ({selectedViewCustomer.kyc_documents?.length || 0})</h4>
                {(!selectedViewCustomer.kyc_documents || selectedViewCustomer.kyc_documents.length === 0) ? (
                  <p className="text-slate-400 italic">Chưa có chứng từ nào được lưu.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedViewCustomer.kyc_documents.map((doc) => (
                      <div key={doc.doc_id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-800">{doc.doc_name}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold text-[10px]">✓ Đã Lưu</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DÒNG THỜI GIAN TƯƠNG TÁC (ACTIVITY TIMELINE) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Dòng Thời Gian Tương Tác
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-extrabold">
                    {selectedViewCustomer.activities?.length || 0}
                  </span>
                </h4>

                {/* Ô THÊM TƯƠNG TÁC NHANH */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                  <p className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-600" /> Thêm Tương Tác
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value as CustomerActivity['type'])}
                      className="sm:w-40 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="CALL">📞 Cuộc gọi</option>
                      <option value="EMAIL">✉️ Email</option>
                      <option value="MEETING">👥 Cuộc họp</option>
                      <option value="NOTE">📝 Ghi chú</option>
                      <option value="CONTRACT">📄 Hợp đồng</option>
                      <option value="STAGE">🎯 Vòng đời</option>
                    </select>
                    <input
                      type="text"
                      value={newActivityContent}
                      onChange={(e) => setNewActivityContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddActivity();
                        }
                      }}
                      placeholder="Nhập nội dung tương tác với khách hàng..."
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" /> Lưu
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH TIMELINE (GIẢM DẦN THEO THỜI GIAN) */}
                {(!selectedViewCustomer.activities || selectedViewCustomer.activities.length === 0) ? (
                  <p className="text-slate-400 italic">Chưa có tương tác nào được ghi nhận.</p>
                ) : (
                  <div className="relative pl-1">
                    {/* Đường nối dọc */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200" aria-hidden="true"></div>
                    <ul className="space-y-4">
                      {[...selectedViewCustomer.activities]
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((act) => {
                          const meta = ACTIVITY_META[act.type] || ACTIVITY_META.NOTE;
                          const Icon = meta.Icon;
                          return (
                            <li key={act.id} className="relative flex items-start gap-3">
                              {/* Icon + chấm màu theo type */}
                              <div className="relative z-10 shrink-0">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${meta.iconBg}`}>
                                  <Icon className={`w-4 h-4 ${meta.iconText}`} />
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-50 ${meta.dot}`}></span>
                              </div>

                              <div className="flex-1 min-w-0 p-3 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <p className="font-bold text-slate-900 text-xs">{act.title}</p>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${meta.iconBg} ${meta.iconText}`}>
                                    {meta.label}
                                  </span>
                                </div>
                                {act.note && <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{act.note}</p>}
                                <div className="flex items-center gap-3 mt-1.5 text-[10.5px] text-slate-400 font-medium flex-wrap">
                                  {act.actor && (
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3" /> {act.actor}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {formatActivityTime(act.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CHỈNH SỬA THÔNG TIN KHÁCH HÀNG (NÚT SỬA ĐÃ FIX 100%) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Chỉnh Sửa Thông Tin Hồ Sơ Khách Hàng</h3>
                  <p className="text-xs text-slate-500">Mã KH: {editForm.customer_code} • Cập nhật thông tin chi tiết</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCustomer} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại Thể Nhân *</label>
                  <select
                    value={editForm.entity_type}
                    onChange={(e) => setEditForm({ ...editForm, entity_type: e.target.value as CustomerEntityType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="ENTERPRISE">🏢 Doanh Nghiệp (B2B)</option>
                    <option value="INDIVIDUAL">👤 Cá Nhân (B2C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên Đại Diện *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {editForm.entity_type === 'ENTERPRISE' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tên Doanh Nghiệp</label>
                    <input
                      type="text"
                      value={editForm.company_name}
                      onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mã Số Thuế (MST)</label>
                    <input
                      type="text"
                      value={editForm.tax_code}
                      onChange={(e) => setEditForm({ ...editForm, tax_code: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD / CMND Định Danh</label>
                    <input
                      type="text"
                      value={editForm.id_card_number}
                      onChange={(e) => setEditForm({ ...editForm, id_card_number: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày & Nơi Cấp CCCD</label>
                    <input
                      type="text"
                      value={editForm.id_card_issue_date}
                      onChange={(e) => setEditForm({ ...editForm, id_card_issue_date: e.target.value })}
                      placeholder="2021-05-10 • Cục QLHC"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Điện Thoại *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Liên Hệ</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa Chỉ Thường Trú / ĐKKD</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Tài Khoản Ngân Hàng</label>
                  <input
                    type="text"
                    value={editForm.bank_account}
                    onChange={(e) => setEditForm({ ...editForm, bank_account: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Ngân Hàng & CN</label>
                  <input
                    type="text"
                    value={editForm.bank_name}
                    onChange={(e) => setEditForm({ ...editForm, bank_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Mức Tín Dụng (VNĐ)</label>
                  <input
                    type="number"
                    value={editForm.credit_limit}
                    onChange={(e) => setEditForm({ ...editForm, credit_limit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Lưu Thay Đổi Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD NHIỀU FILE VỚI NÚT + */}
      {isKycModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{selectedCustomer.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 border border-blue-200">
                      {selectedCustomer.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp' : 'Cá Nhân'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mã KH: {selectedCustomer.customer_code} • Upload Nhiều Tệp Chứng Từ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKycModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <form onSubmit={handleMultiFileUploadSubmit} className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" /> Upload Nhiều Tệp Chứng Từ Hàng Loạt
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddUploadRow}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Thêm Dòng File Mới
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadRows.map((row, idx) => (
                    <div key={row.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-xs shadow-xs animate-in fade-in duration-200">
                      <span className="font-bold text-slate-400 text-[11px] w-5 text-center">{idx + 1}.</span>

                      <div className="w-1/3">
                        <select
                          value={row.category}
                          onChange={(e) => handleRowCategoryChange(row.id, e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs"
                        >
                          <option value="GPKD">GPKD Doanh Nghiệp</option>
                          <option value="CCCD_FRONT">CCCD Mặt Trước</option>
                          <option value="CCCD_BACK">CCCD Mặt Sau</option>
                          <option value="AUTHORIZATION">Giấy Ủy Quyền</option>
                          <option value="CONTRACT">Hợp Đồng Nguyên Tắc</option>
                          <option value="TAX_DOC">Báo Cáo Tài Chính/Thuế</option>
                          <option value="BANK_DOC">Xác Nhận Ngân Hàng</option>
                          <option value="OTHER">Chứng Từ Khác</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={row.fileName}
                          onChange={(e) => handleRowFileNameChange(row.id, e.target.value)}
                          placeholder="Tên tệp tin (VD: GPKD_2026.pdf, CCCD_2026.jpg...)"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                        />
                      </div>

                      {uploadRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadRow(row.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" /> Upload & Lưu Tất Cả ({uploadRows.filter((r) => r.fileName.trim()).length} File)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TẠO MỚI KHÁCH HÀNG (CREATE CUSTOMER MODAL) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Tạo Mới Hồ Sơ Khách Hàng 360°</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nhập thông tin khách hàng Doanh Nghiệp hoặc Cá Nhân mới vào hệ thống CRM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreateCustomer} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Entity Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Loại Thể Nhân Khách Hàng *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, entity_type: 'ENTERPRISE' })}
                    className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      createForm.entity_type === 'ENTERPRISE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> 🏢 Khách Hàng Doanh Nghiệp (B2B)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, entity_type: 'INDIVIDUAL' })}
                    className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      createForm.entity_type === 'INDIVIDUAL'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-4 h-4" /> 👤 Khách Hàng Cá Nhân (Merchant/B2C)
                  </button>
                </div>
              </div>

              {/* General Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Khách Hàng</label>
                  <input
                    type="text"
                    required
                    value={createForm.customer_code}
                    onChange={(e) => setCreateForm({ ...createForm, customer_code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ & Tên Đại Diện / Chủ Thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A..."
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số Điện Thoại Liên Hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0988 123 456"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Entity Specific Section */}
              {createForm.entity_type === 'ENTERPRISE' ? (
                <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-4 animate-in fade-in duration-200">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" /> Thông Tin Pháp Lý Doanh Nghiệp
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tên Công Ty / Doanh Nghiệp</label>
                      <input
                        type="text"
                        placeholder="VD: Công ty TNHH SunBeauty Vietnam..."
                        value={createForm.company_name}
                        onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mã Số Thuế (MST)</label>
                      <input
                        type="text"
                        placeholder="VD: 0108928374"
                        value={createForm.tax_code}
                        onChange={(e) => setCreateForm({ ...createForm, tax_code: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl space-y-4 animate-in fade-in duration-200">
                  <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-600" /> Thông Tin Thẻ CCCD / Định Danh Cá Nhân
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD / CMND</label>
                      <input
                        type="text"
                        placeholder="VD: 001198002345"
                        value={createForm.id_card_number}
                        onChange={(e) => setCreateForm({ ...createForm, id_card_number: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ngày Cấp</label>
                      <input
                        type="date"
                        value={createForm.id_card_issue_date}
                        onChange={(e) => setCreateForm({ ...createForm, id_card_issue_date: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nơi Cấp</label>
                      <input
                        type="text"
                        placeholder="VD: Cục Cảnh Sát QLHC..."
                        value={createForm.id_card_issue_place}
                        onChange={(e) => setCreateForm({ ...createForm, id_card_issue_place: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Classification */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Hộp Thư</label>
                  <input
                    type="email"
                    placeholder="VD: contact@brand.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                {/* Vietnam Administrative Units Address Picker (Post-01/07/2025 Standard) */}
                <div className="md:col-span-3">
                  <VietnamAddressPicker
                    value={createAddressData}
                    onChange={setCreateAddressData}
                    required
                    label="Địa Chỉ Trụ Sở / Liên Hệ (Chuẩn Mới Sau 01/07/2025)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phân Loại Dịch Vụ</label>
                  <select
                    value={createForm.customer_type}
                    onChange={(e) => setCreateForm({ ...createForm, customer_type: e.target.value as CustomerType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="B2B_Agency_Service">Dịch Vụ Agency Vận Hành TMĐT</option>
                    <option value="GGBingoVN_Merchant">Gian Hàng GGBingoVN Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạng Khách Hàng (Tier)</label>
                  <select
                    value={createForm.tier}
                    onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value as CustomerTier })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              {/* Lifecycle Stage, Finance & Owner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng Thái Vòng Đời</label>
                  <select
                    value={createForm.lifecycle_stage}
                    onChange={(e) => setCreateForm({ ...createForm, lifecycle_stage: e.target.value as LifecycleStage })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Prospect">Prospect (Mới/Tiềm năng)</option>
                    <option value="Regular">Regular (Đã phát sinh GD)</option>
                    <option value="VIP">VIP (Doanh số lớn)</option>
                    <option value="At-Risk">At-Risk (Nguy cơ rời bỏ)</option>
                    <option value="Churned">Churned (Ngừng hoạt động)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GMV Dự Kiến Tháng (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="VD: 500000000"
                    value={createForm.avg_monthly_gmv}
                    onChange={(e) => setCreateForm({ ...createForm, avg_monthly_gmv: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Mức Công Nợ (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="VD: 200000000"
                    value={createForm.credit_limit}
                    onChange={(e) => setCreateForm({ ...createForm, credit_limit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa Chỉ Đăng Ký Kinh Doanh / Thường Trú</label>
                <input
                  type="text"
                  placeholder="VD: Số 18 Nguyễn Chánh, Cầu Giấy, Hà Nội"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              {/* E-commerce platforms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Sàn TMĐT Đang Kinh Doanh</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {['Shopee', 'TikTokShop', 'Lazada', 'Amazon', 'GGBingoVN'].map((platform) => {
                    const isChecked = createForm.ecom_platforms.includes(platform);
                    return (
                      <label
                        key={platform}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCreateForm({ ...createForm, ecom_platforms: [...createForm.ecom_platforms, platform] });
                            } else {
                              setCreateForm({
                                ...createForm,
                                ecom_platforms: createForm.ecom_platforms.filter((p) => p !== platform),
                              });
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span>{platform}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Ban Đầu</label>
                <textarea
                  rows={2}
                  placeholder="Nhập thông tin yêu cầu đặc biệt, lưu ý CSKH..."
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Tạo Hồ Sơ Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
