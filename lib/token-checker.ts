import { HELIUS_API_KEY } from '@/lib/constants';

export interface TokenData {
  mint: string;
  amount: number;
  decimals: number;
}

export async function checkAccess(wallet: string): Promise<boolean> {
  // Temporarily disabled token gating for testing
  return true;

  /* Token gating logic commented out for testing
  if (!wallet) {
    console.error('Token access check failed: No wallet address provided');
    return false;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) {
      console.error('Token access check failed: Missing Helius API key');
      return false;
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
      console.error('Token access check failed: Invalid response format');
      return false;
    }
    
    return tokens.some((token: any) => 
      token && typeof token === 'object' && token.mint === requiredMint
    );
  } catch (err) {
    console.error('Token access check failed:', err);
    return false;
  }
  */
} 