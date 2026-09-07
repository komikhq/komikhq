import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ChapterItem } from "@/hooks/use-admin-chapters";

interface ChapterDeleteDialogProps {
  chapter: ChapterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ChapterDeleteDialog({ chapter, open, onOpenChange, onConfirm }: ChapterDeleteDialogProps) {
  if (!chapter) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Hapus Chapter {chapter.chapterNumber} ({chapter.title || "Tanpa Judul"})?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Tindakan ini tidak dapat dibatalkan. Seluruh data chapter beserta gambar {chapter.totalPages} halaman komik akan dihapus secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            onClick={onConfirm}
          >
            Hapus Chapter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
