export interface EonIDData {
  displayName: string;
  title: string;
  xp: number;
  vaultDomain: string;
  pfpUrl?: string;
  level?: number;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
    discord?: string;
  };
} 