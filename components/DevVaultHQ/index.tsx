'use client';

/**
 * DevVaultHQ Component - Discord Server Integration
 * 
 * This component creates a developer headquarters by embedding a Discord server
 * within the Vault interface, providing access to both text and voice channels
 * while maintaining the cosmic aesthetic of the Vault.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Optional components for additional functionality
import DebugConsole from './components/DebugConsole';

// Hooks
import { useUser } from '@/hooks/useUser';

// Styles
import styles from '@/styles/devVault.module.css';

interface Log {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

const DevVaultHQ: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const [activePanel, setActivePanel] = useState('features');
  const [showDebugConsole, setShowDebugConsole] = useState(false);
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [logFeed, setLogFeed] = useState<Log[]>([]);
  const [discordLoaded, setDiscordLoaded] = useState(false);
  
  // Discord server ID and channel IDs
  // Replace these with your actual Discord server and channel IDs
  const DISCORD_SERVER_ID = '123456789012345678';
  const DISCORD_WIDGET_ID = '123456789012345678';
  
  useEffect(() => {
    // Handle authentication redirect
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // Mock log feed for development
    const mockLogs: Log[] = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Dev Vault initialized'
      },
      {
        timestamp: new Date().toISOString(),
        level: 'warning',
        message: 'Discord integration pending approval'
      }
    ];
    setLogFeed(mockLogs);
  }, []);
  
  const handlePanelChange = (panel: string) => {
    setActivePanel(panel);
  };
  
  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className={styles.devVaultContainer}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Loading Dev Vault...</h2>
        </div>
      </div>
    );
  }

  if (user.role !== 'developer') {
    return (
      <div className={styles.devVaultContainer}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Restricted</h2>
          <p className="text-gray-400 mb-6">
            The Dev Vault is only accessible to EONIC developers. 
            If you believe you should have access, please ensure your developer wallet is connected.
          </p>
          <p className="text-sm text-gray-500">
            Connected wallet: {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.devVaultContainer}>
      <nav className={styles.devVaultNav}>
        <div className={styles.navHeader}>
          <h2>Dev Vault HQ</h2>
          <button
            onClick={() => setShowDebugConsole(!showDebugConsole)}
            className={styles.debugButton}
          >
            {showDebugConsole ? 'Hide Console' : 'Show Console'}
          </button>
        </div>

        <div className={styles.navButtons}>
          <button
            className={`${styles.navButton} ${activePanel === 'features' ? styles.active : ''}`}
            onClick={() => handlePanelChange('features')}
          >
            <span className={styles.navIcon}>⚡</span>
            <span className={styles.navText}>Features</span>
          </button>

          <button
            className={`${styles.navButton} ${activePanel === 'integrations' ? styles.active : ''}`}
            onClick={() => handlePanelChange('integrations')}
          >
            <span className={styles.navIcon}>🔌</span>
            <span className={styles.navText}>Integrations</span>
          </button>
        </div>

        <div className={styles.logFeed}>
          <h3>Recent Activity</h3>
          <div className={styles.logEntries}>
            {logFeed.map((log, index) => (
              <div key={index} className={`${styles.logEntry} ${styles[`log-${log.level}`]}`}>
                <span className={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={styles.logMessage}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className={styles.devVaultPanel}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.panelContainer}
          >
            {activePanel === 'features' && (
              <div className={styles.featuresPanel}>
                <h2>Core Features</h2>
                {/* Feature components will be rendered here */}
              </div>
            )}

            {activePanel === 'integrations' && (
              <div className={styles.integrationsPanel}>
                <h2>Active Integrations</h2>
                {/* Integration components will be rendered here */}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showDebugConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.debugConsoleContainer}
          >
            <DebugConsole
              logs={logFeed}
              onClose={() => setShowDebugConsole(false)}
              user={user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevVaultHQ;