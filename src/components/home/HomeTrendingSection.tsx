import React, { useState, useEffect } from "react"
import { TrendUp } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export function HomeTrendingSection() {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily")
  const [trendingComics, setTrendingComics] = useState<any[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    if (trendingComics.length === 0) {
      setIsInitialLoading(true)
    } else {
      setIsFetching(true)
    }

    apiFetch(API_ROUTES.COMICS.TRENDING(period, 20))
      .then((data) => {
        if (isMounted) {
          setTrendingComics(data.comics || [])
        }
      })
      .catch(() => {
        if (isMounted) setTrendingComics([])
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialLoading(false)
          setIsFetching(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [period])

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <TrendUp className="h-5 w-5" />
          </div>
          <span>Trending Comics</span>
        </CardTitle>
        <Tabs
          value={period}
          onValueChange={(val) => setPeriod(val as "daily" | "weekly")}
        >
          <TabsList className="grid h-9 w-36 grid-cols-2 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="daily"
              className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Weekly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isInitialLoading ? (
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
        ) : (
          <div
            className={`transition-opacity duration-300 ease-in-out ${
              isFetching
                ? "pointer-events-none animate-pulse opacity-40"
                : "opacity-100"
            }`}
          >
            {trendingComics.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
                {trendingComics.slice(0, 20).map((comic) => (
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
                      {(comic.periodViews || 0).toLocaleString("id-ID")} views
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada data komik trending.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
