import { useRef, useState, DragEvent, ChangeEvent } from 'react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  maxSize = 10,
  maxFiles = 5,
  onFilesSelected,
  error,
  helperText,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    // Check max files
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid, errors };
    }

    files.forEach((file) => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        errors.push(`${file.name} exceeds ${maxSize}MB`);
        return;
      }

      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map((type) => type.trim());
        const fileExtension = `.${file.name.split('.').pop()}`;
        const mimeType = file.type;

        const isAccepted = acceptedTypes.some(
          (type) => type === mimeType || type === fileExtension
        );

        if (!isAccepted) {
          errors.push(`${file.name} is not an accepted file type`);
          return;
        }
      }

      valid.push(file);
    });

    return { valid, errors };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const { valid, errors } = validateFiles(fileArray);

    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      return;
    }

    setSelectedFiles(valid);
    onFilesSelected(valid);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const UploadIcon = () => (
    <svg
      className="w-12 h-12 text-gray-400"
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
  );

  const FileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
          ${error ? 'border-error-500' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
        />

        <UploadIcon />
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold text-primary-600">Click to upload</span> or
          drag and drop
        </p>
        <p className="mt-2 text-xs text-gray-500">
          {accept || 'All file types'} up to {maxSize}MB
          {multiple && ` (max ${maxFiles} files)`}
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileIcon />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-error-600 hover:text-error-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="form-error">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && <p className="form-help">{helperText}</p>}
    </div>
  );
};

export default FileUpload;