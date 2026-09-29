import React, { useEffect, useRef, useState } from "react";
import { BookmarkSimple, BookOpen, User } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useComicDetail } from "@/hooks/use-comic-detail";

interface ComicHeaderCardProps {
  slug?: string;
}

function useClampedText<T extends HTMLElement>(text: string, expanded: boolean) {
  const elementRef = useRef<T>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (expanded) return;

    const element = elementRef.current;
    if (!element) return;

    const measure = () => {
      setIsClamped(element.scrollHeight > element.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text, expanded]);

  return { elementRef, isClamped };
}

export function ComicHeaderCard({ slug }: ComicHeaderCardProps) {
  const {
    comicData,
    isLoading,
    error,
    bookmarked,
    toggleBookmark,
    handleReadFirstChapter,
    handleNavigateCatalog,
  } = useComicDetail(slug);
  const comicTitle = comicData?.comic?.title ?? "";
  const comicSynopsis = comicData?.comic?.synopsis || "No synopsis available for this comic.";
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const synopsisContainerRef = useRef<HTMLDivElement>(null);
  const synopsisAnimationRef = useRef(false);
  const synopsisNextExpandedRef = useRef<boolean | null>(null);
  const { elementRef: titleRef, isClamped: isTitleClamped } = useClampedText<HTMLHeadingElement>(
    comicTitle,
    titleExpanded,
  );
  const { elementRef: synopsisRef, isClamped: isSynopsisClamped } = useClampedText<HTMLParagraphElement>(
    comicSynopsis,
    synopsisExpanded,
  );

  useEffect(() => setTitleExpanded(false), [comicTitle]);
  useEffect(() => {
    setSynopsisExpanded(false);
    synopsisAnimationRef.current = false;
    synopsisNextExpandedRef.current = null;
    if (synopsisContainerRef.current) {
      synopsisContainerRef.current.style.height = "auto";
    }
  }, [comicSynopsis]);

  const toggleSynopsis = () => {
    const container = synopsisContainerRef.current;
    const paragraph = synopsisRef.current;
    if (!container || !paragraph || synopsisAnimationRef.current) return;

    const nextExpanded = !synopsisExpanded;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSynopsisExpanded(nextExpanded);
      container.style.height = "auto";
      return;
    }

    synopsisAnimationRef.current = true;
    synopsisNextExpandedRef.current = nextExpanded;
    container.style.height = `${container.getBoundingClientRect().height}px`;
    void container.offsetHeight;
    if (nextExpanded) setSynopsisExpanded(true);

    requestAnimationFrame(() => {
      const collapsedLines = window.matchMedia("(min-width: 640px)").matches ? 4 : 5;
      const lineHeight = Number.parseFloat(window.getComputedStyle(paragraph).lineHeight);
      const targetHeight = nextExpanded
        ? paragraph.scrollHeight
        : Math.ceil(lineHeight * collapsedLines);
      container.style.height = `${targetHeight}px`;
    });
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
          <div className="aspect-[3/4] w-44 sm:w-48 bg-muted rounded-md shrink-0" />
          <div className="w-full flex-1 min-w-0 space-y-4 text-center sm:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                {["w-14", "w-16", "w-12", "w-16", "w-14", "w-12"].map((width, index) => (
                  <div key={index} className={`h-5 ${width} bg-muted rounded-full`} />
                ))}
              </div>
              <div className="min-h-[2.5em] sm:min-h-[1.25em] space-y-1">
                <div className="h-8 bg-muted rounded w-3/4 mx-auto sm:mx-0" />
                <div className="h-8 bg-muted rounded w-1/2 mx-auto sm:mx-0 sm:hidden" />
              </div>
              <div className="h-3 bg-muted rounded w-2/5 mx-auto sm:mx-0 mt-1.5" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-2/3 sm:hidden" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="h-10 w-full bg-muted rounded-md" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error || !comicData) {
    return (
      <Card className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-destructive">Comic Not Found</h2>
        <p className="text-sm text-muted-foreground">{error || "Comic data could not be retrieved."}</p>
        <Button variant="outline" size="sm" onClick={handleNavigateCatalog}>
          Back to Catalog
        </Button>
      </Card>
    );
  }

  const { comic, genres = [], creators = [], chapters = [] } = comicData;
  const firstChapter = chapters[0];
  const visibleGenres = genres.slice(0, 3);
  const remainingGenres = genres.slice(3);

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
          <div className="relative aspect-[3/4] w-44 sm:w-48 shrink-0 overflow-hidden rounded-md bg-muted border shadow-sm">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                <Badge variant="default" className="capitalize">
                  {comic.type || "Manga"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {comic.status || "Ongoing"}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {comic.accessTier || "Free"}
                </Badge>
                {visibleGenres.map((g: any) => (
                  <Badge key={g.id || g.slug} variant="outline">
                    {g.name}
                  </Badge>
                ))}
                {remainingGenres.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        aria-label={`Show ${remainingGenres.length} more genres`}
                      >
                        +{remainingGenres.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto max-w-72 flex-row flex-wrap gap-2">
                      {remainingGenres.map((g: any) => (
                        <Badge key={g.id || g.slug} variant="outline">
                          {g.name}
                        </Badge>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <h1
                ref={titleRef}
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight break-words min-h-[2.5em] sm:min-h-[1.25em] ${titleExpanded ? "" : "line-clamp-2"}`}
              >
                {comicTitle}
              </h1>
              {isTitleClamped && (
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  className="mt-1"
                  aria-expanded={titleExpanded}
                  onClick={() => setTitleExpanded((expanded) => !expanded)}
                >
                  {titleExpanded ? "Show less" : "Show full title"}
                </Button>
              )}
              {creators.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>By: {creators.map((c: any) => c.name).join(", ")}</span>
                </p>
              )}
            </div>

            <div
              ref={synopsisContainerRef}
              className="overflow-hidden transition-[height] duration-300 ease-in-out motion-reduce:transition-none"
              onTransitionEnd={(event) => {
                if (event.propertyName !== "height" || synopsisNextExpandedRef.current === null) return;

                if (!synopsisNextExpandedRef.current) setSynopsisExpanded(false);
                synopsisNextExpandedRef.current = null;
                synopsisAnimationRef.current = false;
                event.currentTarget.style.height = "auto";
              }}
            >
              <p
                ref={synopsisRef}
                className={`text-justify text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${synopsisExpanded ? "" : "line-clamp-5 sm:line-clamp-4"}`}
              >
                {comicSynopsis}
              </p>
            </div>
            {isSynopsisClamped && (
              <Button
                type="button"
                variant="link"
                size="xs"
                className="mt-1"
                aria-expanded={synopsisExpanded}
                onClick={toggleSynopsis}
              >
                {synopsisExpanded ? "Show less" : "Read more"}
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {firstChapter ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full" onClick={handleReadFirstChapter}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Chapter 1
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Start reading from the first chapter</TooltipContent>
                </Tooltip>
              ) : (
                <Button className="w-full" disabled variant="secondary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  No Chapters Yet
                </Button>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full"
                    variant={bookmarked ? "secondary" : "outline"}
                    onClick={toggleBookmark}
                  >
                    <BookmarkSimple
                      className="mr-2 h-4 w-4"
                      weight={bookmarked ? "fill" : "regular"}
                    />
                    {bookmarked ? "Saved" : "Add to Bookmarks"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {bookmarked ? "Remove from your reading list" : "Save to your favorites"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
