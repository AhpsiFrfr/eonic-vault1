import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { GifPickerModal } from './GifPickerModal';
import { StickerPickerModal } from './StickerPickerModal';
import { BusinessCardPanel } from './BusinessCardPanel';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// Common emoji reactions
const COMMON_REACTIONS = [
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '❤️', label: 'heart' },
  { emoji: '😂', label: 'joy' },
  { emoji: '😮', label: 'wow' },
  { emoji: '😢', label: 'sad' },
  { emoji: '😡', label: 'angry' },
];

interface MessageContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onReaction: (reaction: string) => void;
  onGifSelect: (gifUrl: string) => void;
  onStickerSelect: (stickerId: string) => void;
  onReply?: () => void;
  onPin?: () => void;
  onCopy?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  message?: {
    id: string;
    content: string;
    sender_address: string;
    showBusinessCard?: boolean;
    businessCard?: {
      ensName?: string;
      role?: string;
      timepieceStage?: string;
      lookingFor?: string;
      links?: {
        github?: string;
        website?: string;
        twitter?: string;
      };
    };
  };
  existingReactions?: string[];
}

export function MessageContextMenu({
  x,
  y,
  onClose,
  onReaction,
  onGifSelect,
  onStickerSelect,
  onReply = () => {},
  onPin = () => {},
  onCopy = () => {},
  onForward = () => {},
  onDelete = () => {},
  onSelect = () => {},
  message,
  existingReactions = [],
}: MessageContextMenuProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showBusinessCard, setShowBusinessCard] = useState(false);

  const handleReactionClick = (reaction: string) => {
    if (onReaction) {
      onReaction(reaction);
        onClose();
      }
  };

  return (
    <>
      <ContextMenu x={x} y={y} onClose={onClose}>
        {/* Quick Reaction Bar */}
        <div className="px-2 py-1 border-b border-gray-700">
          <div className="flex items-center space-x-1">
            {COMMON_REACTIONS.map(({ emoji, label }) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReactionClick(emoji)}
                className={`p-1.5 rounded-full hover:bg-gray-700 transition-colors ${
                  existingReactions.includes(emoji) ? 'bg-gray-700' : ''
                }`}
                title={label}
              >
                <span className="text-sm">{emoji}</span>
              </motion.button>
            ))}
            
            {/* Reaction Picker Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReactionPicker(true)}
              className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="More reactions"
            >
              <span className="text-sm font-bold bg-gray-700 px-2 py-0.5 rounded-full">+</span>
            </motion.button>

            {/* GIF Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGifPicker(true)}
              className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Add GIF"
            >
              <span className="text-xs font-bold">GIF</span>
            </motion.button>

            {/* Sticker Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStickerPicker(true)}
              className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Add sticker"
            >
              <span role="img" aria-label="sticker" className="text-sm">🏷️</span>
            </motion.button>
          </div>
        </div>

        {/* Standard Context Menu Items */}
        {message?.showBusinessCard && (
          <ContextMenuItem onClick={() => setShowBusinessCard(true)}>
            View Profile
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={onReply}>Reply</ContextMenuItem>
        <ContextMenuItem onClick={onForward}>Forward</ContextMenuItem>
        <ContextMenuItem onClick={onCopy}>Copy Text</ContextMenuItem>
        <ContextMenuItem onClick={() => {}} disabled>
          Edit Message
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-red-400">
          Delete Message
        </ContextMenuItem>

        {/* Reaction Picker Modal */}
        <AnimatePresence>
          {showReactionPicker && (
            <ReactionPicker
              onClose={() => setShowReactionPicker(false)}
              onSelect={handleReactionClick}
              existingReactions={existingReactions}
            />
          )}
        </AnimatePresence>

        {/* GIF Picker Modal */}
        <AnimatePresence>
          {showGifPicker && (
            <GifPickerModal
              onClose={() => setShowGifPicker(false)}
              onSelect={(gifUrl) => {
                onGifSelect(gifUrl);
                onClose();
              }}
            />
          )}
        </AnimatePresence>

        {/* Sticker Picker Modal */}
        <AnimatePresence>
          {showStickerPicker && (
            <StickerPickerModal
              onClose={() => setShowStickerPicker(false)}
              onSelect={(stickerId) => {
                onStickerSelect(stickerId);
                onClose();
              }}
            />
          )}
        </AnimatePresence>
      </ContextMenu>

      {/* Business Card Panel */}
      {showBusinessCard && message && (
        <BusinessCardPanel
          isOpen={showBusinessCard}
          onClose={() => {
            setShowBusinessCard(false);
            onClose();
          }}
          userData={{
            username: message.sender_address.slice(0, 8) + '...',
            walletAddress: message.sender_address,
            ...message.businessCard
          }}
        />
      )}
    </>
  );
}

// Picker Components
function ReactionPicker({
  onClose,
  onSelect,
  existingReactions,
}: {
  onClose: () => void;
  onSelect: (reaction: string) => void;
  existingReactions: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
      style={{ 
        zIndex: 1000,
        '--em-rgb-input': '55 65 81',
        '--em-rgb-background': '31 41 55',
        '--em-rgb-color': '229 231 235',
        '--em-rgb-accent': '59 130 246'
      } as React.CSSProperties}
    >
      <div className="p-2">
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => {
            onSelect(emoji.native);
            onClose();
          }}
          theme="dark"
          previewPosition="none"
          skinTonePosition="none"
          searchPosition="none"
          navPosition="none"
          perLine={8}
          maxFrequentRows={0}
          emojiSize={22}
          emojiButtonSize={30}
          maxHeight={320}
        />
    </div>
    </motion.div>
  );
}
