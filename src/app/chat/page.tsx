'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Zap,
  UserPlus,
  Target,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  Crown,
  Sparkles,
  UserCheck,
  Clock,
  ChevronRight,
  Plus,
  ShieldCheck,
  Tag,
  Smile,
  X,
  FileText,
  User,
  ExternalLink,
  Layers
} from 'lucide-react';
import {
  ChatConversation,
  ChatMessage,
  ChatChannelType,
  Customer,
  Lead
} from '@/types';
import {
  INITIAL_CHAT_CONVERSATIONS,
  DEFAULT_QUICK_REPLIES
} from '@/lib/chatStore';
import dynamic from 'next/dynamic';

const QuickCreateCustomerModal = dynamic(() => import('@/components/chat/QuickCreateCustomerModal'), { ssr: false });
const QuickCreateLeadModal = dynamic(() => import('@/components/chat/QuickCreateLeadModal'), { ssr: false });

export default function OmnichannelChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CHAT_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>('chat_001');

  // Channel & Search filters
  const [selectedChannel, setSelectedChannel] = useState<'ALL' | ChatChannelType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'IN_PROGRESS'>('ALL');

  // Input message state
  const [inputMessage, setInputMessage] = useState('');
  const [showMacrosMenu, setShowMacrosMenu] = useState(false);

  // Modals & Notifications
  const [isCreateCustOpen, setIsCreateCustOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (selectedChannel !== 'ALL' && c.channel_type !== selectedChannel) return false;
    if (statusFilter === 'UNREAD' && c.unread_count === 0) return false;
    if (statusFilter === 'IN_PROGRESS' && c.status !== 'IN_PROGRESS') return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        c.customer_name.toLowerCase().includes(term) ||
        c.last_message.toLowerCase().includes(term) ||
        (c.customer_phone && c.customer_phone.includes(term))
      );
    }
    return true;
  });

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setShowMacrosMenu(false);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: activeChat.id,
      sender_type: 'AGENT',
      sender_name: activeChat.assigned_rep_name || 'Super Admin (CSKH)',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      is_read: true,
    };

    setConversations((prev) => prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            last_message: messageText,
            last_message_at: newMsg.timestamp,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Call API background
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeChat.id,
          content: messageText,
          sender_name: activeChat.assigned_rep_name,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleSelectMacro = (macroContent: string) => {
    setInputMessage(macroContent);
    setShowMacrosMenu(false);
  };

  // Handle Customer Created
  const handleCustomerCreated = (newCust: Customer) => {
    setConversations((prev) => prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            crm_customer_id: newCust.id,
            customer_phone: newCust.phone,
            tags: [...c.tags, 'Khách Hàng CRM'],
          };
        }
        return c;
      })
    );

    setToastMessage(`🎉 Đã tạo thành công Khách Hàng CRM [${newCust.customer_code}] ${newCust.name} và tự động liên kết với hội thoại!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  // Handle Lead Created
  const handleLeadCreated = (newLead: Lead) => {
    setConversations((prev) => prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            crm_lead_id: newLead.id,
            tags: [...c.tags, 'Đã Chuyển Lead'],
          };
        }
        return c;
      })
    );

    setToastMessage(`Đã đẩy thành công Lead [${newLead.lead_code}] ${newLead.full_name} vào Phễu Bán Hàng!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const renderChannelBadge = (channel: ChatChannelType) => {
    switch (channel) {
      case 'ZALO_OA':
        return ( <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold flex items-center gap-1"> Zalo OA </span> );
      case 'ZALO_PERSONAL':
        return ( <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold flex items-center gap-1"> Zalo Cá Nhân </span> );
      case 'FACEBOOK_FANPAGE':
        return ( <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold flex items-center gap-1"> Fanpage FB </span> );
      default:
        return null;
    }
  };

  return ( <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4"> {/* Toast Notification */}
      {toastMessage && ( <div className="p-4 rounded-xl bg-purple-600 text-white font-medium text-xs shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top duration-300"> <div className="flex items-center gap-2"> <CheckCircle2 className="w-5 h-5 text-purple-200" /> <span>{toastMessage}</span> </div> <button onClick={() => setToastMessage('')} className="p-1 hover:bg-purple-700 rounded-lg"> <X className="w-4 h-4" /> </button> </div> )}

      {/* Main 3-Column Chat Layout */} <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row"> {/* COLUMN 1: UNIFIED OMNICHANNEL INBOX (LEFT) */} <div className="w-full md:w-80 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 shrink-0"> {/* Header & Search */} <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900"> <div className="flex items-center justify-between"> <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2"> <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Hội Thoại Đa Kênh </h2> <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-medium rounded-md border border-blue-100 dark:border-blue-800"> {filteredConversations.length} Hội Thoại </span> </div> <div className="relative"> <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm người chat, SĐT, tin nhắn..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              /> </div> {/* Channel Filter Pills */} <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium"> <button
                onClick={() => setSelectedChannel('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                  selectedChannel === 'ALL' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              > Tất Cả </button> <button
                onClick={() => setSelectedChannel('ZALO_OA')}
                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                  selectedChannel === 'ZALO_OA' ? 'bg-blue-600 text-white font-semibold' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              > Zalo OA </button> <button
                onClick={() => setSelectedChannel('ZALO_PERSONAL')}
                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                  selectedChannel === 'ZALO_PERSONAL' ? 'bg-cyan-600 text-white font-semibold' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                }`}
              > Zalo Cá Nhân </button> <button
                onClick={() => setSelectedChannel('FACEBOOK_FANPAGE')}
                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                  selectedChannel === 'FACEBOOK_FANPAGE' ? 'bg-indigo-600 text-white font-semibold' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              > Fanpage FB </button> </div> </div> {/* Conversations List */} <div className="flex-1 overflow-y-auto divide-y divide-slate-100"> {filteredConversations.length === 0 ? ( <div className="p-8 text-center text-slate-400 text-xs italic"> Không tìm thấy cuộc hội thoại chat phù hợp. </div> ) : (
              filteredConversations.map((chat) => {
                const isActive = chat.id === activeChatId;
                return ( <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setConversations((prev) => prev.map((c) => (c.id === chat.id ? { ...c, unread_count: 0 } : c))
                      );
                    }}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                    }`}
                  > {/* Avatar */} <div className="relative shrink-0"> <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-medium text-sm flex items-center justify-center border border-blue-200"> {chat.customer_name.substring(0, 2).toUpperCase()} </div> {chat.unread_count > 0 && ( <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-medium rounded-full flex items-center justify-center border border-white"> {chat.unread_count} </span> )} </div> {/* Meta */} <div className="flex-1 min-w-0"> <div className="flex items-center justify-between gap-1 mb-0.5"> <span className="font-medium text-xs text-slate-900 truncate">{chat.customer_name}</span> <span className="text-[10px] font-mono text-slate-400 shrink-0">{chat.last_message_at}</span> </div> <p className="text-[11px] text-slate-500 truncate mb-1">{chat.last_message}</p> <div className="flex items-center justify-between gap-1"> {renderChannelBadge(chat.channel_type)}

                        {chat.crm_customer_id ? ( <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded"> ✓ CRM 360 </span> ) : ( <span className="text-[9px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded"> Mới (Chưa lưu) </span> )} </div> </div> </button> );
              })
            )} </div> </div> {/* COLUMN 2: LIVE CHAT STREAM (MIDDLE) */}
        {activeChat ? ( <div className="flex-1 flex flex-col h-full bg-white"> {/* Active Chat Header */} <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-medium text-sm flex items-center justify-center"> {activeChat.customer_name.substring(0, 2).toUpperCase()} </div> <div> <div className="flex items-center gap-2"> <h3 className="font-semibold text-sm text-slate-900">{activeChat.customer_name}</h3> {renderChannelBadge(activeChat.channel_type)} </div> <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5"> <span>SĐT: <strong className="font-mono text-slate-800">{activeChat.customer_phone || 'Chưa cập nhật'}</strong></span> <span>• Phụ trách: <strong className="text-blue-700">{activeChat.assigned_rep_name}</strong></span> </p> </div> </div> {/* Tags */} <div className="hidden sm:flex items-center gap-1.5"> {activeChat.tags.map((t, idx) => ( <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold border border-slate-200"> #{t} </span> ))} </div> </div> {/* Chat Messages Body */} <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30"> {activeChat.messages.map((msg) => {
                const isAgent = msg.sender_type === 'AGENT';
                return ( <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} max-w-[85%] ${
                      isAgent ? 'ml-auto' : 'mr-auto'
                    }`}
                  > <span className="text-[10px] text-slate-400 font-semibold mb-1 px-1"> {msg.sender_name} • {msg.timestamp} </span> <div
                      className={`p-3 rounded-xl text-xs leading-relaxed shadow-xs ${
                        isAgent
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none font-normal'
                      }`}
                    > {msg.content} </div> </div> );
              })} <div ref={messagesEndRef} /> </div> {/* Quick Reply Macros Popup Menu */}
            {showMacrosMenu && ( <div className="p-3 bg-white text-slate-900 border-t border-slate-200 space-y-2 animate-in slide-in-from-bottom-2 duration-200"> <div className="flex items-center justify-between text-xs font-medium border-b border-slate-200 pb-2"> <span className="flex items-center gap-1.5 text-blue-700"> <Zap className="w-4 h-4 text-blue-600" /> Thư Viện Câu Trả Lời Mẫu (Quick Replies) </span> <button onClick={() => setShowMacrosMenu(false)} className="text-slate-400 hover:text-slate-700"> <X className="w-4 h-4" /> </button> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto text-xs"> {DEFAULT_QUICK_REPLIES.map((macro) => ( <button
                      key={macro.id}
                      type="button"
                      onClick={() => handleSelectMacro(macro.content)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 transition-colors space-y-1"
                    > <p className="font-medium text-blue-700 text-[11px]">{macro.title}</p> <p className="text-[10px] text-slate-500 truncate">{macro.content}</p> </button> ))} </div> </div> )}

            {/* Chat Input Bar */} <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"> <button
                type="button"
                onClick={async () => {
                  const lastCustMsg = activeChat?.messages.filter(m => m.sender_type === 'CUSTOMER').pop()?.content || activeChat?.last_message;
                  try {
                    const res = await fetch('/api/ai/sentiment', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        message_text: lastCustMsg,
                        customer_name: activeChat?.customer_name,
                        channel: activeChat?.channel_name,
                      }),
                    });
                    const data = await res.json();
                    if (data.success && data.data.suggested_reply) {
                      setInputMessage(data.data.suggested_reply);
                    }
                  } catch {
                    // fallback
                  }
                }}
                className="p-2 rounded-lg text-xs font-semibold flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="AI Co-Pilot Phân Tích & Gợi Ý Phản Hồi Chốt Đơn"
              > <Sparkles className="w-3.5 h-3.5 text-amber-600" /> <span className="hidden sm:inline">AI Co-Pilot</span> </button> <button
                type="button"
                onClick={() => setShowMacrosMenu(!showMacrosMenu)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  showMacrosMenu ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
                title="Mở Thư Viện Câu Trả Lời Mẫu"
              > <Zap className="w-3.5 h-3.5 text-purple-600" /> <span className="hidden sm:inline">Mẫu CSKH</span> </button> <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập nội dung tin nhắn tư vấn khách hàng..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              /> <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
              > <Send className="w-4 h-4" /> <span className="hidden sm:inline">Gửi Tin</span> </button> </form> </div> ) : ( <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic"> Chọn một cuộc hội thoại chat bên trái để bắt đầu tư vấn. </div> )}

        {/* COLUMN 3: CRM CUSTOMER 360 & QUICK CREATION PANEL (RIGHT) */}
        {activeChat && ( <div className="w-full md:w-80 border-l border-slate-200/80 p-5 bg-slate-50/40 flex flex-col justify-between overflow-y-auto space-y-6 shrink-0"> {/* Header */} <div> <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5"> <UserCheck className="w-4 h-4 text-blue-600" /> Thông Tin CRM 360° Khách Hàng </h3> {activeChat.crm_customer_id ? (
                /* LINKED CRM CUSTOMER 360 PROFILE */ <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs"> <div className="flex items-center justify-between"> <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-semibold rounded-full flex items-center gap-1"> <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã Liên Kết CRM 360 </span> <span className="font-mono font-medium text-xs text-slate-900">KH-1001</span> </div> <div> <h4 className="font-semibold text-sm text-slate-900">{activeChat.customer_name}</h4> <p className="text-xs text-slate-500 font-medium">Công ty TNHH Vận Tải Hồng Lực</p> </div> <div className="p-2.5 bg-slate-50 rounded-xl space-y-1.5 text-xs"> <p className="flex justify-between"> <span className="text-slate-500">Phân hạng:</span> <strong className="text-purple-700 font-semibold">Platinum Merchant</strong> </p> <p className="flex justify-between"> <span className="text-slate-500">GMV Hàng tháng:</span> <strong className="text-emerald-700 font-mono font-semibold">850,000,000 ₫</strong> </p> <p className="flex justify-between"> <span className="text-slate-500">Sàn vận hành:</span> <strong className="text-blue-700 font-medium">Shopee, TikTok, GGBingoVN</strong> </p> <p className="flex justify-between"> <span className="text-slate-500">Trạng thái KYC:</span> <strong className="text-emerald-600 font-medium">✓ Đã Phê Duyệt</strong> </p> </div> <a
                    href="/customers"
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  > <span>Xem Hồ Sơ CRM Chi Tiết</span> <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> </a> </div> ) : (
                /* NEW CUSTOMER WARNING & QUICK CREATION ACTIONS */ <div className="space-y-4"> <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs"> <div className="flex items-center gap-2 font-medium text-amber-900"> <Sparkles className="w-4 h-4 text-amber-600" /> <span>Khách Hàng Mới (Chưa lưu trên CRM)</span> </div> <p className="text-amber-800 text-[11px] leading-relaxed"> Người dùng chat chưa được tạo hồ sơ Khách hàng hoặc Lead trên CRM. Chọn thao tác bên dưới để lưu dữ liệu tức thì. </p> </div> {/* Action 1: Create CRM Customer */} <button
                    type="button"
                    onClick={() => setIsCreateCustOpen(true)}
                    className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-between transition-all active:scale-95"
                  > <div className="flex items-center gap-2"> <UserPlus className="w-4 h-4 text-blue-200" /> <span>Tạo Nhanh Khách Hàng CRM</span> </div> <ChevronRight className="w-4 h-4 text-blue-200" /> </button> {/* Action 2: Push Lead to Sales Pipeline */} <button
                    type="button"
                    onClick={() => setIsCreateLeadOpen(true)}
                    className="w-full p-3.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-between transition-all active:scale-95"
                  > <div className="flex items-center gap-2"> <Target className="w-4 h-4 text-purple-200" /> <span>Đẩy Lead Vào Phễu Bán Hàng</span> </div> <ChevronRight className="w-4 h-4 text-purple-200" /> </button> </div> )} </div> {/* System Info */} <div className="p-3 bg-blue-50 text-slate-900 border border-blue-100 rounded-xl text-[11px] space-y-1 font-mono"> <p className="text-blue-700 font-medium"> Cổng Tích Hợp Omnichannel Live Chat</p> <p className="text-slate-500">Trạng thái: Hoạt động 100% thời gian thực</p> </div> </div> )} </div> {/* MODALS */}
      {activeChat && ( <> <QuickCreateCustomerModal
            isOpen={isCreateCustOpen}
            onClose={() => setIsCreateCustOpen(false)}
            chat={activeChat}
            onCustomerCreated={handleCustomerCreated}
          /> <QuickCreateLeadModal
            isOpen={isCreateLeadOpen}
            onClose={() => setIsCreateLeadOpen(false)}
            chat={activeChat}
            onLeadCreated={handleLeadCreated}
          /> </> )} </div> );
}
