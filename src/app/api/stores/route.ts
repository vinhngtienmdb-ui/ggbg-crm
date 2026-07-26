import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listStores, createStore } from '@/lib/storesRepo';
import { EcomStore } from '@/types/store';

export const dynamic = 'force-dynamic';

/** GET — danh sách gian hàng (dual-mode: Supabase hoặc in-memory). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  const stores = await listStores();
  return NextResponse.json({
    success: true,
    data: stores,
  });
}

/** POST — kết nối gian hàng mới. */
export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { store_name, platform, customer_name, monthly_gmv_target } = body;
    for (const v of [store_name, platform, customer_name]) {
      if (v !== undefined && (typeof v !== 'string' || v.length > 5000)) {
        return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
      }
    }

    const newStore: EcomStore = {
      id: `store_${Date.now()}`,
      store_code: `SHOP-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      store_name: store_name || 'Gian Hàng Mới',
      customer_name: customer_name || 'Khách Hàng Mới',
      company_name: 'Doanh Nghiệp Mới Kết Nối',
      platform: platform || 'Shopee Mall',
      store_url: `https://shopee.vn/store_${Date.now()}`,
      monthly_gmv_actual: 0,
      monthly_gmv_target: Number(monthly_gmv_target) || 300000000,
      health_rating: 'GOOD',
      cancellation_rate_percent: 0,
      late_shipment_rate_percent: 0,
      rating_score: 5.0,
      owner_ops_name: 'Phạm Minh Đức (Ops Lead)',
      connected_at: new Date().toISOString().substring(0, 10),
    };

    const created = await createStore(newStore);

    return NextResponse.json({
      success: true,
      message: `Đã kết nối thành công Gian hàng ${created.store_name}!`,
      data: created,
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Lỗi API Gian Hàng' }, { status: 500 });
  }
}
