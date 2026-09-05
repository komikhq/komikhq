import React, { useState, useEffect } from "react";
import { BookBookmark, ArrowRight } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function ListAllComicTable() {
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
          <BookBookmark className="h-5 w-5 text-primary" />
          <span>Indeks Komik Alfabetis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : comics.length > 0 ? (
          <div className="divide-y rounded-lg border bg-card/40">
            {comics.map((comic) => (
              <a
                key={comic.id || comic.slug}
                href={`/komik/${comic.slug}`}
                className="flex items-center justify-between p-3.5 hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-8 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img src={comic.coverUrl || comic.cover} alt={comic.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {comic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{comic.genre || "Manga"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {comic.status || "Ongoing"}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <BookBookmark className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm font-medium">Belum ada data komik di direktori ini.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
