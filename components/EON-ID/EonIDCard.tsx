import { EonIDData } from '@/types/eon-id';

export default function EonIDCard({ data }: { data: EonIDData }) {
  return (
    <div className="bg-[#0b0f15] border border-glow rounded-2xl p-4 w-full max-w-md text-white">
      <div className="flex items-center space-x-4">
        <img 
          src={data.pfpUrl || '/images/avatars/default-avatar.png'} 
          alt="PFP" 
          className="w-16 h-16 rounded-full border-2 border-cyan-500 shadow-glow-blue" 
        />
        <div>
          <h2 className="text-xl font-bold text-glow pulse-glow">{data.displayName}</h2>
          <p className="text-sm text-gray-400 pulse-glow">{data.title}</p>
          <p className="text-xs text-cyan-400 pulse-glow">
            XP: {data.xp} | Level: {data.level ?? Math.floor(data.xp / 1000)}
          </p>
          <p className="text-xs text-yellow-400 pulse-glow">@{data.vaultDomain}</p>
        </div>
      </div>
      {data.bio && (
        <p className="mt-3 text-sm text-gray-300 bg-gray-800/30 rounded-lg p-2">
          {data.bio}
        </p>
      )}
      {data.socialLinks && (
        <div className="mt-3 flex gap-3 text-xs">
          {data.socialLinks.twitter && (
            <a 
              href={data.socialLinks.twitter} 
              className="text-blue-400 hover:text-blue-300 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          )}
          {data.socialLinks.github && (
            <a 
              href={data.socialLinks.github} 
              className="text-gray-400 hover:text-gray-300 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {data.socialLinks.website && (
            <a 
              href={data.socialLinks.website} 
              className="text-green-400 hover:text-green-300 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
          {data.socialLinks.discord && (
            <a 
              href={data.socialLinks.discord} 
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Discord
            </a>
          )}
        </div>
      )}
    </div>
  );
} 