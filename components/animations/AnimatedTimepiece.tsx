'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTimepieceProps {
  size?: number;
  glowIntensity?: number;
  rotationSpeed?: number;
  pulseSpeed?: number;
  imagePath?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const AnimatedTimepiece: React.FC<AnimatedTimepieceProps> = ({
  size = 300,
  glowIntensity = 10,
  rotationSpeed = 10,
  pulseSpeed = 3,
  imagePath = '/timepiece-nft.svg',
  onClick,
  isActive = false,
}) => {
  const [rotation, setRotation] = useState(0);
  const [glowSize, setGlowSize] = useState(glowIntensity);
  const animationRef = useRef<number | null>(null);
  const [mouseDistance, setMouseDistance] = useState(500);
  const timepieceRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement to adjust glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!timepieceRef.current) return;
      
      const rect = timepieceRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to center of timepiece
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + 
        Math.pow(e.clientY - centerY, 2)
      );
      
      // Normalize distance (closer = higher value)
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
      const normalizedDistance = Math.max(0, Math.min(1, 1 - distance / maxDistance));
      
      setMouseDistance(normalizedDistance * 500);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Rotation animation
  useEffect(() => {
    const animate = () => {
      setRotation(prev => (prev + rotationSpeed / 60) % 360);
      
      // Pulse the glow effect
      const pulse = Math.sin(Date.now() / (1000 / pulseSpeed)) * 5;
      const intensityBoost = isActive ? 15 : 0;
      const mouseBoost = isActive ? mouseDistance / 20 : 0;
      
      setGlowSize(glowIntensity + pulse + intensityBoost + mouseBoost);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotationSpeed, glowIntensity, pulseSpeed, isActive, mouseDistance]);

  // Create symbols that rotate around the timepiece
  const renderSymbols = () => {
    const symbols = [];
    const symbolCount = 12;
    
    for (let i = 0; i < symbolCount; i++) {
      const angle = (i / symbolCount) * 360;
      const delay = i * 0.1;
      const symbolVariants = {
        idle: { opacity: 0.3, scale: 0.8 },
        active: { 
          opacity: [0.3, 0.8, 0.3], 
          scale: [0.8, 1, 0.8],
          transition: { 
            duration: 3,
            delay,
            repeat: Infinity,
            repeatType: 'reverse' as const
          }
        }
      };
      
      symbols.push(
        <motion.div 
          key={i}
          initial="idle"
          animate={isActive ? "active" : "idle"}
          variants={symbolVariants}
          className="absolute w-4 h-4 rounded-full bg-blue-400"
          style={{
            top: `calc(50% - 2px)`,
            left: `calc(50% - 2px)`,
            transform: `rotate(${angle}deg) translateY(-${size / 2 + 20}px)`,
          }}
        />
      );
    }
    
    return symbols;
  };

  return (
    <div 
      ref={timepieceRef}
      className="relative"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl z-0"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.${Math.round(glowSize / 10)}) 0%, rgba(16, 24, 39, 0) 70%)`,
          transform: 'scale(1.5)',
        }}
      />
      
      {/* Timepiece container with rotation */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Timepiece image */}
        <div className="relative w-full h-full">
          <img
            src={imagePath}
            alt="Timepiece"
            className="absolute inset-0 w-full h-full"
            style={{ filter: `drop-shadow(0 0 ${glowSize}px rgba(59, 130, 246, 0.7))` }}
          />
          
          {/* Render symbols around the timepiece */}
          {renderSymbols()}
        </div>
      </div>
      
      {/* Energy field (particle effect simulation with CSS) */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full bg-blue-500 rounded-full opacity-10 animate-pulse-slow"
              style={{
                animationDuration: `${2 + i * 0.5}s`,
                animationDelay: `${i * 0.2}s`,
                transform: `scale(${0.5 + i * 0.1})`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 