import { useEffect } from 'react';
import { gsap } from 'gsap';

interface PulseAnimationConfig {
  duration: number;
  delay: number;
  repeat: number;
  active?: boolean;
}

export const usePulseAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  config: PulseAnimationConfig
) => {
  useEffect(() => {
    if (!elementRef.current || (config.active === false)) return;
    
    const element = elementRef.current;
    
    const timeline = gsap.timeline({
      repeat: config.repeat,
      delay: config.delay
    });
    
    timeline.to(element, {
      boxShadow: '0 0 20px rgba(28, 69, 244, 0.7), 0 0 40px rgba(28, 69, 244, 0.4)',
      duration: config.duration / 2,
      ease: 'power1.out'
    }).to(element, {
      boxShadow: '0 0 5px rgba(28, 69, 244, 0.3), 0 0 10px rgba(28, 69, 244, 0.1)',
      duration: config.duration / 2,
      ease: 'power1.in'
    });
    
    return () => {
      timeline.kill();
    };
  }, [elementRef, config]);
}; 