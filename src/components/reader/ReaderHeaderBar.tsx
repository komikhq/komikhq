import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReaderHeaderBarProps {
  comicSlug?: string;
  chapterSlug?: string;
  totalPages?: number;
}

export function ReaderHeaderBar({ comicSlug, chapterSlug, totalPages = 10 }: ReaderHeaderBarProps) {
  const comicTitle = comicSlug ? comicSlug.replace(/-/g, " ").toUpperCase() : "Comic Reader";
  const chapterNumber = chapterSlug ? chapterSlug.replace(/chapter-/i, "") : "1";

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-300" onClick={() => (window.location.href = `/komik/${comicSlug}`)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to comic detail</TooltipContent>
          </Tooltip>
          <div>
            <h2 className="text-sm font-bold line-clamp-1">{comicTitle}</h2>
            <p className="text-xs text-neutral-400">Chapter {chapterNumber}</p>
          </div>
        </div>

        <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs px-2.5 py-1">
          Page 1/{totalPages}
        </Badge>
      </header>
    </TooltipProvider>
  );
}
