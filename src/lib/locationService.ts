/**
 * Vietnam Administrative Units API Service (Post-01/07/2025 Structure)
 * Official API Source: https://tinhthanhpho.com/api-docs#new-structure
 */

export interface NewProvince {
  code: string;
  name: string;
  type: string;
}

export interface NewWard {
  code: string;
  name: string;
  type: string;
  province_code: string;
}

export interface AddressSearchItem {
  type: 'province' | 'ward';
  code: string;
  name: string;
  full_name: string;
  address: string;
  province_code?: string;
}

const BASE_API_URL = 'https://tinhthanhpho.com/api/v1';

// Cache memory to prevent excessive API calls
let cachedProvinces: NewProvince[] | null = null;
const cachedWardsMap: Record<string, NewWard[]> = {};

/**
 * Fallback static list of key post-01/07/2025 Vietnam Provinces
 */
export const FALLBACK_NEW_PROVINCES: NewProvince[] = [
  { code: '01', name: 'Hà Nội', type: 'Thành phố' },
  { code: '79', name: 'Hồ Chí Minh', type: 'Thành phố' },
  { code: '48', name: 'Đà Nẵng', type: 'Thành phố' },
  { code: '31', name: 'Hải Phòng', type: 'Thành phố' },
  { code: '92', name: 'Cần Thơ', type: 'Thành phố' },
  { code: '26', name: 'Vĩnh Phúc', type: 'Tỉnh' },
  { code: '27', name: 'Bắc Ninh', type: 'Tỉnh' },
  { code: '30', name: 'Hải Dương', type: 'Tỉnh' },
  { code: '33', name: 'Hưng Yên', type: 'Tỉnh' },
  { code: '35', name: 'Ninh Bình', type: 'Tỉnh' },
  { code: '38', name: 'Thanh Hóa', type: 'Tỉnh' },
  { code: '40', name: 'Nghệ An', type: 'Tỉnh' },
  { code: '42', name: 'Hà Tĩnh', type: 'Tỉnh' },
  { code: '45', name: 'Quảng Trị', type: 'Tỉnh' },
  { code: '46', name: 'Thừa Thiên Huế', type: 'Thành phố' },
  { code: '51', name: 'Quảng Ngãi', type: 'Tỉnh' },
  { code: '52', name: 'Bình Định', type: 'Tỉnh' },
  { code: '56', name: 'Khánh Hòa', type: 'Tỉnh' },
  { code: '60', name: 'Lâm Đồng', type: 'Tỉnh' },
  { code: '66', name: 'Đắk Lắk', type: 'Tỉnh' },
  { code: '74', name: 'Bình Dương', type: 'Tỉnh' },
  { code: '75', name: 'Đồng Nai', type: 'Tỉnh' },
  { code: '77', name: 'Bà Rịa - Vũng Tàu', type: 'Tỉnh' },
  { code: '80', name: 'Long An', type: 'Tỉnh' },
  { code: '82', name: 'Tiền Giang', type: 'Tỉnh' },
  { code: '86', name: 'Vĩnh Long', type: 'Tỉnh' },
  { code: '87', name: 'Đồng Tháp', type: 'Tỉnh' },
  { code: '89', name: 'An Giang', type: 'Tỉnh' },
  { code: '91', name: 'Kiên Giang', type: 'Tỉnh' },
];

/**
 * Fallback static Wards sample
 */
export const FALLBACK_NEW_WARDS: Record<string, NewWard[]> = {
  '01': [
    { code: '00001', name: 'Phúc Xá', type: 'Phường', province_code: '01' },
    { code: '00004', name: 'Trúc Bạch', type: 'Phường', province_code: '01' },
    { code: '00070', name: 'Hoàn Kiếm', type: 'Phường', province_code: '01' },
    { code: '00073', name: 'Cửa Đông', type: 'Phường', province_code: '01' },
    { code: '00154', name: 'Thượng Đình', type: 'Phường', province_code: '01' },
    { code: '00157', name: 'Thanh Xuân Bắc', type: 'Phường', province_code: '01' },
    { code: '00160', name: 'Thanh Xuân Trung', type: 'Phường', province_code: '01' },
    { code: '00200', name: 'Cầu Giấy', type: 'Phường', province_code: '01' },
  ],
  '79': [
    { code: '26734', name: 'Bến Nghé', type: 'Phường', province_code: '79' },
    { code: '26737', name: 'Bến Thành', type: 'Phường', province_code: '79' },
    { code: '26740', name: 'Phường 1', type: 'Phường', province_code: '79' },
    { code: '26743', name: 'Tân Định', type: 'Phường', province_code: '79' },
    { code: '26800', name: 'Thảo Điền', type: 'Phường', province_code: '79' },
    { code: '26803', name: 'An Phú', type: 'Phường', province_code: '79' },
  ],
};

/**
 * Fetch post-01/07/2025 Provinces list
 */
export async function getNewProvinces(): Promise<NewProvince[]> {
  if (cachedProvinces && cachedProvinces.length > 0) {
    return cachedProvinces;
  }

  try {
    const res = await fetch(`${BASE_API_URL}/new-provinces?limit=100`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        cachedProvinces = json.data;
        return cachedProvinces!;
      }
    }
  } catch (error) {
    console.warn('Unable to fetch live provinces from tinhthanhpho.com API, using fallback list:', error);
  }

  cachedProvinces = FALLBACK_NEW_PROVINCES;
  return cachedProvinces;
}

/**
 * Fetch post-01/07/2025 Wards for a specific Province Code
 */
export async function getNewWards(provinceCode: string): Promise<NewWard[]> {
  if (!provinceCode) return [];

  if (cachedWardsMap[provinceCode]) {
    return cachedWardsMap[provinceCode];
  }

  try {
    const res = await fetch(`${BASE_API_URL}/new-provinces/${provinceCode}/wards?limit=200`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        cachedWardsMap[provinceCode] = json.data;
        return cachedWardsMap[provinceCode];
      }
    }
  } catch (error) {
    console.warn(`Unable to fetch live wards for province ${provinceCode}, using fallback list:`, error);
  }

  const fallback = FALLBACK_NEW_WARDS[provinceCode] || [
    { code: `${provinceCode}001`, name: 'Phường Trung Tâm', type: 'Phường', province_code: provinceCode },
    { code: `${provinceCode}002`, name: 'Phường Nội Thành', type: 'Phường', province_code: provinceCode },
    { code: `${provinceCode}003`, name: 'Xã Ngoại Thành', type: 'Xã', province_code: provinceCode },
  ];

  cachedWardsMap[provinceCode] = fallback;
  return fallback;
}

/**
 * Search New Address Endpoint
 */
export async function searchNewAddress(keyword: string): Promise<AddressSearchItem[]> {
  if (!keyword.trim()) return [];

  try {
    const res = await fetch(`${BASE_API_URL}/search-new-address?keyword=${encodeURIComponent(keyword)}&limit=10`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn('Address search error:', error);
  }

  return [];
}

/**
 * Helper to construct standardized full address string (Post-01/07/2025)
 * Standard format: {Detail Address}, {Ward Name}, {Province Name}
 */
export function formatFullAddressPost2025(
  detailAddress: string,
  wardName?: string,
  provinceName?: string
): string {
  const parts = [
    detailAddress?.trim(),
    wardName?.trim(),
    provinceName?.trim(),
  ].filter(Boolean);

  return parts.join(', ');
}
