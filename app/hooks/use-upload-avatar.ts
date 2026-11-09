import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { usersApi } from "@/lib/sdk-client"

export function useUploadAvatar() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadAvatar = async (fileBlob: Blob): Promise<string | null> => {
    setIsUploading(true)
    setUploadError(null)
    try {
      const response: any = await usersApi.uploadUserAvatar({
        file: fileBlob,
      })

      const finalUrl = response?.avatarUrl || response?.imageUrl

      if (!finalUrl) {
        throw new Error(
          response?.error || "Failed to upload profile picture to server."
        )
      }

      // Sync user session image in better-auth
      await authClient.updateUser({
        image: finalUrl,
      })

      toast.success("Profile picture updated successfully!")
      return finalUrl
    } catch (err: any) {
      const message =
        err?.message || "An error occurred while uploading profile picture."
      setUploadError(message)
      toast.error(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadAvatar,
    isUploading,
    uploadError,
    setUploadError,
  }
}
