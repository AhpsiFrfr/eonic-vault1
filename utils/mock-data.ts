// Mock data storage for development
// This allows us to share mock profile data across components

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
}

// Global storage for mock profiles
export const mockProfiles = new Map<string, MockProfile>();

// Helper to get a profile by wallet address
export function getMockProfile(walletAddress: string): MockProfile | null {
  return mockProfiles.get(walletAddress) || null;
}

// Helper to save a profile
export function saveMockProfile(profile: MockProfile): void {
  const existingProfile = mockProfiles.get(profile.wallet_address);
  
  mockProfiles.set(profile.wallet_address, {
    ...profile,
    timepiece_url: profile.timepiece_url || existingProfile?.timepiece_url || '/timepiece-nft.png',
    updated_at: new Date().toISOString()
  });
  
  console.log('[MOCK] Profile saved:', profile.wallet_address.substring(0, 8) + '...', {
    avatar: profile.avatar_url ? 'Set' : 'Not set',
    timepiece: profile.timepiece_url || existingProfile?.timepiece_url || '/timepiece-nft.png'
  });
}

// Create a default profile for a wallet
export function createDefaultProfile(walletAddress: string): MockProfile {
  const profile: MockProfile = {
    id: `mock-${Date.now()}`,
    wallet_address: walletAddress,
    display_name: 'Bussynfrfr',
    title: 'EONIC DEV',
    bio: '',
    avatar_url: '/default-avatar.png',
    timepiece_url: '/timepiece-nft.png',
    use_shortened_wallet: false,
    tagline: '',
    domain: '',
    show_real_name: false,
    allow_non_mutual_dms: true,
    show_holdings: true,
    is_public: true,
    social_links: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockProfiles.set(walletAddress, profile);
  return profile;
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