'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/devVault.module.css';

export interface Integration {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  details?: string;
}

interface IntegrationStatusProps {
  integrations: Integration[];
}

const statusColors = {
  connected: '#10B981',
  disconnected: '#6B7280',
  error: '#EF4444'
};

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ integrations }) => {
  return (
    <div className={styles.integrationStatus}>
      <h2 className={styles.integrationTitle}>Integration Status</h2>
      <div className={styles.integrationList}>
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            className={styles.integrationItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.integrationHeader}>
              <span
                className={styles.statusIndicator}
                style={{ backgroundColor: statusColors[integration.status] }}
              />
              <h3 className={styles.integrationName}>{integration.name}</h3>
            </div>
            {integration.lastSync && (
              <p className={styles.integrationSync}>
                Last synced: {integration.lastSync}
              </p>
            )}
            {integration.details && (
              <p className={styles.integrationDetails}>{integration.details}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationStatus; 