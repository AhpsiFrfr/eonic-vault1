import { motion } from "framer-motion";

export default function TokenChart() {
  // Simulated chart data points
  const dataPoints = [42, 45, 39, 41, 38, 43, 48, 46, 51, 54, 49, 53, 57];
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);
  const range = max - min;
  
  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{ flex: "1 1 60%" }}
    >
      <h2>EONIC Token Performance</h2>
      
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="text-2xl font-bold text-white">$4.70</div>
          <div className="text-green-400 text-sm flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +8.3%
          </div>
        </div>
        <div className="flex space-x-3 text-xs">
          <button className="px-3 py-1 bg-cyan-900/30 rounded-lg text-cyan-400">24H</button>
          <button className="px-3 py-1 rounded-lg text-gray-400">7D</button>
          <button className="px-3 py-1 rounded-lg text-gray-400">1M</button>
          <button className="px-3 py-1 rounded-lg text-gray-400">ALL</button>
        </div>
      </div>
      
      <div className="mt-6 h-40 relative">
        {/* Chart background grid */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-b border-r border-cyan-900/20"></div>
          ))}
        </div>
        
        {/* Chart line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 204, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(0, 204, 255, 0)" />
            </linearGradient>
          </defs>
          
          <motion.path
            d={`M 0,${100 - ((dataPoints[0] - min) / range) * 80} ` + 
               dataPoints.map((point, i) => 
                 `L ${(i+1) * (100 / dataPoints.length)},${100 - ((point - min) / range) * 80}`
               ).join(' ')}
            fill="none"
            stroke="#00CFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          <motion.path
            d={`M 0,${100 - ((dataPoints[0] - min) / range) * 80} ` + 
               dataPoints.map((point, i) => 
                 `L ${(i+1) * (100 / dataPoints.length)},${100 - ((point - min) / range) * 80}`
               ).join(' ') +
               ` L ${100},100 L 0,100 Z`}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          />
        </svg>
        
        {/* Moving dot on latest value */}
        <motion.div 
          className="absolute w-3 h-3 rounded-full bg-cyan-400"
          style={{ 
            right: "0%", 
            top: `${100 - ((dataPoints[dataPoints.length-1] - min) / range) * 80}%`,
            transform: "translate(50%, -50%)",
            boxShadow: "0 0 10px rgba(0, 204, 255, 0.8)"
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <div>JAN</div>
        <div>FEB</div>
        <div>MAR</div>
        <div>APR</div>
        <div>MAY</div>
        <div>JUN</div>
        <div>JUL</div>
      </div>
    </motion.div>
  );
} 