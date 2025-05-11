'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedTimepiece } from './AnimatedTimepiece';
import { UserMetrics } from '../../utils/mock-data';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  index: number;
}

interface QuickLinkProps {
  label: string;
  href: string;
  icon: string;
  index: number;
}

interface DimensionalDashboardProps {
  displayName: string;
  userMetrics: UserMetrics;
}

export const DimensionalDashboard: React.FC<DimensionalDashboardProps> = ({
  displayName,
  userMetrics,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Update viewport dimensions on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dashboardRef.current) return;
      
      const rect = dashboardRef.current.getBoundingClientRect();
      
      // Calculate normalized mouse position relative to the center of the viewport
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [viewport]);

  // Extract metrics
  const { 
    level, 
    currentXp, 
    eonicBalance, 
    referralCount,
    hasTimepiece,
    timepieceImageUrl,
    timepieceStage,
    nftXp
  } = userMetrics;
  
  // Custom card component with 3D effect
  const DashboardCard = ({ title, value, subtitle = '', index }: DashboardCardProps) => {
    // Calculate a unique transform based on card position and mouse
    const getCardTransform = () => {
      const rotateY = mousePosition.x * 5; // Max 5 degrees rotation
      const rotateX = -mousePosition.y * 5; // Negative to match mouse direction
      const translateZ = index * 5; // Each card at a different z-depth
      
      return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    };
    
    return (
      <motion.div 
        whileHover={{ 
          z: 30,
          scale: 1.03,
          boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
          transition: { duration: 0.2 }
        }}
        className="bg-gradient-to-br from-[#1E1E2F] to-[#252538] p-5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all"
        style={{ 
          transform: getCardTransform(),
          boxShadow: `0 ${5 + index * 2}px ${10 + index * 5}px rgba(0, 0, 0, 0.2)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-indigo-400 text-sm mt-1">{subtitle}</p>}
      </motion.div>
    );
  };
  
  // Enhanced quick link component
  const QuickLink = ({ label, href, icon, index }: QuickLinkProps) => {
    const getTransform = () => {
      const translateZ = index * 8;
      return `perspective(1000px) translateZ(${translateZ}px)`;
    };
    
    return (
      <Link href={href}>
        <motion.div 
          whileHover={{ 
            scale: 1.05,
            rotateY: 5,
            z: 20,
            boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-4 bg-[#1E1E2F] rounded-lg border border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
          style={{
            transform: getTransform(),
            boxShadow: `0 ${5 + index * 2}px ${10 + index * 3}px rgba(0, 0, 0, 0.15)`,
            transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
          }}
        >
          <div className="text-2xl">{icon}</div>
          <span className="font-medium">{label}</span>
        </motion.div>
      </Link>
    );
  };
  
  // Energy path between timepiece and metrics
  const EnergyPath = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: 0.2 }}>
      {/* Curved path from timepiece to metrics */}
      <path
        d="M200,250 C300,200 400,300 600,200"
        fill="none"
        stroke="url(#blueGradient)"
        strokeWidth="2"
        strokeDasharray="5,5"
        className="animate-pulse"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div 
      ref={dashboardRef}
      className="w-full px-4 py-6 space-y-6 text-white relative"
      style={{ 
        background: `radial-gradient(circle at ${50 + (mousePosition.x * 10)}% ${50 + (mousePosition.y * 10)}%, 
          rgba(30, 30, 47, 0.8) 0%, 
          rgba(15, 15, 26, 1) 70%)`,
        perspective: '1000px',
      }}
    >
      {/* Welcome message with 3D effect */}
      <motion.h2 
        className="text-2xl font-bold mb-6 relative z-20"
        style={{ 
          textShadow: '0 4px 8px rgba(0,0,0,0.5)',
          transform: `perspective(1000px) translateZ(10px) rotateX(${-mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        Welcome Back to the Vault, {displayName}!
      </motion.h2>
      
      {/* Decorative energy paths */}
      <EnergyPath />
      
      {/* Metric cards with 3D effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <DashboardCard index={0} title="Current Level" value={`Level ${level}`} subtitle={`${currentXp} XP`} />
        <DashboardCard index={1} title="$EONIC Held" value={`${eonicBalance} $EONIC`} />
        <DashboardCard index={2} title="Referrals" value={`${referralCount} Activated`} />
      </div>

      {/* Timepiece with advanced animations */}
      {hasTimepiece && (
        <motion.div 
          className="mt-6 bg-gradient-to-r from-indigo-800/50 to-violet-700/50 backdrop-blur-sm rounded-xl p-6 relative z-10 overflow-hidden"
          style={{ 
            transform: `perspective(1000px) rotateX(${-mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 rounded-xl" />
          
          <h3 className="text-lg font-semibold mb-4 relative">Timepiece Evolution</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full max-w-[240px] mx-auto">
              <AnimatedTimepiece 
                size={240}
                imagePath={timepieceImageUrl}
                isActive={true}
                rotationSpeed={5}
                pulseSpeed={2}
              />
            </div>
            
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <h4 className="text-indigo-300 mb-1">Current Stage</h4>
                  <p className="text-xl font-bold">{timepieceStage}</p>
                </div>
                
                <div>
                  <h4 className="text-indigo-300 mb-1">Evolution Progress</h4>
                  <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (nftXp / 1000) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-sm mt-1 text-gray-400">{nftXp} / 1000 XP</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation quick links with 3D effect */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <QuickLink index={0} label="Display EON-ID" href="/dashboard/eon-id" icon="🧬" />
        <QuickLink index={1} label="Enter Community" href="/dashboard/community" icon="💬" />
        <QuickLink index={2} label="Claim Rewards" href="/dashboard/vault" icon="🔌" />
      </div>
      
      {/* Background ambient effect */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute w-full h-full bg-[conic-gradient(at_bottom_right,var(--tw-gradient-stops))] from-indigo-900/20 via-violet-900/10 to-purple-900/5 animate-pulse-slow" style={{ animationDuration: '20s' }} />
      </div>
    </div>
  );
}; 