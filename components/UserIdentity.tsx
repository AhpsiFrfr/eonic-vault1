import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserProfile, UserProfile } from '../utils/user';
import { getWalletDomain } from '../utils/solana-name-service';
import { Connection } from '@solana/web3.js';
import { motion } from 'framer-motion';

interface UserIdentityProps {
  walletAddress: string;
  showFull?: boolean;
  className?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  linkToProfile?: boolean;
}

export const UserIdentity = ({ 
  walletAddress, 
  showFull = false, 
  className = '',
  avatarSize = 'md',
  linkToProfile = true
}: UserIdentityProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solanaDomain, setSolanaDomain] = useState<string | null>(null);
  
  // Sizing classes for the avatar
  const avatarSizeClass = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[avatarSize];
  
  // Get shortened wallet address for display
  const shortenedAddress = walletAddress 
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : '';
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!walletAddress) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Try to get user profile
        const userProfile = await getUserProfile(walletAddress);
        setProfile(userProfile);
        
        // If no profile or no domain in profile, try direct lookup
        if (!userProfile?.solana_domain) {
          try {
            const connection = new Connection('https://api.mainnet-beta.solana.com');
            const domain = await getWalletDomain(connection, walletAddress);
            if (domain) {
              setSolanaDomain(domain);
            }
          } catch (err) {
            console.error('Error fetching Solana domain:', err);
          }
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [walletAddress]);
  
  const displayName = profile?.display_name || shortenedAddress;
  const avatarUrl = profile?.avatar_url || '/images/avatars/default.svg';
  const displayDomain = profile?.solana_domain || solanaDomain;
  
  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${avatarSizeClass} rounded-full bg-indigo-900/50 animate-pulse`}></div>
        <div className="h-4 w-24 bg-indigo-900/50 rounded animate-pulse"></div>
      </div>
    );
  }
  
  const identityContent = (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${avatarSizeClass} rounded-full overflow-hidden border border-indigo-500/30`}>
        <img 
          src={avatarUrl} 
          alt={displayName} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to default avatar on error
            e.currentTarget.src = '/images/avatars/default.svg';
          }} 
        />
      </div>
      
      <div>
        <div className="font-medium text-white">
          {displayName}
        </div>
        
        {displayDomain && (
          <div className="text-xs text-indigo-400">
            {displayDomain}.sol
          </div>
        )}
        
        {showFull && profile?.title && (
          <div className="text-xs text-gray-400 mt-0.5">
            {profile.title}
          </div>
        )}
      </div>
    </div>
  );
  
  // If linking to profile is enabled, wrap in a Link
  if (linkToProfile && profile) {
    return (
      <Link href={`/profile/${walletAddress}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
        >
          {identityContent}
        </motion.div>
      </Link>
    );
  }
  
  // Otherwise just return the content
  return identityContent;
}; 