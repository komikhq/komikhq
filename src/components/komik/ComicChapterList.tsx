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
          <span>Chapters ({chapters.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="divide-y animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 px-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 shrink-0 rounded bg-muted" />
                  <div className="space-y-1">
                    <div className="h-4 w-36 max-w-full rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                </div>
                <div className="h-5 w-10 rounded-full bg-muted" />
              </div>
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
                  Read
                </Badge>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-1 text-muted-foreground">
            <p className="text-sm font-medium">No chapters have been uploaded yet.</p>
            <p className="text-xs">New chapters will appear here after an admin publishes them.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

