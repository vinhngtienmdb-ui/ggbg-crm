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
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  History,
  TrendingUp,
  Tag,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Award,
  Layers,
  Zap,
  PhoneCall,
  Save,
  Plus
} from 'lucide-react';
import { Lead, VoIPCallLog } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/formatters';

const SEVEN_STAGES = [
  { id: 'stage_1', name: '1. Tiếp Nhận', color: '#3B82F6' },
  { id: 'stage_2', name: '2. Liên Hệ', color: '#06B6D4' },
  { id: 'stage_3', name: '3. Tư Vấn', color: '#F59E0B' },
  { id: 'stage_4', name: '4. Báo Giá', color: '#8B5CF6' },
  { id: 'stage_5', name: '5. Đàm Phán', color: '#EC4899' },
  { id: 'stage_6', name: '6. Chốt Thành Công', color: '#10B981' },
  { id: 'stage_7', name: '7. Thất Bại', color: '#EF4444' },
];

interface LeadFullPageDetailProps {
  lead: Lead;
  onBack: () => void;
  onUpdateStage: (leadId: string, newStageId: string, newStageName: string) => void;
  onNavigateCustomer?: (customerId: string) => void;
}

export default function LeadFullPageDetail({
  lead,
  onBack,
  onUpdateStage,
  onNavigateCustomer,
}: LeadFullPageDetailProps) {
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    'Khách hàng đang tìm kiếm giải pháp vận hành Shopee Mall và TikTok Shop cho mùa Mega Sale Q3/2026.',
    'Đã gửi proposal giải pháp gói Agency Full Services qua email.',
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotesList([newNote, ...notesList]);
    setNewNote('');
  };

  const currentStageIndex = SEVEN_STAGES.findIndex((s) => s.id === lead.stage_id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* TOP ACTION BAR & BREADCRUMB */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Phễu Bán Hàng</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-500">Phễu Lead</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
              {lead.lead_code}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {lead.customer_id && onNavigateCustomer && (
              <button
                onClick={() => onNavigateCustomer(lead.customer_id!)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem Hồ Sơ Khách Hàng CRM</span>
              </button>
            )}

            <button
              onClick={() => {
                if (lead.phone) {
                  window.location.href = `tel:${lead.phone}`;
                }
              }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gọi Điện Tư Vấn</span>
            </button>

            <button
              onClick={() => {
                window.location.href = '/proposals';
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Tạo Báo Giá / Đề Xuất</span>
            </button>
          </div>
        </div>

        {/* Lead Identity Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
              {lead.entity_type === 'ENTERPRISE' ? (
                <Building2 className="w-7 h-7" />
              ) : lead.entity_type === 'HOUSEHOLD_BUSINESS' ? (
                <Store className="w-7 h-7" />
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {lead.company_name || lead.full_name}
                </h1>

                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {lead.lead_code}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {lead.entity_type === 'ENTERPRISE'
                    ? '🏢 Doanh Nghiệp'
                    : lead.entity_type === 'HOUSEHOLD_BUSINESS'
                    ? '🏪 Hộ Kinh Doanh'
                    : '👤 Cá Nhân'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  ⚡ AI Score: {lead.lead_score || 85}đ
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Liên hệ: <strong className="text-slate-900 dark:text-slate-100">{lead.full_name}</strong></span>
                <span className="font-mono">SĐT: <strong>{lead.phone}</strong></span>
                {lead.email && <span className="font-mono">Email: <strong>{lead.email}</strong></span>}
                <span>Kênh: <strong className="text-blue-600">{lead.source_name || 'Facebook Ads'}</strong></span>
                <span>Sale phụ trách: <strong className="text-slate-900 dark:text-slate-100">{lead.assigned_sale_name || 'Chưa gán'}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-right shrink-0">
            <span className="text-[10.5px] font-semibold text-slate-500 uppercase block">Dự Toán Ngân Sách</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatNumber(lead.estimated_budget || 0)} ₫
            </span>
          </div>
        </div>

        {/* 7-Stage Interactive Pipeline Flow */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-2">
            Tiến Độ Phễu Bán Hàng 7 Bước (Bấm Để Chuyển Giai Đoạn Nhanh)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {SEVEN_STAGES.map((stg, idx) => {
              const isActive = lead.stage_id === stg.id;
              const isPassed = currentStageIndex > idx && lead.stage_id !== 'stage_7';

              return (
                <button
                  key={stg.id}
                  onClick={() => onUpdateStage(lead.id, stg.id, stg.name)}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer text-xs ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                      : isPassed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                    <span>Bước {idx + 1}</span>
                    {isActive ? '● Hiện tại' : isPassed ? '✓ Xong' : ''}
                  </div>
                  <p className="text-xs truncate mt-0.5">{stg.name.split('. ')[1] || stg.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-COLUMN FULL-PAGE WORKSPACE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead & Legal Identity */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs font-medium">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Hồ Sơ Nhu Cầu Khách Hàng</span>
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Sản Phẩm / Gói Dịch Vụ Quan Tâm:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                {lead.interested_product_name || 'Gói Vận Hành TMĐT Toàn Diện'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Mã Số Thuế / Số ĐKKD:</span>
              <p className="font-mono text-blue-700 dark:text-blue-400 mt-0.5">
                {lead.tax_code || 'Chưa cập nhật'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Địa Chỉ Hoạt Động (Chuẩn 2025):</span>
              <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                {lead.address || 'Hà Nội / TP. Hồ Chí Minh'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Trạng Thái Hồ Sơ:</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10.5px] border border-blue-200 mt-1">
                {lead.status || 'Đang Tư Vấn'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Thời Gian Tiếp Nhận:</span>
              <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                {lead.created_at || '2026-08-18 09:00'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column: Consultation Notes & Activity */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs font-medium">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Ghi Chú Tư Vấn & Trao Đổi</span>
          </h3>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Nhập nội dung cuộc gọi hoặc ghi chú tư vấn..."
              className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
            />
            <button
              onClick={handleAddNote}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              + Lưu Ghi Chú Tư Vấn
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Lịch Sử Ghi Chú:</span>
            {notesList.map((note, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-slate-800 dark:text-slate-200">{note}</p>
                <span className="text-[10px] text-slate-400 font-mono block">2026-08-18 • Sale Phụ Trách</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stage Audit Trail & CRM Actions */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs font-medium">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <History className="w-4 h-4 text-purple-600" />
            <span>Dòng Thời Gian Chuyển Bước</span>
          </h3>

          <div className="relative pl-5 space-y-4 border-l-2 border-slate-200 dark:border-slate-700 ml-1.5 pt-1 text-xs">
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
              <p className="font-semibold text-slate-900 dark:text-slate-100">Giai đoạn: {lead.stage_name}</p>
              <p className="text-slate-500 text-[11px]">Đang tiếp tục chăm sóc và đàm phán</p>
              <span className="text-[10px] text-slate-400 font-mono">2026-08-18 10:00</span>
            </div>

            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
              <p className="font-semibold text-slate-900 dark:text-slate-100">Tiếp nhận từ kênh {lead.source_name}</p>
              <p className="text-slate-500 text-[11px]">Hệ thống phân bổ cho {lead.assigned_sale_name}</p>
              <span className="text-[10px] text-slate-400 font-mono">{lead.created_at || '2026-08-18 09:00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
