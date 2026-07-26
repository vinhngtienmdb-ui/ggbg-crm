import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { create360Session } from '@/lib/review360Store';
import { listReviews, createReview, updateReview } from '@/lib/reviewsRepo';

export const dynamic = 'force-dynamic';

/** GET — danh sách phiên đánh giá 360° (dual-mode: Supabase hoặc in-memory). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  const reviews = await listReviews();
  return NextResponse.json({ success: true, data: reviews });
}

/** POST — tạo mới phiên đánh giá 360°. */
export async function POST(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    // Store dựng shape đầy đủ (mã phiên, khung tiêu chí...) → persist qua repo.
    const created = create360Session(body);
    await createReview(created);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

/** PATCH — cập nhật một phần phiên đánh giá theo id (đồng bộ DB). */
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
      return NextResponse.json({ success: false, message: 'Thiếu id phiên đánh giá.' }, { status: 400 });
    }
    const updated = await updateReview(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy phiên đánh giá.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
