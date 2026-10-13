import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // If user accesses /cafes/:id directly, rewrite cleanly to /customer/cafe/:id
  if (pathname.startsWith('/cafes/')) {
    const cafeId = pathname.replace('/cafes/', '');
    if (cafeId) {
      return NextResponse.rewrite(new URL(`/customer/cafe/${cafeId}`, request.url));
    }
  }

  // If user accesses /cafes directly, redirect to /customer/cafe
  if (pathname === '/cafes') {
    return NextResponse.redirect(new URL('/customer/cafe', request.url));
  }

  // Public customer routes that guests can browse without login
  const isPublicCustomerRoute = 
    pathname === '/customer/cafe' || 
    pathname.startsWith('/customer/cafe') || 
    pathname.startsWith('/customer/cafes') || 
    pathname.startsWith('/customer/discover') || 
    pathname.startsWith('/customer/compare') ||
    pathname.startsWith('/customer/search');

  // Protected customer sub-routes requiring mandatory authentication
  const isProtectedCustomerRoute = pathname.startsWith('/customer') && !isPublicCustomerRoute;

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

export default middleware;

export const config = {
  matcher: [
    '/customer/:path*',
    '/cafes/:path*',
    '/cafes',
    '/login',
    '/register'
  ],
};

