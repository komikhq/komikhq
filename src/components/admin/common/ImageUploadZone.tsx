import React, { useState } from "react"
import { UploadSimple, X, Link as LinkIcon, Image as ImageIcon, WarningCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  acceptExtra?: string
  allowUrlUpload?: boolean
  uploadMode?: "file" | "url"
  onUploadModeChange?: (mode: "file" | "url") => void
  urlValue?: string
  onUrlChange?: (url: string) => void
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
  acceptExtra,
  allowUrlUpload = true,
  uploadMode: controlledMode,
  onUploadModeChange,
  urlValue: controlledUrlValue,
  onUrlChange,
}: ImageUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internalMode, setInternalMode] = useState<"file" | "url">("file")
  const [internalUrlValue, setInternalUrlValue] = useState("")
  const [urlImageError, setUrlImageError] = useState(false)

  const mode = controlledMode !== undefined ? controlledMode : internalMode
  const setMode = (newMode: "file" | "url") => {
    if (onUploadModeChange) {
      onUploadModeChange(newMode)
    } else {
      setInternalMode(newMode)
    }
  }

  const urlValue = controlledUrlValue !== undefined ? controlledUrlValue : internalUrlValue
  const handleUrlChange = (val: string) => {
    setUrlImageError(false)
    if (onUrlChange) {
      onUrlChange(val)
    } else {
      setInternalUrlValue(val)
    }
  }

  return (
    <div className="w-full space-y-2.5">
      {/* Tab Selector if URL upload allowed and not multiple */}
      {allowUrlUpload && !multiple && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-foreground">{label}</span>
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5 text-[11px] font-medium border border-border/40">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer",
                mode === "file"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UploadSimple className="h-3.5 w-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer",
                mode === "url"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Paste URL
            </button>
          </div>
        </div>
      )}

      {/* Mode 1: File Upload (Drag & Drop) */}
      {mode === "file" && (
        <>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-all",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptExtra ? `image/*,${acceptExtra}` : "image/*"}
              multiple={multiple}
              className="hidden"
              onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
            />
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <UploadSimple className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                {multiple ? label : "Choose a local image file"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {multiple
                  ? "Drag & drop multiple files or click here"
                  : "Drag & drop file or click to browse"}
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
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                <img
                  src={files[0] ? files[0].previewUrl : existingPreviewUrl!}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-xs font-medium text-foreground">
                  {files[0] ? files[0].file.name : "Current Image"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {files[0]
                    ? `${(files[0].file.size / 1024).toFixed(1)} KB`
                    : "Saved in Cloudflare R2"}
                </p>
              </div>
              {files[0] && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(files[0].id)}
                >
                  <X className="h-4 w-4" />
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
        </>
      )}

      {/* Mode 2: Paste External URL */}
      {mode === "url" && (
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3.5">
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                value={urlValue}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/images/cover.jpg"
                className="pl-9 pr-8 text-xs h-9 rounded-lg"
              />
              {urlValue && (
                <button
                  type="button"
                  onClick={() => handleUrlChange("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Paste the image URL from another website. The server will download and store it directly into R2.
            </p>
          </div>

          {/* URL Live Preview */}
          {urlValue && (
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/80 p-2.5">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted flex items-center justify-center">
                {!urlImageError ? (
                  <img
                    src={urlValue}
                    alt="URL Preview"
                    onError={() => setUrlImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                  >
                    URL Source
                  </Badge>
                  {aspectRatioHint && (
                    <span className="text-[10px] text-muted-foreground">
                      {aspectRatioHint}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs font-mono text-muted-foreground">
                  {urlValue}
                </p>
                {urlImageError && (
                  <p className="flex items-center gap-1 text-[10px] text-amber-500">
                    <WarningCircle className="h-3 w-3 shrink-0" />
                    Preview blocked by browser, but server will download it on submit.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Show existing R2 preview if URL field is empty and comic already has image */}
          {!urlValue && existingPreviewUrl && (
            <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 p-2">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md border border-border/40 bg-muted">
                <img
                  src={existingPreviewUrl}
                  alt="Current Preview"
                  className="h-full w-full object-cover opacity-75"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Current image preserved unless new URL is provided.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
