import { NextResponse } from 'next/server';
import { getAuthenticatedSessionUser } from '@/lib/authSession';
import { findUserForAuth } from '@/lib/authRepo';
import { verifyPassword, hashPassword } from '@/lib/password';
import { setUserPasswordByUsername } from '@/lib/userStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu hiện tại và Mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' },
        { status: 400 }
      );
    }

    // Verify current user password
    const userAuth = await findUserForAuth(sessionUser.username);
    if (!userAuth || !userAuth.password_hash) {
      return NextResponse.json({ success: false, message: 'Tài khoản không hợp lệ' }, { status: 400 });
    }

    const isMatch = await verifyPassword(current_password, userAuth.password_hash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
    }

    const newHash = await hashPassword(new_password);
    setUserPasswordByUsername(sessionUser.username, newHash);

    return NextResponse.json({
      success: true,
      message: '🎉 Đổi mật khẩu cá nhân thành công! Vui lòng nhớ mật khẩu mới cho lần đăng nhập sau.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi đổi mật khẩu' }, { status: 500 });
  }
}
