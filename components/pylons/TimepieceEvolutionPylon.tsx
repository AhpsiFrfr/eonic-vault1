'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FaClock } from 'react-icons/fa';
import { playSFX } from '../../utils/audio';
import { useGlowLevel } from '../../context/GlowLevelContext';
import { useAudioVolume } from '../../app/components/dashboard/AudioVolumeContext';

const TimepieceEvolutionPylon: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const { glowLevel } = useGlowLevel();
  const { muted } = useAudioVolume();
  
  // Calculate progress percentage based on glow level
  const progress = glowLevel / 100;
  
  // Animate progress on change
  useEffect(() => {
    if (progressRef.current) {
      const circumference = 2 * Math.PI * 40;
      
      gsap.to(progressRef.current, {
        strokeDashoffset: circumference - (circumference * progress),
        duration: 1.5,
        ease: 'power2.out'
      });
    }
  }, [progress]);
  
  // Particle animation
  useEffect(() => {
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const delay = i * 0.2;
        const duration = 3 + Math.random() * 2;
        
        gsap.to(particle, {
          y: -10 - Math.random() * 20,
          x: Math.random() * 10 - 5,
          opacity: 0,
          scale: 0.5 + Math.random() * 0.5,
          duration: duration,
          delay: delay,
          repeat: -1,
          repeatDelay: 1,
          ease: 'power1.out',
          yoyo: true
        });
      }
    }
  }, []);
  
  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <svg 
        ref={svgRef}
        width="200" 
        height="200" 
        viewBox="0 0 100 100"
        className="transform scale-90"
      >
        {/* Outer ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="none" 
          stroke="#1034A6" 
          strokeWidth="0.5" 
          opacity="0.3" 
        />
        
        {/* Middle ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          fill="none" 
          stroke="#F5D16F" 
          strokeWidth="0.5" 
          opacity="0.5" 
        />
        
        {/* Inner ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="#1034A6" 
          strokeWidth="1" 
          opacity="0.8" 
        />
        
        {/* Progress ring */}
        <circle 
          ref={progressRef}
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="#F5D16F" 
          strokeWidth="2" 
          strokeDasharray={2 * Math.PI * 40} 
          strokeDashoffset={2 * Math.PI * 40 * (1 - progress)} 
          transform="rotate(-90 50 50)" 
          strokeLinecap="round"
        />
        
        {/* Glyph marks */}
        <g opacity="0.7">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <line 
                x1="50" 
                y1="10" 
                x2="50" 
                y2="15" 
                stroke="#F5D16F" 
                strokeWidth="0.5" 
              />
            </g>
          ))}
        </g>
        
        {/* Center emblem */}
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          fill="url(#timepiece-gradient)" 
          opacity="0.9" 
        />
        
        {/* Level text */}
        <text 
          x="50" 
          y="45" 
          textAnchor="middle" 
          fill="#F5D16F" 
          fontFamily="Orbitron" 
          fontSize="6"
          fontWeight="bold"
        >
          LEVEL
        </text>
        
        <text 
          x="50" 
          y="55" 
          textAnchor="middle" 
          fill="#F5D16F" 
          fontFamily="Orbitron" 
          fontSize="12"
          fontWeight="bold"
        >
          {Math.floor(glowLevel)}
        </text>
        
        {/* Particles */}
        <g ref={particlesRef}>
          {Array.from({ length: 10 }).map((_, i) => (
            <circle 
              key={i}
              cx={50 + (Math.random() * 20 - 10)}
              cy={70}
              r={0.5 + Math.random() * 1}
              fill="#F5D16F"
              opacity={0.7}
            />
          ))}
        </g>
        
        {/* Gradient definition */}
        <defs>
          <radialGradient id="timepiece-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#0A0A0F" />
            <stop offset="80%" stopColor="#1E1E2A" />
            <stop offset="100%" stopColor="#2A2A36" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default TimepieceEvolutionPylon; 