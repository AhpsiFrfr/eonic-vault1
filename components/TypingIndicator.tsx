import React from "react";
import { motion } from "framer-motion";

interface TypingIndicatorProps {
  user: string;
}

export const TypingIndicator = ({ user }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2 text-gray-400 mt-2 mb-4">
      <span className="text-sm font-medium">{user} is typing</span>
      <motion.div 
        className="flex space-x-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
      </motion.div>
    </div>
  );
}; 