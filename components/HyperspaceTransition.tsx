'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function HyperspaceTransition({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-full h-full bg-gradient-radial from-white/10 via-indigo-600 to-black opacity-60 animate-pulse"
            initial={{ scale: 0.9, rotate: 0 }}
            animate={{ scale: 1.5, rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
} 