import React from "react";
import { UploadSimple, X, Info } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FileWithPreview } from "@/hooks/use-image-upload";

interface ImageUploadZoneProps {
  files: FileWithPreview[];
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFilesSelected: (files: FileList) => void;
  onRemove: (id: string) => void;
  multiple?: boolean;
  label?: string;
  existingPreviewUrl?: string | null;
  aspectRatioHint?: string;
  recommendedSize?: string;
  maxSizeHint?: string;
}

export function ImageUploadZone({
  files,
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onFilesSelected,
  onRemove,
  multiple = false,
  label = "Unggah Gambar",
  existingPreviewUrl,
  aspectRatioHint,
  recommendedSize,
  maxSizeHint,
}: ImageUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2 w-full">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[130px]",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        />
        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
          <UploadSimple className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            {multiple ? "Tarik & lepas banyak file atau klik di sini" : "Tarik & lepas file atau klik untuk memilih"}
          </p>
          {(aspectRatioHint || recommendedSize || maxSizeHint) && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {aspectRatioHint && (
                <Badge variant="outline" className="text-[10px] bg-background/60 font-medium text-primary border-primary/30">
                  {aspectRatioHint}
                </Badge>
              )}
              {recommendedSize && (
                <Badge variant="outline" className="text-[10px] bg-background/60 text-muted-foreground">
                  {recommendedSize}
                </Badge>
              )}
              {maxSizeHint && (
                <Badge variant="outline" className="text-[10px] bg-background/60 text-muted-foreground">
                  {maxSizeHint}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview single existing / uploaded file */}
      {!multiple && (files[0] || existingPreviewUrl) && (
        <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-border/60 group bg-muted">
          <img
            src={files[0] ? files[0].previewUrl : existingPreviewUrl!}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {files[0] && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-90 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(files[0].id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Preview multiple uploaded files */}
      {multiple && files.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 pt-2">
          {files.map((item, idx) => (
            <div key={item.id} className="relative aspect-3/4 rounded-lg overflow-hidden border border-border/60 group bg-muted">
              <img src={item.previewUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1 rounded">
                #{idx + 1}
              </span>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-90 hover:opacity-100"
                onClick={() => onRemove(item.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
