import React from "react"
import { Sparkle } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  COMMON_GENRES,
  TOP_GENRES_LIMIT,
  type GenreDefinition,
} from "@/constants"

export function HomeTopGenresCard() {
  const topGenres = COMMON_GENRES.slice(0, TOP_GENRES_LIMIT)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Sparkle className="h-5 w-5 text-primary" />
          <span>Top Genres</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {topGenres.map((genre: GenreDefinition) => (
            <a
              key={genre.slug}
              href={`/browse?genre=${genre.slug}`}
              className="flex items-center justify-center rounded-md border bg-card p-3 text-center text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {genre.name}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
