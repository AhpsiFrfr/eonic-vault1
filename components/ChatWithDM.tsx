'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDM } from '../context/DMContext';
import { useWallet } from '@solana/wallet-adapter-react';
import Chat from './Chat';
import { DMTab } from './dm/DMTab';
import { MessageCircle, Hash, Users, ChevronLeft } from 'lucide-react';

interface ChatWithDMProps {
  room?: string;
  parentId?: string;
  className?: string;
  showDMTab?: boolean;
  defaultMode?: 'chat' | 'dm';
}

export function ChatWithDM({ 
  room = 'general', 
  parentId, 
  className = '',
  showDMTab = true,
  defaultMode = 'chat'
}: ChatWithDMProps) {
  const { publicKey } = useWallet();
  const [mode, setMode] = useState<'chat' | 'dm'>(defaultMode);
  const [activeDMThread, setActiveDMThread] = useState<string | null>(null);
  const [dmRecipientAddress, setDmRecipientAddress] = useState<string | null>(null);
  const [isDMTabCollapsed, setIsDMTabCollapsed] = useState(false);

  const handleSelectDM = useCallback((threadId: string, participantAddress: string) => {
    setActiveDMThread(threadId);
    setDmRecipientAddress(participantAddress);
    setMode('dm');
  }, []);

  const handleBackToChat = useCallback(() => {
    setMode('chat');
    setActiveDMThread(null);
    setDmRecipientAddress(null);
  }, []);

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mode Toggle Header */}
        <div className="flex items-center justify-between p-3 bg-marble-deep/10 border-b border-marble-deep/30">
          <div className="flex items-center space-x-4">
            {/* Mode Indicator */}
            <div className="flex items-center space-x-2">
              {mode === 'dm' ? (
                <>
                  <MessageCircle className="w-4 h-4 text-egyptian-glow" />
                  <span className="text-white font-medium text-sm">
                    Direct Message
                    {dmRecipientAddress && (
                      <span className="text-gray-400 ml-2">
                        {dmRecipientAddress.slice(0, 8)}...
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 text-egyptian-glow" />
                  <span className="text-white font-medium text-sm">#{room}</span>
                </>
              )}
            </div>

            {/* Back Button for DM Mode */}
            {mode === 'dm' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToChat}
                className="flex items-center space-x-1 px-2 py-1 bg-marble-deep/20 hover:bg-marble-deep/40 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Back to Chat</span>
              </motion.button>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('chat')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'chat'
                  ? 'bg-egyptian-base/30 text-egyptian-glow border border-egyptian-glow/30'
                  : 'bg-marble-deep/20 text-gray-400 hover:text-white hover:bg-marble-deep/40'
              }`}
            >
              <Hash className="w-3 h-3" />
              <span>Chat</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('dm')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'dm'
                  ? 'bg-egyptian-base/30 text-egyptian-glow border border-egyptian-glow/30'
                  : 'bg-marble-deep/20 text-gray-400 hover:text-white hover:bg-marble-deep/40'
              }`}
            >
              <MessageCircle className="w-3 h-3" />
              <span>DMs</span>
            </motion.button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {mode === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Chat 
                  room={room} 
                  parentId={parentId}
                  isDM={false}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {dmRecipientAddress ? (
                  <Chat 
                    room={activeDMThread || 'dm'}
                    isDM={true}
                    recipientAddress={dmRecipientAddress}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-obsidian">
                    <div className="text-center max-w-md">
                      <MessageCircle className="w-16 h-16 text-egyptian-glow mx-auto mb-4" />
                      <h3 className="text-white text-xl font-bold mb-2">Select a conversation</h3>
                      <p className="text-gray-400">
                        Choose a direct message from the sidebar or start a new conversation.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DM Sidebar */}
      {showDMTab && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: mode === 'dm' ? 320 : 280, 
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
          className="border-l border-marble-deep/30 bg-obsidian overflow-hidden"
        >
          <DMTab
            isCollapsed={isDMTabCollapsed}
            onToggleCollapse={() => setIsDMTabCollapsed(!isDMTabCollapsed)}
            onSelectDM={handleSelectDM}
            className="h-full border-none rounded-none"
          />
        </motion.div>
      )}
    </div>
  );
} 