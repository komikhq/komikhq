import React, { useState, useEffect } from "react";
import { Clock, BookOpen } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function HistoryList() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiFetch(API_ROUTES.HISTORY.LIST)
      .then((data) => {
        if (isMounted) {
          setHistory(data.history || []);
        }
      })
      .catch(() => {
        if (isMounted) setHistory([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-3 animate-pulse flex gap-3 items-center">
            <div className="w-16 h-20 bg-muted rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">
          Belum ada riwayat bacaan. Chapter yang terakhir Anda baca akan tampil di sini.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {history.map((item) => (
        <a
          key={item.id || item.comic.id}
          href={`/komik/${item.comic.slug}`}
          className="group flex border rounded-lg p-2 bg-card hover:bg-accent transition-colors gap-3 items-center"
        >
          <div className="w-16 h-20 overflow-hidden rounded-md bg-muted shrink-0">
            <img
              src={item.comic.coverUrl}
              alt={item.comic.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary">
              {item.comic.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Chapter {item.chapter?.chapterNumber || "Terakhir"}
              </span>
            </p>
            {item.lastReadPage && (
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                Halaman {item.lastReadPage} / {item.snapshotTotalPages || 1}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

