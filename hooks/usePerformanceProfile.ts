import { useState, useEffect } from 'react';

type PerformanceLevel = 'high' | 'medium' | 'low';

export const usePerformanceProfile = (): PerformanceLevel => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('medium');

  useEffect(() => {
    const detectPerformance = () => {
      // Check if device has a dedicated GPU
      const hasGPU = 'gpu' in navigator;
      
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check processor cores
      const cores = navigator.hardwareConcurrency || 4;
      
      // Determine performance mode
      if (hasGPU && memory >= 4 && cores >= 4) {
        setPerformanceLevel('high');
      } else if (memory >= 2 && cores >= 2) {
        setPerformanceLevel('medium');
      } else {
        setPerformanceLevel('low');
      }
    };

    detectPerformance();
  }, []);

  return performanceLevel;
}; 