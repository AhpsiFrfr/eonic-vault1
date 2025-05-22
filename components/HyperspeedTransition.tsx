"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const STAR_STREAKS = 64;
const streaks = Array.from({ length: STAR_STREAKS }, (_, i) => ({
  angle: (360 / STAR_STREAKS) * i + Math.random() * 6,
  left: 49 + Math.random() * 2,
  top: 49 + Math.random() * 2,
  length: 320 + Math.random() * 180,
  opacity: 0.5 + Math.random() * 0.5,
  width: 1.2 + Math.random() * 2.2,
  delay: Math.random() * 0.18,
}));

export default function HyperspeedTransition({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cosmic background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e2a] via-[#1a1440] to-[#0a0e2a]">
            <div className="absolute inset-0 bg-gradient-radial from-blue-900/60 via-transparent to-black/90" />
          </div>

          {/* Intense radial burst: core + rays */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 1200, height: 1200, zIndex: 2, background: 'radial-gradient(circle, #fffbe6 0%, #ffe066 20%, #ffb800 40%, #ffb80000 80%)', filter: 'blur(24px)' }}
            initial={{ scale: 0.7, opacity: 0.18 }}
            animate={{ scale: [0.7, 1.2, 1.7], opacity: [0.18, 0.7, 0.1] }}
            exit={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
          {/* Extra sharp burst rays (SVG) */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            width={900}
            height={900}
            style={{ zIndex: 3 }}
          >
            {[...Array(24)].map((_, i) => {
              const angle = (360 / 24) * i;
              const length = 420 + Math.random() * 120;
              const x2 = 450 + Math.cos((angle * Math.PI) / 180) * length;
              const y2 = 450 + Math.sin((angle * Math.PI) / 180) * length;
              return (
                <motion.line
                  key={i}
                  x1={450}
                  y1={450}
                  x2={x2}
                  y2={y2}
                  stroke="#ffe066"
                  strokeWidth={2.5 + Math.random() * 2}
                  strokeLinecap="round"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 0.8, 0] }}
                  transition={{ duration: 1.1, delay: 0.1 + Math.random() * 0.2, ease: 'easeInOut' }}
                />
              );
            })}
          </svg>

          {/* Star tunnel streaks */}
          {streaks.map((s, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full pointer-events-none"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.width,
                height: s.length,
                opacity: s.opacity,
                zIndex: 10,
                transform: `rotate(${s.angle}deg)`,
                filter: 'blur(1.2px)',
              }}
              initial={{ scaleY: 0.5, opacity: 0.2 }}
              animate={{ scaleY: [0.5, 2.2, 3.2], opacity: [0.2, 1, 0] }}
              exit={{ opacity: 0, scaleY: 3.8 }}
              transition={{ duration: 1.2, delay: s.delay, ease: 'easeInOut' }}
            />
          ))}

          {/* Ripple wave */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: 600, height: 600, zIndex: 20, border: '2px solid #ffe066', filter: 'blur(8px)' }}
            initial={{ scale: 0.7, opacity: 0.2 }}
            animate={{ scale: [0.7, 1.5, 2.5], opacity: [0.2, 0.5, 0] }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Optional wormhole ring pulse */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/80 pointer-events-none"
            style={{ width: 340, height: 340, zIndex: 30, filter: 'blur(2px)' }}
            initial={{ scale: 1, opacity: 0.2 }}
            animate={{ scale: [1, 0.7, 0.2], opacity: [0.2, 0.7, 0] }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />

          {/* EONIC logo core */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ zIndex: 50 }}
            initial={{ scale: 1, opacity: 0.7, filter: 'blur(0px)' }}
            animate={{ scale: [1, 1.2, 6], opacity: [0.7, 1, 0], filter: ['blur(0px)', 'blur(2px)', 'blur(12px)'] }}
            exit={{ opacity: 0, scale: 7 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          >
            <Image
              src="/images/eonic-logo.png"
              alt="EONIC Logo"
              width={220}
              height={220}
              className="drop-shadow-[0_0_60px_#ffe066cc]"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 