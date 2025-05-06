import { motion } from 'framer-motion';

interface StickerPickerModalProps {
  onClose: () => void;
  onSelect: (stickerId: string) => void;
}

export function StickerPickerModal({ onClose, onSelect }: StickerPickerModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select a Sticker</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        {/* Implement sticker grid here */}
      </div>
    </motion.div>
  );
} 