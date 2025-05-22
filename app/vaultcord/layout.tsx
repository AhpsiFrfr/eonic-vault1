'use client';

import { ThemeProvider } from '@/context/ThemeContext';

export default function VaultcordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-cosmic-darker text-cosmic-light">
        {children}
      </div>
    </ThemeProvider>
  );
} 