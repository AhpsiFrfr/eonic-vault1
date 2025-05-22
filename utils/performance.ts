interface AnimationSettings {
  particleCount: number;
  enableGlow: boolean;
  enableBloom: boolean;
  enablePostProcessing: boolean;
}

export const getAnimationSettings = (performanceLevel: 'high' | 'medium' | 'low'): AnimationSettings => {
  switch (performanceLevel) {
    case 'high':
      return {
        particleCount: 5000,
        enableGlow: true,
        enableBloom: true,
        enablePostProcessing: true
      };
    case 'medium':
      return {
        particleCount: 3000,
        enableGlow: true,
        enableBloom: false,
        enablePostProcessing: false
      };
    case 'low':
      return {
        particleCount: 1500,
        enableGlow: false,
        enableBloom: false,
        enablePostProcessing: false
      };
  }
};

export const usePerformanceProfile = (): 'high' | 'medium' | 'low' => {
  // Simple performance detection based on device memory and hardware concurrency
  if (typeof window === 'undefined') return 'medium';

  const memory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  
  if (memory >= 8 && cores >= 8) return 'high';
  if (memory >= 4 && cores >= 4) return 'medium';
  return 'low';
}; 