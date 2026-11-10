import React, { useState, useEffect, useRef } from "react"
import { BookOpenIcon as BookOpen } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ComicCoverImageProps {
  src?: string | null
  alt: string
  className?: string
  priority?: boolean
  children?: React.ReactNode
}

export function ComicCoverImage({
  src,
  alt,
  className,
  priority = false,
  children,
}: ComicCoverImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(priority)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(!src)

  // IntersectionObserver: Only download the image asset when approaching the viewport
  // This prevents the browser from holding the initial page-loading spinner for 50+ images at once
  useEffect(() => {
    if (priority || isVisible) return

    const element = containerRef.current
    if (!element) return

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" } // Start preloading when within 300px of the viewport
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [priority, isVisible])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted select-none"
    >
      {/* Skeleton Shimmer Overlay: Covers the frame until the image has completely loaded */}
      {(!isLoaded || !isVisible) && !isError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center bg-muted/90 backdrop-blur-xs transition-opacity duration-300"
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-t from-muted-foreground/15 to-transparent" />
          <BookOpen className="absolute h-6 w-6 animate-pulse text-muted-foreground/30" />
        </div>
      )}

      {/* Fallback if the image URL is broken or unavailable */}
      {isError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted p-2 text-center text-muted-foreground">
          <BookOpen className="h-8 w-8 opacity-40" />
          <span className="text-[10px] font-medium opacity-60">No Cover</span>
        </div>
      ) : isVisible ? (
        <img
          src={src || undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
            className
          )}
        />
      ) : null}

      {/* Floating Badges (positioned absolutely over the cover) */}
      {children && <div className="pointer-events-none relative z-20">{children}</div>}
    </div>
  )
}
