import React from 'react';
import styles from '../styles/devVault.module.css';

type DevFeatureCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const DevFeatureCard: React.FC<DevFeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

export default DevFeatureCard;
