'use client';

import React from 'react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className || ''}`}
      {...props}
    />
  );
} 