'use client';

import React, { useState } from 'react';
import { useChannels } from '@/context/ChannelContext';
import { Channel, Category } from '@/types/channel';
import { VoiceRoom } from '@/app/vaultcord/components/VoiceRoom';
import { ChannelContextMenu, OverflowMenu } from '../ChannelContextMenu';
import { LogoChannelManager } from '../LogoChannelManager';
import { FiHash, FiVolume2, FiChevronDown, FiChevronRight, FiLock } from 'react-icons/fi';

interface EnhancedChannelListProps {
  showVoiceRooms?: boolean;
  serverName?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export function EnhancedChannelList({ 
  showVoiceRooms = true, 
  serverName = "EONIC Vault",
  logoSrc = "/images/eonic-vault-ship.png",
  logoAlt = "Server Logo"
}: EnhancedChannelListProps) {
  const {
    channels,
    categories,
    activeChannelId,
    activeVoiceChannelId,
    setActiveChannel,
    setActiveVoiceChannel,
    toggleCategoryCollapse
  } = useChannels();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target?: {
      type: 'channel' | 'category' | 'space';
      item?: Channel | Category;
    };
  } | null>(null);

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
  const uncategorizedChannels = channels.filter(c => !c.categoryId).sort((a, b) => a.position - b.position);

  const handleChannelClick = (channel: Channel) => {
    if (channel.type === 'text') {
      setActiveChannel(channel.id);
      // Clear voice channel if text channel is selected
      if (activeVoiceChannelId) {
        setActiveVoiceChannel(null);
      }
    } else {
      // Toggle voice channel
      setActiveVoiceChannel(activeVoiceChannelId === channel.id ? null : channel.id);
    }
  };

  const handleRightClick = (e: React.MouseEvent, target?: { type: 'channel' | 'category'; item: Channel | Category }) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: target || { type: 'space' }
    });
  };

  const handleContextMenuFromOverflow = (x: number, y: number, target: { type: 'channel' | 'category'; item: Channel | Category }) => {
    setContextMenu({ x, y, target });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const renderChannel = (channel: Channel) => (
    <div key={channel.id} className="group">
      <button
        onClick={() => handleChannelClick(channel)}
        onContextMenu={(e) => handleRightClick(e, { type: 'channel', item: channel })}
        className={`group relative flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-all hover:bg-white/5 ${
          (channel.type === 'text' ? activeChannelId === channel.id : activeVoiceChannelId === channel.id)
            ? 'bg-white/10 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        {channel.type === 'text' ? (
          <FiHash className="h-4 w-4" />
        ) : (
          <FiVolume2 className="h-4 w-4" />
        )}
        
        <span className="flex-1 truncate">{channel.name}</span>
        
        {channel.isLocked && (
          <FiLock className="h-3 w-3 text-gray-400" />
        )}
        
        {channel.unreadCount && channel.unreadCount > 0 && (
          <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
          </div>
        )}

        {/* Overflow Menu */}
        <OverflowMenu
          target={{ type: 'channel', item: channel }}
          onOpenContextMenu={handleContextMenuFromOverflow}
        />
      </button>
      
      {/* Voice Room Component for Active Voice Channels */}
      {showVoiceRooms && 
       channel.type === 'voice' && 
       activeVoiceChannelId === channel.id && (
        <div className="mt-2 ml-6">
          <VoiceRoom roomName={channel.id} />
        </div>
      )}
    </div>
  );

  const renderCategory = (category: Category) => {
    const categoryChannels = channels
      .filter(c => c.categoryId === category.id)
      .sort((a, b) => a.position - b.position);

    // Always show categories, even if empty
    return (
      <div key={category.id} className="mb-4">
        <button
          onClick={() => toggleCategoryCollapse(category.id)}
          onContextMenu={(e) => handleRightClick(e, { type: 'category', item: category })}
          className="mb-2 flex w-full items-center gap-1 px-2 text-xs font-semibold uppercase text-gray-400 hover:text-gray-300 transition-colors group"
        >
          {category.collapsed ? (
            <FiChevronRight className="h-3 w-3" />
          ) : (
            <FiChevronDown className="h-3 w-3" />
          )}
          <span className="flex-1 text-left">{category.name}</span>
          
          {/* Category Overflow Menu */}
          <OverflowMenu
            target={{ type: 'category', item: category }}
            onOpenContextMenu={handleContextMenuFromOverflow}
          />
        </button>
        
        {!category.collapsed && (
          <div className="space-y-0.5">
            {categoryChannels.length > 0 ? (
              categoryChannels.map(renderChannel)
            ) : (
              <div className="px-2 py-1 text-xs text-gray-500 italic">
                No channels yet - right-click to add
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="flex h-full w-full flex-col bg-[#2f3349]"
      onContextMenu={(e) => handleRightClick(e)}
    >
      {/* Logo-Based Header with Hover Manager */}
      <div className="border-b border-gray-600">
        <LogoChannelManager
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          serverName={serverName}
        />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Categorized Channels */}
        {sortedCategories.map(renderCategory)}
        
        {/* Uncategorized Channels */}
        {uncategorizedChannels.length > 0 && (
          <div className="mb-4">
            {categories.length > 0 && (
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400">
                Uncategorized
              </h3>
            )}
            <div className="space-y-0.5">
              {uncategorizedChannels.map(renderChannel)}
            </div>
          </div>
        )}

        {/* Empty State Help */}
        {channels.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
            <div className="text-gray-500 text-sm mb-2">No channels yet</div>
            <div className="text-gray-600 text-xs">
              Right-click to create channels and categories
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="flex h-14 items-center gap-3 border-t border-gray-600 px-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium text-white truncate">Username</span>
          <span className="text-xs text-gray-400">#1234</span>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          target={contextMenu.target}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
} 