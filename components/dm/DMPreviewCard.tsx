'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DMThread } from '../../context/DMContext';
import { MessageCircle, Clock, Zap } from 'lucide-react';

interface DMPreviewCardProps {
  thread: DMThread;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export function DMPreviewCard({ thread, isActive, isCollapsed, onClick }: DMPreviewCardProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getTimepieceColor = (timepiece?: string) => {
    switch (timepiece) {
      case 'quantum': return 'text-quantum-primary';
      case 'voidwalker': return 'text-voidwalker-primary';
      case 'golden': return 'text-golden-primary';
      case 'active': return 'text-egyptian-glow';
      case 'restricted': return 'text-aether';
      default: return 'text-gray-400';
    }
  };

  const getStatusIndicator = () => {
    if (thread.isOnline) {
      return (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-obsidian animate-pulse" />
      );
    }
    return null;
  };

  if (isCollapsed) {
    return (
      <motion.div
        onClick={onClick}
        className={`
          relative group cursor-pointer p-3 mb-2 rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-egyptian-base/30 border border-egyptian-glow/50 shadow-glow-blue' 
            : 'bg-marble-deep/20 hover:bg-marble-deep/40 border border-transparent hover:border-egyptian-glow/30'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Profile Picture */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {thread.participantName?.charAt(0) || '?'}
          </span>
          {getStatusIndicator()}
        </div>

        {/* Unread Count Badge */}
        {thread.unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-aether rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
            </span>
          </motion.div>
        )}

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-obsidian border border-egyptian-glow/30 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          <div className="text-white text-sm font-medium">{thread.participantName}</div>
          {thread.lastMessage && (
            <div className="text-gray-400 text-xs">
              {thread.lastMessage.content.slice(0, 30)}
              {thread.lastMessage.content.length > 30 ? '...' : ''}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className={`
        group cursor-pointer p-4 mb-2 rounded-lg transition-all duration-300
        ${isActive 
          ? 'bg-egyptian-base/30 border border-egyptian-glow/50 shadow-glow-blue' 
          : 'bg-marble-deep/20 hover:bg-marble-deep/40 border border-transparent hover:border-egyptian-glow/30'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-start space-x-3">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-egyptian-base to-egyptian-glow flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {thread.participantName?.charAt(0) || '?'}
            </span>
          </div>
          {getStatusIndicator()}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium text-sm truncate">
                {thread.participantName}
              </h3>
              <Zap className={`w-3 h-3 ${getTimepieceColor('active')}`} />
            </div>
            
            <div className="flex items-center space-x-1">
              {thread.lastMessage && (
                <span className="text-gray-500 text-xs">
                  {formatTime(thread.lastMessage.timestamp)}
                </span>
              )}
              {thread.unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-aether rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">
                    {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Last Message */}
          {thread.lastMessage ? (
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-xs">
                {thread.lastMessage.sender === 'You' ? 'You: ' : ''}
              </span>
              <p className="text-gray-300 text-xs truncate">
                {thread.lastMessage.content}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="w-3 h-3" />
              <span className="text-xs">Start a conversation</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Thread Glow Effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-egyptian-glow/10 via-transparent to-egyptian-glow/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
} 