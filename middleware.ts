import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenAccess, roleRedirect } from './utils/auth';

export async function middleware(request: NextRequest) {
  // DISABLED for testing - just pass through all requests
  console.log('Middleware disabled for testing - allowing all routes');
  return NextResponse.next();
  
  /* Original code - disabled temporarily
  const path = request.nextUrl.pathname;
  // Consider the dashboard root path as public to prevent redirection loops
  const publicPaths = ['/', '/login', '/dashboard'];
  
  // Skip middleware for public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }
  
  // Get wallet from cookies or headers
  const wallet = request.cookies.get('wallet')?.value;
  
  if (!wallet) {
    // Add a query parameter to indicate this is a middleware redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', 'true');
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
  */
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cabal/:path*', 
    '/admin/:path*',
    '/profile'
  ]
};
