import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, Files } from 'lucide-react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative p-10 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        multiple
        onChange={handleChange}
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className={`p-4 rounded-full ${isProcessing ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          ) : (
            <div className="relative">
              <UploadCloud className="w-8 h-8 text-gray-500" />
              <div className="absolute -right-2 -bottom-2 bg-white rounded-full p-0.5">
                <Files className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-700">
            {isProcessing ? 'Processing Documents...' : 'Upload Bank Statements'}
          </p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Drag & drop one or more PDF/Image files here.
            <br />
            Supports Popular, FirstBank, and Oriental.
          </p>
        </div>

        {!isProcessing && (
          <button
            onClick={onButtonClick}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors shadow-sm"
          >
            Select Files
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl">
           {/* Overlay */}
        </div>
      )}
    </div>
  );
};
