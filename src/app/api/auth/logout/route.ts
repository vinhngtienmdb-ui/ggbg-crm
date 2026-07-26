import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Explicitly expire and delete the HTTP-Only session cookie
    cookieStore.set({
      name: SESSION_COOKIE,
      value: '',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
      expires: new Date(0),
    });
    cookieStore.delete(SESSION_COOKIE);

    return NextResponse.json({
      success: true,
      message: 'Đã đăng xuất thành công!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}
