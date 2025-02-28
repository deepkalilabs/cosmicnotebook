import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  //Get path name
  const path = request.nextUrl.pathname;
  console.log('Middleware: path:', path);

  //Skip middleware for auth routes
  if (path.startsWith('/auth')) {
    return NextResponse.next();
  }

  //For protected routes, check if user is authenticated
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/api');

  if (isProtectedRoute) {
     // Check query parameter for token
    let authToken = request.nextUrl.searchParams.get('token')
    console.log('Middleware: auth token from query or cookie:', authToken);
    console.log('Middleware: isProtectedRoute:', isProtectedRoute);

    if (!authToken) {
      authToken = request.cookies.get('auth_token')?.value || null;
    }

    if (!authToken) {
        console.log('Middleware: No auth token found.');
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }

    //Token is valid, continue to request. Add token to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${authToken}`);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set('auth_token', authToken, {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });  
    console.log('Middleware: set auth token from query');

  //For public routes, continue to request
  return response;

  }

  return NextResponse.next();
}


// Configure which paths this middleware should run on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Add other paths that need authentication
    '/api/notebooks/:path*', // Protect all notebook routes
    '/dashboard/:path*', // Protect all dashboard routes
  ],
};