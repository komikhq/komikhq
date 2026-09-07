import React, { useState } from "react";
import { X, CaretDown, CaretUp } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
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

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));

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
              Belum ada genre dipilih. Pilih genre via combobox di bawah.
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

      {/* Default shadcn Combobox for Instant Genre Search & Quick Toggle */}
      <Combobox<GenreItem, true>
        multiple
        items={genres}
        value={selectedGenres}
        isItemEqualToValue={(a, b) => a?.id === b?.id}
        onValueChange={(val: GenreItem[]) => {
          const newIds = val.map((g) => g.id);
          // Find difference to notify parent via onToggleGenre or update selected genres
          const added = newIds.filter((id) => !selectedGenreIds.includes(id));
          const removed = selectedGenreIds.filter((id) => !newIds.includes(id));
          [...added, ...removed].forEach((id) => onToggleGenre(id));
        }}
        itemToStringLabel={(item: GenreItem) => item?.name || ""}
      >
        <ComboboxInput
          placeholder={`Pilih atau Cari Genre Komik (${selectedGenreIds.length} terpilih)...`}
          className="w-full text-xs h-9"
        />
        <ComboboxContent>
          <ComboboxEmpty>Genre tidak ditemukan.</ComboboxEmpty>
          <ComboboxList>
            {genres.map((g) => {
              const isSelected = selectedGenreIds.includes(g.id);
              return (
                <ComboboxItem
                  key={g.id}
                  value={g}
                  className="text-xs flex items-center justify-between py-1.5 px-2 cursor-pointer"
                >
                  <span className={isSelected ? "font-semibold text-primary" : "text-foreground"}>
                    {g.name}
                  </span>
                  {isSelected && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 font-mono">
                      Terpilih
                    </Badge>
                  )}
                </ComboboxItem>
              );
            })}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

