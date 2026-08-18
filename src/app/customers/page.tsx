'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canViewPII } from '@/lib/permissions';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  User,
  Store,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Clock,
  ArrowUpDown,
  Upload,
  UserPlus,
  BadgeCheck,
  X,
  PlusCircle,
  Phone,
  Mail,
  Coins,
  Calendar,
  Tag,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileText,
  ArrowRight,
  Check
} from 'lucide-react';
import { Customer, CustomerEntityType, CustomerTier, KycDocument, LifecycleStage, CustomerContactPerson } from '@/types';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import CustomerOverviewDashboard from '@/components/customers/CustomerOverviewDashboard';
import CustomerFullPageDetail from '@/components/customers/CustomerFullPageDetail';
import {
  getStoredCustomers,
  saveStoredCustomers,
  computeCustomerTier,
  computeCustomerLifecycle
} from '@/lib/customerStore';
import { getStoredLeads } from '@/lib/leadStore';
import { Lead } from '@/types';
import { getCustomerTierRules } from '@/lib/systemConfigStore';

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
  fileSize?: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'LIST' | 'DETAIL'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('ALL');
  const [showMaskedData, setShowMaskedData] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // PII Masking permissions
  const { user, simulatedRole } = useAuth();
  const canReveal = canViewPII(simulatedRole || user?.role, user?.is_super_admin);
  const revealPII = canReveal && !showMaskedData;
  const maskPhoneVal = (p?: string) => (p ? `${p.substring(0, 4)} **** ${p.substring(p.length - 2)}` : '—');

  // Load from store on mount
  useEffect(() => {
    const loaded = getStoredCustomers();
    setCustomers(loaded);
    setLeads(getStoredLeads());

    const handleUpdate = () => {
      setCustomers(getStoredCustomers());
      setLeads(getStoredLeads());
    };
    window.addEventListener('ggbg_customers_updated', handleUpdate);
    window.addEventListener('ggbg_leads_updated', handleUpdate);
    return () => {
      window.removeEventListener('ggbg_customers_updated', handleUpdate);
      window.removeEventListener('ggbg_leads_updated', handleUpdate);
    };
  }, []);

  const [selectedViewCustomer, setSelectedViewCustomer] = useState<Customer | null>(null);

  // EDIT CUSTOMER MODAL STATE & FORM
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: string;
    customer_code: string;
    entity_type: CustomerEntityType;
    name: string;
    company_name: string;
    tax_code: string;
    household_name: string;
    household_reg_num: string;
    household_owner_name: string;
    id_card_number: string;
    id_card_issue_date: string;
    id_card_issue_place: string;
    phone: string;
    email: string;
    address: string;
    contacts: CustomerContactPerson[];
    bank_account: string;
    bank_name: string;
  }>({
    id: '',
    customer_code: '',
    entity_type: 'ENTERPRISE',
    name: '',
    company_name: '',
    tax_code: '',
    household_name: '',
    household_reg_num: '',
    household_owner_name: '',
    id_card_number: '',
    id_card_issue_date: '',
    id_card_issue_place: '',
    phone: '',
    email: '',
    address: '',
    contacts: [],
    bank_account: '',
    bank_name: '',
  });

  // CREATE NEW CUSTOMER MODAL STATE & FORM (DYNAMIC SINGLE FORM - NO TABS)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    customer_code: string;
    entity_type: CustomerEntityType;
    name: string;
    company_name: string;
    tax_code: string;
    household_name: string;
    household_reg_num: string;
    household_owner_name: string;
    id_card_number: string;
    id_card_issue_date: string;
    id_card_issue_place: string;
    phone: string;
    email: string;
    address: string;
    contacts: CustomerContactPerson[];
    owner_name: string;
    bank_account: string;
    bank_name: string;
    notes: string;
  }>({
    customer_code: '',
    entity_type: 'ENTERPRISE',
    name: '',
    company_name: '',
    tax_code: '',
    household_name: '',
    household_reg_num: '',
    household_owner_name: '',
    id_card_number: '',
    id_card_issue_date: '',
    id_card_issue_place: '',
    phone: '',
    email: '',
    address: '',
    contacts: [],
    owner_name: 'Trần Văn Hoàng',
    bank_account: '',
    bank_name: '',
    notes: '',
  });

  // Vietnam Administrative Units Address States
  const [createAddressData, setCreateAddressData] = useState<VietnamAddressValue>({
    provinceCode: '01',
    provinceName: 'Thành phố Hà Nội',
    wardCode: '00154',
    wardName: 'Phường Thượng Đình',
    detailAddress: 'Số 188 Nguyễn Trãi',
    fullAddress: 'Số 188 Nguyễn Trãi, Phường Thượng Đình, Thành phố Hà Nội',
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const nextCode = `KH-${1000 + customers.length + 1}`;
    setCreateForm({
      customer_code: nextCode,
      entity_type: 'ENTERPRISE',
      name: '',
      company_name: '',
      tax_code: '',
      household_name: '',
      household_reg_num: '',
      household_owner_name: '',
      id_card_number: '',
      id_card_issue_date: '',
      id_card_issue_place: '',
      phone: '',
      email: '',
      address: '',
      contacts: [
        {
          id: `c_init_${Date.now()}`,
          name: '',
          role_title: 'Giám Đốc Điều Hành',
          phone: '',
          email: '',
          is_primary: true,
        },
      ],
      owner_name: user?.name || 'Trần Văn Hoàng',
      bank_account: '',
      bank_name: '',
      notes: '',
    });
    setIsCreateModalOpen(true);
  };

  // Add contact row in Create
  const handleAddCreateContact = () => {
    setCreateForm((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: '',
          role_title: 'Người Liên Hệ',
          phone: '',
          email: '',
          is_primary: prev.contacts.length === 0,
        },
      ],
    }));
  };

  const handleRemoveCreateContact = (id: string) => {
    setCreateForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateCreateContact = (id: string, field: keyof CustomerContactPerson, value: any) => {
    setCreateForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        if (field === 'is_primary' && value === true) {
          return { ...c, is_primary: false };
        }
        return c;
      }),
    }));
  };

  // Add contact row in Edit
  const handleAddEditContact = () => {
    setEditForm((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: '',
          role_title: 'Người Liên Hệ',
          phone: '',
          email: '',
          is_primary: prev.contacts.length === 0,
        },
      ],
    }));
  };

  const handleRemoveEditContact = (id: string) => {
    setEditForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateEditContact = (id: string, field: keyof CustomerContactPerson, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        if (field === 'is_primary' && value === true) {
          return { ...c, is_primary: false };
        }
        return c;
      }),
    }));
  };

  // Submit Create Customer
  const handleSaveCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.phone.trim()) {
      setToastMessage('⚠️ Vui lòng nhập đầy đủ Tên đại diện và Số điện thoại!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    // Auto calculate initial tier and lifecycle
    const initialTier = computeCustomerTier(0, 0);
    const initialLifecycle = computeCustomerLifecycle({ ltv_total_spent: 0, health_score: 100 }, 0, 0);

    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      customer_code: createForm.customer_code.trim() || `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: createForm.name.trim(),
      entity_type: createForm.entity_type,
      company_name: createForm.company_name.trim(),
      tax_code: createForm.tax_code.trim(),
      household_name: createForm.household_name.trim(),
      household_reg_num: createForm.household_reg_num.trim(),
      household_owner_name: createForm.household_owner_name.trim(),
      id_card_number: createForm.id_card_number.trim(),
      id_card_issue_date: createForm.id_card_issue_date.trim(),
      id_card_issue_place: createForm.id_card_issue_place.trim(),
      phone: createForm.phone.trim(),
      email: createForm.email.trim(),
      address: createAddressData.fullAddress || createForm.address.trim(),
      contacts: createForm.contacts.filter((c) => c.name.trim() !== ''),
      tier: initialTier,
      tier_auto_updated_at: new Date().toISOString().substring(0, 10),
      lifecycle_stage: initialLifecycle.stage,
      lifecycle_auto_updated_at: new Date().toISOString().substring(0, 10),
      lifecycle_reason: initialLifecycle.reason,
      health_score: 100,
      ltv_total_spent: 0,
      owner_name: createForm.owner_name || user?.name || 'Trần Văn Hoàng',
      credit_limit_info: {
        approved_limit: 0,
        status: 'NOT_SET',
        reason: 'Khách hàng mới tạo, chưa thiết lập hạn mức tín dụng',
      },
      kyc_status: 'PENDING',
      bank_account: createForm.bank_account.trim(),
      bank_name: createForm.bank_name.trim(),
      tags: ['Mới tiếp nhận'],
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    saveStoredCustomers(updated);
    setIsCreateModalOpen(false);
    setToastMessage(`🎉 Đã tạo thành công khách hàng mới [${newCust.customer_code}] ${newCust.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cust: Customer) => {
    setEditForm({
      id: cust.id,
      customer_code: cust.customer_code,
      entity_type: cust.entity_type,
      name: cust.name,
      company_name: cust.company_name || '',
      tax_code: cust.tax_code || '',
      household_name: cust.household_name || '',
      household_reg_num: cust.household_reg_num || '',
      household_owner_name: cust.household_owner_name || '',
      id_card_number: cust.id_card_number || '',
      id_card_issue_date: cust.id_card_issue_date || '',
      id_card_issue_place: cust.id_card_issue_place || '',
      phone: cust.phone,
      email: cust.email || '',
      address: cust.address || '',
      contacts: cust.contacts || [],
      bank_account: cust.bank_account || '',
      bank_name: cust.bank_name || '',
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Customer
  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.phone.trim()) {
      setToastMessage('⚠️ Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const updated = customers.map((c) => {
      if (c.id === editForm.id) {
        return {
          ...c,
          name: editForm.name.trim(),
          entity_type: editForm.entity_type,
          company_name: editForm.company_name.trim(),
          tax_code: editForm.tax_code.trim(),
          household_name: editForm.household_name.trim(),
          household_reg_num: editForm.household_reg_num.trim(),
          household_owner_name: editForm.household_owner_name.trim(),
          id_card_number: editForm.id_card_number.trim(),
          id_card_issue_date: editForm.id_card_issue_date.trim(),
          id_card_issue_place: editForm.id_card_issue_place.trim(),
          phone: editForm.phone.trim(),
          email: editForm.email.trim(),
          address: editForm.address.trim(),
          contacts: editForm.contacts.filter((ct) => ct.name.trim() !== ''),
          bank_account: editForm.bank_account.trim(),
          bank_name: editForm.bank_name.trim(),
        };
      }
      return c;
    });

    setCustomers(updated);
    saveStoredCustomers(updated);
    setIsEditModalOpen(false);
    setToastMessage(`✓ Đã cập nhật hồ sơ khách hàng [${editForm.customer_code}] thành công!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // KYC modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([
    { id: 'row_1', category: 'GPKD', fileName: '' },
  ]);

  const handleOpenKycModal = (cust: Customer) => {
    setSelectedCustomer(cust);
    setUploadRows([{ id: 'row_1', category: 'GPKD', fileName: '' }]);
    setIsKycModalOpen(true);
  };

  const handleAddUploadRow = () => {
    setUploadRows((prev) => [
      ...prev,
      { id: `row_${Date.now()}`, category: 'OTHER', fileName: '' },
    ]);
  };

  const handleRemoveUploadRow = (id: string) => {
    setUploadRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowCategoryChange = (id: string, category: string) => {
    setUploadRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, category } : r))
    );
  };

  const handleRowFileNameChange = (id: string, fileName: string) => {
    setUploadRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, fileName } : r))
    );
  };

  const handleMultiFileUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const validFiles = uploadRows.filter((r) => r.fileName.trim() !== '');
    if (validFiles.length === 0) {
      setToastMessage('⚠️ Vui lòng nhập tên tệp tin cần upload!');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const newDocs: KycDocument[] = validFiles.map((f, i) => ({
      doc_id: `doc_${Date.now()}_${i}`,
      doc_type: f.category as any,
      doc_name: f.fileName.trim(),
      file_r2_path: `/kyc/${selectedCustomer.customer_code}/${f.fileName.trim()}`,
      uploaded_at: new Date().toISOString().substring(0, 10),
      status: 'VALID',
    }));

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          kyc_status: 'VERIFIED' as const,
          kyc_documents: [...(c.kyc_documents || []), ...newDocs],
        };
      }
      return c;
    });

    setCustomers(updated);
    saveStoredCustomers(updated);
    setIsKycModalOpen(false);
    setToastMessage(`✓ Đã upload ${newDocs.length} tệp chứng từ KYC thành công!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (selectedStage !== 'ALL' && c.lifecycle_stage !== selectedStage) return false;
    if (selectedEntityFilter !== 'ALL' && c.entity_type !== selectedEntityFilter) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.customer_code.toLowerCase().includes(term) ||
        (c.company_name && c.company_name.toLowerCase().includes(term)) ||
        (c.household_name && c.household_name.toLowerCase().includes(term)) ||
        (c.tax_code && c.tax_code.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term)) ||
        (c.contacts && c.contacts.some((ct) => ct.name.toLowerCase().includes(term) || ct.phone.includes(term)))
      );
    }
    return true;
  });

  const enterpriseCount = customers.filter((c) => c.entity_type === 'ENTERPRISE').length;
  const householdCount = customers.filter((c) => c.entity_type === 'HOUSEHOLD_BUSINESS').length;
  const individualCount = customers.filter((c) => c.entity_type === 'INDIVIDUAL').length;
  const verifiedKycPct = customers.length > 0
    ? Math.round((customers.filter((c) => c.kyc_status === 'VERIFIED').length / customers.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP BANNER HEADER - THEO CHUẨN MODULE TỔNG QUAN */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân Hệ Quản Trị Khách Hàng GGBingo CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Hồ Sơ & Vòng Đời Khách Hàng
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-2xl leading-relaxed">
            Quản lý tập trung hồ sơ Doanh Nghiệp, Hộ Kinh Doanh, Cá Nhân, danh bạ đa người liên hệ, tự động phân hạng và theo dõi hạn mức tín dụng công nợ.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tỷ Lệ Định Danh KYC</p>
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-numbers">
              {verifiedKycPct}% (Đạt Tiêu Chuẩn)
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-xs ring-2 ring-emerald-500/20"
            style={{ background: `conic-gradient(#10B981 0 ${verifiedKycPct}%, #E2E8F0 ${verifiedKycPct}% 100%)` }}
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-semibold text-xs text-emerald-600 dark:text-emerald-400">
              {verifiedKycPct}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODE SWITCHER & QUICK BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('OVERVIEW')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'OVERVIEW'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Báo Cáo Tổng Quan</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'LIST'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Danh Sách Hồ Sơ ({filteredCustomers.length})</span>
            </button>
            {selectedViewCustomer && (
              <button
                onClick={() => setViewMode('DETAIL')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'DETAIL'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Chi Tiết: {selectedViewCustomer.name}</span>
              </button>
            )}
          </div>

          {canReveal && (
            <button
              onClick={() => setShowMaskedData(!showMaskedData)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title={showMaskedData ? 'Gỡ che dấu số điện thoại & CCCD/MST' : 'Bật che dấu dữ liệu bảo mật'}
            >
              {showMaskedData ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-amber-600" />}
              <span>{showMaskedData ? 'Hiện PII' : 'Ẩn PII'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tạo Khách Hàng</span>
          </button>
        </div>
      </div>

      {/* 3. EXECUTIVE OVERVIEW DASHBOARD VIEW */}
      {viewMode === 'OVERVIEW' && (
        <CustomerOverviewDashboard
          customers={customers}
          onNavigateList={(filter) => {
            if (filter) {
              setSelectedEntityFilter(filter);
            }
            setViewMode('LIST');
          }}
          onOpenCreate={handleOpenCreateModal}
          onViewCustomer={(cust) => {
            setSelectedViewCustomer(cust);
            setViewMode('DETAIL');
          }}
        />
      )}

      {/* 4. FULL-PAGE CUSTOMER DETAIL VIEW */}
      {viewMode === 'DETAIL' && selectedViewCustomer && (
        <CustomerFullPageDetail
          customer={selectedViewCustomer}
          leads={leads}
          onBack={() => setViewMode('LIST')}
          onEdit={(cust) => handleOpenEditModal(cust)}
          onKyc={(cust) => handleOpenKycModal(cust)}
          onRequestCredit={(cust) => {
            router.push('/finance?tab=debt');
          }}
          onCreateLeadForCustomer={(cust) => {
            router.push(`/leads?customerId=${cust.id}&customerName=${encodeURIComponent(cust.name)}`);
          }}
        />
      )}

      {/* 4. CUSTOMER LIST VIEW */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên khách hàng, mã KH, MST, tên HKD, SĐT hoặc người liên hệ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>

              {/* Entity Type Filter Tabs */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs overflow-x-auto">
                <button
                  onClick={() => setSelectedEntityFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedEntityFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Tất Cả Thể Nhân
                </button>
                <button
                  onClick={() => setSelectedEntityFilter('ENTERPRISE')}
                  className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedEntityFilter === 'ENTERPRISE'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  🏢 Doanh Nghiệp ({enterpriseCount})
                </button>
                <button
                  onClick={() => setSelectedEntityFilter('HOUSEHOLD_BUSINESS')}
                  className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedEntityFilter === 'HOUSEHOLD_BUSINESS'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  🏪 Hộ Kinh Doanh ({householdCount})
                </button>
                <button
                  onClick={() => setSelectedEntityFilter('INDIVIDUAL')}
                  className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedEntityFilter === 'INDIVIDUAL'
                      ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  👤 Cá Nhân ({individualCount})
                </button>
              </div>

              {/* Lifecycle Stage Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="ALL">Vòng Đời: Tất Cả</option>
                  <option value="Prospect">Tiềm Năng (Prospect)</option>
                  <option value="Active">Đang Hoạt Động (Active)</option>
                  <option value="Regular">Thường Xuyên (Regular)</option>
                  <option value="VIP">VIP Chiến Lược</option>
                  <option value="At-Risk">Cảnh Báo (At-Risk)</option>
                  <option value="Churned">Đã Ngưng (Churned)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CUSTOMERS DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Danh Mục Hồ Sơ Khách Hàng</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Hiển thị thông tin pháp nhân, người liên hệ, vòng đời và hạn mức tín dụng</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{filteredCustomers.length} Kết quả</span>
            </div>

            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Mã & Tên Khách Hàng</th>
                    <th className="pb-3">Thể Nhân & Pháp Lý</th>
                    <th className="pb-3">Người Đại Diện & Danh Bạ</th>
                    <th className="pb-3">SĐT & Email</th>
                    <th className="pb-3 text-center">Vòng Đời</th>
                    <th className="pb-3 text-center">Hạng (Tier)</th>
                    <th className="pb-3 text-right">LTV Tích Lũy</th>
                    <th className="pb-3 text-right">Hạn Mức Công Nợ</th>
                    <th className="pb-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="font-medium text-xs">Không tìm thấy khách hàng nào phù hợp với bộ lọc</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const primaryContact = cust.contacts?.find((c) => c.is_primary) || cust.contacts?.[0];
                      const otherContactsCount = (cust.contacts?.length || 0) - (primaryContact ? 1 : 0);

                      return (
                        <tr
                          key={cust.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          {/* Code & Name */}
                          <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                            <div className="font-semibold">{cust.name}</div>
                            <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              {cust.customer_code}
                            </div>
                          </td>

                          {/* Entity Type & Legal Name */}
                          <td className="py-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              {cust.entity_type === 'ENTERPRISE' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  🏢 Doanh Nghiệp
                                </span>
                              )}
                              {cust.entity_type === 'HOUSEHOLD_BUSINESS' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  🏪 Hộ Kinh Doanh
                                </span>
                              )}
                              {cust.entity_type === 'INDIVIDUAL' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                  👤 Cá Nhân
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium max-w-[200px] truncate">
                              {cust.company_name || cust.household_name || 'Cá Nhân Tự Do'}
                            </div>
                            {(cust.tax_code || cust.household_reg_num) && (
                              <div className="text-[10px] font-mono text-slate-400">
                                MST/ĐKKD: {revealPII ? (cust.tax_code || cust.household_reg_num) : maskIdentification(cust.tax_code || cust.household_reg_num)}
                              </div>
                            )}
                          </td>

                          {/* Representative & Contacts */}
                          <td className="py-3">
                            {primaryContact ? (
                              <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                  <span>{primaryContact.name}</span>
                                  {otherContactsCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono">
                                      +{otherContactsCount}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10.5px] text-slate-500">
                                  {primaryContact.role_title}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Chưa có người liên hệ</span>
                            )}
                          </td>

                          {/* Phone & Email */}
                          <td className="py-3">
                            <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200 font-medium">
                              {revealPII ? cust.phone : maskPhoneVal(cust.phone)}
                            </div>
                            <div className="text-[10.5px] text-slate-500 truncate max-w-[150px]">
                              {cust.email || '—'}
                            </div>
                          </td>

                          {/* Lifecycle Stage (Auto Computed) */}
                          <td className="py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                                cust.lifecycle_stage === 'VIP'
                                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                  : cust.lifecycle_stage === 'Active'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : cust.lifecycle_stage === 'Regular'
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                  : cust.lifecycle_stage === 'At-Risk'
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                  : cust.lifecycle_stage === 'Churned'
                                  ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {cust.lifecycle_stage === 'Prospect'
                                ? 'Tiềm Năng'
                                : cust.lifecycle_stage === 'Active'
                                ? 'Hoạt Động'
                                : cust.lifecycle_stage === 'Regular'
                                ? 'Thường Xuyên'
                                : cust.lifecycle_stage === 'VIP'
                                ? 'VIP'
                                : cust.lifecycle_stage === 'At-Risk'
                                ? 'Cảnh Báo'
                                : 'Đã Ngưng'}
                            </span>
                          </td>

                          {/* Tier (Auto Computed) */}
                          <td className="py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${
                                cust.tier === 'VIP'
                                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800'
                                  : cust.tier === 'Gold'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                                  : cust.tier === 'Silver'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {cust.tier}
                            </span>
                          </td>

                          {/* LTV Total Spent */}
                          <td className="py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNumber(cust.ltv_total_spent || 0)} ₫
                          </td>

                          {/* Credit Limit (From Finance Approval) */}
                          <td className="py-3 text-right">
                            {cust.credit_limit_info && cust.credit_limit_info.approved_limit > 0 ? (
                              <div>
                                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                                  {formatNumber(cust.credit_limit_info.approved_limit / 1000000)} Tr ₫
                                </span>
                                <div className="text-[9.5px] text-emerald-600 font-medium">✓ Đã duyệt</div>
                              </div>
                            ) : cust.credit_limit_info?.status === 'PENDING' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Chờ duyệt
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Chưa cấp</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedViewCustomer(cust);
                                  setViewMode('DETAIL');
                                }}
                                className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                Chi Tiết
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(cust)}
                                className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleOpenKycModal(cust)}
                                className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                KYC
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TẠO MỚI KHÁCH HÀNG (DYNAMIC FORM - NO TABS) */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    Tạo Mới Hồ Sơ Khách Hàng
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống sẽ tự động gán Vòng đời Tiềm Năng (Prospect) và phân Hạng (Tier) theo quy tắc chuẩn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Form Body */}
            <form onSubmit={handleSaveCreateCustomer} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* 1. Entity Type Selector (Buttons) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Loại Thể Nhân Khách Hàng <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, entity_type: 'ENTERPRISE' })}
                    className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      createForm.entity_type === 'ENTERPRISE'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-600 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Doanh Nghiệp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, entity_type: 'HOUSEHOLD_BUSINESS' })}
                    className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      createForm.entity_type === 'HOUSEHOLD_BUSINESS'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-600 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Hộ Kinh Doanh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, entity_type: 'INDIVIDUAL' })}
                    className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      createForm.entity_type === 'INDIVIDUAL'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-600 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Cá Nhân</span>
                  </button>
                </div>
              </div>

              {/* 2. Dynamic Inputs based on selected Entity Type */}
              {createForm.entity_type === 'ENTERPRISE' && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-4 animate-in fade-in duration-200">
                  <h4 className="font-semibold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Thông Tin Pháp Lý Doanh Nghiệp</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Tên Doanh Nghiệp / Công Ty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Công ty Cổ phần Alpha Enterprise..."
                        value={createForm.company_name}
                        onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Mã Số Thuế (MST) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: 0108928374"
                        value={createForm.tax_code}
                        onChange={(e) => setCreateForm({ ...createForm, tax_code: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-blue-700 dark:text-blue-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {createForm.entity_type === 'HOUSEHOLD_BUSINESS' && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-4 animate-in fade-in duration-200">
                  <h4 className="font-semibold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Thông Tin Pháp Lý Hộ Kinh Doanh</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Tên Hộ Kinh Doanh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Hộ Kinh Doanh Thời Trang May Mặc Trọng Phát..."
                        value={createForm.household_name}
                        onChange={(e) => setCreateForm({ ...createForm, household_name: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Mã Số Thuế HKD / Số GCN ĐKKD
                      </label>
                      <input
                        type="text"
                        placeholder="VD: 8392019283 hoặc 01D8012345"
                        value={createForm.household_reg_num}
                        onChange={(e) => setCreateForm({ ...createForm, household_reg_num: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-amber-700 dark:text-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. General Information & Representative */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mã Khách Hàng
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.customer_code}
                    onChange={(e) => setCreateForm({ ...createForm, customer_code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-blue-700 dark:text-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Họ và Tên Đại Diện / Chủ Thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A..."
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số Điện Thoại Chính <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0988 123 456"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Personal Identification (CCCD) */}
              {(createForm.entity_type === 'INDIVIDUAL' || createForm.entity_type === 'HOUSEHOLD_BUSINESS') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-xl border border-purple-200/60 dark:border-purple-900/40">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Số CCCD / Định Danh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 001198002345"
                      value={createForm.id_card_number}
                      onChange={(e) => setCreateForm({ ...createForm, id_card_number: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-purple-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Ngày Cấp
                    </label>
                    <input
                      type="date"
                      value={createForm.id_card_issue_date}
                      onChange={(e) => setCreateForm({ ...createForm, id_card_issue_date: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nơi Cấp
                    </label>
                    <input
                      type="text"
                      placeholder="Cục CSQLHC về TTXH"
                      value={createForm.id_card_issue_place}
                      onChange={(e) => setCreateForm({ ...createForm, id_card_issue_place: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 4. Multi-contacts List Widget for Enterprise & Household Business */}
              {(createForm.entity_type === 'ENTERPRISE' || createForm.entity_type === 'HOUSEHOLD_BUSINESS') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Danh Bạ Nhiều Người Liên Hệ (Giám đốc, Kế toán trưởng, Trợ lý...)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Thêm các đầu mối làm việc chuyên trách trong tổ chức</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCreateContact}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Liên Hệ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {createForm.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                      >
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-slate-500 mb-0.5">Họ và Tên</label>
                          <input
                            type="text"
                            placeholder="VD: Trần Thị Thu..."
                            value={contact.name}
                            onChange={(e) => handleUpdateCreateContact(contact.id, 'name', e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-slate-500 mb-0.5">Chức Vụ</label>
                          <input
                            type="text"
                            placeholder="VD: Kế toán trưởng..."
                            value={contact.role_title}
                            onChange={(e) => handleUpdateCreateContact(contact.id, 'role_title', e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-500 mb-0.5">Số Điện Thoại</label>
                          <input
                            type="text"
                            placeholder="0988..."
                            value={contact.phone}
                            onChange={(e) => handleUpdateCreateContact(contact.id, 'phone', e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-500 mb-0.5">Email</label>
                          <input
                            type="email"
                            placeholder="email@..."
                            value={contact.email || ''}
                            onChange={(e) => handleUpdateCreateContact(contact.id, 'email', e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between pt-3 sm:pt-0">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={contact.is_primary}
                              onChange={(e) => handleUpdateCreateContact(contact.id, 'is_primary', e.target.checked)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>Chính</span>
                          </label>
                          {createForm.contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCreateContact(contact.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Xóa người liên hệ này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Address Picker */}
              <div>
                <VietnamAddressPicker
                  value={createAddressData}
                  onChange={setCreateAddressData}
                  required
                  label="Địa Chỉ Trụ Sở / Đăng Ký Kinh Doanh"
                />
              </div>

              {/* 6. Bank Account Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số Tài Khoản Ngân Hàng
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 1903456789..."
                    value={createForm.bank_account}
                    onChange={(e) => setCreateForm({ ...createForm, bank_account: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tên Ngân Hàng & Chi Nhánh
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Techcombank - CN Thăng Long..."
                    value={createForm.bank_name}
                    onChange={(e) => setCreateForm({ ...createForm, bank_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Hồ Sơ Khách Hàng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CHỈNH SỬA THÔNG TIN KHÁCH HÀNG */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    Chỉnh Sửa Thông Tin Hồ Sơ Khách Hàng
                  </h3>
                  <p className="text-xs text-slate-500">Mã KH: {editForm.customer_code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCustomer} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Loại Thể Nhân *
                  </label>
                  <select
                    value={editForm.entity_type}
                    onChange={(e) => setEditForm({ ...editForm, entity_type: e.target.value as CustomerEntityType })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white"
                  >
                    <option value="ENTERPRISE">🏢 Doanh Nghiệp</option>
                    <option value="HOUSEHOLD_BUSINESS">🏪 Hộ Kinh Doanh</option>
                    <option value="INDIVIDUAL">👤 Cá Nhân</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Họ và Tên Đại Diện / Chủ Thể *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {editForm.entity_type === 'ENTERPRISE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tên Doanh Nghiệp
                    </label>
                    <input
                      type="text"
                      value={editForm.company_name}
                      onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mã Số Thuế (MST)
                    </label>
                    <input
                      type="text"
                      value={editForm.tax_code}
                      onChange={(e) => setEditForm({ ...editForm, tax_code: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-blue-700 dark:text-blue-400"
                    />
                  </div>
                </div>
              )}

              {editForm.entity_type === 'HOUSEHOLD_BUSINESS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tên Hộ Kinh Doanh
                    </label>
                    <input
                      type="text"
                      value={editForm.household_name}
                      onChange={(e) => setEditForm({ ...editForm, household_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mã Số Thuế / Số ĐKKD HKD
                    </label>
                    <input
                      type="text"
                      value={editForm.household_reg_num}
                      onChange={(e) => setEditForm({ ...editForm, household_reg_num: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-amber-700 dark:text-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Multi-contacts in Edit */}
              {(editForm.entity_type === 'ENTERPRISE' || editForm.entity_type === 'HOUSEHOLD_BUSINESS') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Danh Bạ Người Liên Hệ</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddEditContact}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-blue-200 dark:border-blue-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editForm.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                      >
                        <input
                          type="text"
                          placeholder="Họ và tên..."
                          value={contact.name}
                          onChange={(e) => handleUpdateEditContact(contact.id, 'name', e.target.value)}
                          className="sm:col-span-3 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Chức vụ..."
                          value={contact.role_title}
                          onChange={(e) => handleUpdateEditContact(contact.id, 'role_title', e.target.value)}
                          className="sm:col-span-3 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs"
                        />
                        <input
                          type="text"
                          placeholder="SĐT..."
                          value={contact.phone}
                          onChange={(e) => handleUpdateEditContact(contact.id, 'phone', e.target.value)}
                          className="sm:col-span-3 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono"
                        />
                        <div className="sm:col-span-3 flex items-center justify-between">
                          <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                            <input
                              type="checkbox"
                              checked={contact.is_primary}
                              onChange={(e) => handleUpdateEditContact(contact.id, 'is_primary', e.target.checked)}
                              className="rounded text-blue-600"
                            />
                            <span>Chính</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditContact(contact.id)}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Địa Chỉ Trụ Sở / Thường Trú
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> Lưu Thay Đổi Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: UPLOAD NHIỀU FILE KYC */}
      {/* ========================================================================= */}
      {isKycModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-500">Mã KH: {selectedCustomer.customer_code} • Upload Chứng Từ KYC</p>
                </div>
              </div>
              <button
                onClick={() => setIsKycModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <form onSubmit={handleMultiFileUploadSubmit} className="p-5 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Nhiều Tệp Chứng Từ Hàng Loạt</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddUploadRow}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm Dòng File Mới
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadRows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3 text-xs shadow-2xs"
                    >
                      <span className="font-medium text-slate-400 text-[11px] w-5 text-center">{idx + 1}.</span>
                      <div className="w-1/3">
                        <select
                          value={row.category}
                          onChange={(e) => handleRowCategoryChange(row.id, e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white text-xs"
                        >
                          <option value="GPKD">GPKD Doanh Nghiệp</option>
                          <option value="CCCD_FRONT">CCCD Mặt Trước</option>
                          <option value="CCCD_BACK">CCCD Mặt Sau</option>
                          <option value="AUTHORIZATION_LETTER">Giấy Ủy Quyền</option>
                          <option value="CONTRACT">Hợp Đồng Nguyên Tắc</option>
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
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {uploadRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadRow(row.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload & Lưu Tất Cả ({uploadRows.filter((r) => r.fileName.trim()).length} File)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
