/**
 * Lớp dữ liệu Khách hàng — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `customers`.
 *    Bảng có các cột truy vấn (id, customer_code, name, entity_type, tier,
 *    lifecycle_stage, owner_name, phone, health_score, ltv) + cột `data` (jsonb)
 *    lưu TOÀN BỘ object ExtendedCustomer để giữ đúng shape khi đọc lại.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_CUSTOMERS.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về mảng in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Đây là KHUÔN MẪU CHUẨN để nhân rộng cho các module khác.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { ExtendedCustomer, INITIAL_CUSTOMERS } from './customerStore';

// Store in-memory (fallback) — khởi tạo từ dữ liệu mẫu, giữ trạng thái theo tiến trình.
let memoryCustomers: ExtendedCustomer[] = INITIAL_CUSTOMERS.map((c) => ({ ...c }));

/** Ghép row DB (jsonb `data` + id) về đúng shape ExtendedCustomer. */
function rowToCustomer(row: any): ExtendedCustomer {
  const data = (row?.data ?? {}) as Partial<ExtendedCustomer>;
  return { ...(data as ExtendedCustomer), id: row.id };
}

/** Map object ExtendedCustomer -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function customerToRow(c: ExtendedCustomer) {
  return {
    id: c.id,
    customer_code: c.customer_code ?? null,
    name: c.company_name || c.name || null,
    entity_type: c.entity_type ?? null,
    tier: c.tier ?? null,
    lifecycle_stage: c.lifecycle_stage ?? null,
    owner_name: c.owner_name ?? null,
    phone: c.phone ?? null,
    health_score: typeof c.health_score === 'number' ? c.health_score : null,
    ltv: typeof c.ltv_total_spent === 'number' ? c.ltv_total_spent : null,
    data: c,
    updated_at: new Date().toISOString(),
  };
}

/** Đọc toàn bộ khách hàng. */
export async function listCustomers(): Promise<ExtendedCustomer[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, data')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToCustomer);
      } catch (err) {
        console.error('[customersRepo.listCustomers] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryCustomers.map((c) => ({ ...c }));
}

/** Tạo mới một khách hàng (object đã dựng shape ExtendedCustomer). */
export async function createCustomer(obj: ExtendedCustomer): Promise<ExtendedCustomer> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert(customerToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToCustomer(data);
      } catch (err) {
        console.error('[customersRepo.createCustomer] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryCustomers = [obj, ...memoryCustomers];
  return obj;
}

/** Cập nhật một phần khách hàng theo id. */
export async function updateCustomer(
  id: string,
  patch: Partial<ExtendedCustomer>
): Promise<ExtendedCustomer | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('customers')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToCustomer(existing), ...patch, id };
        const { data, error } = await supabase
          .from('customers')
          .update(customerToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToCustomer(data);
      } catch (err) {
        console.error('[customersRepo.updateCustomer] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: ExtendedCustomer | null = null;
  memoryCustomers = memoryCustomers.map((c) => {
    if (c.id === id) {
      updated = { ...c, ...patch, id };
      return updated;
    }
    return c;
  });
  return updated;
}

/** Xoá khách hàng theo id. Trả về true nếu đã xoá. */
export async function deleteCustomer(id: string): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[customersRepo.deleteCustomer] Supabase error, fallback in-memory:', err);
      }
    }
  }
  const before = memoryCustomers.length;
  memoryCustomers = memoryCustomers.filter((c) => c.id !== id);
  return memoryCustomers.length < before;
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_CUSTOMERS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedCustomers(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_CUSTOMERS.map((c) => customerToRow(c));
        const { error } = await supabase.from('customers').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[customersRepo.seedCustomers] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryCustomers = INITIAL_CUSTOMERS.map((c) => ({ ...c }));
  return memoryCustomers.length;
}
