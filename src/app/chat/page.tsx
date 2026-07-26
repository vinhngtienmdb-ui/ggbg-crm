'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, Send, UserPlus, Target } from 'lucide-react';
import { ChatChannelType, ChatConversation, ChatMessage, Customer, Lead } from '@/types';
import { DEFAULT_QUICK_REPLIES, INITIAL_CHAT_CONVERSATIONS } from '@/lib/chatStore';
import { avatarColor, initials } from '@/lib/uiFormat';
import { useToast } from '@/context/ToastContext';
import { useAudit } from '@/context/AuditContext';
const QuickCreateCustomerModal = dynamic(() => import('@/components/chat/QuickCreateCustomerModal'), { ssr: false });
const QuickCreateLeadModal = dynamic(() => import('@/components/chat/QuickCreateLeadModal'), { ssr: false });

const CHANNEL_CHIP: Record<ChatChannelType, { bg: string; fg: string; label: string }> = {
  ZALO_OA: { bg: '#E4F6F8', fg: '#0E7490', label: 'Zalo OA' },
  ZALO_PERSONAL: { bg: '#E8ECFB', fg: '#1D3EA8', label: 'Zalo Cá Nhân' },
  FACEBOOK_FANPAGE: { bg: '#E8ECFB', fg: '#2E5CE6', label: 'Messenger' },
};

const STATUS_CHIP: Record<ChatConversation['status'], { bg: string; fg: string; label: string }> = {
  UNREAD: { bg: '#FDEEEE', fg: '#C22F35', label: 'Chưa đọc' },
  IN_PROGRESS: { bg: '#E8ECFB', fg: '#2E5CE6', label: 'Đang xử lý' },
  RESOLVED: { bg: '#EEF4EE', fg: '#1F7A33', label: 'Đã xong' },
};

const CHANNEL_FILTERS: ('ALL' | ChatChannelType)[] = [
  'ALL',
  'ZALO_OA',
  'ZALO_PERSONAL',
  'FACEBOOK_FANPAGE',
];

export default function OmnichannelChatPage() {
  const { showToast } = useToast();
  const { logAction } = useAudit();

  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CHAT_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState('chat_001');
  const [channelFilter, setChannelFilter] = useState<'ALL' | ChatChannelType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isCreateCustOpen, setCreateCustOpen] = useState(false);
  const [isCreateLeadOpen, setCreateLeadOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = conversations.find((c) => c.id === activeChatId) ?? conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return conversations.filter((c) => {
      if (channelFilter !== 'ALL' && c.channel_type !== channelFilter) return false;
      if (!term) return true;
      return (
        c.customer_name.toLowerCase().includes(term) ||
        c.last_message.toLowerCase().includes(term) ||
        (c.customer_phone ?? '').includes(term)
      );
    });
  }, [conversations, channelFilter, searchTerm]);

  /* -------------------------------------------------------------- handlers -- */

  const selectConversation = (id: string) => {
    setActiveChatId(id);
    // Opening a thread clears its unread marker.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread_count: 0, status: c.status === 'UNREAD' ? 'IN_PROGRESS' : c.status }
          : c,
      ),
    );
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text || !activeChat) return;

    const stamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: activeChat.id,
      sender_type: 'AGENT',
      sender_name: activeChat.assigned_rep_name || 'Super Admin (CSKH)',
      content: text,
      timestamp: stamp,
      is_read: true,
    };

    setInputMessage('');
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, last_message: text, last_message_at: stamp, messages: [...c.messages, message] }
          : c,
      ),
    );

    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeChat.id,
          content: text,
          sender_name: activeChat.assigned_rep_name,
        }),
      });
    } catch {
      /* optimistic UI already updated; delivery retries are out of scope here */
    }
  };

  const handleCustomerCreated = (customer: Customer) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              crm_customer_id: customer.id,
              customer_phone: customer.phone,
              tags: [...c.tags, 'Khách Hàng CRM'],
            }
          : c,
      ),
    );
    showToast(`＋ Đã tạo khách hàng CRM [${customer.customer_code}] ${customer.name}`);
    logAction({
      action_type: 'CUSTOMER_CREATE',
      action_description: `Tạo nhanh khách hàng từ Live Chat: ${customer.name}`,
      resource_module: 'LIVE_CHAT',
    });
  };

  const handleLeadCreated = (lead: Lead) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, crm_lead_id: lead.id, tags: [...c.tags, 'Đã Chuyển Lead'] } : c,
      ),
    );
    showToast(`🎯 Đã đẩy "${lead.full_name}" vào phễu — cột 1. Lead mới`);
    logAction({
      action_type: 'LEAD_CREATE',
      action_description: `Đẩy Lead ${lead.lead_code} vào phễu từ Live Chat`,
      resource_module: 'LIVE_CHAT',
    });
  };

  /* ---------------------------------------------------------------- render -- */

  if (!activeChat) {
    return <p className="p-6 text-[12.5px] text-ink-500">Chưa có hội thoại nào.</p>;
  }

  const activeStatus = STATUS_CHIP[activeChat.status];

  return (
    <div className="grid h-full min-h-0 animate-fadeUp gap-3.5 lg:[grid-template-columns:270px_1fr_270px]">
      {/* Column 1 — inbox */}
      <div className="dc-card flex min-h-0 flex-col overflow-hidden">
        <div className="border-b border-line-soft px-3.5 py-3">
          <h2 className="mb-2.5 text-[13px] font-extrabold text-ink-900">Hội thoại đa kênh</h2>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <input
              className="dc-input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm hội thoại…"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {CHANNEL_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setChannelFilter(f)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold transition-colors ${
                  channelFilter === f
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-line bg-white text-ink-700 hover:border-line-strong'
                }`}
              >
                {f === 'ALL' ? 'Tất cả' : CHANNEL_CHIP[f].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => {
            const chip = CHANNEL_CHIP[c.channel_type];
            const isActive = c.id === activeChatId;
            return (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`w-full border-b border-line-soft border-l-[3px] px-3.5 py-3 text-left transition-colors ${
                  isActive ? 'border-l-brand-600 bg-brand-50' : 'border-l-transparent bg-white hover:bg-surface-subtle'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="truncate text-xs font-extrabold text-ink-900">{c.customer_name}</span>
                  <span className="shrink-0 text-[10px] text-ink-400">{c.last_message_at}</span>
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="dc-tag" style={{ background: chip.bg, color: chip.fg }}>
                    {chip.label}
                  </span>
                  {c.unread_count > 0 && (
                    <span className="min-w-[15px] rounded-full bg-danger-dot px-[5px] py-px text-center text-[9.5px] font-extrabold text-white">
                      {c.unread_count}
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-[11px] text-ink-500">{c.last_message}</p>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <p className="px-3.5 py-10 text-center text-[11.5px] text-ink-500">Không có hội thoại phù hợp.</p>
          )}
        </div>
      </div>

      {/* Column 2 — thread */}
      <div className="dc-card flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
          <span
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
            style={{ background: avatarColor(activeChat.customer_name) }}
          >
            {initials(activeChat.customer_name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-extrabold text-ink-900">{activeChat.customer_name}</p>
            <p className="truncate text-[10.5px] text-ink-500">
              {activeChat.channel_name} · Phụ trách: {activeChat.assigned_rep_name}
            </p>
          </div>
          <span className="dc-chip shrink-0" style={{ background: activeStatus.bg, color: activeStatus.fg }}>
            {activeStatus.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-surface-subtle p-4">
          {activeChat.messages.map((m) => {
            const isAgent = m.sender_type === 'AGENT';
            const isSystem = m.sender_type === 'SYSTEM';

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center">
                  <span className="rounded-full bg-line-soft px-3 py-1.5 text-[11px] text-ink-500">
                    {m.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={m.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] px-3 py-2.5 ${
                    isAgent
                      ? 'rounded-[12px_12px_3px_12px] bg-brand-600 text-white'
                      : 'rounded-[12px_12px_12px_3px] border border-line bg-white text-ink-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-xs">{m.content}</p>
                  <p className={`mt-1 text-right text-[9.5px] ${isAgent ? 'text-white/70' : 'text-ink-400'}`}>
                    {m.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 border-t border-line-soft p-3">
          <input
            className="dc-input flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập tin nhắn… (Enter để gửi)"
          />
          <button type="submit" className="dc-btn-primary !px-4">
            Gửi <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Column 3 — CRM context (desktop only, matching the design) */}
      <div className="hidden min-h-0 flex-col gap-3 overflow-y-auto lg:flex">
        <div className="dc-card px-[15px] py-3.5">
          <p className="mb-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.7px] text-ink-500">
            Ngữ cảnh CRM
          </p>
          <p className="text-xs font-bold text-ink-900">{activeChat.customer_name}</p>
          <p className="dc-num text-[11px] text-ink-500">
            {activeChat.customer_phone ?? '—'} · {activeChat.customer_email ?? '—'}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {activeChat.tags.map((t) => (
              <span key={t} className="rounded-full bg-line-soft px-2 py-0.5 text-[9.5px] font-bold text-ink-700">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-[7px]">
            <button
              onClick={() => setCreateCustOpen(true)}
              disabled={Boolean(activeChat.crm_customer_id)}
              className="dc-btn-success w-full"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {activeChat.crm_customer_id ? 'Đã liên kết Khách hàng' : 'Tạo nhanh Khách hàng CRM'}
            </button>
            <button
              onClick={() => setCreateLeadOpen(true)}
              disabled={Boolean(activeChat.crm_lead_id)}
              className="dc-btn-soft w-full"
            >
              <Target className="h-3.5 w-3.5" />
              {activeChat.crm_lead_id ? 'Đã đẩy vào phễu' : 'Đẩy Lead vào phễu'}
            </button>
          </div>
        </div>

        <div className="dc-card flex-1 px-[15px] py-3.5">
          <p className="mb-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.7px] text-ink-500">
            Câu trả lời mẫu (1-click)
          </p>

          <div className="flex flex-col gap-[7px]">
            {DEFAULT_QUICK_REPLIES.map((macro) => (
              <button
                key={macro.id}
                onClick={() => setInputMessage(macro.content)}
                className="rounded-lg border border-line bg-surface-subtle px-[11px] py-2 text-left transition-colors hover:border-brand-600 hover:bg-brand-50"
              >
                <p className="text-[11.5px] font-bold text-ink-900">{macro.title}</p>
                <p className="mt-px text-[9.5px] font-bold text-plum-fg">{macro.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <QuickCreateCustomerModal
        isOpen={isCreateCustOpen}
        onClose={() => setCreateCustOpen(false)}
        chat={activeChat}
        onCustomerCreated={handleCustomerCreated}
      />

      <QuickCreateLeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setCreateLeadOpen(false)}
        chat={activeChat}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
}
