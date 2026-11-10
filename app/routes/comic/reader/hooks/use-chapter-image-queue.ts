import { useEffect, useState, useMemo, useCallback, useRef } from "react"
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
  const authorizedIndicesRef = useRef<Set<number>>(new Set())

  // Keep track of authorized page indices to grant <img> src permission
  const [authorizedVersion, setAuthorizedVersion] = useState(0)

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

  // Sequential Priority Scheduler: Enqueue and authorize visible & lookahead window
  useEffect(() => {
    if (!pages.length) return

    const newlyAuthorized = new Set(authorizedIndicesRef.current)

    // 1. Visible page (Immediate priority)
    if (activePageIndex >= 0 && activePageIndex < pages.length) {
      newlyAuthorized.add(activePageIndex)
      if (pages[activePageIndex]?.imageUrl) {
        queue.enqueue(pages[activePageIndex].imageUrl, activePageIndex, PagePriority.IMMEDIATE)
      }
    }

    // 2. Next page ahead (High priority)
    const nextIdx = activePageIndex + 1
    if (nextIdx < pages.length) {
      newlyAuthorized.add(nextIdx)
      if (pages[nextIdx]?.imageUrl) {
        queue.enqueue(pages[nextIdx].imageUrl, nextIdx, PagePriority.HIGH)
      }
    }

    // 3. Further lookahead pages (Normal priority)
    for (let offset = 2; offset <= lookahead; offset++) {
      const idx = activePageIndex + offset
      if (idx < pages.length) {
        newlyAuthorized.add(idx)
        if (pages[idx]?.imageUrl) {
          queue.enqueue(pages[idx].imageUrl, idx, PagePriority.NORMAL)
        }
      }
    }

    // 4. Previous buffer page (Low priority)
    const prevIdx = activePageIndex - 1
    if (prevIdx >= 0) {
      newlyAuthorized.add(prevIdx)
      if (pages[prevIdx]?.imageUrl) {
        queue.enqueue(pages[prevIdx].imageUrl, prevIdx, PagePriority.LOW)
      }
    }

    authorizedIndicesRef.current = newlyAuthorized
    setAuthorizedVersion((v) => v + 1)

    // Dynamically reprioritize any pending tasks in the queue
    queue.reprioritize(activePageIndex, lookahead)
  }, [pages, activePageIndex, lookahead, queue])

  const isPageAuthorized = useCallback(
    (pageIndex: number) => {
      return authorizedIndicesRef.current.has(pageIndex)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authorizedVersion]
  )

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
      authorizedIndicesRef.current.add(index)
      queue.enqueue(url, index, PagePriority.IMMEDIATE)
    },
    [queue]
  )

  return {
    isImageLoaded,
    isImageFailed,
    enqueueImmediate,
    isPageAuthorized,
  }
}
