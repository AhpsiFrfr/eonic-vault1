import React, { useRef } from 'react';

interface Props {
  onFileSelect: (files: FileList) => void;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<Props> = ({
  onFileSelect,
  disabled = false,
  accept = 'image/*,.pdf,.doc,.docx,.txt',
  multiple = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="p-2 text-gray-500 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>
    </div>
  );
};
