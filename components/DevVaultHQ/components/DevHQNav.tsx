'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBox, FiFileText, FiSettings, FiMessageCircle } from 'react-icons/fi';

const navItems = [
  {
    label: 'Overview',
    href: '/dev-hq/overview',
    icon: FiHome
  },
  {
    label: 'Chat',
    href: '/dev-hq/chat',
    icon: FiMessageCircle
  },
  {
    label: 'Components',
    href: '/dev-hq/components',
    icon: FiBox
  },
  {
    label: 'Logs',
    href: '/dev-hq/logs',
    icon: FiFileText
  },
  {
    label: 'Settings',
    href: '/dev-hq/settings',
    icon: FiSettings
  }
];

export default function DevHQNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-blue-900/30 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-8">EONIC Dev HQ</h2>
      </div>
      
      <div className="px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-900/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Development Mode Indicator */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-yellow-900/20 text-yellow-400 text-xs rounded-lg p-2 text-center">
          Development Mode Active
        </div>
      </div>
    </nav>
  );
} 