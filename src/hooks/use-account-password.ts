import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { usersApi } from "@/lib/sdk-client"

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
        if (hasPassword) {
          if (!currentPassword) {
            const msg = "Current password is required."
            setErrorMsg(msg)
            setIsSubmitting(false)
            return false
          }

          const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          })

          if (error) {
            const msg =
              error.message ||
              "Failed to change password. Please check your current password."
            setErrorMsg(msg)
            setIsSubmitting(false)
            return false
          }

          toast.success("Password updated successfully!")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          return true
        } else {
          const { error } = await (authClient as any).setPassword({
            newPassword,
          })

          if (error) {
            const msg = error.message || "Failed to set new password."
            setErrorMsg(msg)
            setIsSubmitting(false)
            return false
          }

          toast.success(
            "New password set successfully! You can now log in using email & password."
          )
          setHasPassword(true)
          setNewPassword("")
          setConfirmPassword("")
          return true
        }
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
