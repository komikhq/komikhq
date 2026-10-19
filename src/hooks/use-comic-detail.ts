import { useState, useEffect } from "react"
import { comicsApi, bookmarksApi } from "@/lib/sdk-client"
import { invalidateCache } from "@/lib/coalescing-fetch"

export interface ComicDetailData {
  comic: any
  genres: any[]
  creators: any[]
  chapters: any[]
}

export function useComicDetail(slug?: string, initialData?: ComicDetailData | null) {
  const [bookmarked, setBookmarked] = useState(false)
  const [comicData, setComicData] = useState<ComicDetailData | null>(initialData ?? null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    // If initialData was provided by SSR, skip the fetch on first mount
    if (initialData) {
      // Still check bookmark status for authenticated users
      if (initialData.comic?.id) {
        bookmarksApi
          .listBookmarks()
          .then((res: any) => {
            if (res.bookmarks) {
              const isSaved = res.bookmarks.some(
                (b: any) => b.comic.id === initialData.comic.id
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
          setComicData(data)
          if (data.comic?.id) {
            bookmarksApi
              .listBookmarks()
              .then((res: any) => {
                if (isMounted && res.bookmarks) {
                  const isSaved = res.bookmarks.some(
                    (b: any) => b.comic.id === data.comic.id
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
        await bookmarksApi.saveBookmark({
          saveBookmarkRequest: { comicId: targetComicId, status: "reading" },
        })
      } else {
        await bookmarksApi.removeBookmark({ comicId: targetComicId })
      }
      invalidateCache("/bookmarks")
    } catch {
      // Rollback on failure
      setBookmarked(!nextState)
    }
  }

  const handleReadFirstChapter = () => {
    if (comicData?.chapters?.[0]) {
      window.location.href = `/komik/${comicData.comic.slug}/${comicData.chapters[0].slug}`
    }
  }

  const handleNavigateCatalog = () => {
    window.location.href = "/browse"
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
