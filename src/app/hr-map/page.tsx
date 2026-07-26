'use client';

import React, { useState } from 'react';
import { MapPin, Users, Filter, Compass } from 'lucide-react';
import { getEmployees } from '@/lib/hrmStore';
import VietnamEmployeeDistributionMap from '@/components/hrm/VietnamEmployeeDistributionMap';

export default function HrMapPage() {
  const [employees] = useState(() => getEmployees());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-line shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MapPin className="w-6 h-6 text-danger-fg" />
            <h1 className="text-xl font-bold text-ink-900">Bản đồ phân bổ nhân sự</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-danger-bg text-danger-fg text-xs font-bold border border-danger-border flex items-center gap-1">
              🇻🇳 Chuẩn 34 Tỉnh / Thành Phố (Nghị quyết 202/2025/QH15)
            </span>
            <a
              href="https://cdn.thuvienphapluat.vn/phap-luat/2022-2/NTTY/ban-do-34-tinh-thanh.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 bg-brand-50 text-brand-800 border border-brand-100 rounded-full text-xs font-bold hover:bg-brand-300 transition-colors"
            >
              📄 Xem Bản Đồ 34 Tỉnh Thành PDF (Thư Viện Pháp Luật)
            </a>
            <a
              href="https://github.com/nguyenduy1133/Free-GIS-Data"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 bg-line-soft text-ink-900 border border-line-strong rounded-full text-xs font-bold hover:bg-line transition-colors flex items-center gap-1"
            >
              🌐 Dữ Liệu Vector nguyenduy1133/Free-GIS-Data
            </a>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Theo dõi phân bổ địa lý & mật độ lực lượng kinh doanh trên toàn quốc theo Tỉnh/Thành phố và Phường/Xã
          </p>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <VietnamEmployeeDistributionMap employees={employees} />
    </div>
  );
}
