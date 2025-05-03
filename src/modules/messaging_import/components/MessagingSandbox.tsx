import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';

export const MessagingSandbox: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-white">
      <ChatList 
        onSelectChat={(chatId) => setSelectedChatId(chatId)}
        selectedChatId={selectedChatId || undefined}
        className="flex-shrink-0"
      />
      
      {selectedChatId ? (
        <ChatWindow 
          chatId={selectedChatId}
          className="flex-1"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};
