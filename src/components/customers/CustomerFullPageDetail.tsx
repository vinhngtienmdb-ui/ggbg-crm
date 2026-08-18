'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  ShieldCheck,
  Coins,
  Calendar,
  Clock,
  Plus,
  Edit,
  ExternalLink,
  Users,
  Target,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Send,
  MessageSquare,
  History,
  TrendingUp,
  Tag,
  ChevronRight,
  UserPlus,
  DollarSign
} from 'lucide-react';
import { Customer, CustomerContactPerson, Lead } from '@/types';
import { formatNumber, formatCurrency } from '@/lib/formatters';

interface CustomerFullPageDetailProps {
  customer: Customer;
  leads?: Lead[];
  onBack: () => void;
  onEdit: (customer: Customer) => void;
  onKyc: (customer: Customer) => void;
  onRequestCredit: (customer: Customer) => void;
  onCreateLeadForCustomer: (customer: Customer) => void;
}

export default function CustomerFullPageDetail({
  customer,
  leads = [],
  onBack,
  onEdit,
  onKyc,
  onRequestCredit,
  onCreateLeadForCustomer,
}: CustomerFullPageDetailProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTACTS' | 'LEADS' | 'CREDIT' | 'KYC' | 'TIMELINE'>('OVERVIEW');

  // Filter linked leads
  const linkedLeads = leads.filter(
    (l) => l.customer_id === customer.id || l.phone === customer.phone || l.tax_code === customer.tax_code
  );

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Platinum':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Gold':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Silver':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
      default:
        return 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const getLifecycleBadge = (stage: string) => {
    switch (stage) {
      case 'Prospect':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'VIP':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'Churn Risk':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* TOP STICKY BREADCRUMB & EXECUTIVE ACTION BAR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Danh Sách</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-500">Khách Hàng</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
              {customer.customer_code}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onEdit(customer)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              <span>Chỉnh Sửa Hồ Sơ</span>
            </button>

            <button
              onClick={() => onKyc(customer)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thẩm Định KYC</span>
            </button>

            <button
              onClick={() => onRequestCredit(customer)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Đề Xuất Hạn Mức Tín Dụng</span>
            </button>

            <button
              onClick={() => onCreateLeadForCustomer(customer)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tạo Lead Mới Cho KH Này</span>
            </button>
          </div>
        </div>

        {/* Customer Identity Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              {customer.entity_type === 'ENTERPRISE' ? (
                <Building2 className="w-7 h-7" />
              ) : customer.entity_type === 'HOUSEHOLD_BUSINESS' ? (
                <Store className="w-7 h-7" />
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {customer.name}
                </h1>

                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {customer.customer_code}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {customer.entity_type === 'ENTERPRISE'
                    ? '🏢 Doanh Nghiệp'
                    : customer.entity_type === 'HOUSEHOLD_BUSINESS'
                    ? '🏪 Hộ Kinh Doanh'
                    : '👤 Cá Nhân'}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTierBadge(customer.tier)}`}>
                  ⭐ Hạng {customer.tier}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getLifecycleBadge(customer.lifecycle_stage)}`}>
                  ● {customer.lifecycle_stage}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {customer.tax_code && (
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> MST: <strong>{customer.tax_code}</strong>
                  </span>
                )}
                {customer.household_reg_num && (
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Số ĐKKD: <strong>{customer.household_reg_num}</strong>
                  </span>
                )}
                {customer.id_card_number && (
                  <span className="flex items-center gap-1 font-mono">
                    <User className="w-3.5 h-3.5 text-slate-500" /> CCCD: <strong>{customer.id_card_number}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {customer.phone}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-purple-600" /> {customer.email}
                </span>
                <span>Phụ trách: <strong className="text-slate-800 dark:text-slate-200">{customer.owner_name || 'Chưa phân bổ'}</strong></span>
              </div>
            </div>
          </div>

          {/* KYC Status Pill */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-right">
              <span className="text-[10.5px] font-semibold text-slate-500 uppercase block">Trạng Thái Thẩm Định KYC</span>
              <span className={`inline-flex items-center gap-1 font-semibold text-xs mt-0.5 ${
                customer.kyc_status === 'VERIFIED'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : customer.kyc_status === 'REJECTED'
                  ? 'text-red-600'
                  : 'text-amber-600'
              }`}>
                {customer.kyc_status === 'VERIFIED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Xác Thực Chuẩn Pháp Lý
                  </>
                ) : customer.kyc_status === 'REJECTED' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Hồ Sơ Bị Từ Chối
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Đang Chờ Bổ Sung Giấy Tờ
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-COLUMN HERO KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Tổng Doanh Số LTV</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatNumber(customer.ltv_total_spent || 0)} ₫
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">Doanh số trọn đời khách hàng</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Hạn Mức Tín Dụng</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
              {formatNumber(customer.credit_limit_info?.approved_limit || 0)} ₫
            </p>
            <p className="text-[11px] text-slate-500">
              {customer.credit_limit_info?.status === 'APPROVED' ? '✓ Đã duyệt 3 cấp quy định' : 'Chưa cấp hạn mức'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Sức Khỏe Khách Hàng</span>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
              {customer.health_score || 100} / 100
            </p>
            <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
              {customer.lifecycle_reason || 'Độ tương tác cao'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Cơ Hội & Lead Bán Hàng</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              {linkedLeads.length} Cơ Hội
            </p>
            <p className="text-[11px] text-slate-500">
              {linkedLeads.filter((l) => l.stage_id === 'stage_6').length} Deal chốt thành công
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-PAGE TABS NAVIGATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: '🏢 Tổng Quan & Pháp Lý', count: null },
            { id: 'CONTACTS', label: '👥 Danh Bạ Người Liên Hệ', count: customer.contacts?.length || 0 },
            { id: 'LEADS', label: '🎯 Phễu Cơ Hội & Lead', count: linkedLeads.length },
            { id: 'CREDIT', label: '💳 Tín Dụng & Công Nợ', count: null },
            { id: 'KYC', label: '📁 Tài Liệu & KYC', count: null },
            { id: 'TIMELINE', label: '🕒 Lịch Sử Tương Tác', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-blue-200/60 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TỔNG QUAN & PHÁP LÝ */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Legal Identity */}
              <div className="p-5 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-2.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Hồ Sơ Định Danh Pháp Lý</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tên Đơn Vị / Thể Nhân:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {customer.company_name || customer.household_name || customer.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Mã Số Thuế / Số ĐKKD:</span>
                    <p className="font-semibold font-mono text-blue-700 dark:text-blue-400 mt-0.5">
                      {customer.tax_code || customer.household_reg_num || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Người Đại Diện Pháp Luật:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{customer.name}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Số CCCD / Ngày Cấp:</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                      {customer.id_card_number || '—'} {customer.id_card_issue_date ? `(${customer.id_card_issue_date})` : ''}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Nơi Cấp CCCD:</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                      {customer.id_card_issue_place || 'Cục Cảnh sát QLHC về trật tự xã hội'}
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 block text-[11px]">Địa Chỉ Trụ Sở Chính / Thường Trú (Chuẩn 2025):</span>
                    <p className="font-medium text-slate-900 dark:text-white mt-0.5 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{customer.address || 'Chưa cập nhật địa chỉ hành chính'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: Account & CRM Governance */}
              <div className="p-5 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Quản Trị Vòng Đời & Phân Hạng CRM</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phân Hạng Tự Động:</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold mt-1 border ${getTierBadge(customer.tier)}`}>
                      ⭐ Hạng {customer.tier}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Cập nhật: {customer.tier_auto_updated_at || '2026-08-18'}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Giai Đoạn Vòng Đời:</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold mt-1 border ${getLifecycleBadge(customer.lifecycle_stage)}`}>
                      ● {customer.lifecycle_stage}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Cập nhật: {customer.lifecycle_auto_updated_at || '2026-08-18'}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Lý Do Chuyển Đổi Vòng Đời Hệ Thống:</span>
                    <p className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-[11.5px] mt-1">
                      {customer.lifecycle_reason || 'Khởi tạo và đồng bộ tự động từ Phễu Bán Hàng Lead'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Chuyên Viên Sale Phụ Trách:</span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{customer.owner_name || 'Chưa phân bổ'}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Ngày Tiếp Nhận Hệ Thống:</span>
                    <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">{customer.created_at || '2026-08-18 09:00'}</p>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 block text-[11px] mb-1.5">Nhãn Gắn Thẻ Phân Loại (Tags):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {customer.tags && customer.tags.length > 0 ? (
                        customer.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-400" />
                            #{t}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Chưa gắn thẻ</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DANH BẠ NGƯỜI LIÊN HỆ TRONG ĐƠN VỊ */}
        {/* ========================================================================= */}
        {activeTab === 'CONTACTS' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Danh Bạ Người Liên Hệ Trong Tổ Chức
                </h3>
                <p className="text-xs text-slate-500">
                  Hỗ trợ lưu trữ nhiều đầu mối liên hệ (Chủ DN, Kế toán trưởng, Trợ lý, Phụ trách kỹ thuật...)
                </p>
              </div>
              <button
                onClick={() => onEdit(customer)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Thêm Người Liên Hệ
              </button>
            </div>

            {(!customer.contacts || customer.contacts.length === 0) ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                Chưa có người liên hệ phụ. Bấm <strong>Chỉnh Sửa Hồ Sơ</strong> để thêm danh bạ.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.contacts.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      c.is_primary
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-2xs'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{c.name}</p>
                          <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">{c.role_title}</p>
                        </div>
                      </div>
                      {c.is_primary && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[9.5px] font-semibold rounded-full shrink-0">
                          Chính
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                      </p>
                      {c.email && (
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono text-[11px] truncate">
                          <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                        </p>
                      )}
                      {c.notes && (
                        <p className="text-[10.5px] text-slate-400 italic pt-1">
                          "{c.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PHỄU BÁN HÀNG & CƠ HỘI (SALES LEADS) */}
        {/* ========================================================================= */}
        {activeTab === 'LEADS' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Danh Sách Lead & Cơ Hội Bán Hàng Liên Kết
                </h3>
                <p className="text-xs text-slate-500">
                  Theo dõi tiến độ phễu 7 bước và các gói dịch vụ khách hàng đang quan tâm
                </p>
              </div>
              <button
                onClick={() => onCreateLeadForCustomer(customer)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> + Tạo Lead Mới Cho KH Này
              </button>
            </div>

            {linkedLeads.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                Chưa có Lead nào trong phễu bán hàng. Bấm nút <strong>+ Tạo Lead Mới Cho KH Này</strong> để mở cơ hội tư vấn.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10.5px]">
                      <th className="p-3">Mã Lead</th>
                      <th className="p-3">Sản Phẩm / Dịch Vụ Quan Tâm</th>
                      <th className="p-3">Kênh Tiếp Nhận</th>
                      <th className="p-3">Giai Đoạn Phễu Bán Hàng</th>
                      <th className="p-3">Điểm Đánh Giá</th>
                      <th className="p-3">Sale Phụ Trách</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {linkedLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                        <td className="p-3 font-mono font-semibold text-blue-700 dark:text-blue-400">
                          {l.lead_code}
                        </td>
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                          {l.interested_product_name || 'Gói Vận Hành TMĐT'}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px]">
                            {l.source_name || 'Trực Tiếp'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                            l.stage_id === 'stage_6'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : l.stage_id === 'stage_7'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {l.stage_name || 'Đang Tư Vấn'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-purple-600">
                          {l.lead_score || 85}đ
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {l.assigned_sale_name || 'Chưa gán'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HẠN MỨC TÍN DỤNG & CÔNG NỢ */}
        {/* ========================================================================= */}
        {activeTab === 'CREDIT' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Hạn Mức Tín Dụng & Quy Trình Phê Duyệt 3 Cấp
                </h3>
                <p className="text-xs text-slate-500">
                  Theo dõi trong Phân hệ Tài Chính (`/finance`) và được xét duyệt bởi: Trưởng phòng KD $\rightarrow$ Kế toán trưởng $\rightarrow$ CEO
                </p>
              </div>
              <button
                onClick={() => onRequestCredit(customer)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" /> + Tạo Yêu Cầu Cấp Hạn Mức Mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Credit Status Card */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-slate-500 font-semibold uppercase text-[11px] block">Hạn Mức Đang Áp Dụng</span>
                <p className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">
                  {formatCurrency(customer.credit_limit_info?.approved_limit || 0)}
                </p>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-2 border-t">
                  <p>Trạng thái: <strong>{customer.credit_limit_info?.status || 'Chưa cấp'}</strong></p>
                  <p>Lý do / Căn cứ: <em>{customer.credit_limit_info?.reason || 'Hồ sơ tiêu chuẩn'}</em></p>
                </div>
              </div>

              {/* 3-Level Governance Flow */}
              <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-slate-500 font-semibold uppercase text-[11px] block">Quy Trình Phê Duyệt 3 Cấp</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cấp 1: TP Kinh Doanh
                    </p>
                    <p className="text-[11px] text-slate-500">Đánh giá tiềm năng doanh số & lịch sử hợp tác</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cấp 2: Kế Toán Trưởng
                    </p>
                    <p className="text-[11px] text-slate-500">Thẩm định dòng tiền, rủi ro nợ xấu & đối soát</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cấp 3: Tổng Giám Đốc (CEO)
                    </p>
                    <p className="text-[11px] text-slate-500">Phê duyệt quyết định cấp hạn mức tín dụng cuối cùng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: HỒ SƠ TÀI LIỆU & THẨM ĐỊNH KYC */}
        {/* ========================================================================= */}
        {activeTab === 'KYC' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Hồ Sơ Giấy Tờ & Thẩm Định Pháp Lý KYC
                </h3>
                <p className="text-xs text-slate-500">
                  Lưu trữ Giấy phép ĐKKD, CCCD Người đại diện, Hợp đồng và Biên bản làm việc
                </p>
              </div>
              <button
                onClick={() => onKyc(customer)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Thẩm Định / Cập Nhật KYC
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">Giấy Phép ĐKKD</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">✓ Đã duyệt</span>
                </div>
                <p className="text-[11px] text-slate-500">Tệp: GPDKKD_Signed_2026.pdf</p>
                <button className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-1">
                  <Download className="w-3 h-3" /> Tải về xem
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">CCCD Người Đại Diện</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">✓ Đã duyệt</span>
                </div>
                <p className="text-[11px] text-slate-500">Tệp: CCCD_MatTruoc_Sau.jpg</p>
                <button className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-1">
                  <Download className="w-3 h-3" /> Tải về xem
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">Hợp Đồng Nguyên Tắc</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">📄 Đang hiệu lực</span>
                </div>
                <p className="text-[11px] text-slate-500">Tệp: HDNT_GGBG_2026.pdf</p>
                <button className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-1">
                  <Download className="w-3 h-3" /> Tải về xem
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: LỊCH SỬ TƯƠNG TÁC & CHĂM SÓC */}
        {/* ========================================================================= */}
        {activeTab === 'TIMELINE' && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Dòng Thời Gian Tương Tác & Lịch Sử Chăm Sóc
            </h3>

            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2 pt-2 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                <p className="font-semibold text-slate-900 dark:text-slate-100">Đồng bộ hồ sơ tự động từ Phễu Bán Hàng</p>
                <p className="text-slate-500 text-[11px]">Hệ thống CRM tự động khởi tạo hồ sơ Prospect</p>
                <span className="text-[10px] text-slate-400 font-mono">2026-08-18 09:30</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900" />
                <p className="font-semibold text-slate-900 dark:text-slate-100">Cuộc gọi tư vấn giải pháp TMĐT đa kênh</p>
                <p className="text-slate-500 text-[11px]">Sale phụ trách đã tư vấn gói quản trị Shopee & TikTok Mall</p>
                <span className="text-[10px] text-slate-400 font-mono">2026-08-17 14:15</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-purple-600 border-2 border-white dark:border-slate-900" />
                <p className="font-semibold text-slate-900 dark:text-slate-100">Tiếp nhận thông tin định danh MST & CCCD</p>
                <p className="text-slate-500 text-[11px]">Khách hàng gửi bổ sung giấy phép kinh doanh</p>
                <span className="text-[10px] text-slate-400 font-mono">2026-08-16 10:00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
