'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function EmojiPicker({ onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState('recent');
  
  const emojiCategories = {
    recent: ['😀', '😂', '😍', '🤔', '😎', '👍', '❤️', '🔥', '🚀', '✅'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
    people: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '✋'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥'],
    activities: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲'],
    objects: ['⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '♥️', '💘', '💝', '💖', '💗', '💓', '💞', '💕'],
    flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🇺🇸', '🇬🇧', '🇨🇦', '🇩🇪', '🇫🇷', '🇪🇸', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳']
  };
  
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setFilteredEmojis([]);
      return;
    }
    
    // Simple search - in a real implementation this would be more sophisticated
    const results = [];
    Object.values(emojiCategories).forEach(category => {
      category.forEach(emoji => {
        if (results.length < 20 && !results.includes(emoji)) {
          results.push(emoji);
        }
      });
    });
    
    setFilteredEmojis(results);
  };
  
  const handleEmojiClick = (emoji) => {
    onSelect(emoji);
    // In a real implementation, this would also update the "recent" category
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-2 w-64">
      {/* Search */}
      <div className="mb-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search emojis..."
          className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {/* Tabs */}
      {!searchTerm && (
        <div className="flex border-b border-zinc-700 mb-2">
          {Object.keys(emojiCategories).map(category => (
            <button
              key={category}
              className={`px-2 py-1 text-xs ${activeTab === category ? 'text-blue-400 border-b-2 border-blue-400' : 'text-zinc-400'}`}
              onClick={() => setActiveTab(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {/* Emoji Grid */}
      <div className="grid grid-cols-7 gap-1 max-h-40 overflow-y-auto">
        {searchTerm
          ? filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                className="p-1 hover:bg-zinc-700 rounded text-lg"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))
          : emojiCategories[activeTab].map((emoji, index) => (
              <button
                key={index}
                className="p-1 hover:bg-zinc-700 rounded text-lg"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))
        }
      </div>
      
      {/* Footer */}
      <div className="flex justify-between mt-2 pt-2 border-t border-zinc-700">
        <button
          className="text-xs text-zinc-400 hover:text-white"
          onClick={() => searchRef.current?.focus()}
        >
          Search
        </button>
        <button
          className="text-xs text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
