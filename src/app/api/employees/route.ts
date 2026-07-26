import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { listEmployees } from '@/lib/employeesRepo';

export const dynamic = 'force-dynamic';

/** GET — danh sách hồ sơ nhân sự (dual-mode: Supabase hoặc in-memory). Phục vụ seed & search. */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;
  const employees = await listEmployees();
  return NextResponse.json({ success: true, data: employees });
}
