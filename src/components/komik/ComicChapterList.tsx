import React, { useState, useEffect } from "react";
import { BookOpen, Clock } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

interface ComicChapterListProps {
  slug?: string;
}

export function ComicChapterList({ slug }: ComicChapterListProps) {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setIsLoading(true);

    apiFetch(API_ROUTES.COMICS.DETAIL(slug))
      .then((data) => {
        if (isMounted) {
          setChapters(data.chapters || []);
        }
      })
      .catch(() => {
        if (isMounted) setChapters([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>Daftar Chapter ({chapters.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : chapters.length > 0 ? (
          <div className="divide-y">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`/komik/${slug}/${chapter.slug}`}
                className="flex items-center justify-between py-3.5 px-2 transition-colors hover:bg-accent/50 font-semibold"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="text-sm">
                      Chapter {chapter.chapterNumber}
                      {chapter.title && ` - ${chapter.title}`}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-normal">
                      <Clock className="h-3 w-3" />
                      {formatDate(chapter.publishedAt || chapter.createdAt)}
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="text-xs">
                  Baca
                </Badge>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-1 text-muted-foreground">
            <p className="text-sm font-medium">Belum ada chapter yang diunggah.</p>
            <p className="text-xs">Chapter baru akan ditampilkan di sini setelah dirilis oleh admin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

