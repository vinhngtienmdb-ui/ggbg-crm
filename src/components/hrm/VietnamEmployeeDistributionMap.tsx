'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Users,
  Search,
  Filter,
  Building2,
  Phone,
  Mail,
  UserCheck,
  Award,
  ChevronRight,
  ShieldCheck,
  PieChart,
  BarChart3,
  Layers,
  Sparkles,
  Map as MapIcon,
  Compass,
  CheckCircle2,
  Flag,
  Globe
} from 'lucide-react';
import { EmployeeProfile } from '@/types';

interface VietnamEmployeeDistributionMapProps {
  employees: EmployeeProfile[];
}

interface LocationDensityItem {
  provinceName: string;
  wardName?: string;
  region: 'BAC' | 'TRUNG' | 'NAM';
  count: number;
  employees: EmployeeProfile[];
  percentage: number;
  x?: number;
  y?: number;
}

export default function VietnamEmployeeDistributionMap({
  employees = [],
}: VietnamEmployeeDistributionMapProps) {
  const [groupingLevel, setGroupingLevel] = useState<'PROVINCE' | 'WARD'>('PROVINCE');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'ALL' | 'BAC' | 'TRUNG' | 'NAM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationDensityItem | null>(null);

  // Filter employees by department & search term
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDepartment !== 'ALL' && emp.department !== selectedDepartment) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const address = (emp.temporary_address || emp.permanent_address || '').toLowerCase();
        return (
          emp.full_name.toLowerCase().includes(term) ||
          emp.employee_code.toLowerCase().includes(term) ||
          emp.position.toLowerCase().includes(term) ||
          address.includes(term)
        );
      }
      return true;
    });
  }, [employees, selectedDepartment, searchTerm]);

  // Analyze geographic distribution based on employee residence addresses
  const locationStats = useMemo(() => {
    const map = new Map<string, { region: 'BAC' | 'TRUNG' | 'NAM'; employees: EmployeeProfile[]; x: number; y: number }>();

    filteredEmployees.forEach((emp) => {
      const addr = (emp.temporary_address || emp.permanent_address || 'Thành phố Hà Nội').trim();
      let key = 'Thành phố Hà Nội';
      let region: 'BAC' | 'TRUNG' | 'NAM' = 'BAC';
      let x = 180;
      let y = 140;

      if (groupingLevel === 'PROVINCE') {
        if (addr.includes('Hồ Chí Minh') || addr.includes('TP.HCM') || addr.includes('Sài Gòn')) {
          key = 'Thành phố Hồ Chí Minh';
          region = 'NAM';
          x = 240;
          y = 560;
        } else if (addr.includes('Đà Nẵng')) {
          key = 'Thành phố Đà Nẵng';
          region = 'TRUNG';
          x = 250;
          y = 360;
        } else if (addr.includes('Hải Phòng')) {
          key = 'Thành phố Hải Phòng';
          region = 'BAC';
          x = 225;
          y = 150;
        } else if (addr.includes('Cần Thơ')) {
          key = 'Thành phố Cần Thơ';
          region = 'NAM';
          x = 190;
          y = 620;
        } else if (addr.includes('Bình Dương')) {
          key = 'Tỉnh Bình Dương';
          region = 'NAM';
          x = 230;
          y = 535;
        } else if (addr.includes('Đồng Nai')) {
          key = 'Tỉnh Đồng Nai';
          region = 'NAM';
          x = 265;
          y = 545;
        } else if (addr.includes('Nghệ An')) {
          key = 'Tỉnh Nghệ An';
          region = 'TRUNG';
          x = 160;
          y = 250;
        } else if (addr.includes('Thanh Hóa')) {
          key = 'Tỉnh Thanh Hóa';
          region = 'TRUNG';
          x = 165;
          y = 210;
        } else if (addr.includes('Quảng Trị')) {
          key = 'Tỉnh Quảng Trị';
          region = 'TRUNG';
          x = 205;
          y = 320;
        } else {
          key = 'Thành phố Hà Nội';
          region = 'BAC';
          x = 180;
          y = 140;
        }
      } else {
        // WARD grouping (Post-01/07/2025 structure)
        if (addr.includes('Cầu Giấy')) { key = 'Phường Cầu Giấy, TP. Hà Nội'; x = 175; y = 135; }
        else if (addr.includes('Hai Bà Trưng')) { key = 'Phường Hai Bà Trưng, TP. Hà Nội'; x = 185; y = 145; }
        else if (addr.includes('Ba Đình')) { key = 'Phường Phúc Xá, TP. Hà Nội'; x = 180; y = 130; }
        else if (addr.includes('Thượng Đình') || addr.includes('Thanh Xuân')) { key = 'Phường Thượng Đình, TP. Hà Nội'; x = 170; y = 140; }
        else if (addr.includes('Quận 1') || addr.includes('Bến Nghé')) { key = 'Phường Bến Nghé, TP. Hồ Chí Minh'; x = 240; y = 560; }
        else if (addr.includes('Thảo Điền') || addr.includes('Quận 2')) { key = 'Phường Thảo Điền, TP. Hồ Chí Minh'; x = 250; y = 555; }
        else if (addr.includes('Hải Châu')) { key = 'Phường Hải Châu, TP. Đà Nẵng'; x = 250; y = 360; }
        else { key = 'Phường Trung Tâm, TP. Hà Nội'; x = 180; y = 140; }

        if (key.includes('TP. Hồ Chí Minh')) region = 'NAM';
        else if (key.includes('Đà Nẵng')) region = 'TRUNG';
        else region = 'BAC';
      }

      if (!map.has(key)) {
        map.set(key, { region, employees: [], x, y });
      }
      map.get(key)!.employees.push(emp);
    });

    const total = filteredEmployees.length || 1;
    const result: LocationDensityItem[] = [];

    map.forEach((val, key) => {
      result.push({
        provinceName: key,
        region: val.region,
        count: val.employees.length,
        employees: val.employees,
        percentage: Math.round((val.employees.length / total) * 100),
        x: val.x,
        y: val.y,
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }, [filteredEmployees, groupingLevel]);

  // Regional Summary Numbers
  const regionBreakdown = useMemo(() => {
    const bac = filteredEmployees.filter((e) => {
      const a = e.temporary_address || e.permanent_address || '';
      return !a.includes('Hồ Chí Minh') && !a.includes('Đà Nẵng') && !a.includes('Bình Dương') && !a.includes('Cần Thơ');
    }).length;

    const nam = filteredEmployees.filter((e) => {
      const a = e.temporary_address || e.permanent_address || '';
      return a.includes('Hồ Chí Minh') || a.includes('Bình Dương') || a.includes('Cần Thơ') || a.includes('Đồng Nai');
    }).length;

    const trung = filteredEmployees.length - bac - nam;

    return { bac, trung: Math.max(0, trung), nam };
  }, [filteredEmployees]);

  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header Bar & Control Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <MapIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Bản đồ phân bổ nhân sự</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span> Live GIS Vector
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Theo dõi mật độ phân bố địa bàn làm việc & nơi cư trú của nhân sự toàn quốc theo chuẩn đơn vị hành chính <strong>sau 01/07/2025</strong>.
              </p>
            </div>
          </div>

          {/* Group Level Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold shrink-0">
            <button
              onClick={() => setGroupingLevel('PROVINCE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                groupingLevel === 'PROVINCE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 Theo Tỉnh / Thành Phố
            </button>
            <button
              onClick={() => setGroupingLevel('WARD')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                groupingLevel === 'WARD' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              📍 Theo Phường / Xã (2025)
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc Theo:
            </span>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất Cả Phòng Ban</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSelectedRegionFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cả Nước
              </button>
              <button
                onClick={() => setSelectedRegionFilter('BAC')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'BAC' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Miền Bắc ({regionBreakdown.bac})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('TRUNG')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'TRUNG' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Miền Trung ({regionBreakdown.trung})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('NAM')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'NAM' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Miền Nam ({regionBreakdown.nam})
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên nhân sự, mã NV, địa chỉ..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* REGIONAL STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-red-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">⛰️ Khối Kinh Doanh Miền Bắc</span>
            <span className="text-2xl font-black text-red-600 mt-1 block">{regionBreakdown.bac} nhân sự</span>
            <span className="text-[11px] text-slate-400">Trụ sở Hà Nội & các tỉnh lân cận</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.bac / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">🏖️ Khối Kinh Doanh Miền Trung</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{regionBreakdown.trung} nhân sự</span>
            <span className="text-[11px] text-slate-400">Đà Nẵng, Nghệ An, Quảng Trị...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.trung / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">🌴 Khối Kinh Doanh Miền Nam</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{regionBreakdown.nam} nhân sự</span>
            <span className="text-[11px] text-slate-400">TP. Hồ Chí Minh, Bình Dương, Đồng Nai...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.nam / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* MAIN VISUAL MAP & LOCATION RANKING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7/12: REALISTIC INTERACTIVE SVG VIETNAM MAP CANVAS */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 z-10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400 animate-spin-slow" />
              <h4 className="font-extrabold text-sm text-white">Bản Đồ Phân Bổ Địa Lý Việt Nam (GIS Vector Map)</h4>
            </div>
            <span className="px-2.5 py-0.5 bg-slate-800 font-mono text-[11px] text-slate-300 font-bold rounded-lg border border-slate-700">
              Tổng {filteredEmployees.length} nhân sự
            </span>
          </div>

          {/* SVG MAP CONTAINER */}
          <div className="relative w-full max-w-md h-[560px] flex items-center justify-center my-2">

            {/* Background Ocean Pattern Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 rounded-2xl"></div>

            {/* HIGH RESOLUTION SVG VIETNAM S-CURVE & ISLANDS */}
            <svg
              viewBox="0 0 450 720"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG DEFINITIONS FOR GRADIENTS */}
              <defs>
                <linearGradient id="northGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="centralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="southGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* VIETNAM GEOGRAPHIC LAND MASS PATH (S-SHAPE OUTLINE) */}
              <path
                d="M 160 50 
                   C 190 40, 240 60, 250 110 
                   C 260 140, 240 180, 210 200 
                   C 180 220, 160 250, 175 300 
                   C 190 340, 245 360, 250 400 
                   C 260 450, 295 490, 280 540 
                   C 260 580, 220 620, 180 650 
                   C 150 670, 140 630, 160 610 
                   C 190 590, 220 560, 210 520 
                   C 200 480, 180 430, 150 380 
                   C 130 340, 120 280, 135 240 
                   C 145 200, 150 160, 130 110 
                   C 120 70, 140 60, 160 50 Z"
                fill="url(#northGrad)"
                stroke="#f87171"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-95"
              />

              {/* CENTRAL REGION OVERLAY PATH */}
              <path
                d="M 175 250 
                   C 210 280, 250 340, 260 400 
                   C 270 450, 295 490, 280 530 
                   C 270 510, 250 470, 230 430 
                   C 200 370, 160 320, 160 270 Z"
                fill="url(#centralGrad)"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />

              {/* SOUTH REGION OVERLAY PATH */}
              <path
                d="M 280 530 
                   C 260 580, 220 630, 180 650 
                   C 150 670, 140 630, 160 610 
                   C 190 590, 230 560, 240 520 Z"
                fill="url(#southGrad)"
                stroke="#34d399"
                strokeWidth="1.5"
              />

              {/* VIETNAM SOVEREIGNTY ISLANDS (HOÀNG SA & TRƯỜNG SA) */}
              {/* HOÀNG SA ISLANDS CLUSTER (ĐÀ NẴNG) */}
              <g className="cursor-pointer group">
                <circle cx="340" cy="330" r="4" fill="#fbbf24" className="animate-ping opacity-75" />
                <circle cx="340" cy="330" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <circle cx="352" cy="322" r="3" fill="#f59e0b" />
                <circle cx="330" cy="340" r="3" fill="#f59e0b" />
                <rect x="315" y="305" width="95" height="18" rx="4" fill="#78350f" opacity="0.9" />
                <text x="362" y="317" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  🇻🇳 QĐ. Hoàng Sa
                </text>
              </g>

              {/* TRƯỜNG SA ISLANDS CLUSTER (KHÁNH HÒA) */}
              <g className="cursor-pointer group">
                <circle cx="360" cy="540" r="4" fill="#34d399" className="animate-ping opacity-75" />
                <circle cx="360" cy="540" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="375" cy="552" r="3.5" fill="#10b981" />
                <circle cx="345" cy="565" r="3" fill="#10b981" />
                <rect x="330" y="515" width="98" height="18" rx="4" fill="#064e3b" opacity="0.9" />
                <text x="379" y="527" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  🇻🇳 QĐ. Trường Sa
                </text>
              </g>

              {/* DYNAMIC INTERACTIVE PINS FOR EACH PROVINCE / LOCATION */}
              {locationStats.map((loc) => {
                const isSelected = selectedLocation?.provinceName === loc.provinceName;
                const pinColor = loc.region === 'BAC' ? '#ef4444' : loc.region === 'TRUNG' ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={loc.provinceName}
                    transform={`translate(${loc.x || 200}, ${loc.y || 300})`}
                    onClick={() => setSelectedLocation(loc)}
                    className="cursor-pointer transition-all duration-300 hover:scale-125"
                  >
                    {/* Glowing Pulse Ring */}
                    <circle r="12" fill={pinColor} opacity="0.2" className="animate-ping" />

                    {/* Outer Circle */}
                    <circle r="9" fill={isSelected ? '#ffffff' : pinColor} stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />

                    {/* Count Text Inside Pin */}
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill={isSelected ? '#0f172a' : '#ffffff'}
                      fontSize="9"
                      fontWeight="900"
                      fontFamily="mono"
                    >
                      {loc.count}
                    </text>

                    {/* Floating Label Badge */}
                    <g transform="translate(14, -6)">
                      <rect
                        width={loc.provinceName.length * 5.8 + 12}
                        height="16"
                        rx="4"
                        fill={isSelected ? '#38bdf8' : '#0f172a'}
                        stroke={pinColor}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text x="6" y="11" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                        {loc.provinceName.replace('Thành phố ', 'TP. ').replace('Tỉnh ', '')}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Legend Bar */}
          <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-around text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Miền Bắc
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Miền Trung
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Miền Nam
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Flag className="w-3.5 h-3.5" /> Hoàng Sa & Trường Sa
            </span>
          </div>
        </div>

        {/* RIGHT 5/12: LOCATION BREAKDOWN & EMPLOYEE ROSTER PANEL */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Chi Tiết Địa Bàn Chọn</span>
                  <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" /> {selectedLocation.provinceName}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                >
                  Đóng
                </button>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950">Tổng số nhân sự cư trú:</span>
                <span className="px-3 py-1 bg-indigo-600 text-white font-mono font-bold rounded-xl">
                  {selectedLocation.count} Nhân sự
                </span>
              </div>

              {/* Roster of Employees residing in selected location */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 sleek-scrollbar">
                {selectedLocation.employees.map((emp) => (
                  <div key={emp.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                          {emp.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{emp.full_name}</p>
                          <p className="text-[11px] font-mono text-indigo-700">{emp.employee_code} • {emp.position}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {emp.status}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                      <p className="flex items-center gap-1 font-mono">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {emp.department}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{emp.temporary_address || emp.permanent_address || 'Chưa cập nhật'}</span>
                      </p>
                      <p className="flex items-center gap-1 font-mono text-blue-700">
                        <Phone className="w-3.5 h-3.5" /> {emp.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Bảng Xếp Hạng Mật Độ Địa Bàn
              </h4>

              <div className="space-y-3">
                {locationStats.slice(0, 7).map((item, idx) => (
                  <div
                    key={item.provinceName}
                    onClick={() => setSelectedLocation(item)}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 rounded-2xl transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 font-mono text-[10px] font-bold flex items-center justify-center text-slate-700">
                          #{idx + 1}
                        </span>
                        {item.provinceName}
                      </span>
                      <span className="font-mono font-extrabold text-indigo-700">
                        {item.count} nhân sự ({item.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
