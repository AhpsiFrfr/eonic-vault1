'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const walletShips = [
  { label: 'Phantom', src: '/images/wallets/phantom-ship.png' },
  { label: 'Backpack', src: '/images/wallets/backpack-ship.png' },
  { label: 'Guest Mode', src: '/images/wallets/guest-ship.png' },
  { label: 'xNFT', src: '/images/wallets/xnft-ship.png' },
]

export default function LoginShips() {
  const [launched, setLaunched] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      <motion.img
        src="/images/eonic-vault-ship.png"
        alt="Eonic Vault"
        className="w-40 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <motion.button
        onClick={() => setLaunched(true)}
        className="bg-indigo-600 px-6 py-2 rounded-xl text-white text-lg font-semibold shadow-md hover:scale-105"
        whileTap={{ scale: 0.95 }}
      >
        Connect Wallet
      </motion.button>

      {launched && (
        <div className="flex gap-10 mt-12">
          {walletShips.map((ship, i) => (
            <motion.div
              key={ship.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <img src={ship.src} alt={ship.label} className="w-24 h-24 object-contain" />
              <p className="mt-2 text-sm">{ship.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 