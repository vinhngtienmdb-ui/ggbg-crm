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
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Top Banner Header - Crisp Enterprise Style */}
      <div className="bg-slate-900 rounded-lg p-5 text-white border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium mb-2.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>GGBingo CRM System Overview</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
              Tổng Quan Vận Hành & Doanh Số Kinh Doanh
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
              Quản lý Dịch vụ Ủy quyền Vận hành Gian hàng TMĐT (Shopee, TikTok Shop, Lazada, Amazon) và Nền tảng GGBingoVN.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-md border border-slate-700/80">
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-medium">Tiến độ KPI tháng này</p>
              <p className="text-sm font-bold text-emerald-400 tabular-numbers">88.5% (Đạt chỉ tiêu)</p>
            </div>
            <div className="w-9 h-9 rounded border border-emerald-500/40 flex items-center justify-center font-bold text-xs bg-emerald-500/10 text-emerald-300">
              88%
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Agency GMV */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Doanh Số Dịch Vụ</span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers tracking-tight">3.480.000.000 ₫</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tăng 18.4% so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Total Active Customers */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Khách Hàng (Gian Hàng)</span>
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers tracking-tight">1.240 Gian Hàng</p>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Shopee: 520 • TikTok: 480 • Lazada: 240</p>
        </div>

        {/* Card 3: Total Leads Ingested */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lead Mới Tiếp Nhận</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers tracking-tight">458 Lead</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Tự động phân bổ nhân sự</span>
          </div>
        </div>

        {/* Card 4: VoIP Activity */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cuộc Gọi Tổng Đài</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-numbers tracking-tight">12.450 Phút Gọi</p>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Tỷ lệ nghe máy: 84.2% (Ghi âm tự động)</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Pipeline Summary */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" /> Phễu Bán Hàng Dịch Vụ TMĐT
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Phân tích giá trị cơ hội kinh doanh ở từng giai đoạn</p>
              </div>
              <a href="/leads" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Xem chi tiết phễu <ChevronRight className="w-3.5 h-3.5" />
              </a>
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
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs">
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
          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Lịch Sử Cuộc Gọi Mới
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Phạm Minh Đức → 0912 **** 889</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Tư vấn gói Shopee • 3 phút 12 giây</p>
                </div>
                <button className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1 text-[10px] transition-colors">
                  <Play className="w-3 h-3 fill-emerald-700" /> Ghi Âm
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Award className="w-4 h-4 text-amber-500" />
              Thành Tích Doanh Số Tháng
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">1</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Trần Văn Hoàng (Đội 1)</p>
                  <p className="text-[11px] text-slate-500 tabular-numbers">Doanh số: 620.000.000 ₫ (Đạt 124%)</p>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
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
