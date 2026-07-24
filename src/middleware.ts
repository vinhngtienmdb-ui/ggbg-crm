import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('ggbg_crm_session');
  const { pathname } = request.nextUrl;

  // Allow static files, api routes, and _next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Validate session cookie payload integrity
  let isAuthenticated = false;
  if (sessionCookie && sessionCookie.value) {
    try {
      const parsed = JSON.parse(sessionCookie.value);
      if (parsed && parsed.username && parsed.role) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // List of protected routes requiring session authentication
  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/customers') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/hrm') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/kpis') ||
    pathname.startsWith('/performance') ||
    pathname.startsWith('/settings');

  // Redirect authenticated user away from /login page to dashboard root /
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated user accessing protected routes to /login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
