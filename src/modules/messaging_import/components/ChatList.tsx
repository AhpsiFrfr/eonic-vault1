import React, { useEffect, useState } from 'react';
import { Chat } from '../types';
import { messagingAPI } from '../utils/placeholders';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  onSelectChat,
  selectedChatId,
  className
}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      const fetchedChats = await messagingAPI.getChats();
      setChats(fetchedChats);
    };
    loadChats();
  }, []);

  return (
    <div className={`w-80 border-r overflow-y-auto ${className}`}>
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`p-4 cursor-pointer hover:bg-gray-50 ${
            selectedChatId === chat.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium truncate">{chat.name}</h3>
                {chat.last_message && (
                  <span className="text-xs text-gray-500">
                    {new Date(chat.last_message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              {chat.last_message && (
                <p className="text-sm text-gray-500 truncate">
                  {chat.last_message.content}
                </p>
              )}
            </div>
            {chat.unread_count ? (
              <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unread_count}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
