import { motion } from "framer-motion";

export default function NewsFeed() {
  // Mock news data
  const newsItems = [
    {
      id: 1,
      title: "EONIC Protocol Upgrade v2.1",
      summary: "Major improvements to staking rewards and transaction speed.",
      date: "2 hours ago",
      category: "Protocol"
    },
    {
      id: 2,
      title: "Community Vote Results: Expansion Plan Approved",
      summary: "The community has approved the expansion of EONIC to Arbitrum.",
      date: "1 day ago",
      category: "Governance"
    },
    {
      id: 3,
      title: "New Partnership with Quantum Finance",
      summary: "Strategic partnership to bring DeFi innovations to EONIC ecosystem.",
      date: "3 days ago",
      category: "Partnerships"
    },
    {
      id: 4,
      title: "EONIC Listed on Galaxy Exchange",
      summary: "New trading pairs available: EONIC/USDC and EONIC/ETH.",
      date: "4 days ago",
      category: "Listings"
    }
  ];
  
  // Container animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Child item animation
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      style={{ flex: "1 1 60%" }}
    >
      <div className="flex justify-between items-center">
        <h2>EONIC News Feed</h2>
        <div className="flex space-x-2">
          <motion.button
            className="w-8 h-8 rounded-md flex items-center justify-center bg-cyan-900/20 text-cyan-400"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 204, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </motion.button>
          <motion.button
            className="w-8 h-8 rounded-md flex items-center justify-center bg-cyan-900/20 text-cyan-400"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 204, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        className="mt-6 space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {newsItems.map(news => (
          <motion.div 
            key={news.id} 
            className="bg-cyan-900/10 p-3 rounded-lg hover:bg-cyan-900/20 transition-colors"
            variants={item}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400">{news.category}</span>
              <span className="text-xs text-gray-400">{news.date}</span>
            </div>
            <h3 className="text-white font-medium mt-2">{news.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{news.summary}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 