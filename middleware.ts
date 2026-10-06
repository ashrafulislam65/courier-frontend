import { NextRequest, NextResponse } from 'next/server';

const roleRoutes: Record<string, string> = {
  '/admin': 'ADMIN',
  '/dashboard': 'CUSTOMER',
  '/provider': 'COURIER',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(roleRoutes).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) return NextResponse.next();

  // Zustand persist করা ডেটা একটা cookie-তে ম্যানুয়ালি sync করব (পরের ধাপে auth hook-এ দেখানো হবে)
  const authCookie = request.cookies.get('courier-auth-role')?.value;

  if (!authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = roleRoutes[matchedPrefix];
  if (authCookie !== requiredRole) {
    // ভুল role দিয়ে অন্য dashboard-এ ঢোকার চেষ্টা করলে নিজের dashboard-এ পাঠিয়ে দাও
    const redirectMap: Record<string, string> = {
      ADMIN: '/admin',
      CUSTOMER: '/dashboard',
      COURIER: '/provider',
    };
    return NextResponse.redirect(new URL(redirectMap[authCookie] || '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/provider/:path*'],
};