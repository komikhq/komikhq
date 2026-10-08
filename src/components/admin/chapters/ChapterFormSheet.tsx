import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone"
import { useImageUpload } from "@/hooks/use-image-upload"

interface ChapterFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitBatch: (
    input: { chapterNumber: string; title?: string; pages: File[] },
    onProgress?: (progress: number, stepText: string) => void
  ) => Promise<boolean>
  submitting: boolean
}

export function ChapterFormSheet({
  open,
  onOpenChange,
  onSubmitBatch,
  submitting,
}: ChapterFormSheetProps) {
  const pagesUpload = useImageUpload({ multiple: true, maxFiles: 500 })
  const [chapterNumber, setChapterNumber] = useState("")
  const [title, setTitle] = useState("")
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressText, setProgressText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chapterNumber.trim() || pagesUpload.files.length === 0) return

    setProgressPercent(0)
    setProgressText("Preparing upload...")

    const files = pagesUpload.files.map((item) => item.file)

    const ok = await onSubmitBatch(
      {
        chapterNumber: chapterNumber.trim(),
        title: title.trim(),
        pages: files,
      },
      (percent, stepText) => {
        setProgressPercent(percent)
        setProgressText(stepText)
      }
    )

    if (ok) {
      setChapterNumber("")
      setTitle("")
      pagesUpload.clearFiles()
      setProgressPercent(0)
      setProgressText("")
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !submitting && onOpenChange(val)}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden p-0 sm:[&[data-slot=sheet-content]]:max-w-[92vw] lg:[&[data-slot=sheet-content]]:max-w-[90vw] xl:[&[data-slot=sheet-content]]:max-w-[1400px]"
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 p-6 backdrop-blur">
          <SheetTitle className="text-lg font-bold">
            Add Chapter & Upload Page Images
          </SheetTitle>
          <SheetDescription className="text-xs">
            Upload comic page images at once to create a new chapter release
            with vertical webtoon/manga specifications.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Chapter Number *
                </Label>
                <Input
                  required
                  disabled={submitting}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1 or 1.5"
                  className="h-9 text-xs"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Chapter Title (Optional)
                </Label>
                <Input
                  disabled={submitting}
                  placeholder="e.g. The Hunter Awakes"
                  className="h-9 text-xs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {submitting && (
              <div className="animate-in space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4 fade-in">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="shimmer font-semibold text-foreground shimmer-color-primary">
                    {progressText || "Uploading Pages..."}
                  </span>
                  <span className="font-bold text-primary">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Comic Page Images ({pagesUpload.files.length} Selected)
              </Label>
              <ImageUploadZone
                files={pagesUpload.files}
                isDragging={pagesUpload.isDragging}
                onDrop={pagesUpload.handleDrop}
                onDragOver={pagesUpload.handleDragOver}
                onDragLeave={pagesUpload.handleDragLeave}
                onFilesSelected={pagesUpload.addFiles}
                onRemove={pagesUpload.removeFile}
                multiple={true}
                label="Drag Multiple Comic Page Images At Once"
                aspectRatioHint="Vertical Scroll"
                recommendedSize="Width 720–1080 px"
                maxSizeHint="Max 10 MB/file"
              />
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 z-10 mt-auto flex shrink-0 flex-row items-center justify-end gap-2 border-t border-border/60 bg-background/95 p-6 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || pagesUpload.files.length === 0}
            >
              {submitting
                ? `Uploading... (${progressPercent}%)`
                : "Upload & Create Chapter"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
