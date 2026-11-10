import { Link } from "react-router"
import {
  BookBookmarkIcon as BookBookmark,
  ArrowRightIcon as ArrowRight,
  ArrowUpIcon as ArrowUp,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComicCoverImage } from "@/components/comic/comic-cover-image"
import type { ListAllComicItem } from "@/hooks/use-list-all-comics"

interface ListAllComicTableProps {
  groupedComics: Record<string, ListAllComicItem[]>
  activeLetter: string
  isLoading: boolean
}

export function ListAllComicTable({
  groupedComics,
  activeLetter,
  isLoading,
}: ListAllComicTableProps) {
  // Generate ordered list of keys: # first if exists, then sorted A-Z
  const sectionKeys = Object.keys(groupedComics).sort((a, b) => {
    if (a === "#") return -1
    if (b === "#") return 1
    return a.localeCompare(b)
  })

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="overflow-hidden border bg-card/40">
            <div className="flex items-center gap-3 border-b bg-muted/40 p-4">
              <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            </div>
            <CardContent className="divide-y p-0">
              {Array.from({ length: 5 }).map((_, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-3 p-3.5">
                  <div className="h-12 w-9 shrink-0 animate-pulse rounded bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Empty state
  if (sectionKeys.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent className="space-y-3">
          <BookBookmark className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-semibold">No Comics Indexed Yet</h3>
          <p className="text-xs text-muted-foreground">
            The comic catalog will be updated soon.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {sectionKeys.map((letter) => {
        const items = groupedComics[letter] || []
        const isCurrentActive = activeLetter === letter

        return (
          <section
            key={letter}
            id={`letter-${letter}`}
            className="scroll-mt-48 transition-all"
          >
            {/* Dictionary thumb index header with anchor label */}
            <div
              className={`sticky top-36 z-10 mb-3 flex items-center justify-between rounded-lg border px-4 py-2.5 shadow-sm backdrop-blur-md transition-colors ${
                isCurrentActive
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/70 bg-card/90"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Dictionary thumb tab badge */}
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-base font-extrabold text-primary-foreground shadow-sm">
                  {letter}
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-sm sm:text-base font-bold tracking-tight">
                    Letter {letter}
                  </h2>
                  <span className="text-xs font-medium text-muted-foreground">
                    ({items.length} {items.length === 1 ? "comic" : "comics"})
                  </span>
                </div>
              </div>

              {/* Back to top anchor link */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                title="Back to top"
              >
                <span>Top</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Comics list under this alphabetical letter section */}
            <div className="divide-y overflow-hidden rounded-lg border bg-card/40">
              {items.map((comic) => (
                <Link
                  key={comic.id || comic.slug}
                  to={`/komik/${comic.slug}`}
                  className="group flex items-center justify-between p-3.5 transition-colors hover:bg-accent/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded bg-muted shadow-xs">
                      <ComicCoverImage
                        src={comic.coverUrl || comic.cover}
                        alt={comic.title}
                        aspectRatio="3/4"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                        {comic.title}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
                        {Array.isArray(comic.genres) && comic.genres.length > 0
                          ? comic.genres.map((g) => g.name).join(", ")
                          : "Comic"}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center gap-3">
                    <Badge
                      variant="outline"
                      className="text-xs group-hover:border-accent-foreground/30"
                    >
                      {comic.status || "Ongoing"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
