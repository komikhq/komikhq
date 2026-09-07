import React, { useState, useEffect } from "react";
import { TrendUp } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomeTrendingSection() {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [trendingComics, setTrendingComics] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (trendingComics.length === 0) {
      setIsInitialLoading(true);
    } else {
      setIsFetching(true);
    }

    apiFetch(API_ROUTES.COMICS.TRENDING(period, 20))
      .then((data) => {
        if (isMounted) {
          setTrendingComics(data.comics || []);
        }
      })
      .catch(() => {
        if (isMounted) setTrendingComics([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialLoading(false);
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [period]);

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <TrendUp className="h-5 w-5" />
          </div>
          <span>Trending Comics</span>
        </CardTitle>
        <Tabs
          value={period}
          onValueChange={(val) => setPeriod(val as "daily" | "weekly")}
        >
          <TabsList className="grid w-36 grid-cols-2 h-9 p-1 bg-muted/60 rounded-lg">
            <TabsTrigger
              value="daily"
              className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
            >
              Weekly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isInitialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2 border rounded-lg p-2 bg-card">
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted animate-pulse" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`transition-opacity duration-300 ease-in-out ${
              isFetching ? "opacity-40 animate-pulse pointer-events-none" : "opacity-100"
            }`}
          >
            {trendingComics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {trendingComics.slice(0, 20).map((comic) => (
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
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-accent-foreground transition-colors">
                      {comic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                      {(comic.totalViews || 0).toLocaleString("id-ID")} views
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Belum ada data komik trending.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
