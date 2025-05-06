import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onSelect: (stickerUrl: string) => void;
  onClose: () => void;
}

// For now, we'll use a set of predefined stickers
// In a real app, these would come from a sticker pack API or database
const STICKERS = [
  '👋', '❤️', '😊', '🎉', '👍', '🌟',
  '🔥', '💯', '🎨', '🎭', '🎪', '🎯',
  '🎲', '🎮', '🎼', '🎧', '🎤', '🎹',
  '🥇', '🏆', '🎖️', '🏅', '🎗️', '💫'
];

export function StickerPicker({ onSelect, onClose }: Props) {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-lg p-4 w-64"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Stickers</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {STICKERS.map((sticker, index) => (
          <button
            key={index}
            onClick={() => onSelect(sticker)}
            className="aspect-square flex items-center justify-center text-2xl bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {sticker}
          </button>
        ))}
      </div>
    </motion.div>
  );
} 