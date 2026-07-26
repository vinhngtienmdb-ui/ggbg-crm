'use client';

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Lead } from '@/types';
import { LeadStageLog } from '@/lib/leadStore';
interface StageLogDrawerProps {
  logs: LeadStageLog[];
  leads: Lead[];
  /** `ALL`, or a specific `lead_code`. */
  filter: string;
  onFilterChange: (next: string) => void;
  onClose: () => void;
}

export default function StageLogDrawer({
  logs,
  leads,
  filter,
  onFilterChange,
  onClose,
}: StageLogDrawerProps) {
  const visible = filter === 'ALL' ? logs : logs.filter((l) => l.lead_code === filter);

  return (
    <>
      <div onClick={onClose} className="dc-scrim" />

      <aside
        role="dialog"
        aria-label="Nhật ký chuyển giai đoạn"
        className="fixed right-0 top-0 bottom-0 z-[91] flex w-[min(460px,94vw)] flex-col bg-white shadow-drawer animate-fadeUpFast"
      >
        <div className="dc-modal-head-brand flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-extrabold text-brand-800">📜 Nhật ký chuyển giai đoạn</h2>
            <p className="text-[11px] text-ink-500">{visible.length} bản ghi</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-100 bg-white text-brand-800 hover:bg-brand-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="border-b border-line px-5 py-3">
          <label className="dc-label">LỌC THEO LEAD</label>
          <select className="dc-select" value={filter} onChange={(e) => onFilterChange(e.target.value)}>
            <option value="ALL">Tất cả lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.lead_code}>
                {l.lead_code} — {l.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visible.length === 0 && (
            <p className="px-5 py-12 text-center text-[12.5px] text-ink-500">Chưa có nhật ký nào.</p>
          )}

          {visible.map((log) => (
            <div key={log.id} className="border-b border-line-soft px-5 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-ink-900">
                  {log.lead_code} · {log.lead_name}
                </span>
                <span className="dc-num shrink-0 text-[10px] text-ink-400">{log.timestamp}</span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded-md bg-line-soft px-2 py-0.5 font-semibold text-ink-700">
                  {log.from_stage}
                </span>
                <ArrowRight className="h-3 w-3 text-ink-400" />
                <span className="rounded-md bg-brand-50 px-2 py-0.5 font-semibold text-brand-600">
                  {log.to_stage}
                </span>
              </div>

              {log.note && <p className="mt-1.5 text-[11px] text-ink-500">{log.note}</p>}
              <p className="mt-1 text-[10px] text-ink-400">Bởi: {log.actor_name}</p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
