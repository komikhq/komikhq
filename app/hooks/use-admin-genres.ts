import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { sortGenresByNaturalName } from "@/lib/sort-genres"
import { administrationApi } from "@/lib/sdk-client"

export interface GenreItem {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt?: string
}

export function useAdminGenres() {
  const [genres, setGenres] = useState<GenreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchGenres = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsFetching(true)
    } else {
      setLoading(true)
    }

    try {
      const data: any = await administrationApi.adminListGenres()
      if (data && data.genres) {
        setGenres(sortGenresByNaturalName(data.genres))
      } else {
        toast.error("Failed to fetch genre list")
      }
    } catch (err: any) {
      toast.error(err.message || "Network error occurred")
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchGenres(false)
  }, [fetchGenres])

  const createGenre = async (data: { name: string; description?: string }): Promise<boolean> => {
    if (!data.name.trim()) {
      toast.error("Genre name is required.")
      return false
    }

    setSubmitting(true)
    try {
      const res: any = await administrationApi.adminCreateGenre({
        adminCreateGenreRequest: { name: data.name.trim(), description: data.description?.trim() || undefined },
      })
      if (res && res.success) {
        toast.success(`Genre "${data.name}" successfully added.`)
        fetchGenres(true)
        return true
      } else {
        toast.error("Failed to create new genre")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create genre")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const updateGenre = async (
    id: string,
    data: { name: string; description?: string }
  ): Promise<boolean> => {
    if (!data.name.trim()) {
      toast.error("Genre name is required.")
      return false
    }

    setSubmitting(true)
    try {
      const res: any = await administrationApi.adminUpdateGenre({
        id,
        adminUpdateGenreRequest: { name: data.name.trim(), description: data.description?.trim() || undefined },
      })
      if (res && res.success) {
        toast.success(`Genre "${data.name}" successfully updated.`)
        fetchGenres(true)
        return true
      } else {
        toast.error("Failed to edit genre")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to edit genre")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const deleteGenre = async (id: string): Promise<boolean> => {
    setSubmitting(true)
    try {
      const res: any = await administrationApi.adminDeleteGenre({ id })
      if (res && res.success) {
        toast.success(res.message || "Genre successfully deleted.")
        fetchGenres(true)
        return true
      } else {
        toast.error("Failed to delete genre")
        return false
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete genre")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    genres,
    loading,
    isFetching,
    submitting,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
  }
}
