import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  size = 'md'
}) => {
  const switchClasses = `
    ${size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'}
    relative inline-flex items-center rounded-full cursor-pointer
    ${checked ? 'bg-cyan-500' : 'bg-gray-600'}
    transition-colors duration-200 ease-in-out
  `;

  const handleClasses = `
    ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}
    ${checked ? 'translate-x-5' : 'translate-x-1'}
    inline-block rounded-full bg-white shadow
    transform transition duration-200 ease-in-out
  `;

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={switchClasses}
      >
        <span
          aria-hidden="true"
          className={handleClasses}
        />
      </button>
      {label && (
        <span className={`text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {label}
        </span>
      )}
    </div>
  );
}; 