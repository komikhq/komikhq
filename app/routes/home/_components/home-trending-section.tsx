import { useState, useEffect, useRef } from "react"
import { TrendUpIcon as TrendUp } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComicCard } from "@/components/comic/comic-card"
import { comicsApi } from "@/lib/sdk-client"

interface HomeTrendingSectionProps {
  initialComics?: any[]
}

export function HomeTrendingSection({ initialComics }: HomeTrendingSectionProps) {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily")
  const [trendingComics, setTrendingComics] = useState<any[]>(initialComics || [])
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!initialComics?.length)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (initialComics && initialComics.length > 0 && period === "daily") {
        return
      }
    }

    let isMounted = true
    if (trendingComics.length === 0) {
      setIsInitialLoading(true)
    } else {
      setIsFetching(true)
    }

    comicsApi
      .listTrendingComics({ period, limit: "20" })
      .then((data: any) => {
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
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
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
              <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                {trendingComics.slice(0, 20).map((comic) => (
                  <ComicCard
                    key={comic.id || comic.slug}
                    comic={comic}
                    variant="compact"
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No trending comics data available yet.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
