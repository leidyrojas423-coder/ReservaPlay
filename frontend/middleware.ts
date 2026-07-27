import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE, isAdminJwt, isJwtExpired, readTokenFromCookieString } from './lib/auth';

function isProtectedAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

function isProtectedClientRoute(pathname: string): boolean {
  return pathname === '/cliente' || pathname.startsWith('/cliente/');
}

function isPublicAdminRoute(pathname: string): boolean {
  return pathname === '/admin/login' || pathname === '/admin/registro';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value ?? readTokenFromCookieString(request.headers.get('cookie'));
  const hasValidToken = Boolean(token && !isJwtExpired(token));
  const hasAdminToken = Boolean(token && !isJwtExpired(token) && isAdminJwt(token));

  if (isPublicAdminRoute(pathname)) {
    if (hasAdminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedAdminRoute(pathname) && !hasAdminToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedClientRoute(pathname) && !hasValidToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);

    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(AUTH_TOKEN_COOKIE, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cliente/:path*'],
};
