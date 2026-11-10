import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react"
import type {
  ChapterFullData,
  ChapterNavInfo,
  ChapterPageItem,
  ChapterSummary,
  ReaderSettings,
} from "../types/reader.types"
import { useChapterData } from "../hooks/use-chapter-data"
import { useReaderSettings } from "../hooks/use-reader-settings"
import { useChapterImageQueue } from "../hooks/use-chapter-image-queue"
import { useReadingTracker } from "../hooks/use-reading-tracker"
import { useScrollPageTracker } from "../hooks/use-scroll-page-tracker"
import { useReaderShortcuts } from "../hooks/use-reader-shortcuts"

interface ReaderContextValue {
  data: ChapterFullData | null | undefined
  comicSlug?: string
  chapterSlug?: string
  comicTitle: string
  chapterTitle: string
  pages: ChapterPageItem[]
  allChapters: ChapterSummary[]
  navInfo: ChapterNavInfo
  activePageIndex: number
  setActivePageIndex: (index: number) => void
  scrollToPage: (index: number) => void
  isHudVisible: boolean
  setHudVisible: (visible: boolean) => void
  toggleHud: () => void
  settings: ReaderSettings
  updateSettings: (updates: Partial<ReaderSettings>) => void
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (open: boolean) => void
  isImageLoaded: (url: string) => boolean
  isImageFailed: (url: string) => boolean
  enqueueImmediate: (url: string, index: number) => void
  isModeSwitchingRef: React.RefObject<boolean>
  finishModeSwitch: () => void
}

const ReaderContext = createContext<ReaderContextValue | null>(null)

interface ReaderProviderProps {
  children: ReactNode
  initialData?: ChapterFullData | null
  comicSlug?: string
  chapterSlug?: string
}

export function ReaderProvider({
  children,
  initialData,
  comicSlug,
  chapterSlug,
}: ReaderProviderProps) {
  const { comicTitle, chapterTitle, pages, navInfo, allChapters } = useChapterData({
    data: initialData,
    currentComicSlug: comicSlug,
    currentChapterSlug: chapterSlug,
  })

  const { settings, updateSettings } = useReaderSettings()

  const [activePageIndex, setActivePageIndex] = useState(0)
  const [isHudVisible, setHudVisible] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const lastScrollY = useRef(0)
  const isProgrammaticScrollRef = useRef(false)
  const isModeSwitchingRef = useRef(false)
  const prevModeRef = useRef(settings.mode)
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect mode changes from paged -> webtoon to activate transition mutex lock
  useEffect(() => {
    if (prevModeRef.current !== settings.mode) {
      if (prevModeRef.current !== "webtoon" && settings.mode === "webtoon") {
        isModeSwitchingRef.current = true
      }
      prevModeRef.current = settings.mode
    }
  }, [settings.mode])

  const finishModeSwitch = useCallback(() => {
    isModeSwitchingRef.current = false
  }, [])

  const handlePageChange = useCallback((idx: number) => {
    setActivePageIndex(idx)
  }, [])

  // 1. Center-band IntersectionObserver page tracker (for Webtoon vertical mode)
  const isWebtoonMode = settings.mode === "webtoon"
  const { setReportedIndex } = useScrollPageTracker({
    totalCount: pages.length,
    enabled: isWebtoonMode,
    onPageChange: handlePageChange,
    isProgrammaticScrollRef,
    isModeSwitchingRef,
  })

  // 2. Queue for sequential image loading with lookahead
  const { isImageLoaded, isImageFailed, enqueueImmediate } = useChapterImageQueue({
    pages,
    activePageIndex,
    lookahead: 3,
  })

  // 3. Dual-tier reading history & view count tracker
  useReadingTracker({
    comicId: initialData?.comic?.id,
    chapterId: initialData?.chapter?.id,
    activePageIndex,
    totalPages: pages.length,
    isModeSwitchingRef,
  })

  const toggleHud = useCallback(() => {
    setHudVisible((prev) => !prev)
  }, [])

  // 4. Scroll smoothly to specific page element (with programmatic guard)
  const scrollToPage = useCallback(
    (targetIndex: number) => {
      const boundedIndex = Math.max(0, Math.min(targetIndex, pages.length - 1))
      setActivePageIndex(boundedIndex)
      setReportedIndex(boundedIndex)

      if (isWebtoonMode && typeof window !== "undefined") {
        isProgrammaticScrollRef.current = true
        if (programmaticScrollTimer.current) {
          clearTimeout(programmaticScrollTimer.current)
        }
        programmaticScrollTimer.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false
        }, 500)

        const el = document.getElementById(`reader-page-${boundedIndex}`)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    },
    [pages.length, isWebtoonMode, setReportedIndex]
  )

  // 5. Smart auto-hide HUD on downward scroll; reveal on upward scroll
  useEffect(() => {
    if (!settings.autoHideHud || typeof window === "undefined" || !isWebtoonMode) {
      return
    }

    const handleHudScroll = () => {
      // Don't auto-hide HUD while mode is transitioning or scrubbing
      if (isModeSwitchingRef.current || isProgrammaticScrollRef.current) return

      const currentScrollY = window.scrollY
      if (Math.abs(currentScrollY - lastScrollY.current) < 50) return

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        // Scrolling down -> hide HUD
        setHudVisible(false)
      } else {
        // Scrolling up -> show HUD
        setHudVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleHudScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleHudScroll)
  }, [settings.autoHideHud, isWebtoonMode])

  // 6. Global keyboard shortcuts
  useReaderShortcuts({
    mode: settings.mode,
    totalPages: pages.length,
    activePageIndex,
    onNavigatePage: scrollToPage,
    onToggleHud: toggleHud,
  })

  const contextValue: ReaderContextValue = {
    data: initialData,
    comicSlug,
    chapterSlug,
    comicTitle,
    chapterTitle,
    pages,
    allChapters,
    navInfo,
    activePageIndex,
    setActivePageIndex,
    scrollToPage,
    isHudVisible,
    setHudVisible,
    toggleHud,
    settings,
    updateSettings,
    isDrawerOpen,
    setIsDrawerOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isImageLoaded,
    isImageFailed,
    enqueueImmediate,
    isModeSwitchingRef,
    finishModeSwitch,
  }

  return (
    <ReaderContext.Provider value={contextValue}>
      {children}
    </ReaderContext.Provider>
  )
}

export function useReader(): ReaderContextValue {
  const context = useContext(ReaderContext)
  if (!context) {
    throw new Error("useReader must be used within a ReaderProvider")
  }
  return context
}
