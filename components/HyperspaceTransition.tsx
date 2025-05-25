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
          transition={{ duration: 0.8 }}
        >
          {/* Simple fade in black - no spinning animation */}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 