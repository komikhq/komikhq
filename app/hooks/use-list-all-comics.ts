import { useState, useEffect, useMemo } from "react"
import { comicsApi } from "@/lib/sdk-client"

export interface ListAllComicItem {
  id?: string
  slug: string
  title: string
  cover?: string
  coverUrl?: string
  genres?: Array<{ id: string; name: string; slug: string }>
  status?: string
  type?: string
  totalViews?: number
}

export function useListAllComics(initialComics?: ListAllComicItem[]) {
  const [comics, setComics] = useState<ListAllComicItem[]>(initialComics || [])
  const [isLoading, setIsLoading] = useState<boolean>(!initialComics?.length)

  useEffect(() => {
    if (initialComics && initialComics.length > 0) return
    let isMounted = true
    setIsLoading(true)

    // Fetch comic catalog with high limit for comprehensive alphabetical index
    comicsApi
      .listComics({ limit: 500 })
      .then((res: any) => {
        if (isMounted) {
          setComics(res.data?.items || res.comics || res.data || [])
        }
      })
      .catch(() => {
        if (isMounted) setComics([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Sort comics alphanumerically by title (case-insensitive, natural numeric sorting)
  const sortedComics = useMemo(() => {
    return [...comics].sort((a, b) => {
      const titleA = (a.title || "").trim()
      const titleB = (b.title || "").trim()
      return titleA.localeCompare(titleB, "id", {
        sensitivity: "base",
        numeric: true,
      })
    })
  }, [comics])

  // Group comics into dictionary buckets (# for numbers/symbols, A-Z for letters)
  const groupedComics = useMemo(() => {
    const groups: Record<string, ListAllComicItem[]> = {}

    for (const comic of sortedComics) {
      const title = (comic.title || "").trim()
      const firstChar = title.charAt(0).toUpperCase()
      const key = /^[A-Z]$/.test(firstChar) ? firstChar : "#"

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(comic)
    }

    return groups
  }, [sortedComics])

  // Set of letters that contain at least one comic
  const availableLetters = useMemo(() => {
    return new Set(Object.keys(groupedComics))
  }, [groupedComics])

  return {
    comics,
    sortedComics,
    groupedComics,
    availableLetters,
    isLoading,
  }
}
