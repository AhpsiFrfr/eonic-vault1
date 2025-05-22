'use client';
import { pylonConfig } from '@/config/pylons';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/state/dashboard';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function PylonConsole() {
  const { hovered, setHovered, pylonStates, togglePylon } = useDashboardStore();

  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative bg-gradient-to-br from-black/70 via-[#081c24]/70 to-black/70 backdrop-blur-lg border border-cyan-800 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.2)] px-3 py-4 w-[600px] animate-fade-in">
        {/* ENIC.0 Orb and Glow Ring */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-cyan-500/20 rounded-full border-2 border-cyan-300 shadow-lg flex items-center justify-center animate-pulse">
          <Loader2 className="w-4 h-4 text-cyan-100 animate-spin-slow" />
        </div>

        <h3 className="text-center text-sm text-cyan-200 font-semibold tracking-wide mb-3">Pylon Console</h3>

        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent">
          {pylonConfig.map(({ name, icon: Icon, color }) => (
            <div
              key={name}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'group relative flex-shrink-0 w-[100px] aspect-square rounded-xl bg-black/40 backdrop-blur-sm border border-cyan-700 flex flex-col items-center justify-center text-[8px] font-medium tracking-tight text-cyan-200 transition-all duration-300 shadow-[0_0_6px_rgba(0,255,255,0.15)] hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:animate-flicker-glow',
                pylonStates[name] ? 'ring-2 ring-cyan-400/60' : 'opacity-70'
              )}
            >
              <Icon className="w-4 h-4 mb-1 transition-transform duration-200 group-hover:scale-110" style={{ color: color || '#00FFFF' }} />
              <span className="mb-1 text-center leading-tight">{name}</span>
              <button
                onClick={() => togglePylon(name)}
                className="mt-0.5 relative overflow-hidden rounded-sm"
              >
                <span className="absolute inset-0 bg-cyan-300/20 rounded animate-ping z-0" />
                <Image
                  src={pylonStates[name] ? '/images/toggle-on.svg' : '/images/toggle-off.svg'}
                  alt={`Toggle ${name}`}
                  width={24}
                  height={12}
                  className="relative z-10 transition-transform duration-300 hover:scale-105"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 