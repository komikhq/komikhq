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
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form & Accordion State encapsulated inside Hook
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fetchGenres = useCallback(async () => {
    setLoading(true)
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
    }
  }, [])

  useEffect(() => {
    fetchGenres()
  }, [fetchGenres])

  const handleAdd = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      const data: any = await administrationApi.adminCreateGenre({
        adminCreateGenreRequest: { name: newName, description: newDesc },
      })
      if (data && data.success) {
        toast.success(`Genre "${newName}" successfully added.`)
        setNewName("")
        setNewDesc("")
        fetchGenres()
      } else {
        toast.error("Failed to create new genre")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create genre")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleExpand = (g: GenreItem) => {
    if (expandedId === g.id) {
      setExpandedId(null)
    } else {
      setExpandedId(g.id)
      setEditName(g.name)
      setEditDesc(g.description || "")
      setConfirmDeleteId(null)
    }
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return
    setSubmitting(true)
    try {
      const data: any = await administrationApi.adminUpdateGenre({
        id,
        adminUpdateGenreRequest: { name: editName, description: editDesc },
      })
      if (data && data.success) {
        toast.success("Genre successfully updated.")
        setExpandedId(null)
        fetchGenres()
      } else {
        toast.error("Failed to edit genre")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to edit genre")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async (id: string) => {
    try {
      const data: any = await administrationApi.adminDeleteGenre({ id })
      if (data && data.success) {
        toast.success(data.message || "Genre successfully deleted")
        setConfirmDeleteId(null)
        if (expandedId === id) setExpandedId(null)
        fetchGenres()
      } else {
        toast.error("Failed to delete genre")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete genre")
    }
  }

  return {
    genres,
    loading,
    submitting,
    newName,
    setNewName,
    newDesc,
    setNewDesc,
    expandedId,
    setExpandedId,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    confirmDeleteId,
    setConfirmDeleteId,
    handleAdd,
    toggleExpand,
    handleSaveEdit,
    handleDeleteConfirm,
  }
}
