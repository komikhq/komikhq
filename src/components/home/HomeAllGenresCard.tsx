import React from "react";
import { Tag } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMMON_GENRES, type GenreDefinition } from "@/constants";

export function HomeAllGenresCard() {
  return (
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
  );
}
