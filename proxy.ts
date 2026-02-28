import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 1. Initialize NextAuth and extract the auth function
const { auth } = NextAuth(authConfig);

// 2. Export it as a named constant 'proxy' 
// (or 'middleware' if your version still looks for that name)
export const proxy = auth; 

export const config = {
  // Your matcher is good, but I added /favicon.ico to be safe
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};