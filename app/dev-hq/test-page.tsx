'use client';

import React from 'react';
import { ChannelProvider } from '../../context/ChannelContext';
import { DevHQProvider } from '../../context/DevHQContext';
import { EnhancedChannelList } from '../../components/Sidebar/EnhancedChannelList';
import DevHQChat from '../../components/DevVaultHQ/components/DevHQChat';
import { LogoChannelManager } from '../../components/LogoChannelManager';

export default function DevHQTestPage() {
  return (
    <ChannelProvider>
      <DevHQProvider>
        <div className="flex h-screen bg-gray-900 text-white">
          {/* Left Sidebar */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Logo and Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative group">
                {/* Logo hover panel */}
                <LogoChannelManager 
                  logoSrc="/images/devhq-logo.svg"
                  logoAlt="DevHQ"
                  serverName="DevHQ [TEST]"
                />
              </div>
            </div>

            {/* Channel List */}
            <div className="flex-1 overflow-y-auto">
              <EnhancedChannelList />
            </div>

            {/* User Status */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">D</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Developer</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <DevHQChat />
          </div>
        </div>
      </DevHQProvider>
    </ChannelProvider>
  );
} 