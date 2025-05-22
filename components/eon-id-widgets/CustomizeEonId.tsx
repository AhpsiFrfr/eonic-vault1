'use client';

import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const DEFAULT_WIDGETS = [
  'display_name',
  'timepiece',
  'xp_level',
  'nft_gallery'
];

export function CustomizeEonId() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    profile?.widget_list || DEFAULT_WIDGETS
  );

  const toggleWidget = async (widgetId: string) => {
    const newWidgets = activeWidgets.includes(widgetId)
      ? activeWidgets.filter(id => id !== widgetId)
      : [...activeWidgets, widgetId];
    
    setActiveWidgets(newWidgets);
    
    try {
      await updateProfile({ widget_list: newWidgets });
      toast.success('Widget preferences updated');
    } catch (err) {
      console.error('Error updating widget preferences:', err);
      toast.error('Failed to update preferences');
      // Revert state on error
      setActiveWidgets(profile?.widget_list || DEFAULT_WIDGETS);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm text-gray-400 mb-4">Customize EON-ID</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse mr-3"></div>
              <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const widgets = [
    { id: 'display_name', label: 'Display Name' },
    { id: 'timepiece', label: 'Timepiece' },
    { id: 'xp_level', label: 'XP Level' },
    { id: 'nft_gallery', label: 'NFT Gallery' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 mb-4">Customize EON-ID</h3>
      <div className="space-y-2">
        {widgets.map(widget => (
          <label key={widget.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              checked={activeWidgets.includes(widget.id)}
              onChange={() => toggleWidget(widget.id)}
            />
            <span className="ml-3 text-sm text-gray-300">{widget.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 