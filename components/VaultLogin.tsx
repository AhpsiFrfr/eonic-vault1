'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'
import { useRouter } from 'next/navigation'
import WarpTransition from './WarpTransition'

const ships = [
  { name: 'Phantom', src: '/images/wallets/phantom-ship.png', walletType: 'phantom' as WalletName },
  { name: 'Solflare', src: '/images/wallets/solflare-ship.png', walletType: 'solflare' as WalletName },
  { name: 'Torus', src: '/images/wallets/torus-ship.png', walletType: 'torus' as WalletName },
  { name: 'Ledger', src: '/images/wallets/ledger-ship.png', walletType: 'ledger' as WalletName },
  { name: 'Clover', src: '/images/wallets/clover-ship.png', walletType: 'clover' as WalletName },
  { name: 'Solong', src: '/images/wallets/solong-ship.png', walletType: 'solong' as WalletName },
]

export default function VaultLogin() {
  const [vaultIn, setVaultIn] = useState(false)
  const [shipsLaunched, setShipsLaunched] = useState(false)
  const [showWarp, setShowWarp] = useState(false)
  const { select, connected } = useWallet()
  const router = useRouter()

  const handleConnect = () => {
    setVaultIn(true)
    setTimeout(() => {
      setShipsLaunched(true)
    }, 1600) // delay ship launch after vault lands + pulses
  }

  const handleWalletSelect = async (walletType: WalletName) => {
    try {
      // Select the wallet
      await select(walletType)
      
      // Show warp transition
      setShowWarp(true)
      
      // The WarpTransition component will handle the navigation to dashboard
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  // If already connected, show warp transition
  if (connected && !showWarp) {
    setShowWarp(true)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
      {/* Warp Transition */}
      <WarpTransition visible={showWarp} />

      {/* Vault Ship Glow Trail */}
      {!vaultIn && (
        <motion.div
          className="absolute left-1/2 top-0 w-32 h-80 -translate-x-1/2 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.6 }}
          style={{ filter: 'blur(18px)' }}
        >
          <div className="w-full h-full bg-gradient-to-b from-cyan-400/60 via-blue-500/30 to-transparent rounded-full" />
        </motion.div>
      )}

      {/* V A U L T */}
      <div className="relative flex items-center justify-center">
        {/* Charge-up Energy Overlay */}
        {vaultIn && (
          <motion.div
            className="absolute w-40 h-40 rounded-full z-30"
            animate={{
              boxShadow: [
                '0 0 40px 10px #00eaff99, 0 0 80px 30px #00eaff33',
                '0 0 80px 30px #00eaffcc, 0 0 120px 60px #00eaff44',
                '0 0 40px 10px #00eaff99, 0 0 80px 30px #00eaff33',
              ],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: 0, top: 0 }}
          />
        )}
        {/* Circuit/Glyph Overlay */}
        {vaultIn && (
          <motion.div
            className="absolute w-40 h-40 rounded-full z-40 pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'repeating-radial-gradient(circle, #00eaff33 0px, #00eaff33 2px, transparent 3px, transparent 12px)',
              mixBlendMode: 'screen',
              left: 0,
              top: 0,
            }}
          />
        )}
        <motion.img
          src="/images/eonic-vault-ship.png"
          alt="Vault"
          initial={{ y: -300, opacity: 0, scale: 0.8 }}
          animate={vaultIn ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-40 mb-4 relative z-20"
        />
      </div>

      {/* Vault Levitation Pulse */}
      {vaultIn && (
        <motion.div
          className="absolute w-52 h-52 rounded-full border border-blue-500 opacity-20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ top: 'calc(50% - 100px)' }}
        />
      )}

      {/* Connect Wallet Button */}
      {!vaultIn && (
        <motion.button
          onClick={handleConnect}
          className="bg-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105"
          whileTap={{ scale: 0.95 }}
        >
          Connect Wallet
        </motion.button>
      )}

      {/* W A L L E T S */}
      {shipsLaunched && (
        <motion.div
          className="flex gap-6 mt-12 flex-wrap justify-center max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {ships.map((ship, idx) => (
            <motion.div
              key={ship.name}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.8 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              className="flex flex-col items-center relative cursor-pointer"
              whileHover={{ scale: 1.08 }}
              onClick={() => handleWalletSelect(ship.walletType)}
            >
              {/* Ship Glow Trail */}
              <motion.div
                className="absolute left-1/2 top-1/2 w-16 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                style={{ filter: 'blur(12px)' }}
              >
                <div className="w-full h-full bg-gradient-to-b from-cyan-400/60 via-blue-500/30 to-transparent rounded-full" />
              </motion.div>
              <motion.img
                src={ship.src}
                alt={ship.name}
                className="w-20 h-20 relative z-10"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <p className="text-sm mt-2 relative z-10">{ship.name}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
} 