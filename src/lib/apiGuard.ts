/**
 * Guard tập trung cho API routes: xác thực phiên (chữ ký HMAC), phân quyền theo
 * vai trò, và chống CSRF (kiểm tra Origin cho request thay đổi trạng thái).
 *
 * Cách dùng trong mỗi route:
 *   const session = await guardApi(request, { roles: ['HR_MANAGER'] });
 *   if (session instanceof NextResponse) return session; // 401/403
 *   // ... session.role, session.username ...
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, SESSION_COOKIE, SessionPayload } from './session';

export function unauthorized(message = 'Chưa đăng nhập hoặc phiên đã hết hạn.') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = 'Bạn không có quyền thực hiện thao tác này.') {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

/** Lấy phiên đã xác minh từ cookie (hoặc null). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Chống CSRF: với method thay đổi trạng thái, Origin (nếu có) phải cùng host. */
function csrfCheck(request?: Request): NextResponse | null {
  if (!request) return null;
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return null;
  const origin = request.headers.get('origin');
  if (!origin) return null; // same-origin fetch có thể không gửi Origin
  const host = request.headers.get('host') || '';
  try {
    if (new URL(origin).host !== host) return forbidden('Nguồn yêu cầu không hợp lệ (CSRF).');
  } catch {
    return forbidden('Nguồn yêu cầu không hợp lệ (CSRF).');
  }
  return null;
}

/**
 * Guard hợp nhất. Trả về SessionPayload nếu hợp lệ, hoặc NextResponse (401/403)
 * để route trả về ngay.
 */
export async function guardApi(
  request?: Request,
  opts?: { roles?: string[] }
): Promise<SessionPayload | NextResponse> {
  const csrf = csrfCheck(request);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return unauthorized();

  if (opts?.roles && opts.roles.length > 0) {
    if (!session.is_super_admin && !opts.roles.includes(session.role)) {
      return forbidden();
    }
  }
  return session;
}
