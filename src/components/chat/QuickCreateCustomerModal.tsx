'use client';

import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, Building2, Phone, Mail, FileText } from 'lucide-react';
import { Customer, CustomerEntityType, CustomerTier, ChatConversation } from '@/types';

interface QuickCreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatConversation;
  onCustomerCreated: (newCustomer: Customer) => void;
}

export default function QuickCreateCustomerModal({
  isOpen,
  onClose,
  chat,
  onCustomerCreated,
}: QuickCreateCustomerModalProps) {
  const [name, setName] = useState(chat.customer_name || '');
  const [phone, setPhone] = useState(chat.customer_phone || '');
  const [email, setEmail] = useState(chat.customer_email || '');
  const [companyName, setCompanyName] = useState('');
  const [entityType, setEntityType] = useState<CustomerEntityType>('ENTERPRISE');
  const [tier, setTier] = useState<CustomerTier>('Gold');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `KH-${Math.floor(8000 + Math.random() * 1000)}`;

    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      customer_code: newCode,
      name: name.trim(),
      entity_type: entityType,
      company_name: companyName.trim() || (entityType === 'ENTERPRISE' ? 'Doanh Nghiệp Mới' : 'Hộ Kinh Doanh Mới'),
      phone: phone.trim() || '0988****999',
      email: email.trim() || `${newCode.toLowerCase()}@ggbingo.vn`,
      customer_type: 'B2B_Agency_Service',
      tier: tier,
      lifecycle_stage: 'VIP',
      health_score: 85,
      ltv_total_spent: 150000000,
      ecom_platforms: ['Shopee', 'TikTokShop', 'GGBingoVN'],
      avg_monthly_gmv: 250000000,
      owner_name: chat.assigned_rep_name,
      kyc_status: 'VERIFIED',
      tags: ['Tạo từ Live Chat', chat.channel_name],
      created_at: new Date().toISOString().substring(0, 10),
    };

    onCustomerCreated(newCust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-50 text-slate-900 border-b border-blue-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tạo Nhanh Khách Hàng CRM</h3>
              <p className="text-xs text-slate-500">Trích xuất trực tiếp từ cuộc hội thoại chat {chat.channel_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
            <span className="font-bold text-blue-900">Kênh Nguồn Chat:</span>
            <span className="tabular-nums font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              {chat.channel_name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Loại Hình Khách Hàng</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="ENTERPRISE">🏢 Doanh Nghiệp (B2B)</option>
                <option value="INDIVIDUAL">👤 Cá Nhân / HKD (B2C)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phân Hạng Dự Kiến</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Standard">Standard</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold Merchant</option>
                <option value="VIP">VIP Partner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ Và Tên Khách Hàng *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên Công Ty / Gian Hàng Shop</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ví dụ: Công ty Mỹ Phẩm Bảo An / Shop MiuStore"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20"
            >
              Tạo Hồ Sơ Khách Hàng CRM & Tự Động Liên Kết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
