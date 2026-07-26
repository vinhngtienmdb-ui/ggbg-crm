/**
 * Lớp dữ liệu Gian Hàng — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `stores`
 *    (id, store_name, platform, status, gmv numeric, data jsonb). Cột `data`
 *    (jsonb) lưu TOÀN BỘ object EcomStore để giữ đúng shape khi đọc lại.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_STORES.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng KHUÔN MẪU của customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { EcomStore } from '@/types/store';
import { INITIAL_STORES } from './storeStore';

// Store in-memory (fallback) — khởi tạo từ dữ liệu mẫu.
let memoryStores: EcomStore[] = INITIAL_STORES.map((s) => ({ ...s }));

/** Ghép row DB (jsonb `data` + id) về đúng shape EcomStore. */
function rowToStore(row: any): EcomStore {
  const data = (row?.data ?? {}) as Partial<EcomStore>;
  return { ...(data as EcomStore), id: row.id };
}

/** Map object EcomStore -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function storeToRow(s: EcomStore) {
  return {
    id: s.id,
    store_name: s.store_name ?? null,
    platform: s.platform ?? null,
    status: s.health_rating ?? null,
    gmv: typeof s.monthly_gmv_actual === 'number' ? s.monthly_gmv_actual : null,
    data: s,
  };
}

/** Đọc toàn bộ gian hàng. */
export async function listStores(): Promise<EcomStore[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('id, data')
          .order('id', { ascending: true });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToStore);
      } catch (err) {
        console.error('[storesRepo.listStores] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryStores.map((s) => ({ ...s }));
}

/** Tạo mới một gian hàng. */
export async function createStore(obj: EcomStore): Promise<EcomStore> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('stores')
          .insert(storeToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToStore(data);
      } catch (err) {
        console.error('[storesRepo.createStore] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryStores = [obj, ...memoryStores];
  return obj;
}

/** Cập nhật một phần gian hàng theo id. */
export async function updateStore(id: string, patch: Partial<EcomStore>): Promise<EcomStore | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('stores')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToStore(existing), ...patch, id };
        const { data, error } = await supabase
          .from('stores')
          .update(storeToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToStore(data);
      } catch (err) {
        console.error('[storesRepo.updateStore] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: EcomStore | null = null;
  memoryStores = memoryStores.map((s) => {
    if (s.id === id) {
      updated = { ...s, ...patch, id };
      return updated;
    }
    return s;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu (UPSERT toàn bộ INITIAL_STORES, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedStores(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_STORES.map((s) => storeToRow(s));
        const { error } = await supabase.from('stores').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[storesRepo.seedStores] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryStores = INITIAL_STORES.map((s) => ({ ...s }));
  return memoryStores.length;
}
