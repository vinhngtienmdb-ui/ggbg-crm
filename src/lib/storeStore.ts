import { EcomStore } from '@/types/store';

export const INITIAL_STORES: EcomStore[] = [
  {
    id: 'store_1',
    store_code: 'SHOP-SPM-001',
    store_name: 'SunGroup Official Mall',
    customer_name: 'Trần Văn Hoàng',
    company_name: 'Tập Đoàn Bán Lẻ SunGroup',
    platform: 'Shopee Mall',
    store_url: 'https://shopee.vn/sungroup_official',
    monthly_gmv_actual: 1250000000,
    monthly_gmv_target: 1000000000,
    health_rating: 'EXCELLENT',
    cancellation_rate_percent: 0.8,
    late_shipment_rate_percent: 1.2,
    rating_score: 4.9,
    owner_ops_name: 'Vũ Nam Khánh (Trưởng Phòng Ops)',
    connected_at: '2025-06-15',
  },
  {
    id: 'store_2',
    store_code: 'SHOP-TTS-002',
    store_name: 'Cocoon Organic Vietnam',
    customer_name: 'Nguyễn Thị Lan',
    company_name: 'Mỹ Phẩm Thiên Nhiên Cocoon VN',
    platform: 'TikTok Shop',
    store_url: 'https://tiktok.com/@cocoon_vietnam',
    monthly_gmv_actual: 850000000,
    monthly_gmv_target: 800000000,
    health_rating: 'GOOD',
    cancellation_rate_percent: 2.1,
    late_shipment_rate_percent: 2.5,
    rating_score: 4.8,
    owner_ops_name: 'Vũ Nam Khánh (Trưởng Phòng Ops)',
    connected_at: '2025-09-01',
  },
  {
    id: 'store_3',
    store_code: 'SHOP-LZD-003',
    store_name: 'Biluxury Men Fashion Flagship',
    customer_name: 'Lê Hoàng Nam',
    company_name: 'Thời Trang Nam Biluxury',
    platform: 'Lazada',
    store_url: 'https://lazada.vn/shop/biluxury-flagship',
    monthly_gmv_actual: 620000000,
    monthly_gmv_target: 700000000,
    health_rating: 'GOOD',
    cancellation_rate_percent: 1.5,
    late_shipment_rate_percent: 1.8,
    rating_score: 4.7,
    owner_ops_name: 'Nguyễn Văn Minh (Chuyên Viên Ops)',
    connected_at: '2025-10-20',
  },
  {
    id: 'store_4',
    store_code: 'SHOP-AMZ-004',
    store_name: 'Elmich Home Appliances Global',
    customer_name: 'Vũ Đức Thịnh',
    company_name: 'Gia Dụng Thông Minh Elmich',
    platform: 'Amazon',
    store_url: 'https://amazon.com/stores/elmich_home',
    monthly_gmv_actual: 1800000000,
    monthly_gmv_target: 2000000000,
    health_rating: 'WARNING',
    cancellation_rate_percent: 3.8,
    late_shipment_rate_percent: 4.2,
    rating_score: 4.4,
    owner_ops_name: 'Nguyễn Văn Minh (Chuyên Viên Ops)',
    connected_at: '2025-12-05',
  },
  {
    id: 'store_5',
    store_code: 'SHOP-SPM-005',
    store_name: 'Nutifood Nutrition Store',
    customer_name: 'Đặng Kim Ngân',
    company_name: 'Thực Phẩm Dinh Dưỡng Nutifood',
    platform: 'Shopee Mall',
    store_url: 'https://shopee.vn/nutifood_store',
    monthly_gmv_actual: 950000000,
    monthly_gmv_target: 900000000,
    health_rating: 'EXCELLENT',
    cancellation_rate_percent: 0.5,
    late_shipment_rate_percent: 0.9,
    rating_score: 5.0,
    owner_ops_name: 'Vũ Nam Khánh (Trưởng Phòng Ops)',
    connected_at: '2026-02-10',
  },
];

let storesStoreList: EcomStore[] = [...INITIAL_STORES];

export const STORES_UPDATED_EVENT = 'ggbg_stores_updated';

function notifyStoresUpdate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ggbg_stores_data', JSON.stringify(storesStoreList));
    } catch (e) {
      console.error('Error saving stores to localStorage:', e);
    }
    window.dispatchEvent(new Event(STORES_UPDATED_EVENT));
  }
}

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('ggbg_stores_data');
    if (saved) storesStoreList = JSON.parse(saved);
  } catch (e) {
    console.error('Error loading stores from localStorage:', e);
  }
}

export function getStores(): EcomStore[] {
  return storesStoreList;
}

export function addStore(store: EcomStore): EcomStore[] {
  storesStoreList = [store, ...storesStoreList];
  notifyStoresUpdate();
  return storesStoreList;
}

export function updateStore(id: string, fields: Partial<EcomStore>): EcomStore | undefined {
  const idx = storesStoreList.findIndex((s) => s.id === id);
  if (idx !== -1) {
    storesStoreList[idx] = { ...storesStoreList[idx], ...fields };
    notifyStoresUpdate();
    return storesStoreList[idx];
  }
  return undefined;
}
