'use client';

import { ThemeProvider } from '@/context/ThemeContext';

export default function VaultcordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#0e1525] text-white">
        {children}
      </div>
    </ThemeProvider>
  );
} 