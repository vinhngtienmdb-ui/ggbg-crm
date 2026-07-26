import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await guardApi(req);
  if (session instanceof NextResponse) return session;
  try {
    const body = await req.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { conversation_id, content, sender_name } = body || {};

    if (!conversation_id || !content) {
      return NextResponse.json(
        { success: false, message: 'Thiếu conversation_id hoặc nội dung content' },
        { status: 400 }
      );
    }

    if (
      typeof conversation_id !== 'string' ||
      conversation_id.length > 200 ||
      typeof content !== 'string' ||
      content.length > 5000 ||
      (sender_name !== undefined && (typeof sender_name !== 'string' || sender_name.length > 200))
    ) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const newMessage = {
      id: `m_${Date.now()}`,
      conversation_id,
      sender_type: 'AGENT',
      sender_name: sender_name || 'Super Admin (CSKH)',
      content: String(content).trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      is_read: true,
    };

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý gửi tin nhắn chat' },
      { status: 500 }
    );
  }
}
