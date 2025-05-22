// @dev-vault-component
'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    
    setMessage(newMessage);
    setShowEmojiPicker(false);
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            😊
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={1}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 transition-colors ${
              showPreview ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            👁️
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
          >
            Send
          </button>
        </div>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 bg-gray-800 rounded-lg p-2 shadow-lg">
          <div className="grid grid-cols-8 gap-1">
            {['😊', '👍', '🎉', '❤️', '🚀', '✨', '🔥', '👀', '💡', '🐛', '✅', '❌', '⭐', '💪', '🙌', '🤔'].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Markdown Preview */}
      {showPreview && message && (
        <div className="absolute bottom-full mb-2 w-full bg-gray-800 rounded-lg p-4 shadow-lg">
          <div className="prose prose-invert max-w-none">
            {/* Add markdown rendering here */}
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput; 