import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { INITIAL_AUDIT_LOGS } from '@/lib/auditStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await guardApi(request, { roles: ['SUPER_ADMIN', 'DIRECTOR'] });
  if (session instanceof NextResponse) return session;
  return NextResponse.json({
    success: true,
    data: INITIAL_AUDIT_LOGS,
  });
}
