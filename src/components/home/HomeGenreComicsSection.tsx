import React, { useState, useEffect } from "react";
import { Tag, ArrowRight, BookOpen } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMMON_GENRES, type GenreDefinition, API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomeGenreComicsSection() {
  const [comicsByGenre, setComicsByGenre] = useState<Record<string, any[]>>({});
  const [allComics, setAllComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Fetch browse catalog to categorize comics by genre
    apiFetch(API_ROUTES.COMICS.BROWSE("limit=100"))
      .then((data) => {
        if (!isMounted) return;
        const comics: any[] = data.comics || [];
        setAllComics(comics);

        const map: Record<string, any[]> = {};
        COMMON_GENRES.forEach((g) => {
          map[g.slug] = [];
        });

        comics.forEach((comic) => {
          if (comic.genres && Array.isArray(comic.genres)) {
            comic.genres.forEach((cg: any) => {
              const slug = cg.slug || cg.name?.toLowerCase().replace(/\s+/g, "-");
              if (map[slug]) {
                if (!map[slug].some((c) => c.id === comic.id)) {
                  map[slug].push(comic);
                }
              }
            });
          }
        });

        setComicsByGenre(map);
      })
      .catch((err) => {
        console.error("[HomeGenreComicsSection] Failed to fetch comics:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter genres that have at least 1 comic, or fallback to first 6 COMMON_GENRES
  const activeGenres = COMMON_GENRES.filter(
    (g) => comicsByGenre[g.slug] && comicsByGenre[g.slug].length > 0
  );

  const displayGenres = activeGenres.length > 0 ? activeGenres : COMMON_GENRES.slice(0, 6);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="h-6 w-36 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2 border rounded-lg p-2 bg-card">
                    <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted animate-pulse" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {displayGenres.map((genre: GenreDefinition) => {
        const comicsList = comicsByGenre[genre.slug] || [];

        return (
          <Card key={genre.slug} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <span>Komik {genre.name}</span>
              </CardTitle>

              <a
                href={`/browse?genre=${genre.slug}`}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline transition-all"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </CardHeader>

            <CardContent>
              {comicsList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                  {comicsList.slice(0, 10).map((comic) => (
                    <a
                      key={comic.id || comic.slug}
                      href={`/komik/${comic.slug}`}
                      className="group flex flex-col space-y-2 border rounded-lg p-2 bg-card hover:bg-accent transition-colors"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted relative">
                        <img
                          src={comic.coverUrl}
                          alt={comic.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {comic.totalChapters > 0 && (
                          <Badge className="absolute bottom-1.5 right-1.5 bg-black/75 text-white backdrop-blur-md text-[10px] px-1.5 py-0.5 font-semibold border border-white/10">
                            {comic.totalChapters} Ch
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-accent-foreground transition-colors pt-1">
                        {comic.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                        <span className="capitalize">{comic.type || "Manga"}</span>
                        <span>{(comic.totalViews || 0).toLocaleString("id-ID")} views</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Belum ada komik untuk genre {genre.name}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
