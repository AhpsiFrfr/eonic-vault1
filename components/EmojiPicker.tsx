import React from 'react';

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const COMMON_EMOJIS = ['👍', '👎', '❤️', '😄', '😢', '🎉', '🤔', '👀', '🚀', '✨'];

export function EmojiPicker({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Reaction</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="text-2xl p-2 hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
