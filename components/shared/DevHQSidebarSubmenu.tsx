// DevHQ Sidebar Submenu – Nested layout toggle for DevHQ navigation

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Code, History, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevHQSidebarSubmenuProps {
  sidebarOpen: boolean;
}

const DevHQSidebarSubmenu: React.FC<DevHQSidebarSubmenuProps> = ({ sidebarOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Collapse submenu when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      setExpanded(false);
    }
  }, [sidebarOpen]);

  const subPages = [
    { label: 'Chat', href: '/dev-hq/chat', icon: MessageSquare },
    { label: 'Logs', href: '/dev-hq/logs', icon: History },
    { label: 'Components', href: '/dev-hq/components', icon: Code },
    { label: 'Voice Lounge', href: '/dev-hq/voice', icon: Volume2 },
  ];

  const handleClick = () => {
    if (sidebarOpen) {
      setExpanded(!expanded);
    } else {
      // Navigate to main DevHQ page when sidebar is collapsed
      window.location.href = '/dev-hq/chat';
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center w-full gap-2 px-3 py-2 rounded-md hover:bg-muted/40 transition-colors text-sm font-medium text-muted-foreground',
          expanded && sidebarOpen && 'bg-muted text-glow'
        )}
      >
        <LayoutDashboard size={18} className="min-w-[18px]" />
        {sidebarOpen && (
          <>
            <span className="hidden md:inline-block">DevHQ</span>
            {expanded ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
          </>
        )}
      </button>

      {expanded && sidebarOpen && (
        <div className="ml-6 space-y-1 animate-fade-in">
          {subPages.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/30 hover:text-glow transition-all',
                pathname === href && 'bg-muted text-glow'
              )}>
                <Icon size={16} />
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevHQSidebarSubmenu;

// ✅ Drop this into your VaultSidebarLayout nav section in place of the original 'DevHQ' link
// 🔁 Expands into sub-routes (Chat, Logs, Components, Voice Lounge) with animation 