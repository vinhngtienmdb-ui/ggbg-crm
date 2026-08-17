import { NextResponse } from 'next/server';
import { getAuthenticatedSessionUser } from '@/lib/authSession';
import { findUserForAuth } from '@/lib/authRepo';
import { generateBase32Secret, getGoogleAuthQRUrl, verifyTOTPCode } from '@/lib/totp';
import { setUser2FAStatus } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

// GET: Get current 2FA status or generate new secret & QR code
export async function GET() {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  const user = await findUserForAuth(sessionUser.username);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Tài khoản không hợp lệ' }, { status: 404 });
  }

  // If already 2FA enabled, return status
  const isEnabled = !!user.is_2fa_enabled;
  const secret = user.totp_secret || generateBase32Secret();
  const qrUrl = getGoogleAuthQRUrl(user.username, secret);

  return NextResponse.json({
    success: true,
    is_2fa_enabled: isEnabled,
    totp_secret: secret,
    qr_url: qrUrl,
  });
}

// POST: Confirm 6-digit TOTP code and enable 2FA, or disable 2FA
export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, totp_code, secret } = body;

    const user = await findUserForAuth(sessionUser.username);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Tài khoản không hợp lệ' }, { status: 404 });
    }

    if (action === 'DISABLE') {
      setUser2FAStatus(sessionUser.username, false);
      return NextResponse.json({
        success: true,
        message: '⚪ Đã tắt tính năng Xác thực Google Authenticator (2FA) thành công.',
      });
    }

    // ENABLE Action
    if (!totp_code || !secret) {
      return NextResponse.json(
        { success: false, message: 'Mã xác thực 6 chữ số và Secret Key là bắt buộc' },
        { status: 400 }
      );
    }

    const isValid = verifyTOTPCode(secret, totp_code);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: ' Mã 6 chữ số Google Authenticator không chính xác hoặc đã hết hạn (30s). Vui lòng thử lại.' },
        { status: 400 }
      );
    }

    // Code is valid! Enable 2FA for this user
    setUser2FAStatus(sessionUser.username, true, secret);

    return NextResponse.json({
      success: true,
      message: '🎉 Đã xác minh & kích hoạt bảo mật Google Authenticator (2FA) thành công!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cấu hình 2FA' }, { status: 500 });
  }
}
