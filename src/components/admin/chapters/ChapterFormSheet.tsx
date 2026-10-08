import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone";
import { useImageUpload } from "@/hooks/use-image-upload";

interface ChapterFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitBatch: (
    input: { chapterNumber: string; title?: string; pages: File[] },
    onProgress?: (progress: number, stepText: string) => void
  ) => Promise<boolean>;
  submitting: boolean;
}

export function ChapterFormSheet({ open, onOpenChange, onSubmitBatch, submitting }: ChapterFormSheetProps) {
  const pagesUpload = useImageUpload({ multiple: true, maxFiles: 100 });
  const [chapterNumber, setChapterNumber] = useState("");
  const [title, setTitle] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterNumber.trim() || pagesUpload.files.length === 0) return;

    setProgressPercent(0);
    setProgressText("Preparing upload...");

    const files = pagesUpload.files.map((item) => item.file);

    const ok = await onSubmitBatch(
      {
        chapterNumber: chapterNumber.trim(),
        title: title.trim(),
        pages: files,
      },
      (percent, stepText) => {
        setProgressPercent(percent);
        setProgressText(stepText);
      }
    );

    if (ok) {
      setChapterNumber("");
      setTitle("");
      pagesUpload.clearFiles();
      setProgressPercent(0);
      setProgressText("");
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !submitting && onOpenChange(val)}>
      <SheetContent side="right" className="w-full sm:[&[data-slot=sheet-content]]:max-w-[92vw] lg:[&[data-slot=sheet-content]]:max-w-[90vw] xl:[&[data-slot=sheet-content]]:max-w-[1400px] flex flex-col h-full overflow-hidden p-0">
        <SheetHeader className="p-6 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
          <SheetTitle className="text-lg font-bold">Add Chapter & Upload Page Images</SheetTitle>
          <SheetDescription className="text-xs">
            Upload comic page images at once to create a new chapter release with vertical webtoon/manga specifications.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chapter Number *</Label>
                <Input
                  required
                  disabled={submitting}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1 or 1.5"
                  className="text-xs h-9"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chapter Title (Optional)</Label>
                <Input
                  disabled={submitting}
                  placeholder="e.g. The Hunter Awakes"
                  className="text-xs h-9"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {submitting && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="shimmer shimmer-color-primary text-foreground font-semibold">
                    {progressText || "Uploading Pages..."}
                  </span>
                  <span className="text-primary font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
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

          <SheetFooter className="p-6 sticky bottom-0 bg-background/95 backdrop-blur border-t border-border/60 flex flex-row items-center justify-end gap-2 shrink-0 mt-auto z-10">
            <Button type="button" variant="outline" size="sm" disabled={submitting} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || pagesUpload.files.length === 0}>
              {submitting ? `Uploading... (${progressPercent}%)` : "Upload & Create Chapter"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
