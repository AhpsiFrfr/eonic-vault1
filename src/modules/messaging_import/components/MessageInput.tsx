import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from './FileUpload';

interface Props {
  onSendMessage: (content: string, attachments: File[]) => Promise<void>;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<Props> = ({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const lastTypingTime = useRef<number>(0);
  const TYPING_TIMEOUT = 3000; // 3 seconds

  const handleTyping = () => {
    const now = Date.now();
    if (now - lastTypingTime.current >= TYPING_TIMEOUT) {
      onTyping?.();
      lastTypingTime.current = now;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    try {
      await onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = Array.from(items)
      .filter(item => item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (imageFiles.length > 0) {
      setAttachments(prev => [...prev, ...imageFiles]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="space-y-4">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={file.name + index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ minHeight: '40px', maxHeight: '200px' }}
            />
          </div>

          <FileUpload 
            onFileSelect={(files) => setAttachments(prev => [...prev, ...Array.from(files)])} 
            disabled={disabled}
          />

          <button
            type="submit"
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};
