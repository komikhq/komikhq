import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "./use-auth"
import { usersApi } from "@/lib/sdk-client"

export function useDeleteAccount() {
  const { user, handleSignOut } = useAuth()
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const [confirmInput, setConfirmInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfileInfo() {
      try {
        const data: any = await usersApi.getUserProfile()
        setHasPassword(Boolean(data?.hasPassword))
      } catch (e) {
        console.error("Failed to load account profile:", e)
      }
    }
    fetchProfileInfo()
  }, [])

  const resetDeleteState = useCallback(() => {
    setConfirmInput("")
    setDeleteError(null)
  }, [])

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    setIsDeleting(true)
    setDeleteError(null)

    const payload: { password?: string; email?: string } = {}

    if (hasPassword) {
      if (!confirmInput) {
        setDeleteError("Confirmation password is required.")
        setIsDeleting(false)
        return false
      }
      payload.password = confirmInput
    } else {
      if (
        !confirmInput ||
        confirmInput.toLowerCase().trim() !== user?.email?.toLowerCase().trim()
      ) {
        setDeleteError("Confirmation email does not match.")
        setIsDeleting(false)
        return false
      }
      payload.email = confirmInput
    }

    try {
      await usersApi.deleteUserAccount({
        deleteUserAccountRequest: payload,
      })

      toast.success("Your account has been permanently deleted.")
      await handleSignOut()
      return true
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account.")
      setIsDeleting(false)
      return false
    }
  }, [hasPassword, confirmInput, user, handleSignOut])

  return {
    user,
    hasPassword,
    confirmInput,
    setConfirmInput,
    isDeleting,
    deleteError,
    setDeleteError,
    resetDeleteState,
    deleteAccount,
  }
}
