import { useEffect } from "react"
import type { ReaderMode } from "../types/reader.types"

interface UseReaderShortcutsProps {
  mode: ReaderMode
  totalPages: number
  activePageIndex: number
  onNavigatePage: (newIndex: number) => void
  onToggleHud: () => void
}

export function useReaderShortcuts({
  mode,
  totalPages,
  activePageIndex,
  onNavigatePage,
  onToggleHud,
}: UseReaderShortcutsProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside an input/textarea
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D": {
          if (mode === "paged-rtl") {
            if (activePageIndex > 0) onNavigatePage(activePageIndex - 1)
          } else if (mode === "paged-ltr") {
            if (activePageIndex < totalPages - 1) onNavigatePage(activePageIndex + 1)
          } else {
            // Webtoon scroll step
            window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" })
          }
          break
        }
        case "ArrowLeft":
        case "a":
        case "A": {
          if (mode === "paged-rtl") {
            if (activePageIndex < totalPages - 1) onNavigatePage(activePageIndex + 1)
          } else if (mode === "paged-ltr") {
            if (activePageIndex > 0) onNavigatePage(activePageIndex - 1)
          } else {
            // Webtoon scroll step up
            window.scrollBy({ top: -window.innerHeight * 0.7, behavior: "smooth" })
          }
          break
        }
        case "j":
        case "J": {
          window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })
          break
        }
        case "k":
        case "K": {
          window.scrollBy({ top: -window.innerHeight * 0.5, behavior: "smooth" })
          break
        }
        case "f":
        case "F": {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {})
          } else {
            document.exitFullscreen().catch(() => {})
          }
          break
        }
        case "h":
        case "H":
        case "m":
        case "M": {
          onToggleHud()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode, totalPages, activePageIndex, onNavigatePage, onToggleHud])
}

