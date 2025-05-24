export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip'
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes 