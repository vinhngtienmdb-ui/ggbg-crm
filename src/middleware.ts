import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Allow static files, api routes, _next internals
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('ggbg_crm_session');
    const isLoginPage = pathname === '/login';

    if (!sessionCookie && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (sessionCookie && isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

