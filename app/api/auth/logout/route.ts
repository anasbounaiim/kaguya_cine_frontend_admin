// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production'
  });
  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
