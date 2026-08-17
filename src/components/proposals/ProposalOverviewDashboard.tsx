'use client';

import React, { useMemo } from 'react';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  FileText,
  User,
  Building2,
  Calendar,
  Sparkles,
  Layers,
  Coins,
  Briefcase
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
import { ProposalSubmission, ProposalTemplate } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface ProposalOverviewDashboardProps {
  submissions: ProposalSubmission[];
  templates: ProposalTemplate[];
  onNavigateTab: (tab: 'pending' | 'my_submissions' | 'all_approved' | 'create' | 'templates') => void;
  onOpenCreateWithTemplate: (templateId: string) => void;
  onViewSubmission: (sub: ProposalSubmission) => void;
}

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function ProposalOverviewDashboard({
  submissions,
  templates,
  onNavigateTab,
  onOpenCreateWithTemplate,
  onViewSubmission,
}: ProposalOverviewDashboardProps) {
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === 'PENDING').length;
    const approved = submissions.filter((s) => s.status === 'APPROVED').length;
    const rejected = submissions.filter((s) => s.status === 'REJECTED').length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    const urgentPending = submissions.filter((s) => s.status === 'PENDING');

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate,
      urgentPending,
    };
  }, [submissions]);

  const templateDistribution = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach((s) => {
      const name = s.template_title || 'Khác';
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  const statusDistribution = useMemo(() => {
    return [
      { name: 'Đã Duyệt', count: stats.approved, fill: '#10B981' },
      { name: 'Chờ Duyệt', count: stats.pending, fill: '#F59E0B' },
      { name: 'Từ Chối', count: stats.rejected, fill: '#EF4444' },
    ];
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* 1. HERO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Đề Xuất</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.total}</span>
            <span className="text-[11px] text-slate-500 font-medium">phiếu trình</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Toàn bộ các phòng ban</p>
        </div>

        <div
          onClick={() => onNavigateTab('pending')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              Chờ Phê Duyệt
            </span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 font-mono">{stats.pending}</span>
            <span className="text-[11px] text-amber-600 font-medium flex items-center">
              Cần xử lý <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trong luồng thẩm định cấp phép</p>
        </div>

        <div
          onClick={() => onNavigateTab('all_approved')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
              Đã Phê Duyệt
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 font-mono">{stats.approved}</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center">
              Thông qua <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đã có chữ ký duyệt đủ thẩm quyền</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ Lệ Chấp Thuận</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">{stats.approvalRate}%</span>
            <span className="text-[11px] text-slate-500 font-medium">hiệu quả</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Thời gian duyệt trung bình 4.2h</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ Chối / Hoàn Trả</span>
            <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600 font-mono">{stats.rejected}</span>
            <span className="text-[11px] text-slate-500 font-medium">phiếu</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cần điều chỉnh hoặc bổ sung hồ sơ</p>
        </div>
      </div>

      {/* 2. VISUAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Category Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Phân Bổ Theo Mẫu Quy Trình
              </h3>
              <p className="text-[11px] text-slate-500">Cơ cấu các nhóm đề xuất phát sinh</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-medium">
              {templates.length} Mẫu hoạt động
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={templateDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {templateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} phiếu`, 'Số lượng']}
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

        {/* Approval Status Distribution */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Tình Trạng Luồng Duyệt
              </h3>
              <p className="text-[11px] text-slate-500">Tiến độ thẩm định theo thời gian thực</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10.5px] font-medium">
              Realtime SLA
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} phiếu`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11.5px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. PENDING TABLE & QUICK CREATION HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Approvals Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Đề Xuất Đang Chờ Phê Duyệt
                </h3>
                <p className="text-[11px] text-slate-500">Cần thẩm định và ký duyệt cấp phép</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('pending')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.urgentPending.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Không có đề xuất tồn đọng</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tất cả các phiếu trình đã được xử lý hoàn tất</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
                    <th className="pb-2">Mã Phiếu</th>
                    <th className="pb-2">Loại Quy Trình</th>
                    <th className="pb-2">Người Nộp</th>
                    <th className="pb-2">Thời Gian</th>
                    <th className="pb-2 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {stats.urgentPending.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {sub.proposal_code || `P-${sub.id.substring(0, 6)}`}
                      </td>
                      <td className="py-2.5 max-w-[180px] truncate font-medium text-slate-800 dark:text-slate-200">
                        {sub.template_title}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300 font-medium">
                        {sub.applicant_name}
                      </td>
                      <td className="py-2.5 text-slate-500 text-[11px] font-mono">
                        {sub.submitted_date ? sub.submitted_date : 'Hôm nay'}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onViewSubmission(sub)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-[11px] transition-colors"
                        >
                          Duyệt phiếu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Creation Hub & Common Templates */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Tạo Nhanh Đề Xuất Phổ Biến
            </h3>
            <p className="text-[11px] text-slate-500">Mẫu biểu chuẩn hóa luồng duyệt tự động</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.slice(0, 4).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onOpenCreateWithTemplate(tpl.id)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <Plus className="w-4 h-4" />
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">{tpl.title}</p>
                <p className="text-[10.5px] text-slate-500 mt-0.5">{tpl.category_name || 'Quy trình nội bộ'}</p>
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('templates')}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quản lý danh mục mẫu ({templates.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('create')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo Mới Khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
