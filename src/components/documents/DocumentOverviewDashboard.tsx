'use client';

import React, { useMemo } from 'react';
import {
  FileText,
  Inbox,
  Send,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertTriangle,
  FileCheck,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Stamp,
  CheckCircle2,
  Lock
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
import { OfficialDocument } from '@/types';

interface DocumentOverviewDashboardProps {
  documents: OfficialDocument[];
  onNavigateTab: (tab: 'INBOUND' | 'OUTBOUND' | 'INTERNAL_SOP' | 'DIRECTIVE_LOG' | 'DOC_CONFIG') => void;
  onOpenCreate: () => void;
  onViewDoc: (doc: OfficialDocument) => void;
}

const PALETTE = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function DocumentOverviewDashboard({
  documents,
  onNavigateTab,
  onOpenCreate,
  onViewDoc,
}: DocumentOverviewDashboardProps) {
  const stats = useMemo(() => {
    const total = documents.length;
    const inbound = documents.filter((d) => d.category === 'INBOUND').length;
    const outbound = documents.filter((d) => d.category === 'OUTBOUND').length;
    const internalSop = documents.filter(
      (d) => d.category === 'INTERNAL_SOP' || d.category === 'DECISION' || d.category === 'ANNOUNCEMENT'
    ).length;
    const signedCount = documents.filter((d) => d.has_digital_stamp || (d.signatures && d.signatures.length > 0)).length;
    const signedRate = total > 0 ? Math.round((signedCount / total) * 100) : 0;

    const urgentDocs = documents.filter(
      (d) =>
        (d.urgency_level === 'URGENT' || d.urgency_level === 'HIGHLY_URGENT' || d.urgency_level === 'EXPRESS') &&
        d.status !== 'COMPLETED'
    );

    const confidentialDocs = documents.filter(
      (d) => d.security_level === 'CONFIDENTIAL' || d.security_level === 'SECRET' || d.security_level === 'TOP_SECRET'
    );

    return {
      total,
      inbound,
      outbound,
      internalSop,
      signedCount,
      signedRate,
      urgentDocs,
      confidentialDocs,
    };
  }, [documents]);

  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    documents.forEach((d) => {
      let cat = 'Khác';
      if (d.category === 'INBOUND') cat = 'Công Văn Đến';
      else if (d.category === 'OUTBOUND') cat = 'Công Văn Đi';
      else if (d.category === 'INTERNAL_SOP') cat = 'Quy Chế SOP';
      else if (d.category === 'DECISION') cat = 'Quyết Định';
      else if (d.category === 'SUBMISSION_STATEMENT') cat = 'Tờ Trình';
      else if (d.category === 'ANNOUNCEMENT') cat = 'Thông Báo';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [documents]);

  const statusDistribution = useMemo(() => {
    const map: Record<string, number> = {
      'Đã hoàn tất': 0,
      'Đang xử lý': 0,
      'Chờ phân công': 0,
      'Chờ bút phê': 0,
    };
    documents.forEach((d) => {
      if (d.status === 'COMPLETED' || d.status === 'ARCHIVED') map['Đã hoàn tất']++;
      else if (d.status === 'IN_PROCESSING') map['Đang xử lý']++;
      else if (d.status === 'PENDING_DIRECTIVE') map['Chờ bút phê']++;
      else map['Chờ phân công']++;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [documents]);

  return (
    <div className="space-y-6">
      {/* 1. HERO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Văn Bản</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.total}</span>
            <span className="text-[11px] text-slate-500 font-medium">hồ sơ số</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lưu trữ trên Cloud HSM</p>
        </div>

        <div
          onClick={() => onNavigateTab('INBOUND')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
              Công Văn Đến
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Inbox className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.inbound}</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center">
              Tiếp nhận <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Từ đối tác & cơ quan nhà nước</p>
        </div>

        <div
          onClick={() => onNavigateTab('OUTBOUND')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
              Công Văn Đi
            </span>
            <span className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Send className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{stats.outbound}</span>
            <span className="text-[11px] text-purple-600 font-medium flex items-center">
              Phát hành <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Có số hiệu & dấu mộc đỏ</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ Lệ Ký Số</span>
            <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">{stats.signedRate}%</span>
            <span className="text-[11px] text-slate-500 font-medium">{stats.signedCount}/{stats.total} văn bản</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Chứng thư số VNPT-CA Active</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Cần Xử Lý Gấp</span>
            <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600 font-mono">{stats.urgentDocs.length}</span>
            <span className="text-[11px] text-red-500 font-medium">Hỏa tốc / Khẩn</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Yêu cầu hoàn tất theo SLA</p>
        </div>
      </div>

      {/* 2. VISUAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Phân Bổ Danh Mục Văn Bản
              </h3>
              <p className="text-[11px] text-slate-500">Tỷ trọng các nhóm tài liệu trong hệ thống</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-medium">
              Toàn bộ cơ sở dữ liệu
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} văn bản`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11.5px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11.5px', paddingTop: '10px' }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Process Status Bar Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Tiến Trình Xử Lý Văn Bản
              </h3>
              <p className="text-[11px] text-slate-500">Trạng thái luân chuyển và phê duyệt chỉ đạo</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10.5px] font-medium">
              Thời gian thực
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} văn bản`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11.5px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. URGENT ACTIONS & RECENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Documents Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-red-50 text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Công Văn Khẩn Cần Xử Lý Ngay
                </h3>
                <p className="text-[11px] text-slate-500">Các tài liệu mức độ Hỏa tốc & Khẩn cấp</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('INBOUND')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.urgentDocs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Không có công văn khẩn tồn đọng</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tất cả các văn bản hỏa tốc đã được giải quyết đúng hạn SLA</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
                    <th className="pb-2">Số Hiệu</th>
                    <th className="pb-2">Trích Yếu</th>
                    <th className="pb-2">Độ Khẩn</th>
                    <th className="pb-2">Hạn Xử Lý</th>
                    <th className="pb-2 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {stats.urgentDocs.slice(0, 5).map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {doc.document_code}
                      </td>
                      <td className="py-2.5 max-w-[220px] truncate font-medium text-slate-800 dark:text-slate-200">
                        {doc.title}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
                          {doc.urgency_level === 'EXPRESS' || doc.urgency_level === 'HIGHLY_URGENT' ? '🔥 HỎA TỐC' : '⚡ KHẨN'}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500 text-[11px] font-mono">{doc.sla_deadline || doc.received_date || 'Trong ngày'}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onViewDoc(doc)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-[11px] transition-colors"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Hub & Fast Links */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Phím Tắt Nghiệp Vụ Nhanh
            </h3>
            <p className="text-[11px] text-slate-500">Truy cập tức thì các quy trình văn thư chính thức</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onOpenCreate}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-blue-600 mb-1">
                <Plus className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-blue-950 dark:text-blue-200">Tiếp Nhận / Ban Hành</p>
              <p className="text-[10.5px] text-blue-700/80 mt-0.5">Tạo hồ sơ văn bản mới vào sổ</p>
            </button>

            <button
              onClick={() => onNavigateTab('INBOUND')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <Inbox className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Sổ Công Văn Đến</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Phân công & luân chuyển xử lý</p>
            </button>

            <button
              onClick={() => onNavigateTab('OUTBOUND')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-purple-600 mb-1">
                <Send className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Sổ Công Văn Đi</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Ký số & phát hành ra bên ngoài</p>
            </button>

            <button
              onClick={() => onNavigateTab('INTERNAL_SOP')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <BookOpen className="w-4 h-4" />
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">Quy Chế & SOP</p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Kho văn bản hướng dẫn nội bộ</p>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2.5">
            <Stamp className="w-5 h-5 text-red-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white">Dấu Mộc Đỏ & Chứng Thư Số</p>
              <p className="text-[10.5px] text-slate-500">Được bảo vệ bằng mã hóa chuẩn AES-256 Cloud HSM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
