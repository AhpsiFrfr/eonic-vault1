'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function LinkPreview({ url, onClose }) {
  // In a real implementation, this would fetch metadata from the URL
  // For now, we'll use mock data
  const [preview, setPreview] = useState({
    title: 'EONIC Dev Documentation',
    description: 'Official documentation for the EONIC development platform and quantum engine integration.',
    image: 'https://via.placeholder.com/300x200',
    domain: 'docs.eonic.dev',
    favicon: 'https://via.placeholder.com/16x16'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Same data, just simulating a refresh
    }, 1000);
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg overflow-hidden w-full max-w-md">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-400">
          <p>Failed to load preview for {url}</p>
          <button 
            className="mt-2 px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
            onClick={handleRefresh}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Image Preview */}
          {preview.image && (
            <div className="w-full h-40 bg-zinc-900 overflow-hidden">
              <img 
                src={preview.image} 
                alt={preview.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="p-4">
            {/* Site Info */}
            <div className="flex items-center text-xs text-zinc-400 mb-2">
              {preview.favicon && (
                <img 
                  src={preview.favicon} 
                  alt=""
                  className="w-4 h-4 mr-2"
                />
              )}
              <span>{preview.domain}</span>
            </div>
            
            {/* Title and Description */}
            <h3 className="font-medium text-white mb-1">{preview.title}</h3>
            <p className="text-sm text-zinc-300">{preview.description}</p>
            
            {/* Actions */}
            <div className="flex justify-between mt-3 pt-2 border-t border-zinc-700">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Open Link
              </a>
              <button 
                className="text-sm text-zinc-400 hover:text-zinc-300"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
