import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/apiGuard';
import { isSupabaseEnabled, getSupabaseAdmin } from '@/lib/supabaseServer';
import { getEmployees } from '@/lib/hrmStore';

export const dynamic = 'force-dynamic';

export type NotificationType = 'contract' | 'approval' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

// Trạng thái "đã đọc" cho chế độ in-memory (best-effort, theo tiến trình server).
const readIds = new Set<string>();

const DAY_MS = 1000 * 60 * 60 * 24;

/** Sinh thông báo động từ dữ liệu nhân sự thật (khi chưa bật Supabase). */
function buildDynamicNotifications(): AppNotification[] {
  const now = Date.now();
  const items: AppNotification[] = [];

  for (const emp of getEmployees()) {
    // 1) Hợp đồng hết hạn / sắp hết hạn ≤ 60 ngày
    if (emp.contract_end_date) {
      const end = new Date(emp.contract_end_date).getTime();
      if (!Number.isNaN(end)) {
        const diffDays = Math.ceil((end - now) / DAY_MS);
        if (diffDays < 0) {
          items.push({
            id: `contract_expired_${emp.id}`,
            type: 'contract',
            title: 'Hợp đồng đã hết hạn',
            body: `HĐLĐ của ${emp.full_name} (${emp.employee_code}) đã hết hạn ngày ${emp.contract_end_date}. Cần xử lý gia hạn/chấm dứt.`,
            link: '/hrm',
            is_read: false,
            created_at: emp.contract_end_date,
          });
        } else if (diffDays <= 60) {
          items.push({
            id: `contract_expiring_${emp.id}`,
            type: 'contract',
            title: 'Hợp đồng sắp hết hạn',
            body: `HĐLĐ của ${emp.full_name} (${emp.employee_code}) sẽ hết hạn sau ${diffDays} ngày (${emp.contract_end_date}).`,
            link: '/hrm',
            is_read: false,
            created_at: new Date(now).toISOString(),
          });
        }
      }
    }

    // 2) Hồ sơ nhân sự đang chờ phê duyệt
    if (typeof emp.approval_status === 'string' && emp.approval_status.startsWith('PENDING')) {
      items.push({
        id: `approval_${emp.id}`,
        type: 'approval',
        title: 'Hồ sơ nhân sự chờ phê duyệt',
        body: `Hồ sơ ${emp.full_name} (${emp.employee_code}) đang chờ phê duyệt: ${emp.approval_status}.`,
        link: '/hrm',
        is_read: false,
        created_at: emp.created_at || new Date(now).toISOString(),
      });
    }
  }

  // Sắp xếp mới nhất trước, đồng bộ trạng thái đã đọc in-memory.
  items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return items.map((n) => ({ ...n, is_read: readIds.has(n.id) }));
}

/** GET /api/notifications — danh sách + số chưa đọc (dual-mode). */
export async function GET(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, type, title, body, link, is_read, created_at')
          .or(`recipient_username.eq.${session.username},recipient_username.is.null`)
          .order('created_at', { ascending: false })
          .limit(30);
        if (error) throw error;
        const notifications = (data ?? []) as AppNotification[];
        const unread = notifications.filter((n) => !n.is_read).length;
        return NextResponse.json({ notifications, unread });
      } catch (err) {
        console.error('[notifications.GET] Supabase error, fallback in-memory:', err);
      }
    }
  }

  const notifications = buildDynamicNotifications();
  const unread = notifications.filter((n) => !n.is_read).length;
  return NextResponse.json({ notifications, unread });
}

/** PATCH /api/notifications — đánh dấu 1 thông báo hoặc tất cả là đã đọc. */
export async function PATCH(request: Request) {
  const session = await guardApi(request);
  if (session instanceof NextResponse) return session;

  let body: { id?: string; markAllRead?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const { id, markAllRead } = body;

  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        let qb = supabase.from('notifications').update({ is_read: true });
        if (markAllRead) {
          qb = qb.or(`recipient_username.eq.${session.username},recipient_username.is.null`);
        } else if (typeof id === 'string' && id) {
          qb = qb.eq('id', id);
        } else {
          return NextResponse.json({ success: false, message: 'Thiếu id hoặc markAllRead.' }, { status: 400 });
        }
        const { error } = await qb;
        if (error) throw error;
        return NextResponse.json({ success: true });
      } catch (err) {
        console.error('[notifications.PATCH] Supabase error, fallback in-memory:', err);
      }
    }
  }

  // In-memory best-effort
  if (markAllRead) {
    for (const n of buildDynamicNotifications()) readIds.add(n.id);
    return NextResponse.json({ success: true });
  }
  if (typeof id === 'string' && id) {
    readIds.add(id);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, message: 'Thiếu id hoặc markAllRead.' }, { status: 400 });
}
