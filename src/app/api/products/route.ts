import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listProducts, createProduct, updateProduct } from '@/lib/productsRepo';
import { ProductPackage } from '@/types';

export const dynamic = 'force-dynamic';

/** GET — danh sách sản phẩm / gói dịch vụ (dual-mode: Supabase hoặc in-memory). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const products = await listProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** POST — tạo mới gói dịch vụ. Body cần có name (string ≤ 500). */
export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    if (typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Thiếu hoặc sai định dạng Tên gói dịch vụ (name).' },
        { status: 400 }
      );
    }
    const obj: ProductPackage = {
      ...body,
      id: typeof body.id === 'string' && body.id.trim() ? body.id : `p_${Date.now()}`,
    };
    const created = await createProduct(obj);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/** PATCH — cập nhật gói dịch vụ theo id. Body cần có id. */
export async function PATCH(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { id, ...updates } = body;
    if (typeof id !== 'string' || !id.trim()) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }
    const updated = await updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy gói dịch vụ.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/** PUT — giữ tương thích cũ (đồng nghĩa PATCH cập nhật theo id). */
export async function PUT(request: Request) {
  return PATCH(request);
}
