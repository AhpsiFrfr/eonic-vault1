import { supabase } from './supabase';
import { NFTMetadata } from './nft';

interface CachedNFT extends NFTMetadata {
  wallet_address: string;
  last_updated: string;
}

export async function cacheNFTMetadata(nft: NFTMetadata, walletAddress: string) {
  const { data, error } = await supabase
    .from('nft_cache')
    .upsert([
      {
        wallet_address: walletAddress,
        name: nft.name,
        symbol: nft.symbol,
        image: nft.image,
        description: nft.description,
        last_updated: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Error caching NFT:', error);
  }
  return data;
}

export async function getCachedNFTs(walletAddress: string): Promise<CachedNFT[]> {
  const { data } = await supabase
    .from('nft_cache')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('last_updated', { ascending: false });

  return data || [];
}

export async function filterNFTsByCollection(nfts: NFTMetadata[], collectionSymbol: string) {
  return nfts.filter(nft => nft.symbol === collectionSymbol);
}

export async function getPopularCollections(limit: number = 5) {
  const { data } = await supabase
    .from('nft_cache')
    .select('symbol')
    .order('last_updated', { ascending: false })
    .limit(100);

  // Count symbols manually
  const counts = (data || []).reduce((acc: Record<string, number>, item) => {
    acc[item.symbol] = (acc[item.symbol] || 0) + 1;
    return acc;
  }, {});

  // Sort by count and take top N
  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([symbol, count]) => ({ symbol, count }));

  return sorted;
}
