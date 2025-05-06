import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedReactionProps {
  emoji: string;
  position?: { x: number; y: number };
}

export function AnimatedReaction({ emoji, position }: AnimatedReactionProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={emoji}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute text-3xl z-10"
        style={{
          left: position?.x,
          top: position?.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {emoji}
      </motion.div>
    </AnimatePresence>
  );
} 