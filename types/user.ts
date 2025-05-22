export interface UserProfile {
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
  social_links: Record<string, string>;
  card_style: 'intern' | 'secretary' | 'management' | 'ceo' | 'paul_allen';
  show_business_card: boolean;
  timepiece_data: {
    stage: string;
    progress: number;
  };
  xp_level: number;
  xp_progress: number;
  holdings_data: {
    amount: number;
    value: string;
  };
  nft_data: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  theme: 'default' | 'quantum' | 'voidwalker' | 'golden';
  updated_at: string;
  created_at: string;
} 