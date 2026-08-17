'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Zap
} from 'lucide-react';
import { Lead, VoIPCallLog, LeadSource, Customer, CustomerEntityType } from '@/types';
import VietnamAddressPicker, { VietnamAddressValue } from '@/components/common/VietnamAddressPicker';
import { INITIAL_PRODUCTS } from '@/lib/productStore';
import { formatFullAddressPost2025 } from '@/lib/locationService';
import { formatCurrency } from '@/lib/formatters';
import dynamic from 'next/dynamic';

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

const INITIAL_CUSTOMERS_LIST: Customer[] = [];
const initialLeads: Lead[] = [];
const INITIAL_LOGS: LeadStageLog[] = [];

const SALES_REPS = [
  'Trần Văn Hoàng',
  'Nguyễn Quốc Tuấn',
  'Lê Thị Mai',
  'Phạm Minh Đức',
];

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [stageLogs, setStageLogs] = useState<LeadStageLog[]>(INITIAL_LOGS);
  const [existingCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS_LIST);

  // VIEW MODE TOGGLE (KANBAN VS LIST VIEW)
  const [viewMode, setViewMode] = useState<'REPORTS' | 'KANBAN' | 'LIST'>('REPORTS');
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false);

  // FILTER LOG BY SPECIFIC LEAD (GHI LOG VÀ LỌC LOG THEO TỪNG LEAD KHÁCH HÀNG)
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

  // Vietnam Administrative Units Address State (Post-01/07/2025 Structure)
  const [addressData, setAddressData] = useState<VietnamAddressValue>({
    provinceCode: '01',
    provinceName: 'Thành phố Hà Nội',
    wardCode: '00154',
    wardName: 'Phường Thượng Đình',
    detailAddress: 'Số 188 Nguyễn Trãi',
    fullAddress: 'Số 188 Nguyễn Trãi, Phường Thượng Đình, Thành phố Hà Nội',
  });

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
          setCompanyName(pending.company_name || '');
          setTaxCode(pending.tax_code || '');
          setIdCardNumber(pending.id_card_number || '');
          setIsAddModalOpen(true);

          setSuccessToast(` Đã tự động lấy thông tin từ Khách Hàng [${pending.customer_code}] ${pending.name}!`);
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
    setCompanyName(cust.company_name || '');
    setTaxCode(cust.tax_code || '');
    setIdCardNumber(cust.id_card_number || '');
    setFormError('');
  };

  // OPEN LOG DRAWER FOR A SPECIFIC LEAD
  const handleOpenLeadSpecificLog = (leadCode: string) => {
    setSelectedLeadLogFilter(leadCode);
    setIsLogDrawerOpen(true);
  };

  // MOVE STAGE WITH CLEAR AUDIT LOGGING BY LEAD
  const moveLeadToStage = (leadId: string, targetStageId: string, customNote?: string) => {
    const targetStage = SEVEN_STAGES.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.stage_id === targetStageId) return;

    const fromStageName = currentLead.stage_name;
    const toStageName = targetStage.name;

    setLeads((prev) => prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            stage_id: targetStage.id,
            stage_name: targetStage.name,
            status: targetStageId === 'stage_6' ? 'Converted' : targetStageId === 'stage_7' ? 'Lost' : 'Contacted',
          };
        }
        return l;
      })
    );

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
    setSuccessToast(`Đã chuyển Lead [${currentLead.lead_code}] ${currentLead.full_name} sang [${toStageName}] và ghi nhận nhật ký!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleConvertLeadToVipCustomer = (lead: Lead) => {
    moveLeadToStage(lead.id, 'stage_6', 'Chuyển 1-Click thành Khách Hàng VIP');
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError(' Bắt buộc nhập đầy đủ Họ và Tên Khách Hàng!');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 9) {
      setFormError(' Bắt buộc nhập Số Điện Thoại hợp lệ (tối thiểu 9-10 chữ số)!');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError(' Bắt buộc nhập Email hợp lệ (ví dụ: khachhang@company.com)!');
      return;
    }

    if (!companyName.trim()) {
      setFormError(' Bắt buộc nhập Tên Doanh Nghiệp / Công Ty / Hộ Kinh Doanh!');
      return;
    }

    if (entityType === 'ENTERPRISE' && !taxCode.trim()) {
      setFormError(' Bắt buộc nhập Mã Số Thuế (MST) cho khách hàng Doanh Nghiệp!');
      return;
    }

    if (entityType === 'INDIVIDUAL' && !idCardNumber.trim()) {
      setFormError(' Bắt buộc nhập Số CCCD cho khách hàng Cá Nhân!');
      return;
    }

    if (!selectedProductId) {
      setFormError(' Bắt buộc chọn Sản Phẩm / Gói Dịch Vụ Khách Hàng Quan Tâm!');
      return;
    }

    if (!addressData.provinceCode || !addressData.provinceName) {
      setFormError(' Bắt buộc chọn Tỉnh / Thành Phố thuộc Cấu Hình Địa Chỉ Hành Chính 2 Cấp!');
      return;
    }

    if (!addressData.wardCode || !addressData.wardName) {
      setFormError(' Bắt buộc chọn Phường / Xã / Quận / Huyện thuộc Cấu Hình Địa Chỉ Hành Chính 2 Cấp!');
      return;
    }

    if (!addressData.detailAddress || !addressData.detailAddress.trim()) {
      setFormError(' Bắt buộc nhập Số Nhà / Tên Đường Địa Chỉ Chi Tiết!');
      return;
    }

    if (addMode === 'CREATE_NEW') {
      const phoneExistsInLeads = leads.some((l) => l.phone.replace(/\D/g, '') === cleanPhone);
      const phoneExistsInCustomers = existingCustomers.some((c) => c.phone.replace(/\D/g, '') === cleanPhone);

      if (phoneExistsInLeads || phoneExistsInCustomers) {
        setFormError(` Số điện thoại [${phone}] đã tồn tại trong hệ thống Khách Hàng / Lead! Vui lòng chọn "Chọn Khách Hàng Hiện Hữu".`);
        return;
      }
    }

    const selectedProd = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId);
    const formattedAddress = formatFullAddressPost2025(addressData.detailAddress, addressData.wardName, addressData.provinceName);

    const firstStage = SEVEN_STAGES[0];
    const newCode = `LD-${1031 + leads.length}`;
    const calculatedScore = Math.floor(75 + Math.random() * 20);

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      lead_code: newCode,
      customer_id: selectedCustomerId || undefined,
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

    setLeads([newLead, ...leads]);

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
    setSuccessToast(`🎉 Đã tạo thành công Lead ${fullName} (${newCode}) kèm Sản Phẩm & Địa Chỉ Hành Chính!`);

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
    setLeads((prev) => [...newImportedLeads, ...prev]);

    // Create stage logs
    const newLogs: LeadStageLog[] = newImportedLeads.map((l) => ({
      id: `log_imp_${l.id}`,
      lead_code: l.lead_code,
      lead_name: l.full_name,
      from_stage: 'Import Bulk Excel',
      to_stage: '1. Tiếp Nhận Mới',
      actor_name: 'Super Admin',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      note: `Import từ file Excel hàng loạt. Gán cho ${l.assigned_sale_name}`,
    }));

    setStageLogs((prev) => [...newLogs, ...prev]);
    setSuccessToast(`🎉 Đã nhập thành công ${newImportedLeads.length} Lead mới từ file Excel vào phễu!`);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  // HANDLE TRIGGER TEST WEBHOOK INGEST
  const handleTriggerTestWebhook = async () => {
    try {
      const res = await fetch('/api/leads/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Trần Bảo An (Landing Page)',
          phone: '0988666888',
          email: 'baoan.tran@beauty.vn',
          company_name: 'Thương Hiệu Mỹ Phẩm Bảo An',
          source_name: 'Website GGBingoVN',
          estimated_budget: 180000000,
          shop_link: 'shopee.vn/baoan_cosmetics',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newLead = data.data as Lead;
        setLeads((prev) => [newLead, ...prev]);
        setSuccessToast(`⚡ Đã tiếp nhận Lead Webhook mới: ${newLead.full_name} (${newLead.lead_code}) từ Landing Page!`);
        setTimeout(() => setSuccessToast(''), 5000);
      }
    } catch {
      // fallback
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      moveLeadToStage(leadId, stageId);
    }
  };

  return ( <div className="space-y-6"> {/* Toast Notification */}
      {successToast && ( <div className="p-4 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300"> <div className="flex items-center gap-2"> <CheckCircle2 className="w-5 h-5" /> <span>{successToast}</span> </div> <button onClick={() => setSuccessToast('')} className="p-1 hover:bg-emerald-600 rounded-lg"> <X className="w-4 h-4" /> </button> </div> )}

      {/* Header - Clean White with Colorful Highlights */} <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400"> <UserCheck className="w-5 h-5" /> </div> <div> <div className="flex items-center gap-2"> <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"> Quản Lý Lead & Phễu Bán Hàng </h1> <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800"> Phễu 7 Bước </span> </div> <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5"> Quản lý khách hàng tiềm năng, tỷ lệ chuyển đổi và tiến độ phễu bán hàng </p> </div> </div> <div className="flex items-center gap-2 flex-wrap"> <button
            onClick={() => setIsChannelDrawerOpen(true)}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-colors"
          > <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> <span>Thống Kê Kênh Lead</span> </button> <button
            onClick={() => setIsBulkImportModalOpen(true)}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors"
          > <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Import Excel</span> </button> <button
            onClick={() => {
              setSelectedLeadLogFilter('ALL');
              setIsLogDrawerOpen(true);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          > <History className="w-4 h-4 text-blue-600 dark:text-blue-400" /> <span>Nhật Ký ({stageLogs.length})</span> </button> <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          > <Plus className="w-4 h-4" /> + Tạo Lead Mới </button> </div> </div> {/* VIEW MODE TOGGLE BUTTONS - Responsive Multi-Device */} <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-medium scrollbar-none touch-scroll"> <button
          onClick={() => setViewMode('REPORTS')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            viewMode === 'REPORTS'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        > <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> 1. Báo Cáo Phễu </button> <button
          onClick={() => setViewMode('KANBAN')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            viewMode === 'KANBAN'
              ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        > <LayoutGrid className="w-3.5 h-3.5 text-purple-600" /> 2. Thẻ Kanban (7 Bước) </button> <button
          onClick={() => setViewMode('LIST')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
            viewMode === 'LIST'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        > <List className="w-3.5 h-3.5 text-emerald-600" /> 3. Danh Sách </button> </div> {/* DEDICATED LEAD ANALYTICS DASHBOARD PANEL */}
      {viewMode === 'REPORTS' && <LeadAnalyticsDashboard leads={leads} />}

      {/* Filter Bar for Kanban & List */}
      {viewMode !== 'REPORTS' && ( <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"> <div className="flex items-center gap-3 flex-wrap w-full md:w-auto"> <div className="relative w-full md:w-64"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm Mã Lead, Tên, SĐT, Shop..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              /> </div> <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            > <option value="ALL">Tất cả Nguồn Lead</option> <option value="Facebook Ads">Facebook Ads</option> <option value="Facebook Lead Ads">Facebook Lead Ads Webhook</option> <option value="TikTok Ads">TikTok Ads</option> <option value="TikTok Lead Gen">TikTok Lead Gen</option> <option value="Google Ads">Google Ads</option> <option value="Google Ads Form">Google Ads Form</option> <option value="Zalo OA Form">Zalo OA Form</option> <option value="Hotline Zalo">Hotline Zalo</option> <option value="Website GGBingoVN">Website GGBingoVN</option> <option value="Event / Hội Thảo">Event / Hội Thảo</option> <option value="Referral / Giới Thiệu">Referral / Giới Thiệu</option> <option value="Bulk Import Excel">Bulk Import Excel</option> <option value="Universal Webhook">Universal Webhook API</option> </select> </div> </div> )}

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'KANBAN' && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 overflow-x-auto pb-4 touch-scroll sleek-scrollbar"> {SEVEN_STAGES.map((col) => {
            const stageLeads = filteredLeads.filter((l) => l.stage_id === col.id);

            return ( <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/80 flex flex-col min-h-[580px] min-w-[200px]"
              > <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200"> <div className="flex items-center gap-1.5 min-w-0"> <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color }}></span> <h3 className="font-semibold text-slate-800 text-[11px] truncate">{col.name}</h3> </div> <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-medium shrink-0"> {stageLeads.length} </span> </div> <div className="space-y-3 flex-1 overflow-y-auto pr-0.5"> {stageLeads.length === 0 ? ( <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-medium"> Kéo Lead vào đây </div> ) : (
                    stageLeads.map((lead) => ( <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative space-y-2"
                      > <div className="flex items-center justify-between"> <span className="text-[10px] font-mono font-medium text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded"> {lead.lead_code} </span> <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                            lead.entity_type === 'ENTERPRISE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}> {lead.entity_type === 'ENTERPRISE' ? '🏢 DN' : '👤 CN'} </span> </div> <div> <h4 className="font-semibold text-slate-900 text-xs truncate">{lead.full_name}</h4> <p className="text-[11px] text-slate-500 truncate">{lead.company_name}</p> </div> <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[10px]"> <span className="text-slate-500 font-semibold flex items-center gap-1"> <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Score: </span> <span className="font-semibold font-mono text-emerald-600">{lead.lead_score}/100</span> </div> <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1"> <button
                            onClick={() => handleOpenLeadSpecificLog(lead.lead_code)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[10px] rounded flex items-center gap-1 border border-slate-200"
                            title="Xem Lịch Sử Log Riêng Của Lead Này"
                          > <History className="w-3 h-3 text-blue-600" /> Log Lead </button> <button
                            onClick={() => handleConvertLeadToVipCustomer(lead)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] rounded flex items-center gap-1 shadow-xs transition-all active:scale-95"
                          > <Crown className="w-3 h-3" /> VIP </button> </div> </div> ))
                  )} </div> </div> );
          })} </div> )}

      {/* VIEW MODE 2: STRUCTURED LIST TABLE VIEW */}
      {viewMode === 'LIST' && ( <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"> <div className="overflow-x-auto"> <table className="w-full text-left border-collapse text-xs"> <thead> <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wide text-[10.5px]"> <th className="p-4">Mã Lead & Thể Nhân</th> <th className="p-4">Họ và Tên Lead</th> <th className="p-4">Doanh Nghiệp / MST</th> <th className="p-4">Số Điện Thoại</th> <th className="p-4">Nguồn Lead</th> <th className="p-4">Giai Đoạn Phễu</th> <th className="p-4 text-center">Nhật Ký Log Lead</th> <th className="p-4 text-center">Thao Tác</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {filteredLeads.length === 0 ? ( <tr> <td colSpan={8} className="p-8 text-center text-slate-400 italic"> Không tìm thấy lead phù hợp. </td> </tr> ) : (
                  filteredLeads.map((lead) => ( <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors"> <td className="p-4"> <span className="text-xs font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"> {lead.lead_code} </span> <p className="mt-1"> <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            lead.entity_type === 'ENTERPRISE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}> {lead.entity_type === 'ENTERPRISE' ? '🏢 Doanh Nghiệp' : '👤 Cá Nhân'} </span> </p> </td> <td className="p-4 font-medium text-slate-900 text-sm"> {lead.full_name} </td> <td className="p-4"> <p className="font-semibold text-slate-800">{lead.company_name || 'Cá Nhân'}</p> <p className="text-[10px] font-mono text-slate-500">{lead.tax_code ? `MST: ${lead.tax_code}` : lead.id_card_number ? `CCCD: ${lead.id_card_number}` : ''}</p> </td> <td className="p-4 font-mono font-medium text-slate-800"> {lead.phone} </td> <td className="p-4 font-semibold text-slate-700"> {lead.source_name} </td> <td className="p-4"> <select
                          value={lead.stage_id}
                          onChange={(e) => moveLeadToStage(lead.id, e.target.value)}
                          className="p-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                        > {SEVEN_STAGES.map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))} </select> </td> {/* NÚT XEM LOG THEO TỪNG LEAD RIÊNG BẬT */} <td className="p-4 text-center"> <button
                          onClick={() => handleOpenLeadSpecificLog(lead.lead_code)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl text-[11px] flex items-center gap-1 border border-blue-200 transition-all mx-auto"
                        > <History className="w-3.5 h-3.5" /> Xem Log ({stageLogs.filter((l) => l.lead_code === lead.lead_code).length}) </button> </td> <td className="p-4 text-center"> <button
                          onClick={() => handleConvertLeadToVipCustomer(lead)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-all mx-auto"
                        > <Crown className="w-3.5 h-3.5" /> VIP </button> </td> </tr> ))
                )} </tbody> </table> </div> </div> )}

      {/* DRAWER / MODAL: NHẬT KÝ CHUYỂN TRẠNG THÁI (LỌC THEO TỪNG LEAD CHI TIẾT) */}
      {isLogDrawerOpen && ( <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"> <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"> <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"> <History className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-base text-slate-900">Nhật Ký Lịch Sử Chuyển Trạng Thái</h3> <p className="text-xs text-slate-500">Lọc xem nhật ký toàn hệ thống hoặc xem chi tiết theo từng Lead</p> </div> </div> <button
                onClick={() => setIsLogDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              > <X className="w-5 h-5" /> </button> </div> {/* FILTER LOG BY LEAD SELECTOR */} <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-4 text-xs"> <div className="flex items-center gap-2"> <Filter className="w-4 h-4 text-blue-600" /> <span className="font-medium text-slate-800">Lọc Nhật Ký Theo Lead:</span> </div> <select
                value={selectedLeadLogFilter}
                onChange={(e) => setSelectedLeadLogFilter(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              > <option value="ALL">🌐 Tất Cả Lead Toàn Hệ Thống ({stageLogs.length} Log)</option> {leads.map((l) => ( <option key={l.id} value={l.lead_code}> [{l.lead_code}] {l.full_name} - {l.company_name || 'Cá Nhân'} </option> ))} </select> </div> <div className="p-6 overflow-y-auto space-y-3 flex-1"> {filteredStageLogs.length === 0 ? ( <div className="p-8 text-center text-slate-400 text-xs italic"> Chưa có nhật ký chuyển bước nào phù hợp với bộ lọc. </div> ) : (
                filteredStageLogs.map((log) => ( <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"> <div className="flex items-center justify-between"> <span className="font-mono font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]"> [{log.lead_code}] {log.lead_name} </span> <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span> </div> <div className="flex items-center gap-2 pt-1 font-semibold text-slate-800"> <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px]">{log.from_stage}</span> <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" /> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-medium">{log.to_stage}</span> </div> <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1"> <span>Người thực hiện: <strong className="text-slate-800">{log.actor_name}</strong></span> {log.note && <span className="italic text-slate-600">"{log.note}"</span>} </div> </div> ))
              )} </div> </div> </div> )}

      {/* MODAL: TẠO LEAD */}
      {isAddModalOpen && ( <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"> <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"> <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"> <UserPlus className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-base text-slate-900">Tạo Lead Mới Phễu 7 Bước</h3> <p className="text-xs text-slate-500">Thông tin Khách Hàng được tự động liên kết</p> </div> </div> <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              > <X className="w-5 h-5" /> </button> </div> <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"> {formError && ( <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2 shadow-sm"> <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" /> <span>{formError}</span> </div> )} <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200"> <button
                  type="button"
                  onClick={() => {
                    setAddMode('EXISTING_CUSTOMER');
                    setFormError('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    addMode === 'EXISTING_CUSTOMER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                > 🏢 Chọn Khách Hàng Hiện Hữu </button> <button
                  type="button"
                  onClick={() => {
                    setAddMode('CREATE_NEW');
                    setSelectedCustomerId('');
                    setFormError('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    addMode === 'CREATE_NEW' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                > Tạo Mới Khách Hàng / Lead </button> </div> {addMode === 'EXISTING_CUSTOMER' && ( <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3"> <label className="block text-xs font-medium text-blue-900">Danh Sách Khách Hàng Đã Xác Thực Trên Hệ Thống *</label> <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      const found = existingCustomers.find((c) => c.id === e.target.value);
                      if (found) handleSelectExistingCustomer(found);
                    }}
                    className="w-full p-2.5 bg-white border border-blue-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  > <option value="">-- Chọn Khách Hàng Trong Danh Mục --</option> {existingCustomers.map((cust) => ( <option key={cust.id} value={cust.id}> [{cust.customer_code}] {cust.name} - {cust.company_name || 'Cá Nhân'} ({cust.phone}) </option> ))} </select> </div> )} <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Loại Thể Nhân Lead *</label> <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as CustomerEntityType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  > <option value="ENTERPRISE">🏢 Doanh Nghiệp (B2B)</option> <option value="INDIVIDUAL">👤 Cá Nhân (B2C)</option> </select> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Nguồn Lead Tiếp Nhận *</label> <select
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value as LeadSource)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  > <option value="Facebook Ads">Facebook Ads</option> <option value="Google Ads">Google Ads</option> <option value="Event / Hội Thảo">Event / Hội Thảo</option> <option value="Referral / Giới Thiệu">Referral / Giới Thiệu</option> <option value="Website GGBingoVN">Website GGBingoVN</option> </select> </div> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Họ và Tên Khách Hàng / Lead <span className="text-red-500">*</span></label> <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn Minh"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Số Điện Thoại Khách Hàng <span className="text-red-500">*</span></label> <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0988 123 456"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900"
                  /> </div> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Email Khách Hàng <span className="text-red-500">*</span></label> <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="minh.nguyen@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Tên Doanh Nghiệp / Công Ty / Hộ KD <span className="text-red-500">*</span></label> <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Công ty TNHH Vận Tải SunBeauty"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  /> </div> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label className="block text-xs font-medium text-slate-700 mb-1"> {entityType === 'ENTERPRISE' ? 'Mã Số Thuế Doanh Nghiệp (MST)' : 'Số CCCD Cá Nhân'} <span className="text-red-500">*</span> </label> <input
                    type="text"
                    required
                    value={entityType === 'ENTERPRISE' ? taxCode : idCardNumber}
                    onChange={(e) => {
                      if (entityType === 'ENTERPRISE') setTaxCode(e.target.value);
                      else setIdCardNumber(e.target.value);
                    }}
                    placeholder={entityType === 'ENTERPRISE' ? '0108928374' : '001198002345'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900"
                  /> </div> <div> <label className="block text-xs font-medium text-slate-700 mb-1">Sản Phẩm / Gói Dịch Vụ Quan Tâm <span className="text-red-500">*</span></label> <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    className="w-full p-2.5 bg-blue-50/80 border border-blue-300 rounded-xl text-xs font-medium text-blue-900 focus:ring-2 focus:ring-blue-500"
                  > <option value="">-- Bắt Buộc Chọn Sản Phẩm Quan Tâm --</option> {INITIAL_PRODUCTS.map((prod) => ( <option key={prod.id} value={prod.id}> [{prod.sku_code}] {prod.name} ({formatCurrency(prod.base_price)}/{prod.unit}) </option> ))} </select> </div> </div> {/* Vietnam Administrative Address Picker (Integrated 2-Tier Standard) */} <div className="pt-2 border-t border-slate-100"> <VietnamAddressPicker
                  value={addressData}
                  onChange={setAddressData}
                  required
                  label="Cấu Hình Địa Chỉ Hành Chính Khách Hàng (Tỉnh/Thành Phố, Phường/Xã/Quận/Huyện & Số Nhà) *"
                /> </div> <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3"> <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs"
                > Hủy Bỏ </button> <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs shadow-lg shadow-blue-600/30"
                > Lưu Lead Kèm Kiểm Tra Duy Nhất </button> </div> </form> </div> </div> )}

      {/* MODAL 2: BULK IMPORT LEAD TU EXCEL / CSV */} <BulkLeadImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
        existingPhones={leads.map((l) => l.phone)}
      /> {/* DRAWER: THỐNG KÊ HIỆU QUẢ KÊNH LEAD ĐA KÊNH */} <ChannelAnalyticsDrawer
        isOpen={isChannelDrawerOpen}
        onClose={() => setIsChannelDrawerOpen(false)}
        leads={leads}
        onTriggerTestWebhook={handleTriggerTestWebhook}
      /> </div> );
}
