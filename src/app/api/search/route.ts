import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { isSupabaseEnabled, getSupabaseAdmin } from '@/lib/supabaseServer';
import { listCustomers } from '@/lib/customersRepo';
import { INITIAL_CUSTOMERS } from '@/lib/customerStore';
import { INITIAL_LEADS } from '@/lib/leadStore';
import { getEmployees } from '@/lib/hrmStore';
import { getProducts } from '@/lib/productStore';

export const dynamic = 'force-dynamic';

const PER_GROUP = 8;

export type SearchResultType = 'customer' | 'lead' | 'employee' | 'product';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

/** Bỏ dấu tiếng Việt + hạ chữ thường để so khớp không dấu. */
function normalize(input: unknown): string {
  return String(input ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/** Kiểm tra bất kỳ trường nào chứa chuỗi con (không dấu, không phân biệt hoa thường). */
function matchAny(needle: string, fields: unknown[]): boolean {
  return fields.some((f) => normalize(f).includes(needle));
}

async function searchInMemory(needle: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  // Khách hàng
  let customers = INITIAL_CUSTOMERS as any[];
  try {
    customers = await listCustomers();
  } catch {
    customers = INITIAL_CUSTOMERS as any[];
  }
  results.push(
    ...customers
      .filter((c) => matchAny(needle, [c.name, c.company_name, c.customer_code, c.phone, c.tax_code]))
      .slice(0, PER_GROUP)
      .map<SearchResult>((c) => ({
        type: 'customer',
        id: String(c.id),
        title: c.name || c.company_name || 'Khách hàng',
        subtitle: [c.customer_code, c.company_name, c.phone].filter(Boolean).join(' · '),
        href: '/customers',
      }))
  );

  // Lead
  results.push(
    ...INITIAL_LEADS.filter((l) =>
      matchAny(needle, [l.full_name, l.lead_code, l.source_name, l.company_name, l.phone])
    )
      .slice(0, PER_GROUP)
      .map<SearchResult>((l) => ({
        type: 'lead',
        id: String(l.id),
        title: l.full_name,
        subtitle: [l.lead_code, l.company_name, l.source_name].filter(Boolean).join(' · '),
        href: '/leads',
      }))
  );

  // Nhân sự
  results.push(
    ...getEmployees()
      .filter((e) => matchAny(needle, [e.full_name, e.employee_code]))
      .slice(0, PER_GROUP)
      .map<SearchResult>((e) => ({
        type: 'employee',
        id: String(e.id),
        title: e.full_name,
        subtitle: [e.employee_code, e.department, e.position].filter(Boolean).join(' · '),
        href: '/hrm',
      }))
  );

  // Sản phẩm
  results.push(
    ...getProducts()
      .filter((p) => matchAny(needle, [p.name, p.sku_code]))
      .slice(0, PER_GROUP)
      .map<SearchResult>((p) => ({
        type: 'product',
        id: String(p.id),
        title: p.name,
        subtitle: [p.sku_code, p.category].filter(Boolean).join(' · '),
        href: '/products',
      }))
  );

  return results;
}

async function searchSupabase(q: string): Promise<SearchResult[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return searchInMemory(normalize(q));

  const like = `%${q}%`;
  const results: SearchResult[] = [];

  // Khách hàng
  try {
    const { data } = await supabase
      .from('customers')
      .select('id, name, customer_code, phone, data')
      .or(`name.ilike.${like},customer_code.ilike.${like},phone.ilike.${like}`)
      .limit(PER_GROUP);
    for (const row of data ?? []) {
      const d = (row as any).data ?? {};
      results.push({
        type: 'customer',
        id: String((row as any).id),
        title: d.name || (row as any).name || 'Khách hàng',
        subtitle: [(row as any).customer_code, d.company_name, (row as any).phone].filter(Boolean).join(' · '),
        href: '/customers',
      });
    }
  } catch (err) {
    console.error('[search] customers supabase error:', err);
  }

  // Lead
  try {
    const { data } = await supabase
      .from('leads')
      .select('id, full_name, lead_code, company_name, phone')
      .or(`full_name.ilike.${like},lead_code.ilike.${like},company_name.ilike.${like},phone.ilike.${like}`)
      .limit(PER_GROUP);
    for (const row of data ?? []) {
      const r = row as any;
      results.push({
        type: 'lead',
        id: String(r.id),
        title: r.full_name,
        subtitle: [r.lead_code, r.company_name, r.phone].filter(Boolean).join(' · '),
        href: '/leads',
      });
    }
  } catch (err) {
    console.error('[search] leads supabase error:', err);
  }

  // Sản phẩm
  try {
    const { data } = await supabase
      .from('products')
      .select('id, name, sku_code')
      .or(`name.ilike.${like},sku_code.ilike.${like}`)
      .limit(PER_GROUP);
    for (const row of data ?? []) {
      const r = row as any;
      results.push({
        type: 'product',
        id: String(r.id),
        title: r.name,
        subtitle: String(r.sku_code ?? ''),
        href: '/products',
      });
    }
  } catch (err) {
    console.error('[search] products supabase error:', err);
  }

  // Nhân sự — không có bảng riêng ở schema hiện tại, lọc in-memory theo tên/mã.
  const needle = normalize(q);
  results.push(
    ...getEmployees()
      .filter((e) => matchAny(needle, [e.full_name, e.employee_code]))
      .slice(0, PER_GROUP)
      .map<SearchResult>((e) => ({
        type: 'employee',
        id: String(e.id),
        title: e.full_name,
        subtitle: [e.employee_code, e.department, e.position].filter(Boolean).join(' · '),
        href: '/hrm',
      }))
  );

  return results;
}

/** GET /api/search?q= — tìm kiếm toàn cục qua guardApi (dual-mode). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    if (isSupabaseEnabled()) {
      const results = await searchSupabase(q);
      return NextResponse.json({ results });
    }
  } catch (err) {
    console.error('[search] Supabase error, fallback in-memory:', err);
  }

  const results = await searchInMemory(normalize(q));
  return NextResponse.json({ results });
}
