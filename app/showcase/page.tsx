'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactionAnimation } from '../../hooks/useReactionAnimation';
import { AnimatedReaction } from '../../components/AnimatedReaction';
import { GifPicker } from '../../components/GifPicker';
import { FileUpload } from '../../components/FileUpload';

const emojis = ['❤️', '👍', '🙌', '😂', '😭', '🔥', '🎉'];
const animationTypes = ['float', 'burst', 'bounce', 'spin'] as const;

export default function ShowcasePage() {
  const { addReaction } = useReactionAnimation();
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeEmoji, setActiveEmoji] = useState<{emoji: string, type: typeof animationTypes[number]} | null>(null);

  const triggerReaction = (emoji: string, type: typeof animationTypes[number]) => {
    setActiveEmoji({ emoji, type });
    
    // Clear the animation after it plays
    setTimeout(() => {
      setActiveEmoji(null);
    }, 2000);
    
    // Also use the global reaction system
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    addReaction({
      messageId: 'demo',
      emoji,
      position: { 
        x: centerX + (Math.random() * 200 - 100), 
        y: centerY + (Math.random() * 200 - 100) 
      },
      animationType: type
    });
  };

  const handleFileSelect = (files: FileList) => {
    setUploadedFiles(Array.from(files));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      {/* Direct animation display */}
      <AnimatePresence>
        {activeEmoji && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <AnimatedReaction
              key={`demo-${activeEmoji.emoji}-${activeEmoji.type}-${Date.now()}`}
              emoji={activeEmoji.emoji}
              position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
              animationType={activeEmoji.type}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">UI Components Showcase</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reaction Animations Section */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Reaction Animations</h2>
            <p className="mb-4 text-gray-400">Click any emoji to see the animation in action</p>
            
            <div className="mb-6">
              <h3 className="text-lg mb-2">Animation Types</h3>
              <div className="grid grid-cols-2 gap-4">
                {animationTypes.map(type => (
                  <div key={type} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-md font-medium mb-2 capitalize">{type}</h4>
                    <div className="flex flex-wrap gap-2">
                      {emojis.map(emoji => (
                        <motion.button
                          key={`${type}-${emoji}`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-2xl p-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                          onClick={() => triggerReaction(emoji, type)}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GIF Picker Section */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">GIF Picker</h2>
            <p className="mb-4 text-gray-400">Browse and select GIFs with our enhanced UI</p>
            
            <div className="mb-4">
              <button
                onClick={() => setShowGifPicker(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 px-4 rounded-lg transition-colors"
              >
                Open GIF Picker
              </button>
            </div>
            
            {selectedGif && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Selected GIF:</h3>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <img 
                    src={selectedGif} 
                    alt="Selected GIF" 
                    className="w-full h-auto max-h-40 object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* File Upload Section */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">File Upload</h2>
            <p className="mb-4 text-gray-400">Drag and drop or select files to upload</p>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="bg-gray-600 p-2 rounded text-sm flex items-center">
                        {file.name}
                        <button 
                          className="ml-2 text-red-400 hover:text-red-300"
                          onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Grouped Reactions Display */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Grouped Reactions</h2>
            <p className="mb-4 text-gray-400">See how emoji reactions are grouped and displayed</p>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <div key={emoji} className="flex items-center px-3 py-2 bg-gray-600 rounded-full">
                    <span className="mr-1">{emoji}</span>
                    <span className="bg-gray-500 text-xs px-1.5 py-0.5 rounded-full">
                      {Math.floor(Math.random() * 5) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* GIF Picker Modal */}
      <AnimatePresence>
        {showGifPicker && (
          <GifPicker 
            onClose={() => setShowGifPicker(false)}
            onSelect={(gif) => {
              setSelectedGif(gif.url);
              setShowGifPicker(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 