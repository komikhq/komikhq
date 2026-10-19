import React, { useState, useEffect } from "react"
import { Crown } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export function HomePopularSection() {
  const [popularComics, setPopularComics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    apiFetch(API_ROUTES.COMICS.TRENDING("popular", 20))
      .then((data) => {
        if (isMounted) {
          setPopularComics(data.comics || [])
        }
      })
      .catch(() => {
        if (isMounted) setPopularComics([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Crown className="h-5 w-5 text-primary" />
          <span>Popular Comics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
            {Array.from({ length: 10 }).map((_, i) => (
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
        ) : popularComics.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
            {popularComics.slice(0, 20).map((comic) => (
              <a
                key={comic.id}
                href={`/komik/${comic.slug}`}
                className="group flex flex-col space-y-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted">
                  <img
                    src={comic.coverUrl}
                    alt={comic.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-accent-foreground">
                  {comic.title}
                </h3>
                <p className="text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
                  {(comic.totalViews || 0).toLocaleString("id-ID")} views
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Belum ada data komik populer.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
