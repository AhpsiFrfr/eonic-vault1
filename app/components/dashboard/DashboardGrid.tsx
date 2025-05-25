import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import DraggableWidgetGrid from './DraggableWidgetGrid';
import VaultAudio from './VaultAudio';
import VaultReputation from './VaultReputation';
import TokenSummary from './TokenSummary';
import KPIMonitor from './KPIMonitor';
import Announcements from './Announcements';
import ENICAssistant from './ENICAssistant';
import ENICOrb from './ENICOrb';

interface DashboardGridProps {
  className?: string;
}

interface DashboardWidget {
  id: string;
  component: React.ComponentType;
  title: string;
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'vault-audio', component: VaultAudio, title: 'Vault Audio' },
  { id: 'vault-reputation', component: VaultReputation, title: 'Reputation' },
  { id: 'token-summary', component: TokenSummary, title: 'Token Summary' },
  { id: 'kpi-monitor', component: KPIMonitor, title: 'KPI Monitor' },
  { id: 'announcements', component: Announcements, title: 'Announcements' },
  { id: 'enic-assistant', component: ENICAssistant, title: 'ENIC Assistant' },
  { id: 'enic-orb', component: ENICOrb, title: 'ENIC Orb' },
];

const DashboardGrid: React.FC<DashboardGridProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeWidgets, setActiveWidgets] = useState<DashboardWidget[]>(defaultWidgets);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F1A]"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl font-orbitron text-[#1C45F4]"
            >
              EONIC VAULT
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="relative z-10"
      >
        <DraggableWidgetGrid widgets={activeWidgets} />
      </motion.div>

      {/* Sacred Geometry Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/assets/sacred-geometry.svg')] opacity-5" />
      </div>
    </div>
  );
};

export default DashboardGrid; 