import React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone"
import { GenreComboboxPicker } from "./GenreComboboxPicker"
import { useComicForm } from "@/hooks/use-comic-form"
import type { ComicAdminItem } from "@/hooks/use-admin-comics"

interface ComicFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comic?: ComicAdminItem | null
  onSubmit: (formData: FormData) => Promise<boolean>
  submitting: boolean
}

export function ComicFormSheet({
  open,
  onOpenChange,
  comic,
  onSubmit,
  submitting,
}: ComicFormSheetProps) {
  console.log("[DEBUG Sheet Component] Render ComicFormSheet, open =", open)
  const form = useComicForm({ open, comic, onSubmit, onOpenChange })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden p-0 sm:[&[data-slot=sheet-content]]:max-w-[92vw] lg:[&[data-slot=sheet-content]]:max-w-[90vw] xl:[&[data-slot=sheet-content]]:max-w-[1400px]"
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 p-6 backdrop-blur">
          <SheetTitle className="text-lg font-bold">
            {comic ? "Edit Comic Data" : "Add New Comic"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Fill in the comic metadata and upload image files with the correct
            aspect ratios.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column: Metadata & Text Form */}
              <div className="space-y-4">
                <h3 className="border-b border-border/40 pb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Metadata Information
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Comic Title *</Label>
                  <Input
                    required
                    placeholder="e.g. Solo Leveling"
                    className="h-9 text-xs"
                    value={form.title}
                    onChange={(e) => form.setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Author / Creator
                  </Label>
                  <Input
                    placeholder="e.g. DUBU, REDICE STUDIO"
                    className="h-9 text-xs"
                    value={form.creator}
                    onChange={(e) => form.setCreator(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Comic Type</Label>
                  <Select value={form.type} onValueChange={form.setType}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manga">Manga (Japanese)</SelectItem>
                      <SelectItem value="manhwa">Manhwa (Korean)</SelectItem>
                      <SelectItem value="manhua">Manhua (Chinese)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Publication Status
                  </Label>
                  <Select value={form.status} onValueChange={form.setStatus}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="hiatus">Hiatus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Comic Genres</Label>
                  <GenreComboboxPicker
                    genres={form.genres}
                    selectedGenreIds={form.selectedGenreIds}
                    onToggleGenre={form.toggleGenre}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Comic Synopsis
                  </Label>
                  <Textarea
                    placeholder="Write a complete summary of the comic story..."
                    className="min-h-[100px] text-xs"
                    value={form.synopsis}
                    onChange={(e) => form.setSynopsis(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column: Media Uploader & Guidance */}
              <div className="space-y-4">
                <h3 className="border-b border-border/40 pb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Images & Artwork
                </h3>

                <div className="space-y-1.5">
                  <ImageUploadZone
                    files={form.coverUpload.files}
                    isDragging={form.coverUpload.isDragging}
                    onDrop={form.coverUpload.handleDrop}
                    onDragOver={form.coverUpload.handleDragOver}
                    onDragLeave={form.coverUpload.handleDragLeave}
                    onFilesSelected={form.coverUpload.addFiles}
                    onRemove={form.coverUpload.removeFile}
                    label="Poster Cover *"
                    existingPreviewUrl={comic?.coverUrl}
                    aspectRatioHint="3:4 Ratio"
                    recommendedSize="600 × 800 px"
                    maxSizeHint="Max 5 MB"
                    uploadMode={form.coverUpload.uploadMode}
                    onUploadModeChange={form.coverUpload.setUploadMode}
                    urlValue={form.coverUpload.urlInput}
                    onUrlChange={form.coverUpload.setUrlInput}
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <ImageUploadZone
                    files={form.bannerUpload.files}
                    isDragging={form.bannerUpload.isDragging}
                    onDrop={form.bannerUpload.handleDrop}
                    onDragOver={form.bannerUpload.handleDragOver}
                    onDragLeave={form.bannerUpload.handleDragLeave}
                    onFilesSelected={form.bannerUpload.addFiles}
                    onRemove={form.bannerUpload.removeFile}
                    label="Header Banner (Optional)"
                    existingPreviewUrl={comic?.bannerUrl}
                    aspectRatioHint="16:9 Ratio"
                    recommendedSize="1200 × 400 px"
                    maxSizeHint="Max 8 MB"
                    uploadMode={form.bannerUpload.uploadMode}
                    onUploadModeChange={form.bannerUpload.setUploadMode}
                    urlValue={form.bannerUpload.urlInput}
                    onUrlChange={form.bannerUpload.setUrlInput}
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 z-10 mt-auto flex shrink-0 flex-row items-center justify-end gap-2 border-t border-border/60 bg-background/95 p-6 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting
                ? "Saving Data..."
                : comic
                  ? "Save Changes"
                  : "Add Comic"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
