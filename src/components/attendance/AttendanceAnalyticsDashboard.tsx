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
    { name: ' Đúng Giờ', value: onTime || 4, color: '#10B981' },
    { name: ' Đi Muộn', value: late || 1, color: '#F59E0B' },
    { name: ' Tăng Ca OT', value: ot || 2, color: '#8B5CF6' },
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
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[11px] font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Phân Tích Báo Cáo Chấm Công & Nghỉ Phép</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard Phân Tích Kỷ Luật Đi Làm & Quỹ Phép Năm</h2>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 font-medium block">Tổng Ngày Phép Đã Duyệt:</span>
          <span className="tabular-nums font-semibold text-purple-600 dark:text-purple-400 text-lg">{totalLeaveDays} Ngày</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Workdays Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Ngày Công Thực Tế vs Nghỉ Phép Theo Nhân Sự (Ngày)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timesheetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 26]} stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
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
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Tỷ Lệ Trạng Thái Đi Làm
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
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
            {attendancePieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">{st.value} Ca</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
