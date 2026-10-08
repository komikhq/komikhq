import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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

  const getApiUrl = () =>
    (window as any).__PUBLIC_API_URL__ || "http://localhost:8787"

  const fetchComics = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append("q", search.trim())
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter)
      params.append("page", page.toString())
      params.append("limit", "15")

      const res = await fetch(
        `${getApiUrl()}/v1/admin/comics?${params.toString()}`,
        { credentials: "include" }
      )
      const data: any = await res.json()
      if (res.ok && data.comics) {
        setComics(data.comics)
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalCount(data.pagination?.total || 0)
      } else {
        toast.error(data.error || "Failed to load comic catalog")
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
      const res = await fetch(`${getApiUrl()}/v1/admin/comics`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data: any = await res.json()
      if (res.ok && data.success) {
        toast.success("New comic successfully added.")
        fetchComics()
        return true
      } else {
        toast.error(data.error || "Failed to add comic")
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
      const res = await fetch(`${getApiUrl()}/v1/admin/comics/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })
      const data: any = await res.json()
      if (res.ok && data.success) {
        toast.success("Comic successfully updated.")
        fetchComics()
        return true
      } else {
        toast.error(data.error || "Failed to update comic")
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
      const res = await fetch(`${getApiUrl()}/v1/admin/comics/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data: any = await res.json()
      if (res.ok && data.success) {
        toast.success(data.message || "Comic successfully deleted.")
        fetchComics()
        return true
      } else {
        toast.error(data.error || "Failed to delete comic")
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
