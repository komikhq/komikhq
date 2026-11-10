import { useState, useEffect, useRef } from "react"
import { Link } from "react-router"
import {
  ClockIcon as Clock,
  ArrowRightIcon as ArrowRight,
  BookOpenIcon as BookOpen,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComicCard } from "@/components/comic/comic-card"
import { comicsApi } from "@/lib/sdk-client"

interface HomeLatestAddedSectionProps {
  initialComics?: any[]
}

export function HomeLatestAddedSection({ initialComics }: HomeLatestAddedSectionProps) {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [latestComics, setLatestComics] = useState<any[]>(initialComics || [])
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!initialComics?.length)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (initialComics && initialComics.length > 0 && selectedType === "all") {
        return
      }
    }

    let isMounted = true
    if (latestComics.length === 0) {
      setIsInitialLoading(true)
    } else {
      setIsFetching(true)
    }

    const typeParam = selectedType !== "all" ? selectedType : undefined

    comicsApi
      .browseComics({ limit: "12", sort: "latest", type: typeParam })
      .then((data: any) => {
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

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-col items-start justify-between space-y-3 pb-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <span>Recently Added</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest chapter updates and newly released comics ready to read
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
                All
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

          <Link
            to="/browse?sort=latest"
            className="hidden shrink-0 items-center gap-1 text-xs font-medium text-primary transition-all hover:underline md:flex"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {isInitialLoading ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
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
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
                {latestComics.map((comic) => (
                  <ComicCard
                    key={comic.id || comic.slug}
                    comic={comic}
                    variant="badge"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 py-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  No new comics have been added for this category yet.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
