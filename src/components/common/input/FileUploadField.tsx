"use client";

import { useRef } from "react";
import { X, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

type FileUploadFieldProps = {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  showPreview?: boolean;
};

export default function FileUploadField({
  label,
  file,
  onFileChange,
  accept,
  error,
  showPreview = false,
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = file && file.type.startsWith("image/");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            error
              ? "border-red-300 bg-red-50 hover:bg-red-100"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          )}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            클릭하여 파일을 업로드하세요
          </p>
          {accept && (
            <p className="mt-1 text-xs text-gray-500">지원 형식: {accept}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ml-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {showPreview && isImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(file)}
                alt="미리보기"
                className="max-w-full h-auto max-h-[300px] rounded-lg object-contain"
              />
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-[12px] text-red-600 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
