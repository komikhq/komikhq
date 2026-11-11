import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { usersApi } from "@/lib/sdk-client"
import { authClient } from "@/lib/auth-client"

export function useAccountPassword() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const data: any = await usersApi.getUserProfile()
        setHasPassword(Boolean(data?.hasPassword))
      } catch (e) {
        console.error("Failed to load password status:", e)
      } finally {
        setIsLoadingProfile(false)
      }
    }
    fetchProfileData()
  }, [])

  const submitPassword = useCallback(
    async (e: React.SubmitEvent): Promise<boolean> => {
      e.preventDefault()
      setErrorMsg(null)

      if (newPassword.length < 8) {
        const msg = "New password must be at least 8 characters long."
        setErrorMsg(msg)
        return false
      }

      if (newPassword !== confirmPassword) {
        const msg = "Password confirmation does not match the new password."
        setErrorMsg(msg)
        return false
      }

      setIsSubmitting(true)

      try {
        if (hasPassword && !currentPassword) {
          const msg = "Current password is required."
          setErrorMsg(msg)
          setIsSubmitting(false)
          return false
        }

        if (hasPassword) {
          const res = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          })

          if (res.error) {
            const msg =
              res.error.message ||
              "Failed to update password. Please check your current password."
            setErrorMsg(msg)
            setIsSubmitting(false)
            return false
          }
        } else {
          const res = await (authClient as any).setPassword({
            newPassword,
          })

          if (res.error) {
            const msg =
              res.error.message || "Failed to set password for this account."
            setErrorMsg(msg)
            setIsSubmitting(false)
            return false
          }
        }

        toast.success(
          hasPassword
            ? "Password updated successfully!"
            : "New password set successfully! You can now log in using email & password."
        )
        setHasPassword(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        return true
      } catch (err: any) {
        const msg =
          err.message || "An error occurred while processing password."
        setErrorMsg(msg)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [hasPassword, currentPassword, newPassword, confirmPassword]
  )

  return {
    hasPassword,
    isLoadingProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    isSubmitting,
    errorMsg,
    submitPassword,
  }
}
