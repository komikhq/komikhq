import { useState, useCallback } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export function useUpdateUserName() {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [isSavingName, setIsSavingName] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const startEditing = useCallback((currentName: string) => {
    setEditedName(currentName)
    setIsEditingName(true)
    setErrorMsg(null)
  }, [])

  const cancelEditing = useCallback(() => {
    setIsEditingName(false)
    setErrorMsg(null)
  }, [])

  const saveName = useCallback(async (): Promise<boolean> => {
    if (!editedName.trim()) {
      const msg = "Name cannot be empty."
      setErrorMsg(msg)
      toast.error(msg)
      return false
    }

    setIsSavingName(true)
    setErrorMsg(null)

    try {
      const res = await authClient.updateUser({
        name: editedName.trim(),
      })

      if (res.error) {
        const msg = res.error.message || "Failed to update profile name."
        setErrorMsg(msg)
        toast.error(msg)
        return false
      } else {
        toast.success("Profile name updated successfully!")
        setIsEditingName(false)
        return true
      }
    } catch (err: any) {
      const msg = err?.message || "An error occurred while updating the name."
      setErrorMsg(msg)
      toast.error(msg)
      return false
    } finally {
      setIsSavingName(false)
    }
  }, [editedName])

  return {
    isEditingName,
    editedName,
    setEditedName,
    isSavingName,
    errorMsg,
    startEditing,
    cancelEditing,
    saveName,
  }
}
