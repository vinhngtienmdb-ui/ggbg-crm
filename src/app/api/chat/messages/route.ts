import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversation_id, content, sender_name } = body || {};

    if (!conversation_id || !content) {
      return NextResponse.json(
        { success: false, message: 'Thiếu conversation_id hoặc nội dung content' },
        { status: 400 }
      );
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
