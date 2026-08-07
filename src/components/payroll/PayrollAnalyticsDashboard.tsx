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
import { DollarSign, PieChart as PieIcon, TrendingUp, ShieldCheck, Building2, CreditCard } from 'lucide-react';
import { PayrollSheet } from '@/types';

interface PayrollAnalyticsDashboardProps {
  payrolls: PayrollSheet[];
}

export default function PayrollAnalyticsDashboard({ payrolls }: PayrollAnalyticsDashboardProps) {
  // Aggregate Income Components by Department
  const deptMap: Record<string, { p1: number; p2: number; p3: number; ot: number; net: number }> = {};

  let totalP1 = 0;
  let totalP2 = 0;
  let totalP3 = 0;
  let totalOT = 0;
  let totalInsurance = 0;
  let totalTax = 0;
  let totalNet = 0;

  payrolls.forEach((p) => {
    const dept = p.department?.replace('Phòng ', '').replace('Khối ', '') || 'Khác';
    if (!deptMap[dept]) {
      deptMap[dept] = { p1: 0, p2: 0, p3: 0, ot: 0, net: 0 };
    }

    const p1 = Math.round(p.p1_calculated_salary / 1000000); // Millions
    const p2 = Math.round(p.p2_allowances / 1000000);
    const p3 = Math.round(p.p3_performance_salary / 1000000);
    const ot = Math.round((p.ot_salary + p.bonus_amount) / 1000000);
    const net = Math.round(p.net_salary / 1000000);

    deptMap[dept].p1 += p1;
    deptMap[dept].p2 += p2;
    deptMap[dept].p3 += p3;
    deptMap[dept].ot += ot;
    deptMap[dept].net += net;

    totalP1 += p.p1_calculated_salary;
    totalP2 += p.p2_allowances;
    totalP3 += p.p3_performance_salary;
    totalOT += p.ot_salary + p.bonus_amount;
    totalInsurance += p.bhxh_deduction + p.bhyt_deduction + p.bhtn_deduction;
    totalTax += p.personal_income_tax;
    totalNet += p.net_salary;
  });

  const deptChartData = Object.keys(deptMap).map((dept) => ({
    name: dept,
    LươngP1: deptMap[dept].p1,
    PhụCấpP2: deptMap[dept].p2,
    HiệuSuấtP3: deptMap[dept].p3,
    TăngCaOT: deptMap[dept].ot,
  }));

  // Deductions & Payout Pie Data
  const deductionsPieData = [
    { name: '💰 Lương Thực Nhận (NET)', value: Math.round(totalNet / 1000000), color: '#10B981' },
    { name: '🛡️ Bảo Hiểm (BHXH/Y/TN)', value: Math.round(totalInsurance / 1000000), color: '#8B5CF6' },
    { name: '🏛️ Thuế TNCN Khấu Trừ', value: Math.round(totalTax / 1000000), color: '#F59E0B' },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl space-y-6 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phân Tích Báo Cáo Tài Chính Nhân Sự</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Dashboard Phân Tích Cơ Cấu Bảng Lương 3P & Chi Phí Nhân Sự</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium block">Tổng Quỹ Lương NET Chi Trả:</span>
          <span className="tabular-nums font-semibold text-emerald-400 text-lg">
            {totalNet.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 3P Income Component Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Cơ Cấu Thu Nhập 3P (P1 + P2 + P3 + OT) Theo Phòng Ban (Tr VNĐ)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="LươngP1" stackId="a" fill="#3B82F6" name="P1 (Cứng)" />
                <Bar dataKey="PhụCấpP2" stackId="a" fill="#F59E0B" name="P2 (Phụ Cấp)" />
                <Bar dataKey="HiệuSuấtP3" stackId="a" fill="#10B981" name="P3 (Hiệu Suất)" />
                <Bar dataKey="TăngCaOT" stackId="a" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="OT & Thưởng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Net vs Deductions Pie Chart */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" /> Tỷ Lệ Lương Thực Nhận vs Khấu Trừ
          </h3>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deductionsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deductionsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-[11px]">
            {deductionsPieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="tabular-nums font-bold text-white">{st.value} Tr VNĐ</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
