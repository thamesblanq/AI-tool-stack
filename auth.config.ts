// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Define your routes
      const isOnBookmarks = nextUrl.pathname.startsWith('/bookmarks'); // Change this if your route is named /saved or something else
      const isAuthRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup';

      // 1. Handling Login/Signup pages
      if (isAuthRoute) {
        if (isLoggedIn) {
          // If they are already logged in, send them to the home page (or bookmarks)
          return Response.redirect(new URL('/', nextUrl)); 
        }
        return true; // Let unauthenticated users see the login/signup pages
      }

      // 2. Protecting the Bookmarks page
      if (isOnBookmarks) {
        if (isLoggedIn) return true;
        return false; // Redirects unauthenticated users to the login page
      }

      // 3. Allow access to everything else (Home, Tool Details, etc.)
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;