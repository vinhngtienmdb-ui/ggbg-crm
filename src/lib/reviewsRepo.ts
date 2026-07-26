/**
 * Lớp dữ liệu Đánh giá 360° — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng `reviews`
 *    (id, subject_name, cycle, status, data jsonb). Cột `data` lưu TOÀN BỘ
 *    object Review360Session.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_360_SESSIONS.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { Review360Session } from '@/types';
import { INITIAL_360_SESSIONS } from './review360Store';

let memoryReviews: Review360Session[] = INITIAL_360_SESSIONS.map((s) => ({ ...s }));

/** Ghép row DB (jsonb `data` + id) về đúng shape Review360Session. */
function rowToReview(row: any): Review360Session {
  const data = (row?.data ?? {}) as Partial<Review360Session>;
  return { ...(data as Review360Session), id: row.id };
}

/** Map object Review360Session -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function reviewToRow(s: Review360Session) {
  return {
    id: s.id,
    subject_name: s.employee_name ?? null,
    cycle: s.period_name ?? null,
    status: s.status ?? null,
    data: s,
  };
}

/** Đọc toàn bộ phiên đánh giá 360°. */
export async function listReviews(): Promise<Review360Session[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('reviews').select('id, data');
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToReview);
      } catch (err) {
        console.error('[reviewsRepo.listReviews] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryReviews.map((s) => ({ ...s }));
}

/** Tạo mới một phiên đánh giá 360° (object đã dựng shape đầy đủ). */
export async function createReview(obj: Review360Session): Promise<Review360Session> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert(reviewToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToReview(data);
      } catch (err) {
        console.error('[reviewsRepo.createReview] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryReviews = [obj, ...memoryReviews];
  return obj;
}

/** Cập nhật một phần phiên đánh giá theo id (ví dụ sau khi nộp feedback). */
export async function updateReview(
  id: string,
  patch: Partial<Review360Session>
): Promise<Review360Session | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('reviews')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToReview(existing), ...patch, id };
        const { data, error } = await supabase
          .from('reviews')
          .update(reviewToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToReview(data);
      } catch (err) {
        console.error('[reviewsRepo.updateReview] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: Review360Session | null = null;
  memoryReviews = memoryReviews.map((s) => {
    if (s.id === id) {
      updated = { ...s, ...patch, id };
      return updated;
    }
    return s;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_360_SESSIONS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedReviews(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_360_SESSIONS.map((s) => reviewToRow(s));
        const { error } = await supabase.from('reviews').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[reviewsRepo.seedReviews] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryReviews = INITIAL_360_SESSIONS.map((s) => ({ ...s }));
  return memoryReviews.length;
}
