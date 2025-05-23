import { HELIUS_API_KEY } from '@/lib/constants';

export interface TokenData {
  mint: string;
  amount: number;
  decimals: number;
}

async function getTokenBalance(wallet: string): Promise<number> {
  if (!wallet) {
    console.error('Token balance check failed: No wallet address provided');
    return 0;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) {
      console.error('Token balance check failed: Missing Helius API key');
      return 0;
    }

    const requiredMint = process.env.NEXT_PUBLIC_EONIC_TOKEN_MINT || 'HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nT';
    
    const res = await fetch(
      `https://api.helius.xyz/v0/addresses/${wallet}/tokens?api-key=${apiKey}`
    );
    
    if (!res.ok) {
      throw new Error(`Helius API error: ${res.status}`);
    }
    
    const tokens = await res.json();
    
    // Type guard to ensure tokens is an array
    if (!Array.isArray(tokens)) {
      console.error('Token balance check failed: Invalid response format');
      return 0;
    }
    
    // Find the token and return its balance
    const eonicToken = tokens.find((token: any) => 
      token && typeof token === 'object' && token.mint === requiredMint
    );
    
    if (eonicToken && typeof eonicToken.amount === 'number') {
      // Convert from lamports to actual token amount using decimals
      const decimals = eonicToken.decimals || 0;
      return eonicToken.amount / Math.pow(10, decimals);
    }
    
    return 0;
  } catch (err) {
    console.error('Token balance check failed:', err);
    return 0;
  }
}

export async function checkAccess(wallet: string): Promise<boolean> {
  const balance = await getTokenBalance(wallet);
  return balance > 0;
}

// Optional dev wallet whitelist for staging (uncomment during development)
// const DEV_WALLETS = ['wallet1...', 'wallet2...', 'wallet3...'];
// export async function checkAccess(wallet: string): Promise<boolean> {
//   return DEV_WALLETS.includes(wallet);
// } 