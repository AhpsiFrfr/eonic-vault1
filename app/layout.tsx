'use client';

import { ClientWalletProvider } from '../components/WalletProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ReactionAnimationsContainer } from '../components/ReactionAnimationsContainer';
import { DemoUploader } from '../components/DemoUploader';
import { Toaster } from 'react-hot-toast';
import { Inter, Orbitron } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' blob: ws:; worker-src 'self' blob:;" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientWalletProvider>
            {children}
            <ReactionAnimationsContainer />
            <DemoUploader />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1E1E2A',
                  color: '#fff',
                  border: '1px solid #444',
                },
                success: {
                  iconTheme: {
                    primary: '#00d8ff',
                    secondary: '#1E1E2A',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#1E1E2A',
                  },
                },
              }}
            />
          </ClientWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
