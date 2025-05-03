import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Metaplex } from '@metaplex-foundation/js';

export interface NFTMetadata {
  name: string;
  symbol: string;
  image: string;
  description: string;
}

export const EONIC_MINT_ADDRESS = process.env.NEXT_PUBLIC_EONIC_MINT_ADDRESS || '';

const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://mainnet.helius-rpc.com/?api-key=1d0f0ccc-9d39-40df-8e99-4959ba12ad66',
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await delay(delayMs * (i + 1)); // Exponential backoff
      }
    }
  }
  throw lastError;
};

export async function getNFTsForWallet(connection: Connection, walletAddress: string) {
  let lastError;

  // Try each RPC endpoint until one works
  for (const endpoint of RPC_ENDPOINTS) {
    if (!endpoint) continue;

    try {
      const fallbackConnection = new Connection(endpoint, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        fetch: (url: string, options: RequestInit) => {
          return withRetry(() => fetch(url, { ...options, cache: 'no-store' }));
        }
      });

      const mx = Metaplex.make(fallbackConnection);
      
      const nfts = await withRetry(() => 
        mx.nfts().findAllByOwner({
          owner: new PublicKey(walletAddress),
        })
      );

      if (!nfts || nfts.length === 0) {
        console.warn(`No NFTs found with RPC ${endpoint}`);
        continue;
      }

      return nfts.map(nft => {
        const metadata = nft.json || {};
        return {
          name: nft.name || 'Unnamed NFT',
          symbol: nft.symbol || 'UNKNOWN',
          description: metadata.description || '',
          image: metadata.image || '',
          attributes: metadata.attributes || []
        };
      });
    } catch (error) {
      console.warn(`Error with RPC ${endpoint}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error('All RPC endpoints failed:', lastError);
  return [];
}

const EONIC_NFT_LAUNCH_DATE = new Date('2025-06-01T00:00:00Z');

export async function verifyEonicNFT(connection: Connection, walletAddress: string): Promise<{ verified: boolean; notLaunched: boolean }> {
  // Check if NFT has been launched yet
  const currentDate = new Date();
  if (currentDate < EONIC_NFT_LAUNCH_DATE) {
    return { verified: true, notLaunched: true };
  }

  try {
    const nfts = await getNFTsForWallet(connection, walletAddress);
    return { 
      verified: nfts.some(nft => nft.symbol === 'EONIC'),
      notLaunched: false
    };
  } catch (error) {
    console.error('Error verifying EONIC NFT:', error);
    return { verified: false, notLaunched: false };
  }
}
