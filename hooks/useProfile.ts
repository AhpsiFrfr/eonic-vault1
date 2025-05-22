import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createSupabaseClient } from '@/utils/supabase';
import { UserProfile } from '@/utils/user';

export function useProfile() {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const walletAddress = publicKey?.toString();

    const loadProfile = async () => {
      if (!walletAddress) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const supabase = createSupabaseClient(walletAddress);
        
        // Query the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') { // No rows returned
            // Create default profile
            const timestamp = new Date().toISOString();
            const newProfile = {
              wallet_address: walletAddress,
              display_name: `User-${walletAddress.substring(0, 6)}`,
              title: 'EONIC Explorer',
              bio: '',
              wallet_tagline: '',
              avatar_url: '/images/avatars/default.svg',
              widget_list: ['nft-showcase', 'xp-tracker'],
              is_public: true,
              created_at: timestamp,
              updated_at: timestamp
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();

            if (createError) throw createError;
            if (mounted) setProfile(createdProfile);
          } else {
            throw error;
          }
        } else if (mounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load profile'));
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [publicKey]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile?.wallet_address) return null;

    try {
      const supabase = createSupabaseClient(profile.wallet_address);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', profile.wallet_address)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return { profile, isLoading, error, updateProfile };
} 