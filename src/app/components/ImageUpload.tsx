import React, { useRef, useState, DragEvent } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Image from 'next/image';

export default function FileUpload({
  name,
  defaultValue = '',
}: {
  name: string;
  defaultValue: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(defaultValue || null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    const data = new FormData();
    data.set('file', file);
    try {
      const response = await axios.post('/api/upload', data);
      if (response.data.url) {
        setFileName(response.data.url);
        setFilePreview(response.data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 mb-4 ${
        isDragging ? 'border-blue-500 bg-blue-50 mb-2' : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="min-h-[120px] flex flex-col items-center justify-center">
        {isUploading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-3xl mb-2 animate-spin text-blue-500"
          />
        ) : filePreview ? (
          <div className="relative w-32 h-32 mb-2">
            <Image
              src={filePreview}
              alt="Preview"
              fill
              sizes="120px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            className="text-3xl mb-2 text-gray-400"
          />
        )}

        <h3 className="text-base font-semibold text-gray-700">Upload a File</h3>
        <p className="text-xs text-gray-500 mt-1">
          {fileName ? 'Click or drag to replace' : 'Drag and drop files here'}
        </p>
        <input type="hidden" name={name} value={fileName} />
      </div>
    </div>
  );
}
