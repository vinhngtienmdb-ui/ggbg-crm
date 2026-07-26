import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listCustomers, createCustomer, updateCustomer } from '@/lib/customersRepo';
import { ExtendedCustomer } from '@/lib/customerStore';

export const dynamic = 'force-dynamic';

/** GET — danh sách khách hàng (dual-mode: Supabase hoặc in-memory). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  const customers = await listCustomers();
  return NextResponse.json({ success: true, customers });
}

/** POST — tạo mới khách hàng. Body cần có name hoặc company_name (string ≤ 500). */
export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const nameField = body.name ?? body.company_name;
    if (typeof nameField !== 'string' || nameField.trim().length === 0 || nameField.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Thiếu hoặc sai định dạng Tên khách hàng (name/company_name).' },
        { status: 400 }
      );
    }
    const obj: ExtendedCustomer = {
      ...body,
      id: typeof body.id === 'string' && body.id.trim() ? body.id : `c_${Date.now()}`,
    };
    const created = await createCustomer(obj);
    return NextResponse.json({ success: true, customer: created });
  } catch {
    return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

/** PATCH — cập nhật khách hàng theo id. Body cần có id. */
export async function PATCH(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { id, ...patch } = body;
    if (typeof id !== 'string' || !id.trim()) {
      return NextResponse.json({ success: false, message: 'Thiếu id khách hàng.' }, { status: 400 });
    }
    const updated = await updateCustomer(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khách hàng.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, customer: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}
