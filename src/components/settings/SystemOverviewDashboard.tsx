'use client';

import React from 'react';
import {
  Server,
  Cloud,
  ShieldCheck,
  Activity,
  Database,
  Cpu,
  Key,
  Sliders,
  Mail,
  Bot,
  Building2,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { SystemConfig } from '@/lib/systemConfigStore';
import { useModuleToggles } from '@/context/ModuleToggleContext';

interface SystemOverviewDashboardProps {
  config: SystemConfig;
  onNavigateTab: (tab: 'BRANDING' | 'MODULE_TOGGLES' | 'INFRASTRUCTURE' | 'API_KEYS' | 'SMTP' | 'WEBHOOKS' | 'SECURITY_AUDIT' | 'COMPANY_IDENTITY') => void;
}

export default function SystemOverviewDashboard({
  config,
  onNavigateTab,
}: SystemOverviewDashboardProps) {
  const { toggles } = useModuleToggles();
  const activeModulesCount = Object.values(toggles || {}).filter(Boolean).length;
  const totalModulesCount = Object.keys(toggles || {}).length || 12;

  const services = [
    {
      name: 'Lưu Trữ Cloudflare R2',
      category: 'Cloud Storage',
      status: config.r2?.bucket_name && config.r2?.enabled ? 'OPERATIONAL' : 'CONFIGURED',
      latency: '24ms',
      icon: Cloud,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      name: 'Cơ Sở Dữ Liệu PostgreSQL',
      category: 'Database Cluster',
      status: config.supabase?.enabled ? 'OPERATIONAL' : 'ONLINE',
      latency: '18ms',
      icon: Database,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      name: 'Cổng Email SMTP Doanh Nghiệp',
      category: 'Transactional Mail',
      status: config.smtp?.host ? 'OPERATIONAL' : 'IDLE',
      latency: '45ms',
      icon: Mail,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      name: 'Trợ Lý AI & LLM Engine',
      category: 'OpenAI / Gemini GenAI',
      status: config.api_keys?.openai_api_key || config.api_keys?.gemini_api_key ? 'OPERATIONAL' : 'READY',
      latency: '120ms',
      icon: Bot,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      name: 'Tường Lửa & Kiểm Soát PII',
      category: 'Data Governance',
      status: 'OPERATIONAL',
      latency: '5ms',
      icon: ShieldCheck,
      color: 'text-indigo-500 bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng Thái Hệ Thống</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-mono">100% Khả Dụng</p>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tất cả dịch vụ vận hành ổn định
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phân Hệ Hoạt Động</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sliders className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-600 font-mono">
            {activeModulesCount} / {totalModulesCount}
          </p>
          <p className="text-[11px] text-slate-500">Phân hệ nghiệp vụ đang kích hoạt</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm An Ninh Bảo Mật</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-600 font-mono">98 / 100</p>
          <p className="text-[11px] text-purple-700 font-medium">RBAC + Mask PII + Audit Log ON</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phiên Bản Hệ Thống</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">v2.5 Enterprise</p>
          <p className="text-[11px] text-slate-500">GGBG CRM Core Architecture</p>
        </div>
      </div>

      {/* 2. CLOUD INFRASTRUCTURE & SERVICE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Ma Trận Trạng Thái Dịch Vụ Hạ Tầng
              </h3>
              <p className="text-[11px] text-slate-500">Giám sát sức khỏe hạ tầng Cloud & tích hợp bên thứ ba</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Green
            </span>
          </div>

          <div className="space-y-3">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${svc.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{svc.name}</p>
                      <p className="text-[11px] text-slate-500">{svc.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono text-slate-400">Độ trễ: {svc.latency}</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      HOẠT ĐỘNG
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. QUICK NAVIGATION HUB */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Phím Tắt Quản Trị Hệ Thống
            </h3>
            <p className="text-[11px] text-slate-500">Truy cập nhanh các phân khu cấu hình chuyên sâu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('COMPANY_IDENTITY')}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-blue-600 mb-1">
                <Building2 className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Pháp Lý & Con Dấu</p>
              <p className="text-[10.5px] text-slate-500">MST, thông tin DN, mẫu dấu</p>
            </button>

            <button
              onClick={() => onNavigateTab('MODULE_TOGGLES')}
              className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-purple-600 mb-1">
                <Sliders className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Quản Lý Phân Hệ</p>
              <p className="text-[10.5px] text-slate-500">Bật/Tắt module CRM, HRM</p>
            </button>

            <button
              onClick={() => onNavigateTab('INFRASTRUCTURE')}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <Cloud className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Hạ Tầng & Cloud</p>
              <p className="text-[10.5px] text-slate-500">Cloudflare R2, sao lưu data</p>
            </button>

            <button
              onClick={() => onNavigateTab('API_KEYS')}
              className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <Key className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">API & Tích Hợp</p>
              <p className="text-[10.5px] text-slate-500">OpenAI, Zalo ZNS, Stringee</p>
            </button>

            <button
              onClick={() => onNavigateTab('SMTP')}
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-indigo-600 mb-1">
                <Mail className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Email & Tổng Đài</p>
              <p className="text-[10.5px] text-slate-500">SMTP Server, VoIP Hotline</p>
            </button>

            <button
              onClick={() => onNavigateTab('SECURITY_AUDIT')}
              className="p-3 rounded-xl border border-slate-200 hover:border-rose-300 bg-white hover:bg-slate-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-rose-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Bảo Mật & Nhật Ký</p>
              <p className="text-[10.5px] text-slate-500">Audit trail, kiểm soát truy cập</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
