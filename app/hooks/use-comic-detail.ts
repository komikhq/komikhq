import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { comicsApi, bookmarksApi } from "@/lib/sdk-client"
import { invalidateCache } from "@/lib/coalescing-fetch"

export interface ComicDetailData {
  comic: any
  genres: any[]
  creators: any[]
  chapters: any[]
}

export function useComicDetail(slug?: string, initialData?: ComicDetailData | null) {
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(false)
  const [comicData, setComicData] = useState<ComicDetailData | null>(initialData ?? null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setComicData(initialData)
      setIsLoading(false)
    }
  }, [initialData])

  useEffect(() => {
    if (!slug) return
    // If initialData was provided by SSR, skip the fetch on first mount
    if (initialData) {
      // Still check bookmark status for authenticated users
      const comicId = initialData.comic?.id || (initialData as any).id
      if (comicId) {
        bookmarksApi
          .listBookmarks()
          .then((res: any) => {
            if (res.data) {
              const isSaved = res.data.some(
                (b: any) => b.comic?.id === comicId || b.comicId === comicId
              )
              setBookmarked(isSaved)
            }
          })
          .catch(() => {})
      }
      return
    }

    // No initialData — fetch from SDK (fallback for client-side navigation)
    let isMounted = true
    setIsLoading(true)
    setError(null)

    comicsApi
      .getComicBySlug({ slug })
      .then((data: any) => {
        if (isMounted) {
          const raw = data?.data || data
          const comic = raw.comic || raw
          const normalized = {
            ...raw,
            comic,
            title: comic.title || raw.title,
            synopsis: comic.synopsis || raw.synopsis,
            chapters: raw.chapters || comic.chapters || [],
            genres: raw.genres || comic.genres || [],
            creators: raw.creators || comic.creators || [],
          }
          setComicData(normalized)
          const comicId = comic?.id || raw?.id
          if (comicId) {
            bookmarksApi
              .listBookmarks()
              .then((res: any) => {
                if (isMounted && res.data) {
                  const isSaved = res.data.some(
                    (b: any) => b.comic?.id === comicId || b.comicId === comicId
                  )
                  setBookmarked(isSaved)
                }
              })
              .catch(() => {})
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.message || "Failed to load comic details.")
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  const toggleBookmark = async () => {
    if (!comicData?.comic?.id) return
    const targetComicId = comicData.comic.id
    const nextState = !bookmarked
    setBookmarked(nextState)

    try {
      if (nextState) {
        await bookmarksApi.upsertBookmark({
          upsertBookmarkRequest: { comicId: targetComicId, status: "reading" },
        })
      } else {
        await bookmarksApi.deleteBookmark({ comicId: targetComicId })
      }
      invalidateCache("/bookmarks")
    } catch {
      // Rollback on failure
      setBookmarked(!nextState)
    }
  }

  const handleReadFirstChapter = () => {
    if (comicData?.chapters?.[0]) {
      navigate(`/komik/${comicData.comic.slug}/${comicData.chapters[0].slug}`)
    }
  }

  const handleNavigateCatalog = () => {
    navigate("/browse")
  }

  return {
    comicData,
    isLoading,
    error,
    bookmarked,
    toggleBookmark,
    handleReadFirstChapter,
    handleNavigateCatalog,
  }
}
