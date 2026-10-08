import React, { useEffect, useRef, useState } from "react"
import { BookmarkSimple, BookOpen, User } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useComicDetail } from "@/hooks/use-comic-detail"

interface ComicHeaderCardProps {
  slug?: string
}

function useClampedText<T extends HTMLElement>(
  text: string,
  expanded: boolean
) {
  const elementRef = useRef<T>(null)
  const [isClamped, setIsClamped] = useState(false)

  useEffect(() => {
    if (expanded) return

    const element = elementRef.current
    if (!element) return

    const measure = () => {
      setIsClamped(element.scrollHeight > element.clientHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [text, expanded])

  return { elementRef, isClamped }
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
  } = useComicDetail(slug)
  const comicTitle = comicData?.comic?.title ?? ""
  const comicSynopsis =
    comicData?.comic?.synopsis || "No synopsis available for this comic."
  const [titleExpanded, setTitleExpanded] = useState(false)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)
  const synopsisContainerRef = useRef<HTMLDivElement>(null)
  const synopsisAnimationRef = useRef(false)
  const synopsisNextExpandedRef = useRef<boolean | null>(null)
  const { elementRef: titleRef, isClamped: isTitleClamped } =
    useClampedText<HTMLHeadingElement>(comicTitle, titleExpanded)
  const { elementRef: synopsisRef, isClamped: isSynopsisClamped } =
    useClampedText<HTMLParagraphElement>(comicSynopsis, synopsisExpanded)

  useEffect(() => setTitleExpanded(false), [comicTitle])
  useEffect(() => {
    setSynopsisExpanded(false)
    synopsisAnimationRef.current = false
    synopsisNextExpandedRef.current = null
    if (synopsisContainerRef.current) {
      synopsisContainerRef.current.style.height = "auto"
    }
  }, [comicSynopsis])

  const toggleSynopsis = () => {
    const container = synopsisContainerRef.current
    const paragraph = synopsisRef.current
    if (!container || !paragraph || synopsisAnimationRef.current) return

    const nextExpanded = !synopsisExpanded
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSynopsisExpanded(nextExpanded)
      container.style.height = "auto"
      return
    }

    let collapsedHeight = 0
    if (!nextExpanded) {
      paragraph.classList.add("line-clamp-5", "sm:line-clamp-4")
      collapsedHeight = paragraph.getBoundingClientRect().height
      paragraph.classList.remove("line-clamp-5", "sm:line-clamp-4")
    }

    synopsisAnimationRef.current = true
    synopsisNextExpandedRef.current = nextExpanded
    container.style.height = `${container.getBoundingClientRect().height}px`
    void container.offsetHeight
    if (nextExpanded) setSynopsisExpanded(true)

    requestAnimationFrame(() => {
      const targetHeight = nextExpanded
        ? paragraph.scrollHeight
        : collapsedHeight
      container.style.height = `${targetHeight}px`
    })
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse overflow-hidden">
        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
          <div className="aspect-[3/4] w-44 shrink-0 rounded-md bg-muted sm:w-48" />
          <div className="w-full min-w-0 flex-1 space-y-4 text-center sm:text-left">
            <div>
              <div className="mb-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {["w-14", "w-16", "w-12", "w-16", "w-14", "w-12"].map(
                  (width, index) => (
                    <div
                      key={index}
                      className={`h-5 ${width} rounded-full bg-muted`}
                    />
                  )
                )}
              </div>
              <div className="min-h-[2.5em] space-y-1 sm:min-h-[1.25em]">
                <div className="mx-auto h-8 w-3/4 rounded bg-muted sm:mx-0" />
                <div className="mx-auto h-8 w-1/2 rounded bg-muted sm:mx-0 sm:hidden" />
              </div>
              <div className="mx-auto mt-1.5 h-3 w-2/5 rounded bg-muted sm:mx-0" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted sm:hidden" />
            </div>
            <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
              <div className="h-10 w-full rounded-md bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (error || !comicData) {
    return (
      <Card className="space-y-3 p-8 text-center">
        <h2 className="text-lg font-bold text-destructive">Comic Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || "Comic data could not be retrieved."}
        </p>
        <Button variant="outline" size="sm" onClick={handleNavigateCatalog}>
          Back to Catalog
        </Button>
      </Card>
    )
  }

  const { comic, genres = [], creators = [], chapters = [] } = comicData
  const firstChapter = chapters[0]
  const visibleGenres = genres.slice(0, 3)
  const remainingGenres = genres.slice(3)

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
          <div className="relative aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm sm:w-48">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
            <div>
              <div className="mb-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
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
                    <PopoverContent
                      align="start"
                      className="w-auto max-w-72 flex-row flex-wrap gap-2"
                    >
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
                className={`min-h-[2.5em] text-2xl font-extrabold tracking-tight break-words sm:min-h-[1.25em] sm:text-3xl ${titleExpanded ? "" : "line-clamp-2"}`}
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
                <p className="mt-1.5 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground sm:justify-start">
                  <User className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>By: {creators.map((c: any) => c.name).join(", ")}</span>
                </p>
              )}
            </div>

            <div
              ref={synopsisContainerRef}
              className="overflow-hidden transition-[height] duration-300 ease-in-out motion-reduce:transition-none"
              onTransitionEnd={(event) => {
                if (
                  event.propertyName !== "height" ||
                  synopsisNextExpandedRef.current === null
                )
                  return

                if (!synopsisNextExpandedRef.current) setSynopsisExpanded(false)
                synopsisNextExpandedRef.current = null
                synopsisAnimationRef.current = false
                event.currentTarget.style.height = "auto"
              }}
            >
              <p
                ref={synopsisRef}
                className={`text-justify text-sm leading-relaxed whitespace-pre-line text-muted-foreground ${synopsisExpanded ? "" : "line-clamp-5 sm:line-clamp-4"}`}
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

            <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
              {firstChapter ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full" onClick={handleReadFirstChapter}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Chapter 1
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Start reading from the first chapter
                  </TooltipContent>
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
                  {bookmarked
                    ? "Remove from your reading list"
                    : "Save to your favorites"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
