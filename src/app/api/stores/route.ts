import { NextResponse } from 'next/server';
import { INITIAL_STORES } from '@/lib/storeStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_STORES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { store_name, platform, customer_name, monthly_gmv_target } = body;

    const newStore = {
      id: `store_${Date.now()}`,
      store_code: `SHOP-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      store_name: store_name || 'Gian Hàng Mới',
      customer_name: customer_name || 'Khách Hàng Mới',
      company_name: 'Doanh Nghiệp Mới Kết Nối',
      platform: platform || 'Shopee Mall',
      store_url: `https://shopee.vn/store_${Date.now()}`,
      monthly_gmv_actual: 0,
      monthly_gmv_target: Number(monthly_gmv_target) || 300000000,
      health_rating: 'GOOD' as const,
      cancellation_rate_percent: 0,
      late_shipment_rate_percent: 0,
      rating_score: 5.0,
      owner_ops_name: 'Phạm Minh Đức (Ops Lead)',
      connected_at: new Date().toISOString().substring(0, 10),
    };

    INITIAL_STORES.unshift(newStore);

    return NextResponse.json({
      success: true,
      message: `Đã kết nối thành công Gian hàng ${newStore.store_name}!`,
      data: newStore,
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Lỗi API Gian Hàng' }, { status: 500 });
  }
}
