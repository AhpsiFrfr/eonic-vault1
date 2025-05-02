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

export async function getNFTsForWallet(connection: Connection, walletAddress: string) {
  try {
    const mx = Metaplex.make(connection);
    const nfts = await mx.nfts().findAllByOwner({ owner: new PublicKey(walletAddress) });

    return nfts.map(nft => {
      const metadata = nft.json || {};
      return {
        name: nft.name,
        symbol: nft.symbol,
        description: metadata.description || '',
        image: metadata.image || '',
        attributes: metadata.attributes || []
      };
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
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
