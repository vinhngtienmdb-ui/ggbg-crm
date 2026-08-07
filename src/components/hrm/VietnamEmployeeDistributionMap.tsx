'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Building2,
  Phone,
  BarChart3,
  Map as MapIcon,
  Flag,
  Globe,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { EmployeeProfile } from '@/types';
import {
  VIETNAM_PROVINCES,
  REGION_COLOR,
  PROVINCES_GEOJSON_URL,
  resolveProvince,
  type Region,
} from '@/lib/vietnamGeo';

interface VietnamEmployeeDistributionMapProps {
  employees: EmployeeProfile[];
}

interface LocationDensityItem {
  provinceName: string;
  region: Region;
  count: number;
  employees: EmployeeProfile[];
  percentage: number;
  lon: number;
  lat: number;
}

interface GeoJsonFeature {
  type: string;
  properties: {
    name?: string;
    region?: Region;
    type?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

// Geographic bounding box used to project lon/lat onto the SVG canvas.
const BBOX = { minLon: 101.5, maxLon: 117.5, minLat: 7.0, maxLat: 23.8 };
const SVG_W = 480;
const SVG_H = 650;

/** Extract a ward/district-level label from a free-text address. */
function wardLabel(addr: string): string {
  const segments = addr.split(',').map((s) => s.trim()).filter(Boolean);
  const ward = segments.find((s) =>
    /^(Phường|Xã|Thị trấn|Quận|Huyện|TT\.?|P\.|Q\.)/i.test(s)
  );
  return (ward || segments[0] || 'Chưa xác định').replace(/^(Q\.|P\.)/i, (m) =>
    m.toUpperCase() === 'Q.' ? 'Quận ' : 'Phường '
  );
}

/** Deterministic small offset so overlapping ward pins fan out slightly. */
function jitter(key: string): { dx: number; dy: number } {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const dx = ((h % 100) / 100 - 0.5) * 0.7;
  const dy = (((h >> 3) % 100) / 100 - 0.5) * 0.7;
  return { dx, dy };
}

export default function VietnamEmployeeDistributionMap({
  employees = [],
}: VietnamEmployeeDistributionMapProps) {
  const [groupingLevel, setGroupingLevel] = useState<'PROVINCE' | 'WARD'>('PROVINCE');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'ALL' | Region>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationDensityItem | null>(null);

  // Bundled 34-province GeoJSON (offline-safe; derived from Free-GIS-Data).
  const [geoFeatures, setGeoFeatures] = useState<GeoJsonFeature[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingGeo(true);
    fetch(PROVINCES_GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu GeoJSON 34 tỉnh/thành');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && Array.isArray(data.features)) {
          setGeoFeatures(data.features);
          setGeoError(null);
        }
      })
      .catch((err) => {
        console.warn('GeoJSON load error:', err);
        if (isMounted) setGeoError('Không tải được ranh giới GIS — hiển thị điểm phân bổ trên nền lưới.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingGeo(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Employees filtered by department + search (region filter applied separately).
  const deptSearchEmployees = useMemo(() => {
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

  // Region breakdown reflects department + search filters (NOT the region toggle),
  // so each region button always shows its true headcount.
  const regionBreakdown = useMemo(() => {
    const acc = { BAC: 0, TRUNG: 0, NAM: 0 };
    deptSearchEmployees.forEach((emp) => {
      const { province } = resolveProvince(emp.temporary_address || emp.permanent_address);
      acc[province.region] += 1;
    });
    return acc;
  }, [deptSearchEmployees]);

  // Apply the region toggle on top of department + search.
  const filteredEmployees = useMemo(() => {
    if (selectedRegionFilter === 'ALL') return deptSearchEmployees;
    return deptSearchEmployees.filter((emp) => {
      const { province } = resolveProvince(emp.temporary_address || emp.permanent_address);
      return province.region === selectedRegionFilter;
    });
  }, [deptSearchEmployees, selectedRegionFilter]);

  // Aggregate employees into map locations (province or ward level).
  const locationStats = useMemo(() => {
    const map = new Map<
      string,
      { region: Region; employees: EmployeeProfile[]; lon: number; lat: number }
    >();

    filteredEmployees.forEach((emp) => {
      const addr = (emp.temporary_address || emp.permanent_address || '').trim();
      const { province } = resolveProvince(addr);

      let key: string;
      let lon: number;
      let lat: number;

      if (groupingLevel === 'PROVINCE') {
        key = `${province.type} ${province.name}`;
        lon = province.lon;
        lat = province.lat;
      } else {
        const label = wardLabel(addr);
        key = `${label}, ${province.name}`;
        const { dx, dy } = jitter(key);
        lon = province.lon + dx;
        lat = province.lat + dy;
      }

      if (!map.has(key)) {
        map.set(key, { region: province.region, employees: [], lon, lat });
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
        lon: val.lon,
        lat: val.lat,
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }, [filteredEmployees, groupingLevel]);

  // Provinces that currently have staff (for choropleth highlighting).
  const staffByProvince = useMemo(() => {
    const counts = new Map<string, number>();
    filteredEmployees.forEach((emp) => {
      const { province } = resolveProvince(emp.temporary_address || emp.permanent_address);
      counts.set(province.name, (counts.get(province.name) || 0) + 1);
    });
    return counts;
  }, [filteredEmployees]);

  const maxProvinceCount = useMemo(
    () => Math.max(1, ...Array.from(staffByProvince.values())),
    [staffByProvince]
  );

  // Convert lon/lat to SVG x/y.
  const projectCoords = (lon: number, lat: number) => {
    const x = ((lon - BBOX.minLon) / (BBOX.maxLon - BBOX.minLon)) * SVG_W;
    const y = SVG_H - ((lat - BBOX.minLat) / (BBOX.maxLat - BBOX.minLat)) * SVG_H;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  const renderPolygonPath = (ring: number[][]) =>
    ring
      .map((pt, idx) => {
        const { x, y } = projectCoords(pt[0], pt[1]);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';

  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));
  const totalActive = filteredEmployees.length || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar & Control Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-xl border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <MapIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-white">Bản đồ phân bổ nhân sự</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span> Chuẩn 34 Tỉnh/Thành 2025
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Bản đồ vector GIS <strong>34 đơn vị hành chính</strong> theo Nghị quyết 202/2025/QH15
                (bao gồm Quần đảo <strong>Hoàng Sa, Trường Sa</strong>), tổng hợp từ dữ liệu nguồn mở{' '}
                <strong>Free-GIS-Data</strong>.
              </p>
            </div>
          </div>

          {/* Group Level Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold shrink-0">
            <button
              onClick={() => {
                setGroupingLevel('PROVINCE');
                setSelectedLocation(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                groupingLevel === 'PROVINCE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 Theo Tỉnh / Thành Phố
            </button>
            <button
              onClick={() => {
                setGroupingLevel('WARD');
                setSelectedLocation(null);
              }}
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
                Miền Bắc ({regionBreakdown.BAC})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('TRUNG')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'TRUNG' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Miền Trung ({regionBreakdown.TRUNG})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('NAM')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'NAM' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Miền Nam ({regionBreakdown.NAM})
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
            <span className="text-2xl font-semibold text-red-600 mt-1 block">{regionBreakdown.BAC} nhân sự</span>
            <span className="text-[11px] text-slate-400">Hà Nội, Hải Phòng, Quảng Ninh...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.BAC / (deptSearchEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">🏖️ Khối Kinh Doanh Miền Trung</span>
            <span className="text-2xl font-semibold text-amber-600 mt-1 block">{regionBreakdown.TRUNG} nhân sự</span>
            <span className="text-[11px] text-slate-400">Đà Nẵng, Nghệ An, Khánh Hòa...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.TRUNG / (deptSearchEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-bold block">🌴 Khối Kinh Doanh Miền Nam</span>
            <span className="text-2xl font-semibold text-emerald-600 mt-1 block">{regionBreakdown.NAM} nhân sự</span>
            <span className="text-[11px] text-slate-400">TP. Hồ Chí Minh, Cần Thơ, Đồng Nai...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.NAM / (deptSearchEmployees.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* MAIN VISUAL MAP & LOCATION RANKING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7/12: 34-PROVINCE GEOJSON MAP */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 z-10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400 animate-spin-slow" />
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                Bản Đồ Vector GIS Việt Nam
                <a
                  href="https://github.com/nguyenduy1133/Free-GIS-Data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1 tabular-nums ml-2"
                >
                  Free-GIS-Data <ExternalLink className="w-3 h-3" />
                </a>
              </h4>
            </div>
            <span className="px-2.5 py-0.5 bg-slate-800 tabular-nums text-[11px] text-slate-300 font-bold rounded-lg border border-slate-700">
              Tổng {filteredEmployees.length} nhân sự
            </span>
          </div>

          {/* MAP CANVAS */}
          <div className="relative w-full max-w-md h-[580px] flex items-center justify-center my-1">
            {isLoadingGeo && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs font-bold text-slate-300">Đang nạp bản đồ 34 tỉnh/thành...</p>
              </div>
            )}
            {geoError && !isLoadingGeo && (
              <div className="absolute top-2 left-2 right-2 z-20 bg-amber-500/15 border border-amber-500/40 text-amber-200 text-[11px] font-bold rounded-xl px-3 py-2">
                {geoError}
              </div>
            )}

            {/* Ocean Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 rounded-2xl"></div>

            <svg
              viewBox="0 0 480 650"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glowGis" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 34-PROVINCE CHOROPLETH */}
              {geoFeatures.map((feature, featIdx) => {
                const name = feature.properties?.name || '';
                const region = feature.properties?.region as Region | undefined;
                const geomType = feature.geometry?.type;
                const coords = feature.geometry?.coordinates || [];

                const count = staffByProvince.get(name) || 0;
                const dimmedByFilter =
                  selectedRegionFilter !== 'ALL' && region !== selectedRegionFilter;

                // Choropleth: provinces with staff glow in their region colour by intensity.
                let fillColor = '#0f172a';
                let strokeColor = '#334155';
                let fillOpacity = 0.9;
                if (region && count > 0) {
                  fillColor = REGION_COLOR[region];
                  strokeColor = '#ffffff';
                  fillOpacity = 0.25 + 0.6 * (count / maxProvinceCount);
                } else if (region) {
                  strokeColor = '#3f4b5f';
                }
                if (dimmedByFilter) fillOpacity *= 0.25;

                const rings =
                  geomType === 'Polygon'
                    ? (coords as number[][][]).map((ring, rIdx) => (
                        <path
                          key={rIdx}
                          d={renderPolygonPath(ring)}
                          fill={fillColor}
                          fillOpacity={fillOpacity}
                          stroke={strokeColor}
                          strokeWidth="0.8"
                        />
                      ))
                    : geomType === 'MultiPolygon'
                    ? (coords as number[][][][]).flatMap((poly, pIdx) =>
                        poly.map((ring, rIdx) => (
                          <path
                            key={`${pIdx}-${rIdx}`}
                            d={renderPolygonPath(ring)}
                            fill={fillColor}
                            fillOpacity={fillOpacity}
                            stroke={strokeColor}
                            strokeWidth="0.8"
                          />
                        ))
                      )
                    : null;

                if (!rings) return null;
                return (
                  <g key={featIdx} className="hover:opacity-90 transition-opacity">
                    <title>{`${name}${count > 0 ? ` — ${count} nhân sự` : ''}`}</title>
                    {rings}
                  </g>
                );
              })}

              {/* SOVEREIGNTY ISLAND BADGES */}
              <g transform="translate(320, 270)" className="cursor-pointer group">
                <circle r="6" fill="#f59e0b" className="animate-ping opacity-75" />
                <circle r="7" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                <rect x="-5" y="-30" width="115" height="20" rx="5" fill="#78350f" opacity="0.95" stroke="#fcd34d" strokeWidth="1" />
                <text x="52" y="-17" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
                  🇻🇳 QĐ. HOÀNG SA
                </text>
              </g>

              <g transform="translate(360, 480)" className="cursor-pointer group">
                <circle r="6" fill="#10b981" className="animate-ping opacity-75" />
                <circle r="7" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
                <rect x="-5" y="-30" width="115" height="20" rx="5" fill="#064e3b" opacity="0.95" stroke="#6ee7b7" strokeWidth="1" />
                <text x="52" y="-17" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
                  🇻🇳 QĐ. TRƯỜNG SA
                </text>
              </g>

              {/* INTERACTIVE HEADCOUNT PINS */}
              {locationStats.map((loc) => {
                const isSelected = selectedLocation?.provinceName === loc.provinceName;
                const pinColor = REGION_COLOR[loc.region];
                const { x, y } = projectCoords(loc.lon, loc.lat);

                return (
                  <g
                    key={loc.provinceName}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedLocation(loc)}
                    className="cursor-pointer transition-all duration-300 hover:scale-125"
                  >
                    <circle r="13" fill={pinColor} opacity="0.3" className="animate-ping" />
                    <circle r="10" fill={isSelected ? '#ffffff' : pinColor} stroke="#ffffff" strokeWidth="2" filter="url(#glowGis)" />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill={isSelected ? '#0f172a' : '#ffffff'}
                      fontSize="9.5"
                      fontWeight="900"
                      fontFamily="mono"
                    >
                      {loc.count}
                    </text>
                    <g transform="translate(14, -7)">
                      <rect
                        width={loc.provinceName.length * 5.8 + 14}
                        height="18"
                        rx="5"
                        fill={isSelected ? '#0284c7' : '#0f172a'}
                        stroke={pinColor}
                        strokeWidth="1.5"
                        opacity="0.95"
                      />
                      <text x="7" y="12" fill="#ffffff" fontSize="9" fontWeight="bold">
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
            <span className="flex items-center gap-1 text-amber-300">
              <Flag className="w-3.5 h-3.5" /> Hoàng Sa & Trường Sa
            </span>
          </div>
        </div>

        {/* RIGHT 5/12: LOCATION BREAKDOWN & EMPLOYEE ROSTER PANEL */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Chi Tiết Địa Bàn Chọn</span>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
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
                <span className="px-3 py-1 bg-indigo-600 text-white tabular-nums font-bold rounded-xl">
                  {selectedLocation.count} Nhân sự
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 sleek-scrollbar">
                {selectedLocation.employees.map((emp) => (
                  <div key={emp.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                          {emp.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.full_name}</p>
                          <p className="text-[11px] tabular-nums text-indigo-700">{emp.employee_code} • {emp.position}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {emp.status}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-slate-200/80 text-[11px] space-y-1 text-slate-600">
                      <p className="flex items-center gap-1 tabular-nums">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {emp.department}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{emp.temporary_address || emp.permanent_address || 'Chưa cập nhật'}</span>
                      </p>
                      <p className="flex items-center gap-1 tabular-nums text-blue-700">
                        <Phone className="w-3.5 h-3.5" /> {emp.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Bảng Xếp Hạng Mật Độ Địa Bàn
              </h4>

              {locationStats.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  Không có nhân sự phù hợp với bộ lọc hiện tại.
                </p>
              ) : (
                <div className="space-y-3">
                  {locationStats.slice(0, 8).map((item, idx) => (
                    <div
                      key={item.provinceName}
                      onClick={() => setSelectedLocation(item)}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 rounded-2xl transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full tabular-nums text-[10px] font-bold flex items-center justify-center text-white"
                            style={{ backgroundColor: REGION_COLOR[item.region] }}
                          >
                            #{idx + 1}
                          </span>
                          {item.provinceName}
                        </span>
                        <span className="tabular-nums font-bold text-indigo-700">
                          {item.count} nhân sự ({item.percentage}%)
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (item.count / totalActive) * 100)}%`,
                            backgroundColor: REGION_COLOR[item.region],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Coverage note */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Ghi chú:</span> Bản đồ áp dụng cơ cấu{' '}
            <strong>{VIETNAM_PROVINCES.length} tỉnh/thành</strong> sau sáp nhập (01/07/2025). Địa chỉ theo
            đơn vị hành chính cũ được tự động quy đổi về tỉnh/thành mới tương ứng.
          </div>
        </div>
      </div>
    </div>
  );
}
