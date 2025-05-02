import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import dynamic from 'next/dynamic'
import { WalletButton } from '../components/WalletButton'
import { Toaster } from 'react-hot-toast';

// Add fetch polyfill for Node.js environment
if (typeof global !== 'undefined' && !global.fetch) {
  (global as any).fetch = require('node-fetch')
}

const WalletProvider = dynamic(
  () => import('../components/WalletProvider').then(mod => mod.ClientWalletProvider),
  { ssr: false }
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <WalletButton />
      <Component {...pageProps} />
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
    </WalletProvider>
  )
}
