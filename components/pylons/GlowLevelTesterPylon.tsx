'use client';

import { useGlowLevel } from '../../context/GlowLevelContext';
import { GLOW_INTENSITIES } from '../../context/GlowLevelContext';
import { playSFX } from '../../utils/audio';

export default function GlowLevelTesterPylon() {
  const { glowLevel, setGlowLevel } = useGlowLevel();

  const handleLevelChange = (level: number) => {
    setGlowLevel(level);
    playSFX('level_up');
  };

  return (
    <div className="widget bg-[#121212] text-white rounded-xl p-5 transition-all duration-300">
      <h2 className="text-lg font-bold mb-2">Glow Level Tester</h2>
      <p className="mb-4 text-sm text-gray-300">Adjust the simulated XP stage to preview glow intensities used across Vault widgets.</p>
      
      {/* Level Buttons */}
      <div className="flex items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5, 6].map((lvl) => (
          <button
            key={lvl}
            onClick={() => handleLevelChange(lvl)}
            onMouseEnter={() => playSFX('hover')}
            className={`w-8 h-8 text-sm rounded-full border border-cyan-500 transition-all duration-300 ${
              glowLevel === lvl ? 'bg-cyan-400 text-black' : 'bg-[#1c1c1c] text-cyan-300 hover:bg-cyan-700'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Preview Box */}
      <div className="mt-4 p-4 rounded-lg bg-[#1c1c1c] border border-[#2c2c2c]">
        <div className="text-xs text-gray-400 mb-2">Current Glow Effect:</div>
        <div 
          className={`w-full h-16 rounded-lg bg-[#121212] border border-[#2c2c2c] ${GLOW_INTENSITIES[glowLevel]}`}
        />
      </div>

      {/* Level Description */}
      <div className="mt-4 text-xs text-gray-400">
        <span className="text-cyan-400">Level {glowLevel}</span>: {
          glowLevel === 1 ? 'Novice - Subtle glow effects' :
          glowLevel === 2 ? 'Apprentice - Enhanced visibility' :
          glowLevel === 3 ? 'Adept - Distinct aura' :
          glowLevel === 4 ? 'Expert - Prominent glow' :
          glowLevel === 5 ? 'Master - Intense luminescence' :
          'Legendary - Maximum radiance'
        }
      </div>
    </div>
  );
} 