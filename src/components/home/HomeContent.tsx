import React, { useState } from "react";
import {
  TrendUp,
  Sparkle,
  Info,
  Tag,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME, SITE_DESCRIPTION, COMMON_GENRES, TOP_GENRES_LIMIT, type GenreDefinition } from "@/constants";

export function HomeContent() {
  const [period, setPeriod] = useState<"weekly" | "daily">("weekly");
  const topGenres = COMMON_GENRES.slice(0, TOP_GENRES_LIMIT);

  return (
    <div className="space-y-8 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      {/* SEO Card */}
      <Card className="bg-gradient-to-r from-card to-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <span>About {SITE_NAME}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {SITE_DESCRIPTION}
          </p>
        </CardContent>
      </Card>

      {/* Trending Comics Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendUp className="h-5 w-5 text-primary" />
            <span>Trending Comics</span>
          </CardTitle>
          <Tabs
            value={period}
            onValueChange={(val) => setPeriod(val as "weekly" | "daily")}
          >
            <TabsList className="grid w-36 grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4 text-center">
            Trending content ready to connect with Hono API bindings.
          </p>
        </CardContent>
      </Card>

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
                className="flex items-center justify-center p-3 border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-center font-medium text-sm"
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
