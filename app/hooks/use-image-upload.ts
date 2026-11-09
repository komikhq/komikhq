import { useState, useCallback } from "react"
import { toast } from "sonner"

export interface FileWithPreview {
  file: File
  previewUrl: string
  id: string
}

export interface UseImageUploadOptions {
  multiple?: boolean
  maxFiles?: number
  accept?: string
}

export function useImageUpload(options?: UseImageUploadOptions) {
  const { multiple = false, maxFiles, accept = "image/*" } = options || {}
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file")
  const [urlInput, setUrlInput] = useState("")

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arrayFiles = Array.from(newFiles)
      const validImages = arrayFiles.filter((file) =>
        file.type.startsWith("image/")
      )

      if (validImages.length === 0) {
        toast.error(
          "Unsupported file format. Please select images (JPEG, PNG, WEBP)."
        )
        return
      }

      const formatted = validImages.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9),
      }))

      if (multiple) {
        setFiles((prev) => {
          const combined = [...prev, ...formatted]
          if (maxFiles && combined.length > maxFiles) {
            toast.warning(`Maximum ${maxFiles} images at once.`)
            return combined.slice(0, maxFiles)
          }
          return combined
        })
      } else {
        setFiles(formatted.slice(0, 1))
      }
    },
    [multiple, maxFiles]
  )

  /**
   * Add pre-validated File[] directly (e.g. from ZIP extraction).
   * Skips image type validation since files are already validated upstream.
   */
  const addFilesRaw = useCallback(
    (rawFiles: File[]) => {
      const formatted = rawFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9),
      }))

      if (multiple) {
        setFiles((prev) => {
          const combined = [...prev, ...formatted]
          if (maxFiles && combined.length > maxFiles) {
            toast.warning(`Maximum ${maxFiles} images at once.`)
            return combined.slice(0, maxFiles)
          }
          return combined
        })
      } else {
        setFiles(formatted.slice(0, 1))
      }
    },
    [multiple, maxFiles]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
    setFiles([])
    setUrlInput("")
  }, [files])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  return {
    files,
    isDragging,
    uploadMode,
    setUploadMode,
    urlInput,
    setUrlInput,
    addFiles,
    addFilesRaw,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    accept,
  }
}
