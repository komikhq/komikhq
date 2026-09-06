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
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export function ChapterFormSheet({ open, onOpenChange, onSubmit, submitting }: ChapterFormSheetProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-full sm:!max-w-[92vw] lg:!max-w-[90vw] xl:!max-w-[1400px] overflow-y-auto p-0">
        <SheetHeader className="p-6 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10">
          <SheetTitle className="text-lg font-bold">Tambah Chapter & Upload Gambar Halaman</SheetTitle>
          <SheetDescription className="text-xs">
            Unggah gambar-gambar komik sekaligus untuk membuat rilis chapter baru dengan spesifikasi webtoon/manga vertical.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              File Gambar Halaman Komik ({pagesUpload.files.length} Terpilih)
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
              label="Tarik Banyak File Gambar Halaman Komik Sekaligus"
              aspectRatioHint="Vertical Scroll"
              recommendedSize="Lebar 720–1080 px"
              maxSizeHint="Maks 10 MB/file"
            />
          </div>

          <SheetFooter className="p-0 pt-4 border-t border-border/60 flex flex-row items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={submitting || pagesUpload.files.length === 0}>
              {submitting ? "Mengunggah Halaman..." : "Upload & Buat Chapter"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
