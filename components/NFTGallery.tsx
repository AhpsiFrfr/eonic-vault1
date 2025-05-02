import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { getNFTsForWallet, NFTMetadata } from '../utils/nft';
import { cacheNFTMetadata, getCachedNFTs, filterNFTsByCollection, getPopularCollections } from '../utils/nftCache';
import Image from 'next/image';

export const NFTGallery: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [popularCollections, setPopularCollections] = useState<{symbol: string, count: number}[]>([]);

  useEffect(() => {
    async function fetchNFTs() {
      if (!publicKey) return;
      
      setLoading(true);
      try {
        // Try to get cached NFTs first
        const cachedNFTs = await getCachedNFTs(publicKey.toString());
        
        if (cachedNFTs.length > 0) {
          setNfts(cachedNFTs);
          setLoading(false);
        }

        // Fetch fresh NFTs and update cache
        const walletNFTs = await getNFTsForWallet(connection, publicKey.toString());
        
        // Cache each NFT
        await Promise.all(walletNFTs.map(nft => 
          cacheNFTMetadata(nft, publicKey.toString())
        ));

        setNfts(walletNFTs);

        // Update popular collections
        const collections = await getPopularCollections();
        setPopularCollections(collections);

      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [publicKey, connection]);

  const filteredNFTs = selectedCollection
    ? nfts.filter(nft => nft.symbol === selectedCollection)
    : nfts;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
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
