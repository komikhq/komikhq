import React, { useState } from "react";
import {
  BookmarkSimple,
  BookOpen,
  FilmStrip,
  CheckCircle,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/format-date";

export function ComicDetailContent({ slug }: { slug?: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  // Fallback demo structure ready for Hono API binding
  const comic = {
    id: "demo-comic-1",
    title: slug ? slug.replace(/-/g, " ").toUpperCase() : "Comic Detail",
    slug: slug || "demo-comic",
    synopsis: "This is a detailed description of the comic. Discover epic battles, romance, and gripping plotlines.",
    coverUrl: "/favicon.svg",
    status: "Ongoing",
    genres: ["Action", "Fantasy", "Adventure"],
    animeTitle: undefined,
    chapters: [
      { id: "ch-1", chapterNumber: "1", title: "The Beginning", slug: "chapter-1", publishedAt: new Date().toISOString() },
      { id: "ch-2", chapterNumber: "2", title: "A New Power", slug: "chapter-2", publishedAt: new Date().toISOString() },
    ],
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="relative aspect-[3/4] w-48 mx-auto md:mx-0 overflow-hidden bg-muted flex-shrink-0">
              <img
                src={comic.coverUrl}
                alt={comic.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <Badge variant="default">{comic.status}</Badge>
                  {comic.genres.map((g) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {comic.title}
                </h1>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {comic.synopsis}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {comic.chapters.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button onClick={() => window.location.href = `/komik/${comic.slug}/${comic.chapters[0].slug}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read First Chapter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Start reading from chapter 1</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant={bookmarked ? "secondary" : "outline"}
                      onClick={() => setBookmarked(!bookmarked)}
                    >
                      <BookmarkSimple
                        className="mr-2 h-4 w-4"
                        weight={bookmarked ? "fill" : "regular"}
                      />
                      {bookmarked ? "Bookmarked" : "Add to Bookmarks"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {bookmarked ? "Remove from reading list" : "Save comic to your reading list"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>

        {/* Chapter List */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              <span>Chapter List ({comic.chapters.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {comic.chapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`/komik/${comic.slug}/${chapter.slug}`}
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
      </div>
    </TooltipProvider>
  );
}
