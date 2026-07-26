'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useAudit } from '@/context/AuditContext';
import { AuditLogEntry } from '@/types/audit';
export default function AuditTrailPage() {
  // Live trail: entries appended by other modules this session show up here.
  const { logs } = useAudit();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (selectedSeverity !== 'ALL' && log.severity !== selectedSeverity) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        log.actor_name.toLowerCase().includes(term) ||
        log.actor_username.toLowerCase().includes(term) ||
        log.action_description.toLowerCase().includes(term) ||
        log.resource_module.toLowerCase().includes(term) ||
        log.ip_address.includes(term)
      );
    }
    return true;
  });

  const renderSeverityBadge = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'INFO':
        return (
          <span className="px-2 py-0.5 bg-brand-50 text-brand-800 border border-brand-100 rounded font-bold text-[10px] flex items-center gap-1">
            <Info className="w-3 h-3 text-brand-600" /> Thông Tin
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 bg-warn-bg text-warn-fg border border-gold-border rounded font-bold text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warn-fg" /> Cảnh Báo
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 bg-danger-bg text-danger-fg border border-danger-border rounded font-bold text-[10px] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-danger-fg" /> Nguy Hiểm (Critical)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-brand-50 rounded-lg p-5 text-brand-800 border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-subtle border border-line text-ink-400 text-[11px] font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-plum-deep" />
            <span>System Audit Trail & Security Center</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Nhật Ký Hệ Thống & Bảo Mật Thao Tác
          </h1>
          <p className="text-ink-400 text-xs mt-1">
            Ghi vết 100% thời gian thực mọi hành vi của tài khoản người dùng trên hệ thống CRM.
          </p>
        </div>

        <button className="px-3.5 py-2 bg-surface-subtle hover:bg-line-soft text-ink-400 font-semibold rounded-md text-xs flex items-center gap-1.5 transition-colors border border-line">
          <Download className="w-3.5 h-3.5" /> Export Audit Log CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll sleek-scrollbar w-full sm:w-auto text-[11px]">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'ALL' ? 'bg-brand-600 text-white' : 'bg-line-soft text-ink-700 hover:bg-line'
            }`}
          >
            Tất Cả Thao Tác
          </button>
          <button
            onClick={() => setSelectedSeverity('INFO')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'INFO' ? 'bg-brand-600 text-white' : 'bg-line-soft text-ink-700 hover:bg-line'
            }`}
          >
            Mức Thông Tin
          </button>
          <button
            onClick={() => setSelectedSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'WARNING' ? 'bg-warn-fg text-white' : 'bg-line-soft text-ink-700 hover:bg-line'
            }`}
          >
            Mức Cảnh Báo
          </button>
          <button
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'CRITICAL' ? 'bg-danger-fg text-white' : 'bg-line-soft text-ink-700 hover:bg-line'
            }`}
          >
            Mức Nguy Hiểm
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm người dùng, IP, thao tác..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-subtle border border-line rounded-md text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-5 rounded-lg border border-line space-y-4">
        <div className="overflow-x-auto touch-scroll sleek-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-line-soft border-b border-line text-ink-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Tài Khoản Thực Hiện</th>
                <th className="p-3">Loại Thao Tác & Mô Tả</th>
                <th className="p-3">Phân Hệ Target</th>
                <th className="p-3">Địa Chỉ IP & Thiết Bị</th>
                <th className="p-3">Mức Độ Rủi Ro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="p-3 font-mono text-ink-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3">
                    <p className="font-bold text-ink-900">{log.actor_name}</p>
                    <p className="text-[11px] text-ink-500 font-mono">@{log.actor_username} ({log.actor_role})</p>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] font-bold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100 mr-2">
                      {log.action_type}
                    </span>
                    <span className="text-ink-900 font-medium">{log.action_description}</span>
                  </td>
                  <td className="p-3 font-mono text-ink-700 font-semibold text-[11px]">{log.resource_module}</td>
                  <td className="p-3 text-ink-500 text-[11px]">
                    <p className="font-mono text-ink-900 font-semibold">{log.ip_address}</p>
                    <p className="text-[10px] text-ink-400">{log.device_info}</p>
                  </td>
                  <td className="p-3">{renderSeverityBadge(log.severity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
