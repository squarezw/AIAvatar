
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Video, AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFieldProps {
  label: string;
  type: "image" | "audio" | "video";
  onFileSelect?: (file: File) => void;
  className?: string;
  preview?: string;
  buttonText: string;
}

export function UploadField({
  label,
  type,
  onFileSelect,
  className,
  preview,
  buttonText
}: UploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (type === 'image' || type === 'video') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
      </div>
      
      {!selectedFile && !previewUrl ? (
        <div 
          className="upload-area"
          onClick={triggerFileSelect}
        >
          {type === 'image' && <Image className="h-10 w-10 text-gray-400 mb-2" />}
          {type === 'audio' && <AudioWaveform className="h-10 w-10 text-gray-400 mb-2" />}
          {type === 'video' && <Video className="h-10 w-10 text-gray-400 mb-2" />}
          <p className="text-sm text-gray-500">点击上传或拖放文件</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={
              type === 'image' 
                ? "image/*" 
                : type === 'audio' 
                ? "audio/*" 
                : "video/*"
            }
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border bg-card">
          {type === 'image' && previewUrl && (
            <div className="aspect-video bg-muted relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {type === 'video' && previewUrl && (
            <div className="aspect-video bg-muted">
              <video 
                src={previewUrl} 
                className="w-full h-full object-cover"
                controls
              />
            </div>
          )}
          
          {type === 'audio' && selectedFile && (
            <div className="p-4 flex items-center gap-4">
              <AudioWaveform className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
          
          <div className="p-3 flex justify-between items-center">
            <p className="text-sm">
              {selectedFile?.name || "已选择文件"}
            </p>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={triggerFileSelect}
            >
              更换
            </Button>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full"
        disabled={!selectedFile && !previewUrl}
        onClick={triggerFileSelect}
      >
        <Upload className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
}
