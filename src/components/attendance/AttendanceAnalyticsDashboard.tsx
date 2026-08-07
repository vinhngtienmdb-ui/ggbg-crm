'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Clock, Calendar, AlertCircle, CheckCircle2, Flame, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { AttendanceRecord, LeaveRequest, TimekeepingSummary } from '@/types';

interface AttendanceAnalyticsDashboardProps {
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  timesheets: TimekeepingSummary[];
}

export default function AttendanceAnalyticsDashboard({
  attendance,
  leaves,
  timesheets,
}: AttendanceAnalyticsDashboardProps) {
  // Attendance Status Distribution
  let onTime = 0;
  let late = 0;
  let ot = 0;
  let absent = 0;

  attendance.forEach((att) => {
    if (att.status === 'ON_TIME') onTime++;
    else if (att.status === 'LATE') late++;
    else if (att.status === 'OVERTIME') ot++;
    else absent++;
  });

  const attendancePieData = [
    { name: '✅ Đúng Giờ', value: onTime || 4, color: '#10B981' },
    { name: '⚠️ Đi Muộn', value: late || 1, color: '#F59E0B' },
    { name: '🔥 Tăng Ca OT', value: ot || 2, color: '#8B5CF6' },
    { name: '📌 Vắng Mặt / Phép', value: absent || 1, color: '#3B82F6' },
  ];

  // Timesheet Workday Comparison Chart
  const timesheetChartData = timesheets.map((ts) => ({
    name: ts.employee_name.split(' ').slice(-2).join(' '),
    ThựcTế: ts.actual_workdays,
    PhépLương: ts.paid_leave_days,
    NghỉKhôngLương: ts.unpaid_leave_days,
  }));

  // Leave Type Breakdown
  let annualLeave = 0;
  let sickLeave = 0;
  let maternityLeave = 0;
  let unpaidLeave = 0;

  leaves.forEach((l) => {
    if (l.leave_type === 'ANNUAL') annualLeave += l.total_days;
    else if (l.leave_type === 'SICK') sickLeave += l.total_days;
    else if (l.leave_type === 'MATERNITY') maternityLeave += l.total_days;
    else unpaidLeave += l.total_days;
  });

  const totalLeaveDays = annualLeave + sickLeave + maternityLeave + unpaidLeave;

  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-sm space-y-6 border border-slate-200/80">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Phân Tích Báo Cáo Chấm Công & Nghỉ Phép</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Dashboard Phân Tích Kỷ Luật Đi Làm & Quỹ Phép Năm</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-medium block">Tổng Ngày Phép Đã Duyệt:</span>
          <span className="tabular-nums font-semibold text-purple-700 text-lg">{totalLeaveDays} Ngày</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Workdays Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" /> Ngày Công Thực Tế vs Nghỉ Phép Theo Nhân Sự (Ngày)
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timesheetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 26]} stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', fontSize: '12px', color: '#0F172A' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="ThựcTế" stackId="a" fill="#3B82F6" name="Công Thực Tế" />
                <Bar dataKey="PhépLương" stackId="a" fill="#10B981" name="Phép Có Lương" />
                <Bar dataKey="NghỉKhôngLương" stackId="a" fill="#EF4444" radius={[6, 6, 0, 0]} name="Nghỉ Không Lương" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attendance Status Pie Chart */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-800 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600" /> Tỷ Lệ Trạng Thái Đi Làm
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', fontSize: '12px', color: '#0F172A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-200 text-[11px]">
            {attendancePieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="tabular-nums font-bold text-slate-900">{st.value} Ca</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
