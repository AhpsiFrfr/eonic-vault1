'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DevFeatureCard from './DevFeatureCard';
import styles from '@/styles/devVault.module.css';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'pending' | 'development';
}

interface FeatureListProps {
  features: Feature[];
  onFeatureSelect: (feature: Feature) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const FeatureList: React.FC<FeatureListProps> = ({ features, onFeatureSelect }) => {
  return (
    <motion.div
      className={styles.featureList}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {features.map((feature) => (
        <motion.div key={feature.id} variants={item}>
          <DevFeatureCard
            {...feature}
            onClick={() => onFeatureSelect(feature)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureList; 