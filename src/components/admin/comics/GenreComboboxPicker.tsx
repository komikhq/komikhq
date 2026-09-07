import React, { useState } from "react";
import { X, CaretDown, CaretUp, Check, MagnifyingGlass } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { GenreItem } from "@/hooks/use-admin-genres";

interface GenreComboboxPickerProps {
  genres: GenreItem[];
  selectedGenreIds: string[];
  onToggleGenre: (id: string) => void;
}

export function GenreComboboxPicker({
  genres,
  selectedGenreIds,
  onToggleGenre,
}: GenreComboboxPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-2.5">
      {/* Selected Genre Badges with Dual Mode (Horizontal Scroll vs Multi-Row Grid) */}
      <div className="relative group/badge-container">
        <div
          className={`p-2 pr-9 border rounded-xl bg-muted/20 items-center gap-1.5 transition-all ${
            isExpanded
              ? "flex flex-wrap max-h-48 overflow-y-auto"
              : "flex flex-nowrap overflow-x-auto scrollbar-none"
          } min-h-[36px]`}
        >
          {selectedGenres.length === 0 ? (
            <span className="text-xs text-muted-foreground italic px-1">
              Belum ada genre dipilih. Klik pemilih genre di bawah.
            </span>
          ) : (
            selectedGenres.map((g) => (
              <Badge
                key={g.id}
                variant="default"
                className="py-1 px-2.5 text-xs bg-primary text-primary-foreground border border-primary/20 flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <span>{g.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleGenre(g.id);
                  }}
                  className="rounded-full p-0.5 hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                  title={`Hapus ${g.name}`}
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
            className="absolute right-2 top-2 p-1 rounded-md bg-background/80 hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs z-10"
            title={isExpanded ? "Ringkaskan ke 1 baris (Horizontal Scroll)" : "Tampilkan semua baris baru (Multi-Row Grid)"}
          >
            {isExpanded ? <CaretUp className="h-3.5 w-3.5" /> : <CaretDown className="h-3.5 w-3.5" />}
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
            className="w-full justify-between h-9 text-xs font-normal border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-left"
          >
            <span className="truncate">
              {selectedGenreIds.length > 0
                ? `${selectedGenreIds.length} Genre Terpilih`
                : "Pilih / Cari Genre Komik..."}
            </span>
            <CaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-2 space-y-2 bg-popover border border-border shadow-md rounded-2xl z-[100]"
          align="start"
        >
          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama genre..."
              className="pl-8 text-xs h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {filteredGenres.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground text-xs italic">
                Genre tidak ditemukan.
              </div>
            ) : (
              filteredGenres.map((g) => {
                const isSelected = selectedGenreIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onToggleGenre(g.id);
                    }}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <span>{g.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

