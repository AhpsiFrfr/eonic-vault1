'use client';

import { useState } from 'react'
import { motion } from 'framer-motion'

const walletOptions = [
  { name: 'Phantom', icon: '/images/wallets/phantom-ship.png' },
  { name: 'Backpack', icon: '/images/wallets/backpack-ship.png' },
  { name: 'MetaMask', icon: '/images/wallets/metamask-ship.png' },
  { name: 'Solflare', icon: '/images/wallets/solflare-ship.png' },
  { name: 'Coinbase', icon: '/images/wallets/coinbase-ship.png' },
  { name: 'Guest Mode', icon: '/images/wallets/guest-ship.png' },
  { name: 'XNFT', icon: '/images/wallets/xnft-ship.png' },
]

export default function LoginAnimation() {
  const [showShips, setShowShips] = useState(false)

  const handleClick = () => {
    setShowShips(true)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 relative bg-black text-white overflow-hidden">
      <motion.img
        src="/images/eonic-vault-ship.png"
        alt="Vault Ship"
        className="w-40"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <motion.button
        onClick={handleClick}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Connect Wallet
      </motion.button>

      {showShips && (
        <div className="flex gap-8 mt-6">
          {walletOptions.map((wallet, index) => (
            <motion.div
              key={wallet.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 120 }}
              className="flex flex-col items-center"
            >
              <img src={wallet.icon} alt={wallet.name} className="w-20 h-20 object-contain" />
              <p className="text-sm mt-2">{wallet.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 