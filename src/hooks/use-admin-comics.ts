import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { administrationApi } from "@/lib/sdk-client"

export interface ComicAdminItem {
  id: string
  title: string
  slug: string
  synopsis?: string | null
  coverUrl: string
  bannerUrl?: string | null
  type?: string | null
  status: string
  accessTier: string
  totalChapters: number
  totalViews: number
  createdAt: string
  genres: { id: string; name: string }[]
  creators: string[]
}

export function useAdminComics() {
  const [comics, setComics] = useState<ComicAdminItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchComics = useCallback(async () => {
    setLoading(true)
    try {
      const data: any = await administrationApi.adminListComics({
        q: search.trim() || undefined,
        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
        page: String(page),
        limit: "15",
      })
      if (data && data.comics) {
        setComics(data.comics)
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalCount(data.pagination?.total || 0)
      } else {
        toast.error("Failed to load comic catalog")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch comics")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  useEffect(() => {
    fetchComics()
  }, [fetchComics])

  const createComic = async (formData: FormData) => {
    setSubmitting(true)
    try {
      const params: any = {}
      for (const [key, val] of formData.entries()) {
        params[key] = val
      }
      const data: any = await administrationApi.adminCreateComic(params)
      if (data && data.success) {
        toast.success("New comic successfully added.")
        fetchComics()
        return true
      } else {
        toast.error("Failed to add comic")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload comic")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const updateComic = async (id: string, formData: FormData) => {
    setSubmitting(true)
    try {
      const params: any = { id }
      for (const [key, val] of formData.entries()) {
        params[key] = val
      }
      const data: any = await administrationApi.adminUpdateComic(params)
      if (data && data.success) {
        toast.success("Comic successfully updated.")
        fetchComics()
        return true
      } else {
        toast.error("Failed to update comic")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update comic")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const deleteComic = async (id: string) => {
    try {
      const data: any = await administrationApi.adminDeleteComic({ id })
      if (data && data.success) {
        toast.success(data.message || "Comic successfully deleted.")
        fetchComics()
        return true
      } else {
        toast.error("Failed to delete comic")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comic")
      return false
    }
  }

  return {
    comics,
    loading,
    submitting,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    totalCount,
    fetchComics,
    createComic,
    updateComic,
    deleteComic,
  }
}
