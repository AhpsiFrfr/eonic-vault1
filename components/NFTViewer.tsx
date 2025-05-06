import Image from 'next/image';
import { useVaultData } from '../hooks/useVaultData';

export const NFTViewer: React.FC = () => {
  const { nfts } = useVaultData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">NFT Gallery</h2>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
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
              {nft.stage && (
                <p className="text-sm text-gray-500">Stage {nft.stage}</p>
              )}
            </div>
          </div>
        ))}
        {nfts.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No NFTs found in your wallet</p>
          </div>
        )}
      </div>
    </div>
  );
}; 