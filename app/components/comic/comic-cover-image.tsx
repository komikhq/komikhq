import React, { useState } from "react"
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(!src)

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted select-none">
      {/* Skeleton overlay yang aktif 100% menutupi bingkai sampai gambar selesai dimuat */}
      {!isLoaded && !isError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 backdrop-blur-xs transition-opacity duration-300"
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-t from-muted-foreground/10 to-transparent" />
          <BookOpen className="absolute h-6 w-6 animate-pulse text-muted-foreground/30" />
        </div>
      )}

      {/* Fallback jika gambar error / tidak ditemukan */}
      {isError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted p-2 text-center text-muted-foreground">
          <BookOpen className="h-8 w-8 opacity-40" />
          <span className="text-[10px] font-medium opacity-60">No Cover</span>
        </div>
      ) : (
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
      )}

      {/* Floating Badges (posisi absolut di atas cover) */}
      {children && <div className="pointer-events-none relative z-20">{children}</div>}
    </div>
  )
}
