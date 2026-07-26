'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  User,
  Monitor,
  Key
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '@/lib/auditStore';
import { AuditLogEntry } from '@/types/audit';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Đồng bộ từ API khi mount (dual-mode: Supabase hoặc in-memory phía server).
  // Lỗi/empty → giữ INITIAL_AUDIT_LOGS để không nhấp nháy giao diện.
  useEffect(() => {
    let active = true;
    fetch('/api/audit')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setLogs(data.data as AuditLogEntry[]);
        }
      })
      .catch(() => {
        /* fallback: giữ INITIAL_AUDIT_LOGS */
      });
    return () => {
      active = false;
    };
  }, []);

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
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold text-[10px] flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-600" /> Thông Tin
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Cảnh Báo
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold text-[10px] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-600" /> Nguy Hiểm (Critical)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="gg-hero p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10.5px] font-bold mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>System Audit Trail & Security Center</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-blue-700">
            Nhật Ký Hệ Thống & Bảo Mật Thao Tác
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Ghi vết 100% thời gian thực mọi hành vi của tài khoản người dùng trên hệ thống CRM.
          </p>
        </div>

        <button className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-blue-100">
          <Download className="w-3.5 h-3.5" /> Export Audit Log CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll sleek-scrollbar w-full sm:w-auto text-[11px]">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả Thao Tác
          </button>
          <button
            onClick={() => setSelectedSeverity('INFO')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'INFO' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mức Thông Tin
          </button>
          <button
            onClick={() => setSelectedSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'WARNING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mức Cảnh Báo
          </button>
          <button
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
              selectedSeverity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mức Nguy Hiểm
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm người dùng, IP, thao tác..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4">
        <div className="overflow-x-auto touch-scroll sleek-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10.5px]">
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Tài Khoản Thực Hiện</th>
                <th className="p-3">Loại Thao Tác & Mô Tả</th>
                <th className="p-3">Phân Hệ Target</th>
                <th className="p-3">Địa Chỉ IP & Thiết Bị</th>
                <th className="p-3">Mức Độ Rủi Ro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{log.actor_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">@{log.actor_username} ({log.actor_role})</p>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mr-2">
                      {log.action_type}
                    </span>
                    <span className="text-slate-800 font-medium">{log.action_description}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-700 font-semibold text-[11px]">{log.resource_module}</td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    <p className="font-mono text-slate-800 font-semibold">{log.ip_address}</p>
                    <p className="text-[10px] text-slate-400">{log.device_info}</p>
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
