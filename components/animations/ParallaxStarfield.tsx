'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

interface ParallaxStarfieldProps {
  starCount?: number;
  depth?: number;
  width?: number;
  height?: number;
  maxStarSize?: number;
}

export const ParallaxStarfield: React.FC<ParallaxStarfieldProps> = ({
  starCount = 100,
  depth = 3,
  width,
  height,
  maxStarSize = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  // Set initial dimensions after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: width || window.innerWidth,
        height: height || window.innerHeight
      });
    }
  }, [width, height]);

  // Generate stars with random properties
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const generateStars = () => {
      const starArray: Star[] = [];
      const starColors = ['#ffffff', '#efefef', '#d9d9d9', '#c4c4ff', '#a7a7ff'];
      
      for (let i = 0; i < starCount; i++) {
        starArray.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * maxStarSize,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          speed: 0.05 + Math.random() * 0.1, // Different stars move at slightly different speeds
        });
      }
      
      setStars(starArray);
    };
    
    generateStars();
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        const newWidth = width || window.innerWidth;
        const newHeight = height || window.innerHeight;
        
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
        
        setDimensions({ width: newWidth, height: newHeight });
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [dimensions.width, dimensions.height, starCount, maxStarSize]);
  
  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);
  
  // Animation loop
  const animate = (time: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Update and draw stars
    stars.forEach((star, i) => {
      // Calculate parallax offset based on mouse position
      const depthFactor = (i % depth + 1) / depth;
      const parallaxX = (mousePosition.x - dimensions.width / 2) * depthFactor * 0.01;
      const parallaxY = (mousePosition.y - dimensions.height / 2) * depthFactor * 0.01;
      
      // Calculate star position with parallax
      const x = (star.x + parallaxX) % dimensions.width;
      const y = (star.y + parallaxY) % dimensions.height;
      
      // Draw star
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
      
      // Add subtle glow effect
      ctx.beginPath();
      ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 2);
      gradient.addColorStop(0, star.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Set up and clean up animation frame
  useEffect(() => {
    if (stars.length > 0) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [stars, mousePosition]);
  
  // Set up canvas
  useEffect(() => {
    if (canvasRef.current && dimensions.width > 0 && dimensions.height > 0) {
      canvasRef.current.width = dimensions.width;
      canvasRef.current.height = dimensions.height;
    }
  }, [dimensions.width, dimensions.height]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}; 