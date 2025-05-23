import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenAccess, roleRedirect } from './utils/auth';

// Temporary development mode flag - set to false in production
const DEV_MODE = true;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // In development mode, bypass middleware except for essential paths
  if (DEV_MODE) {
    console.log(`[DEV MODE] Middleware called for: ${path}`);
    return NextResponse.next();
  }
  
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
    console.log(`No wallet found for path: ${path}, redirecting to login`);
    // Add a query parameter to indicate this is a middleware redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', 'true');
    loginUrl.searchParams.set('returnTo', path);
    return NextResponse.redirect(loginUrl);
  }
  
  console.log(`Verifying token access for wallet: ${wallet} on path: ${path}`);
  
  // Verify token/NFT access
  const userRole = await verifyTokenAccess(wallet, {
    minTokens: path.startsWith('/dashboard') ? 1 : undefined,
    requiredNFTs: path.startsWith('/cabal') 
      ? [process.env.CABAL_NFT_MINT!] 
      : undefined
  });
  
  console.log(`User role result: ${userRole} for wallet: ${wallet}`);
  
  // Redirect if insufficient access
  if (roleRedirect(userRole, path)) {
    console.log(`Access denied for wallet: ${wallet} on path: ${path}`);
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }
  
  console.log(`Access granted for wallet: ${wallet} on path: ${path}`);
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
