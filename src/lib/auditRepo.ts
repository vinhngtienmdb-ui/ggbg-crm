/**
 * Lớp dữ liệu Nhật ký kiểm toán (Audit Trail) — CHẾ ĐỘ KÉP (dual-mode), CHỈ Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `audit_logs`
 *    (id uuid, user_name, action, target, ip, meta jsonb, created_at).
 *    ⚠️ Cột `id` là UUID do DB tự sinh → KHÔNG ghi id chuỗi tùy ý của INITIAL vào
 *    cột id. Toàn bộ object AuditLogEntry (kèm id gốc dạng chuỗi) được lưu ở `meta`
 *    để đọc lại đúng shape. Seed đánh dấu meta.seed='initial' để idempotent.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_AUDIT_LOGS.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { AuditLogEntry } from '@/types/audit';
import { INITIAL_AUDIT_LOGS } from './auditStore';

let memoryLogs: AuditLogEntry[] = INITIAL_AUDIT_LOGS.map((l) => ({ ...l }));

/** Ghép row DB (jsonb `meta`) về đúng shape AuditLogEntry (giữ id gốc dạng chuỗi). */
function rowToLog(row: any): AuditLogEntry {
  const meta = (row?.meta ?? {}) as Partial<AuditLogEntry>;
  return {
    id: (meta.id as string) ?? row.id,
    timestamp: meta.timestamp ?? row.created_at ?? '',
    actor_name: meta.actor_name ?? row.user_name ?? '',
    actor_username: meta.actor_username ?? '',
    actor_role: meta.actor_role ?? '',
    action_type: meta.action_type ?? row.action ?? '',
    action_description: meta.action_description ?? '',
    resource_module: meta.resource_module ?? row.target ?? '',
    ip_address: meta.ip_address ?? row.ip ?? '',
    device_info: meta.device_info ?? '',
    severity: (meta.severity as AuditLogEntry['severity']) ?? 'INFO',
  };
}

/** Map object AuditLogEntry -> hàng ghi (KHÔNG set id: để DB tự sinh uuid). */
function logToRow(l: AuditLogEntry, seed = false) {
  return {
    user_name: l.actor_name ?? null,
    action: l.action_type ?? null,
    target: l.resource_module ?? null,
    ip: l.ip_address ?? null,
    meta: seed ? { ...l, seed: 'initial' } : { ...l },
    created_at: l.timestamp || new Date().toISOString(),
  };
}

/** Đọc toàn bộ nhật ký kiểm toán (mới nhất trước). */
export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('id, user_name, action, target, ip, meta, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToLog);
      } catch (err) {
        console.error('[auditRepo.listAuditLogs] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryLogs.map((l) => ({ ...l }));
}

/** Ghi mới một dòng nhật ký (id uuid do DB tự sinh). */
export async function createAuditLog(log: AuditLogEntry): Promise<AuditLogEntry> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert(logToRow(log))
          .select('id, user_name, action, target, ip, meta, created_at')
          .single();
        if (error) throw error;
        if (data) return rowToLog(data);
      } catch (err) {
        console.error('[auditRepo.createAuditLog] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryLogs = [log, ...memoryLogs];
  return log;
}

/**
 * Nạp dữ liệu mẫu vào bảng (idempotent qua meta.seed='initial').
 * id là UUID nên KHÔNG dùng upsert onConflict id: xoá các dòng seed cũ rồi insert
 * lại (không đụng tới log thật). Trả về số bản ghi đã nạp.
 * Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedAuditLogs(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        // Xoá các dòng seed trước đó (đánh dấu meta.seed='initial') để idempotent.
        await supabase.from('audit_logs').delete().eq('meta->>seed', 'initial');
        const rows = INITIAL_AUDIT_LOGS.map((l) => logToRow(l, true));
        const { error } = await supabase.from('audit_logs').insert(rows);
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[auditRepo.seedAuditLogs] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryLogs = INITIAL_AUDIT_LOGS.map((l) => ({ ...l }));
  return memoryLogs.length;
}
