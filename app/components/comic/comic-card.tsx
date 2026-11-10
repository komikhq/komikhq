import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { ComicCoverImage } from "./comic-cover-image"
import { cn } from "@/lib/utils"

export interface ComicCardItem {
  id?: string
  slug: string
  title: string
  coverUrl?: string | null
  cover?: string | null
  type?: string | null
  status?: string | null
  latestChapter?: { chapterNumber: string } | null
  totalChapters?: number | null
  totalViews?: number | null
  periodViews?: number | null
  rating?: number | string | null
}

interface ComicCardProps {
  comic: ComicCardItem
  variant?: "compact" | "badge"
  priority?: boolean
  className?: string
  extraMeta?: React.ReactNode
}

export function getTypeBadgeColor(type?: string | null) {
  const t = (type || "manga").toLowerCase()
  if (t === "manhwa")
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  if (t === "manhua")
    return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  return "bg-blue-500/10 text-blue-500 border-blue-500/20"
}

export function ComicCard({
  comic,
  variant = "compact",
  priority = false,
  className,
  extraMeta,
}: ComicCardProps) {
  const coverUrl = comic.coverUrl || comic.cover
  const views = comic.periodViews ?? comic.totalViews ?? 0
  const formattedViews = views > 0 ? `${views.toLocaleString("en-US")} views` : null

  // Format chapter badge label if available
  let chapterLabel: string | null = null
  if (comic.latestChapter?.chapterNumber) {
    chapterLabel = `Ch. ${parseFloat(comic.latestChapter.chapterNumber).toString()}`
  } else if (comic.totalChapters && comic.totalChapters > 0) {
    chapterLabel = `${comic.totalChapters} Ch`
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/komik/${comic.slug}`}
        className={cn(
          "group flex flex-col space-y-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent",
          className
        )}
      >
        <ComicCoverImage
          src={coverUrl}
          alt={comic.title}
          priority={priority}
        >
          {chapterLabel && (
            <div className="absolute right-1.5 bottom-1.5">
              <Badge className="border border-white/10 bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                {chapterLabel}
              </Badge>
            </div>
          )}
        </ComicCoverImage>
        <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-accent-foreground">
          {comic.title}
        </h3>
        <p className="text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
          {extraMeta || formattedViews || comic.status || "Ongoing"}
        </p>
      </Link>
    )
  }

  // Variant "badge" (Latest added, Genre sections)
  return (
    <Link
      to={`/komik/${comic.slug}`}
      className={cn(
        "group flex flex-col rounded-xl border border-border/50 bg-card p-2 shadow-xs transition-all duration-200 hover:border-primary/30 hover:bg-accent/40 hover:shadow-md",
        className
      )}
    >
      <ComicCoverImage
        src={coverUrl}
        alt={comic.title}
        priority={priority}
      >
        {comic.type && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-md",
                getTypeBadgeColor(comic.type)
              )}
            >
              {comic.type.toUpperCase()}
            </Badge>
          </div>
        )}

        {chapterLabel && (
          <div className="absolute right-1.5 bottom-1.5">
            <Badge className="border border-white/10 bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {chapterLabel}
            </Badge>
          </div>
        )}
      </ComicCoverImage>

      <div className="flex flex-1 flex-col justify-between px-1 pt-2 pb-0.5">
        <h3 className="line-clamp-1 text-xs leading-snug font-semibold transition-colors group-hover:text-primary sm:text-sm">
          {comic.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="text-muted-foreground/80 capitalize">
            {comic.status || "Ongoing"}
          </span>
          {formattedViews && <span>{formattedViews}</span>}
        </div>
      </div>
    </Link>
  )
}
