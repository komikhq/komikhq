import React from "react";
import { BookBookmark, ArrowRight } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListAllComics } from "@/hooks/use-list-all-comics";

export function ListAllComicTable() {
  const { comics, isLoading } = useListAllComics();

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
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-8 bg-muted rounded overflow-hidden shrink-0">
                    <img src={comic.coverUrl || comic.cover} alt={comic.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm group-hover:text-accent-foreground transition-colors truncate">
                      {comic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors truncate">
                      {Array.isArray(comic.genres) && comic.genres.length > 0
                        ? comic.genres.map((g: any) => g.name).join(", ")
                        : "Komik"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <Badge variant="outline" className="text-xs group-hover:border-accent-foreground/30">
                    {comic.status || "Ongoing"}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-transform group-hover:translate-x-1" />
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
