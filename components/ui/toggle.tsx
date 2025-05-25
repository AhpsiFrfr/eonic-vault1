import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onCheckedChange,
  label,
  size = 'md',
  className
}) => {
  const switchClasses = cn(
    'relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out',
    size === 'sm' ? 'w-9 h-5' : 'w-11 h-6',
    checked ? 'bg-cyan-500' : 'bg-gray-600',
    className
  );

  const handleClasses = cn(
    'inline-block rounded-full bg-white shadow transform transition duration-200 ease-in-out',
    size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
    checked ? 'translate-x-5' : 'translate-x-1'
  );

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={switchClasses}
      >
        <span
          aria-hidden="true"
          className={handleClasses}
        />
      </button>
      {label && (
        <span className={cn('text-gray-300', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {label}
        </span>
      )}
    </div>
  );
}; 