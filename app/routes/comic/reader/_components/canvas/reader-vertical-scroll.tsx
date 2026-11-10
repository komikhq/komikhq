import { useEffect } from "react"
import { useReader } from "../../context/reader-context"
import { getReaderWidthClass } from "../../lib/reader-helpers"
import { ReaderPageItem } from "./reader-page-item"

export function ReaderVerticalScroll() {
  const {
    pages,
    settings,
    activePageIndex,
    isModeSwitchingRef,
    finishModeSwitch,
  } = useReader()
  const widthClass = getReaderWidthClass(settings.width)
  const spacingClass =
    settings.spacing === "spaced" ? "space-y-4 py-4" : "space-y-0 py-0"

  // Instant scroll restoration upon mounting into Webtoon mode
  useEffect(() => {
    if (typeof window === "undefined") return

    if (activePageIndex > 0) {
      // Force instant scroll to the active page container
      const targetId = `reader-page-${activePageIndex}`
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" })
      }

      // Wait two animation frames to ensure layout and scroll coordinates have settled
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          finishModeSwitch()
        })
        return () => cancelAnimationFrame(raf2)
      })

      return () => cancelAnimationFrame(raf1)
    } else {
      finishModeSwitch()
    }
  }, [activePageIndex, finishModeSwitch])

  return (
    <div
      className={`mx-auto ${widthClass} ${spacingClass} transition-[max-width] duration-200`}
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
