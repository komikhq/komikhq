import React, { useState, useEffect } from "react";
import { Crown, Eye, Star } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HomePopularSection() {
  const [popularComics, setPopularComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiFetch(API_ROUTES.COMICS.TRENDING("popular"))
      .then((data) => {
        if (isMounted) {
          setPopularComics(data.comics || []);
        }
      })
      .catch(() => {
        if (isMounted) setPopularComics([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="border border-neutral-800 bg-neutral-900/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-neutral-100">
          <Crown className="h-5 w-5 text-amber-400" />
          <span>Komik Populer Sepanjang Masa</span>
        </CardTitle>
        <span className="text-xs text-neutral-400 font-mono bg-neutral-800/80 px-2.5 py-1 rounded border border-neutral-700/50">
          All-Time Popular
        </span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2 border border-neutral-800 rounded-lg p-2 bg-neutral-900/60">
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-neutral-800 animate-pulse" />
                <div className="h-4 bg-neutral-800 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-neutral-800 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : popularComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {popularComics.map((comic, index) => (
              <a
                key={comic.id}
                href={`/komik/${comic.slug}`}
                className="group relative flex flex-col space-y-2 border border-neutral-800/80 rounded-lg p-2 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-amber-500/50 transition-all duration-200 overflow-hidden"
              >
                {/* Popular Crown Badge for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow backdrop-blur flex items-center gap-1">
                    <Star className="h-3 w-3 fill-black inline" />
                    Top #{index + 1}
                  </div>
                )}

                <div className="aspect-[3/4] overflow-hidden rounded-md bg-neutral-800 relative">
                  <img
                    src={comic.coverUrl}
                    alt={comic.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-sm line-clamp-1 text-neutral-200 group-hover:text-amber-400 transition-colors">
                  {comic.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Eye className="h-3 w-3 inline text-amber-400" />
                    {(comic.totalViews || 0).toLocaleString("id-ID")}
                  </span>
                  <span className="capitalize text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                    {comic.status || "ongoing"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 py-8 text-center">
            Belum ada data komik populer.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
