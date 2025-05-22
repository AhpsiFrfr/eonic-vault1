import { FaShieldAlt } from 'react-icons/fa';

export default function VaultReputationPylon() {
  const level = 12;
  const xp = 7450;
  const maxXP = 10000;

  return (
    <div className="widget bg-[#121212] border border-[#1f1f1f] rounded-2xl px-6 py-5 shadow-[0_0_25px_3px_rgba(180,0,255,0.15)] hover:shadow-[0_0_35px_4px_rgba(180,0,255,0.25)] transition-all duration-500 ease-in-out relative text-white w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaShieldAlt className="text-purple-400 text-xl" />
          <h2 className="text-xl font-semibold glow-text">Vault Reputation</h2>
        </div>
        <div className="text-sm text-gray-400">Level {level}</div>
      </div>
      {/* Progress */}
      <div className="w-full h-4 bg-[#1c1c1c] rounded-full overflow-hidden relative mb-2">
        <div className="absolute left-0 top-0 h-full bg-purple-500 transition-all duration-700 ease-out" style={{ width: `${(xp / maxXP) * 100}%` }}></div>
      </div>
      <div className="text-sm text-gray-300 tracking-wide">XP: {xp.toLocaleString()} / {maxXP.toLocaleString()}</div>
    </div>
  );
} 