'use client';

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  User,
  Store,
  Crown,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  UserPlus,
  Coins,
  CheckCircle2,
  Star,
  Sparkles,
  CreditCard,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Customer } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/formatters';

interface CustomerOverviewDashboardProps {
  customers: Customer[];
  onOpenCreate: () => void;
  onNavigateList: (filter?: 'ENTERPRISE' | 'HOUSEHOLD_BUSINESS' | 'INDIVIDUAL') => void;
  onViewCustomer?: (cust: Customer) => void;
}

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function CustomerOverviewDashboard({
  customers,
  onOpenCreate,
  onNavigateList,
  onViewCustomer,
}: CustomerOverviewDashboardProps) {
  const stats = useMemo(() => {
    const total = customers.length;
    const enterprise = customers.filter((c) => c.entity_type === 'ENTERPRISE').length;
    const household = customers.filter((c) => c.entity_type === 'HOUSEHOLD_BUSINESS').length;
    const individual = customers.filter((c) => c.entity_type === 'INDIVIDUAL').length;
    const vip = customers.filter((c) => c.tier === 'VIP' || c.lifecycle_stage === 'VIP').length;
    const totalLtv = customers.reduce((sum, c) => sum + (c.ltv_total_spent || 0), 0);
    const avgLtv = total > 0 ? Math.round(totalLtv / total) : 0;

    const atRisk = customers.filter((c) => (c.health_score && c.health_score < 50) || c.lifecycle_stage === 'At-Risk');

    return {
      total,
      enterprise,
      household,
      individual,
      vip,
      totalLtv,
      avgLtv,
      atRisk,
    };
  }, [customers]);

  const lifecycleDistribution = useMemo(() => {
    const map = new Map<string, number>();
    customers.forEach((c) => {
      let stage = 'Thành viên thường';
      if (c.lifecycle_stage === 'Prospect') stage = 'Tiềm năng (Prospect)';
      else if (c.lifecycle_stage === 'Active') stage = 'Đang hoạt động (Active)';
      else if (c.lifecycle_stage === 'Regular') stage = 'Thường xuyên (Regular)';
      else if (c.lifecycle_stage === 'VIP') stage = 'VIP Chiến lược';
      else if (c.lifecycle_stage === 'At-Risk') stage = 'Cảnh báo (At-Risk)';
      else if (c.lifecycle_stage === 'Churned') stage = 'Đã ngưng (Churned)';
      map.set(stage, (map.get(stage) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const entityDistribution = useMemo(() => {
    return [
      { name: 'Doanh Nghiệp', count: stats.enterprise, fill: '#3B82F6' },
      { name: 'Hộ Kinh Doanh', count: stats.household, fill: '#F59E0B' },
      { name: 'Cá Nhân', count: stats.individual, fill: '#8B5CF6' },
    ];
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* 1. QUICK LAUNCHER ACTION BAR - THEO CHUẨN TỔNG QUAN */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
        <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Thao Tác Nhanh:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Tạo Khách Hàng Mới</span>
          </button>
          <button
            onClick={() => onNavigateList('ENTERPRISE')}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Doanh Nghiệp ({stats.enterprise})</span>
          </button>
          <button
            onClick={() => onNavigateList('HOUSEHOLD_BUSINESS')}
            className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Hộ Kinh Doanh ({stats.household})</span>
          </button>
          <button
            onClick={() => onNavigateList('INDIVIDUAL')}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Cá Nhân ({stats.individual})</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 METRICS CARDS - THEO CHUẨN TỔNG QUAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers (Blue) */}
        <div
          onClick={() => onNavigateList()}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Tổng Khách Hàng
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.total} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Đã định danh KYC</span>
            <span className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
              Danh sách <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Enterprise Customers (Indigo) */}
        <div
          onClick={() => onNavigateList('ENTERPRISE')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              Doanh Nghiệp Pháp Nhân
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.enterprise} <span className="text-xs font-normal text-slate-400">công ty</span>
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Có MST & ĐKKD chính thức</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5">
              Lọc DN <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Household Business (Amber) */}
        <div
          onClick={() => onNavigateList('HOUSEHOLD_BUSINESS')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              Hộ Kinh Doanh
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.household} <span className="text-xs font-normal text-slate-400">hộ ĐKKD</span>
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>ĐKKD Hộ Cá Thể</span>
            <span className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5">
              Lọc HKD <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Total LTV Spent (Emerald) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng LTV Chi Tiêu
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatNumber(Math.round(stats.totalLtv / 1000000))} Tr ₫
          </p>
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              TB: {formatNumber(Math.round(stats.avgLtv / 1000000))} Tr ₫ / KH
            </span>
            <span className="text-slate-400">Tích lũy</span>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE BI HEALTH ANALYTICS PANEL - THEO CHUẨN TỔNG QUAN */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Chỉ Số Sức Khỏe & Vòng Đời Khách Hàng
              </h3>
              <p className="text-xs text-slate-500">Phân tích cấu trúc thể nhân, mức độ tương tác và tỷ lệ an toàn danh mục khách hàng</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs rounded-md">
            Hệ Thống Tự Động Phân Hạng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1.5">
            <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Khách Hàng VIP & Chiến Lược</span>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{stats.vip} Đối Tác</p>
            <p className="text-purple-600 dark:text-purple-400 text-[11px] font-medium">Hạng VIP / LTV cao</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1.5">
            <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Đang Hoạt Động (Active)</span>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {customers.filter((c) => c.lifecycle_stage === 'Active' || c.lifecycle_stage === 'Regular').length} Khách Hàng
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">Đang phát sinh hợp đồng</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1.5">
            <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Khách Hàng Tiềm Năng (Prospect)</span>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {customers.filter((c) => c.lifecycle_stage === 'Prospect').length} Khách Hàng
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-[11px] font-medium">Mới tạo / Đang tư vấn</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1.5">
            <span className="text-slate-500 font-semibold uppercase text-[10.5px]">Cảnh Báo Chăm Sóc (At-Risk)</span>
            <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">{stats.atRisk.length} Khách Hàng</p>
            <p className="text-amber-600 dark:text-amber-400 text-[11px] font-medium">Cần tương tác lại</p>
          </div>
        </div>
      </div>

      {/* 4. CHARTS SECTION - THEO CHUẨN TỔNG QUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Lifecycle Stage Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-blue-600" />
                  <span>Cơ Cấu Vòng Đời Khách Hàng (Lifecycle)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Tự động phân loại theo lịch sử giao dịch và sức khỏe gắn kết</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">Tổng: {customers.length}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifecycleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {lifecycleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/40">
              <span className="text-[10.5px] text-slate-500 block">Tiềm Năng</span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {customers.filter((c) => c.lifecycle_stage === 'Prospect').length} KH
              </span>
            </div>
            <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10.5px] text-slate-500 block">Hoạt Động</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {customers.filter((c) => c.lifecycle_stage === 'Active' || c.lifecycle_stage === 'Regular').length} KH
              </span>
            </div>
            <div className="p-2.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900/40">
              <span className="text-[10.5px] text-slate-500 block">VIP Chiến Lược</span>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                {stats.vip} KH
              </span>
            </div>
          </div>
        </div>

        {/* Right: Entity Type Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Quy Mô Khách Hàng Theo Thể Nhân Pháp Lý</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">So sánh cơ cấu Doanh Nghiệp vs Hộ Kinh Doanh vs Cá Nhân</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">3 Thể Nhân</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Số lượng hồ sơ" radius={[6, 6, 0, 0]}>
                    {entityDistribution.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10.5px] text-slate-500 block">Doanh Nghiệp</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{stats.enterprise}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10.5px] text-slate-500 block">Hộ Kinh Doanh</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{stats.household}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10.5px] text-slate-500 block">Cá Nhân</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{stats.individual}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AT-RISK TABLE & RECENT CUSTOMERS - THEO CHUẨN TỔNG QUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: At-Risk Care List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Cảnh Báo Khách Hàng Cần Chăm Sóc (At-Risk)
                </h3>
                <p className="text-xs text-slate-500">Khách hàng có điểm sức khỏe dưới 50 hoặc quá hạn tương tác</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateList()}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả ({stats.atRisk.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.atRisk.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tất cả khách hàng đều có chỉ số sức khỏe tốt</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Không phát hiện khách hàng nào rơi vào tình trạng nguy cơ rời bỏ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Khách Hàng / Đơn Vị</th>
                    <th className="pb-3">Thể Nhân</th>
                    <th className="pb-3">Health Score</th>
                    <th className="pb-3">Lý Do Cảnh Báo</th>
                    <th className="pb-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.atRisk.slice(0, 5).map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                        <div>{cust.name}</div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{cust.customer_code}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {cust.entity_type === 'ENTERPRISE' ? 'Doanh Nghiệp' : cust.entity_type === 'HOUSEHOLD_BUSINESS' ? 'Hộ Kinh Doanh' : 'Cá Nhân'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                          {cust.health_score}/100
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px] max-w-[180px] truncate">
                        {cust.lifecycle_reason || 'Không phát sinh tương tác'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onViewCustomer?.(cust)}
                          className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Strategic Tier Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Phân Bổ Hạng Khách Hàng (Tier)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tự động nâng hạng theo LTV & Hợp đồng</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-200">Hạng VIP Partner</p>
                <p className="text-[11px] text-purple-700/80 dark:text-purple-400">LTV $\ge$ 100 Tr ₫ hoặc 5+ HĐ</p>
              </div>
              <span className="text-base font-semibold text-purple-700 dark:text-purple-300">
                {customers.filter((c) => c.tier === 'VIP').length}
              </span>
            </div>

            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">Hạng Gold Merchant</p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400">LTV $\ge$ 50 Tr ₫ hoặc 3+ HĐ</p>
              </div>
              <span className="text-base font-semibold text-amber-700 dark:text-amber-300">
                {customers.filter((c) => c.tier === 'Gold').length}
              </span>
            </div>

            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">Hạng Silver Client</p>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-400">LTV $\ge$ 20 Tr ₫ hoặc 1+ HĐ</p>
              </div>
              <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                {customers.filter((c) => c.tier === 'Silver').length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Hạng Standard Member</p>
                <p className="text-[11px] text-slate-500">Mới tạo / LTV &lt; 20 Tr ₫</p>
              </div>
              <span className="text-base font-semibold text-slate-700 dark:text-slate-300">
                {customers.filter((c) => c.tier === 'Standard').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
