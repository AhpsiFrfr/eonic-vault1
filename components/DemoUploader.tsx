'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { X } from 'lucide-react';

export function DemoUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileSelect = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
    
    const fileNames = newFiles.map(f => f.name).join(', ');
    setMessage(`Added: ${fileNames}`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg"
      >
        {isOpen ? <X size={24} /> : '📤'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl w-80"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Test File Upload
            </h3>
            
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
            
            {message && (
              <div className="text-sm text-green-600 mb-2 bg-green-50 p-2 rounded">
                {message}
              </div>
            )}
            
            {files.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="text-xs text-gray-600 mb-1 flex justify-between">
                      <span className="truncate">{file.name}</span>
                      <button 
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 