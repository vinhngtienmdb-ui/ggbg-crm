'use client';

import React, { useState } from 'react';
import { Target, X, CheckCircle2, DollarSign, Building2, Phone } from 'lucide-react';
import { Lead, ChatConversation, LeadSource } from '@/types';

interface QuickCreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatConversation;
  onLeadCreated: (newLead: Lead) => void;
}

export default function QuickCreateLeadModal({
  isOpen,
  onClose,
  chat,
  onLeadCreated,
}: QuickCreateLeadModalProps) {
  const [fullName, setFullName] = useState(chat.customer_name || '');
  const [phone, setPhone] = useState(chat.customer_phone || '');
  const [email, setEmail] = useState(chat.customer_email || '');
  const [companyName, setCompanyName] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('180000000');

  if (!isOpen) return null;

  const mapChannelToLeadSource = (channelType: string): LeadSource => {
    if (channelType === 'ZALO_OA') return 'Zalo OA Form';
    if (channelType === 'ZALO_PERSONAL') return 'Hotline Zalo';
    return 'Facebook Lead Ads';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `LD-CHAT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead: Lead = {
      id: `lead_chat_${Date.now()}`,
      lead_code: newCode,
      full_name: fullName.trim(),
      entity_type: 'ENTERPRISE',
      phone: phone.trim() || '0988****999',
      email: email.trim() || `${newCode.toLowerCase()}@chatlead.vn`,
      company_name: companyName.trim() || 'Khách Hàng Tư Vấn Chat',
      source_name: mapChannelToLeadSource(chat.channel_type),
      pipeline_id: 'AGENCY',
      stage_id: 'stage_1',
      stage_name: '1. Tiếp Nhận Mới',
      assigned_sale_name: chat.assigned_rep_name,
      estimated_budget: Number(estimatedBudget) || 180000000,
      lead_score: 88,
      status: 'New',
      kyc_status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onLeadCreated(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-purple-50 text-slate-900 border-b border-purple-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Đẩy Lead Trực Tiếp Vào Phễu Bán Hàng</h3>
              <p className="text-xs text-slate-500">Chuyển cuộc trò chuyện {chat.channel_name} thành Lead tiềm năng</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs flex items-center justify-between">
            <span className="font-bold text-purple-900">Kênh Nguồn Đẩy Lead:</span>
            <span className="font-mono font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
              {mapChannelToLeadSource(chat.channel_type)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ Và Tên Lead *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số Điện Thoại *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên Công Ty / Gian Hàng Dự Kiến</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nhập tên doanh nghiệp hoặc shop"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ngân Sách Dự Kiến (VNĐ) *</label>
            <input
              type="number"
              required
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20"
            >
              Đẩy Lead Vào Phễu Bán Hàng (Bước 1. Tiếp Nhận Mới)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
