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
  FileSpreadsheet,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Banner Header - Executive Hero with Glow */}
      <div className="gg-hero p-5 md:p-6 relative overflow-hidden bg-slate-900 text-white rounded-lg shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trung Tâm Điều Hành Dashboard Enterprise GGBingo CRM</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
              Tổng Quan Vận Hành, Doanh Số & Nhân Sự 360°
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed font-normal">
              Hệ thống điều hành Ủy quyền Vận hành Gian hàng TMĐT (Shopee, TikTok Shop, Lazada, Amazon), Nhân sự 3P, KPIs & Bảng Lương P3.
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80 shadow-xs shrink-0">
            <div className="text-right">
              <p className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Tiến độ KPI Tháng</p>
              <p className="text-sm font-bold text-emerald-400 tabular-numbers">88.5% (Đạt Mục Tiêu)</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-xs ring-2 ring-emerald-500/30"
              style={{ background: 'conic-gradient(#10B981 0 88.5%, #374151 88.5% 100%)' }}
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-emerald-400">
                88%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCHER ACTION BAR */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
        <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Thao Tác Nhanh Hệ Thống (Quick Launcher):
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/leads"
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md flex items-center gap-1.5 transition-all font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Tạo Lead Mới
          </Link>

          <Link
            href="/proposals"
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md flex items-center gap-1.5 transition-all font-semibold"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" /> Nộp Phiếu Phê Duyệt
          </Link>

          <Link
            href="/customers"
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md flex items-center gap-1.5 transition-all font-semibold"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" /> Khách Hàng 360°
          </Link>
        </div>
      </div>

      {/* QUICK DASHBOARD NAVIGATION METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue & CRM */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs card-hover space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh Số Dịch Vụ</span>
            <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">3.480.000.000 ₫</p>
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so tháng trước
            </span>
            <Link href="/leads" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold">Phễu CRM <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Card 2: HRM & Headcount */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs card-hover space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhân Sự & Quy Mô</span>
            <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">48 Nhân Sự</p>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Active: 94% • Thử việc: 6%</span>
            <Link href="/hrm" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold">HRM <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Card 3: KPIs Target Completion */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs card-hover space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chỉ Tiêu KPIs</span>
            <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">7 Chỉ Tiêu KPIs</p>
          <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>3 KPI Vượt Chỉ Tiêu</span>
            <Link href="/kpis" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold">KPIs <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Card 4: Total Payroll */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs card-hover space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bảng Lương P3 Tháng</span>
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">485.000.000 ₫</p>
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Đã khóa & gửi Paystub</span>
            <Link href="/payroll" className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold">Bảng Lương <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>

      {/* EXECUTIVE BI HEALTH ANALYTICS PANEL */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Executive BI Analytics · Chỉ Số Sức Khỏe Doanh Nghiệp 360°
              </h3>
              <p className="text-xs text-slate-500 font-normal">Phân tích hiệu quả đầu tư CAC, LTV, Retention Rate & ROI Kênh Marketing</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs rounded-md">
            Chỉ Số Kinh Doanh Khỏe Mạnh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
            <span className="text-slate-500 font-medium uppercase text-[10.5px]">CAC (Cost per Acquisition)</span>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">3.250.000 ₫</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">📉 -12.5% Chi phí thu hái KH</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
            <span className="text-slate-500 font-medium uppercase text-[10.5px]">LTV (Customer Lifetime Value)</span>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">185.000.000 ₫</p>
            <p className="text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">📈 +24.1% Giá trị trọn đời KH</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
            <span className="text-slate-500 font-medium uppercase text-[10.5px]">Retention vs Churn Rate</span>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">94.2% / 5.8%</p>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] font-semibold">Tỷ lệ duy trì KH vượt trội</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg space-y-1">
            <span className="text-slate-500 font-medium uppercase text-[10.5px]">ROI Kênh Quảng Cáo Trung Bình</span>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">440% ROI</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Top ROI: Referral (650%)</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Pipeline Summary & Operational Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Pipeline Summary */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" /> Phễu Chuyển Đổi CRM & Khách Hàng Gian Hàng TMĐT
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">Phân tích giá trị cơ hội kinh doanh ở từng giai đoạn</p>
              </div>
              <Link href="/leads" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Xem phễu chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">1. Lead Mới Tiếp Nhận • 142 Lead</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">850.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">2. Khảo Sát Gian Hàng & Đánh Giá • 86 Gian hàng</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">1.420.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">3. Báo Giá & Kế Hoạch Vận Hành • 45 Gian hàng</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">980.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">4. Chốt Hợp Đồng & Vận Hành • 32 Gian hàng</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">1.150.000.000 ₫</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Customers Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-4">Khách Hàng Ký Hợp Đồng Mới Đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Khách Hàng / Công Ty</th>
                    <th className="pb-3">Sàn TMĐT</th>
                    <th className="pb-3">Gói Dịch Vụ</th>
                    <th className="pb-3">Sale Phụ Trách</th>
                    <th className="pb-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">Cửa hàng Thời Trang An An</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Shopee Mall</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Vận hành Trọn Gói</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Trần Văn Hoàng (Đội 1)</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-[10px]">
                        Đang Vận Hành
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">Mỹ Phẩm Beauty Glow</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">TikTok Shop</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Livestream & Booking KOC</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Lê Thị Mai (Đội 3)</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold text-[10px]">
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
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Lịch Sử Cuộc Gọi VoIP Mới
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Phạm Minh Đức → 0912 **** 889</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Tư vấn gói Shopee • 3 phút 12 giây</p>
                </div>
                <button className="px-2.5 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1 text-[10px] transition-colors">
                  <Play className="w-3 h-3 fill-emerald-600" /> Ghi Âm
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="w-4 h-4 text-amber-500" />
              Thành Tích Doanh Số Tháng
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">1</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Trần Văn Hoàng (Đội 1)</p>
                  <p className="text-[11px] text-slate-500 tabular-numbers">Doanh số: 620.000.000 ₫ (Đạt 124%)</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md text-[10px] font-semibold">
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
