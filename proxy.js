import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protected customer sub-routes requiring mandatory authentication
  const isProtectedCustomerRoute = 
    pathname.startsWith('/customer/profile') || 
    pathname.startsWith('/customer/bookings') ||
    pathname.startsWith('/customer/payment');

  // If attempting to access protected customer sub-routes without an auth cookie
  if (isProtectedCustomerRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from /login and /register pages
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/customer/cafe', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/customer/:path*',
    '/login',
    '/register'
  ],
};
