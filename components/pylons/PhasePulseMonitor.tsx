import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Globe } from 'lucide-react';

interface PhaseData {
  stability: number;
  frequency: number;
  amplitude: number;
  dimensional_sync: number;
}

export default function PhasePulseMonitor() {
  const [phaseData, setPhaseData] = useState<PhaseData>({
    stability: 87.3,
    frequency: 432.7,
    amplitude: 0.92,
    dimensional_sync: 94.8
  });

  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseData(prev => ({
        stability: Math.max(60, Math.min(100, prev.stability + (Math.random() - 0.5) * 4)),
        frequency: Math.max(400, Math.min(500, prev.frequency + (Math.random() - 0.5) * 10)),
        amplitude: Math.max(0.5, Math.min(1.0, prev.amplitude + (Math.random() - 0.5) * 0.1)),
        dimensional_sync: Math.max(80, Math.min(100, prev.dimensional_sync + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400';
    if (value >= threshold * 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="pylon relative overflow-hidden">
      {/* Pulse animation background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
          animate={pulseActive ? {
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Phase Pulse Monitor
          </h3>
          <button
            onClick={() => setPulseActive(!pulseActive)}
            className={`p-1 rounded-full transition-colors ${
              pulseActive ? 'text-green-400 bg-green-400/20' : 'text-gray-400 bg-gray-400/20'
            }`}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Stability Monitor */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Phase Stability</span>
            <span className={`font-mono ${getStatusColor(phaseData.stability, 85)}`}>
              {phaseData.stability.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${phaseData.stability}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Frequency Monitor */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Resonance Freq</span>
            <span className={`font-mono ${getStatusColor(phaseData.frequency, 430)}`}>
              {phaseData.frequency.toFixed(1)} Hz
            </span>
          </div>

          {/* Amplitude Monitor */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Wave Amplitude</span>
            <span className={`font-mono ${getStatusColor(phaseData.amplitude * 100, 85)}`}>
              {phaseData.amplitude.toFixed(2)}
            </span>
          </div>

          {/* Dimensional Sync */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Dimensional Sync
            </span>
            <span className={`font-mono ${getStatusColor(phaseData.dimensional_sync, 90)}`}>
              {phaseData.dimensional_sync.toFixed(1)}%
            </span>
          </div>

          {/* Status indicator */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-green-400"
                animate={pulseActive ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                } : {}}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-sm text-green-400">
                {phaseData.stability > 85 ? 'Phase Locked' : 'Synchronizing...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 