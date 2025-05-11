'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedReactionProps {
  emoji: string;
  position?: { x: number; y: number };
  animationType?: 'float' | 'burst' | 'bounce' | 'spin';
  size?: number;
}

// Helper function to get random number between min and max
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

export function AnimatedReaction({ 
  emoji, 
  position, 
  animationType = 'float',
  size = 1.2
}: AnimatedReactionProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  // Create particles when the emoji appears
  useEffect(() => {
    // For burst animation, create more particles
    const particleCount = animationType === 'burst' ? 12 : 6;
    const particleDistance = animationType === 'burst' ? 40 : 20;
    
    const newParticles = Array.from({ length: particleCount }).map((_, index) => ({
      id: index,
      x: getRandom(-particleDistance, particleDistance),
      y: getRandom(-particleDistance, particleDistance)
    }));
    
    setParticles(newParticles);
  }, [animationType]);

  // Animation variants based on animation type
  const getMainAnimationVariants = () => {
    // Increase scale values based on size prop
    const baseScale = size;
    const maxScale = baseScale * 1.5;
    
    switch (animationType) {
      case 'burst':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { 
            scale: [0, maxScale, baseScale * 1.3], 
            opacity: [0, 1, 0.8] 
          },
          exit: { scale: maxScale * 1.5, opacity: 0 },
          transition: { 
            duration: 1.2,
            times: [0, 0.5, 1],
            ease: "easeOut"
          }
        };
        
      case 'bounce':
        return {
          initial: { scale: 0, opacity: 0, y: 0 },
          animate: { 
            scale: [0, baseScale * 1.2, baseScale], 
            opacity: 1,
            y: [0, -30, 0, -15, 0]
          },
          exit: { scale: baseScale * 0.5, opacity: 0, y: 20 },
          transition: { 
            duration: 1.5,
            times: [0, 0.4, 0.6, 0.8, 1],
            ease: "easeOut"
          }
        };
        
      case 'spin':
        return {
          initial: { scale: 0, opacity: 0, rotate: 0 },
          animate: { 
            scale: [0, baseScale * 1.5, baseScale * 1.2], 
            opacity: 1,
            rotate: [0, 360]
          },
          exit: { scale: baseScale * 0.5, opacity: 0, rotate: 720 },
          transition: { 
            duration: 1.5,
            ease: "easeOut"
          }
        };
        
      case 'float':
      default:
        return {
          initial: { scale: 0, opacity: 0, y: 0 },
          animate: { 
            scale: [0, baseScale * 1.3, baseScale * 1.1], 
            opacity: [0, 1, 1],
            y: [0, -40]
          },
          exit: { scale: baseScale * 0.9, opacity: 0, y: -60 },
          transition: { 
            duration: 1.5,
            times: [0, 0.6, 1],
            ease: "easeOut"
          }
        };
    }
  };

  const getParticleAnimationVariants = (particle: {id: number, x: number, y: number}) => {
    switch (animationType) {
      case 'burst':
        return {
          initial: { 
            scale: 0.6, 
            opacity: 0.9,
            x: 0,
            y: 0,
            rotate: 0
          },
          animate: { 
            scale: 0,
            opacity: 0,
            x: particle.x * 2,
            y: particle.y * 2,
            rotate: getRandom(-180, 180)
          },
          transition: { 
            duration: 1.5,
            ease: "easeOut"
          }
        };
        
      case 'spin':
        return {
          initial: { 
            scale: 0.5, 
            opacity: 0.7,
            x: 0,
            y: 0,
            rotate: 0
          },
          animate: { 
            scale: 0,
            opacity: 0,
            x: particle.x * 1.5,
            y: particle.y * 1.5,
            rotate: getRandom(-540, 540)
          },
          transition: { 
            duration: 1.8,
            ease: "easeOut"
          }
        };
        
      case 'bounce':
      case 'float':
      default:
        return {
          initial: { 
            scale: 0.4, 
            opacity: 0.8,
            x: 0,
            y: 0,
            rotate: 0
          },
          animate: { 
            scale: 0,
            opacity: 0,
            x: particle.x,
            y: particle.y,
            rotate: getRandom(-180, 180)
          },
          transition: { 
            duration: 1.5,
            ease: "easeOut"
          }
        };
    }
  };

  const mainAnimationProps = getMainAnimationVariants();

  return (
    <AnimatePresence>
      <motion.div
        key={`main-${emoji}-${animationType}`}
        initial={mainAnimationProps.initial}
        animate={mainAnimationProps.animate}
        exit={mainAnimationProps.exit}
        transition={mainAnimationProps.transition}
        className="absolute text-5xl z-10 filter drop-shadow-lg"
        style={{
          left: position?.x ?? window.innerWidth / 2,
          top: position?.y ?? window.innerHeight / 2,
          transform: 'translate(-50%, -50%)',
          fontSize: `${Math.max(2.5, 2 * size)}rem`
        }}
      >
        {emoji}
        
        {/* Particle effects */}
        <AnimatePresence>
          {particles.map(particle => {
            const particleProps = getParticleAnimationVariants(particle);
            return (
              <motion.div
                key={`particle-${particle.id}`}
                initial={particleProps.initial}
                animate={particleProps.animate}
                transition={particleProps.transition}
                className="absolute top-1/2 left-1/2 text-xl"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
} 