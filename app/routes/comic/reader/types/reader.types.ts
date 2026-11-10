/**
 * Types & interfaces for KomikHQ Chapter Reader
 */

export interface ChapterPageItem {
  id?: string
  chapterId?: string
  pageNumber: number
  imageUrl: string
  width?: number | null
  height?: number | null
}

export interface ChapterSummary {
  id: string
  chapterNumber: string
  slug: string
  title?: string
}

export interface ChapterComicMeta {
  id: string
  title: string
  slug: string
}

export interface ChapterDetailMeta {
  id: string
  chapterNumber: string
  slug: string
  title?: string
  totalPages?: number
}

export interface ChapterFullData {
  comic: ChapterComicMeta
  chapter: ChapterDetailMeta
  pages: ChapterPageItem[]
  allChapters: ChapterSummary[]
}

export interface ChapterNavInfo {
  prevSlug: string | null
  nextSlug: string | null
  prevTitle: string | null
  nextTitle: string | null
  currentIndex: number
  totalChapters: number
}

export type ReaderMode = "webtoon" | "paged-ltr" | "paged-rtl"
export type ReaderWidth = "compact" | "standard" | "wide" | "full"
export type ReaderSpacing = "seamless" | "spaced"

export interface ReaderSettings {
  mode: ReaderMode
  width: ReaderWidth
  spacing: ReaderSpacing
  autoHideHud: boolean
}

export type PageLoadStatus = "idle" | "loading" | "loaded" | "error"

export enum PagePriority {
  IMMEDIATE = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
  IDLE = 4,
}

