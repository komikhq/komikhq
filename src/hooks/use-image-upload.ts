import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface FileWithPreview {
  file: File;
  previewUrl: string;
  id: string;
}

export interface UseImageUploadOptions {
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
}

export function useImageUpload(options?: UseImageUploadOptions) {
  const { multiple = false, maxFiles = 50, accept = "image/*" } = options || {};
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arrayFiles = Array.from(newFiles);
      const validImages = arrayFiles.filter((file) => file.type.startsWith("image/"));

      if (validImages.length === 0) {
        toast.error("Format file tidak didukung. Harap pilih gambar (JPEG, PNG, WEBP).");
        return;
      }

      const formatted = validImages.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9),
      }));

      if (multiple) {
        setFiles((prev) => {
          const combined = [...prev, ...formatted];
          if (combined.length > maxFiles) {
            toast.warning(`Maksimal ${maxFiles} gambar sekaligus.`);
            return combined.slice(0, maxFiles);
          }
          return combined;
        });
      } else {
        setFiles(formatted.slice(0, 1));
      }
    },
    [multiple, maxFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  }, [files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  return {
    files,
    isDragging,
    addFiles,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    accept,
  };
}
