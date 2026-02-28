"use client";

import { useState } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";

interface IconUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export default function IconUploader({ onFileSelect }: IconUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition relative bg-gray-50">
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-full text-gray-500 cursor-pointer">
          <UploadCloud className="w-8 h-8 mb-1 text-gray-400" />
          <span className="text-sm font-medium">Upload Icon</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={preview}
            alt="Uploaded Icon"
            width={160}
            height={160}
            className="object-contain w-full h-full rounded-lg p-2"
          />
          <button
            onClick={handleCancel}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
