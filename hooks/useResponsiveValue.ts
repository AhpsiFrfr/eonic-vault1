import { useState, useEffect } from 'react';

type Breakpoints = {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  default: any;
};

const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};

export const useResponsiveValue = <T extends Breakpoints>(values: T): T[keyof T] => {
  const [currentValue, setCurrentValue] = useState(values.default);

  useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth;
      
      if (width >= breakpointValues.xl && values.xl !== undefined) {
        setCurrentValue(values.xl);
      } else if (width >= breakpointValues.lg && values.lg !== undefined) {
        setCurrentValue(values.lg);
      } else if (width >= breakpointValues.md && values.md !== undefined) {
        setCurrentValue(values.md);
      } else if (width >= breakpointValues.sm && values.sm !== undefined) {
        setCurrentValue(values.sm);
      } else if (values.xs !== undefined) {
        setCurrentValue(values.xs);
      } else {
        setCurrentValue(values.default);
      }
    };

    updateValue();
    window.addEventListener('resize', updateValue);
    
    return () => window.removeEventListener('resize', updateValue);
  }, [values]);

  return currentValue;
}; 