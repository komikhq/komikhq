import React, { useState } from "react"
import {
  X,
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { GenreItem } from "@/hooks/use-admin-genres"

interface GenreComboboxPickerProps {
  genres: GenreItem[]
  selectedGenreIds: string[]
  onToggleGenre: (id: string) => void
}

export function GenreComboboxPicker({
  genres,
  selectedGenreIds,
  onToggleGenre,
}: GenreComboboxPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id))

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <div className="space-y-2.5">
      {/* Selected Genre Badges with Dual Mode (Horizontal Scroll vs Multi-Row Grid) */}
      <div className="group/badge-container relative">
        <div
          className={`items-center gap-1.5 rounded-xl border bg-muted/20 p-2 pr-9 transition-all ${
            isExpanded
              ? "flex max-h-48 flex-wrap overflow-y-auto"
              : "flex scrollbar-none flex-nowrap overflow-x-auto"
          } min-h-[36px]`}
        >
          {selectedGenres.length === 0 ? (
            <span className="px-1 text-xs text-muted-foreground italic">
              No genres selected yet. Click the selector below.
            </span>
          ) : (
            selectedGenres.map((g) => (
              <Badge
                key={g.id}
                variant="default"
                className="flex shrink-0 items-center gap-1.5 border border-primary/20 bg-primary px-2.5 py-1 text-xs text-primary-foreground shadow-2xs"
              >
                <span>{g.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleGenre(g.id)
                  }}
                  className="cursor-pointer rounded-full p-0.5 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  title={`Remove ${g.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>

        {/* Chevron Button to Toggle between Horizontal Scroll and Multi-Row Expand */}
        {selectedGenres.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="absolute top-2 right-2 z-10 cursor-pointer rounded-md border border-border/60 bg-background/80 p-1 text-muted-foreground shadow-2xs transition-colors hover:bg-accent hover:text-foreground"
            title={
              isExpanded
                ? "Collapse to single row (Horizontal Scroll)"
                : "Expand all rows (Multi-Row Grid)"
            }
          >
            {isExpanded ? (
              <CaretUp className="h-3.5 w-3.5" />
            ) : (
              <CaretDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Popover Dropdown Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-between border-input bg-transparent text-left text-xs font-normal hover:bg-accent hover:text-accent-foreground"
          >
            <span className="truncate">
              {selectedGenreIds.length > 0
                ? `${selectedGenreIds.length} Genres Selected`
                : "Select / Search Comic Genres..."}
            </span>
            <CaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          collisionPadding={12}
          className="z-[100] max-h-[min(28rem,var(--radix-popover-content-available-height))] min-h-0 w-[--radix-popover-trigger-width] gap-2 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-md"
          align="start"
        >
          <div className="relative shrink-0">
            <MagnifyingGlass className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search genre..."
              className="h-8 pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[min(18rem,calc(100dvh-10rem))] min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pr-1 text-xs">
            {filteredGenres.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground italic">
                No genres found.
              </div>
            ) : (
              filteredGenres.map((g) => {
                const isSelected = selectedGenreIds.includes(g.id)
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onToggleGenre(g.id)
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <span>{g.name}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
