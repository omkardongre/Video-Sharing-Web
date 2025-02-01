"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import * as tus from "tus-js-client";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onClose: () => void;
  userId: string;
  plan?: "FREE" | "PRO";
}

const ALLOWED_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

const FREE_PLAN_LIMIT = 1 * 1024 * 1024 * 1024; // 1 GB
const PRO_PLAN_LIMIT = 5 * 1024 * 1024 * 1024; // 5 GB

export const FileUploadContent = ({
  onClose,
  userId,
  plan = "FREE",
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const validateFile = (
    file: File,
    userPlan: "FREE" | "PRO"
  ): string | null => {
    const sizeLimit = userPlan === "PRO" ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return "Invalid file type. Please upload a valid video file (MP4, WebM, MOV, or AVI)";
    }
    if (file.size > sizeLimit) {
      return `File size exceeds ${userPlan === "PRO" ? "5GB" : "1GB"} limit`;
    }
    return null;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file, plan);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        setUploading(true);
        setError(null);
        const upload = new tus.Upload(file, {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          metadata: {
            filename: file.name,
            filetype: file.type,
            userid: userId,
            plan: plan,
          },
          chunkSize: 5 * 1024 * 1024,
          onError: (error) => {
            console.error("Upload error:", error);
            setError("Upload failed. Please try again.");
            setUploading(false);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            setUploadProgress(percentage);
          },
          onSuccess: () => {
            setUploadProgress(100);
            setUploading(false);
            setUploadSuccess(true);
          },
        });

        upload.start();
      } catch {
        setError("Failed to initialize upload");
        setUploading(false);
      }
    },
    [userId, plan]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);
        handleUpload(droppedFile);
      }
    },
    [handleUpload]
  );

  if (uploadSuccess) {
    return (
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
          <div className="text-center">
            <p className="text-lg font-medium text-green-500">
              Upload Successful!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Processing video. This may take a few moments to complete.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 py-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud
          className={`h-10 w-10 ${
            isDragging ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Drag and drop your file here, or click to select
          </p>
          <p className="text-xs text-muted-foreground/75 mt-1">
            Supported formats: MP4, WebM, MOV, AVI (max 5GB)
          </p>
        </div>
        <Input
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          hidden={uploading}
          htmlFor="file-upload"
          className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Select File
        </label>
      </div>

      {file && !error && (
        <div className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </div>
      )}

      {uploading && (
        <div className="w-full">
          <Progress value={uploadProgress} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => file && handleUpload(file)}
          disabled={!file || uploading}
        >
          {uploading ? `Uploading` : "Upload"}
        </Button>
      </div>
    </div>
  );
};
