/**
 * Lớp dữ liệu Sản phẩm / Gói dịch vụ — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `products`.
 *    Bảng có các cột truy vấn (id, sku, name, category, platform, price) + cột
 *    `data` (jsonb) lưu TOÀN BỘ object ProductPackage để giữ đúng shape khi đọc lại.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_PRODUCTS.
 *
 * Mọi lỗi Supabase được bắt gọn và fallback về mảng in-memory để không làm sập app.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { ProductPackage } from '@/types';
import { INITIAL_PRODUCTS } from './productStore';

// Store in-memory (fallback) — khởi tạo từ dữ liệu mẫu, giữ trạng thái theo tiến trình.
let memoryProducts: ProductPackage[] = INITIAL_PRODUCTS.map((p) => ({ ...p }));

/** Ghép row DB (jsonb `data` + id) về đúng shape ProductPackage. */
function rowToProduct(row: any): ProductPackage {
  const data = (row?.data ?? {}) as Partial<ProductPackage>;
  return { ...(data as ProductPackage), id: row.id };
}

/** Map object ProductPackage -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function productToRow(p: ProductPackage) {
  return {
    id: p.id,
    sku: p.sku_code ?? null,
    name: p.name ?? null,
    category: p.category ?? null,
    platform: Array.isArray(p.platforms) && p.platforms.length > 0 ? p.platforms[0] : null,
    price: typeof p.base_price === 'number' ? p.base_price : null,
    data: p,
    updated_at: new Date().toISOString(),
  };
}

/** Đọc toàn bộ sản phẩm / gói dịch vụ. */
export async function listProducts(): Promise<ProductPackage[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, data')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToProduct);
      } catch (err) {
        console.error('[productsRepo.listProducts] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryProducts.map((p) => ({ ...p }));
}

/** Tạo mới một sản phẩm (object đã dựng shape ProductPackage). */
export async function createProduct(obj: ProductPackage): Promise<ProductPackage> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(productToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToProduct(data);
      } catch (err) {
        console.error('[productsRepo.createProduct] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryProducts = [obj, ...memoryProducts];
  return obj;
}

/** Cập nhật một phần sản phẩm theo id. */
export async function updateProduct(
  id: string,
  patch: Partial<ProductPackage>
): Promise<ProductPackage | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('products')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToProduct(existing), ...patch, id };
        const { data, error } = await supabase
          .from('products')
          .update(productToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToProduct(data);
      } catch (err) {
        console.error('[productsRepo.updateProduct] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: ProductPackage | null = null;
  memoryProducts = memoryProducts.map((p) => {
    if (p.id === id) {
      updated = { ...p, ...patch, id };
      return updated;
    }
    return p;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_PRODUCTS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedProducts(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_PRODUCTS.map((p) => productToRow(p));
        const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[productsRepo.seedProducts] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryProducts = INITIAL_PRODUCTS.map((p) => ({ ...p }));
  return memoryProducts.length;
}
