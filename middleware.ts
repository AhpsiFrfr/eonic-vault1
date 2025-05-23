import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenAccess, roleRedirect } from './utils/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/access-denied', '/api/register-subdomain'];
  
  // Skip middleware for public paths and static assets
  if (publicPaths.includes(path) || 
      path.startsWith('/_next') || 
      path.startsWith('/public') ||
      path.includes('.')) {
    return NextResponse.next();
  }
  
  // Get wallet from cookies or headers
  const wallet = request.cookies.get('wallet')?.value;
  
  if (!wallet) {
    // Add a query parameter to indicate this is a middleware redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', 'true');
    loginUrl.searchParams.set('returnTo', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token/NFT access
  const userRole = await verifyTokenAccess(wallet, {
    minTokens: path.startsWith('/dashboard') ? 1 : undefined,
    requiredNFTs: path.startsWith('/cabal') 
      ? [process.env.CABAL_NFT_MINT!] 
      : undefined
  });
  
  // Redirect if insufficient access
  if (roleRedirect(userRole, path)) {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vault/:path*',
    '/dev-hq/:path*',
    '/vaultcord/:path*',
    '/eon-id/:path*',
    '/cabal/:path*', 
    '/admin/:path*',
    '/profile',
    '/messages/:path*',
    '/showcase'
  ]
};
