import React from "react";
import { Sparkle, Tag } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMMON_GENRES, TOP_GENRES_LIMIT, type GenreDefinition } from "@/constants";

export function HomePopularGenres() {
  const topGenres = COMMON_GENRES.slice(0, TOP_GENRES_LIMIT);

  return (
    <div className="space-y-8">
      {/* Top Genres Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkle className="h-5 w-5 text-primary" />
            <span>Top Genres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {topGenres.map((genre: GenreDefinition) => (
              <a
                key={genre.slug}
                href={`/browse?genre=${genre.slug}`}
                className="flex items-center justify-center p-3 border rounded-md bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-center font-medium text-sm"
              >
                {genre.name}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Genres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>All Genres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COMMON_GENRES.map((genre: GenreDefinition) => (
              <a key={genre.slug} href={`/browse?genre=${genre.slug}`}>
                <Badge variant="outline" className="py-1.5 px-3 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                  {genre.name}
                </Badge>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
