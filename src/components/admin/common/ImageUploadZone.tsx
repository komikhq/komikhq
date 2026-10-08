import React from "react"
import { UploadSimple, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FileWithPreview } from "@/hooks/use-image-upload"

interface ImageUploadZoneProps {
  files: FileWithPreview[]
  isDragging: boolean
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onFilesSelected: (files: FileList) => void
  onRemove: (id: string) => void
  multiple?: boolean
  label?: string
  existingPreviewUrl?: string | null
  aspectRatioHint?: string
  recommendedSize?: string
  maxSizeHint?: string
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
  label = "Upload Image",
  existingPreviewUrl,
  aspectRatioHint,
  recommendedSize,
  maxSizeHint,
}: ImageUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="w-full space-y-2">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-all",
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
        <div className="rounded-full bg-primary/10 p-2.5 text-primary">
          <UploadSimple className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            {multiple
              ? "Drag & drop multiple files or click here"
              : "Drag & drop file or click to select"}
          </p>
          {(aspectRatioHint || recommendedSize || maxSizeHint) && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {aspectRatioHint && (
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-background/60 text-[10px] font-medium text-primary"
                >
                  {aspectRatioHint}
                </Badge>
              )}
              {recommendedSize && (
                <Badge
                  variant="outline"
                  className="bg-background/60 text-[10px] text-muted-foreground"
                >
                  {recommendedSize}
                </Badge>
              )}
              {maxSizeHint && (
                <Badge
                  variant="outline"
                  className="bg-background/60 text-[10px] text-muted-foreground"
                >
                  {maxSizeHint}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview single existing / uploaded file */}
      {!multiple && (files[0] || existingPreviewUrl) && (
        <div className="group relative h-32 w-24 overflow-hidden rounded-lg border border-border/60 bg-muted">
          <img
            src={files[0] ? files[0].previewUrl : existingPreviewUrl!}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          {files[0] && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-90 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(files[0].id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Preview multiple uploaded files */}
      {multiple && files.length > 0 && (
        <div className="grid grid-cols-4 gap-2 pt-2 sm:grid-cols-6 lg:grid-cols-8">
          {files.map((item, idx) => (
            <div
              key={item.id}
              className="group relative aspect-3/4 overflow-hidden rounded-lg border border-border/60 bg-muted"
            >
              <img
                src={item.previewUrl}
                alt={`Page ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[10px] font-bold text-white">
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
  )
}
