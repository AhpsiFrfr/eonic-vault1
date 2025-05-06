import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface GifPickerProps {
  onSelect: (gif: { url: string, preview: string }) => void;
  onClose: () => void;
}

// Use GIPHY API - this is a public API key that doesn't require auth
const GIPHY_API_KEY = 'Gc7131jiJuvI7IdN0HZ1D7nh0ow5BU6g';

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<Array<{ url: string, preview: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load trending GIFs by default
    fetchGifs();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        fetchGifs(search);
      } else {
        fetchGifs(); // Fetch trending if search is cleared
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  const fetchGifs = async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = searchTerm
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=20&rating=pg-13`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=pg-13`;

      console.log('Fetching GIFs from GIPHY:', endpoint);
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`GIPHY API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('GIPHY API response:', data);

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
      }));

      setGifs(formattedGifs);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      setError('Failed to load GIFs. Please try again later.');
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-4" onClick={e => e.stopPropagation()}>
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

        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : gifs.length > 0 ? (
            gifs.map((gif, index) => (
              <button
                key={index}
                onClick={() => onSelect(gif)}
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                <img
                  src={gif.preview}
                  alt="GIF preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))
          ) : !error && !loading && (
            <div className="col-span-full text-center py-8 text-gray-400">
              No GIFs found. Try a different search term.
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Powered by GIPHY
        </div>
      </div>
    </div>
  );
} 