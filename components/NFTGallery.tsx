import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { getNFTsForWallet, NFTMetadata } from '../utils/nft';
import { cacheNFTMetadata, getCachedNFTs, filterNFTsByCollection, getPopularCollections } from '../utils/nftCache';
import Image from 'next/image';

export default function NFTGallery() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [popularCollections, setPopularCollections] = useState<{symbol: string, count: number}[]>([]);

  useEffect(() => {
    let mounted = true;
    let cachedNFTs: NFTMetadata[] = [];

    async function fetchNFTs() {
      if (!publicKey) return;
      
      setLoading(true);
      try {
        // Try to get cached NFTs first
        cachedNFTs = await getCachedNFTs(publicKey.toString());
        
        if (mounted && cachedNFTs.length > 0) {
          setNfts(cachedNFTs);
          // Don't set loading to false here to allow fresh fetch
        }

        // Fetch fresh NFTs and update cache
        const walletNFTs = await getNFTsForWallet(connection, publicKey.toString());
        
        if (mounted && walletNFTs.length > 0) {
          // Only cache and update if we got NFTs
          await Promise.all(walletNFTs.map(nft => 
            cacheNFTMetadata(nft, publicKey.toString())
          ));
          setNfts(walletNFTs);
        } else if (mounted && cachedNFTs.length === 0) {
          // If no fresh NFTs and no cached ones, show empty state
          setNfts([]);
        }

        try {
          // Update popular collections in a separate try-catch
          const collections = await getPopularCollections();
          if (mounted) {
            setPopularCollections(collections);
          }
        } catch (collectionError) {
          console.warn('Error loading popular collections:', collectionError);
          // Don't fail the whole NFT load if collections fail
        }

      } catch (error) {
        console.error('Error loading NFTs:', error);
        if (mounted) {
          if (cachedNFTs.length === 0) {
            setNfts([]);
            setError('Unable to load your NFTs. Please check your wallet connection and try again.');
          } else {
            // Show warning but keep cached NFTs
            console.warn('Using cached NFTs due to loading error');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchNFTs();

    return () => {
      mounted = false;
    };
  }, [publicKey, connection]);

  const filteredNFTs = selectedCollection
    ? nfts.filter(nft => nft.symbol === selectedCollection)
    : nfts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCollection('')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            !selectedCollection
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All NFTs
        </button>
        {popularCollections.map(({ symbol, count }) => (
          <button
            key={symbol}
            onClick={() => setSelectedCollection(symbol)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              selectedCollection === symbol
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {symbol} ({count})
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNFTs.map((nft, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="relative h-48">
              <Image
                src={nft.image}
                alt={nft.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{nft.name}</h3>
              <p className="text-sm text-gray-500">{nft.symbol}</p>
              {nft.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {nft.description}
                </p>
              )}
            </div>
          </div>
        ))}
        {filteredNFTs.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {selectedCollection
                ? `No NFTs found from ${selectedCollection} collection`
                : 'No NFTs found in your wallet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
