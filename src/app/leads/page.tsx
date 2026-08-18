'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  PhoneCall,
  MoreHorizontal,
  Clock,
  DollarSign,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Phone,
  FileText,
  Send,
  UserPlus,
  Crown,
  Flame,
  Check,
  User,
  Store,
  BadgeCheck,
  LayoutGrid,
  List,
  History,
  Activity,
  Sliders,
  FileSearch,
  FilterX,
  FileSpreadsheet,
  BarChart3,
  Zap,
  ArrowUpRight,
  ExternalLink,
  Users,
  Layers
} from 'lucide-react';
import { Lead, VoIPCallLog, LeadSource, Customer, CustomerEntityType } from '@/types';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';
import { INITIAL_PRODUCTS } from '@/lib/productStore';
import { formatFullAddressPost2025 } from '@/lib/locationService';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import dynamic from 'next/dynamic';
import { getStoredCustomers, saveStoredCustomers } from '@/lib/customerStore';
import LeadFullPageDetail from '@/components/leads/LeadFullPageDetail';

const BulkLeadImportModal = dynamic(() => import('@/components/leads/BulkLeadImportModal'), { ssr: false });
const ChannelAnalyticsDrawer = dynamic(() => import('@/components/leads/ChannelAnalyticsDrawer'), { ssr: false });
import LeadAnalyticsDashboard from '@/components/leads/LeadAnalyticsDashboard';

interface StageDefinition {
  id: string;
  name: string;
  color: string;
}

const SEVEN_STAGES: StageDefinition[] = [
  { id: 'stage_1', name: '1. Tiếp Nhận Mới', color: '#3B82F6' },
  { id: 'stage_2', name: '2. Liên Hệ Ban Đầu', color: '#06B6D4' },
  { id: 'stage_3', name: '3. Tư Vấn Giải Pháp', color: '#F59E0B' },
  { id: 'stage_4', name: '4. Báo Giá Dịch Vụ', color: '#8B5CF6' },
  { id: 'stage_5', name: '5. Đàm Phán Hợp Đồng', color: '#EC4899' },
  { id: 'stage_6', name: '6. Chốt Thành Công', color: '#10B981' },
  { id: 'stage_7', name: '7. Thất Bại / Tạm Dừng', color: '#EF4444' },
];

export interface LeadStageLog {
  id: string;
  lead_code: string;
  lead_name: string;
  actor_name: string;
  from_stage: string;
  to_stage: string;
  timestamp: string;
  note?: string;
}

const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead_01',
    lead_code: 'LD-1001',
    customer_id: 'cust_01',
    full_name: 'Nguyễn Văn Hùng',
    entity_type: 'ENTERPRISE',
    company_name: 'Công Ty Cổ Phần Công Nghệ & Thương Mại Alpha',
    tax_code: '0108992384',
    phone: '0912345678',
    email: 'contact@alphatech.vn',
    interested_product_id: 'p1',
    interested_product_name: 'Gói Vận Hành Gian Hàng TMĐT Toàn Diện',
    address: 'Tầng 12, Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    source_name: 'Facebook Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_6',
    stage_name: '6. Chốt Thành Công',
    assigned_sale_name: 'Trần Văn Hoàng (Đội 1)',
    estimated_budget: 145000000,
    lead_score: 95,
    status: 'Converted',
    kyc_status: 'VERIFIED',
    created_at: '2026-08-01 10:00',
  },
  {
    id: 'lead_02',
    lead_code: 'LD-1002',
    customer_id: 'cust_02',
    full_name: 'Vũ Đình Trọng',
    entity_type: 'HOUSEHOLD_BUSINESS',
    company_name: 'Hộ Kinh Doanh Thời Trang May Mặc Trọng Phát',
    tax_code: '8392019283',
    phone: '0903456789',
    email: 'trongphat.fashion@gmail.com',
    interested_product_id: 'p2',
    interested_product_name: 'Gói Livestream TikTok Shop & KOC Booking',
    address: 'Số 45 Phố Huế, Phường Hàng Bài, Hoàn Kiếm, Hà Nội',
    source_name: 'Google Ads',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_3',
    stage_name: '3. Tư Vấn Giải Pháp',
    assigned_sale_name: 'Nguyễn Quốc Tuấn (Đội 2)',
    estimated_budget: 65000000,
    lead_score: 82,
    status: 'Contacted',
    kyc_status: 'PENDING',
    created_at: '2026-08-10 14:30',
  },
  {
    id: 'lead_03',
    lead_code: 'LD-1003',
    customer_id: 'cust_03',
    full_name: 'Phạm Thu Thảo',
    entity_type: 'INDIVIDUAL',
    phone: '0978901234',
    email: 'thuthao.pham@gmail.com',
    interested_product_id: 'p3',
    interested_product_name: 'Gói Chạy Quảng Cáo Shopee & Lazada Ads Tối Ưu ROI',
    address: 'Chung cư Vinhomes Central Park, Bình Thạnh, TP.HCM',
    source_name: 'Referral / Giới Thiệu',
    pipeline_id: 'AGENCY',
    stage_id: 'stage_1',
    stage_name: '1. Tiếp Nhận Mới',
    assigned_sale_name: 'Lê Thị Mai (Đội 3)',
    estimated_budget: 35000000,
    lead_score: 88,
    status: 'New',
    kyc_status: 'PENDING',
    created_at: '2026-08-15 09:15',
  }
];

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stageLogs, setStageLogs] = useState<LeadStageLog[]>([]);
  const [existingCustomers, setExistingCustomers] = useState<Customer[]>([]);

  // VIEW MODE TOGGLE
  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST' | 'DETAIL'>('KANBAN');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false);

  const [selectedLeadLogFilter, setSelectedLeadLogFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>('ALL');

  // Modals & Toasts
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // FORM MODAL STATE
  const [addMode, setAddMode] = useState<'EXISTING_CUSTOMER' | 'CREATE_NEW'>('CREATE_NEW');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Lead fields
  const [entityType, setEntityType] = useState<CustomerEntityType>('ENTERPRISE');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('p1');
  const [sourceName, setSourceName] = useState<LeadSource>('Facebook Ads');
  const [estimatedBudget, setEstimatedBudget] = useState<string>('150000000');
  const [assignedSaleName, setAssignedSaleName] = useState('Trần Văn Hoàng (Đội 1)');
  const [formError, setFormError] = useState('');

  // Vietnam Administrative Units Address State
  const [addressData, setAddressData] = useState<VietnamAddressValue>({
    provinceCode: '01',
    provinceName: 'Thành phố Hà Nội',
    wardCode: '00154',
    wardName: 'Phường Thượng Đình',
    detailAddress: 'Số 188 Nguyễn Trãi',
    fullAddress: 'Số 188 Nguyễn Trãi, Phường Thượng Đình, Thành phố Hà Nội',
  });

  // Load Customers & Leads on mount and listen to changes
  useEffect(() => {
    // 1. Load customers from customerStore
    const custs = getStoredCustomers();
    setExistingCustomers(custs);

    // 2. Load leads from localStorage or default
    const savedLeads = localStorage.getItem('ggbg_crm_leads');
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch {
        setLeads(INITIAL_SAMPLE_LEADS);
      }
    } else {
      setLeads(INITIAL_SAMPLE_LEADS);
      localStorage.setItem('ggbg_crm_leads', JSON.stringify(INITIAL_SAMPLE_LEADS));
    }

    const handleCustomerUpdate = () => {
      setExistingCustomers(getStoredCustomers());
    };
    window.addEventListener('ggbg_customers_updated', handleCustomerUpdate);
    return () => window.removeEventListener('ggbg_customers_updated', handleCustomerUpdate);
  }, []);

  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('ggbg_crm_leads', JSON.stringify(updatedLeads));
  };

  // AUTO CREATE LEAD FROM CUSTOMER DIRECTORY LISTENER
  useEffect(() => {
    const pendingJson = localStorage.getItem('ggbg_pending_lead_customer');
    const autoCreateParam = searchParams.get('autoCreate');

    if (pendingJson || autoCreateParam === 'true') {
      if (pendingJson) {
        try {
          const pending = JSON.parse(pendingJson);
          setAddMode('EXISTING_CUSTOMER');
          setSelectedCustomerId(pending.customer_id || '');
          setEntityType(pending.entity_type || 'ENTERPRISE');
          setFullName(pending.name || '');
          setPhone(pending.phone || '');
          setEmail(pending.email || '');
          setCompanyName(pending.company_name || pending.household_name || '');
          setTaxCode(pending.tax_code || pending.household_reg_num || '');
          setIdCardNumber(pending.id_card_number || '');
          setIsAddModalOpen(true);

          setSuccessToast(`✓ Đã tự động nạp thông tin từ Khách Hàng [${pending.customer_code}] ${pending.name}!`);
          setTimeout(() => setSuccessToast(''), 5000);
        } catch {
          // ignore
        } finally {
          localStorage.removeItem('ggbg_pending_lead_customer');
        }
      }
    }
  }, [searchParams]);

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    if (selectedSourceFilter !== 'ALL' && l.source_name !== selectedSourceFilter) return false;
    if (selectedRepFilter !== 'ALL' && l.assigned_sale_name !== selectedRepFilter) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        l.full_name.toLowerCase().includes(term) ||
        l.lead_code.toLowerCase().includes(term) ||
        l.phone.includes(term) ||
        (l.company_name && l.company_name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Filter logs for specific lead or all
  const filteredStageLogs = stageLogs.filter((log) => {
    if (selectedLeadLogFilter === 'ALL') return true;
    return log.lead_code === selectedLeadLogFilter;
  });

  const handleSelectExistingCustomer = (cust: Customer) => {
    setSelectedCustomerId(cust.id);
    setEntityType(cust.entity_type);
    setFullName(cust.name);
    setPhone(cust.phone);
    setEmail(cust.email || '');
    setCompanyName(cust.company_name || cust.household_name || '');
    setTaxCode(cust.tax_code || cust.household_reg_num || '');
    setIdCardNumber(cust.id_card_number || '');
    setFormError('');
  };

  // OPEN LOG DRAWER FOR A SPECIFIC LEAD
  const handleOpenLeadSpecificLog = (leadCode: string) => {
    setSelectedLeadLogFilter(leadCode);
    setIsLogDrawerOpen(true);
  };

  // MOVE STAGE WITH CLEAR AUDIT LOGGING AND CUSTOMER STORE SYNC
  const moveLeadToStage = (leadId: string, targetStageId: string, customNote?: string) => {
    const targetStage = SEVEN_STAGES.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.stage_id === targetStageId) return;

    const fromStageName = currentLead.stage_name;
    const toStageName = targetStage.name;

    const updatedLeads = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          stage_id: targetStage.id,
          stage_name: targetStage.name,
          status: targetStageId === 'stage_6' ? ('Converted' as const) : targetStageId === 'stage_7' ? ('Lost' as const) : ('Contacted' as const),
        };
      }
      return l;
    });

    saveLeadsToStorage(updatedLeads);

    // GHI LOG RIÊNG BIỆT THEO TỪNG LEAD CODE VÀ TÊN LEAD
    const newLog: LeadStageLog = {
      id: `log_${Date.now()}`,
      lead_code: currentLead.lead_code,
      lead_name: currentLead.full_name,
      from_stage: fromStageName,
      to_stage: toStageName,
      actor_name: 'Super Admin (Quản trị viên)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: customNote || `Chuyển bước phễu xử lý sang ${toStageName}`,
    };
    setStageLogs((prev) => [newLog, ...prev]);

    // SYNC WITH CUSTOMER STORE IF CONVERTED (STAGE 6)
    if (targetStageId === 'stage_6') {
      const allCusts = getStoredCustomers();
      let customerMatched = false;

      const updatedCusts = allCusts.map((c) => {
        if (c.id === currentLead.customer_id || c.phone.replace(/\D/g, '') === currentLead.phone.replace(/\D/g, '')) {
          customerMatched = true;
          return {
            ...c,
            lifecycle_stage: 'Active' as const,
            lifecycle_auto_updated_at: new Date().toISOString().substring(0, 10),
            lifecycle_reason: `Chốt hợp đồng thành công từ Lead [${currentLead.lead_code}]`,
            ltv_total_spent: Math.max(c.ltv_total_spent || 0, currentLead.estimated_budget || 0),
          };
        }
        return c;
      });

      if (customerMatched) {
        saveStoredCustomers(updatedCusts);
        setExistingCustomers(updatedCusts);
      }
    }

    setSuccessToast(`Đã chuyển Lead [${currentLead.lead_code}] ${currentLead.full_name} sang [${toStageName}] và đồng bộ hồ sơ Khách Hàng!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleConvertLeadToVipCustomer = (lead: Lead) => {
    moveLeadToStage(lead.id, 'stage_6', 'Chuyển 1-Click thành Khách Hàng VIP');

    // Nâng cấp trực tiếp thành VIP trong CustomerStore
    const allCusts = getStoredCustomers();
    const updatedCusts = allCusts.map((c) => {
      if (c.id === lead.customer_id || c.phone.replace(/\D/g, '') === lead.phone.replace(/\D/g, '')) {
        return {
          ...c,
          tier: 'VIP' as const,
          tier_auto_updated_at: new Date().toISOString().substring(0, 10),
          lifecycle_stage: 'VIP' as const,
          lifecycle_auto_updated_at: new Date().toISOString().substring(0, 10),
          lifecycle_reason: `Nâng hạng VIP trực tiếp từ Lead [${lead.lead_code}]`,
          ltv_total_spent: Math.max(c.ltv_total_spent || 0, lead.estimated_budget || 100000000),
        };
      }
      return c;
    });
    saveStoredCustomers(updatedCusts);
    setExistingCustomers(updatedCusts);
  };

  // SUBMIT CREATE LEAD & AUTO-LINK WITH CUSTOMER MODULE
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('⚠️ Bắt buộc nhập đầy đủ Họ và Tên Khách Hàng!');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 9) {
      setFormError('⚠️ Bắt buộc nhập Số Điện Thoại hợp lệ (tối thiểu 9-10 chữ số)!');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('⚠️ Bắt buộc nhập Email hợp lệ (ví dụ: khachhang@company.com)!');
      return;
    }

    if (entityType === 'ENTERPRISE' && !taxCode.trim()) {
      setFormError('⚠️ Bắt buộc nhập Mã Số Thuế (MST) cho khách hàng Doanh Nghiệp!');
      return;
    }

    if (entityType === 'INDIVIDUAL' && !idCardNumber.trim()) {
      setFormError('⚠️ Bắt buộc nhập Số CCCD cho khách hàng Cá Nhân!');
      return;
    }

    if (!selectedProductId) {
      setFormError('⚠️ Bắt buộc chọn Sản Phẩm / Gói Dịch Vụ Khách Hàng Quan Tâm!');
      return;
    }

    const selectedProd = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId);
    const formattedAddress = formatFullAddressPost2025(addressData.detailAddress, addressData.wardName, addressData.provinceName);

    const firstStage = SEVEN_STAGES[0];
    const newCode = `LD-${1031 + leads.length}`;
    const calculatedScore = Math.floor(75 + Math.random() * 20);

    let linkedCustomerId = selectedCustomerId;

    // TỰ ĐỘNG TẠO HỒ SƠ KHÁCH HÀNG MỚI NẾU CHƯA CÓ TRONG HỆ THỐNG
    if (addMode === 'CREATE_NEW' || !linkedCustomerId) {
      const currentCusts = getStoredCustomers();
      const nextCustCode = `KH-${1000 + currentCusts.length + 1}`;
      const newCustId = `cust_${Date.now()}`;

      const newCustomer: Customer = {
        id: newCustId,
        customer_code: nextCustCode,
        name: fullName.trim(),
        entity_type: entityType,
        company_name: entityType === 'ENTERPRISE' ? companyName.trim() : undefined,
        household_name: entityType === 'HOUSEHOLD_BUSINESS' ? companyName.trim() : undefined,
        tax_code: entityType === 'ENTERPRISE' ? taxCode.trim() : undefined,
        household_reg_num: entityType === 'HOUSEHOLD_BUSINESS' ? taxCode.trim() : undefined,
        id_card_number: entityType === 'INDIVIDUAL' ? idCardNumber.trim() : undefined,
        phone: phone.trim(),
        email: email.trim(),
        address: formattedAddress,
        contacts: [
          {
            id: `c_${Date.now()}`,
            name: fullName.trim(),
            role_title: entityType === 'ENTERPRISE' ? 'Đại Diện Doanh Nghiệp' : entityType === 'HOUSEHOLD_BUSINESS' ? 'Chủ Hộ Kinh Doanh' : 'Chủ Thể Cá Nhân',
            phone: phone.trim(),
            email: email.trim(),
            is_primary: true,
          },
        ],
        tier: 'Standard',
        tier_auto_updated_at: new Date().toISOString().substring(0, 10),
        lifecycle_stage: 'Prospect',
        lifecycle_auto_updated_at: new Date().toISOString().substring(0, 10),
        lifecycle_reason: `Khởi tạo tự động từ Lead [${newCode}] tiếp nhận qua kênh ${sourceName}`,
        health_score: 100,
        ltv_total_spent: 0,
        owner_name: assignedSaleName,
        credit_limit_info: {
          approved_limit: 0,
          status: 'NOT_SET',
          reason: 'Lead mới tiếp nhận phễu bán hàng, chưa phát sinh công nợ',
        },
        kyc_status: 'PENDING',
        tags: ['Tạo từ Phễu Lead', sourceName],
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      const updatedCusts = [newCustomer, ...currentCusts];
      saveStoredCustomers(updatedCusts);
      setExistingCustomers(updatedCusts);
      linkedCustomerId = newCustId;
    }

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      lead_code: newCode,
      customer_id: linkedCustomerId,
      full_name: fullName.trim(),
      entity_type: entityType,
      phone: phone.trim(),
      email: email.trim(),
      company_name: companyName.trim(),
      tax_code: taxCode.trim(),
      id_card_number: idCardNumber.trim(),
      interested_product_id: selectedProductId,
      interested_product_name: selectedProd ? selectedProd.name : '',
      address: formattedAddress,
      source_name: sourceName,
      pipeline_id: 'AGENCY',
      stage_id: firstStage.id,
      stage_name: firstStage.name,
      assigned_sale_name: assignedSaleName,
      estimated_budget: selectedProd ? selectedProd.base_price : Number(estimatedBudget) || 150000000,
      lead_score: calculatedScore,
      status: 'New',
      kyc_status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    saveLeadsToStorage([newLead, ...leads]);

    const createLog: LeadStageLog = {
      id: `log_${Date.now()}`,
      lead_code: newCode,
      lead_name: fullName.trim(),
      from_stage: 'Khởi tạo hệ thống',
      to_stage: firstStage.name,
      actor_name: 'Super Admin',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Tạo Lead mới cho sản phẩm "${selectedProd?.name}" tại ${formattedAddress}`,
    };
    setStageLogs((prev) => [createLog, ...prev]);

    setIsAddModalOpen(false);
    setSuccessToast(`🎉 Đã tạo Lead [${newCode}] và đồng bộ hồ sơ Khách Hàng [${fullName}] thành công!`);

    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setTaxCode('');
    setIdCardNumber('');
    setSelectedCustomerId('');
    setFormError('');

    setTimeout(() => setSuccessToast(''), 4000);
  };

  // HANDLE BULK IMPORT SUCCESS
  const handleBulkImportSuccess = (newImportedLeads: Lead[]) => {
    saveLeadsToStorage([...newImportedLeads, ...leads]);
    setSuccessToast(`✓ Đã import thành công ${newImportedLeads.length} Lead và liên kết hồ sơ Khách Hàng!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast('')} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP BANNER HEADER - THEO CHUẨN MODULE TỔNG QUAN */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân Hệ Phễu Bán Hàng & Chuyển Đổi Lead GGBingo CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Quản Lý Phễu Chuyển Đổi Lead 7 Bước
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-2xl leading-relaxed">
            Liên kết đồng bộ 2 chiều với phân hệ Khách Hàng. Tự động khởi tạo hồ sơ Tiềm Năng (Prospect) khi tạo Lead và chuyển sang Active/VIP khi chốt hợp đồng.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 w-full lg:w-auto justify-between lg:justify-start">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tỷ Lệ Chuyển Đổi Phễu</p>
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-numbers">
              {leads.length > 0 ? Math.round((leads.filter((l) => l.stage_id === 'stage_6').length / leads.length) * 100) : 0}% (Đạt Chỉ Tiêu)
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-xs ring-2 ring-emerald-500/20"
            style={{ background: 'conic-gradient(#10B981 0 75%, #E2E8F0 75% 100%)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-semibold text-xs text-emerald-600 dark:text-emerald-400">
              {leads.filter((l) => l.stage_id === 'stage_6').length}/{leads.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK LAUNCHER ACTION BAR - THEO CHUẨN TỔNG QUAN */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
        <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Thao Tác Nhanh:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setAddMode('CREATE_NEW');
              setSelectedCustomerId('');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Tạo Lead Mới</span>
          </button>
          <button
            onClick={() => setIsBulkImportModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import Excel / CSV</span>
          </button>
          <button
            onClick={() => setIsChannelDrawerOpen(true)}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Hiệu Quả Kênh Lead</span>
          </button>
          <button
            onClick={() => setIsLogDrawerOpen(true)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Nhật Ký Chuyển Bước</span>
          </button>
          <Link
            href="/customers"
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mở Module Khách Hàng ({existingCustomers.length})</span>
          </Link>
        </div>
      </div>

      {/* 3. BI ANALYTICS PANEL */}
      <LeadAnalyticsDashboard leads={leads} />

      {/* 4. CONTROLS BAR: SEARCH, FILTERS & KANBAN / LIST TOGGLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm Lead theo mã, tên khách hàng, SĐT hoặc tên công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="ALL">Nguồn: Tất Cả</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Event / Hội Thảo">Event / Hội Thảo</option>
              <option value="Referral / Giới Thiệu">Referral / Giới Thiệu</option>
              <option value="Website GGBingoVN">Website GGBingoVN</option>
            </select>

            {/* Sales Rep Filter */}
            <select
              value={selectedRepFilter}
              onChange={(e) => setSelectedRepFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="ALL">Sale: Tất Cả</option>
              <option value="Trần Văn Hoàng (Đội 1)">Trần Văn Hoàng</option>
              <option value="Nguyễn Quốc Tuấn (Đội 2)">Nguyễn Quốc Tuấn</option>
              <option value="Lê Thị Mai (Đội 3)">Lê Thị Mai</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'KANBAN'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'LIST'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Bảng ({filteredLeads.length})</span>
            </button>
            {selectedLead && (
              <button
                onClick={() => setViewMode('DETAIL')}
                className={`p-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'DETAIL'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Chi Tiết: {selectedLead.lead_code}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULL-PAGE LEAD DETAIL VIEW */}
      {viewMode === 'DETAIL' && selectedLead && (
        <LeadFullPageDetail
          lead={selectedLead}
          onBack={() => setViewMode('KANBAN')}
          onUpdateStage={(leadId, newStageId, newStageName) => {
            moveLeadToStage(leadId, newStageId);
            setSelectedLead((prev) => (prev ? { ...prev, stage_id: newStageId as any, stage_name: newStageName } : null));
          }}
          onNavigateCustomer={(customerId) => {
            router.push('/customers');
          }}
        />
      )}

      {/* 5. KANBAN BOARD VIEW */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {SEVEN_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage_id === stage.id);
            const totalStageBudget = stageLeads.reduce((sum, l) => sum + (l.estimated_budget || 0), 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                      {stage.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono mb-2 flex items-center justify-between">
                  <span>Dự toán:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatNumber(Math.round(totalStageBudget / 1000000))} Tr ₫</span>
                </div>

                {/* Lead Cards List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px]">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-[11px] italic">
                      Chưa có Lead ở bước này
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const linkedCustomer = existingCustomers.find((c) => c.id === lead.customer_id);

                      return (
                        <div
                          key={lead.id}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                              {lead.lead_code}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {lead.source_name}
                            </span>
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{lead.full_name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{lead.company_name || 'Cá Nhân'}</p>
                          </div>

                          {/* Linked Customer Badge */}
                          {linkedCustomer && (
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10.5px]">
                              <span className="text-slate-400">Hồ sơ KH:</span>
                              <Link
                                href="/customers"
                                className="font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                              >
                                <span>{linkedCustomer.customer_code}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                              {formatNumber(lead.estimated_budget || 0)} ₫
                            </span>
                            <span className="text-slate-400 text-[10px]">{lead.assigned_sale_name.split(' ')[0]}</span>
                          </div>

                          {/* Fast Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setViewMode('DETAIL');
                              }}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                              title="Xem chi tiết toàn màn hình"
                            >
                              Chi Tiết
                            </button>

                            <button
                              onClick={() => handleOpenLeadSpecificLog(lead.lead_code)}
                              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                              title="Xem nhật ký"
                            >
                              <History className="w-3 h-3" /> Log
                            </button>

                            {lead.stage_id !== 'stage_6' && (
                              <button
                                onClick={() => moveLeadToStage(lead.id, 'stage_6')}
                                className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Chốt HĐ
                              </button>
                            )}

                            {lead.stage_id !== 'stage_6' && (
                              <button
                                onClick={() => handleConvertLeadToVipCustomer(lead)}
                                className="px-2 py-1 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                              >
                                <Crown className="w-3 h-3 text-amber-500" /> VIP
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. LIST VIEW */}
      {viewMode === 'LIST' && (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Danh Sách Phễu Chuyển Đổi Lead & Khách Hàng Liên Kết</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Quản lý trạng thái 7 bước và đồng bộ dữ liệu với hồ sơ khách hàng</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{filteredLeads.length} Lead</span>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left border-collapse text-xs min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Mã & Tên Lead</th>
                  <th className="pb-3">Hồ Sơ Khách Hàng</th>
                  <th className="pb-3">Thể Nhân & Doanh Nghiệp</th>
                  <th className="pb-3">SĐT & Email</th>
                  <th className="pb-3">Nguồn Tiếp Nhận</th>
                  <th className="pb-3">Bước Phễu Xử Lý</th>
                  <th className="pb-3 text-right">Dự Toán Ngân Sách</th>
                  <th className="pb-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => {
                  const linkedCustomer = existingCustomers.find((c) => c.id === lead.customer_id);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                        <div className="font-semibold">{lead.full_name}</div>
                        <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {lead.lead_code}
                        </div>
                      </td>

                      <td className="py-3">
                        {linkedCustomer ? (
                          <Link
                            href="/customers"
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900"
                          >
                            <span>{linkedCustomer.customer_code}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Tự động liên kết</span>
                        )}
                      </td>

                      <td className="py-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {lead.company_name || 'Cá Nhân'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{lead.tax_code || lead.id_card_number || '—'}</span>
                      </td>

                      <td className="py-3">
                        <div className="font-mono text-slate-800 dark:text-slate-200">{lead.phone}</div>
                        <div className="text-[10.5px] text-slate-500">{lead.email}</div>
                      </td>

                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {lead.source_name}
                        </span>
                      </td>

                      <td className="py-3">
                        <select
                          value={lead.stage_id}
                          onChange={(e) => moveLeadToStage(lead.id, e.target.value)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                        >
                          {SEVEN_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatNumber(lead.estimated_budget || 0)} ₫
                      </td>

                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setViewMode('DETAIL');
                            }}
                            className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            Chi Tiết
                          </button>
                          <button
                            onClick={() => handleOpenLeadSpecificLog(lead.lead_code)}
                            className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            Log
                          </button>
                          <button
                            onClick={() => handleConvertLeadToVipCustomer(lead)}
                            className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            VIP
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: NHẬT KÝ CHUYỂN TRẠNG THÁI */}
      {isLogDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    Nhật Ký Chuyển Trạng Thái Phễu Bán Hàng
                  </h3>
                  <p className="text-xs text-slate-500">Lịch sử tương tác và ghi nhận chuyển bước của các chuyên viên Sales</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Log */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Lọc Theo Lead:</span>
              </div>
              <select
                value={selectedLeadLogFilter}
                onChange={(e) => setSelectedLeadLogFilter(e.target.value)}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">🌐 Tất Cả Lead Toàn Hệ Thống ({stageLogs.length} Log)</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.lead_code}>
                    [{l.lead_code}] {l.full_name} - {l.company_name || 'Cá Nhân'}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
              {filteredStageLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">
                  Chưa có nhật ký chuyển bước nào phù hợp với bộ lọc.
                </div>
              ) : (
                filteredStageLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded text-[11px]">
                        [{log.lead_code}] {log.lead_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 font-semibold text-slate-800 dark:text-slate-200">
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">{log.from_stage}</span>
                      <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded text-[11px] font-medium">
                        {log.to_stage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Người thực hiện: <strong className="text-slate-800 dark:text-slate-200">{log.actor_name}</strong></span>
                      {log.note && <span className="italic text-slate-600 dark:text-slate-400">"{log.note}"</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TẠO LEAD MỚI VÀ LIÊN KẾT KHÁCH HÀNG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    Tạo Lead Mới Phễu 7 Bước
                  </h3>
                  <p className="text-xs text-slate-500">Tự động đồng bộ và liên kết với phân hệ Khách Hàng</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setAddMode('EXISTING_CUSTOMER');
                    setFormError('');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    addMode === 'EXISTING_CUSTOMER' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🏢 Chọn Khách Hàng Hiện Hữu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddMode('CREATE_NEW');
                    setSelectedCustomerId('');
                    setFormError('');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    addMode === 'CREATE_NEW' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ✨ Tạo Mới Lead & Khách Hàng
                </button>
              </div>

              {addMode === 'EXISTING_CUSTOMER' && (
                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-blue-900 dark:text-blue-300">
                    Chọn Khách Hàng Đã Có Trong Danh Mục ({existingCustomers.length} Hồ sơ) *
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      const found = existingCustomers.find((c) => c.id === e.target.value);
                      if (found) handleSelectExistingCustomer(found);
                    }}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="">-- Bấm để chọn Khách Hàng trong danh mục --</option>
                    {existingCustomers.map((cust) => (
                      <option key={cust.id} value={cust.id}>
                        [{cust.customer_code}] {cust.name} - {cust.company_name || cust.household_name || 'Cá Nhân'} ({cust.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Loại Thể Nhân *
                  </label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as CustomerEntityType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white"
                  >
                    <option value="ENTERPRISE">🏢 Doanh Nghiệp</option>
                    <option value="HOUSEHOLD_BUSINESS">🏪 Hộ Kinh Doanh</option>
                    <option value="INDIVIDUAL">👤 Cá Nhân</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nguồn Lead Tiếp Nhận *
                  </label>
                  <select
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value as LeadSource)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-white"
                  >
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Event / Hội Thảo">Event / Hội Thảo</option>
                    <option value="Referral / Giới Thiệu">Referral / Giới Thiệu</option>
                    <option value="Website GGBingoVN">Website GGBingoVN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Họ và Tên Khách Hàng / Lead <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn Minh"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0988 123 456"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="minh.nguyen@company.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tên Doanh Nghiệp / HKD
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Công ty TNHH Vận Tải SunBeauty"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {entityType === 'ENTERPRISE' ? 'Mã Số Thuế (MST)' : 'Số CCCD Định Danh'}
                  </label>
                  <input
                    type="text"
                    value={entityType === 'ENTERPRISE' ? taxCode : idCardNumber}
                    onChange={(e) => {
                      if (entityType === 'ENTERPRISE') setTaxCode(e.target.value);
                      else setIdCardNumber(e.target.value);
                    }}
                    placeholder={entityType === 'ENTERPRISE' ? '0108928374' : '001198002345'}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sản Phẩm / Gói Dịch Vụ Quan Tâm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    className="w-full p-2.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 rounded-lg text-xs font-medium text-blue-900 dark:text-blue-300"
                  >
                    {INITIAL_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        [{prod.sku_code}] {prod.name} ({formatCurrency(prod.base_price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address Picker */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <VietnamAddressPicker
                  value={addressData}
                  onChange={setAddressData}
                  required
                  label="Địa Chỉ Khách Hàng (Tỉnh/Thành Phố, Phường/Xã/Quận/Huyện & Số Nhà)"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Lead & Đồng Bộ Khách Hàng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK IMPORT LEAD TU EXCEL / CSV */}
      <BulkLeadImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
        existingPhones={leads.map((l) => l.phone)}
      />

      {/* DRAWER: THỐNG KÊ HIỆU QUẢ KÊNH LEAD ĐA KÊNH */}
      <ChannelAnalyticsDrawer
        isOpen={isChannelDrawerOpen}
        onClose={() => setIsChannelDrawerOpen(false)}
        leads={leads}
      />
    </div>
  );
}
