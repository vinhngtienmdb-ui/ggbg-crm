import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua static files, api routes, _next internals (API tự bảo vệ bằng apiGuard)
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Xác minh CHỮ KÝ phiên (không còn tin JSON thuần)
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  const isAuthenticated = !!session;

  // Trang /login: đã đăng nhập thì đưa về dashboard
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Mọi route ứng dụng còn lại đều yêu cầu đăng nhập
  if (!isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
