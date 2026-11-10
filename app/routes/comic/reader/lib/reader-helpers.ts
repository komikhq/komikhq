import type { ReaderSettings, ReaderWidth } from "../types/reader.types"

export const READER_STORAGE_SETTINGS_KEY = "komikhq_reader_settings"
export const READER_STORAGE_HISTORY_PREFIX = "komikhq_reading_history:"

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  mode: "webtoon",
  width: "standard",
  spacing: "seamless",
  autoHideHud: true,
}

/**
 * Returns Tailwind max-width CSS classes based on reader width setting
 */
export function getReaderWidthClass(width: ReaderWidth): string {
  switch (width) {
    case "compact":
      return "max-w-2xl" // ~672px
    case "standard":
      return "max-w-3xl" // ~768px
    case "wide":
      return "max-w-5xl" // ~1024px
    case "full":
      return "max-w-none w-full"
    default:
      return "max-w-3xl"
  }
}

/**
 * Formats comic or chapter slug into a readable label
 */
export function formatSlugToTitle(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Loads reader user settings from localStorage safely (SSR-compatible)
 */
export function loadReaderSettings(): ReaderSettings {
  if (typeof window === "undefined") return DEFAULT_READER_SETTINGS
  try {
    const raw = localStorage.getItem(READER_STORAGE_SETTINGS_KEY)
    if (!raw) return DEFAULT_READER_SETTINGS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_READER_SETTINGS,
      ...parsed,
    }
  } catch {
    return DEFAULT_READER_SETTINGS
  }
}

/**
 * Persists reader settings to localStorage
 */
export function saveReaderSettings(settings: ReaderSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(READER_STORAGE_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn("[ReaderSettings] Failed to save to localStorage:", error)
  }
}

/**
 * Saves guest reading progress to localStorage
 */
export function saveLocalReadingProgress(
  comicId: string,
  chapterId: string,
  pageIndex: number,
  totalPages: number
): void {
  if (typeof window === "undefined" || !comicId || !chapterId) return
  try {
    const record = {
      comicId,
      chapterId,
      lastReadPage: pageIndex + 1,
      snapshotTotalPages: totalPages,
      timestamp: Date.now(),
    }
    localStorage.setItem(`${READER_STORAGE_HISTORY_PREFIX}${comicId}`, JSON.stringify(record))
  } catch (error) {
    console.warn("[ReaderLocalProgress] Failed to save local progress:", error)
  }
}

