import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { administrationApi, comicsApi } from "@/lib/sdk-client"

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
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
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

  const fetchChapters = useCallback(async (isBackground = false) => {
    if (!comicId) return
    if (isBackground) {
      setIsFetching(true)
    } else {
      setLoading(true)
    }
    try {
      const data: any = await comicsApi.getComicBySlug({ slug: comicId })
      const chList = data?.data?.chapters || data?.chapters || []
      setChapters(chList)
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch chapter data")
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [comicId])

  useEffect(() => {
    fetchChapters(false)
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

      // Step 1: Initialize chapter
      const initData: any = await administrationApi.adminInitializeChapter({
        adminInitializeChapterRequest: {
          comicId,
          chapterNumber: input.chapterNumber,
          title: input.title || undefined,
          accessTier: input.accessTier || "free",
          isEarlyAccess: input.isEarlyAccess || false,
          totalPages: input.pages.length,
        },
      })

      const chapterId = initData?.data?.id || initData?.chapter?.id || initData?.id
      if (!chapterId) {
        throw new Error(initData?.message || "Failed to initialize chapter.")
      }

      // Step 2: Upload each page sequentially with progress tracking
      const totalPages = input.pages.length
      for (let i = 0; i < totalPages; i++) {
        const file = input.pages[i]
        const pageNumber = i + 1
        const dims = await getImageDimensions(file)

        await administrationApi.adminUploadChapterPage({
          id: chapterId,
          file,
          pageNumber,
          width: dims?.width,
          height: dims?.height,
        })

        const percent = 10 + Math.round(((i + 1) / totalPages) * 80)
        onProgress?.(percent, `Uploading page ${pageNumber} of ${totalPages}...`)
      }

      // Step 3: Finalize chapter
      onProgress?.(95, "Finalizing chapter...")
      await administrationApi.adminFinalizeChapter({
        id: chapterId,
        adminFinalizeChapterRequest: {
          totalPages,
        },
      })

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

      const slug = `ch-${chapterNumber.replace(/[^0-9.]/g, "-")}`
      const data: any = await administrationApi.adminCreateChapter({
        adminCreateChapterRequest: {
          comicId,
          chapterNumber,
          slug,
          title: title || undefined,
          accessTier: accessTier || "free",
          isEarlyAccess: isEarlyAccess || false,
        },
      })
      if (data && (data.status === "ok" || data.data || data.success)) {
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
      await administrationApi.adminUpdateChapter({
        id: chapterId,
        adminUpdateChapterRequest: {
          chapterNumber: data.chapterNumber,
          title: data.title,
          accessTier: data.accessTier,
          isEarlyAccess: data.isEarlyAccess,
        },
      })
      toast.success("Chapter updated successfully.")
      fetchChapters(true)
      return true
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
        id: chapterId,
      })
      if (data && (data.status === "ok" || data.success)) {
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
    isFetching,
    submitting,
    fetchChapters,
    createChapter,
    createChapterBatch,
    updateChapter,
    deleteChapter,
  }
}
