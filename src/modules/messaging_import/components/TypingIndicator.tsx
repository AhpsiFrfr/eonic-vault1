import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="text-gray-500 text-sm">Someone is typing</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
};
