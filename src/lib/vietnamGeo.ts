/**
 * Canonical Vietnam GIS reference — 34 administrative units (Post-01/07/2025)
 * per Resolution 202/2025/QH15 (Nghị quyết 202/2025/QH15).
 *
 * Boundary vector data lives in /public/vietnam-provinces-34.geojson, derived by
 * merging the pre-2025 63-province dataset (nguyenduy1133/Free-GIS-Data) into the
 * 34 new units. This module holds the metadata (region, centroid, address aliases)
 * used to place employees onto the map and classify them by business region.
 */

export type Region = 'BAC' | 'TRUNG' | 'NAM';

export interface ProvinceGeo {
  name: string;              // Official short Vietnamese name (no prefix)
  type: 'Thành phố' | 'Tỉnh';
  region: Region;
  lon: number;               // Representative centroid longitude
  lat: number;               // Representative centroid latitude
  aliases: string[];         // Keywords (incl. merged old provinces & key cities)
}

export const REGION_LABEL: Record<Region, string> = {
  BAC: 'Miền Bắc',
  TRUNG: 'Miền Trung',
  NAM: 'Miền Nam',
};

export const REGION_COLOR: Record<Region, string> = {
  BAC: '#ef4444',   // red
  TRUNG: '#f59e0b', // amber
  NAM: '#10b981',   // emerald
};

/** Bundled GeoJSON of the 34 new provinces (always available, offline-safe). */
export const PROVINCES_GEOJSON_URL = '/vietnam-provinces-34.geojson';

/**
 * The 34 official post-2025 provinces/cities.
 * `aliases` include the Vietnamese names of pre-2025 provinces that were merged
 * in, plus notable cities/districts, so legacy addresses still resolve correctly.
 */
export const VIETNAM_PROVINCES: ProvinceGeo[] = [
  // ---------- MIỀN BẮC (15) ----------
  { name: 'Hà Nội', type: 'Thành phố', region: 'BAC', lon: 105.6933, lat: 20.9833,
    aliases: ['Hà Nội', 'Ha Noi', 'Hanoi', 'Cầu Giấy', 'Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Thanh Xuân', 'Tây Hồ', 'Hà Đông', 'Long Biên', 'Từ Liêm'] },
  { name: 'Hải Phòng', type: 'Thành phố', region: 'BAC', lon: 106.4566, lat: 20.9304,
    aliases: ['Hải Phòng', 'Hai Phong', 'Hải Dương'] },
  { name: 'Quảng Ninh', type: 'Tỉnh', region: 'BAC', lon: 107.167, lat: 21.249,
    aliases: ['Quảng Ninh', 'Hạ Long', 'Móng Cái', 'Cẩm Phả'] },
  { name: 'Cao Bằng', type: 'Tỉnh', region: 'BAC', lon: 106.2579, lat: 22.7301,
    aliases: ['Cao Bằng'] },
  { name: 'Lạng Sơn', type: 'Tỉnh', region: 'BAC', lon: 106.5866, lat: 21.8932,
    aliases: ['Lạng Sơn'] },
  { name: 'Lai Châu', type: 'Tỉnh', region: 'BAC', lon: 103.2701, lat: 22.2495,
    aliases: ['Lai Châu'] },
  { name: 'Điện Biên', type: 'Tỉnh', region: 'BAC', lon: 103.2822, lat: 21.714,
    aliases: ['Điện Biên'] },
  { name: 'Sơn La', type: 'Tỉnh', region: 'BAC', lon: 104.1361, lat: 21.2999,
    aliases: ['Sơn La'] },
  { name: 'Lào Cai', type: 'Tỉnh', region: 'BAC', lon: 104.4044, lat: 22.1078,
    aliases: ['Lào Cai', 'Yên Bái', 'Sa Pa', 'Sapa'] },
  { name: 'Tuyên Quang', type: 'Tỉnh', region: 'BAC', lon: 105.0051, lat: 22.4497,
    aliases: ['Tuyên Quang', 'Hà Giang'] },
  { name: 'Thái Nguyên', type: 'Tỉnh', region: 'BAC', lon: 105.7943, lat: 22.033,
    aliases: ['Thái Nguyên', 'Bắc Kạn', 'Bắc Cạn'] },
  { name: 'Phú Thọ', type: 'Tỉnh', region: 'BAC', lon: 105.1683, lat: 20.9814,
    aliases: ['Phú Thọ', 'Vĩnh Phúc', 'Hòa Bình', 'Việt Trì'] },
  { name: 'Bắc Ninh', type: 'Tỉnh', region: 'BAC', lon: 106.4573, lat: 21.3014,
    aliases: ['Bắc Ninh', 'Bắc Giang'] },
  { name: 'Hưng Yên', type: 'Tỉnh', region: 'BAC', lon: 106.2387, lat: 20.6494,
    aliases: ['Hưng Yên', 'Thái Bình'] },
  { name: 'Ninh Bình', type: 'Tỉnh', region: 'BAC', lon: 106.0556, lat: 20.3121,
    aliases: ['Ninh Bình', 'Hà Nam', 'Nam Định', 'Phủ Lý'] },

  // ---------- MIỀN TRUNG (11) ----------
  { name: 'Thanh Hóa', type: 'Tỉnh', region: 'TRUNG', lon: 105.5016, lat: 19.9826,
    aliases: ['Thanh Hóa'] },
  { name: 'Nghệ An', type: 'Tỉnh', region: 'TRUNG', lon: 104.8684, lat: 19.2703,
    aliases: ['Nghệ An', 'Vinh'] },
  { name: 'Hà Tĩnh', type: 'Tỉnh', region: 'TRUNG', lon: 105.6006, lat: 18.357,
    aliases: ['Hà Tĩnh'] },
  { name: 'Quảng Trị', type: 'Tỉnh', region: 'TRUNG', lon: 106.6916, lat: 17.147,
    aliases: ['Quảng Trị', 'Quảng Bình', 'Đồng Hới'] },
  { name: 'Huế', type: 'Thành phố', region: 'TRUNG', lon: 107.46, lat: 16.3608,
    aliases: ['Huế', 'Thừa Thiên'] },
  { name: 'Đà Nẵng', type: 'Thành phố', region: 'TRUNG', lon: 107.9766, lat: 15.5575,
    aliases: ['Đà Nẵng', 'Da Nang', 'Quảng Nam', 'Hội An', 'Tam Kỳ', 'Hải Châu', 'Sơn Trà'] },
  { name: 'Quảng Ngãi', type: 'Tỉnh', region: 'TRUNG', lon: 108.1586, lat: 14.6755,
    aliases: ['Quảng Ngãi', 'Kon Tum'] },
  { name: 'Gia Lai', type: 'Tỉnh', region: 'TRUNG', lon: 108.3416, lat: 13.8334,
    aliases: ['Gia Lai', 'Bình Định', 'Pleiku', 'Quy Nhơn', 'Quy Nhon'] },
  { name: 'Khánh Hòa', type: 'Tỉnh', region: 'TRUNG', lon: 108.9837, lat: 12.0895,
    aliases: ['Khánh Hòa', 'Nha Trang', 'Ninh Thuận', 'Phan Rang', 'Cam Ranh'] },
  { name: 'Đắk Lắk', type: 'Tỉnh', region: 'TRUNG', lon: 108.4645, lat: 12.9304,
    aliases: ['Đắk Lắk', 'Đăk Lăk', 'Buôn Ma Thuột', 'Ban Mê', 'Phú Yên', 'Tuy Hòa'] },
  { name: 'Lâm Đồng', type: 'Tỉnh', region: 'TRUNG', lon: 107.9816, lat: 11.6848,
    aliases: ['Lâm Đồng', 'Đà Lạt', 'Da Lat', 'Đắk Nông', 'Bình Thuận', 'Phan Thiết', 'Gia Nghĩa'] },

  // ---------- MIỀN NAM (8) ----------
  { name: 'Hồ Chí Minh', type: 'Thành phố', region: 'NAM', lon: 106.6333, lat: 10.9352,
    aliases: ['Hồ Chí Minh', 'TP.HCM', 'TPHCM', 'TP. HCM', 'Sài Gòn', 'Saigon', 'Bình Dương', 'Bà Rịa', 'Vũng Tàu', 'Thủ Dầu Một', 'Thủ Đức', 'Bến Nghé', 'Bến Thành', 'Thảo Điền', 'Quận 1', 'Quận 2', 'Quận 3', 'Quận 7'] },
  { name: 'Đồng Nai', type: 'Tỉnh', region: 'NAM', lon: 107.1277, lat: 11.413,
    aliases: ['Đồng Nai', 'Biên Hòa', 'Bình Phước', 'Đồng Xoài'] },
  { name: 'Tây Ninh', type: 'Tỉnh', region: 'NAM', lon: 106.2976, lat: 11.0861,
    aliases: ['Tây Ninh', 'Long An', 'Tân An'] },
  { name: 'Đồng Tháp', type: 'Tỉnh', region: 'NAM', lon: 105.6493, lat: 10.5616,
    aliases: ['Đồng Tháp', 'Tiền Giang', 'Cao Lãnh', 'Mỹ Tho'] },
  { name: 'Vĩnh Long', type: 'Tỉnh', region: 'NAM', lon: 106.2856, lat: 9.9358,
    aliases: ['Vĩnh Long', 'Bến Tre', 'Trà Vinh'] },
  { name: 'Cần Thơ', type: 'Thành phố', region: 'NAM', lon: 105.7429, lat: 9.7852,
    aliases: ['Cần Thơ', 'Can Tho', 'Hậu Giang', 'Sóc Trăng', 'Ninh Kiều'] },
  { name: 'An Giang', type: 'Tỉnh', region: 'NAM', lon: 105.0347, lat: 10.1779,
    aliases: ['An Giang', 'Kiên Giang', 'Long Xuyên', 'Rạch Giá', 'Phú Quốc', 'Châu Đốc'] },
  { name: 'Cà Mau', type: 'Tỉnh', region: 'NAM', lon: 105.1455, lat: 9.0812,
    aliases: ['Cà Mau', 'Bạc Liêu'] },
];

/** Fast name -> province lookup. */
export const PROVINCE_BY_NAME: Record<string, ProvinceGeo> = VIETNAM_PROVINCES.reduce(
  (acc, p) => {
    acc[p.name] = p;
    return acc;
  },
  {} as Record<string, ProvinceGeo>
);

const DEFAULT_PROVINCE = PROVINCE_BY_NAME['Hà Nội'];

/**
 * Resolve a free-text address to one of the 34 provinces.
 * Legacy (pre-2025) province names resolve to the new unit they were merged into.
 * Returns { province, matched } — matched=false means it fell back to the default.
 */
export function resolveProvince(address?: string): { province: ProvinceGeo; matched: boolean } {
  const addr = (address || '').toLowerCase();
  if (addr.trim()) {
    for (const province of VIETNAM_PROVINCES) {
      if (province.aliases.some((a) => addr.includes(a.toLowerCase()))) {
        return { province, matched: true };
      }
    }
  }
  return { province: DEFAULT_PROVINCE, matched: false };
}

/** Display prefix helper: "Thành phố Hà Nội" / "Tỉnh Bắc Ninh". */
export function provinceFullName(p: ProvinceGeo): string {
  return `${p.type} ${p.name}`;
}
