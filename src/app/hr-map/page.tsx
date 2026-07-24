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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-slate-900">Bản đồ phân bổ nhân sự</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1">
              🇻🇳 Chuẩn Đơn Vị Hành Chính 01/07/2025
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi phân bổ địa lý & mật độ lực lượng kinh doanh trên toàn quốc theo Tỉnh/Thành phố và Phường/Xã
          </p>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <VietnamEmployeeDistributionMap employees={employees} />
    </div>
  );
}
