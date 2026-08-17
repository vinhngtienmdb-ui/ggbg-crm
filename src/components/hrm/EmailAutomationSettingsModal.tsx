'use client';

import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  X,
  Edit3,
  Save,
  FileText,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { RecruitmentEmailTemplate, EmailLogEntry } from '@/types';
import {
  getRecruitmentEmailTemplates,
  updateRecruitmentEmailTemplate,
  getEmailLogs
} from '@/lib/hrmStore';

interface EmailAutomationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailAutomationSettingsModal({ isOpen, onClose }: EmailAutomationSettingsModalProps) {
  const [templates, setTemplates] = useState<RecruitmentEmailTemplate[]>(() => getRecruitmentEmailTemplates());
  const [logs, setLogs] = useState<EmailLogEntry[]>(() => getEmailLogs());
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'LOGS'>('TEMPLATES');
  const [editingTemplate, setEditingTemplate] = useState<RecruitmentEmailTemplate | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleAutoSend = (tmplId: string, currentVal: boolean) => {
    updateRecruitmentEmailTemplate(tmplId, { is_auto_send_enabled: !currentVal });
    setTemplates([...getRecruitmentEmailTemplates()]);
    showToast(`Đã ${!currentVal ? 'BẬT' : 'TẮT'} chế độ tự động gửi email khi chuyển stage!`);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    updateRecruitmentEmailTemplate(editingTemplate.id, {
      subject: editingTemplate.subject,
      body_html: editingTemplate.body_html,
      sender_name: editingTemplate.sender_name,
    });

    setTemplates([...getRecruitmentEmailTemplates()]);
    setEditingTemplate(null);
    showToast('Đã lưu mẫu email tuyển dụng thành công!');
  };

  return ( <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"> {/* Toast Notification */}
      {toastMsg && ( <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in"> <Sparkles className="w-4 h-4 text-amber-400" /> <span className="text-sm font-semibold">{toastMsg}</span> </div> )} <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"> {/* Modal Header */} <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-900/80 dark:to-slate-900/60"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20"> <Mail className="w-5 h-5" /> </div> <div> <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2"> Tự Động Hóa Email Tuyển Dụng & Onboarding <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-medium">Automation Engine</span> </h3> <p className="text-xs text-slate-500 font-medium">Tự động gửi email thông báo khi ứng viên chuyển bước phễu (Stage Triggered)</p> </div> </div> <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
          > <X className="w-5 h-5" /> </button> </div> {/* Tab switcher */} <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4"> <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'TEMPLATES'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          > 5 Mẫu Email Tiêu Chuẩn ({templates.length}) </button> <button
            onClick={() => setActiveTab('LOGS')}
            className={`pb-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'LOGS'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          > Nhật Ký Gửi Email ({logs.length}) </button> </div> {/* Modal Body */} <div className="p-6 overflow-y-auto flex-1 space-y-4"> {activeTab === 'TEMPLATES' ? ( <div className="space-y-4"> {templates.map((tmpl) => ( <div
                  key={tmpl.id}
                  className="p-4 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                > <div className="space-y-1 flex-1"> <div className="flex items-center gap-2"> <span className="font-semibold text-xs text-slate-900 dark:text-white">{tmpl.name}</span> <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded text-[10px] font-mono"> Stage: {tmpl.trigger_stage} </span> </div> <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate"> <strong>Tiêu đề:</strong> {tmpl.subject} </p> <p className="text-[11px] text-slate-400 font-mono"> Người gửi: {tmpl.sender_name} · Biến hỗ trợ: {tmpl.variables_supported.join(', ')} </p> </div> <div className="flex items-center gap-3 shrink-0"> <button
                      onClick={() => handleToggleAutoSend(tmpl.id, tmpl.is_auto_send_enabled)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                        tmpl.is_auto_send_enabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    > {tmpl.is_auto_send_enabled ? '⚡ Đang Auto-send' : '⚪ Thủ công'} </button> <button
                      onClick={() => setEditingTemplate(tmpl)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm"
                    > <Edit3 className="w-3.5 h-3.5" /> Chỉnh Sửa </button> </div> </div> ))} </div> ) : (
            /* LOGS VIEW */ <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"> <div className="overflow-x-auto"> <table className="w-full text-left text-xs"> <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700"> <tr> <th className="p-3.5">Ứng Viên & Email Nhận</th> <th className="p-3.5">Tiêu Đề Email</th> <th className="p-3.5">Thời Gian Gửi</th> <th className="p-3.5">Người Gửi</th> <th className="p-3.5">Trạng Thái</th> </tr> </thead> <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium"> {logs.map((log) => ( <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"> <td className="p-3.5"> <div className="font-medium text-slate-900 dark:text-white">{log.candidate_name}</div> <div className="text-[10px] text-slate-400 font-mono">{log.candidate_email}</div> </td> <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200"> {log.subject} <div className="text-[10px] text-slate-400 truncate max-w-md">{log.content_preview}</div> </td> <td className="p-3.5 font-mono text-slate-500">{log.sent_at}</td> <td className="p-3.5 text-slate-600 dark:text-slate-300">{log.sender}</td> <td className="p-3.5"> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-[10px] font-medium"> {log.status === 'OPENED' ? 'Đã Mở Thư' : 'Đã Gửi Thành Công'} </span> </td> </tr> ))} </tbody> </table> </div> </div> )} </div> {/* Footer */} <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end"> <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-medium"
          > Đóng </button> </div> </div> {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && ( <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"> <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col"> <form onSubmit={handleSaveTemplate} className="flex flex-col flex-1 overflow-hidden"> <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900"> <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"> <Edit3 className="w-4 h-4 text-indigo-600" /> Chỉnh Sửa: {editingTemplate.name} </h3> <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
                > <X className="w-5 h-5" /> </button> </div> <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1"> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tên Người / Bộ Phận Gửi</label> <input
                    type="text"
                    value={editingTemplate.sender_name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, sender_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tiêu Đề Email (Subject) *</label> <input
                    type="text"
                    required
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  /> </div> <div> <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nội Dung Thư HTML *</label> <textarea
                    rows={8}
                    required
                    value={editingTemplate.body_html}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body_html: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs leading-relaxed"
                  /> </div> <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/40 text-[11px] text-indigo-800 dark:text-indigo-300 space-y-1"> <span className="font-medium">Các biến động hỗ trợ:</span> <p className="font-mono">{editingTemplate.variables_supported.join('   ')}</p> </div> </div> <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900"> <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs"
                > Hủy </button> <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                > Lưu Mẫu Email </button> </div> </form> </div> </div> )} </div> );
}
