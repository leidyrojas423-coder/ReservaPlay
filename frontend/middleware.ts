import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isJwtExpired, readTokenFromCookieString } from './lib/auth';

function isProtectedAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value ?? readTokenFromCookieString(request.headers.get('cookie'));
  const hasValidToken = Boolean(token && !isJwtExpired(token));

  if (pathname === '/admin/login') {
    if (hasValidToken) {
      return NextResponse.redirect(new URL('/admin/canchas', request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedAdminRoute(pathname) && !hasValidToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
