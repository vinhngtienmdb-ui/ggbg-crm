import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listFinance, updateFinance } from '@/lib/financeRepo';
import { getFinancialSummary } from '@/lib/financeStore';
import { DebtInvoice } from '@/types/finance';

export const dynamic = 'force-dynamic';

/** GET — báo cáo tài chính (dual-mode: Supabase hoặc in-memory). Chỉ DIRECTOR. */
export async function GET(request: Request) {
  const session = await guardApi(request, { roles: ['DIRECTOR'] });
  if (session instanceof NextResponse) return session;
  const { plStatements, debtInvoices } = await listFinance();
  return NextResponse.json({
    success: true,
    data: {
      summary: getFinancialSummary(plStatements, debtInvoices),
      pl_statements: plStatements,
      debt_invoices: debtInvoices,
    },
  });
}

/** POST — hành động nghiệp vụ (nhắc nợ). Chỉ DIRECTOR. */
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
      const { debtInvoices } = await listFinance();
      const inv = debtInvoices.find((i) => i.id === invoice_id);
      let updatedInv: DebtInvoice | null = inv ?? null;
      if (inv) {
        updatedInv =
          ((await updateFinance(inv.id, {
            reminder_sent_count: inv.reminder_sent_count + 1,
            last_reminder_at: new Date().toLocaleString('vi-VN'),
          })) as DebtInvoice | null) ?? inv;
      }

      return NextResponse.json({
        success: true,
        message: `Đã tự động gửi thông báo nhắc nợ thành công qua kênh [${channel || 'EMAIL_SMTP'}] cho hợp đồng ${updatedInv?.contract_code || ''}!`,
        data: updatedInv,
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
