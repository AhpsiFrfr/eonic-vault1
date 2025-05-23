import { HELIUS_API_KEY } from '@/lib/constants';

export interface TokenData {
  mint: string;
  amount: number;
  decimals: number;
}

// Temporary dev wallets bypass (remove in production)
const DEV_WALLETS = ['guest-mode', 'dev-wallet-1', 'dev-wallet-2'];

async function getTokenBalance(wallet: string): Promise<number> {
  if (!wallet) {
    console.error('Token balance check failed: No wallet address provided');
    return 0;
  }

  // Guest mode bypass for development
  if (wallet === 'guest-mode') {
    console.log('Guest mode detected, allowing access');
    return 1; // Allow guest mode access
  }

  // Dev wallet bypass for development
  if (DEV_WALLETS.includes(wallet)) {
    console.log('Dev wallet detected, allowing access');
    return 1;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) {
      console.error('Token balance check failed: Missing Helius API key');
      // During development, allow access if API key is missing
      console.warn('Development mode: Allowing access due to missing API key');
      return 1;
    }

    const requiredMint = process.env.NEXT_PUBLIC_EONIC_TOKEN_MINT || 'HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nT';
    
    const res = await fetch(
      `https://api.helius.xyz/v0/addresses/${wallet}/tokens?api-key=${apiKey}`
    );
    
    if (!res.ok) {
      console.error('Token balance check failed: API request failed with status', res.status);
      // During development, allow access on API failures
      console.warn('Development mode: Allowing access due to API failure');
      return 1;
    }

    const tokens = await res.json();
    
    if (!Array.isArray(tokens)) {
      console.error('Token balance check failed: Invalid API response format');
      return 0;
    }

    const eonicToken = tokens.find((token: TokenData) => token.mint === requiredMint);
    const balance = eonicToken ? eonicToken.amount / Math.pow(10, eonicToken.decimals) : 0;
    
    console.log(`Token balance for ${wallet}: ${balance} EONIC tokens`);
    return balance;

  } catch (error) {
    console.error('Token balance check failed:', error);
    // During development, allow access on errors
    console.warn('Development mode: Allowing access due to error');
    return 1;
  }
}

export async function checkAccess(wallet: string): Promise<boolean> {
  try {
    console.log('Checking access for wallet:', wallet);
    const balance = await getTokenBalance(wallet);
    const hasAccess = balance > 0;
    console.log(`Access check result for ${wallet}:`, hasAccess);
    return hasAccess;
  } catch (error) {
    console.error('Access check failed:', error);
    // During development, allow access on errors
    console.warn('Development mode: Allowing access due to error');
    return true;
  }
}

// Optional dev wallet whitelist for staging (uncomment during development)
// const DEV_WALLETS = ['wallet1...', 'wallet2...', 'wallet3...'];
// export async function checkAccess(wallet: string): Promise<boolean> {
//   return DEV_WALLETS.includes(wallet);
// } 