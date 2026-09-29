import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protected customer sub-routes requiring mandatory authentication
  const isProtectedCustomerRoute = pathname.startsWith('/customer');

  // If attempting to access protected customer sub-routes without an auth cookie
  if (isProtectedCustomerRoute && !token) {
    const registerUrl = new URL('/register', request.url);
    registerUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(registerUrl);
  }

  // Redirect logged-in users away from /login and /register pages unless they have a redirect/from query parameter
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const hasRedirectParam = request.nextUrl.searchParams.has('redirect') || request.nextUrl.searchParams.has('from');
  if (isAuthRoute && token && !hasRedirectParam) {
    return NextResponse.redirect(new URL('/customer/cafe', request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    '/customer/:path*',
    '/login',
    '/register'
  ],
};

