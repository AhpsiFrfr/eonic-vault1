import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default';

interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'default';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  if (width >= breakpoints.xs) return 'xs';
  return 'default';
};

export const useResponsiveValue = <T>(values: ResponsiveValue<T>): T => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('default');
  
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Return the value for the current breakpoint, falling back to the next smallest breakpoint
  const getValueForBreakpoint = (bp: Breakpoint): T => {
    if (values[bp] !== undefined) return values[bp] as T;
    
    switch (bp) {
      case 'xl':
        return getValueForBreakpoint('lg');
      case 'lg':
        return getValueForBreakpoint('md');
      case 'md':
        return getValueForBreakpoint('sm');
      case 'sm':
        return getValueForBreakpoint('xs');
      case 'xs':
        return values.default;
      default:
        return values.default;
    }
  };
  
  return getValueForBreakpoint(breakpoint);
}; 