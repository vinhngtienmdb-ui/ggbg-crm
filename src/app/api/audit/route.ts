import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOGS } from '@/lib/auditStore';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_AUDIT_LOGS,
  });
}
