import React from "react"
import { BookBookmark, ArrowRight } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useListAllComics } from "@/hooks/use-list-all-comics"

export function ListAllComicTable() {
  const { comics, isLoading } = useListAllComics()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <BookBookmark className="h-5 w-5 text-primary" />
          <span>Indeks Komik Alfabetis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : comics.length > 0 ? (
          <div className="divide-y rounded-lg border bg-card/40">
            {comics.map((comic) => (
              <a
                key={comic.id || comic.slug}
                href={`/komik/${comic.slug}`}
                className="group flex items-center justify-between p-3.5 transition-colors hover:bg-accent"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={comic.coverUrl || comic.cover}
                      alt={comic.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-accent-foreground">
                      {comic.title}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
                      {Array.isArray(comic.genres) && comic.genres.length > 0
                        ? comic.genres.map((g: any) => g.name).join(", ")
                        : "Komik"}
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
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-foreground" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="space-y-2 py-12 text-center">
            <BookBookmark className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">
              Belum ada data komik di direktori ini.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
