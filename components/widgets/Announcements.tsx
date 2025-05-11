import { motion } from "framer-motion";

export default function Announcements() {
  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: "Timepiece Evolution Incoming",
      content: "Your Genesis Timepiece is ready to evolve. Access the Evolution Chamber in 14 days.",
      important: true
    },
    {
      id: 2,
      title: "Quantum Rewards Program",
      content: "Stake 100+ $EONIC tokens to participate in the upcoming Quantum Rewards distribution.",
      important: false
    },
    {
      id: 3,
      title: "Vault Security Update",
      content: "Updated security protocols implemented for enhanced protection of your digital assets.",
      important: false
    }
  ];
  
  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      style={{ flex: "1 1 30%" }}
    >
      <div className="flex items-center">
        <h2>Announcements</h2>
        <div className="ml-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      </div>
      
      <div className="mt-6 space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div 
            key={announcement.id}
            className={`p-3 rounded-lg border-l-2 ${announcement.important ? 'border-cyan-400 bg-cyan-900/20' : 'border-blue-800/30 bg-blue-900/10'}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
          >
            <div className="flex items-center">
              {announcement.important && (
                <motion.div 
                  className="mr-2 text-cyan-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </motion.div>
              )}
              <h3 className={`font-medium ${announcement.important ? 'text-cyan-400' : 'text-white'}`}>
                {announcement.title}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mt-1">{announcement.content}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        className="mt-4 w-full py-2 rounded-lg bg-cyan-900/20 text-cyan-400 text-sm font-medium border border-cyan-800/30"
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 0 15px rgba(0, 204, 255, 0.3)",
          borderColor: "rgba(0, 204, 255, 0.5)"  
        }}
        whileTap={{ scale: 0.98 }}
      >
        View All Announcements
      </motion.button>
    </motion.div>
  );
} 