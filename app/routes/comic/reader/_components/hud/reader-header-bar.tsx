import { useNavigate } from "react-router"
import {
  ArrowLeftIcon as ArrowLeft,
  ListBulletsIcon as ListBullets,
  GearSixIcon as GearSix,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useReader } from "../../context/reader-context"

export function ReaderHeaderBar() {
  const navigate = useNavigate()
  const {
    comicSlug,
    comicTitle,
    chapterTitle,
    pages,
    isHudVisible,
    setIsDrawerOpen,
    setIsSettingsOpen,
  } = useReader()

  return (
    <TooltipProvider>
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b border-neutral-800/80 bg-neutral-900/90 px-4 py-2.5 backdrop-blur-md transition-transform duration-300 ${
          isHudVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          {/* Left: Back & Titles */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  onClick={() => navigate(`/komik/${comicSlug}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Back to comic details</TooltipContent>
            </Tooltip>

            <div className="min-w-0">
              <h2 className="truncate text-xs sm:text-sm font-bold text-white">
                {comicTitle}
              </h2>
              <p className="truncate text-[11px] text-neutral-400">
                {chapterTitle}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Badge
              variant="outline"
              className="hidden border-neutral-700 bg-neutral-800/60 font-mono text-[10px] text-neutral-300 sm:inline-flex"
            >
              {pages.length} Pages
            </Badge>

            {/* Chapter Drawer Trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <ListBullets className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">All Chapters</TooltipContent>
            </Tooltip>

            {/* Settings Trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <GearSix className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Reader Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}

