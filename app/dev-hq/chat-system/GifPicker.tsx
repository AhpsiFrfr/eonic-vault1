'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function GifPicker({ onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gifs, setGifs] = useState([
    { id: '1', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2g2Ym50Y3Fhb2RxbXRnNHJ5NnJxcWF2dWs2aHRxdWF2dWszaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abAHdYvZdBNnGZq/giphy.gif', title: 'Happy Dance' },
    { id: '2', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWF2dWszaHFhdnVrNmh0cXVhdnVrM2hwN3pjaDZibnRjcWFvZHFtdGc0cnk2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYJnJQ4EiYLR9Io/giphy.gif', title: 'Thumbs Up' },
    { id: '3', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnJxcWF2dWs2aHRxdWF2dWszaHA3emNoNmJudGNxYW9kcW10ZzRyeTZyJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Mind Blown' },
    { id: '4', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXRnNHJ5NnJxcWF2dWs2aHRxdWF2dWszaHA3emNoNmJudGNxYW9kcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlBO7eyXzSZkJri/giphy.gif', title: 'Excited' },
    { id: '5', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2RxbXRnNHJ5NnJxcWF2dWs2aHRxdWF2dWszaHA3emNoNmJudGNxYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CyJmS9KUbID2WA/giphy.gif', title: 'Typing' },
    { id: '6', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGNxYW9kcW10ZzRyeTZycXFhdnVrNmh0cXVhdnVrM2hwN3pjaDZibiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif', title: 'Coding' }
  ]);
  
  const searchRef = useRef(null);
  
  const categories = [
    { id: 'trending', name: 'Trending' },
    { id: 'reactions', name: 'Reactions' },
    { id: 'coding', name: 'Coding' },
    { id: 'memes', name: 'Memes' },
    { id: 'anime', name: 'Anime' }
  ];
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 2) {
      setIsLoading(true);
      // In a real implementation, this would call the Giphy API
      // For now, we'll just simulate a search delay
      setTimeout(() => {
        setIsLoading(false);
        // Return the same gifs for any search term in this mock
      }, 500);
    }
  };
  
  const handleGifClick = (gif) => {
    onSelect(gif);
  };
  
  const handleCategoryClick = (category) => {
    setIsLoading(true);
    // In a real implementation, this would fetch from the Giphy API
    // For now, we'll just simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
      // Return the same gifs for any category in this mock
    }, 500);
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-2 w-80">
      {/* Search */}
      <div className="mb-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search GIFs..."
          className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {/* Categories */}
      <div className="flex overflow-x-auto mb-2 pb-1 scrollbar-thin scrollbar-thumb-zinc-600">
        {categories.map(category => (
          <button
            key={category.id}
            className="px-3 py-1 mr-2 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-full whitespace-nowrap text-zinc-300"
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* GIFs Grid */}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {gifs.map(gif => (
            <div 
              key={gif.id}
              className="relative rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleGifClick(gif)}
            >
              <img 
                src={gif.url} 
                alt={gif.title}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex justify-between mt-2 pt-2 border-t border-zinc-700">
        <div className="text-xs text-zinc-500">
          Powered by GIPHY
        </div>
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
