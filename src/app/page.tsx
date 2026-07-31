'use client';

import React from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  PhoneCall,
  ArrowUpRight,
  ShoppingBag,
  Award,
  Sparkles,
  ChevronRight,
  Play,
  Layers,
  CheckCircle2,
  Clock,
  Briefcase,
  MapPin,
  FileText,
  BarChart3,
  Calendar,
  PieChart,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner Header - Light Enterprise Hero */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Trung Tâm Điều Hành Dashboard Doanh Nghiệp GGBingo CRM</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Tổng Quan Vận Hành, Doanh Số & Nhân Sự Toàn Hệ Thống
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
              Quản lý Dịch vụ Ủy quyền Vận hành Gian hàng TMĐT (Shopee, TikTok Shop, Lazada, Amazon), Nhân sự 3P, KPIs & Bảng Lương.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-sm">
            <div className="text-right">
              <p className="text-[11px] text-slate-300 font-semibold">Tỷ lệ hoàn thành KPI tháng</p>
              <p className="text-sm font-black text-emerald-400 tabular-numbers">88.5% (Đạt Mục Tiêu)</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
              style={{ background: 'conic-gradient(#10B981 0 88.5%, #374151 88.5% 100%)' }}
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center font-extrabold text-[11px] text-emerald-400">
                88%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK DASHBOARD NAVIGATION METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue & CRM */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Doanh Số Dịch Vụ</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">3.480.000.000 ₫</p>
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so tháng trước
            </span>
            <Link href="/leads" className="text-blue-600 hover:underline">Phễu CRM →</Link>
          </div>
        </div>

        {/* Card 2: HRM & Headcount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Nhân Sự & Quy Mô</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">48 Nhân Sự</p>
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-1 border-t border-slate-100">
            <span>Active: 94% • Thử việc: 6%</span>
            <Link href="/hrm" className="text-purple-600 hover:underline">HRM →</Link>
          </div>
        </div>

        {/* Card 3: KPIs Target Completion */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Chỉ Tiêu KPIs</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">7 Chỉ Tiêu KPIs</p>
          <div className="flex items-center justify-between text-xs text-indigo-600 font-bold pt-1 border-t border-slate-100">
            <span>🔥 3 KPI Vượt Chỉ Tiêu</span>
            <Link href="/kpis" className="text-indigo-600 hover:underline">KPIs →</Link>
          </div>
        </div>

        {/* Card 4: Total Payroll */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Bảng Lương P3 Tháng</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 tracking-tight">485.000.000 ₫</p>
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-1 border-t border-slate-100">
            <span>Đã khóa & gửi Paystub</span>
            <Link href="/payroll" className="text-emerald-600 hover:underline">Bảng Lương →</Link>
          </div>
        </div>
      </div>

      {/* EXECUTIVE BI HEALTH ANALYTICS PANEL */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                Executive BI Analytics · Chỉ Số Sức Khỏe Doanh Nghiệp 360°
              </h3>
              <p className="text-xs text-slate-500">Phân tích hiệu quả đầu tư CAC, LTV, Retention Rate & ROI Kênh Marketing</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs rounded-full">
            🟢 Chỉ Số Kinh Doanh Khỏe Mạnh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-slate-500 font-extrabold uppercase text-[10.5px]">CAC (Cost per Acquisition)</span>
            <p className="text-xl font-black text-slate-900">3.250.000 ₫</p>
            <p className="text-emerald-600 text-[11px] font-bold">📉 -12.5% Chi phí thu hái KH</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-slate-500 font-extrabold uppercase text-[10.5px]">LTV (Customer Lifetime Value)</span>
            <p className="text-xl font-black text-blue-700">185.000.000 ₫</p>
            <p className="text-blue-600 text-[11px] font-bold">📈 +24.1% Giá trị trọn đời KH</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-slate-500 font-extrabold uppercase text-[10.5px]">Retention vs Churn Rate</span>
            <p className="text-xl font-black text-purple-700">94.2% / 5.8%</p>
            <p className="text-purple-600 text-[11px] font-bold">🛡️ Tỷ lệ duy trì KH vượt trội</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-slate-500 font-extrabold uppercase text-[10.5px]">ROI Kênh Quảng Cáo Trung Bình</span>
            <p className="text-xl font-black text-emerald-700">440% ROI</p>
            <p className="text-emerald-600 text-[11px] font-bold">🚀 Top ROI: Referral (650%)</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Pipeline Summary & Operational Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Pipeline Summary */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" /> Phễu Chuyển Đổi CRM & Khách Hàng Gian Hàng TMĐT
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Phân tích giá trị cơ hội kinh doanh ở từng giai đoạn</p>
              </div>
              <Link href="/leads" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Xem phễu chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">1. Lead Mới Tiếp Nhận • 142 Lead</span>
                  <span className="text-slate-900 font-bold tabular-numbers">850.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-600 rounded" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">2. Khảo Sát Gian Hàng & Đánh Giá • 86 Gian hàng</span>
                  <span className="text-slate-900 font-bold tabular-numbers">1.420.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-amber-500 rounded" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">3. Báo Giá & Kế Hoạch Vận Hành • 45 Gian hàng</span>
                  <span className="text-slate-900 font-bold tabular-numbers">980.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-purple-600 rounded" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">4. Chốt Hợp Đồng & Vận Hành • 32 Gian hàng</span>
                  <span className="text-slate-900 font-bold tabular-numbers">1.150.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Customers Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Khách Hàng Ký Hợp Đồng Mới Đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Khách Hàng / Công Ty</th>
                    <th className="pb-2.5">Sàn TMĐT</th>
                    <th className="pb-2.5">Gói Dịch Vụ</th>
                    <th className="pb-2.5">Sale Phụ Trách</th>
                    <th className="pb-2.5">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-900">Cửa hàng Thời Trang An An</td>
                    <td className="py-2.5 text-slate-600">Shopee Mall</td>
                    <td className="py-2.5 text-slate-600">Vận hành Trọn Gói</td>
                    <td className="py-2.5 text-slate-600">Trần Văn Hoàng (Đội 1)</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                        Đang Vận Hành
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-900">Mỹ Phẩm Beauty Glow</td>
                    <td className="py-2.5 text-slate-600">TikTok Shop</td>
                    <td className="py-2.5 text-slate-600">Livestream & Booking KOC</td>
                    <td className="py-2.5 text-slate-600">Lê Thị Mai (Đội 3)</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                        Khởi Tạo
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Lịch Sử Cuộc Gọi VoIP Mới
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Phạm Minh Đức → 0912 **** 889</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Tư vấn gói Shopee • 3 phút 12 giây</p>
                </div>
                <button className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1 text-[10px] transition-colors">
                  <Play className="w-3 h-3 fill-emerald-700" /> Ghi Âm
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Award className="w-4 h-4 text-amber-500" />
              Thành Tích Doanh Số Tháng
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Trần Văn Hoàng (Đội 1)</p>
                  <p className="text-[11px] text-slate-500 tabular-numbers">Doanh số: 620.000.000 ₫ (Đạt 124%)</p>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold">
                  Top 1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
