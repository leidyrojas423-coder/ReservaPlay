import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isJwtExpired, readTokenFromCookieString } from './lib/auth';

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
