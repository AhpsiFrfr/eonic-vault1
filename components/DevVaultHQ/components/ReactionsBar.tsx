import React from 'react';
import { motion } from 'framer-motion';

interface ReactionsBarProps {
  onReact: (emoji: string) => void;
  currentUserReactions: string[];
}

const ReactionsBar: React.FC<ReactionsBarProps> = ({ onReact, currentUserReactions }) => {
  // Telegram-style frequently used emojis
  const popularEmojis = ['❤️', '🥲', '😆', '🔥', '🙈', '😭', '👍', '🤔'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex items-center gap-1 mb-1 bg-neutral-800 rounded-full p-2 border border-neutral-700 shadow-lg backdrop-blur-sm"
    >
      {popularEmojis.map((emoji, index) => {
        const isReacted = currentUserReactions.includes(emoji);
        return (
          <motion.button
            key={emoji}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: index * 0.03,
              duration: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 25
            }}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.1 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05 }
            }}
            onClick={() => onReact(emoji)}
            className={`
              relative flex items-center justify-center w-10 h-10 rounded-full 
              transition-all duration-200 ease-out
              ${isReacted 
                ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50 shadow-lg' 
                : 'hover:bg-neutral-700/50'
              }
            `}
          >
            <span className="text-lg leading-none select-none">
              {emoji}
            </span>
            
            {isReacted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border border-neutral-800"
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ReactionsBar; 