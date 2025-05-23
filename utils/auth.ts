import { NextResponse } from 'next/server';
import { checkAccess } from '@/lib/token-checker';

interface TokenAccessOptions {
  minTokens?: number;
  requiredNFTs?: string[];
}

export const verifyTokenAccess = async (wallet: string, options?: TokenAccessOptions) => {
  if (!wallet) return null;
  
  try {
    const hasAccess = await checkAccess(wallet);
    if (hasAccess) {
      return 'user';
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const roleRedirect = (userRole: string | null, path: string) => {
  if (!userRole) return true;
  
  // Protected routes that require token access
  const protectedPaths = ['/dashboard', '/vault', '/dev-hq', '/vaultcord', '/eon-id'];
  
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    return userRole !== 'user';
  }
  
  return false;
};

export const setWalletCookie = (wallet: string) => {
  document.cookie = `wallet=${wallet}; path=/; max-age=86400; samesite=strict`;
};

export const removeWalletCookie = () => {
  document.cookie = 'wallet=; path=/; max-age=0';
};

// Server-side props helper for protected pages
export const withTokenGating = async (context: any) => {
  const wallet = context.req.cookies.wallet;
  
  if (!wallet) {
    return {
      redirect: {
        destination: '/login?redirect=true',
        permanent: false,
      },
    };
  }
  
  const hasAccess = await checkAccess(wallet);
  if (!hasAccess) {
    return {
      redirect: {
        destination: '/access-denied',
        permanent: false,
      },
    };
  }
  
  return { props: { wallet } };
};