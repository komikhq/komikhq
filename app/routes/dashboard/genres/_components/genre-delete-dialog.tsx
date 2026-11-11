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
import type { GenreItem } from "@/hooks/use-admin-genres"

interface GenreDeleteDialogProps {
  genre: GenreItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  submitting?: boolean
}

export function GenreDeleteDialog({
  genre,
  open,
  onOpenChange,
  onConfirm,
  submitting = false,
}: GenreDeleteDialogProps) {
  if (!genre) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Delete Genre &quot;{genre.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Are you sure you want to delete the genre <strong className="text-foreground">{genre.name}</strong>?
            Comics currently tagged with this genre will no longer display it. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting} className="text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={submitting}
            className="bg-destructive text-xs text-destructive-foreground hover:bg-destructive/90"
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
          >
            {submitting ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

