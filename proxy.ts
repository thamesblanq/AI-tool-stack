import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authMiddleware = NextAuth(authConfig).auth;

export default async function middleware(req: NextRequest) {
  try {
    // @ts-expect-error - NextAuth middleware types are imprecise
    return await authMiddleware(req);
  } catch (error) {
    console.error('Middleware auth error:', error);
    // If middleware crashes (e.g. missing AUTH_SECRET), allow the request through
    // instead of silently returning a 404.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
