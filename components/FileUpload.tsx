'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, FileText } from 'lucide-react';

interface Props {
  onFileSelect: (files: FileList) => void;
}

export function FileUpload({ onFileSelect }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [showDropzone, setShowDropzone] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
      // Reset input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleFiles = (files: FileList) => {
    onFileSelect(files);
    generatePreviews(files);
  };

  const generatePreviews = (files: FileList) => {
    const newPreviews = Array.from(files).map(file => {
      // Only generate previews for images
      if (file.type.startsWith('image/')) {
        return {
          file,
          preview: URL.createObjectURL(file)
        };
      }
      // For non-images, use a generic preview based on file type
      return {
        file,
        preview: '' // Empty string for non-images
      };
    });

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
      setShowDropzone(false);
    }
  }, []);

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      {/* File Attachment Button */}
      <button
        type="button"
        onClick={() => setShowDropzone(prev => !prev)}
        className="p-2 text-gray-500 hover:text-gray-600 focus:outline-none transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {previews.map((item, index) => (
              <motion.div
                key={`${item.file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {item.preview ? (
                    <img 
                      src={item.preview} 
                      alt={item.file.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="text-xs text-center mt-1 w-16 truncate" title={item.file.name}>
                  {item.file.name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dropzone */}
      <AnimatePresence>
        {showDropzone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <div
              className={`
                border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
              `}
              onClick={handleClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium text-blue-600 hover:underline">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Images, PDFs, Word documents
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
