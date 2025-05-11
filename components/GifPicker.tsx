'use client';

import { useState, useEffect } from 'react';
import { Search, Loader, TrendingUp, Star, ThumbsUp, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GifPickerProps {
  onSelect: (gif: { url: string, preview: string }) => void;
  onClose: () => void;
}

// Define GIF interface with id
interface GifItem {
  url: string;
  preview: string;
  id?: string;
}

// Categories for quick access
const CATEGORIES = [
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'reactions', label: 'Reactions', icon: Smile },
  { key: 'popular', label: 'Popular', icon: ThumbsUp },
  { key: 'favorites', label: 'Favorites', icon: Star },
];

// Use GIPHY API - this is a public API key that doesn't require auth
const GIPHY_API_KEY = 'Gc7131jiJuvI7IdN0HZ1D7nh0ow5BU6g';

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('trending');

  useEffect(() => {
    // Load trending GIFs by default
    fetchGifs();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        fetchGifs(search);
      } else if (activeCategory === 'trending') {
        fetchGifs(); // Fetch trending if search is cleared and trending is active
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, activeCategory]);

  const fetchGifs = async (searchTerm?: string, category?: string) => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      
      if (searchTerm) {
        endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=24&rating=pg-13`;
      } else if (category === 'reactions' || activeCategory === 'reactions') {
        endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=reaction&limit=24&rating=pg-13`;
      } else if (category === 'popular' || activeCategory === 'popular') {
        endpoint = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=pg-13`;
      } else {
        // Default to trending
        endpoint = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=pg-13`;
      }
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`GIPHY API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      // Check if results exist and have the expected format
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        setError('No GIFs found. Please try another search term.');
        setGifs([]);
        return;
      }

      // Format GIPHY data for our app
      const formattedGifs = data.data.map((gif: any) => ({
        url: gif.images.original.url,
        preview: gif.images.fixed_height_small.url || gif.images.fixed_width_small.url || gif.images.original_still.url,
        id: gif.id
      }));

      setGifs(formattedGifs);
    } catch (error) {
      setError('Failed to load GIFs. Please try again later.');
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearch('');
    fetchGifs(undefined, category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl p-4 overflow-hidden m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Select a GIF</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <span className="text-gray-400 hover:text-white text-xl">×</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search GIFs..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(category => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                transition-colors
                ${activeCategory === category.key 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
              `}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* GIF Grid - Fixed with larger size previews */}
        <div className="grid grid-cols-3 gap-3 h-96 overflow-y-auto">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : gifs.length > 0 ? (
              gifs.map((gif, index) => (
                <motion.button
                  key={gif.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onSelect(gif)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={gif.preview}
                    alt="GIF preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))
            ) : !error && !loading && (
              <div className="col-span-full text-center py-8 text-gray-400">
                No GIFs found. Try a different search term.
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Powered by GIPHY
        </div>
      </motion.div>
    </div>
  );
} 