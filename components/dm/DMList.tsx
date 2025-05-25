'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDM } from '../../context/DMContext';
import { DMPreviewCard } from './DMPreviewCard';
import { MessageCircle, ChevronLeft, ChevronRight, Plus, Search, Settings } from 'lucide-react';

interface DMListProps {
  className?: string;
}

export function DMList({ className }: DMListProps) {
  const { threads, activeThread, setActiveThread, isLoading } = useDM();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(thread =>
    thread.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.participantAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
  };

  return (
    <motion.div
      className={`
        flex flex-col bg-obsidian border-r border-marble-deep/30 h-full
        ${isCollapsed ? 'w-16' : 'w-80'}
        transition-all duration-300 ease-out
        ${className}
      `}
      layout
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-marble-deep/30">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5 text-egyptian-glow" />
              <h2 className="text-white font-semibold text-lg">Messages</h2>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleCollapse}
          className="p-2 rounded-lg bg-marble-deep/20 hover:bg-marble-deep/40 text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-marble-deep/30"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-marble-deep/20 border border-marble-deep/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-egyptian-glow/50 focus:ring-1 focus:ring-egyptian-glow/30 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-marble-deep/30"
          >
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center space-x-2 p-2 bg-egyptian-base/20 hover:bg-egyptian-base/30 border border-egyptian-glow/30 hover:border-egyptian-glow/50 rounded-lg text-egyptian-glow hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New DM</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-marble-deep/20 hover:bg-marble-deep/40 border border-marble-deep/50 hover:border-gray-400 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DM List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              <div className="w-8 h-8 border-2 border-egyptian-glow border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : filteredThreads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              {!isCollapsed && (
                <>
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-gray-400 font-medium mb-2">
                    {searchQuery ? 'No conversations found' : 'No messages yet'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery 
                      ? 'Try a different search term'
                      : 'Start a conversation with someone to see it here'
                    }
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            filteredThreads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <DMPreviewCard
                  thread={thread}
                  isActive={activeThread === thread.id}
                  isCollapsed={isCollapsed}
                  onClick={() => handleThreadClick(thread.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-marble-deep/30">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-gray-500 text-xs">
                {filteredThreads.length} conversation{filteredThreads.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 