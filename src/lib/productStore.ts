import { ProductPackage, EcomPlatform } from '@/types';

export const ECOM_PLATFORM_OPTIONS: { id: EcomPlatform; name: string; color: string }[] = [
  { id: 'Shopee', name: 'Shopee Mall', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'TikTokShop', name: 'TikTok Shop', color: 'bg-slate-900 text-white border-slate-700' },
  { id: 'Lazada', name: 'Lazada LazMall', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'Amazon', name: 'Amazon Global', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'GGBingoVN', name: 'Sàn GGBingoVN', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
];

export const DYNAMIC_ATTRIBUTE_PRESETS: Record<string, Record<string, any>> = {
  'Shopee Mall Standard': {
    'Thời hạn hợp đồng': '12 Tháng',
    'Cam kết tăng trưởng GMV': '25%',
    'Livestream tặng kèm': '8 Buổi/tháng',
    'Thiết kế Banner Shop': 'Miễn phí',
    'Phí duy trì Mall': 'Miễn phí setup',
    'SLA Phản hồi Chat CSKH': 'Dưới 15 phút',
  },
  'TikTok Shop Livestream Special': {
    'Số lượng phiên Live': '20 Phiên/tháng',
    'Booking KOC/KOL': '5 KOC TikTok',
    'Chạy Ads TikTok Shop': 'Tối ưu ROAS >= 4.5',
    'Sản xuất Video Ngắn': '10 Video/tháng',
    'Cam kết lượt xem Live': '>= 5,000 views/phiên',
  },
  'Lazada LazMall Acceleration': {
    'Thời hạn hợp đồng': '6 Tháng',
    'Cam kết tăng trưởng GMV': '20%',
    'Tối ưu SEO Gian Hàng': 'Đạt Top 5 Search',
    'Tham gia Flash Sale': 'Tối thiểu 4 lượt/tháng',
  },
  'Amazon Global Selling': {
    'Thị trường mục tiêu': 'Mỹ (US) & Châu Âu (EU)',
    'Hỗ trợ FBA & Logistics': 'Trọn gói Chuyển vùng',
    'Quản lý Amazon PPC Ads': 'ACoS < 15%',
    'Đăng ký Brand Registry': 'Hỗ trợ Luật pháp IP',
  },
  'GGBingoVN Merchant VIP': {
    'Vị trí Banner Homepage': 'Top 1 Priority',
    'Phí chiết khấu giao dịch': 'Giảm 50%',
    'Hỗ trợ Đội ngũ CSKH': '24/7 Dedicated',
    'Tính năng CRM Tích hợp': 'Premium Unlocked',
  },
};

export const INITIAL_PRODUCTS: ProductPackage[] = [];

let products = [...INITIAL_PRODUCTS];

export function getProducts(): ProductPackage[] {
  return products;
}

export function getProductById(id: string): ProductPackage | undefined {
  return products.find(p => p.id === id);
}

export function createProduct(newPkg: Omit<ProductPackage, 'id' | 'created_at'>): ProductPackage {
  const created: ProductPackage = {
    ...newPkg,
    id: `p_${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
  };
  products = [created, ...products];
  return created;
}

export function updateProduct(id: string, updates: Partial<ProductPackage>): ProductPackage {
  products = products.map(p => (p.id === id ? { ...p, ...updates } : p));
  const updated = products.find(p => p.id === id);
  if (!updated) throw new Error('Product package not found');
  return updated;
}

export function deleteProduct(id: string): void {
  products = products.filter(p => p.id !== id);
}
