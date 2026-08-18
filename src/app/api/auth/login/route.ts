import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserForAuth } from '@/lib/authRepo';
import { verifyPassword } from '@/lib/password';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';
import { verifyTOTPCode } from '@/lib/totp';

// Chống brute-force: giới hạn số lần thử theo định danh (best-effort, in-memory).
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 phút
const attempts = new Map<string, { count: number; first: number }>();

function rateKey(id: string, ip: string) {
  return `${id.toLowerCase()}|${ip}`;
}

function checkLocked(key: string): boolean {
  const rec = attempts.get(key);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

function registerFailure(key: string) {
  const rec = attempts.get(key);
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: Date.now() });
  } else {
    rec.count += 1;
  }
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const body = await request.json().catch(() => ({}));
    const username = typeof body?.username === 'string' ? body.username : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const totp_code = typeof body?.totp_code === 'string' ? body.totp_code : '';

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập Tên đăng nhập và Mật khẩu!' },
        { status: 400 }
      );
    }

    const key = rateKey(username, ip);
    if (checkLocked(key)) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
        { status: 429 }
      );
    }

    const user = await findUserForAuth(username);
    const passwordOk = user ? await verifyPassword(password, user.password_hash) : false;

    if (!user || !passwordOk) {
      registerFailure(key);
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập hoặc Mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    // Kiểm tra trạng thái tài khoản
    const statusUpper = (user.account_status || 'ACTIVE').toUpperCase();
    if (statusUpper === 'LOCKED' || statusUpper === 'INACTIVE' || statusUpper === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, message: 'Tài khoản của bạn đã bị khóa hoặc ngưng hoạt động. Vui lòng liên hệ Quản trị viên!' },
        { status: 403 }
      );
    }
    if (statusUpper !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Tài khoản chưa được kích hoạt.' },
        { status: 403 }
      );
    }

    // 2FA Verification Check
    if (user.is_2fa_enabled && user.totp_secret) {
      if (!totp_code) {
        return NextResponse.json({
          success: true,
          require_2fa: true,
          message: '🔑 Tài khoản đã bật 2FA Google Authenticator. Vui lòng nhập mã 6 số từ điện thoại.',
        });
      }

      const is2FaValid = verifyTOTPCode(user.totp_secret, totp_code);
      if (!is2FaValid) {
        registerFailure(key);
        return NextResponse.json(
          { success: false, message: ' Mã xác thực 2FA 6 chữ số không chính xác hoặc đã hết hạn.' },
          { status: 401 }
        );
      }
    }

    // Đăng nhập thành công → xóa bộ đếm thất bại
    attempts.delete(key);

    const sessionData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.employee_name,
      role: user.role,
      role_name: user.role_name,
      is_super_admin: user.is_super_admin,
      employee_code: user.employee_code,
      account_status: user.account_status,
      is_2fa_enabled: user.is_2fa_enabled,
      permissions: user.permissions || (user.is_super_admin ? ['*'] : []),
      login_at: new Date().toISOString(),
    };

    // Cookie phiên đã KÝ (HMAC) — không thể giả mạo
    const token = await signSession(sessionData, SESSION_MAX_AGE);
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false, // Tương thích 100% với cả http://localhost và production
      maxAge: SESSION_MAX_AGE,
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: sessionData,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}
