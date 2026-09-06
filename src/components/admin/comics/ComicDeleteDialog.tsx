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
import type { ComicAdminItem } from "@/hooks/use-admin-comics";

interface ComicDeleteDialogProps {
  comic: ComicAdminItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ComicDeleteDialog({ comic, open, onOpenChange, onConfirm }: ComicDeleteDialogProps) {
  if (!comic) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Hapus Komik &quot;{comic.title}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Tindakan ini tidak dapat dibatalkan. Seluruh data komik, sampul, banner, dan seluruh chapter beserta halamannya di R2 akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            onClick={onConfirm}
          >
            Hapus Permanen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
