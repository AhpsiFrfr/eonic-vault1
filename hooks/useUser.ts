import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export interface User {
  displayName: string;
  role: string;
  walletAddress: string;
}

export const useUser = () => {
  const { publicKey } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!publicKey) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const currentWallet = publicKey.toString();
        
        // Get the list of developer wallets from env
        const developerWallets = process.env.NEXT_PUBLIC_DEVELOPER_WALLETS?.split(',').map(w => w.trim()) || [];
        
        // Create the user object
        const user: User = {
          displayName: 'Vault Member',
          role: 'user',
          walletAddress: currentWallet
        };

        // Check if the current wallet is in the developer list
        if (developerWallets.includes(currentWallet)) {
          user.role = 'developer';
          user.displayName = 'EONIC Developer';
        }

        // TODO: In the future, we can add more role checks here
        // For example, checking NFT ownership, token holdings, etc.

        console.log('[useUser] Role check completed:', {
          wallet: currentWallet.slice(0, 8) + '...',
          role: user.role,
          isDeveloper: user.role === 'developer'
        });

        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [publicKey]);

  return { user, isLoading };
}; 