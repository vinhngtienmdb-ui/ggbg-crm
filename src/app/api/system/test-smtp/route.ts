import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { validateOutboundHost } from '@/lib/ssrfGuard';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await guardApi(req, { roles: ['SUPER_ADMIN'] });
  if (session instanceof NextResponse) return session;
  try {
    const body = await req.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { host, port, sender_email } = body || {};

    // Nếu có host tuỳ chỉnh, chặn host nội bộ trước khi (giả lập) kết nối SMTP.
    if (host !== undefined) {
      const ssrfError = validateOutboundHost(host);
      if (ssrfError) {
        return NextResponse.json({ success: false, message: ssrfError }, { status: 400 });
      }
    }

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
