import { useState, useRef, useEffect } from "react"
import {
  CircleNotchIcon as CircleNotch,
  WarningCircleIcon as WarningCircle,
  ArrowClockwiseIcon as ArrowClockwise,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { ChapterPageItem } from "../../types/reader.types"
import { useReader } from "../../context/reader-context"

interface ReaderPageItemProps {
  page: ChapterPageItem
  pageIndex: number
  totalPages: number
  priorityImmediate?: boolean
}

export function ReaderPageItem({
  page,
  pageIndex,
  totalPages,
  priorityImmediate = false,
}: ReaderPageItemProps) {
  const {
    isImageLoaded,
    isImageFailed,
    enqueueImmediate,
    isPageAuthorized,
  } = useReader()

  const [internalLoaded, setInternalLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [naturalRatio, setNaturalRatio] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const imageWidth =
    Number.isInteger(page.width) && (page.width ?? 0) > 0 ? page.width! : undefined
  const imageHeight =
    Number.isInteger(page.height) && (page.height ?? 0) > 0 ? page.height! : undefined
  const hasKnownDimensions = imageWidth !== undefined && imageHeight !== undefined

  const isAuthorized = isPageAuthorized(pageIndex)
  const queueLoaded = isImageLoaded(page.imageUrl)
  const queueFailed = isImageFailed(page.imageUrl)
  const isReady = internalLoaded || queueLoaded

  // Enqueue to priority queue when visible or prioritized
  useEffect(() => {
    if (priorityImmediate) {
      enqueueImmediate(page.imageUrl, pageIndex)
    }
  }, [priorityImmediate, page.imageUrl, pageIndex, enqueueImmediate])

  // Near-viewport intersection observer to trigger high-priority queue fetch
  useEffect(() => {
    if (isReady || typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            enqueueImmediate(page.imageUrl, pageIndex)
            observer.disconnect()
            break
          }
        }
      },
      {
        rootMargin: "600px 0px 600px 0px",
        threshold: 0.01,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isReady, page.imageUrl, pageIndex, enqueueImmediate])

  const handleRetry = () => {
    setHasError(false)
    setInternalLoaded(false)
    setRetryKey((k) => k + 1)
    enqueueImmediate(page.imageUrl, pageIndex)
  }

  // Dynamic Aspect Ratio: naturalRatio from loaded image > metadata ratio > stable comic portrait ratio (2/3)
  const effectiveRatio =
    naturalRatio || (hasKnownDimensions ? `${imageWidth} / ${imageHeight}` : "2 / 3")

  return (
    <div
      ref={containerRef}
      id={`reader-page-${pageIndex}`}
      data-page-index={pageIndex}
      className="relative w-full overflow-hidden bg-neutral-950 select-none"
      style={{
        aspectRatio: effectiveRatio,
      }}
    >
      {/* Loading Skeleton */}
      {!isReady && !hasError && !queueFailed && (
        <div className="absolute inset-0 flex w-full flex-col items-center justify-center gap-2 bg-neutral-900/60 text-neutral-500 transition-opacity duration-300">
          <CircleNotch className="h-5 w-5 animate-spin text-primary" />
          <span className="font-mono text-xs text-neutral-400">
            Page {page.pageNumber || pageIndex + 1}
          </span>
        </div>
      )}

      {/* Error / Retry Fallback */}
      {(hasError || queueFailed) && (
        <div className="flex w-full flex-col items-center justify-center gap-3 bg-neutral-900/90 py-12 text-center text-neutral-400">
          <WarningCircle className="h-8 w-8 text-amber-500/80" />
          <div className="text-xs">
            <p className="font-medium text-neutral-300">
              Failed to load Page {page.pageNumber || pageIndex + 1}
            </p>
            <p className="text-neutral-500">Tap below to retry</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-neutral-700 bg-neutral-800 text-xs text-neutral-200 hover:bg-neutral-700"
            onClick={handleRetry}
          >
            <ArrowClockwise className="mr-1.5 h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Main Image: src is GATED until authorized by sequential dispatcher */}
      {isAuthorized && (
        <img
          key={`${page.imageUrl}-${retryKey}`}
          src={page.imageUrl}
          alt={`Page ${page.pageNumber || pageIndex + 1}`}
          width={imageWidth}
          height={imageHeight}
          decoding="async"
          loading={pageIndex <= 1 ? "eager" : "lazy"}
          fetchPriority={priorityImmediate ? "high" : "auto"}
          className={`block h-auto w-full object-contain transition-opacity duration-300 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          onLoad={(e) => {
            const img = e.currentTarget
            if (img.naturalWidth && img.naturalHeight) {
              setNaturalRatio(`${img.naturalWidth} / ${img.naturalHeight}`)
            }
            setInternalLoaded(true)
            setHasError(false)
          }}
          onError={() => {
            setHasError(true)
          }}
        />
      )}

      {/* Subtle Floating Page Number Label (Bottom Right) */}
      <span className="pointer-events-none absolute right-2 bottom-2 rounded border border-neutral-800/80 bg-neutral-950/80 px-2 py-0.5 font-mono text-[10px] text-neutral-400 backdrop-blur">
        {page.pageNumber || pageIndex + 1}/{totalPages}
      </span>
    </div>
  )
}
