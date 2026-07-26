/**
 * Lớp dữ liệu KPIs (hiển thị đa cấp độ) — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `kpis`
 *    (id, name, owner_name, period, target numeric, actual numeric, level,
 *    data jsonb). Cột `data` (jsonb) lưu TOÀN BỘ object KPIItem để giữ đúng shape.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_KPI_ITEMS.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng KHUÔN MẪU của customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { KPIItem, INITIAL_KPI_ITEMS } from './kpiStore';

// Store in-memory (fallback) — khởi tạo từ dữ liệu mẫu.
let memoryKpis: KPIItem[] = INITIAL_KPI_ITEMS.map((k) => ({ ...k }));

/** Ghép row DB (jsonb `data` + id) về đúng shape KPIItem. */
function rowToKpi(row: any): KPIItem {
  const data = (row?.data ?? {}) as Partial<KPIItem>;
  return { ...(data as KPIItem), id: row.id };
}

/** Map object KPIItem -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function kpiToRow(k: KPIItem) {
  return {
    id: k.id,
    name: k.name ?? null,
    owner_name: k.target_owner ?? null,
    period: k.period ?? null,
    target: typeof k.target_value === 'number' ? k.target_value : null,
    actual: typeof k.current_value === 'number' ? k.current_value : null,
    level: k.level ?? null,
    data: k,
  };
}

/** Đọc toàn bộ KPI. */
export async function listKpis(): Promise<KPIItem[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('kpis')
          .select('id, data')
          .order('id', { ascending: true });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToKpi);
      } catch (err) {
        console.error('[kpisRepo.listKpis] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryKpis.map((k) => ({ ...k }));
}

/** Tạo mới một KPI. */
export async function createKpi(obj: KPIItem): Promise<KPIItem> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('kpis')
          .insert(kpiToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToKpi(data);
      } catch (err) {
        console.error('[kpisRepo.createKpi] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryKpis = [obj, ...memoryKpis];
  return obj;
}

/** Cập nhật một phần KPI theo id. */
export async function updateKpi(id: string, patch: Partial<KPIItem>): Promise<KPIItem | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('kpis')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToKpi(existing), ...patch, id };
        const { data, error } = await supabase
          .from('kpis')
          .update(kpiToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToKpi(data);
      } catch (err) {
        console.error('[kpisRepo.updateKpi] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: KPIItem | null = null;
  memoryKpis = memoryKpis.map((k) => {
    if (k.id === id) {
      updated = { ...k, ...patch, id };
      return updated;
    }
    return k;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu (UPSERT toàn bộ INITIAL_KPI_ITEMS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedKpis(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_KPI_ITEMS.map((k) => kpiToRow(k));
        const { error } = await supabase.from('kpis').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[kpisRepo.seedKpis] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryKpis = INITIAL_KPI_ITEMS.map((k) => ({ ...k }));
  return memoryKpis.length;
}
