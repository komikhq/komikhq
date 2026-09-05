import React, { useState } from "react";
import { BookmarkSimple, BookOpen } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComicHeaderCardProps {
  slug?: string;
}

export function ComicHeaderCard({ slug }: ComicHeaderCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const comic = {
    title: slug ? slug.replace(/-/g, " ").toUpperCase() : "Comic Detail",
    slug: slug || "demo-comic",
    synopsis: "This is a detailed description of the comic. Discover epic battles, romance, and gripping plotlines.",
    coverUrl: "/favicon.svg",
    status: "Ongoing",
    genres: ["Action", "Fantasy", "Adventure"],
    firstChapterSlug: "chapter-1",
  };

  return (
    <TooltipProvider>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => (window.location.href = `/komik/${comic.slug}/${comic.firstChapterSlug}`)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read First Chapter
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Start reading from chapter 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
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
    </TooltipProvider>
  );
}
