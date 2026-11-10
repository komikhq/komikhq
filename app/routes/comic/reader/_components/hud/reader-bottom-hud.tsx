import { useNavigate } from "react-router"
import {
  CaretLeftIcon as CaretLeft,
  CaretRightIcon as CaretRight,
  ArrowsOutSimpleIcon as ArrowsOutSimple,
  ArrowsInSimpleIcon as ArrowsInSimple,
  RowsIcon as Rows,
  BookOpenIcon as BookOpen,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useReader } from "../../context/reader-context"

export function ReaderBottomHud() {
  const navigate = useNavigate()
  const {
    comicSlug,
    navInfo,
    pages,
    activePageIndex,
    scrollToPage,
    isHudVisible,
    settings,
    updateSettings,
  } = useReader()

  const totalPages = pages.length
  const isWebtoon = settings.mode === "webtoon"

  const handleSliderChange = (vals: number[]) => {
    if (vals.length > 0) {
      const targetPage = vals[0] - 1
      scrollToPage(targetPage)
    }
  }

  const toggleReadingMode = () => {
    updateSettings({
      mode: isWebtoon ? "paged-ltr" : "webtoon",
    })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <TooltipProvider>
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800/80 bg-neutral-900/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 ${
          isHudVisible ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-2.5">
          {/* Top Row: Page Scrubber Slider & Counter */}
          {totalPages > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-primary">
                {activePageIndex + 1}
              </span>
              <Slider
                value={[activePageIndex + 1]}
                min={1}
                max={totalPages}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1 cursor-pointer"
              />
              <span className="font-mono text-xs text-neutral-400">
                {totalPages}
              </span>
            </div>
          )}

          {/* Bottom Row: Quick Navigation & Utility Toggles */}
          <div className="flex items-center justify-between gap-2">
            {/* Previous Chapter */}
            {navInfo.prevSlug ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-neutral-700 bg-neutral-800/80 text-xs text-neutral-200 hover:bg-neutral-700"
                onClick={() => navigate(`/komik/${comicSlug}/${navInfo.prevSlug}`)}
              >
                <CaretLeft className="mr-1 h-3.5 w-3.5" />
                Prev Ch.
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="h-8 border-neutral-800 bg-neutral-900/40 text-xs text-neutral-600"
              >
                <CaretLeft className="mr-1 h-3.5 w-3.5" />
                First Ch.
              </Button>
            )}

            {/* Middle Quick Toggles */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    onClick={toggleReadingMode}
                  >
                    {isWebtoon ? (
                      <Rows className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Switch to {isWebtoon ? "Paged Mode" : "Webtoon Mode"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    onClick={toggleFullscreen}
                  >
                    <ArrowsOutSimple className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Toggle Fullscreen</TooltipContent>
              </Tooltip>
            </div>

            {/* Next Chapter */}
            {navInfo.nextSlug ? (
              <Button
                size="sm"
                className="h-8 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(`/komik/${comicSlug}/${navInfo.nextSlug}`)}
              >
                Next Ch.
                <CaretRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                disabled
                className="h-8 border-neutral-800 bg-neutral-900/40 text-xs text-neutral-600"
              >
                Last Ch.
                <CaretRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

