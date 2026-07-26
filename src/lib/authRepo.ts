/**
 * Truy vấn tài khoản cho xác thực — dual-mode:
 * dùng Supabase (bảng app_users) khi đã cấu hình env, ngược lại fallback userStore in-memory.
 * CHỈ dùng server-side (import supabaseServer/service role).
 */
import { getSupabaseAdmin, isSupabaseEnabled } from './supabaseServer';
import { findUserByUsernameOrEmail, UserAccountWithAuth } from './userStore';

function mapRow(data: Record<string, unknown>): UserAccountWithAuth {
  return {
    id: data.id as string,
    username: data.username as string,
    email: data.email as string,
    employee_name: data.employee_name as string,
    role: data.role as UserAccountWithAuth['role'],
    role_name: data.role_name as string,
    is_super_admin: Boolean(data.is_super_admin),
    account_status: data.account_status as string,
    password_hash: (data.password_hash as string) || undefined,
    permissions: (data.permissions as string[]) || [],
  } as UserAccountWithAuth;
}

export async function findUserForAuth(input: string): Promise<UserAccountWithAuth | null> {
  const clean = input.trim().toLowerCase();
  if (isSupabaseEnabled()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      let { data } = await sb.from('app_users').select('*').eq('username', clean).maybeSingle();
      if (!data) {
        ({ data } = await sb.from('app_users').select('*').eq('email', clean).maybeSingle());
      }
      return data ? mapRow(data) : null;
    }
  }
  return findUserByUsernameOrEmail(clean) || null;
}
