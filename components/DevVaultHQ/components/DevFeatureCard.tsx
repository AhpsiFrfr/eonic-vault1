'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/devVault.module.css';

interface DevFeatureCardProps {
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'pending' | 'development';
  onClick?: () => void;
}

const DevFeatureCard: React.FC<DevFeatureCardProps> = ({
  title,
  description,
  icon,
  status,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.featureCard} ${styles[`status-${status}`]}`}
      onClick={onClick}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <div className={styles.featureContent}>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
      <div className={styles.featureStatus}>
        <span className={styles.statusDot} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </motion.div>
  );
};

export default DevFeatureCard; 