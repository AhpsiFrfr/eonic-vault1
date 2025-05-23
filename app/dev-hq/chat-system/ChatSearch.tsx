'use client';

import React, { useState, useRef } from 'react';

interface ChatSearchProps {
  channelId: string;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  hasFile: boolean;
  hasLink: boolean;
  isPinned: boolean;
}

interface SearchFilters {
  fromUser: string;
  hasFile: boolean;
  hasLink: boolean;
  isPinned: boolean;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

// @dev-vault-component
export default function ChatSearch({ channelId, onClose }: ChatSearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    fromUser: '',
    hasFile: false,
    hasLink: false,
    isPinned: false,
    dateRange: 'all' // 'all', 'today', 'week', 'month'
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input on mount
  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // In a real implementation, this would call an API
    // For now, we'll simulate a search with mock results
    setTimeout(() => {
      const mockResults = [
        {
          id: '1',
          sender: 'DevLead',
          content: 'We need to update the quantum engine integration before the next release.',
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          hasFile: false,
          hasLink: false,
          isPinned: true
        },
        {
          id: '2',
          sender: 'CabalMember',
          content: 'Here\'s the documentation for the quantum engine: https://docs.eonic.dev/quantum',
          timestamp: Date.now() - 86400000, // 1 day ago
          hasFile: false,
          hasLink: true,
          isPinned: false
        },
        {
          id: '3',
          sender: 'DevUser',
          content: 'I\'ve attached the latest test results for the quantum engine integration.',
          timestamp: Date.now() - 3600000, // 1 hour ago
          hasFile: true,
          hasLink: false,
          isPinned: false
        }
      ];
      
      // Apply filters
      const filteredResults = mockResults.filter(result => {
        if (activeFilters.fromUser && result.sender !== activeFilters.fromUser) return false;
        if (activeFilters.hasFile && !result.hasFile) return false;
        if (activeFilters.hasLink && !result.hasLink) return false;
        if (activeFilters.isPinned && !result.isPinned) return false;
        
        // Date range filtering would be implemented here
        
        return true;
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };
  
  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const setDateRange = (range) => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };
  
  const jumpToMessage = (messageId) => {
    // In a real implementation, this would scroll to the message in the chat
    console.log(`Jumping to message ${messageId}`);
    onClose();
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  
  const highlightSearchTerm = (text) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-white">$1</mark>');
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-700">
        <h3 className="text-white font-medium">Search Messages</h3>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Search Form */}
      <div className="p-3 border-b border-zinc-700">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search messages..."
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Filters */}
      <div className="p-3 border-b border-zinc-700">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-2 py-1 text-xs rounded-full ${activeFilters.hasFile ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
            onClick={() => toggleFilter('hasFile')}
          >
            Has File
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${activeFilters.hasLink ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
            onClick={() => toggleFilter('hasLink')}
          >
            Has Link
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${activeFilters.isPinned ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
            onClick={() => toggleFilter('isPinned')}
          >
            Pinned
          </button>
          <select
            className="px-2 py-1 text-xs rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 focus:outline-none"
            value={activeFilters.dateRange}
            onChange={(e) => setDateRange(e.target.value as 'all' | 'today' | 'week' | 'month')}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {searchResults.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            {searchTerm && !isSearching ? 'No results found.' : 'Search for messages in this channel.'}
          </div>
        ) : (
          <div className="divide-y divide-zinc-700">
            {searchResults.map(result => (
              <div key={result.id} className="p-3 hover:bg-zinc-700/50">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="font-medium text-white">{result.sender}</span>
                    <span className="ml-2 text-xs text-zinc-400">{formatDate(result.timestamp)}</span>
                  </div>
                  <button 
                    className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700"
                    onClick={() => jumpToMessage(result.id)}
                    title="Jump to message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p 
                  className="text-zinc-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: highlightSearchTerm(result.content) }}
                ></p>
                <div className="mt-1 flex space-x-2">
                  {result.hasFile && (
                    <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
                      File
                    </span>
                  )}
                  {result.hasLink && (
                    <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
                      Link
                    </span>
                  )}
                  {result.isPinned && (
                    <span className="text-xs bg-yellow-900/30 text-yellow-300 px-1.5 py-0.5 rounded-full">
                      Pinned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
