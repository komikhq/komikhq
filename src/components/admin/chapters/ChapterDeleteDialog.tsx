import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ChapterItem } from "@/hooks/use-admin-chapters"

interface ChapterDeleteDialogProps {
  chapter: ChapterItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ChapterDeleteDialog({
  chapter,
  open,
  onOpenChange,
  onConfirm,
}: ChapterDeleteDialogProps) {
  if (!chapter) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Delete Chapter {chapter.chapterNumber} (
            {chapter.title || "Untitled"})?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            This action cannot be undone. All chapter metadata along with{" "}
            {chapter.totalPages} comic page images will be permanently deleted
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-destructive-foreground bg-destructive text-xs hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete Chapter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
