'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewModeToggle } from '../../components/ViewModeToggle';
import { getMockProfile, createDefaultProfile } from '../../utils/mock-data';

type ViewMode = 'web' | 'mobile';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Vault', href: '/dashboard/vault' },
  { name: 'Community', href: '/dashboard/community' },
  { name: 'EON-ID', href: '/dashboard/eon-id' },
  { name: 'VaultCord', href: '/vaultcord' },
  { name: 'Dev Vault', href: '/dev-hq/overview' },
];

const sidebarVariants = {
  expanded: {
    width: '240px',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  collapsed: {
    width: '0px',
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const ProfileSection = ({ walletAddress }: { walletAddress: string }) => {
  const [displayName, setDisplayName] = useState('Vault Member');
  const [avatarUrl, setAvatarUrl] = useState('/images/avatars/default.svg');
  const [refreshKey, setRefreshKey] = useState(0);
  const pathname = usePathname() || '';
  const isOnDashboard = pathname === '/dashboard';
  
  // Define updateProfileData with useCallback to prevent infinite loops
  const updateProfileData = useCallback(async () => {
    try {
      // Get profile data from mock storage
      const profile = await getMockProfile(walletAddress);
      
      if (profile && (profile.display_name !== displayName || profile.avatar_url !== avatarUrl)) {
        console.log('[MOCK] Profile section updating with new data:', {
          oldName: displayName,
          newName: profile.display_name,
          oldAvatar: avatarUrl ? 'Set' : 'Not set',
          newAvatar: profile.avatar_url ? 'Set' : 'Not set'
        });
        
        setDisplayName(profile.display_name || 'Vault Member');
        setAvatarUrl(profile.avatar_url || '/images/avatars/default.svg');
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  }, [walletAddress, displayName, avatarUrl]);
  
  // Check for profile updates on mount and when wallet changes
  useEffect(() => {
    updateProfileData();
    
    // Set up periodic checking for profile updates
    const intervalId = setInterval(() => {
      updateProfileData();
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [walletAddress, updateProfileData]);

  // Also update when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      updateProfileData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [updateProfileData]);
  
  return (
    <Link href="/dashboard">
      <div className="px-4 py-4 flex items-center space-x-3 cursor-pointer group relative">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/50 group-hover:border-indigo-400 transition-all">
            <div className="w-full h-full bg-indigo-900/50">
              <Image 
                key={refreshKey}
                src={avatarUrl || '/images/avatars/default.svg'}
                alt={displayName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1E1E2F]" />
        </div>
        
        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{displayName}</p>
          <p className="text-xs text-indigo-400">Level 3</p>
        </div>
        
        {/* Welcome message that appears only on the dashboard */}
        {isOnDashboard && (
          <div className="absolute left-full ml-6 whitespace-nowrap bg-[#1E1E2F]/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-indigo-500/20">
            <p className="text-white font-medium">Welcome Back, {displayName}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link href={href}>
      <motion.div
        className={`relative px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {/* Glowing background for active state */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-900/90 rounded-xl"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Glowing border for active state */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-50 blur-sm" />
        )}
      </motion.div>
    </Link>
  </motion.div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected, publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';
  const router = useRouter();
  const pathname = usePathname() || '';
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('web');

  useEffect(() => {
    console.log('💼 Dashboard Layout - Initial wallet state:', { connected, publicKey: publicKey?.toString() });
    
    // Clear the hyperspeed animation completion flag when dashboard loads
    // so it doesn't interfere with regular navigation
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hyperspeedAnimationCompleted');
    }
    
    // ***TEMPORARILY DISABLED REDIRECT FOR TESTING***
    // No more redirects back to login to avoid loops
    // This lets us access the dashboard directly without wallet connection
    
    console.log('💼 Dashboard access allowed without wallet to prevent loops.');
    
    /* Original code - temporarily disabled
    if (!connected && 
        !localStorage.getItem('preventLoginRedirect') && 
        pathname !== '/login') {
      
      console.log('💼 Wallet not connected, redirecting to login');
      
      // Set a flag to prevent immediate redirect back if user manually navigates to dashboard
      localStorage.setItem('preventLoginRedirect', 'true');
      
      // Clear the flag after a reasonable time
      setTimeout(() => {
        localStorage.removeItem('preventLoginRedirect');
      }, 5000);
      
      router.push('/login');
    } else {
      console.log('💼 Wallet connection status:', connected ? 'Connected' : 'Not connected, but redirect prevention active');
    }
    */
  }, [connected, router, publicKey, pathname]);

  const isOnDashboard = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* View Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ViewModeToggle onViewModeChange={setViewMode} />
      </div>

      {/* Sidebar Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800/80 backdrop-blur-sm rounded-xl text-gray-400 hover:text-white md:hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isExpanded ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Sidebar */}
      <motion.nav
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full bg-[#1E1E2F]/80 backdrop-blur-md overflow-hidden z-40 border-r border-white/5"
      >
        <div className="flex flex-col h-full">
          <div className="h-14" /> {/* Spacer for toggle button */}
          
          {/* Profile Section */}
          <ProfileSection walletAddress={walletAddress} />
          
          {/* Navigation Links */}
          <div className="p-4 space-y-2 mt-4 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isExpanded ? 'md:pl-[240px]' : ''
        }`}
      >
        <div className={`mx-auto transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'}`}>
          <div className="p-6">
            <div className="mt-12">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}


