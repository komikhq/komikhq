import React, { useState, useEffect, useRef } from "react"
import { BookOpen, Clock, MagnifyingGlass } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format-date"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

interface ComicChapterListProps {
  slug?: string
}

export function ComicChapterList({ slug }: ComicChapterListProps) {
  const [chapters, setChapters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const chapterListRef = useRef<HTMLDivElement>(null)

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredChapters = chapters.filter((chapter) =>
    `Chapter ${chapter.chapterNumber} ${chapter.title ?? ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  )
  useEffect(() => {
    chapterListRef.current?.scrollTo({ top: 0 })
  }, [normalizedSearch])

  useEffect(() => {
    if (!slug) return
    let isMounted = true
    setIsLoading(true)
    setSearchQuery("")

    apiFetch(API_ROUTES.COMICS.DETAIL(slug))
      .then((data) => {
        if (isMounted) {
          setChapters(data.chapters || [])
        }
      })
      .catch(() => {
        if (isMounted) setChapters([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold">
            Chapters ({chapters.length})
          </CardTitle>
          {!isLoading && chapters.length > 0 && (
            <div className="relative w-full sm:max-w-xs">
              <MagnifyingGlass className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search chapters..."
                aria-label="Search chapters by number or title"
                className="pl-9"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-3.5"
              >
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
          <>
            {normalizedSearch && (
              <p
                className="mb-2 text-xs text-muted-foreground"
                aria-live="polite"
              >
                Showing {filteredChapters.length} of {chapters.length} chapters
              </p>
            )}
            {filteredChapters.length > 0 ? (
              <>
                <div
                  ref={chapterListRef}
                  className={`rounded-md border ${filteredChapters.length > 25 ? "max-h-[60vh] overflow-y-auto overscroll-contain sm:max-h-96" : ""}`}
                  role="region"
                  aria-label="Chapter list"
                  tabIndex={filteredChapters.length > 25 ? 0 : undefined}
                >
                  <div className="divide-y">
                    {filteredChapters.map((chapter) => (
                      <a
                        key={chapter.id}
                        href={`/komik/${slug}/${chapter.slug}`}
                        className="flex items-center justify-between px-2 py-3.5 font-semibold transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 flex-shrink-0 text-primary" />
                          <div>
                            <h4 className="text-sm">
                              Chapter {chapter.chapterNumber}
                              {chapter.title && ` - ${chapter.title}`}
                            </h4>
                            <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(
                                chapter.publishedAt || chapter.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                          Read
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No chapters match your search.
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1 py-8 text-center text-muted-foreground">
            <p className="text-sm font-medium">
              No chapters have been uploaded yet.
            </p>
            <p className="text-xs">
              New chapters will appear here after an admin publishes them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
