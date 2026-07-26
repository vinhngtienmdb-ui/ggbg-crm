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
const GEOJSON_DATA_URL = 'https://raw.githubusercontent.com/nguyenduy1133/Free-GIS-Data/main/Vietnam%20Administrative%20Divisions%20(Pre-2025)%20-%20%C4%90%C6%A1n%20v%E1%BB%8B%20h%C3%A0nh%20ch%C3%ADnh%20Vi%E1%BB%87t%20Nam%20(Tr%C6%B0%E1%BB%9Bc%202025)/Provinces_included_Paracel_SpratlyIslands_combine.geojson';

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
  lon: number;
  lat: number;
}

interface GeoJsonFeature {
  type: string;
  properties: {
    Name?: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export default function VietnamEmployeeDistributionMap({
  employees = [],
}: VietnamEmployeeDistributionMapProps) {
  const [groupingLevel, setGroupingLevel] = useState<'PROVINCE' | 'WARD'>('PROVINCE');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<'ALL' | 'BAC' | 'TRUNG' | 'NAM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationDensityItem | null>(null);

  // GeoJSON state fetched from nguyenduy1133/Free-GIS-Data
  const [geoFeatures, setGeoFeatures] = useState<GeoJsonFeature[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Fetch real GIS GeoJSON boundaries from nguyenduy1133/Free-GIS-Data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGeo(true);
    fetch(GEOJSON_DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu GeoJSON từ nguyenduy1133/Free-GIS-Data');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.features) {
          setGeoFeatures(data.features);
          setIsLoadingGeo(false);
        }
      })
      .catch((err) => {
        console.warn('GeoJSON fetch fallback:', err);
        if (isMounted) {
          setGeoError('Đang hiển thị chế độ xemGIS mặc định');
          setIsLoadingGeo(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

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

  // Real GIS Location Coordinates (GeoJSON standard)
  const locationStats = useMemo(() => {
    const map = new Map<string, { region: 'BAC' | 'TRUNG' | 'NAM'; employees: EmployeeProfile[]; lon: number; lat: number }>();

    filteredEmployees.forEach((emp) => {
      const addr = (emp.temporary_address || emp.permanent_address || 'Thành phố Hà Nội').trim();
      let key = 'Thành phố Hà Nội';
      let region: 'BAC' | 'TRUNG' | 'NAM' = 'BAC';
      let lon = 105.8342;
      let lat = 21.0278;

      if (groupingLevel === 'PROVINCE') {
        if (addr.includes('Hồ Chí Minh') || addr.includes('TP.HCM') || addr.includes('Sài Gòn')) {
          key = 'Thành phố Hồ Chí Minh';
          region = 'NAM';
          lon = 106.6297;
          lat = 10.8231;
        } else if (addr.includes('Đà Nẵng')) {
          key = 'Thành phố Đà Nẵng';
          region = 'TRUNG';
          lon = 108.2022;
          lat = 16.0544;
        } else if (addr.includes('Hải Phòng')) {
          key = 'Thành phố Hải Phòng';
          region = 'BAC';
          lon = 106.6881;
          lat = 20.8449;
        } else if (addr.includes('Cần Thơ')) {
          key = 'Thành phố Cần Thơ';
          region = 'NAM';
          lon = 105.7862;
          lat = 10.0452;
        } else if (addr.includes('Bình Dương')) {
          key = 'Tỉnh Bình Dương';
          region = 'NAM';
          lon = 106.6575;
          lat = 11.1604;
        } else if (addr.includes('Đồng Nai')) {
          key = 'Tỉnh Đồng Nai';
          region = 'NAM';
          lon = 107.0843;
          lat = 11.0528;
        } else if (addr.includes('Nghệ An')) {
          key = 'Tỉnh Nghệ An';
          region = 'TRUNG';
          lon = 104.9200;
          lat = 19.3800;
        } else if (addr.includes('Thanh Hóa')) {
          key = 'Tỉnh Thanh Hóa';
          region = 'TRUNG';
          lon = 105.7700;
          lat = 19.8000;
        } else if (addr.includes('Quảng Trị')) {
          key = 'Tỉnh Quảng Trị';
          region = 'TRUNG';
          lon = 107.0000;
          lat = 16.7500;
        } else if (addr.includes('Khánh Hòa') || addr.includes('Nha Trang')) {
          key = 'Tỉnh Khánh Hòa';
          region = 'TRUNG';
          lon = 109.1967;
          lat = 12.2388;
        } else {
          key = 'Thành phố Hà Nội';
          region = 'BAC';
          lon = 105.8342;
          lat = 21.0278;
        }
      } else {
        // WARD grouping (Post-01/07/2025 structure)
        if (addr.includes('Cầu Giấy')) { key = 'Phường Cầu Giấy, TP. Hà Nội'; lon = 105.7900; lat = 21.0350; }
        else if (addr.includes('Hai Bà Trưng')) { key = 'Phường Hai Bà Trưng, TP. Hà Nội'; lon = 105.8500; lat = 21.0100; }
        else if (addr.includes('Ba Đình')) { key = 'Phường Phúc Xá, TP. Hà Nội'; lon = 105.8400; lat = 21.0400; }
        else if (addr.includes('Thượng Đình') || addr.includes('Thanh Xuân')) { key = 'Phường Thượng Đình, TP. Hà Nội'; lon = 105.8100; lat = 20.9950; }
        else if (addr.includes('Quận 1') || addr.includes('Bến Nghé')) { key = 'Phường Bến Nghé, TP. Hồ Chí Minh'; lon = 106.7000; lat = 10.7750; }
        else if (addr.includes('Thảo Điền') || addr.includes('Quận 2')) { key = 'Phường Thảo Điền, TP. Hồ Chí Minh'; lon = 106.7300; lat = 10.8000; }
        else if (addr.includes('Hải Châu')) { key = 'Phường Hải Châu, TP. Đà Nẵng'; lon = 108.2200; lat = 16.0600; }
        else { key = 'Phường Trung Tâm, TP. Hà Nội'; lon = 105.8342; lat = 21.0278; }

        if (key.includes('TP. Hồ Chí Minh')) region = 'NAM';
        else if (key.includes('Đà Nẵng')) region = 'TRUNG';
        else region = 'BAC';
      }

      if (!map.has(key)) {
        map.set(key, { region, employees: [], lon, lat });
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

  // Convert Lon/Lat coordinate into SVG Canvas X, Y coordinates
  const projectCoords = (lon: number, lat: number) => {
    // Geographic Bounding Box for Vietnam GIS Map
    const minLon = 101.5;
    const maxLon = 117.5;
    const minLat = 7.0;
    const maxLat = 23.8;
    const svgWidth = 480;
    const svgHeight = 650;

    const x = ((lon - minLon) / (maxLon - minLon)) * svgWidth;
    const y = svgHeight - ((lat - minLat) / (maxLat - minLat)) * svgHeight;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  // Convert GeoJSON Polygon Ring into SVG SVG path string
  const renderPolygonPath = (ring: number[][]) => {
    return ring
      .map((pt, idx) => {
        const { x, y } = projectCoords(pt[0], pt[1]);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';
  };

  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header Bar & Control Panel */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-white text-white p-6 rounded-3xl border border-plum-border/40 shadow-cardLg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-plum-deep/20 border border-plum-border/30 text-plum-deep flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <MapIcon className="w-6 h-6 text-plum-fg" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Bản đồ phân bổ nhân sự</h3>
                <span className="px-2.5 py-0.5 bg-success-dot text-ink-900 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-subtle animate-ping"></span> nguyenduy1133/Free-GIS-Data
                </span>
              </div>
              <p className="text-xs text-ink-400 mt-1 max-w-2xl leading-relaxed">
                Tích hợp dữ liệu GIS vector chính xác từ <strong>nguyenduy1133/Free-GIS-Data</strong> (bao gồm 63 tỉnh/thành & Quần đảo <strong>Hoàng Sa, Trường Sa</strong>).
              </p>
            </div>
          </div>

          {/* Group Level Toggle */}
          <div className="flex items-center gap-2 bg-surface-subtle p-1.5 rounded-2xl border border-line text-xs font-bold shrink-0">
            <button
              onClick={() => setGroupingLevel('PROVINCE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                groupingLevel === 'PROVINCE' ? 'bg-plum-deep text-white shadow-md' : 'text-ink-400 hover:text-brand-800'
              }`}
            >
              🏢 Theo Tỉnh / Thành Phố
            </button>
            <button
              onClick={() => setGroupingLevel('WARD')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                groupingLevel === 'WARD' ? 'bg-plum-deep text-white shadow-md' : 'text-ink-400 hover:text-brand-800'
              }`}
            >
              📍 Theo Phường / Xã (2025)
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-ink-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc Theo:
            </span>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 bg-white border border-line text-ink-400 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-plum-fg"
            >
              <option value="ALL">Tất Cả Phòng Ban</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-line">
              <button
                onClick={() => setSelectedRegionFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'ALL' ? 'bg-plum-deep text-white' : 'text-ink-400 hover:text-brand-800'
                }`}
              >
                Cả Nước
              </button>
              <button
                onClick={() => setSelectedRegionFilter('BAC')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'BAC' ? 'bg-danger-fg text-white' : 'text-ink-400 hover:text-brand-800'
                }`}
              >
                Miền Bắc ({regionBreakdown.bac})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('TRUNG')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'TRUNG' ? 'bg-warn-fg text-white' : 'text-ink-400 hover:text-brand-800'
                }`}
              >
                Miền Trung ({regionBreakdown.trung})
              </button>
              <button
                onClick={() => setSelectedRegionFilter('NAM')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  selectedRegionFilter === 'NAM' ? 'bg-success-fg text-white' : 'text-ink-400 hover:text-brand-800'
                }`}
              >
                Miền Nam ({regionBreakdown.nam})
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên nhân sự, mã NV, địa chỉ..."
              className="w-full pl-9 pr-3 py-1.5 bg-brand-50 border border-line text-brand-800 placeholder-ink-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-plum-fg"
            />
          </div>
        </div>
      </div>

      {/* REGIONAL STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-danger-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-ink-500 font-bold block">⛰️ Khối Kinh Doanh Miền Bắc</span>
            <span className="text-2xl font-black text-danger-fg mt-1 block">{regionBreakdown.bac} nhân sự</span>
            <span className="text-[11px] text-ink-400">Trụ sở Hà Nội & các tỉnh lân cận</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger-fg font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.bac / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gold-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-ink-500 font-bold block">🏖️ Khối Kinh Doanh Miền Trung</span>
            <span className="text-2xl font-black text-warn-fg mt-1 block">{regionBreakdown.trung} nhân sự</span>
            <span className="text-[11px] text-ink-400">Đà Nẵng, Nghệ An, Khánh Hòa...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warn-bg text-warn-fg font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.trung / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-success-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-ink-500 font-bold block">🌴 Khối Kinh Doanh Miền Nam</span>
            <span className="text-2xl font-black text-success-fg mt-1 block">{regionBreakdown.nam} nhân sự</span>
            <span className="text-[11px] text-ink-400">TP. Hồ Chí Minh, Bình Dương, Cần Thơ...</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success-fg font-bold flex items-center justify-center text-lg">
            {Math.round((regionBreakdown.nam / (filteredEmployees.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* MAIN VISUAL MAP & LOCATION RANKING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7/12: REAL GEOJSON MAP FROM NGUYENDUY1133/FREE-GIS-DATA */}
        <div className="lg:col-span-7 bg-gradient-to-b from-brand-50 via-white to-white rounded-3xl border border-line p-6 text-white space-y-4 shadow-cardLg relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-line pb-3 z-10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-plum-fg animate-spin-slow" />
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Bản Đồ Vector GIS Việt Nam 
                <a
                  href="https://github.com/nguyenduy1133/Free-GIS-Data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-mono ml-2"
                >
                  nguyenduy1133/Free-GIS-Data <ExternalLink className="w-3 h-3" />
                </a>
              </h4>
            </div>
            <span className="px-2.5 py-0.5 bg-surface-subtle font-mono text-[11px] text-ink-400 font-bold rounded-lg border border-line">
              Tổng {filteredEmployees.length} nhân sự
            </span>
          </div>

          {/* MAP CANVAS WITH REAL GEOJSON POLYGONS */}
          <div className="relative w-full max-w-md h-[580px] flex items-center justify-center my-1">
            {isLoadingGeo && (
              <div className="absolute inset-0 z-20 bg-surface-subtle rounded-2xl flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-plum-fg animate-spin" />
                <p className="text-xs font-bold text-ink-400">Đang nạp dữ liệu GeoJSON từ nguyenduy1133/Free-GIS-Data...</p>
              </div>
            )}

            {/* Ocean Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 rounded-2xl"></div>

            {/* SVG RENDERING REAL GEOJSON PROVINCES */}
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

              {/* RENDER REAL GEOGRAPHIC POLYGONS FETCHED FROM NGUYENDUY1133/FREE-GIS-DATA */}
              {geoFeatures.map((feature, featIdx) => {
                const name = feature.properties?.Name || '';
                const geomType = feature.geometry?.type;
                const coords = feature.geometry?.coordinates || [];

                let fillColor = '#1e293b'; // Default slate
                let strokeColor = '#475569';

                if (name.includes('Paracel') || name.includes('Hoang Sa') || name.includes('Hoàng Sa')) {
                  fillColor = '#d97706';
                  strokeColor = '#fbbf24';
                } else if (name.includes('Spratly') || name.includes('Truong Sa') || name.includes('Trường Sa')) {
                  fillColor = '#059669';
                  strokeColor = '#34d399';
                } else {
                  // Standard provinces
                  fillColor = '#0f172a';
                  strokeColor = '#334155';
                }

                if (geomType === 'Polygon') {
                  return (
                    <g key={featIdx} className="hover:opacity-80 transition-opacity">
                      {coords.map((ring, rIdx) => (
                        <path
                          key={rIdx}
                          d={renderPolygonPath(ring)}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth="0.8"
                        />
                      ))}
                    </g>
                  );
                } else if (geomType === 'MultiPolygon') {
                  return (
                    <g key={featIdx} className="hover:opacity-80 transition-opacity">
                      {coords.map((poly, pIdx) =>
                        poly.map((ring: number[][], rIdx: number) => (
                          <path
                            key={`${pIdx}-${rIdx}`}
                            d={renderPolygonPath(ring)}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.8"
                          />
                        ))
                      )}
                    </g>
                  );
                }
                return null;
              })}

              {/* SOVEREIGNTY ISLAND BADGES (HOÀNG SA & TRƯỜNG SA) */}
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

              {/* DYNAMIC INTERACTIVE PINS FOR EACH PROVINCE / LOCATION */}
              {locationStats.map((loc) => {
                const isSelected = selectedLocation?.provinceName === loc.provinceName;
                const pinColor = loc.region === 'BAC' ? '#ef4444' : loc.region === 'TRUNG' ? '#f59e0b' : '#10b981';
                const { x, y } = projectCoords(loc.lon, loc.lat);

                return (
                  <g
                    key={loc.provinceName}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedLocation(loc)}
                    className="cursor-pointer transition-all duration-300 hover:scale-125"
                  >
                    {/* Glowing Pulse Ring */}
                    <circle r="13" fill={pinColor} opacity="0.3" className="animate-ping" />

                    {/* Outer Circle Pin */}
                    <circle r="10" fill={isSelected ? '#ffffff' : pinColor} stroke="#ffffff" strokeWidth="2" filter="url(#glowGis)" />

                    {/* Headcount Number Inside Pin */}
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

                    {/* Floating Label Badge */}
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
          <div className="w-full pt-3 border-t border-line flex items-center justify-around text-[11px] font-bold text-ink-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger-dot inline-block"></span> Miền Bắc
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-warn-fg inline-block"></span> Miền Trung
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-success-dot inline-block"></span> Miền Nam
            </span>
            <span className="flex items-center gap-1 text-warn-fg">
              <Flag className="w-3.5 h-3.5" /> Hoàng Sa & Trường Sa
            </span>
          </div>
        </div>

        {/* RIGHT 5/12: LOCATION BREAKDOWN & EMPLOYEE ROSTER PANEL */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-3xl border border-plum-border p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum-fg block">Chi Tiết Địa Bàn Chọn</span>
                  <h4 className="font-extrabold text-base text-ink-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-danger-fg" /> {selectedLocation.provinceName}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-2.5 py-1 bg-line-soft hover:bg-line text-ink-500 rounded-lg text-xs font-bold"
                >
                  Đóng
                </button>
              </div>

              <div className="p-3 bg-plum-bg/70 border border-plum-border rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-plum-fg">Tổng số nhân sự cư trú:</span>
                <span className="px-3 py-1 bg-plum-deep text-white font-mono font-bold rounded-xl">
                  {selectedLocation.count} Nhân sự
                </span>
              </div>

              {/* Roster of Employees residing in selected location */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 sleek-scrollbar">
                {selectedLocation.employees.map((emp) => (
                  <div key={emp.id} className="p-3.5 bg-surface-subtle border border-line rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-plum-bg text-plum-fg font-bold flex items-center justify-center">
                          {emp.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-ink-900">{emp.full_name}</p>
                          <p className="text-[11px] font-mono text-plum-fg">{emp.employee_code} • {emp.position}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-success-bg text-success-fg text-[10px] font-bold rounded-full">
                        {emp.status}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-line text-[11px] space-y-1 text-ink-500">
                      <p className="flex items-center gap-1 font-mono">
                        <Building2 className="w-3.5 h-3.5 text-ink-400" /> {emp.department}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-danger-fg shrink-0" />
                        <span className="truncate">{emp.temporary_address || emp.permanent_address || 'Chưa cập nhật'}</span>
                      </p>
                      <p className="flex items-center gap-1 font-mono text-brand-800">
                        <Phone className="w-3.5 h-3.5" /> {emp.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-line p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-ink-900 flex items-center gap-2 border-b border-line pb-3">
                <BarChart3 className="w-4 h-4 text-plum-fg" /> Bảng Xếp Hạng Mật Độ Địa Bàn
              </h4>

              <div className="space-y-3">
                {locationStats.slice(0, 7).map((item, idx) => (
                  <div
                    key={item.provinceName}
                    onClick={() => setSelectedLocation(item)}
                    className="p-3 bg-surface-subtle hover:bg-plum-bg/50 border border-line rounded-2xl transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-ink-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-line font-mono text-[10px] font-bold flex items-center justify-center text-ink-700">
                          #{idx + 1}
                        </span>
                        {item.provinceName}
                      </span>
                      <span className="font-mono font-extrabold text-plum-fg">
                        {item.count} nhân sự ({item.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-line h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-plum-deep h-full rounded-full transition-all"
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
