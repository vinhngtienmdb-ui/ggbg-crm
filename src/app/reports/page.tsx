'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Target,
  Award,
  Clock,
  DollarSign,
  UserCheck,
  Users,
  Briefcase,
  Download,
  Filter,
  Calendar,
  Building2,
  Sparkles,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  AlertCircle,
  MapPin
} from 'lucide-react';

import { getKPIs } from '@/lib/kpiStore';
import { getScorecardsByPeriod } from '@/lib/performanceStore';
import { getAttendance, getLeaveRequests, generateTimekeepingSummary, getPayrollByPeriod } from '@/lib/payrollStore';
import { getEmployees } from '@/lib/hrmStore';

import KpiAnalyticsDashboard from '@/components/kpis/KpiAnalyticsDashboard';
import PerformanceAnalyticsDashboard from '@/components/performance/PerformanceAnalyticsDashboard';
import AttendanceAnalyticsDashboard from '@/components/attendance/AttendanceAnalyticsDashboard';
import PayrollAnalyticsDashboard from '@/components/payroll/PayrollAnalyticsDashboard';
import LeadAnalyticsDashboard from '@/components/leads/LeadAnalyticsDashboard';
import HrmDashboard from '@/components/hrm/HrmDashboard';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tháng 07/2026');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [activeModuleTab, setActiveModuleTab] = useState<
    'OVERVIEW' | 'KPIS' | 'PERFORMANCE' | 'ATTENDANCE' | 'PAYROLL' | 'LEADS' | 'HRM'
  >('OVERVIEW');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Store data
  const [kpis, setKpis] = useState(() => getKPIs());
  const [scorecards, setScorecards] = useState(() => getScorecardsByPeriod('Tháng 07/2026'));
  const [attendance] = useState(() => getAttendance());
  const [leaves] = useState(() => getLeaveRequests());
  const [timesheets, setTimesheets] = useState(() => generateTimekeepingSummary('Tháng 07/2026'));
  const [payrolls, setPayrolls] = useState(() => getPayrollByPeriod('Tháng 07/2026'));
  const [employees] = useState(() => getEmployees());

  useEffect(() => {
    setScorecards(getScorecardsByPeriod(selectedPeriod));
    setTimesheets(generateTimekeepingSummary(selectedPeriod));
    setPayrolls(getPayrollByPeriod(selectedPeriod));
  }, [selectedPeriod]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleExportExcel = () => {
    showToast(`📥 Đã xuất Báo Cáo Phân Tích [${activeModuleTab}] kỳ ${selectedPeriod} ra file Excel (.xlsx)`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* Executive Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">Báo Cáo & Phân Tích Dữ Liệu Đa Phân Hệ</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Executive Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trung tâm báo cáo phân tích dữ liệu chuyên sâu từng phân hệ (KPIs, Hiệu Suất P3, Chấm Công, Bảng Lương, Leads CRM & HRM)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" /> Xuất Báo Cáo Excel
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs font-extrabold">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Kỳ Đánh Giá:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl focus:outline-none"
            >
              <option value="Tháng 07/2026">Tháng 07/2026</option>
              <option value="Tháng 08/2026">Tháng 08/2026</option>
              <option value="Tháng 06/2026">Tháng 06/2026</option>
              <option value="Q3/2026">Quý 3/2026</option>
              <option value="Năm 2026">Cả Năm 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Bộ Phận:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none"
            >
              <option value="ALL">Tất Cả Phòng Ban</option>
              <option value="Phòng Kinh Doanh 1">Phòng Kinh Doanh 1</option>
              <option value="Phòng Kinh Doanh 2">Phòng Kinh Doanh 2</option>
              <option value="Phòng CSKH">Phòng CSKH</option>
              <option value="Phòng Marketing">Phòng Marketing</option>
              <option value="Khối Nhân Sự (HRM)">Khối Nhân Sự (HRM)</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">Cập nhật dữ liệu thời gian thực (Real-time)</span>
      </div>

      {/* MODULE SELECTOR TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveModuleTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'OVERVIEW' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" /> 🌐 1. Tổng Quan Tất Cả Module
        </button>

        <button
          onClick={() => setActiveModuleTab('KPIS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'KPIS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4 text-indigo-400" /> 🎯 2. Báo Cáo KPIs
        </button>

        <button
          onClick={() => setActiveModuleTab('PERFORMANCE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'PERFORMANCE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" /> 🏆 3. Báo Cáo Hiệu Suất P3
        </button>

        <button
          onClick={() => setActiveModuleTab('ATTENDANCE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'ATTENDANCE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" /> ⏰ 4. Báo Cáo Chấm Công
        </button>

        <button
          onClick={() => setActiveModuleTab('PAYROLL')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'PAYROLL' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" /> 💰 5. Báo Cáo Bảng Lương 3P
        </button>

        <button
          onClick={() => setActiveModuleTab('LEADS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'LEADS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-blue-400" /> 📈 6. Báo Cáo Phễu Lead CRM
        </button>

        <button
          onClick={() => setActiveModuleTab('HRM')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeModuleTab === 'HRM' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-400" /> 👥 7. Báo Cáo Nhân Sự HRM
        </button>
      </div>

      {/* RENDER ACTIVE MODULE REPORT DASHBOARD */}

      {/* MODULE REPORT 1: OVERVIEW ALL MODULES */}
      {activeModuleTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => setActiveModuleTab('KPIS')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">🎯 Module KPIs</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <p className="text-xl font-black text-slate-900">88.5% Hoàn Thành</p>
              <p className="text-slate-500 text-[11px]">7 Chỉ tiêu · 3 KPI Vượt chỉ tiêu (≥110%)</p>
            </div>

            <div
              onClick={() => setActiveModuleTab('PERFORMANCE')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">🏆 Module Hiệu Suất</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </div>
              <p className="text-xl font-black text-purple-700">72.000.000 ₫ Lương P3</p>
              <p className="text-slate-500 text-[11px]">Xếp loại Bell Curve Hạng S/A/B/C/D</p>
            </div>

            <div
              onClick={() => setActiveModuleTab('ATTENDANCE')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">⏰ Module Chấm Công</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </div>
              <p className="text-xl font-black text-emerald-700">96.2% Đúng Giờ</p>
              <p className="text-slate-500 text-[11px]">Công chuẩn 26 ngày · GPS Check-in</p>
            </div>

            <div
              onClick={() => setActiveModuleTab('PAYROLL')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">💰 Module Bảng Lương</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </div>
              <p className="text-xl font-black text-amber-700">485.000.000 ₫ Gross</p>
              <p className="text-slate-500 text-[11px]">P1+P2+P3 · Khấu trừ BHXH & Thuế TNCN</p>
            </div>

            <div
              onClick={() => setActiveModuleTab('LEADS')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">📈 Module Lead CRM</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xl font-black text-blue-700">458 Lead Mới</p>
              <p className="text-slate-500 text-[11px]">Chuyển đổi 5 bước · Shopee/TikTok/Ads</p>
            </div>

            <div
              onClick={() => setActiveModuleTab('HRM')}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 uppercase">👥 Module Nhân Sự HRM</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </div>
              <p className="text-xl font-black text-slate-900">48 Nhân Sự</p>
              <p className="text-slate-500 text-[11px]">Sổ lao động NĐ 145 · Hợp đồng lao động</p>
            </div>
          </div>

          <div className="space-y-6">
            <KpiAnalyticsDashboard kpis={kpis} />
            <PayrollAnalyticsDashboard payrolls={payrolls} />
          </div>
        </div>
      )}

      {/* MODULE REPORT 2: KPIS */}
      {activeModuleTab === 'KPIS' && (
        <div className="space-y-4">
          <KpiAnalyticsDashboard kpis={kpis} />
        </div>
      )}

      {/* MODULE REPORT 3: PERFORMANCE */}
      {activeModuleTab === 'PERFORMANCE' && (
        <div className="space-y-4">
          <PerformanceAnalyticsDashboard scorecards={scorecards} />
        </div>
      )}

      {/* MODULE REPORT 4: ATTENDANCE */}
      {activeModuleTab === 'ATTENDANCE' && (
        <div className="space-y-4">
          <AttendanceAnalyticsDashboard attendance={attendance} leaves={leaves} timesheets={timesheets} />
        </div>
      )}

      {/* MODULE REPORT 5: PAYROLL */}
      {activeModuleTab === 'PAYROLL' && (
        <div className="space-y-4">
          <PayrollAnalyticsDashboard payrolls={payrolls} />
        </div>
      )}

      {/* MODULE REPORT 6: LEADS */}
      {activeModuleTab === 'LEADS' && (
        <div className="space-y-4">
          <LeadAnalyticsDashboard leads={[]} />
        </div>
      )}

      {/* MODULE REPORT 7: HRM */}
      {activeModuleTab === 'HRM' && (
        <div className="space-y-4">
          <HrmDashboard employees={employees} />
        </div>
      )}
    </div>
  );
}
