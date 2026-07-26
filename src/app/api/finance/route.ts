import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { INITIAL_PL_DATA, INITIAL_DEBT_INVOICES, getFinancialSummary } from '@/lib/financeStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await guardApi(request, { roles: ['DIRECTOR'] });
  if (session instanceof NextResponse) return session;
  return NextResponse.json({
    success: true,
    data: {
      summary: getFinancialSummary(),
      pl_statements: INITIAL_PL_DATA,
      debt_invoices: INITIAL_DEBT_INVOICES,
    },
  });
}

export async function POST(request: Request) {
  const session = await guardApi(request, { roles: ['DIRECTOR'] });
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    const { action, invoice_id, channel } = body;
    if (typeof action !== 'string' || action.length > 100) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }
    if (channel !== undefined && (typeof channel !== 'string' || channel.length > 100)) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    if (action === 'SEND_DEBT_REMINDER') {
      const inv = INITIAL_DEBT_INVOICES.find((i) => i.id === invoice_id);
      if (inv) {
        inv.reminder_sent_count += 1;
        inv.last_reminder_at = new Date().toLocaleString('vi-VN');
      }

      return NextResponse.json({
        success: true,
        message: `Đã tự động gửi thông báo nhắc nợ thành công qua kênh [${channel || 'EMAIL_SMTP'}] cho hợp đồng ${inv?.contract_code || ''}!`,
        data: inv,
      });
    }

    return NextResponse.json({ success: true, message: 'Action processed' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý API Tài Chính' },
      { status: 500 }
    );
  }
}
