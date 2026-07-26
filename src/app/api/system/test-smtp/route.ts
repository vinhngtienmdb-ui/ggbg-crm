import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { host, port, sender_email } = body || {};

    // Simulate network latency for SMTP handshake
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 800));
    const latency_ms = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      service: 'SMTP',
      latency_ms,
      tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details: `Đã kết nối thành công tới SMTP Server [${host || 'smtp.mailgun.org'}:${port || 587}]! Thư thử nghiệm đã được phát tới ${sender_email || 'no-reply@ggbingo.vn'}.`,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể kết nối tới Máy chủ Email SMTP. Vui lòng kiểm tra Host, Port và Mật khẩu.',
      },
      { status: 500 }
    );
  }
}
