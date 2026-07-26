import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listAuditLogs } from '@/lib/auditRepo';

export const dynamic = 'force-dynamic';

/** GET — nhật ký kiểm toán (dual-mode: Supabase hoặc in-memory). Chỉ SUPER_ADMIN/DIRECTOR. */
export async function GET(request: Request) {
  const session = await guardApi(request, { roles: ['SUPER_ADMIN', 'DIRECTOR'] });
  if (session instanceof NextResponse) return session;
  const data = await listAuditLogs();
  return NextResponse.json({ success: true, data });
}
