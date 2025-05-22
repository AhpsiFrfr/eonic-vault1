'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

export const DashboardContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Background particle effect setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Three.js setup for ambient background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x1C45F4, // Egyptian Blue glow
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);
  
  return (
    <div className="relative min-h-screen bg-obsidian overflow-hidden">
      {/* Background canvas for particles */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 52, 166, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 52, 166, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Sacred geometry overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="200" fill="none" stroke="#F5D16F" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="300" fill="none" stroke="#F5D16F" strokeWidth="0.5" />
          <polygon 
            points="400,100 650,300 550,600 250,600 150,300" 
            fill="none" 
            stroke="#F5D16F" 
            strokeWidth="0.5" 
          />
          {/* Additional sacred geometry elements */}
          <path
            d="M400,100 L400,700 M100,400 L700,400"
            stroke="#F5D16F"
            strokeWidth="0.3"
            opacity="0.5"
          />
          <circle cx="400" cy="400" r="150" fill="none" stroke="#F5D16F" strokeWidth="0.3" opacity="0.7" />
          <polygon
            points="400,250 550,400 400,550 250,400"
            fill="none"
            stroke="#F5D16F"
            strokeWidth="0.3"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Main content container */}
      <motion.div 
        ref={containerRef}
        className="relative z-20 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 