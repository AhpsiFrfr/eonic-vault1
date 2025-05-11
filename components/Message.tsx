import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageContextMenu } from './MessageContextMenu';
import { useMessageReactions } from '../hooks/useMessageReactions';
import { useWallet } from '@solana/wallet-adapter-react';

interface MessageProps {
  message: {
    id: string;
    content: string;
    sender_address: string;
    created_at: string;
  };
}

export function Message({ message }: MessageProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { publicKey } = useWallet();
  const {
    reactions,
    isLoading,
    error,
    toggleReaction,
  } = useMessageReactions(message.id);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleReaction = async (reaction: string) => {
    if (!publicKey) return;
    
    try {
      await toggleReaction(reaction);
    } catch (error) {
      // Silently handle reaction errors
    }
  };

  return (
    <div className="group relative" onContextMenu={handleContextMenu}>
      {/* Message Content */}
      <div className="flex items-start space-x-2 p-4 hover:bg-gray-800/30 rounded-lg transition-colors duration-200">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-200">{message.sender_address}</span>
            <span className="text-xs text-gray-400">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-gray-300 mt-1">{message.content}</p>

          {/* Reactions */}
          {reactions && reactions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {reactions.map((reaction) => (
                <motion.button
                  key={`${reaction.type}-${reaction.content}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(reaction.content)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
                    reaction.hasReacted
                      ? 'bg-blue-500/30 hover:bg-blue-500/40'
                      : 'bg-gray-700/50 hover:bg-gray-700/70'
                  }`}
                  title={`${reaction.count} ${reaction.count === 1 ? 'reaction' : 'reactions'}`}
                >
                  <span>{reaction.content}</span>
                  {reaction.count > 1 && (
                    <span className="text-xs text-gray-400">{reaction.count}</span>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <MessageContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onReaction={handleReaction}
            onGifSelect={() => {}}
            onStickerSelect={() => {}}
            existingReactions={reactions?.map(r => r.content) || []}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 