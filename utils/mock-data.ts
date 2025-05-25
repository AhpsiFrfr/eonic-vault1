// Mock data storage for development
// This allows us to share mock profile data across components

import { supabase } from './supabase';
import { UserProfile } from './user';

interface SocialLinks {
  github?: string;
  website?: string;
  twitter?: string;
  discord?: string;
}

export interface MockProfile {
  id: string;
  wallet_address: string;
  display_name: string;
  title: string;
  bio: string;
  avatar_url: string;
  use_shortened_wallet: boolean;
  tagline: string;
  domain: string;
  show_real_name: boolean;
  allow_non_mutual_dms: boolean;
  show_holdings: boolean;
  is_public: boolean;
  social_links: SocialLinks;
  created_at?: string;
  updated_at?: string;
  timepiece_url?: string;
  // Business card fields
  show_business_card?: boolean;
  card_style?: string;
}

// Create a default profile object without saving it
function createDefaultProfileObject(walletAddress: string): MockProfile {
  return {
    id: `mock-${Date.now()}`,
    wallet_address: walletAddress,
    display_name: 'Bussynfrfr',
    title: 'EONIC DEV',
    bio: '',
    avatar_url: '/images/avatars/default.svg',
    timepiece_url: '/images/timepiece-nft.png',
    use_shortened_wallet: false,
    tagline: '',
    domain: 'bussynfrfr',
    show_real_name: false,
    allow_non_mutual_dms: true,
    show_holdings: true,
    is_public: true,
    social_links: {},
    show_business_card: false,
    card_style: 'intern',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Helper to save all profiles to localStorage
function saveAllProfiles(profiles: Map<string, MockProfile>): void {
  if (typeof window === 'undefined') return;
  try {
    const profilesObj = Object.fromEntries(profiles);
    localStorage.setItem('mockProfiles', JSON.stringify(profilesObj));
  } catch (error) {
    console.error('Error saving mock profiles:', error);
  }
}

// Helper to get all profiles from localStorage
function getAllProfiles(): Map<string, MockProfile> {
  if (typeof window === 'undefined') return new Map();
  
  const stored = localStorage.getItem('mockProfiles');
  if (!stored) {
    // Create default guest profile if no profiles exist
    const guestProfile = createDefaultProfileObject('guest');
    const profiles = new Map([['guest', guestProfile]]);
    saveAllProfiles(profiles);
    return profiles;
  }
  
  try {
    const profiles = JSON.parse(stored);
    return new Map(Object.entries(profiles));
  } catch (error) {
    console.error('Error parsing mock profiles:', error);
    return new Map();
  }
}

// Helper to get a profile by wallet address
export async function getMockProfile(walletAddress: string): Promise<UserProfile | null> {
  try {
    if (!walletAddress) {
      return null;
    }

    const profiles = await getAllProfiles();
    return profiles.get(walletAddress) || null;
  } catch (err) {
    console.error('Error in getMockProfile:', err);
    return null;
  }
}

// Helper to save a profile
export function saveMockProfile(profile: MockProfile): void {
  const profiles = getAllProfiles();
  const existingProfile = profiles.get(profile.wallet_address);
  
  const updatedProfile = {
    ...profile,
    timepiece_url: profile.timepiece_url || existingProfile?.timepiece_url || '/images/timepiece-nft.png',
    updated_at: new Date().toISOString()
  };
  
  profiles.set(profile.wallet_address, updatedProfile);
  saveAllProfiles(profiles);
  
  // Force a re-render of components by dispatching a custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profileUpdated', { 
      detail: { walletAddress: profile.wallet_address }
    }));
  }
  
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[MOCK] Profile saved:', profile.wallet_address.substring(0, 8) + '...', {
      avatar: profile.avatar_url ? 'Set' : 'Not set',
      timepiece: profile.timepiece_url || existingProfile?.timepiece_url || '/images/timepiece-nft.png'
    });
  }
}

// Create a default profile for a wallet
export async function createDefaultProfile(walletAddress: string): Promise<UserProfile | null> {
  try {
    const timestamp = new Date().toISOString();
    const newProfile = {
      wallet_address: walletAddress,
      display_name: `User-${walletAddress.substring(0, 6)}`,
      title: 'EONIC Explorer',
      bio: '',
      wallet_tagline: '',
      avatar_url: '/images/avatars/default.svg',
      widget_list: ['display_name', 'timepiece', 'xp_level', 'nft_gallery'],
      is_public: true,
      timepiece_url: '/images/timepiece-nft.png',
      timepiece_stage: 'Genesis',
      timepiece_xp: 0,
      created_at: timestamp,
      updated_at: timestamp
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error in createDefaultProfile:', err);
    return null;
  }
}

// Default user metrics
export interface UserMetrics {
  level: number;
  currentXp: number;
  eonicBalance: number;
  referralCount: number;
  hasTimepiece: boolean;
  timepieceImageUrl: string;
  timepieceStage: string;
  nftXp: number;
} 