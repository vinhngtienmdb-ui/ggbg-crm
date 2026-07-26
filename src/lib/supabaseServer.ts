/**
 * Supabase client phía SERVER (service role) — chỉ dùng trong API routes / server code.
 * KHÔNG bao giờ import ở client component (service role là secret).
 *
 * Chế độ kép (dual-mode): nếu chưa cấu hình biến môi trường, trả null để lớp dữ liệu
 * tự fallback về store in-memory — nhờ đó app vẫn chạy trước khi bật DB thật.
 *
 * Biến môi trường cần đặt ở production (Vercel):
 *   SUPABASE_URL                = https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY   = <service_role secret từ Supabase dashboard>
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function isSupabaseEnabled(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseEnabled()) return null;
  if (!cached) {
    cached = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
