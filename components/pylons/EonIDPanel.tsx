'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles } from 'lucide-react';

interface Profile {
  id: string;
  displayName?: string;
  username?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  domain?: string;
  wallet_domain?: string;
  vaultskin?: string;
  level?: number;
  xp?: number;
  xpMax?: number;
  role?: string;
  // Social media fields
  twitter?: string;
  github?: string;
  discord?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  // Legacy socials object (for backwards compatibility)
  socials?: {
    twitter?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
}

interface TooltipState {
  visible: boolean;
  content: { title: string; description: string } | null;
  position: { x: number; y: number };
}

export default function EonIDPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState({
    balance: 123456,
    staked: 42000,
    locked: 18500,
    platformLocked: 980500,
    apy: 12.5,
    valueUSD: 4296.75,
    change24h: 8.7,
  });
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    position: { x: 0, y: 0 }
  });

  // Badge information mapping
  const badgeInfo: Record<string, { title: string; description: string }> = {
    'badge1.png': {
      title: 'Welcome to EONIC',
      description: 'First steps into the EONIC ecosystem'
    },
    'badge2.png': {
      title: 'Rising Star',
      description: 'Reached Level 5 - showing consistent growth'
    },
    'badge3.png': {
      title: 'XP Collector',
      description: 'Earned 500+ experience points'
    },
    'badge4.png': {
      title: 'Social Connector',
      description: 'Connected social media accounts'
    },
    'badge5.png': {
      title: 'Domain Owner',
      description: 'Claimed a personalized .sol domain'
    },
    'badge6.png': {
      title: 'Staking Champion',
      description: 'Staked over 10,000 $EONIC tokens'
    },
    'badge-admin.gif': {
      title: 'EONIC Administrator',
      description: 'Core team member with special privileges'
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('🔍 EonIDPanel: Starting profile fetch...');
        
        // Validate Supabase session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        console.log('👤 EonIDPanel: Session data:', session);
        console.log('❌ EonIDPanel: Session error:', sessionError);
        
        if (sessionError) {
          console.error('💥 EonIDPanel: Session error:', sessionError);
          setSessionValid(false);
        }
        
        const userId = session?.session?.user?.id;
        console.log('🆔 EonIDPanel: User ID:', userId);
        
        if (userId) {
          setSessionValid(true);
          
          // Fetch profile data from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              id,
              displayName,
              username,
              title,
              bio,
              avatar,
              domain,
              wallet_domain,
              vaultskin,
              level,
              xp,
              xpMax,
              role,
              twitter,
              github,
              discord,
              linkedin,
              instagram,
              website,
              socials
            `)
            .eq('id', userId)
            .single();
          
          console.log('📋 EonIDPanel: Raw profile data:', data);
          console.log('❌ EonIDPanel: Fetch error:', error);
          
          if (error) {
            if (error.code === 'PGRST116') {
              console.log('⚠️ EonIDPanel: No profile found for user');
            } else {
              console.error('💥 EonIDPanel: Database error:', error);
            }
          } else if (data) {
            console.log('✅ EonIDPanel: Setting profile data:', data);
            setProfile(data);
          }
        } else {
          // Demo mode: Load from localStorage
          console.log('🎭 EonIDPanel: Demo mode - checking localStorage...');
          const demoProfile = localStorage.getItem('eonic-demo-profile');
          
          if (demoProfile) {
            try {
              const parsedProfile = JSON.parse(demoProfile);
              console.log('✅ EonIDPanel: Demo profile loaded from localStorage:', parsedProfile);
              setProfile(parsedProfile);
              setSessionValid(true); // Allow demo mode to show profile
            } catch (parseError) {
              console.error('💥 EonIDPanel: Error parsing demo profile:', parseError);
              setSessionValid(false);
            }
          } else {
            console.log('⚠️ EonIDPanel: No demo profile found in localStorage');
            setSessionValid(false);
          }
        }
      } catch (error) {
        console.error('💥 EonIDPanel: Error in fetchProfile:', error);
        setSessionValid(false);
      } finally {
        console.log('🏁 EonIDPanel: Fetch complete, setting loading to false');
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchProfile();
  }, []);

  // Get social links from either direct fields or legacy socials object
  const getSocialLink = (platform: string): string | undefined => {
    return profile?.[platform as keyof Profile] as string || profile?.socials?.[platform as keyof typeof profile.socials];
  };

  // Generate username if not set
  const displayUsername = profile?.username || 
    (profile?.displayName ? profile.displayName.toLowerCase().replace(/\s+/g, '_') : 'user');

  // Get domain with fallback
  const displayDomain = profile?.domain || profile?.wallet_domain || 'unclaimed';

  // Calculate XP percentage
  const xpPercentage = Math.min(((profile?.xp || 0) / (profile?.xpMax || 1000)) * 100, 100);

  // Badge system - determine which badges to show based on profile data
  const getBadges = () => {
    const badges = [];
    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    
    // Badge logic based on achievements
    if (level >= 1) badges.push('badge1.png'); // Welcome badge
    if (level >= 5) badges.push('badge2.png'); // Level 5 achievement
    if (xp >= 500) badges.push('badge3.png'); // XP milestone
    if (getSocialLink('twitter') || getSocialLink('github')) badges.push('badge4.png'); // Social connector
    if (profile?.domain && profile.domain !== 'unclaimed') badges.push('badge5.png'); // Domain owner
    if (token.staked > 10000) badges.push('badge6.png'); // Staking champion
    
    // Admin badge (animated)
    if (profile?.role === 'Admin') {
      badges.push('badge-admin.gif');
    }
    
    return badges;
  };

  // Tooltip handlers
  const showTooltip = (badge: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const info = badgeInfo[badge];
    
    if (info) {
      setTooltip({
        visible: true,
        content: info,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        }
      });
    }
  };

  const hideTooltip = () => {
    setTooltip({
      visible: false,
      content: null,
      position: { x: 0, y: 0 }
    });
  };

  // Badge component with tooltip
  const BadgeWithTooltip = ({ badge, index }: { badge: string; index: number }) => (
    <div className="relative">
      <img
        src={`/badges/${badge}`}
        alt={`Achievement Badge ${index + 1}`}
        className={`h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer ${
          badge === 'badge-admin.gif' ? 'animate-pulse shadow-yellow-400/50 ring-2 ring-yellow-400/30' : ''
        }`}
        onMouseEnter={(e) => showTooltip(badge, e)}
        onMouseLeave={hideTooltip}
        onClick={(e) => showTooltip(badge, e)}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );

  // Show default/demo content if no profile
  if (!sessionValid || !profile) {
    return (
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-gradient-to-br from-[#151522] to-[#1d1d28] rounded-2xl p-6 border border-[#9b84ff] shadow-[0_0_20px_#7B61FF]/30 text-white relative">
        {/* EON-ID Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
          <div className="relative">
            <img
              src="/images/vault-logo.png"
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-[#7B61FF] shadow-[0_0_20px_#7B61FF]"
            />
            <div className="absolute bottom-0 right-0 px-2 py-1 text-xs rounded-full bg-emerald-500 text-white">
              LVL 1
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">Welcome to EONIC Vault</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-400">@new_user</span>
              <span className="text-xs px-2 py-1 bg-[#2b2b45] rounded-full text-purple-300">
                Builder
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">unclaimed.sol</p>

            <div className="mt-3">
              <div className="text-xs mb-1 text-gray-400">XP Progress</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">
                0 / 1000 (0%)
              </div>
            </div>

            {/* Default Badges */}
            <div className="mt-2 flex flex-wrap gap-2">
              <BadgeWithTooltip badge="badge1.png" index={0} />
            </div>
          </div>
        </div>

        {/* Token Overview Block */}
        <div className="flex-1 mt-2 md:mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#f5caff] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-400" /> $EONIC Portfolio
            </h2>
            <span className="text-xs bg-[#2b2b45] text-fuchsia-300 px-3 py-1 rounded-full">Demo</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-400">Total Holdings</p>
              <p className="text-yellow-300 font-semibold text-lg">{loading ? <span className="animate-pulse bg-yellow-300/20 h-5 w-24 rounded block" /> : `${token.balance.toLocaleString()} EONIC`}</p>
            </div>
            <div>
              <p className="text-gray-400">Staked</p>
              <p className="text-cyan-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-cyan-400/20 h-5 w-20 rounded block" /> : `${token.staked.toLocaleString()} EONIC`}</p>
            </div>
            <div>
              <p className="text-gray-400">Locked</p>
              <p className="text-emerald-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-emerald-400/20 h-5 w-20 rounded block" /> : `${token.locked.toLocaleString()} EONIC`}</p>
            </div>
            <div>
              <p className="text-gray-400">Platform Total</p>
              <p className="text-pink-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-pink-400/20 h-5 w-24 rounded block" /> : `${token.platformLocked.toLocaleString()} EONIC`}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <p className="text-gray-400">Portfolio Value</p>
            <p className="text-green-400 font-bold text-lg">${token.valueUSD.toLocaleString()} (+{token.change24h}% 24h)</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <a href="https://app.streamflow.finance?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" className="flex-1">
              <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-2 px-4 rounded-xl shadow-md transition-all">
                Stake $EONIC
              </button>
            </a>
            <a href="https://token.clock.so/lock?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" className="flex-1">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all">
                Lock $EONIC
              </button>
            </a>
          </div>

          <div className="mt-4 flex justify-between gap-2 text-xs">
            <span className="bg-green-800/30 text-green-300 px-3 py-1 rounded-full font-semibold">APY: {token.apy}%</span>
            <span className="bg-purple-800/30 text-purple-300 px-3 py-1 rounded-full font-semibold">Lock Rewards: 25%</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && tooltip.content && (
          <div
            className="fixed z-50 bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-lg p-3 shadow-lg shadow-purple-500/25 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: tooltip.position.x,
              top: tooltip.position.y,
            }}
          >
            <div className="text-sm font-semibold text-purple-300 mb-1">
              {tooltip.content.title}
            </div>
            <div className="text-xs text-gray-300 max-w-48">
              {tooltip.content.description}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500/50"></div>
          </div>
        )}
      </div>
    );
  }

  const badges = getBadges();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 bg-gradient-to-br from-[#151522] to-[#1d1d28] rounded-2xl p-6 border border-[#9b84ff] shadow-[0_0_20px_#7B61FF]/30 text-white relative">
      {/* EON-ID Block */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
        <div className="relative">
          <img
            src={profile.avatar || '/images/vault-logo.png'}
            alt="avatar"
            className={`w-28 h-28 rounded-full border-4 shadow-[0_0_20px_#7B61FF] object-cover ${(profile.xp || 0) > (profile.xpMax || 1000) * 0.8 ? 'border-emerald-400 animate-pulse' : 'border-[#7B61FF]'}`}
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              (e.target as HTMLImageElement).src = '/images/vault-logo.png';
            }}
          />
          <div className="absolute bottom-0 right-0 px-2 py-1 text-xs rounded-full bg-emerald-500 text-white">
            LVL {profile.level || 1}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.displayName || 'EONIC User'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-emerald-400">@{displayUsername}</span>
            <span className="text-xs px-2 py-1 bg-[#2b2b45] rounded-full text-purple-300">
              {profile.title || 'Builder'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{displayDomain}.sol</p>

          <div className="flex gap-3 mt-2">
            {getSocialLink('twitter') && (
              <a 
                href={`https://twitter.com/${getSocialLink('twitter')?.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                🐦
              </a>
            )}
            {getSocialLink('github') && (
              <a 
                href={getSocialLink('github')?.startsWith('http') ? getSocialLink('github') : `https://github.com/${getSocialLink('github')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                💻
              </a>
            )}
            {getSocialLink('discord') && (
              <span className="text-indigo-400">💬</span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-xs mb-1 text-gray-400">XP Progress</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">
              {profile.xp || 0} / {profile.xpMax || 1000} ({Math.round(xpPercentage)}%)
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <BadgeWithTooltip key={badge} badge={badge} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Token Overview Block */}
      <div className="flex-1 mt-2 md:mt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#f5caff] flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" /> $EONIC Portfolio
          </h2>
          <span className="text-xs bg-[#2b2b45] text-fuchsia-300 px-3 py-1 rounded-full">Live</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400">Total Holdings</p>
            <p className="text-yellow-300 font-semibold text-lg">{loading ? <span className="animate-pulse bg-yellow-300/20 h-5 w-24 rounded block" /> : `${token.balance.toLocaleString()} EONIC`}</p>
          </div>
          <div>
            <p className="text-gray-400">Staked</p>
            <p className="text-cyan-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-cyan-400/20 h-5 w-20 rounded block" /> : `${token.staked.toLocaleString()} EONIC`}</p>
          </div>
          <div>
            <p className="text-gray-400">Locked</p>
            <p className="text-emerald-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-emerald-400/20 h-5 w-20 rounded block" /> : `${token.locked.toLocaleString()} EONIC`}</p>
          </div>
          <div>
            <p className="text-gray-400">Platform Total</p>
            <p className="text-pink-400 font-semibold text-lg">{loading ? <span className="animate-pulse bg-pink-400/20 h-5 w-24 rounded block" /> : `${token.platformLocked.toLocaleString()} EONIC`}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <p className="text-gray-400">Portfolio Value</p>
          <p className="text-green-400 font-bold text-lg">${token.valueUSD.toLocaleString()} (+{token.change24h}% 24h)</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <a href="https://app.streamflow.finance?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" className="flex-1">
            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-2 px-4 rounded-xl shadow-md transition-all">
              Stake $EONIC
            </button>
          </a>
          <a href="https://token.clock.so/lock?token=HyDAnhcj7Er5qVHireifnezrSxhYaauFrDNa82nTpump" target="_blank" className="flex-1">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all">
              Lock $EONIC
            </button>
          </a>
        </div>

        <div className="mt-4 flex justify-between gap-2 text-xs">
          <span className="bg-green-800/30 text-green-300 px-3 py-1 rounded-full font-semibold">APY: {token.apy}%</span>
          <span className="bg-purple-800/30 text-purple-300 px-3 py-1 rounded-full font-semibold">Lock Rewards: 25%</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          className="fixed z-50 bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-lg p-3 shadow-lg shadow-purple-500/25 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.position.x,
            top: tooltip.position.y,
          }}
        >
          <div className="text-sm font-semibold text-purple-300 mb-1">
            {tooltip.content.title}
          </div>
          <div className="text-xs text-gray-300 max-w-48">
            {tooltip.content.description}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500/50"></div>
        </div>
      )}
    </div>
  );
} 