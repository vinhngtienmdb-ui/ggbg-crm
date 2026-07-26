import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listLeads, createLead, updateLead } from '@/lib/leadsRepo';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

/** GET — danh sách lead (dual-mode: Supabase hoặc in-memory). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  const leads = await listLeads();
  return NextResponse.json({ success: true, leads });
}

/** POST — tạo mới lead. Body cần có full_name (string ≤ 500). */
export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const nameField = body.full_name ?? body.name;
    if (typeof nameField !== 'string' || nameField.trim().length === 0 || nameField.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Thiếu hoặc sai định dạng Họ tên Lead (full_name).' },
        { status: 400 }
      );
    }
    const obj: Lead = {
      ...body,
      id: typeof body.id === 'string' && body.id.trim() ? body.id : `lead_${Date.now()}`,
    };
    const created = await createLead(obj);
    return NextResponse.json({ success: true, lead: created });
  } catch {
    return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}

/** PATCH — cập nhật lead theo id. Body cần có id. */
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
      return NextResponse.json({ success: false, message: 'Thiếu id lead.' }, { status: 400 });
    }
    const updated = await updateLead(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy lead.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
}
