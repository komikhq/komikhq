import { useEffect, useRef } from "react"
import { viewsApi, readingHistoryApi } from "@/lib/sdk-client"
import { saveLocalReadingProgress } from "../lib/reader-helpers"

interface UseReadingTrackerProps {
  comicId?: string
  chapterId?: string
  activePageIndex: number
  totalPages: number
  isModeSwitchingRef?: React.RefObject<boolean>
}

// Module-level set of viewed chapter IDs to avoid duplicate views during client navigation/re-renders
const recordedViewsSet = new Set<string>()

export function useReadingTracker({
  comicId,
  chapterId,
  activePageIndex,
  totalPages,
  isModeSwitchingRef,
}: UseReadingTrackerProps) {
  const historyDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewEngagementTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Idempotent View Count Tracker
  useEffect(() => {
    if (!comicId || !chapterId) return
    const key = `${comicId}:${chapterId}`
    if (recordedViewsSet.has(key)) return

    const triggerView = () => {
      if (recordedViewsSet.has(key)) return
      recordedViewsSet.add(key)

      viewsApi
        .recordComicView({
          recordComicViewRequest: { comicId, chapterId },
        })
        .catch((err) => {
          console.debug("[ReadingTracker] View count ignored or failed:", err)
        })
    }

    // Engagement rule: Trigger if user stays 3 seconds OR scrolls past Page 1
    if (activePageIndex > 0) {
      triggerView()
    } else {
      viewEngagementTimer.current = setTimeout(triggerView, 3000)
    }

    return () => {
      if (viewEngagementTimer.current) {
        clearTimeout(viewEngagementTimer.current)
      }
    }
  }, [comicId, chapterId, activePageIndex])

  // 2. Reading History Sync (Guest LocalStorage + Authenticated Cloud Debounce)
  useEffect(() => {
    if (!comicId || !chapterId || totalPages <= 0) return

    // Pause history recording during layout mode switching reflow
    if (isModeSwitchingRef?.current) return

    // Immediately persist to guest localStorage
    saveLocalReadingProgress(comicId, chapterId, activePageIndex, totalPages)

    // Debounce cloud API call by 1500ms
    if (historyDebounceTimer.current) {
      clearTimeout(historyDebounceTimer.current)
    }

    historyDebounceTimer.current = setTimeout(() => {
      // Re-verify guard inside timer
      if (isModeSwitchingRef?.current) return

      readingHistoryApi
        .recordReadingProgress({
          recordReadingProgressRequest: {
            comicId,
            chapterId,
            lastReadPage: activePageIndex + 1,
            snapshotTotalPages: totalPages,
          },
        })
        .catch(() => {
          // Silent catch: User might be a guest or network dropped
        })
    }, 1500)

    return () => {
      if (historyDebounceTimer.current) {
        clearTimeout(historyDebounceTimer.current)
      }
    }
  }, [comicId, chapterId, activePageIndex, totalPages, isModeSwitchingRef])
}
