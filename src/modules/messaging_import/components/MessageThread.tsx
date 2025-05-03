import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: Message[];
  isTyping?: boolean;
  onReactionClick: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  currentUserAddress?: string;
  className?: string;
}

export const MessageThread: React.FC<Props> = ({
  messages,
  isTyping,
  onReactionClick,
  onReply,
  currentUserAddress,
  className = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const isConsecutiveMessage = (message: Message, index: number) => {
    if (index === 0) return false;
    const prevMessage = messages[index - 1];
    return (
      message.sender_address === prevMessage.sender_address &&
      new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000 // 5 minutes
    );
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${className}`}>
      {messages.map((message, index) => {
        const isCurrentUser = message.sender_address === currentUserAddress;
        const showHeader = !isConsecutiveMessage(message, index);

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${
              isConsecutiveMessage(message, index) ? 'mt-1' : 'mt-4'
            }`}
          >
            <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {showHeader && (
                <div className="flex items-center space-x-2 mb-1 text-xs text-gray-500">
                  <span>
                    {message.sender_address?.slice(0, 4)}...{message.sender_address?.slice(-4)}
                  </span>
                  <span>{formatTime(message.created_at)}</span>
                </div>
              )}

              <div
                className={`rounded-lg p-3 ${
                  isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white border'
                }`}
              >
                {message.parent_id && (
                  <div 
                    className={`text-sm mb-2 ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    } cursor-pointer hover:underline`}
                    onClick={() => {
                      const parentMessage = messages.find(m => m.id === message.parent_id);
                      if (parentMessage) onReply(parentMessage);
                    }}
                  >
                    Replying to message...
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words">{message.content}</p>

                {message.attachments?.map((attachment) => (
                  <div key={attachment.id} className="mt-2">
                    {attachment.type.startsWith('image/') ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="max-w-full rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 ${
                          isCurrentUser ? 'text-blue-100' : 'text-blue-500'
                        } hover:underline`}
                      >
                        📎 <span>{attachment.filename}</span>
                        <span className="text-sm opacity-75">
                          ({Math.round(attachment.size / 1024)}KB)
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {message.reactions && message.reactions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
                    const count = message.reactions?.filter(r => r.emoji === emoji).length || 0;
                    const hasReacted = message.reactions?.some(
                      r => r.emoji === emoji && r.sender_address === currentUserAddress
                    );
                    
                    return (
                      <button
                        key={`${message.id}-${emoji}`}
                        onClick={() => onReactionClick(message.id, emoji)}
                        className={`px-2 py-0.5 rounded-full text-sm transition-colors ${
                          hasReacted
                            ? 'bg-blue-100 hover:bg-blue-200'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {emoji} {count > 1 && count}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};
