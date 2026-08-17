'use client';

import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  User,
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
  Star
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
  onSwitchToList: () => void;
  onViewCustomer: (cust: Customer) => void;
}

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function CustomerOverviewDashboard({
  customers,
  onOpenCreate,
  onSwitchToList,
  onViewCustomer,
}: CustomerOverviewDashboardProps) {
  const stats = useMemo(() => {
    const total = customers.length;
    const enterprise = customers.filter((c) => c.entity_type === 'ENTERPRISE').length;
    const individual = customers.filter((c) => c.entity_type === 'INDIVIDUAL').length;
    const vip = customers.filter((c) => (c as any).tier === 'VIP' || (c as any).tier === 'DIAMOND' || (c as any).tier === 'ENTERPRISE' || c.lifecycle_stage === 'VIP').length;
    const totalLtv = customers.reduce((sum, c) => sum + (c.ltv_total_spent || 0), 0);
    const avgLtv = total > 0 ? Math.round(totalLtv / total) : 0;

    const atRisk = customers.filter((c) => (c.health_score && c.health_score < 50) || c.lifecycle_stage === 'At-Risk');

    return {
      total,
      enterprise,
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
      if (c.lifecycle_stage === 'Prospect') stage = 'Tiềm năng';
      else if (c.lifecycle_stage === 'VIP') stage = 'Khách hàng VIP';
      else if (c.lifecycle_stage === 'Regular') stage = 'Thường xuyên';
      else if (c.lifecycle_stage === 'At-Risk') stage = 'Nguy cơ rời bỏ';
      else if (c.lifecycle_stage === 'Churned') stage = 'Đã ngưng';
      map.set(stage, (map.get(stage) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const entityDistribution = useMemo(() => {
    return [
      { name: 'Doanh Nghiệp B2B', count: stats.enterprise, fill: '#3B82F6' },
      { name: 'Cá Nhân B2C', count: stats.individual, fill: '#10B981' },
      { name: 'Khách Hàng VIP', count: stats.vip, fill: '#8B5CF6' },
    ];
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* 1. HERO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Khách Hàng</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.total}</span>
            <span className="text-[11px] text-slate-500 font-medium">hồ sơ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đã hoàn tất định danh KYC</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh Nghiệp B2B</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 font-mono">{stats.enterprise}</span>
            <span className="text-[11px] text-slate-500 font-medium">công ty</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Có MST & ĐKKD chính thức</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cá Nhân B2C</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <User className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 font-mono">{stats.individual}</span>
            <span className="text-[11px] text-slate-500 font-medium">chủ shop</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Định danh CCCD / Hộ chiếu</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách Hàng VIP</span>
            <span className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Crown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 font-mono">{stats.vip}</span>
            <span className="text-[11px] text-purple-600 font-medium flex items-center">
              Key Account <Star className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Doanh số GMV vượt trội</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá Trị Vòng Đời LTV</span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-600 font-mono">{formatCurrency(stats.totalLtv)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TB {formatCurrency(stats.avgLtv)} / khách</p>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lifecycle Pie Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Vòng Đời Khách Hàng (Lifecycle)
              </h3>
              <p className="text-[11px] text-slate-500">Tỷ lệ phân bổ trạng thái quan hệ khách hàng</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-medium">
              360° CRM
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {lifecycleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} khách hàng`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11.5px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entity Distribution Bar Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Cơ Cấu Khách Hàng Theo Phân Loại
              </h3>
              <p className="text-[11px] text-slate-500">So sánh quy mô thể nhân B2B vs B2C</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10.5px] font-medium">
              KYC Validated
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} hồ sơ`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11.5px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {entityDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. AT-RISK ALERTS & QUICK HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* At-Risk Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Cảnh Báo CSKH Cần Tái Chăm Sóc
                </h3>
                <p className="text-[11px] text-slate-500">Khách hàng có nguy cơ rời bỏ hoặc điểm sức khỏe thấp</p>
              </div>
            </div>
            <button
              onClick={onSwitchToList}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Xem danh sách <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.atRisk.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sức khỏe khách hàng ổn định</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Không có khách hàng nào rơi vào nhóm nguy cơ cao</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
                    <th className="pb-2">Mã KH</th>
                    <th className="pb-2">Tên Khách Hàng</th>
                    <th className="pb-2">Health Score</th>
                    <th className="pb-2">SĐT Liên Hệ</th>
                    <th className="pb-2 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {stats.atRisk.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {c.customer_code}
                      </td>
                      <td className="py-2.5 max-w-[180px] truncate font-medium text-slate-800 dark:text-slate-200">
                        {c.name} {c.company_name ? `(${c.company_name})` : ''}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-100 text-amber-800">
                          {c.health_score || 45}%
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 font-mono text-[11px]">{c.phone}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onViewCustomer(c)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-[11px] transition-colors"
                        >
                          Hồ sơ 360°
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Hub */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Phím Tắt Nghiệp Vụ Khách Hàng
            </h3>
            <p className="text-[11px] text-slate-500">Tương tác và xử lý hồ sơ nhanh</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onOpenCreate}
              className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-blue-600 mb-1">
                <UserPlus className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-blue-950 dark:text-blue-200">Thêm Khách Hàng</p>
              <p className="text-[10.5px] text-blue-700/80 mt-0.5">Tạo hồ sơ KYC mới</p>
            </button>

            <button
              onClick={onSwitchToList}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <Users className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Bảng Danh Mục KH</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Tìm kiếm, lọc & gán task</p>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white">Bảo Mật Dữ Liệu PII & KYC</p>
              <p className="text-[10.5px] text-slate-500">Mã hóa CCCD, MST và hồ sơ theo phân quyền RBAC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
