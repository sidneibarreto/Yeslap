import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  validateFile,
  uploadFile,
  UploadProgress,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "utils/storage";

interface Props {
  onFileUploaded: (fileInfo: {
    path: string;
    name: string;
    url: string;
  }) => void;
  onError: (error: string) => void;
  storagePath: string;
}

export function FileUpload({ onFileUploaded, onError, storagePath }: Props) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      onError(error);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    uploadFile(selectedFile, storagePath, (progress: UploadProgress) => {
      if (progress.error) {
        onError(progress.error);
        setIsUploading(false);
        return;
      }

      setUploadProgress(progress.progress);

      if (progress.downloadUrl) {
        onFileUploaded({
          path: storagePath,
          name: selectedFile.name,
          url: progress.downloadUrl,
        });
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
          accept={ALLOWED_FILE_TYPES.join(",")}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          Select File
        </Button>
        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} />
              <div className="text-sm text-gray-600">
                {uploadProgress.toFixed(0)}% uploaded
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Max file size: {MAX_FILE_SIZE / 1024 / 1024}MB
        <br />
        Allowed types: PDF, Word, Excel, JPEG, PNG
      </div>
    </div>
  );
}
