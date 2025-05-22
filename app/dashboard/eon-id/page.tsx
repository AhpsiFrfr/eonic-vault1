'use client';

import React, { useEffect } from 'react';
import { EONIDContainer } from '@/components/EON-ID';
import { useEONIDStore } from '@/state/eonidStore';

export default function EONIDPage() {
  const { fetchProfile, setPerformanceMode } = useEONIDStore();
  
  useEffect(() => {
    // Detect performance capabilities
    const detectPerformance = () => {
      // Check if device has a dedicated GPU
      const hasGPU = 'gpu' in navigator;
      
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check processor cores
      const cores = navigator.hardwareConcurrency || 4;
      
      // Determine performance mode
      if (hasGPU && memory >= 4 && cores >= 4) {
        setPerformanceMode('high');
      } else if (memory >= 2 && cores >= 2) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('low');
      }
    };
    
    detectPerformance();
    
    // Use a mock wallet address for development
    const mockWalletAddress = '0x1234567890123456789012345678901234567890';
    fetchProfile(mockWalletAddress);
  }, [fetchProfile, setPerformanceMode]);
  
  return (
    <div className="min-h-screen bg-black">
      <EONIDContainer 
        userId="0x1234567890123456789012345678901234567890"
        isEditable={true}
        className="min-h-screen"
      />
    </div>
  );
} 