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
import { Award, Sparkles, DollarSign, TrendingUp, BarChart3, PieChart as PieIcon, ShieldCheck } from 'lucide-react';
import { PerformanceScorecard } from '@/types';

interface PerformanceAnalyticsDashboardProps {
  scorecards: PerformanceScorecard[];
}

const GRADE_COLORS: Record<string, string> = {
  S: '#8B5CF6', // Purple
  A: '#10B981', // Emerald
  B: '#3B82F6', // Blue
  C: '#F59E0B', // Amber
  D: '#EF4444', // Red
};

export default function PerformanceAnalyticsDashboard({ scorecards }: PerformanceAnalyticsDashboardProps) {
  // Grade Distribution Data
  const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  const gradeP3Salary = { S: 0, A: 0, B: 0, C: 0, D: 0 };

  scorecards.forEach((sc) => {
    const grade = sc.rating_grade || 'A';
    if (gradeCounts[grade] !== undefined) {
      gradeCounts[grade]++;
      gradeP3Salary[grade] += sc.calculated_p3_salary || 0;
    }
  });

  const gradeChartData = [
    { grade: '🌟 Hạng S (A+)', count: gradeCounts.S, fill: GRADE_COLORS.S },
    { grade: '🟢 Hạng A (Giỏi)', count: gradeCounts.A, fill: GRADE_COLORS.A },
    { grade: '🟡 Hạng B (Khá)', count: gradeCounts.B, fill: GRADE_COLORS.B },
    { grade: '🟧 Hạng C (TB)', count: gradeCounts.C, fill: GRADE_COLORS.C },
    { grade: '🔴 Hạng D (K.Đạt)', count: gradeCounts.D, fill: GRADE_COLORS.D },
  ];

  // Department Average Score Data
  const deptScoreMap: Record<string, { totalScore: number; count: number }> = {};
  scorecards.forEach((sc) => {
    const dept = sc.department || 'Khác';
    if (!deptScoreMap[dept]) {
      deptScoreMap[dept] = { totalScore: 0, count: 0 };
    }
    deptScoreMap[dept].totalScore += sc.final_score || 0;
    deptScoreMap[dept].count++;
  });

  const deptAvgChartData = Object.keys(deptScoreMap).map((dept) => ({
    name: dept.replace('Phòng ', '').replace('Khối ', ''),
    ĐiểmTB: Math.round((deptScoreMap[dept].totalScore / deptScoreMap[dept].count) * 10) / 10,
  }));

  // P3 Salary Pie Data
  const p3PieData = [
    { name: '🌟 Hạng S (120% P3)', value: Math.round(gradeP3Salary.S / 1000000), color: GRADE_COLORS.S },
    { name: '🟢 Hạng A (100% P3)', value: Math.round(gradeP3Salary.A / 1000000), color: GRADE_COLORS.A },
    { name: '🟡 Hạng B (85% P3)', value: Math.round(gradeP3Salary.B / 1000000), color: GRADE_COLORS.B },
    { name: '🟧 Hạng C (50% P3)', value: Math.round(gradeP3Salary.C / 1000000), color: GRADE_COLORS.C },
  ].filter((d) => d.value > 0);

  const totalP3Pool = Object.values(gradeP3Salary).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl space-y-6 border border-slate-800">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Phân Tích Báo Cáo Hiệu Suất</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Dashboard Phân Tích Hiệu Suất Nhân Sự & Quỹ Lương P3</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium block">Tổng Quỹ Lương P3 Đã Phân Bổ:</span>
          <span className="tabular-nums font-semibold text-purple-400 text-lg">
            {totalP3Pool.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Grade Bell Curve Bar Chart */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Phân Phối Chuẩn Xếp Loại Hạng (Bell Curve)
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="grade" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Số Nhân Sự">
                  {gradeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Dept Average Final Score Bar Chart */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Điểm Hiệu Suất Trung Bình (0-100) Theo Phòng Ban
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAvgChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="ĐiểmTB" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Điểm TB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: P3 Salary Distribution Pie Chart */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Cơ Cấu Phân Bổ Lương P3 (Triệu VNĐ)
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={p3PieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {p3PieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-700/60 text-[11px]">
            {p3PieData.map((st) => (
              <div key={st.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                  {st.name}
                </span>
                <span className="tabular-nums font-bold text-emerald-400">{st.value} Tr VNĐ</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
