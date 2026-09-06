import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadZone } from "@/components/admin/common/ImageUploadZone";
import { useImageUpload } from "@/hooks/use-image-upload";

interface ChapterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export function ChapterFormDialog({ open, onOpenChange, onSubmit, submitting }: ChapterFormDialogProps) {
  const pagesUpload = useImageUpload({ multiple: true, maxFiles: 100 });
  const [chapterNumber, setChapterNumber] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterNumber.trim()) return;

    const formData = new FormData();
    formData.append("chapterNumber", chapterNumber.trim());
    formData.append("title", title.trim());

    pagesUpload.files.forEach((item) => {
      formData.append("pages", item.file);
    });

    const ok = await onSubmit(formData);
    if (ok) {
      setChapterNumber("");
      setTitle("");
      pagesUpload.clearFiles();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Tambah Chapter & Upload Gambar Halaman</DialogTitle>
          <DialogDescription className="text-xs">
            Unggah gambar-gambar komik sekaligus untuk membuat rilis chapter baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nomor Chapter *</Label>
              <Input
                required
                type="number"
                step="0.1"
                placeholder="misal: 1 atau 1.5"
                className="text-xs h-9"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Judul Chapter (Opsional)</Label>
              <Input
                placeholder="misal: Bangkitnya Sang Hunter"
                className="text-xs h-9"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">File Gambar Halaman Komik ({pagesUpload.files.length} Terpilih)</Label>
            <ImageUploadZone
              files={pagesUpload.files}
              isDragging={pagesUpload.isDragging}
              onDrop={pagesUpload.handleDrop}
              onDragOver={pagesUpload.handleDragOver}
              onDragLeave={pagesUpload.handleDragLeave}
              onFilesSelected={pagesUpload.addFiles}
              onRemove={pagesUpload.removeFile}
              multiple={true}
              label="Tarik Banyak File Gambar Halaman Komik"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={submitting || pagesUpload.files.length === 0}>
              {submitting ? "Mengunggah Halaman..." : "Upload & Buat Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
