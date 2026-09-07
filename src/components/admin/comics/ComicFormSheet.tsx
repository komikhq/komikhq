import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone";
import { GenreComboboxPicker } from "./GenreComboboxPicker";
import { useComicForm } from "@/hooks/use-comic-form";
import type { ComicAdminItem } from "@/hooks/use-admin-comics";

interface ComicFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comic?: ComicAdminItem | null;
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export function ComicFormSheet({ open, onOpenChange, comic, onSubmit, submitting }: ComicFormSheetProps) {
  console.log("[DEBUG Sheet Component] Render ComicFormSheet, open =", open);
  const form = useComicForm({ open, comic, onSubmit, onOpenChange });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:[&[data-slot=sheet-content]]:max-w-[92vw] lg:[&[data-slot=sheet-content]]:max-w-[90vw] xl:[&[data-slot=sheet-content]]:max-w-[1400px] flex flex-col h-full overflow-hidden p-0">
        <SheetHeader className="p-6 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
          <SheetTitle className="text-lg font-bold">
            {comic ? "Edit Data Komik" : "Tambah Komik Baru"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Isi formulir kelengkapan metadata komik dan unggah berkas gambar dengan spesifikasi rasio yang tepat.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Metadata & Text Form */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1">
                  Metadata Informasi
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Judul Komik *</Label>
                  <Input
                    required
                    placeholder="Contoh: Solo Leveling"
                    className="text-xs h-9"
                    value={form.title}
                    onChange={(e) => form.setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Penulis / Creator</Label>
                  <Input
                    placeholder="Contoh: DUBU, REDICE STUDIO"
                    className="text-xs h-9"
                    value={form.creator}
                    onChange={(e) => form.setCreator(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tipe Komik</Label>
                  <Select value={form.type} onValueChange={form.setType}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manga">Manga (Jepang)</SelectItem>
                      <SelectItem value="manhwa">Manhwa (Korea)</SelectItem>
                      <SelectItem value="manhua">Manhua (China)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status Publikasi</Label>
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
                  <Label className="text-xs font-semibold">Genre Komik</Label>
                  <GenreComboboxPicker
                    genres={form.genres}
                    selectedGenreIds={form.selectedGenreIds}
                    onToggleGenre={form.toggleGenre}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Sinopsis Komik</Label>
                  <Textarea
                    placeholder="Tuliskan ringkasan alur cerita komik secara lengkap..."
                    className="text-xs min-h-[100px]"
                    value={form.synopsis}
                    onChange={(e) => form.setSynopsis(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column: Media Uploader & Guidance */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1">
                  Berkas Gambar & Sampul
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Cover Sampul Poster *</Label>
                  <ImageUploadZone
                    files={form.coverUpload.files}
                    isDragging={form.coverUpload.isDragging}
                    onDrop={form.coverUpload.handleDrop}
                    onDragOver={form.coverUpload.handleDragOver}
                    onDragLeave={form.coverUpload.handleDragLeave}
                    onFilesSelected={form.coverUpload.addFiles}
                    onRemove={form.coverUpload.removeFile}
                    label="Unggah Cover Poster"
                    existingPreviewUrl={comic?.coverUrl}
                    aspectRatioHint="Rasio 3:4"
                    recommendedSize="600 × 800 px"
                    maxSizeHint="Maks 5 MB"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold">Banner Header (Opsional)</Label>
                  <ImageUploadZone
                    files={form.bannerUpload.files}
                    isDragging={form.bannerUpload.isDragging}
                    onDrop={form.bannerUpload.handleDrop}
                    onDragOver={form.bannerUpload.handleDragOver}
                    onDragLeave={form.bannerUpload.handleDragLeave}
                    onFilesSelected={form.bannerUpload.addFiles}
                    onRemove={form.bannerUpload.removeFile}
                    label="Unggah Banner Header"
                    existingPreviewUrl={comic?.bannerUrl}
                    aspectRatioHint="Rasio 16:9"
                    recommendedSize="1200 × 400 px"
                    maxSizeHint="Maks 8 MB"
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 sticky bottom-0 bg-background/95 backdrop-blur border-t border-border/60 flex flex-row items-center justify-end gap-2 shrink-0 mt-auto z-10">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Menyimpan Data..." : comic ? "Simpan Perubahan" : "Tambah Komik"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
