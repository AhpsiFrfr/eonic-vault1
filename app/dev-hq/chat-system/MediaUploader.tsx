'use client';

import React, { useState, useRef } from 'react';

// @dev-vault-component
export default function MediaUploader({ onUpload, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      progress: 0,
      error: null
    }));
    
    setFiles([...files, ...newFiles]);
  };
  
  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const uploadFiles = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prevFiles => 
        prevFiles.map(file => ({
          ...file,
          progress: Math.min(file.progress + 10, 100)
        }))
      );
    }, 300);
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      
      // In a real implementation, this would send files to an API
      // and get back URLs or other data
      const uploadedFiles = files.map(file => ({
        name: file.file.name,
        type: file.file.type,
        size: file.file.size,
        url: file.preview || 'https://example.com/file-url'
      }));
      
      onUpload(uploadedFiles);
      setUploading(false);
      setFiles([]);
    }, 3000);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Upload Media</h3>
        <button 
          className="text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Drag & Drop Area */}
      <div 
        className={`border-2 border-dashed rounded-md p-6 text-center mb-4 ${
          dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-600'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-zinc-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-zinc-300 mb-2">Drag and drop files here</p>
        <p className="text-zinc-500 text-sm mb-3">or</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Browse Files
        </button>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm text-zinc-400 mb-2">Selected Files</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className="flex items-center bg-zinc-700 rounded p-2">
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-10 h-10 object-cover rounded mr-3" />
                ) : (
                  <div className="w-10 h-10 bg-zinc-600 rounded flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.file.name}</p>
                  <p className="text-xs text-zinc-400">{formatFileSize(file.file.size)}</p>
                  {uploading && (
                    <div className="w-full bg-zinc-600 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                {!uploading && (
                  <button 
                    className="ml-2 text-zinc-400 hover:text-white"
                    onClick={() => removeFile(file.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-end">
        <button
          className="px-3 py-1 mr-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
          onClick={onClose}
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
