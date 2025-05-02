import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import dynamic from 'next/dynamic'
import { WalletButton } from '../components/WalletButton'

const WalletProvider = dynamic(
  () => import('../components/WalletProvider').then(mod => mod.ClientWalletProvider),
  { ssr: false }
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <WalletButton />
      <Component {...pageProps} />
    </WalletProvider>
  )
}
