'use client';
import { FaVolumeUp } from 'react-icons/fa';
import { playSFX, SoundEffect } from '../../utils/audio';

export default function AudioControlPylon() {
  const buttons = [
    { label: 'Hover', sfx: 'hover' as SoundEffect },
    { label: 'Click', sfx: 'click' as SoundEffect },
    { label: 'Modal Open', sfx: 'modal_open' as SoundEffect },
    { label: 'Modal Close', sfx: 'modal_close' as SoundEffect },
    { label: 'Level Up', sfx: 'level_up' as SoundEffect },
    { label: 'Referral Reward', sfx: 'referral_reward' as SoundEffect },
    { label: 'Hyperspace', sfx: 'hyperspace' as SoundEffect },
    { label: 'Whoosh', sfx: 'whoosh' as SoundEffect },
    { label: 'Chime', sfx: 'chime' as SoundEffect },
    { label: 'Reward', sfx: 'reward' as SoundEffect }
  ];

  const handlePlaySound = (sfx: SoundEffect) => {
    playSFX(sfx);
  };

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-5 relative text-white w-full max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <FaVolumeUp className="text-indigo-400 text-xl animate-pulse" />
        <h2 className="text-xl font-semibold glow-text">Vault Audio Test Panel</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {buttons.map(({ label, sfx }) => (
          <button
            key={label}
            onClick={() => handlePlaySound(sfx)}
            className="bg-[#1c1c1c] text-sm text-gray-200 px-3 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300 hover:text-white active:bg-indigo-700 active:scale-95 transform"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 