import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByUsernameOrEmail } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập Tên đăng nhập và Mật khẩu!' },
        { status: 400 }
      );
    }

    // Find matching user from userStore
    const user = findUserByUsernameOrEmail(username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập hoặc Mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    // Account status validation
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

    // Prepare session payload
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
      roles: [user.role],
      permissions: user.permissions || (user.is_super_admin ? ['*'] : []),
      login_at: new Date().toISOString(),
    };

    // Set HTTP-Only Auth Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'ggbg_crm_session',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 24 hours
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: sessionData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}
