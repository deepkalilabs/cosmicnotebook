import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();

  const cookieStore = await cookies();
  
  cookieStore.set('auth_token', access_token, {
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  cookieStore.set('refresh_token', refresh_token, {
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return NextResponse.json({ success: true });
} 