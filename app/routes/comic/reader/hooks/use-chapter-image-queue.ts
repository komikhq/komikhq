import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { ChapterImageQueue } from "../lib/image-loader-queue"
import { PagePriority, type ChapterPageItem } from "../types/reader.types"

interface UseChapterImageQueueProps {
  pages: ChapterPageItem[]
  activePageIndex: number
  lookahead?: number
}

export function useChapterImageQueue({
  pages,
  activePageIndex,
  lookahead = 3,
}: UseChapterImageQueueProps) {
  const queue = useMemo(() => new ChapterImageQueue(2), [])
  const [, setLoadVersion] = useState(0)

  // Subscribe to queue completion events to force re-render when needed
  useEffect(() => {
    const unsubscribe = queue.subscribe(() => {
      setLoadVersion((v) => v + 1)
    })
    return () => {
      unsubscribe()
      queue.clear()
    }
  }, [queue])

  // Sequential Priority Scheduler: Enqueue visible & lookahead window
  useEffect(() => {
    if (!pages.length) return

    // 1. Visible page (Immediate)
    if (pages[activePageIndex]?.imageUrl) {
      queue.enqueue(pages[activePageIndex].imageUrl, activePageIndex, PagePriority.IMMEDIATE)
    }

    // 2. Next page ahead (High)
    const nextIdx = activePageIndex + 1
    if (nextIdx < pages.length && pages[nextIdx]?.imageUrl) {
      queue.enqueue(pages[nextIdx].imageUrl, nextIdx, PagePriority.HIGH)
    }

    // 3. Further lookahead pages (Normal)
    for (let offset = 2; offset <= lookahead; offset++) {
      const idx = activePageIndex + offset
      if (idx < pages.length && pages[idx]?.imageUrl) {
        queue.enqueue(pages[idx].imageUrl, idx, PagePriority.NORMAL)
      }
    }

    // 4. Previous buffer page (Low)
    const prevIdx = activePageIndex - 1
    if (prevIdx >= 0 && pages[prevIdx]?.imageUrl) {
      queue.enqueue(pages[prevIdx].imageUrl, prevIdx, PagePriority.LOW)
    }

    // Dynamically reprioritize any pending tasks in the queue
    queue.reprioritize(activePageIndex, lookahead)
  }, [pages, activePageIndex, lookahead, queue])

  const isImageLoaded = useCallback(
    (url: string) => {
      return queue.isLoaded(url)
    },
    [queue]
  )

  const isImageFailed = useCallback(
    (url: string) => {
      return queue.hasFailed(url)
    },
    [queue]
  )

  const enqueueImmediate = useCallback(
    (url: string, index: number) => {
      queue.enqueue(url, index, PagePriority.IMMEDIATE)
    },
    [queue]
  )

  return {
    isImageLoaded,
    isImageFailed,
    enqueueImmediate,
  }
}

