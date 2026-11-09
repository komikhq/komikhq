import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { administrationApi } from "@/lib/sdk-client"

export interface ChapterItem {
  id: string
  comicId: string
  chapterNumber: string
  title?: string | null
  slug: string
  totalPages: number
  accessTier?: string | null
  isEarlyAccess: boolean
  publishedAt: string
}

export function useAdminChapters(comicId: string) {
  const [chapters, setChapters] = useState<ChapterItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const getImageDimensions = async (file: File) => {
    if (typeof createImageBitmap !== "function") return null

    try {
      const image = await createImageBitmap(file)
      try {
        return { width: image.width, height: image.height }
      } finally {
        image.close()
      }
    } catch (error) {
      console.warn(
        `[ChapterUpload] Could not read dimensions for ${file.name}:`,
        error
      )
      return null
    }
  }

  const fetchChapters = useCallback(async () => {
    if (!comicId) return
    setLoading(true)
    try {
      const data: any = await administrationApi.adminListChapters({ comicId })
      if (data && data.chapters) {
        setChapters(data.chapters)
      } else {
        toast.error("Failed to load chapter list")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch chapter data")
    } finally {
      setLoading(false)
    }
  }, [comicId])

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  const createChapterBatch = async (
    input: {
      chapterNumber: string
      title?: string
      accessTier?: string
      isEarlyAccess?: boolean
      pages: File[]
    },
    onProgress?: (progress: number, stepText: string) => void
  ) => {
    setSubmitting(true)
    try {
      onProgress?.(5, "Initializing new chapter...")

      // Step 1: Init chapter
      const initData: any = await administrationApi.adminInitializeChapter({
        comicId,
        adminInitializeChapterRequest: {
          chapterNumber: input.chapterNumber,
          title: input.title,
          accessTier: input.accessTier || "free",
          isEarlyAccess: input.isEarlyAccess || false,
          totalPages: input.pages.length,
        },
      })

      if (!initData || !initData.success || !initData.chapter?.id) {
        throw new Error(initData?.error || "Failed to initialize chapter.")
      }

      const chapterId = initData.chapter.id
      const total = input.pages.length

      // Step 2: Upload pages one by one (or batch) with retry
      for (let i = 0; i < total; i++) {
        const pageNum = i + 1
        const pageFile = input.pages[i]
        const percent = 10 + Math.floor(((i + 1) / total) * 80)

        onProgress?.(percent, `Uploading page ${pageNum} of ${total}...`)
        const dimensions = await getImageDimensions(pageFile)

        let uploaded = false
        let lastErr = ""

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const pageData: any = await administrationApi.adminUploadChapterPage({
              comicId,
              id: chapterId,
              pageNumber: pageNum,
              file: pageFile,
              width: dimensions?.width,
              height: dimensions?.height,
            })

            if (pageData && pageData.success) {
              uploaded = true
              break
            } else {
              lastErr = pageData?.error || "Failed to upload page."
            }
          } catch (err: any) {
            lastErr = err.message || "Network error while uploading page."
          }
        }

        if (!uploaded) {
          throw new Error(`Failed to upload page ${pageNum}: ${lastErr}`)
        }
      }

      // Step 3: Finalize
      onProgress?.(95, "Finalizing chapter release...")
      const finalizeData: any = await administrationApi.adminFinalizeChapter({
        comicId,
        id: chapterId,
        adminFinalizeChapterRequest: { totalPages: total },
      })

      if (!finalizeData || !finalizeData.success) {
        throw new Error(finalizeData?.error || "Failed to finalize chapter.")
      }

      onProgress?.(100, "All chapter pages uploaded successfully!")
      toast.success("New chapter successfully created.")
      fetchChapters()
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to upload chapter.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const createChapter = async (formData: FormData) => {
    setSubmitting(true)
    try {
      const pages: Blob[] = []
      let chapterNumber = ""
      let title: string | undefined
      let accessTier: string | undefined
      let isEarlyAccess: boolean | undefined

      for (const [key, val] of formData.entries()) {
        if (key === "pages" && val instanceof Blob) {
          pages.push(val)
        } else if (key === "chapterNumber") {
          chapterNumber = String(val)
        } else if (key === "title") {
          title = String(val)
        } else if (key === "accessTier") {
          accessTier = String(val)
        } else if (key === "isEarlyAccess") {
          isEarlyAccess = val === "true"
        }
      }

      const data: any = await administrationApi.adminCreateChapter({
        comicId,
        chapterNumber,
        pages,
        title,
        accessTier,
        isEarlyAccess,
      })
      if (data && data.success) {
        toast.success("New chapter successfully created.")
        fetchChapters()
        return true
      } else {
        toast.error("Failed to add new chapter")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload chapter")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const updateChapter = async (
    chapterId: string,
    data: {
      chapterNumber?: string
      title?: string
      accessTier?: string
      isEarlyAccess?: boolean
    }
  ) => {
    setSubmitting(true)
    try {
      const resData: any = await administrationApi.adminUpdateChapter({
        comicId,
        id: chapterId,
        requestBody: data,
      })
      if (resData && resData.success) {
        toast.success("Chapter updated successfully.")
        fetchChapters()
        return true
      } else {
        toast.error("Failed to update chapter.")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update chapter.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const deleteChapter = async (chapterId: string) => {
    try {
      const data: any = await administrationApi.adminDeleteChapter({
        comicId,
        id: chapterId,
      })
      if (data && data.success) {
        toast.success(data.message || "Chapter successfully deleted.")
        fetchChapters()
        return true
      } else {
        toast.error("Failed to delete chapter")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete chapter")
      return false
    }
  }

  return {
    chapters,
    loading,
    submitting,
    fetchChapters,
    createChapter,
    createChapterBatch,
    updateChapter,
    deleteChapter,
  }
}
