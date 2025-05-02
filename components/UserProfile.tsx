import React from 'react';
import { supabase } from '../utils/supabase';

interface UserProfileProps {
  userAddress: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

interface UserProfile {
  user_address: string;
  display_name: string | null;
  avatar_url: string | null;
  status: string;
  last_seen: string;
}

export default function UserProfile({ userAddress, size = 'md', showStatus = false }: UserProfileProps) {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_address', userAddress)
        .single();

      if (data) {
        setProfile(data);
      } else {
        // Create default profile if none exists
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({
            user_address: userAddress,
            display_name: truncateAddress(userAddress),
            status: 'online'
          })
          .select()
          .single();

        if (newProfile) {
          setProfile(newProfile);
        }
      }
    };

    fetchProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_address=eq.${userAddress}`
      }, (payload) => {
        setProfile(payload.new as UserProfile);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userAddress]);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  if (!profile) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-700 rounded-full flex items-center justify-center text-white`}>
        {truncateAddress(userAddress).slice(0, 2)}
      </div>
    );
  }

  return (
    <div className="relative group">
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.display_name || truncateAddress(userAddress)}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gray-700 rounded-full flex items-center justify-center text-white`}>
          {(profile.display_name || truncateAddress(userAddress)).slice(0, 2)}
        </div>
      )}
      
      {showStatus && (
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800
          ${profile.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}
        />
      )}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {profile.display_name || truncateAddress(userAddress)}
        {showStatus && (
          <div className="text-xs opacity-75">
            {profile.status === 'online' ? 'Online' : `Last seen ${new Date(profile.last_seen).toLocaleString()}`}
          </div>
        )}
      </div>
    </div>
  );
}
