import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone";
import { useComicForm } from "@/hooks/use-comic-form";
import type { ComicAdminItem } from "@/hooks/use-admin-comics";

interface ComicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comic?: ComicAdminItem | null;
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export function ComicFormDialog({ open, onOpenChange, comic, onSubmit, submitting }: ComicFormDialogProps) {
  const form = useComicForm({ open, comic, onSubmit, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {comic ? "Edit Data Komik" : "Tambah Komik Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Isi formulir dan unggah sampul komik untuk katalog platform KomikHQ.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} className="space-y-4 pt-2">
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

          <div className="grid grid-cols-2 gap-4">
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
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 border rounded-lg bg-muted/20">
                {form.genres.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => form.toggleGenre(g.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      form.selectedGenreIds.includes(g.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sinopsis Komik</Label>
            <Textarea
              placeholder="Tuliskan ringkasan alur cerita komik..."
              className="text-xs min-h-[80px]"
              value={form.synopsis}
              onChange={(e) => form.setSynopsis(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Cover Sampul (Poster) *</Label>
              <ImageUploadZone
                files={form.coverUpload.files}
                isDragging={form.coverUpload.isDragging}
                onDrop={form.coverUpload.handleDrop}
                onDragOver={form.coverUpload.handleDragOver}
                onDragLeave={form.coverUpload.handleDragLeave}
                onFilesSelected={form.coverUpload.addFiles}
                onRemove={form.coverUpload.removeFile}
                label="Unggah Sampul Cover"
                existingPreviewUrl={comic?.coverUrl}
              />
            </div>
            <div className="space-y-1">
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
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Menyimpan..." : comic ? "Simpan Perubahan" : "Tambah Komik"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
