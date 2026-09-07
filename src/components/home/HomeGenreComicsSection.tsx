import React, { useState, useEffect } from "react";
import { Cards, ArrowRight, Tag, Star, BookOpen } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMMON_GENRES, type GenreDefinition, API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomeGenreComicsSection() {
  const [activeGenreSlug, setActiveGenreSlug] = useState<string>(COMMON_GENRES[0]?.slug || "action");
  const [genreComics, setGenreComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeGenre = COMMON_GENRES.find((g) => g.slug === activeGenreSlug) || COMMON_GENRES[0];

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const endpoint = API_ROUTES.COMICS.BROWSE(`genre=${activeGenreSlug}&limit=12`);

    apiFetch(endpoint)
      .then((data) => {
        if (isMounted) {
          setGenreComics(data.comics || []);
        }
      })
      .catch(() => {
        if (isMounted) setGenreComics([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeGenreSlug]);

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="pb-3 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Cards className="h-5 w-5" />
              </div>
              <span>Daftar Komik per Genre</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Jelajahi karya terbaik berdasarkan genre favorit pilihan Anda
            </p>
          </div>

          <a
            href={`/browse?genre=${activeGenreSlug}`}
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-all shrink-0"
          >
            <span>Lihat Genre {activeGenre?.name}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Scrollable Genre Pills from COMMON_GENRES */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
          {COMMON_GENRES.map((genre: GenreDefinition) => {
            const isActive = genre.slug === activeGenreSlug;
            return (
              <button
                key={genre.slug}
                onClick={() => setActiveGenreSlug(genre.slug)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/50 text-muted-foreground border-border/40 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Tag className="h-3 w-3" />
                <span>{genre.name}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
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
        ) : genreComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {genreComics.map((comic) => (
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
                  {comic.totalChapters > 0 && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/75 text-white backdrop-blur-md text-[10px] px-2 py-0.5 font-semibold border border-white/10">
                        {comic.totalChapters} Ch
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between pt-2 px-1 pb-0.5">
                  <h3 className="font-semibold text-xs leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                    {comic.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
                    <span className="capitalize text-muted-foreground/80">
                      {comic.type || "Manga"}
                    </span>
                    <span>
                      {(comic.totalViews || 0).toLocaleString("id-ID")} views
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 space-y-2">
            <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">
              Belum ada komik ditemukan untuk genre {activeGenre?.name}.
            </p>
            <a
              href={`/browse?genre=${activeGenreSlug}`}
              className="text-xs text-primary underline inline-block pt-1 font-medium"
            >
              Cari komik {activeGenre?.name} di Katalog Komik
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
