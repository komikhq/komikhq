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
import type { UserItem } from "@/hooks/use-admin-users"

interface UserDeleteDialogProps {
  user: UserItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  submitting?: boolean
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  submitting = false,
}: UserDeleteDialogProps) {
  if (!user) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-destructive">
            Delete User Account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Are you sure you want to delete user{" "}
            <strong className="text-foreground">{user.name}</strong> ({user.email})?
            This will permanently remove their profile, reading history, bookmarks,
            and comments. This action cannot be undone.
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

