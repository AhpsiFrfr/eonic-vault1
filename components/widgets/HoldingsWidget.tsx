import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HoldingsWidget() {
  const [eonicBalance, setEonicBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Demo: Replace with actual wallet sync logic
    const fakeBalance = 77777.0;
    const loadTimer = setTimeout(() => {
      setEonicBalance(fakeBalance);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadTimer);
  }, []);

  // Calculate USD value (mock conversion rate: 1 EONIC = $4.7)
  const usdValue = eonicBalance * 4.7;

  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-sm mb-1">EONIC Holdings</h2>
      <div className="flex items-center">
        <div className="rounded-full bg-cyan-900/30 w-12 h-12 flex items-center justify-center mr-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00CFFF" strokeWidth="1.5" />
            <path d="M7.5 12H16.5M9 7.5L15 16.5M15 7.5L9 16.5" stroke="#00CFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {isLoading ? (
          <div className="h-10 flex items-center">
            <motion.div 
              className="h-2 w-28 bg-cyan-900/30 rounded-full overflow-hidden"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        ) : (
          <div>
            <motion.div 
              className="text-xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {eonicBalance.toLocaleString()} $EONIC
            </motion.div>
            <motion.div 
              className="text-cyan-400 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </motion.div>
          </div>
        )}
      </div>
      <div className="mt-3 text-xs">
        <div className="flex justify-between text-gray-400 mb-1.5">
          <span>Staked:</span>
          <span className="text-white">{isLoading ? '...' : `${Math.floor(eonicBalance * 0.6).toLocaleString()} $EONIC`}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Available:</span>
          <span className="text-white">{isLoading ? '...' : `${Math.floor(eonicBalance * 0.4).toLocaleString()} $EONIC`}</span>
        </div>
        
        {/* APY indicator */}
        <motion.div 
          className="mt-2 p-1.5 rounded-lg bg-green-900/20 border border-green-700/20 flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-gray-300">Staking APY</span>
          <span className="text-green-400 font-medium">12.5%</span>
        </motion.div>
      </div>
    </motion.div>
  );
} 