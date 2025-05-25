// VaultSidebarLayout.tsx – Smart Sidebar with toggle, tooltip, animation, persistence, auto-collapse, and footer link

'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import DevHQSidebarSubmenu from './DevHQSidebarSubmenu';
import { playClickSound } from '../../app/components/dashboard/VaultSFX';
import {
  Home, Bot, Settings, User, MessageSquare, LayoutDashboard, CornerDownLeft, Users, Hash
} from 'lucide-react';

// Simple Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, side = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${sideClasses[side]}`}>
          <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded-md whitespace-nowrap border border-gray-700 shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Vault', icon: LayoutDashboard, href: '/dashboard/vault' },
  { label: 'Community', icon: Users, href: '/dashboard/community' },
  { label: 'VaultCord', icon: MessageSquare, href: '/vaultcord' },
  { label: 'EON-ID', icon: User, href: '/dashboard/eon-id' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

interface VaultSidebarLayoutProps {
  children: React.ReactNode;
}

const VaultSidebarLayout: React.FC<VaultSidebarLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vault-sidebar-open');
    if (stored !== null) setOpen(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vault-sidebar-open', String(open));
  }, [open]);

  // Auto-collapse on scroll down (optional)
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) setOpen(false);
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    playClickSound();
    setOpen(!open);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <aside className={cn(
        "bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white border-r border-gray-700/50 px-3 py-6 space-y-6 fixed z-40 left-0 top-0 bottom-0 transition-all duration-300 ease-in-out flex flex-col justify-between",
        open ? "w-[240px]" : "w-[72px]"
      )}>
        <div>
          {/* Vault Logo/Toggle */}
          <div className="flex justify-center px-1 mb-6">
            <Tooltip content={open ? 'Collapse Menu' : 'Expand Menu'}>
              <button 
                onClick={handleToggle} 
                className="transition-transform duration-300 hover:scale-105 group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-shadow border border-yellow-400/50">
                  <Image
                    src="/images/vault-logo.png"
                    alt="Eonic Vault Logo"
                    width={42}
                    height={42}
                    className="rounded-full"
                  />
                </div>
              </button>
            </Tooltip>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.slice(0, 3).map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Tooltip key={href} content={!open ? label : ''}>
                  <Link href={href}>
                    <div className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    )}>
                      <Icon size={20} className="min-w-[20px] group-hover:scale-110 transition-transform" />
                      {open && (
                        <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                          {label}
                        </span>
                      )}
                    </div>
                  </Link>
                </Tooltip>
              );
            })}
            
            {/* DevHQ Submenu */}
            <DevHQSidebarSubmenu sidebarOpen={open} />
            
            {navItems.slice(3).map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Tooltip key={href} content={!open ? label : ''}>
                  <Link href={href}>
                    <div className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    )}>
                      <Icon size={20} className="min-w-[20px] group-hover:scale-110 transition-transform" />
                      {open && (
                        <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                          {label}
                        </span>
                      )}
                    </div>
                  </Link>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* Footer: Return to Dashboard */}
        <div className="pb-2">
          <Tooltip content={!open ? 'Return to Dashboard' : ''}>
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-cyan-300 hover:bg-gray-800/30 transition-all group">
                <CornerDownLeft size={18} className="min-w-[18px] group-hover:scale-110 transition-transform" />
                {open && (
                  <span className="text-sm font-medium">Return to Dashboard</span>
                )}
              </div>
            </Link>
          </Tooltip>
        </div>
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out", 
        open ? "ml-[240px]" : "ml-[72px]"
      )}> 
        {children}
      </main>
    </div>
  );
};

export default VaultSidebarLayout; 