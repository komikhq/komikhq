import React, { useState, useEffect } from "react";
import { Clock, ArrowRight, BookOpen } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomeLatestAddedSection() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [latestComics, setLatestComics] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (latestComics.length === 0) {
      setIsInitialLoading(true);
    } else {
      setIsFetching(true);
    }

    const typeQuery = selectedType !== "all" ? `&type=${selectedType}` : "";
    const endpoint = API_ROUTES.COMICS.BROWSE(`limit=12&sort=latest${typeQuery}`);

    apiFetch(endpoint)
      .then((data) => {
        if (isMounted) {
          setLatestComics(data.comics || []);
        }
      })
      .catch(() => {
        if (isMounted) setLatestComics([]);
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
  }, [selectedType]);

  const getTypeBadgeColor = (type?: string) => {
    const t = (type || "manga").toLowerCase();
    if (t === "manhwa") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (t === "manhua") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <span>Baru Ditambahkan</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Update chapter dan komik rilis terbaru yang siap dibaca
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Tabs
            value={selectedType}
            onValueChange={(val) => setSelectedType(val)}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-4 h-9 p-1 bg-muted/60 rounded-lg">
              <TabsTrigger
                value="all"
                className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="manga"
                className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
              >
                Manga
              </TabsTrigger>
              <TabsTrigger
                value="manhwa"
                className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
              >
                Manhwa
              </TabsTrigger>
              <TabsTrigger
                value="manhua"
                className="text-xs px-2.5 py-1 transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]"
              >
                Manhua
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <a
            href="/browse?sort=latest"
            className="hidden md:flex items-center gap-1 text-xs text-primary font-medium hover:underline transition-all shrink-0"
          >
            <span>Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardHeader>

      <CardContent>
        {isInitialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-2 border border-border/40 rounded-xl p-2.5 bg-card/50"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted animate-pulse" />
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
            {latestComics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {latestComics.map((comic) => {
                  const latestCh = comic.latestChapter;
                  const chNumber = latestCh
                    ? `Ch. ${parseFloat(latestCh.chapterNumber).toString()}`
                    : `Ch. ${comic.totalChapters || 1}`;

                  return (
                    <a
                      key={comic.id || comic.slug}
                      href={`/komik/${comic.slug}`}
                      className="group flex flex-col border border-border/50 rounded-xl p-2 bg-card hover:bg-accent/40 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted relative">
                        <img
                          src={comic.coverUrl}
                          alt={comic.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0.5 font-semibold backdrop-blur-md ${getTypeBadgeColor(
                              comic.type
                            )}`}
                          >
                            {comic.type ? comic.type.toUpperCase() : "MANGA"}
                          </Badge>
                        </div>

                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-black/75 hover:bg-black/90 text-white backdrop-blur-md text-[10px] px-2 py-0.5 font-bold border border-white/10">
                            {chNumber}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 justify-between pt-2 px-1 pb-0.5">
                        <h3 className="font-semibold text-xs leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                          {comic.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
                          <span className="capitalize text-muted-foreground/80">
                            {comic.status || "Ongoing"}
                          </span>
                          <span>
                            {(comic.totalViews || 0).toLocaleString("id-ID")} views
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm font-medium text-muted-foreground">
                  Belum ada komik baru ditambahkan untuk kategori ini.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
