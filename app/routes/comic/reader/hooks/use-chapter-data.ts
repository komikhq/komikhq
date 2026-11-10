import { useMemo } from "react"
import type {
  ChapterFullData,
  ChapterNavInfo,
} from "../types/reader.types"
import { formatSlugToTitle } from "../lib/reader-helpers"

interface UseChapterDataProps {
  data: ChapterFullData | null | undefined
  currentComicSlug?: string
  currentChapterSlug?: string
}

export function useChapterData({
  data,
  currentComicSlug,
  currentChapterSlug,
}: UseChapterDataProps) {
  const comicTitle = useMemo(() => {
    return (
      data?.comic?.title ||
      formatSlugToTitle(currentComicSlug?.replace(/-\d{4}$/, ""), "Comic")
    )
  }, [data?.comic?.title, currentComicSlug])

  const chapterTitle = useMemo(() => {
    if (data?.chapter?.title) return data.chapter.title
    if (data?.chapter?.chapterNumber) return `Chapter ${data.chapter.chapterNumber}`
    return currentChapterSlug
      ? `Chapter ${currentChapterSlug.replace(/^(chapter-|ch-)/i, "")}`
      : "Chapter"
  }, [data?.chapter, currentChapterSlug])

  const pages = useMemo(() => {
    return data?.pages || []
  }, [data?.pages])

  const navInfo = useMemo<ChapterNavInfo>(() => {
    const allChapters = data?.allChapters || []
    if (!allChapters.length || !currentChapterSlug) {
      return {
        prevSlug: null,
        nextSlug: null,
        prevTitle: null,
        nextTitle: null,
        currentIndex: -1,
        totalChapters: allChapters.length,
      }
    }

    const currentIndex = allChapters.findIndex(
      (ch) => ch.slug === currentChapterSlug
    )

    if (currentIndex === -1) {
      return {
        prevSlug: null,
        nextSlug: null,
        prevTitle: null,
        nextTitle: null,
        currentIndex: -1,
        totalChapters: allChapters.length,
      }
    }

    const prev = currentIndex > 0 ? allChapters[currentIndex - 1] : null
    const next =
      currentIndex < allChapters.length - 1
        ? allChapters[currentIndex + 1]
        : null

    return {
      prevSlug: prev?.slug ?? null,
      nextSlug: next?.slug ?? null,
      prevTitle: prev ? prev.title || `Chapter ${prev.chapterNumber}` : null,
      nextTitle: next ? next.title || `Chapter ${next.chapterNumber}` : null,
      currentIndex,
      totalChapters: allChapters.length,
    }
  }, [data?.allChapters, currentChapterSlug])

  return {
    comicTitle,
    chapterTitle,
    pages,
    navInfo,
    allChapters: data?.allChapters || [],
  }
}

