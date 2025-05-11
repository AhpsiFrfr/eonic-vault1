'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoCardProps {
  userWalletAddress?: string;
}

interface LogoItem {
  id: string;
  name: string;
  image: string;
  imageExists?: boolean;
}

export function LogoCard({ userWalletAddress }: LogoCardProps) {
  // Mock data - in a real app, this would be loaded from user profile
  const [logos, setLogos] = useState<LogoItem[]>([
    { id: 'eonic', name: 'EONIC', image: '/eonic-logo-gold.svg', imageExists: false },
    { id: 'vault', name: 'Vault', image: '/logo.png', imageExists: false }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if images exist (in a real app, this would be done server-side)
  useEffect(() => {
    setIsLoading(true);
    
    // Use some default images that you know exist in your public folder
    const updatedLogos = logos.map(logo => ({
      ...logo,
      // Set a default image that you know exists in your public folder
      image: '/default-avatar.png', // Fallback to a image you know exists
      imageExists: true
    }));
    
    setLogos(updatedLogos);
    setIsLoading(false);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-2">Logos/Brands</h3>
      
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div className="w-16 h-16 bg-gray-700 animate-pulse rounded"></div>
          </div>
        ) : (
          logos.map((logo) => (
            <div key={logo.id} className="flex flex-col items-center">
              <div className="w-16 h-16 relative bg-gray-700 rounded p-2 flex items-center justify-center">
                {logo.imageExists ? (
                  <Image 
                    src={logo.image}
                    alt={logo.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="text-xs text-gray-500">{logo.name[0]}</div>
                )}
              </div>
              <span className="text-xs mt-1 text-gray-300">{logo.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 