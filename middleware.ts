import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenAccess, roleRedirect } from './utils/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ['/', '/login'];
  
  // Skip middleware for public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }
  
  // For wallet authentication, we'll handle this client-side
  // The wallet connection state is managed by @solana/wallet-adapter-react
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cabal/:path*', 
    '/admin/:path*',
    '/profile'
  ]
};
