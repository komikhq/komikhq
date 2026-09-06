import React, { useState } from "react";
import { Plus, X, Check, CaretUpDown, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const [open, setOpen] = useState(false);

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));

  return (
    <div className="space-y-2.5">
      {/* Selected Genre Badges with Removable 'x' Button */}
      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 border rounded-xl bg-muted/20 items-center">
        {selectedGenres.length === 0 ? (
          <span className="text-xs text-muted-foreground italic px-1">
            Belum ada genre dipilih. Pilih genre via tombol di bawah.
          </span>
        ) : (
          selectedGenres.map((g) => (
            <Badge
              key={g.id}
              variant="secondary"
              className="text-xs py-1 px-2.5 bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 group transition-all"
            >
              <span>{g.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleGenre(g.id);
                }}
                className="rounded-full p-0.5 hover:bg-primary/20 text-primary/70 hover:text-primary transition-colors"
                title={`Hapus ${g.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Popover Combobox for Instant Genre Search & Quick Toggle +/- */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-xs h-9 font-normal border-border/60 bg-background"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MagnifyingGlass className="h-3.5 w-3.5" />
              <span>Pilih atau Cari Genre Komik ({selectedGenreIds.length} terpilih)...</span>
            </span>
            <CaretUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[380px] p-0 z-50" align="start">
          <Command>
            <CommandInput placeholder="Cari nama genre (misal: Action, Isekai)..." className="text-xs h-9" />
            <CommandList className="max-h-56 overflow-y-auto p-1">
              <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                Genre tidak ditemukan.
              </CommandEmpty>
              <CommandGroup heading="Daftar Genre Komik">
                {genres.map((g) => {
                  const isSelected = selectedGenreIds.includes(g.id);
                  return (
                    <CommandItem
                      key={g.id}
                      value={g.name}
                      onSelect={() => onToggleGenre(g.id)}
                      className="text-xs flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/30 bg-background"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className={isSelected ? "font-semibold text-foreground" : "text-muted-foreground"}>
                          {g.name}
                        </span>
                      </div>

                      <Badge
                        variant={isSelected ? "destructive" : "secondary"}
                        className="text-[10px] h-5 px-1.5 font-mono"
                      >
                        {isSelected ? "- Hapus" : "+ Tambah"}
                      </Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
