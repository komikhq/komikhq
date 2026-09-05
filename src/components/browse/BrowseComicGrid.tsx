import React, { useState, useEffect } from "react";
import { BookOpen, Star } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function BrowseComicGrid() {
  const [comics, setComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = typeof window !== "undefined" ? window.location.search : "";
    const endpoint = API_ROUTES.COMICS.BROWSE(params.replace(/^\?/, ""));

    apiFetch(endpoint)
      .then((res) => {
        if (isMounted) {
          setComics(res.comics || res.data || []);
        }
      })
      .catch(() => {
        if (isMounted) setComics([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Katalog Komik</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-md" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : comics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {comics.map((comic) => (
              <a
                key={comic.id || comic.slug}
                href={`/komik/${comic.slug}`}
                className="group flex flex-col space-y-2 border rounded-lg p-2 bg-card hover:bg-accent transition-colors"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted relative">
                  <img
                    src={comic.coverUrl || comic.cover}
                    alt={comic.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {comic.rating && (
                    <Badge className="absolute top-2 right-2 bg-black/70 text-amber-400 gap-1 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{comic.rating}</span>
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary pt-1">
                  {comic.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{comic.type || "Manga"}</span>
                  <span>{comic.status || "Ongoing"}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <BookOpen className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm font-medium">Belum ada komik ditemukan.</p>
            <p className="text-xs text-muted-foreground">Coba ubah kata kunci pencarian atau filter genre Anda.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
