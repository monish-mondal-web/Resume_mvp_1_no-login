import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/'; // Landing is also the login page

    // If logged in and trying to access landing page, go to dashboard
    if (isAuthPage && isAuth) {
      if (token.isProfileCompleted) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes
        if (
          pathname === '/' ||
          pathname.startsWith('/api/auth') ||
          pathname === '/onboarding' || // Onboarding is public for building, but protected for saving
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico')
        ) {
          return true;
        }

        // Protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/'],
};
