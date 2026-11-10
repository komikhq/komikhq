import { useEffect, useRef } from "react"

interface UseScrollPageTrackerProps {
  totalCount: number
  enabled?: boolean
  onPageChange?: (pageIndex: number) => void
  isProgrammaticScrollRef?: React.RefObject<boolean>
  isModeSwitchingRef?: React.RefObject<boolean>
}

/**
 * Tracks the active page index using a high-performance Center-Band IntersectionObserver.
 * - rootMargin: "-48% 0px -48% 0px" shrinks the viewport detection zone to a narrow horizontal band in the vertical center.
 * - threshold: 0 ensures any image instantly triggers when crossing center screen.
 * - Guarded against programmatic scroll and mode-switch layout reflow.
 */
export function useScrollPageTracker({
  totalCount,
  enabled = true,
  onPageChange,
  isProgrammaticScrollRef,
  isModeSwitchingRef,
}: UseScrollPageTrackerProps) {
  const onPageChangeRef = useRef(onPageChange)
  onPageChangeRef.current = onPageChange

  const lastReportedIndex = useRef<number>(-1)

  useEffect(() => {
    if (!enabled || totalCount <= 0 || typeof window === "undefined") return

    let isDisposed = false

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Ignore scroll updates during programmatic slider scrubbing or layout mode switching
      if (isProgrammaticScrollRef?.current || isModeSwitchingRef?.current) return

      // Collect all entries currently intersecting the center midline band
      const intersecting = entries.filter((e) => e.isIntersecting)
      if (intersecting.length === 0) return

      // If multiple intersect (e.g. thin slices), find the one closest to the middle of the screen
      let bestIndex = -1
      let minDistance = Infinity
      const midY = window.innerHeight / 2

      for (const entry of intersecting) {
        const rawIndex = entry.target.getAttribute("data-page-index")
        if (rawIndex !== null) {
          const idx = parseInt(rawIndex, 10)
          const rect = entry.boundingClientRect
          const itemCenter = rect.top + rect.height / 2
          const distance = Math.abs(itemCenter - midY)

          if (distance < minDistance) {
            minDistance = distance
            bestIndex = idx
          }
        }
      }

      if (
        bestIndex >= 0 &&
        bestIndex < totalCount &&
        bestIndex !== lastReportedIndex.current
      ) {
        lastReportedIndex.current = bestIndex
        onPageChangeRef.current?.(bestIndex)
      }
    }

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-48% 0px -48% 0px",
      threshold: 0,
    })

    // Observe all page elements currently in the DOM
    const attachObserver = () => {
      if (isDisposed) return
      const elements = document.querySelectorAll<HTMLElement>("[data-page-index]")
      elements.forEach((el) => observer.observe(el))
    }

    // Initial attach
    attachObserver()
    const timeoutId = setTimeout(attachObserver, 80)

    // MutationObserver to automatically bind dynamically loaded pages
    const mutationObserver = new MutationObserver(() => {
      attachObserver()
    })

    const canvasRoot = document.querySelector("main") || document.body
    mutationObserver.observe(canvasRoot, {
      childList: true,
      subtree: true,
    })

    return () => {
      isDisposed = true
      clearTimeout(timeoutId)
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [totalCount, enabled, isProgrammaticScrollRef, isModeSwitchingRef])

  return {
    setReportedIndex: (index: number) => {
      lastReportedIndex.current = index
    },
  }
}
