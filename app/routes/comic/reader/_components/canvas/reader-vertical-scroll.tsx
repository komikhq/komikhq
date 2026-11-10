import { useEffect, useRef } from "react"
import { useReader } from "../../context/reader-context"
import { getReaderWidthClass } from "../../lib/reader-helpers"
import { ReaderPageItem } from "./reader-page-item"

export function ReaderVerticalScroll() {
  const {
    pages,
    settings,
    activePageIndex,
    finishModeSwitch,
  } = useReader()

  const hasMountedRef = useRef(false)
  const widthClass = getReaderWidthClass(settings.width)
  const spacingClass =
    settings.spacing === "spaced" ? "space-y-4 py-4" : "space-y-0 py-0"

  // Context-aware scroll positioning (top-anchor for Page 1, or instant snap for history resume)
  useEffect(() => {
    if (typeof window === "undefined") return

    const performRestoration = () => {
      if (activePageIndex > 0) {
        // Resume history: Instant snap to specific page
        const targetId = `reader-page-${activePageIndex}`
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" })
        }
      } else if (!hasMountedRef.current) {
        // Fresh open (Page 1): Strictly anchor at top (0, 0)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      }
      hasMountedRef.current = true

      // Wait two frames for layout settling before releasing observer mutex
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          finishModeSwitch()
        })
        return () => cancelAnimationFrame(raf2)
      })
      return () => cancelAnimationFrame(raf1)
    }

    return performRestoration()
  }, [activePageIndex, finishModeSwitch])

  return (
    <div
      className={`mx-auto ${widthClass} ${spacingClass} [overflow-anchor:none] transition-[max-width] duration-200`}
    >
      {pages.map((page, index) => (
        <ReaderPageItem
          key={page.id || `${page.pageNumber}-${index}`}
          page={page}
          pageIndex={index}
          totalPages={pages.length}
          priorityImmediate={Math.abs(index - activePageIndex) <= 1}
        />
      ))}
    </div>
  )
}
