import React from 'react';
import DevFeatureCard from './DevFeatureCard';
import { FaRocket, FaBrain, FaShieldAlt } from 'react-icons/fa';

const featureData = [
  { title: 'Instant Deployments', description: 'Push features to the Vault in seconds.', icon: <FaRocket /> },
  { title: 'Neural Sync AI', description: 'Harness the ENIC.0 companion for precision strategies.', icon: <FaBrain /> },
  { title: 'Onchain Security', description: 'Built with cryptographic protection and SPL token gating.', icon: <FaShieldAlt /> }
];

const FeatureList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {featureData.map((feature, idx) => (
        <DevFeatureCard key={idx} {...feature} />
      ))}
    </div>
  );
};

export default FeatureList;
