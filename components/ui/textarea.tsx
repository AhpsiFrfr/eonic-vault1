'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glow';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = 'w-full rounded-lg border bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-400 resize-none transition-all duration-200 focus:outline-none scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent';
    
    const variants = {
      default: 'border-zinc-600/50 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20',
      glow: 'border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
    };

    return (
      <textarea
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

Textarea.displayName = 'Textarea';

export { Textarea }; 