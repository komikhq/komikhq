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
import type { ComicAdminItem } from "@/hooks/use-admin-comics"

interface ComicDeleteDialogProps {
  comic: ComicAdminItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ComicDeleteDialog({
  comic,
  open,
  onOpenChange,
  onConfirm,
}: ComicDeleteDialogProps) {
  if (!comic) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Delete Comic &quot;{comic.title}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            This action cannot be undone. All comic metadata, covers, banners,
            and chapters along with their pages in R2 will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-destructive-foreground bg-destructive text-xs hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
