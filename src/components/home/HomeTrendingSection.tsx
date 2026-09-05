import React, { useState, useEffect } from "react";
import { TrendUp } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomeTrendingSection() {
  const [period, setPeriod] = useState<"weekly" | "daily">("weekly");
  const [trendingComics, setTrendingComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiFetch(API_ROUTES.COMICS.TRENDING(period))
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2 border rounded-lg p-2 bg-card">
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted animate-pulse" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
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
  );
}
