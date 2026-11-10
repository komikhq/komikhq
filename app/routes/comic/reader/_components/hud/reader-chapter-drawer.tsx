import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import {
  MagnifyingGlassIcon as MagnifyingGlass,
  CheckCircleIcon as CheckCircle,
  BookOpenIcon as BookOpen,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useReader } from "../../context/reader-context"

export function ReaderChapterDrawer() {
  const navigate = useNavigate()
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    allChapters,
    chapterSlug,
    comicSlug,
    comicTitle,
  } = useReader()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return allChapters
    const q = searchQuery.toLowerCase()
    return allChapters.filter((ch) => {
      const matchNum = ch.chapterNumber?.toLowerCase().includes(q)
      const matchTitle = ch.title?.toLowerCase().includes(q)
      const matchSlug = ch.slug?.toLowerCase().includes(q)
      return matchNum || matchTitle || matchSlug
    })
  }, [allChapters, searchQuery])

  const handleSelectChapter = (targetSlug: string) => {
    setIsDrawerOpen(false)
    if (targetSlug !== chapterSlug && comicSlug) {
      navigate(`/komik/${comicSlug}/${targetSlug}`)
    }
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-sm flex-col border-neutral-800 bg-neutral-900 p-0 text-neutral-100 sm:max-w-md"
      >
        <SheetHeader className="border-b border-neutral-800 p-4">
          <SheetTitle className="flex items-center gap-2 text-base font-bold text-white">
            <BookOpen className="h-5 w-5 text-primary" />
            Chapter List
          </SheetTitle>
          <SheetDescription className="line-clamp-1 text-xs text-neutral-400">
            {comicTitle} ({allChapters.length} chapters)
          </SheetDescription>

          {/* Quick Filter Search */}
          <div className="relative mt-2">
            <MagnifyingGlass className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 border-neutral-700 bg-neutral-950/80 pl-9 text-xs text-neutral-100 placeholder:text-neutral-500"
            />
          </div>
        </SheetHeader>

        {/* Chapters Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredChapters.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No chapters found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChapters.map((ch) => {
                const isCurrent = ch.slug === chapterSlug
                return (
                  <button
                    key={ch.id || ch.slug}
                    type="button"
                    onClick={() => handleSelectChapter(ch.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                      isCurrent
                        ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Chapter {ch.chapterNumber}</span>
                      {ch.title && (
                        <span className="line-clamp-1 text-neutral-400">
                          - {ch.title}
                        </span>
                      )}
                    </div>
                    {isCurrent && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/20 text-[10px] text-primary hover:bg-primary/20"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Reading
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

