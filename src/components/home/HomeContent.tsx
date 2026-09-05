import React, { useState, useEffect } from "react";
import {
  TrendUp,
  Sparkle,
  Info,
  Tag,
  Users,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME, SITE_DESCRIPTION, COMMON_GENRES, TOP_GENRES_LIMIT, type GenreDefinition } from "@/constants";
import { apiFetch } from "@/lib/api-client";
import { useRealtimeViewers } from "@/hooks/use-realtime-viewers";

export function HomeContent() {
  const [period, setPeriod] = useState<"weekly" | "daily">("weekly");
  const [trendingComics, setTrendingComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { onlineCount } = useRealtimeViewers();

  const topGenres = COMMON_GENRES.slice(0, TOP_GENRES_LIMIT);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiFetch(`/v1/comics/trending?period=${period}`)
      .then((data) => {
        if (isMounted) {
          setTrendingComics(data.comics || []);
        }
      })
      .catch(() => {
        if (isMounted) setTrendingComics([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [period]);

  return (
    <div className="space-y-8 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      {/* SEO Card & Live Readers */}
      <Card className="bg-gradient-to-r from-card to-muted/40">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <span>About {SITE_NAME}</span>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-800">
            <Users className="h-4 w-4 animate-pulse" />
            <span>{onlineCount} Pembaca Online</span>
          </div>
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-8 text-center animate-pulse">
              Memuat komik trending...
            </p>
          ) : trendingComics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {trendingComics.map((comic) => (
                <a
                  key={comic.id}
                  href={`/komik/${comic.slug}`}
                  className="group flex flex-col space-y-2 border rounded-lg p-2 bg-card hover:bg-accent transition-colors"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted">
                    <img
                      src={comic.coverUrl}
                      alt={comic.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary">
                    {comic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {comic.totalViews || 0} views
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Belum ada data komik trending.
            </p>
          )}
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
