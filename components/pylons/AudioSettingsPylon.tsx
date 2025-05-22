'use client';
import { useState, useEffect } from 'react';
import { FaSlidersH, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useAudioVolume } from '../../app/components/dashboard/AudioVolumeContext';

export default function AudioSettingsPylon() {
  const { volume, setVolume, muted, setMuted } = useAudioVolume();
  const [displayVolume, setDisplayVolume] = useState(volume * 100);

  // Update display volume when context volume changes
  useEffect(() => {
    setDisplayVolume(volume * 100);
  }, [volume]);

  // Update context volume when display volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setDisplayVolume(newVolume);
    setVolume(newVolume / 100);
  };

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-5 relative text-white w-full max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <FaSlidersH className="text-purple-400 text-xl" />
        <h2 className="text-xl font-semibold glow-text">Vault Audio Settings</h2>
      </div>
      
      <div className="space-y-4">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Sound:</span>
          <button
            onClick={() => setMuted(!muted)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
              muted ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'
            }`}
          >
            {muted ? <FaVolumeMute className="mr-1" /> : <FaVolumeUp className="mr-1" />}
            <span>{muted ? 'Muted' : 'Enabled'}</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Volume:</span>
            <span className="text-purple-300">{Math.round(displayVolume)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={displayVolume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-[#1c1c1c] rounded-lg appearance-none cursor-pointer accent-purple-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
          />
        </div>
      </div>
    </div>
  );
} 