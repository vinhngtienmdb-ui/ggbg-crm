/**
 * Lớp dữ liệu Lead — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `leads`.
 *    Bảng có các cột truy vấn (id, lead_code, name, source, stage, owner_name,
 *    phone, score, value) + cột `data` (jsonb) lưu TOÀN BỘ object Lead để giữ
 *    đúng shape khi đọc lại.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_LEADS.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về mảng in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { Lead } from '@/types';
import { INITIAL_LEADS } from './leadStore';

// Store in-memory (fallback) — khởi tạo từ dữ liệu mẫu, giữ trạng thái theo tiến trình.
let memoryLeads: Lead[] = INITIAL_LEADS.map((l) => ({ ...l }));

/** Ghép row DB (jsonb `data` + id) về đúng shape Lead. */
function rowToLead(row: any): Lead {
  const data = (row?.data ?? {}) as Partial<Lead>;
  return { ...(data as Lead), id: row.id };
}

/** Map object Lead -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function leadToRow(l: Lead) {
  return {
    id: l.id,
    lead_code: l.lead_code ?? null,
    name: l.full_name ?? null,
    source: l.source_name ?? null,
    stage: l.stage_name ?? null,
    owner_name: l.assigned_sale_name ?? null,
    phone: l.phone ?? null,
    score: typeof l.lead_score === 'number' ? l.lead_score : null,
    value: typeof l.estimated_budget === 'number' ? l.estimated_budget : null,
    data: l,
    updated_at: new Date().toISOString(),
  };
}

/** Đọc toàn bộ lead. */
export async function listLeads(): Promise<Lead[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('id, data')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToLead);
      } catch (err) {
        console.error('[leadsRepo.listLeads] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryLeads.map((l) => ({ ...l }));
}

/** Tạo mới một lead (object đã dựng shape Lead). */
export async function createLead(obj: Lead): Promise<Lead> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert(leadToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToLead(data);
      } catch (err) {
        console.error('[leadsRepo.createLead] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryLeads = [obj, ...memoryLeads];
  return obj;
}

/** Cập nhật một phần lead theo id. */
export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('leads')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToLead(existing), ...patch, id };
        const { data, error } = await supabase
          .from('leads')
          .update(leadToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToLead(data);
      } catch (err) {
        console.error('[leadsRepo.updateLead] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: Lead | null = null;
  memoryLeads = memoryLeads.map((l) => {
    if (l.id === id) {
      updated = { ...l, ...patch, id };
      return updated;
    }
    return l;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_LEADS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedLeads(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_LEADS.map((l) => leadToRow(l));
        const { error } = await supabase.from('leads').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[leadsRepo.seedLeads] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryLeads = INITIAL_LEADS.map((l) => ({ ...l }));
  return memoryLeads.length;
}
