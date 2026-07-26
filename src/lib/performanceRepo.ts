/**
 * Lớp dữ liệu Chấm điểm hiệu suất — CHẾ ĐỘ KÉP (dual-mode), CHỈ DÙNG Ở SERVER.
 *
 *  - Khi có biến môi trường Supabase (isSupabaseEnabled): đọc/ghi bảng
 *    `performance_scorecards` (id, employee_name, period, grade, score numeric,
 *    data jsonb). Cột `data` lưu TOÀN BỘ object PerformanceScorecard.
 *  - Khi CHƯA bật: thao tác trên mảng in-memory khởi tạo từ INITIAL_SCORECARDS.
 *
 * ⚠️ KHÔNG import file này vào client component (dùng service role, chỉ server).
 * Theo đúng khuôn mẫu customersRepo.ts.
 */
import { isSupabaseEnabled, getSupabaseAdmin } from './supabaseServer';
import { PerformanceScorecard } from '@/types';
import { INITIAL_SCORECARDS } from './performanceStore';

let memoryScorecards: PerformanceScorecard[] = INITIAL_SCORECARDS.map((s) => ({ ...s }));

/** Ghép row DB (jsonb `data` + id) về đúng shape PerformanceScorecard. */
function rowToScorecard(row: any): PerformanceScorecard {
  const data = (row?.data ?? {}) as Partial<PerformanceScorecard>;
  return { ...(data as PerformanceScorecard), id: row.id };
}

/** Map object PerformanceScorecard -> hàng ghi vào bảng (cột truy vấn + data jsonb). */
function scorecardToRow(s: PerformanceScorecard) {
  return {
    id: s.id,
    employee_name: s.employee_name ?? null,
    period: s.period ?? null,
    grade: s.rating_grade ?? null,
    score: typeof s.final_score === 'number' ? s.final_score : null,
    data: s,
  };
}

/** Đọc toàn bộ bảng điểm. */
export async function listScorecards(): Promise<PerformanceScorecard[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('performance_scorecards').select('id, data');
        if (error) throw error;
        if (Array.isArray(data)) return data.map(rowToScorecard);
      } catch (err) {
        console.error('[performanceRepo.listScorecards] Supabase error, fallback in-memory:', err);
      }
    }
  }
  return memoryScorecards.map((s) => ({ ...s }));
}

/** Tạo mới một bảng điểm (object đã dựng shape đầy đủ, đã tính điểm/xếp loại). */
export async function createScorecard(obj: PerformanceScorecard): Promise<PerformanceScorecard> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('performance_scorecards')
          .insert(scorecardToRow(obj))
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToScorecard(data);
      } catch (err) {
        console.error('[performanceRepo.createScorecard] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryScorecards = [obj, ...memoryScorecards];
  return obj;
}

/** Cập nhật một phần bảng điểm theo id. */
export async function updateScorecard(
  id: string,
  patch: Partial<PerformanceScorecard>
): Promise<PerformanceScorecard | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: existing, error: readErr } = await supabase
          .from('performance_scorecards')
          .select('id, data')
          .eq('id', id)
          .single();
        if (readErr) throw readErr;
        const merged = { ...rowToScorecard(existing), ...patch, id };
        const { data, error } = await supabase
          .from('performance_scorecards')
          .update(scorecardToRow(merged))
          .eq('id', id)
          .select('id, data')
          .single();
        if (error) throw error;
        if (data) return rowToScorecard(data);
      } catch (err) {
        console.error('[performanceRepo.updateScorecard] Supabase error, fallback in-memory:', err);
      }
    }
  }
  let updated: PerformanceScorecard | null = null;
  memoryScorecards = memoryScorecards.map((s) => {
    if (s.id === id) {
      updated = { ...s, ...patch, id };
      return updated;
    }
    return s;
  });
  return updated;
}

/**
 * Nạp dữ liệu mẫu vào bảng (UPSERT toàn bộ INITIAL_SCORECARDS, idempotent).
 * Trả về số bản ghi đã nạp. Khi chưa bật Supabase: reset store in-memory.
 */
export async function seedScorecards(): Promise<number> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const rows = INITIAL_SCORECARDS.map((s) => scorecardToRow(s));
        const { error } = await supabase.from('performance_scorecards').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return rows.length;
      } catch (err) {
        console.error('[performanceRepo.seedScorecards] Supabase error, fallback in-memory:', err);
      }
    }
  }
  memoryScorecards = INITIAL_SCORECARDS.map((s) => ({ ...s }));
  return memoryScorecards.length;
}
