'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { setWalletCookie } from '@/utils/auth'
import WarpTransition from '../../components/WarpTransition'
import HyperspaceTransition from '../../components/HyperspaceTransition'
import Image from 'next/image'

const walletShips = [
  { name: 'Phantom', src: '/images/wallets/phantom-ship.png', adapter: 'Phantom' },
  { name: 'Backpack', src: '/images/wallets/backpack-ship.png', adapter: 'Backpack' },
  { name: 'MetaMask', src: '/images/wallets/metamask-ship.png', adapter: 'MetaMask' },
  { name: 'Solflare', src: '/images/wallets/solflare-ship.png', adapter: 'Solflare' },
  { name: 'Coinbase', src: '/images/wallets/coinbase-ship.png', adapter: 'Coinbase' },
  { name: 'Guest Mode', src: '/images/wallets/guest-ship.png', adapter: null },
  { name: 'xNFT', src: '/images/wallets/xnft-ship.png', adapter: 'xNFT' },
]

export default function VaultLoginPage() {
  const router = useRouter()
  const { wallets, select, connect, connected, wallet, publicKey } = useWallet()
  const [selectedAdapter, setSelectedAdapter] = useState<string | null>(null)
  const [vaultArrived, setVaultArrived] = useState(false)
  const [shipsReady, setShipsReady] = useState(false)
  const [selectedShip, setSelectedShip] = useState<string | null>(null)
  const [showWarp, setShowWarp] = useState(false)
  const [vaultHover, setVaultHover] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [initializing, setInitializing] = useState(false)

  // Handle successful wallet connection
  useEffect(() => {
    if (connected && publicKey && !transitioning && !isConnecting) {
      try {
        const walletAddress = publicKey.toString()
        console.log('Wallet connected:', walletAddress)
        
        // Set the wallet cookie for middleware
        setWalletCookie(walletAddress)
        
        // Start enhanced loading screen
        setInitializing(true)
        setTimeout(() => {
          setTransitioning(true)
          setTimeout(() => {
            router.push('/dashboard')
          }, 1800)
        }, 2000)
      } catch (err) {
        console.error('Error handling wallet connection:', err)
        setError('Failed to process wallet connection')
        setIsConnecting(false)
      }
    }
  }, [connected, publicKey, transitioning, isConnecting, router])

  const playExitAnimation = () => {
    setInitializing(true)
    setTimeout(() => {
      setTransitioning(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1800)
    }, 2000)
  }

  const handleShipClick = async (adapterName: string | null) => {
    if (isConnecting) return // Prevent multiple clicks
    
    if (adapterName === null) {
      // Guest mode - set a placeholder wallet and proceed
      setWalletCookie('guest-mode')
      playExitAnimation()
      return
    }

    try {
      setIsConnecting(true)
      setError(null)
      
      // Find the wallet adapter
      const match = wallets.find(w => w.adapter.name === adapterName)
      if (!match) {
        setError(`Wallet ${adapterName} not found. Please install it first.`)
        setIsConnecting(false)
        return
      }

      // Select the wallet first
      setSelectedAdapter(adapterName)
      setSelectedShip(adapterName)
      select(match.adapter.name)

      // Wait for wallet to be selected
      await new Promise(resolve => setTimeout(resolve, 200))

      // Now try to connect
      if (!connected) {
        console.log('Attempting to connect to', adapterName)
        await connect()
      }

      // If we reach here and not connected, there might be an issue
      if (!connected) {
        setError('Connection failed. Please try again or check if your wallet is unlocked.')
        setIsConnecting(false)
        setSelectedAdapter(null)
        setSelectedShip(null)
      }

    } catch (err) {
      console.error('Wallet connection error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      
      // Handle specific error types
      if (errorMessage.includes('User rejected')) {
        setError('Connection cancelled. Please try again.')
      } else if (errorMessage.includes('not installed')) {
        setError(`Please install the ${adapterName} wallet extension.`)
      } else {
        setError(errorMessage)
      }
      
      setIsConnecting(false)
      setSelectedAdapter(null)
      setSelectedShip(null)
    }
  }

  useEffect(() => {
    const vaultTimer = setTimeout(() => setVaultArrived(true), 500)
    const shipsTimer = setTimeout(() => setShipsReady(true), 1400)
    return () => {
      clearTimeout(vaultTimer)
      clearTimeout(shipsTimer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative overflow-hidden">
      {/* Warp Transition */}
      <WarpTransition visible={showWarp} />

      {/* Enhanced Loading Screen */}
      {initializing && !transitioning && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white animate-fade-in">
          <div className="relative mb-8">
            <Image
              src="/vault-core.png"
              alt="Vault Core Seal"
              width={160}
              height={160}
              className="animate-pulse drop-shadow-[0_0_30px_cyan]"
            />
            <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/30" />
            <div className="absolute inset-0 rounded-full animate-spin bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-xl font-mono text-cyan-300 tracking-widest animate-pulse">
              Initializing Vault Access…
            </p>
            <p className="text-sm text-white/60">
              Connecting to {selectedShip || 'Guest Mode'}
            </p>
            
            {/* Loading progress bar */}
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Original Spaceship Design */}
      {!initializing && (
        <>
          {/* Eonic Vault Ship Glow & Ship */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Animated Glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18rem] h-[18rem] rounded-full pointer-events-none z-0"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{
                opacity: 0.85,
                scale: 1.08,
                boxShadow: '0 0 80px 40px #00eaffcc, 0 0 160px 80px #00eaff44',
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle, #00eaff55 0%, #00eaff22 60%, transparent 100%)',
                filter: 'blur(32px)',
              }}
            />
            {/* Ship - Using regular img instead of motion.img */}
            <motion.div
              initial={{ y: -300, opacity: 0, scale: 0.8 }}
              animate={vaultArrived
                ? shipsReady
                  ? { y: [0, -12, 0, 12, 0], opacity: 1, scale: 1.5 }
                  : { y: 0, opacity: 1, scale: 1.5 }
                : {}}
              transition={vaultArrived
                ? shipsReady
                  ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 1, ease: 'easeOut' }
                : {}}
              className="w-40 md:w-[15rem] z-10 drop-shadow-[0_0_60px_#00eaff99]"
            >
              <img
                src="/images/eonic-vault-ship.png"
                alt="Eonic Vault"
                className="w-full h-auto"
              />
            </motion.div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Connect Prompt */}
          {!vaultArrived && (
            <motion.button
              disabled
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg opacity-50 cursor-not-allowed"
            >
              Initializing...
            </motion.button>
          )}

          {/* Ship Selector */}
          {shipsReady && (
            <div className="flex flex-wrap gap-6 mt-10 justify-center max-w-6xl">
              {walletShips.map((ship, i) => (
                <motion.div
                  key={ship.name}
                  className="flex flex-col items-center relative cursor-pointer"
                  onClick={() => handleShipClick(ship.adapter)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.22 }}
                >
                  {/* Ship Glow Trail */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 w-16 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1, scale: 1.18 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    style={{ filter: 'blur(18px)' }}
                  >
                    <div className="w-full h-full bg-gradient-to-b from-cyan-400/60 via-blue-500/30 to-transparent rounded-full" />
                  </motion.div>
                  {/* Using regular img with motion wrapper instead of motion.img */}
                  <motion.div
                    className="w-20 h-20 relative z-10"
                    animate={{
                      y: [0, -8, 0, 8, 0],
                    }}
                    transition={{
                      duration: 3.5 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <img
                      src={ship.src}
                      alt={ship.name}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  <p className="text-sm mt-2 relative z-10">{ship.name}</p>
                  {selectedAdapter === ship.adapter && (
                    <motion.div
                      className="absolute inset-0 border-2 border-cyan-400 rounded-lg"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <HyperspaceTransition show={transitioning} />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
