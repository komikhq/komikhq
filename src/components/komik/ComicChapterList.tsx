import React from "react";
import { BookOpen, Clock } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";

interface ComicChapterListProps {
  slug?: string;
}

export function ComicChapterList({ slug }: ComicChapterListProps) {
  const comicSlug = slug || "demo-comic";
  const chapters = [
    { id: "ch-1", chapterNumber: "1", title: "The Beginning", slug: "chapter-1", publishedAt: new Date().toISOString() },
    { id: "ch-2", chapterNumber: "2", title: "A New Power", slug: "chapter-2", publishedAt: new Date().toISOString() },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>Chapter List ({chapters.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`/komik/${comicSlug}/${chapter.slug}`}
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
                    {formatDate(chapter.publishedAt)}
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="text-xs">
                Unread
              </Badge>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
