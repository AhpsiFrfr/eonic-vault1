import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type ViewMode = 'web' | 'mobile';

interface ViewModeToggleProps {
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ onViewModeChange }: ViewModeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ViewMode>('web');

  useEffect(() => {
    // Load saved view mode from localStorage
    const savedMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedMode) {
      setSelectedMode(savedMode);
      onViewModeChange(savedMode);
    }
  }, [onViewModeChange]);

  const handleModeChange = (mode: ViewMode) => {
    setSelectedMode(mode);
    setIsOpen(false);
    localStorage.setItem('viewMode', mode);
    onViewModeChange(mode);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span>View: {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => handleModeChange('web')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
              selectedMode === 'web' ? 'bg-indigo-600 text-white' : 'text-gray-200'
            }`}
          >
            Web
          </button>
          <button
            onClick={() => handleModeChange('mobile')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
              selectedMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-200'
            }`}
          >
            Mobile
          </button>
        </div>
      )}
    </div>
  );
} 