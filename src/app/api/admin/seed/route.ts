import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { seedCustomers } from '@/lib/customersRepo';
import { seedLeads } from '@/lib/leadsRepo';
import { seedProducts } from '@/lib/productsRepo';
import { seedFinance } from '@/lib/financeRepo';
import { seedStores } from '@/lib/storesRepo';
import { seedKpis } from '@/lib/kpisRepo';
import { seedScorecards } from '@/lib/performanceRepo';
import { seedReviews } from '@/lib/reviewsRepo';
import { seedEmployees } from '@/lib/employeesRepo';
import { seedAuditLogs } from '@/lib/auditRepo';

export const dynamic = 'force-dynamic';

/**
 * POST — Nạp dữ liệu mẫu vào DB (UPSERT idempotent). Chỉ SUPER_ADMIN.
 * Gọi 1 lần sau khi bật biến môi trường Supabase để nạp toàn bộ bảng.
 */
export async function POST(request: Request) {
  const session = await guardApi(request, { roles: ['SUPER_ADMIN'] });
  if (session instanceof NextResponse) return session;

  const breakdown = {
    customers: await seedCustomers(),
    leads: await seedLeads(),
    products: await seedProducts(),
    employees: await seedEmployees(),
    finance: await seedFinance(),
    stores: await seedStores(),
    kpis: await seedKpis(),
    performance: await seedScorecards(),
    reviews: await seedReviews(),
    audit: await seedAuditLogs(),
  };
  const seeded = Object.values(breakdown).reduce((s, n) => s + (n || 0), 0);
  return NextResponse.json({ success: true, seeded, breakdown });
}
