import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

function decodeJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(jsonPayload);
}

export async function refreshToken(token: string) {
  if (!token) {
    console.error('Middleware: Refresh token is null or empty');
    return null;
  }

  try {
    console.log('Middleware: Attempting to refresh with token length:', token.length);
    const { data, error: refreshError } = await supabase.auth.refreshSession({ 
      refresh_token: token 
    });

    if (refreshError) {
      console.error('Middleware: Refresh error:', refreshError.message);
      return null;
    }

    if (!data.session) {
      console.error('Middleware: No session in refresh response');
      return null;
    }

    console.log('Middleware: Successfully refreshed session');
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    };
  } catch (e) {
    console.error('Middleware: Unexpected error during refresh:', e);
    return null;
  }
}


export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware: path:', path);

  // Skip middleware for auth routes
  if (path.startsWith('/auth')) {
    return NextResponse.next();
  }

  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/api');
  console.log('Middleware: isProtectedRoute:', isProtectedRoute);

  if (isProtectedRoute) {
    let authToken = request.cookies.get('auth_token')?.value || null;
    let refreshT = request.cookies.get('refresh_token')?.value || null;
    console.log('Middleware: auth token:', authToken?.substring(0, 20) + '...');
    console.log('Middleware: refresh token:', refreshT?.substring(0, 20) + '...');

    if (!authToken) {
      console.log('Middleware: No auth token found.');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      // Decode token to check expiration
      const decoded = decodeJwt(authToken);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('Middleware: Token exp:', decoded.exp, 'Current time:', currentTime);

      // Refresh if token is expired
      if (decoded.exp && decoded.exp <= currentTime) {
        console.log('Middleware: Token expired, attempting refresh...');
        if (!refreshT) {
          console.log('Middleware: No refresh token available.');
          return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        const refreshed = await refreshToken(refreshT);
        if (!refreshed) {
          console.log('Middleware: Refresh failed.');
          return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        authToken = refreshed.accessToken;
        refreshT = refreshed.refreshToken; // Update refresh token if provided
        console.log('Middleware: Token refreshed:', authToken?.substring(0, 20) + '...');
      }

      // Set Authorization header with (possibly refreshed) token
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${authToken}`);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Update cookies
      response.cookies.set('auth_token', authToken ?? '', {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours in seconds
      });

      if (refreshT) {
        response.cookies.set('refresh_token', refreshT, {
          secure: true,
          sameSite: 'strict',
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      console.log('Middleware: Proceeding with request');
      return response;
    } catch (error) {
      console.error('Middleware: Token validation error:', error);
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // List specific API routes to protect
    '/api/logs/:path*',
    '/api/notebooks/:path*',
    '/api/projects/:path*',
    '/api/connectors/:path*',
    // Protect dashboard routes
    '/dashboard/:path*',
  ],
};