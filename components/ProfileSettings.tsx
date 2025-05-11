import React, { useState } from 'react';

interface ProfileSettingsProps {
  onUpdateSettings: (settings: any) => void;
}

export function ProfileSettings({ onUpdateSettings }: ProfileSettingsProps) {
  const [showBusinessCard, setShowBusinessCard] = useState(false);

  const handleBusinessCardToggle = (enabled: boolean) => {
    setShowBusinessCard(enabled);
    // Mock update to user metadata
    onUpdateSettings({
      showBusinessCard: enabled
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Card Visibility */}
      <div className="flex items-center justify-between py-4 border-b border-gray-700/50">
        <div>
          <h3 className="text-lg font-medium text-white">Show My EON-ID</h3>
          <p className="text-sm text-gray-400">
            Allow other users to view your EON-ID with professional details
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handleBusinessCardToggle(!showBusinessCard)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showBusinessCard ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showBusinessCard ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 