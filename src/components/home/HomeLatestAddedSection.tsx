import React, { useState, useEffect } from "react"
import { Clock, ArrowRight, BookOpen } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export function HomeLatestAddedSection() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [latestComics, setLatestComics] = useState<any[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    if (latestComics.length === 0) {
      setIsInitialLoading(true)
    } else {
      setIsFetching(true)
    }

    const typeQuery = selectedType !== "all" ? `&type=${selectedType}` : ""
    const endpoint = API_ROUTES.COMICS.BROWSE(
      `limit=12&sort=latest${typeQuery}`
    )

    apiFetch(endpoint)
      .then((data) => {
        if (isMounted) {
          setLatestComics(data.comics || [])
        }
      })
      .catch(() => {
        if (isMounted) setLatestComics([])
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
  }, [selectedType])

  const getTypeBadgeColor = (type?: string) => {
    const t = (type || "manga").toLowerCase()
    if (t === "manhwa")
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    if (t === "manhua")
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-col items-start justify-between space-y-3 pb-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <span>Baru Ditambahkan</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Update chapter dan komik rilis terbaru yang siap dibaca
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <Tabs
            value={selectedType}
            onValueChange={(val) => setSelectedType(val)}
            className="w-auto"
          >
            <TabsList className="grid h-9 grid-cols-4 rounded-lg bg-muted/60 p-1">
              <TabsTrigger
                value="all"
                className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="manga"
                className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Manga
              </TabsTrigger>
              <TabsTrigger
                value="manhwa"
                className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Manhwa
              </TabsTrigger>
              <TabsTrigger
                value="manhua"
                className="px-2.5 py-1 text-xs transition-all duration-200 ease-out data-[state=active]:scale-[1.02] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Manhua
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <a
            href="/browse?sort=latest"
            className="hidden shrink-0 items-center gap-1 text-xs font-medium text-primary transition-all hover:underline md:flex"
          >
            <span>Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardHeader>

      <CardContent>
        {isInitialLoading ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-2 rounded-xl border border-border/40 bg-card/50 p-2.5"
              >
                <div className="aspect-[3/4] animate-pulse overflow-hidden rounded-lg bg-muted" />
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
            {latestComics.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {latestComics.map((comic) => {
                  const latestCh = comic.latestChapter
                  const chNumber = latestCh
                    ? `Ch. ${parseFloat(latestCh.chapterNumber).toString()}`
                    : `Ch. ${comic.totalChapters || 1}`

                  return (
                    <a
                      key={comic.id || comic.slug}
                      href={`/komik/${comic.slug}`}
                      className="group flex flex-col rounded-xl border border-border/50 bg-card p-2 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-accent/40 hover:shadow-md"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                        <img
                          src={comic.coverUrl}
                          alt={comic.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={`px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-md ${getTypeBadgeColor(
                              comic.type
                            )}`}
                          >
                            {comic.type ? comic.type.toUpperCase() : "MANGA"}
                          </Badge>
                        </div>

                        <div className="absolute right-2 bottom-2">
                          <Badge className="border border-white/10 bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md hover:bg-black/90">
                            {chNumber}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between px-1 pt-2 pb-0.5">
                        <h3 className="line-clamp-1 text-xs leading-snug font-semibold transition-colors group-hover:text-primary">
                          {comic.title}
                        </h3>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="text-muted-foreground/80 capitalize">
                            {comic.status || "Ongoing"}
                          </span>
                          <span>
                            {(comic.totalViews || 0).toLocaleString("id-ID")}{" "}
                            views
                          </span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2 py-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  Belum ada komik baru ditambahkan untuk kategori ini.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
