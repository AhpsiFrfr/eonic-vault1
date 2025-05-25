import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Unlock, Lock, ArrowUpRight, Zap } from 'lucide-react';

interface GateStatus {
  isActive: boolean;
  energy: number;
  connections: number;
  lastAccess: string;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
}

export default function RefraGate() {
  const [gateStatus, setGateStatus] = useState<GateStatus>({
    isActive: false,
    energy: 75,
    connections: 3,
    lastAccess: '2 minutes ago',
    securityLevel: 'HIGH'
  });

  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGateStatus(prev => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.4) * 5)),
        connections: Math.max(0, Math.min(10, prev.connections + (Math.random() > 0.8 ? 1 : 0)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGateToggle = async () => {
    setIsInitializing(true);
    
    // Simulate gate initialization
    setTimeout(() => {
      setGateStatus(prev => ({
        ...prev,
        isActive: !prev.isActive,
        lastAccess: 'Just now'
      }));
      setIsInitializing(false);
    }, 2000);
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-yellow-400';
      case 'MEDIUM': return 'text-orange-400';
      case 'HIGH': return 'text-green-400';
      case 'MAXIMUM': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="pylon relative overflow-hidden">
      {/* Gate portal visual effect */}
      <div className="absolute inset-0 opacity-30">
        <AnimatePresence>
          {gateStatus.isActive && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [0.8, 1.1, 0.8],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 255, 0.3), transparent, rgba(0, 150, 255, 0.3), transparent)'
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            RefraGate
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            gateStatus.isActive ? 'bg-green-400/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              gateStatus.isActive ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            {gateStatus.isActive ? 'ACTIVE' : 'OFFLINE'}
          </div>
        </div>

        <div className="space-y-4">
          {/* Gate Control */}
          <div className="flex justify-center mb-6">
            <motion.button
              onClick={handleGateToggle}
              disabled={isInitializing}
              className={`relative w-20 h-20 rounded-full border-2 transition-all duration-300 ${
                gateStatus.isActive 
                  ? 'border-green-400 bg-green-400/10 text-green-400' 
                  : 'border-gray-600 bg-gray-600/10 text-gray-400'
              } ${isInitializing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isInitializing ? (
                  <motion.div
                    key="initializing"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                  >
                    <Zap className="w-8 h-8 mx-auto" />
                  </motion.div>
                ) : gateStatus.isActive ? (
                  <motion.div
                    key="unlock"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Unlock className="w-8 h-8 mx-auto" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lock"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Lock className="w-8 h-8 mx-auto" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Status Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Energy Level</span>
              <span className="font-mono text-cyan-400">{gateStatus.energy.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${gateStatus.energy}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Security Level</span>
              <span className={`font-mono ${getSecurityColor(gateStatus.securityLevel)}`}>
                {gateStatus.securityLevel}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Connections</span>
              <span className="font-mono text-blue-400">{gateStatus.connections}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Access</span>
              <span className="font-mono text-gray-400 text-sm">{gateStatus.lastAccess}</span>
            </div>
          </div>

          {/* Quick Actions */}
          {gateStatus.isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">Portal Ready</span>
                <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Enter Gate
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 