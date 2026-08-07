'use client';

import React, { useMemo } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  ShieldCheck,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Plane,
  Timer,
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
import { EmployeeProfile } from '@/types';

const PALETTE = ['#2E5CE6', '#7C3AED', '#1F7A33', '#D97706', '#C22F35', '#0E7490'];

const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang làm việc',
  Probation: 'Thử việc',
  Pending_Resign: 'Chờ nghỉ việc',
  Resigned: 'Đã nghỉ việc',
  Suspended: 'Tạm hoãn HĐ',
  Applicant: 'Ứng viên mới',
};

const STATUS_ORDER = ['Active', 'Probation', 'Pending_Resign', 'Suspended', 'Resigned', 'Applicant'];

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n || 0);

const formatCompact = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n || 0));

function daysBetween(from: Date, to: Date) {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HrmDashboard({ employees }: { employees: EmployeeProfile[] }) {
  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const probation = employees.filter((e) => e.status === 'Probation').length;
    const bhxhJoined = employees.filter((e) => e.bhxh_status === 'Đang tham gia').length;
    const bhxhRate = total > 0 ? Math.round((bhxhJoined / total) * 100) : 0;

    const workingForce = employees.filter((e) => e.status === 'Active' || e.status === 'Probation');
    const payroll = workingForce.reduce((s, e) => s + (e.base_salary || 0), 0);
    const avgSalary = workingForce.length > 0 ? payroll / workingForce.length : 0;

    return { total, active, probation, bhxhJoined, bhxhRate, payroll, avgSalary, workingCount: workingForce.length };
  }, [employees]);

  // Cảnh báo hợp đồng
  const contractAlerts = useMemo(() => {
    const expired: EmployeeProfile[] = [];
    const expiringSoon: EmployeeProfile[] = [];
    employees.forEach((e) => {
      if (!e.contract_end_date) return;
      if (e.status === 'Resigned') return;
      const end = new Date(e.contract_end_date);
      if (isNaN(end.getTime())) return;
      const diff = daysBetween(today, end);
      if (diff < 0) expired.push(e);
      else if (diff <= 60) expiringSoon.push(e);
    });
    return { expired, expiringSoon };
  }, [employees, today]);

  const contractTypeData = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      const k = e.contract_type || 'Chưa xác định';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const genderData = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      const k = e.gender || 'Khác';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const educationData = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      const k = e.education_level || 'Chưa cập nhật';
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const seniorityData = useMemo(() => {
    const buckets = { '<1 năm': 0, '1-3 năm': 0, '3-5 năm': 0, '>5 năm': 0 };
    employees.forEach((e) => {
      if (!e.joined_date) return;
      const joined = new Date(e.joined_date);
      if (isNaN(joined.getTime())) return;
      const years = daysBetween(joined, today) / 365;
      if (years < 1) buckets['<1 năm']++;
      else if (years < 3) buckets['1-3 năm']++;
      else if (years < 5) buckets['3-5 năm']++;
      else buckets['>5 năm']++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [employees, today]);

  // Phân bổ trạng thái theo phòng ban (stacked)
  const deptStatusData = useMemo(() => {
    const activeStatuses = STATUS_ORDER.filter((s) => employees.some((e) => e.status === s));
    const byDept = new Map<string, Record<string, number>>();
    employees.forEach((e) => {
      const dept = e.department || 'Khác';
      if (!byDept.has(dept)) byDept.set(dept, {});
      const row = byDept.get(dept)!;
      row[e.status] = (row[e.status] || 0) + 1;
    });
    const rows = Array.from(byDept.entries()).map(([department, counts]) => {
      const row: Record<string, any> = { department };
      activeStatuses.forEach((s) => (row[s] = counts[s] || 0));
      return row;
    });
    return { rows, statuses: activeStatuses };
  }, [employees]);

  const timeStats = useMemo(() => {
    const totalLeave = employees.reduce((s, e) => s + (e.annual_leave_days || 0), 0);
    const takenLeave = employees.reduce((s, e) => s + (e.leave_taken_days || 0), 0);
    const totalOT = employees.reduce((s, e) => s + (e.overtime_hours || 0), 0);
    return { totalLeave, takenLeave, remainingLeave: totalLeave - takenLeave, totalOT };
  }, [employees]);

  const kpiCards = [
    { label: 'Tổng Lao Động', value: String(stats.total), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Đang Làm Việc', value: String(stats.active), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Đang Thử Việc', value: String(stats.probation), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tỷ Lệ Tham Gia BHXH', value: `${stats.bhxhRate}%`, sub: `${stats.bhxhJoined}/${stats.total} người`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Quỹ Lương Hiện Tại', value: formatVND(stats.payroll), sub: `${stats.workingCount} người đang làm/thử việc`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50', small: true },
    { label: 'Lương Bình Quân', value: formatVND(stats.avgSalary), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', small: true },
  ];

  const cardCls = 'bg-white border border-slate-200 rounded-xl p-4 shadow-sm';
  const labelCls = 'text-[10.5px] font-bold tracking-wide text-slate-500 uppercase';

  const renderPieLabel = (entry: any) => `${entry.name}: ${entry.value}`;

  return (
    <div className="space-y-6">
      {/* Hàng thẻ KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={cardCls}>
              <div className="flex items-center justify-between mb-2">
                <span className={labelCls}>{c.label}</span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className={`font-bold text-slate-900 ${c.small ? 'text-base' : 'text-2xl'}`}>{c.value}</p>
              {c.sub && <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Cảnh báo hợp đồng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">HĐ Đã Hết Hạn</p>
              <p className="text-[11px] text-slate-500">{contractAlerts.expired.length} hợp đồng cần xử lý gấp</p>
            </div>
          </div>
          {contractAlerts.expired.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Không có hợp đồng nào đã hết hạn.</p>
          ) : (
            <div className="space-y-1.5">
              {contractAlerts.expired.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <span className="font-bold text-slate-900">{e.full_name} <span className="font-mono text-red-600 font-normal">({e.employee_code})</span></span>
                  <span className="font-semibold text-red-700">{e.contract_end_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">HĐ Sắp Hết Hạn (60 ngày)</p>
              <p className="text-[11px] text-slate-500">{contractAlerts.expiringSoon.length} hợp đồng cần gia hạn</p>
            </div>
          </div>
          {contractAlerts.expiringSoon.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Không có hợp đồng nào sắp hết hạn.</p>
          ) : (
            <div className="space-y-1.5">
              {contractAlerts.expiringSoon.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-xs bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <span className="font-bold text-slate-900">{e.full_name} <span className="font-mono text-amber-700 font-normal">({e.employee_code})</span></span>
                  <span className="font-semibold text-amber-700">{e.contract_end_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Biểu đồ cơ cấu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cơ cấu loại hợp đồng */}
        <div className={cardCls}>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Cơ Cấu Loại Hợp Đồng</h3>
          <p className="text-[11px] text-slate-500 mb-3">Phân bổ theo loại hợp đồng lao động</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={contractTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={renderPieLabel}>
                {contractTypeData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cơ cấu giới tính - Donut */}
        <div className={cardCls}>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Cơ Cấu Giới Tính</h3>
          <p className="text-[11px] text-slate-500 mb-3">Tỷ lệ nam / nữ / khác</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} label={renderPieLabel}>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cơ cấu trình độ chuyên môn */}
        <div className={cardCls}>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Cơ Cấu Trình Độ Chuyên Môn</h3>
          <p className="text-[11px] text-slate-500 mb-3">Trình độ chuyên môn kỹ thuật (CMKT)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="value" name="Số lao động" radius={[6, 6, 0, 0]}>
                {educationData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cơ cấu thâm niên */}
        <div className={cardCls}>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Cơ Cấu Thâm Niên</h3>
          <p className="text-[11px] text-slate-500 mb-3">Số năm công tác tính từ ngày vào làm</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={seniorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="value" name="Số lao động" radius={[6, 6, 0, 0]}>
                {seniorityData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Phân bổ trạng thái theo phòng ban - stacked */}
      <div className={cardCls}>
        <h3 className="font-bold text-slate-900 text-sm mb-1">Phân Bổ Trạng Thái Lao Động Theo Phòng Ban</h3>
        <p className="text-[11px] text-slate-500 mb-3">Số lượng nhân sự theo trạng thái làm việc tại từng phòng ban</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={deptStatusData.rows} margin={{ bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-8} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {deptStatusData.statuses.map((s, i) => (
              <Bar key={s} dataKey={s} stackId="status" name={STATUS_LABELS[s] || s} fill={PALETTE[i % PALETTE.length]} radius={i === deptStatusData.statuses.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Khối thời giờ làm việc & nghỉ ngơi */}
      <div>
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" /> Thời Giờ Làm Việc & Nghỉ Ngơi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span className={labelCls}>Tổng Ngày Phép</span>
            </div>
            <p className="font-bold text-slate-900 text-2xl">{formatCompact(timeStats.totalLeave)}</p>
            <p className="text-[11px] text-slate-500">ngày phép năm</p>
          </div>
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-4 h-4 text-amber-600" />
              <span className={labelCls}>Đã Nghỉ</span>
            </div>
            <p className="font-bold text-slate-900 text-2xl">{formatCompact(timeStats.takenLeave)}</p>
            <p className="text-[11px] text-slate-500">ngày đã sử dụng</p>
          </div>
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span className={labelCls}>Còn Lại</span>
            </div>
            <p className="font-bold text-emerald-600 text-2xl">{formatCompact(timeStats.remainingLeave)}</p>
            <p className="text-[11px] text-slate-500">ngày phép còn lại</p>
          </div>
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-red-600" />
              <span className={labelCls}>Tổng Giờ OT</span>
            </div>
            <p className="font-bold text-slate-900 text-2xl">{formatCompact(timeStats.totalOT)}</p>
            <p className="text-[11px] text-slate-500">giờ làm thêm lũy kế</p>
          </div>
        </div>
      </div>
    </div>
  );
}
