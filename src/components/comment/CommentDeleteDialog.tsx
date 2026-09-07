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
import { Trash } from "@phosphor-icons/react";

interface CommentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export function CommentDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: CommentDeleteDialogProps) {
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-neutral-100 p-6 rounded-2xl shadow-xl">
        <AlertDialogHeader className="space-y-2 text-left">
          <AlertDialogTitle className="text-base font-bold flex items-center gap-2 text-rose-400">
            <Trash className="h-5 w-5" />
            <span>Hapus Komentar</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-neutral-400">
            Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-end gap-2 pt-4">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-4 rounded-xl"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs h-9 px-4 rounded-xl transition-colors"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
