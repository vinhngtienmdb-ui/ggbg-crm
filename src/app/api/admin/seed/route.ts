import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { seedCustomers } from '@/lib/customersRepo';

export const dynamic = 'force-dynamic';

/**
 * POST — Nạp dữ liệu mẫu vào DB (UPSERT idempotent). Chỉ SUPER_ADMIN.
 * Dùng để seed bảng `customers` sau khi bật biến môi trường Supabase.
 */
export async function POST(request: Request) {
  const session = await guardApi(request, { roles: ['SUPER_ADMIN'] });
  if (session instanceof NextResponse) return session;
  const seeded = await seedCustomers();
  return NextResponse.json({ success: true, seeded });
}
