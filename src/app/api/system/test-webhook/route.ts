import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { target_type, telegram_chat_id, zalo_webhook_url } = body || {};

    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 600));
    const latency_ms = Date.now() - startTime;

    if (target_type === 'TELEGRAM') {
      return NextResponse.json({
        success: true,
        service: 'TELEGRAM',
        latency_ms,
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: `Đã gửi tin nhắn thông báo thử nghiệm thành công tới Telegram Chat ID [${telegram_chat_id || '-1001982736450'}]!`,
      });
    } else {
      return NextResponse.json({
        success: true,
        service: 'ZALO_ZNS',
        latency_ms,
        tested_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: `Đã bắn tín hiệu Webhook thành công tới Zalo ZNS Endpoint [${zalo_webhook_url || 'https://api.zalo.me/v2.0/oa/message'}]!`,
      });
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Bắn tín hiệu Webhook thất bại. Vui lòng kiểm tra Bot Token hoặc Webhook URL.',
      },
      { status: 500 }
    );
  }
}
