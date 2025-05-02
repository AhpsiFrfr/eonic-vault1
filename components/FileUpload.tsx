'use client';

import { useState, useRef } from 'react';
import { supabase } from '../utils/supabase';

type UploadedFile = {
  url: string;
  type: 'image' | 'file';
  filename: string;
  size: number;
};

interface FileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function FileUpload({ 
  onUploadComplete, 
  multiple = false, 
  accept = 'image/*,application/pdf,.doc,.docx,.txt', 
  maxSize = 50 * 1024 * 1024 // 50MB default limit
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      setError(null);
      
      const uploadedFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Processing file:', file.name);
        
        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
        }

        // Validate file type
        const acceptedTypes = accept.split(',');
        const isValidType = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.includes('/*')) {
            const [baseType] = type.split('/');
            return file.type.startsWith(`${baseType}/`);
          }
          return file.type === type;
        });

        if (!isValidType) {
          throw new Error(`File type not allowed for ${file.name}. Allowed types: ${accept}`);
        }

        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Uploading to Supabase:', filePath);

        // Upload file to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        console.log('Upload successful, getting public URL');

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          filename: file.name,
          size: file.size
        });

        console.log('File processed successfully:', file.name);
      }

      onUploadComplete(uploadedFiles);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading file');
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        multiple={multiple}
        accept={accept}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="File upload"
      />
      <div 
        className={`flex items-center justify-center px-4 py-2 border rounded-md transition-colors ${uploading
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
          : error
          ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800'
          : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'}`}
      >
        {uploading ? (
          <>
            <svg
              className="w-5 h-5 mr-2 text-gray-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-gray-500">Uploading...</span>
          </>
        ) : error ? (
          <>
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {multiple ? 'Choose files' : 'Choose file'}
            </span>
          </>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
