import { useState, useEffect } from "react"
import { Link } from "react-router"
import {
  BookOpenIcon as BookOpen,
  StarIcon as Star,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComicCoverImage } from "@/components/comic/comic-cover-image"
import { genresApi, comicsApi } from "@/lib/sdk-client"
import { BROWSE_FILTERS_CHANGE_EVENT } from "@/hooks/use-browse-filters"

interface BrowseComicGridProps {
  initialComics?: any[]
}

export function BrowseComicGrid({ initialComics }: BrowseComicGridProps = {}) {
  const [comics, setComics] = useState<any[]>(initialComics || [])
  const [isLoading, setIsLoading] = useState<boolean>(!initialComics?.length)

  useEffect(() => {
    let isMounted = true
    let requestId = 0
    let reloadTimeout = 0
    let genreCache: Array<{ id: string; slug: string }> | null = null

    const loadComics = async (currentRequestId: number) => {
      try {
        const params = new URLSearchParams(window.location.search)
        const genre = params.get("genre")

        if (genre) {
          if (!genreCache) {
            const response = (await genresApi.listGenres()) as any
            genreCache = response.data || []
          }
          const matchedGenre = genreCache!.find(
            (item) => item.slug === genre || item.id === genre
          )
          if (matchedGenre) params.set("genre", matchedGenre.id)
        }

        const response = (await comicsApi.listComics({
          q: params.get("q") || params.get("search") || undefined,
          genre: params.get("genre") || undefined,
          status: (params.get("status") as any) || undefined,
          type: (params.get("type") as any) || undefined,
          sort: (params.get("sort") as any) || undefined,
          page: params.get("page") ? Number(params.get("page")) : undefined,
          limit: params.get("limit") ? Number(params.get("limit")) : undefined,
        })) as any
        if (isMounted && currentRequestId === requestId) {
          setComics(response.data?.items || response.comics || response.data || [])
        }
      } catch {
        if (isMounted && currentRequestId === requestId) setComics([])
      } finally {
        if (isMounted && currentRequestId === requestId) setIsLoading(false)
      }
    }

    const reloadComics = () => {
      requestId += 1
      const currentRequestId = requestId
      window.clearTimeout(reloadTimeout)
      reloadTimeout = window.setTimeout(
        () => void loadComics(currentRequestId),
        250
      )
    }

    // Skip client fetch on mount if SSR already provided initial comics and no filters are present
    const hasActiveFilters = Boolean(window.location.search)
    if (!initialComics?.length || hasActiveFilters) {
      void loadComics(++requestId)
    }

    window.addEventListener(BROWSE_FILTERS_CHANGE_EVENT, reloadComics)

    return () => {
      isMounted = false
      window.clearTimeout(reloadTimeout)
      window.removeEventListener(BROWSE_FILTERS_CHANGE_EVENT, reloadComics)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Comic Catalog</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-2 rounded-lg border bg-card p-2"
              >
                <div className="aspect-[3/4] animate-pulse overflow-hidden rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : comics.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
            {comics.map((comic) => (
              <Link
                key={comic.id || comic.slug}
                to={`/komik/${comic.slug}`}
                className="group flex flex-col space-y-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent"
              >
                <ComicCoverImage
                  src={comic.coverUrl || comic.cover}
                  alt={comic.title}
                >
                  {comic.rating && (
                    <div className="absolute top-2 right-2">
                      <Badge className="gap-1 bg-black/75 px-1.5 py-0.5 text-xs text-amber-400 backdrop-blur-md">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{comic.rating}</span>
                      </Badge>
                    </div>
                  )}
                </ComicCoverImage>
                <h3 className="line-clamp-1 pt-1 text-sm font-semibold transition-colors group-hover:text-accent-foreground">
                  {comic.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
                  <span className="capitalize">{comic.type || "Manga"}</span>
                  <span>{comic.status || "Ongoing"}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">No comics found.</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search keywords or genre filters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
