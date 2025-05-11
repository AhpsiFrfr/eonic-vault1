import { motion } from "framer-motion";
import Image from "next/image";

export default function NFTGallery() {
  // Mock NFT data
  const nfts = [
    { id: 1, name: "Crystal Fragment #42", img: "/nft-placeholder-1.svg" },
    { id: 2, name: "Cosmic Gateway", img: "/nft-placeholder-2.svg" },
    { id: 3, name: "Quantum Relic", img: "/nft-placeholder-3.svg" },
  ];
  
  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{ flex: "1 1 30%" }}
    >
      <div className="flex justify-between items-center">
        <h2>NFT Collection</h2>
        <motion.button
          className="text-xs text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>
      
      <div className="mt-4 space-y-4">
        {/* This is a fallback for missing images - for production, use real NFT images */}
        {nfts.map((nft, index) => (
          <motion.div 
            key={nft.id}
            className="flex items-center bg-cyan-900/10 p-2 rounded-lg hover:bg-cyan-900/20 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
          >
            <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3 bg-gradient-to-br from-cyan-900/50 to-indigo-900/50">
              <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{nft.name}</div>
              <div className="text-xs text-gray-400">Floor: 0.35 SOL</div>
            </div>
            <div className="text-cyan-400 text-sm">
              1
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 p-3 bg-gradient-to-r from-cyan-900/20 to-indigo-900/20 rounded-lg flex items-center justify-between"
        animate={{ 
          boxShadow: ["0 0 10px rgba(0, 204, 255, 0.1)", "0 0 20px rgba(0, 204, 255, 0.2)", "0 0 10px rgba(0, 204, 255, 0.1)"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-sm">
          <div className="text-white">Collection Value</div>
          <div className="text-cyan-400 font-medium">≈ 3.54 SOL</div>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
} 