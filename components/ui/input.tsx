'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glow';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type = 'text', ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-lg border bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-400 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-zinc-600/50 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20',
      glow: 'border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
    };

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input }; 