'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDM } from '../../context/DMContext';
import { DMPreviewCard } from './DMPreviewCard';
import { StartDMButton } from '../shared/StartDMButton';
import { MessageCircle, Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface DMTabProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showHeader?: boolean;
  onSelectDM?: (threadId: string, participantAddress: string) => void;
}

export function DMTab({ 
  className = '', 
  isCollapsed = false, 
  onToggleCollapse,
  showHeader = true,
  onSelectDM
}: DMTabProps) {
  const { threads, activeThread, setActiveThread, isLoading } = useDM();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDMModal, setShowNewDMModal] = useState(false);

  const filteredThreads = threads.filter(thread =>
    thread.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.participantAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
    if (onSelectDM) {
      const participantAddress = threadId.replace('dm:', '').split(':')
        .find(addr => addr !== threadId.replace('dm:', '').split(':')[0]);
      if (participantAddress) {
        onSelectDM(threadId, participantAddress);
      }
    }
  };

  return (
    <div className={`bg-marble-deep/10 border border-marble-deep/30 rounded-lg ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-3 border-b border-marble-deep/30">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-egyptian-glow" />
            <h3 className="text-white font-medium text-sm">Direct Messages</h3>
            {threads.length > 0 && (
              <span className="bg-egyptian-base/20 text-egyptian-glow text-xs px-2 py-1 rounded-full">
                {threads.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNewDMModal(true)}
              className="p-1 rounded-lg bg-egyptian-base/20 hover:bg-egyptian-base/30 text-egyptian-glow transition-colors"
              title="Start new DM"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
            
            {onToggleCollapse && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleCollapse}
                className="p-1 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
              >
                {isCollapsed ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-marble-deep/30">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search DMs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-marble-deep/20 border border-marble-deep/50 rounded-lg pl-7 pr-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-egyptian-glow/50 focus:ring-1 focus:ring-egyptian-glow/30 transition-colors"
                />
              </div>
            </div>

            {/* DM List */}
            <div className="max-h-64 overflow-y-auto p-2">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8"
                  >
                    <div className="w-6 h-6 border-2 border-egyptian-glow border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                ) : filteredThreads.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-6"
                  >
                    <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      {searchQuery ? 'No DMs found' : 'No direct messages yet'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {searchQuery 
                        ? 'Try a different search term'
                        : 'Click + to start a conversation'
                      }
                    </p>
                  </motion.div>
                ) : (
                  filteredThreads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      layout
                      className="mb-1"
                    >
                      <DMPreviewCard
                        thread={thread}
                        isActive={activeThread === thread.id}
                        isCollapsed={false}
                        onClick={() => handleThreadClick(thread.id)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-marble-deep/30">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewDMModal(true)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-egyptian-base/20 hover:bg-egyptian-base/30 border border-egyptian-glow/30 hover:border-egyptian-glow/50 rounded-lg text-egyptian-glow hover:text-white text-xs font-medium transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>New Message</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New DM Modal */}
      <AnimatePresence>
        {showNewDMModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowNewDMModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-obsidian border border-egyptian-glow/30 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-lg mb-4">Start New Message</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter a wallet address to start a direct message conversation.
              </p>
              
              <input
                type="text"
                placeholder="Wallet address..."
                className="w-full bg-marble-deep/20 border border-marble-deep/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-egyptian-glow/50 focus:ring-1 focus:ring-egyptian-glow/30 transition-colors mb-4"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewDMModal(false)}
                  className="flex-1 py-2 px-4 bg-marble-deep/20 hover:bg-marble-deep/40 border border-marble-deep/50 rounded-lg text-gray-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewDMModal(false)}
                  className="flex-1 py-2 px-4 bg-egyptian-base hover:bg-egyptian-glow rounded-lg text-white font-medium transition-all"
                >
                  Start Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 