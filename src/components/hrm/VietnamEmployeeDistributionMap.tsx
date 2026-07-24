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
  CheckCircle2
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
    const map = new Map<string, { region: 'BAC' | 'TRUNG' | 'NAM'; employees: EmployeeProfile[] }>();

    filteredEmployees.forEach((emp) => {
      const addr = (emp.temporary_address || emp.permanent_address || 'Thành phố Hà Nội').trim();
      let key = 'Thành phố Hà Nội';
      let region: 'BAC' | 'TRUNG' | 'NAM' = 'BAC';

      if (groupingLevel === 'PROVINCE') {
        if (addr.includes('Hồ Chí Minh') || addr.includes('TP.HCM') || addr.includes('Sài Gòn')) {
          key = 'Thành phố Hồ Chí Minh';
          region = 'NAM';
        } else if (addr.includes('Đà Nẵng')) {
          key = 'Thành phố Đà Nẵng';
          region = 'TRUNG';
        } else if (addr.includes('Hải Phòng')) {
          key = 'Thành phố Hải Phòng';
          region = 'BAC';
        } else if (addr.includes('Cần Thơ')) {
          key = 'Thành phố Cần Thơ';
          region = 'NAM';
        } else if (addr.includes('Bình Dương')) {
          key = 'Tỉnh Bình Dương';
          region = 'NAM';
        } else if (addr.includes('Đồng Nai')) {
          key = 'Tỉnh Đồng Nai';
          region = 'NAM';
        } else if (addr.includes('Nghệ An')) {
          key = 'Tỉnh Nghệ An';
          region = 'TRUNG';
        } else if (addr.includes('Thanh Hóa')) {
          key = 'Tỉnh Thanh Hóa';
          region = 'TRUNG';
        } else if (addr.includes('Quảng Trị')) {
          key = 'Tỉnh Quảng Trị';
          region = 'TRUNG';
        } else {
          key = 'Thành phố Hà Nội';
          region = 'BAC';
        }
      } else {
        // WARD grouping (Post-01/07/2025 structure)
        if (addr.includes('Cầu Giấy')) key = 'Phường Cầu Giấy, TP. Hà Nội';
        else if (addr.includes('Hai Bà Trưng')) key = 'Phường Hai Bà Trưng, TP. Hà Nội';
        else if (addr.includes('Ba Đình')) key = 'Phường Phúc Xá, TP. Hà Nội';
        else if (addr.includes('Thượng Đình') || addr.includes('Thanh Xuân')) key = 'Phường Thượng Đình, TP. Hà Nội';
        else if (addr.includes('Quận 1') || addr.includes('Bến Nghé')) key = 'Phường Bến Nghé, TP. Hồ Chí Minh';
        else if (addr.includes('Thảo Điền') || addr.includes('Quận 2')) key = 'Phường Thảo Điền, TP. Hồ Chí Minh';
        else if (addr.includes('Hải Châu')) key = 'Phường Hải Châu, TP. Đà Nẵng';
        else key = 'Phường Trung Tâm, TP. Hà Nội';

        if (key.includes('TP. Hồ Chí Minh')) region = 'NAM';
        else if (key.includes('Đà Nẵng')) region = 'TRUNG';
        else region = 'BAC';
      }

      if (!map.has(key)) {
        map.set(key, { region, employees: [] });
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
              <Compass className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Bản Đồ Phân Bổ Nhân Sự Kinh Doanh Việt Nam</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span> Live GIS Data
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Theo dõi mật độ phân bố địa bàn làm việc & nơi cư trú của Chuyên viên/Nhân viên kinh doanh theo Đơn vị Hành chính chuẩn <strong>sau 01/07/2025</strong>.
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

        {/* LEFT 7/12: VISUAL VIETNAM GEOGRAPHIC HEATMAP CANVAS */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 text-white space-y-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-indigo-400" />
              <h4 className="font-extrabold text-sm text-white">Sơ Đồ Phân Bổ Địa Lý (Vietnam Heatmap)</h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Tổng {filteredEmployees.length} nhân sự
            </span>
          </div>

          {/* Interactive Regional Cluster Map Cards */}
          <div className="space-y-4">
            {/* North Region Block */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-red-400 flex items-center gap-1.5">
                  🔴 KHU VỰC MIỀN BẮC (HÀ NỘI & CÁC TỈNH)
                </span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[11px] font-bold rounded">
                  {regionBreakdown.bac} Chuyên Viên
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {locationStats
                  .filter((item) => item.region === 'BAC')
                  .map((item) => (
                    <div
                      key={item.provinceName}
                      onClick={() => setSelectedLocation(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedLocation?.provinceName === item.provinceName
                          ? 'bg-red-600 text-white border-red-400 shadow-lg ring-2 ring-red-400/30'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{item.provinceName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 font-mono text-[11px] font-black rounded shrink-0">
                        {item.count} NS
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Central Region Block */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                  🟡 KHU VỰC MIỀN TRUNG (ĐÀ NẴNG, NGHỆ AN...)
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold rounded">
                  {regionBreakdown.trung} Chuyên Viên
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {locationStats
                  .filter((item) => item.region === 'TRUNG')
                  .map((item) => (
                    <div
                      key={item.provinceName}
                      onClick={() => setSelectedLocation(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedLocation?.provinceName === item.provinceName
                          ? 'bg-amber-600 text-white border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{item.provinceName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 font-mono text-[11px] font-black rounded shrink-0">
                        {item.count} NS
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* South Region Block */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
                  🟢 KHU VỰC MIỀN NAM (TP.HCM, BÌNH DƯƠNG...)
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold rounded">
                  {regionBreakdown.nam} Chuyên Viên
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {locationStats
                  .filter((item) => item.region === 'NAM')
                  .map((item) => (
                    <div
                      key={item.provinceName}
                      onClick={() => setSelectedLocation(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedLocation?.provinceName === item.provinceName
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg ring-2 ring-emerald-400/30'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{item.provinceName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 font-mono text-[11px] font-black rounded shrink-0">
                        {item.count} NS
                      </span>
                    </div>
                  ))}
              </div>
            </div>
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
