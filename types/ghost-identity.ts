export type GhostIdentityType = 'phone' | 'email';
export type GhostIdentityStatus = 'active' | 'expired' | 'revoked';

export interface GhostIdentity {
  id: string;
  user_id: string;
  type: GhostIdentityType;
  value: string;
  created_at: string;
  expires_at: string;
  status: GhostIdentityStatus;
  notes?: string;
}

export interface GhostIdentityCardProps {
  type: GhostIdentityType;
  identity?: GhostIdentity;
  onRefresh: () => void;
}
