import React from "react";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useBrowseFilters } from "@/hooks/use-browse-filters";

interface BrowseFilterBarProps {
  onFilterChange?: (filters: { search: string; genre: string; status: string; sort: string }) => void;
}

export function BrowseFilterBar({ onFilterChange }: BrowseFilterBarProps) {
  const {
    search,
    statusFilter,
    sortBy,
    genreItems,
    selectedGenreItem,
    handleSearchChange,
    handleSelectGenreItem,
    handleStatusChange,
    handleSortChange,
  } = useBrowseFilters(onFilterChange);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Funnel className="h-5 w-5 text-primary" />
          <span>Filter & Pencarian Komik</span>
        </CardTitle>
        <CardDescription>
          Cari dan saring judul manga, manhwa, dan manhua sesuai keinginan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul komik..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-52">
            <Combobox
              items={genreItems}
              value={selectedGenreItem}
              onValueChange={handleSelectGenreItem}
            >
              <ComboboxInput placeholder="Semua Genre" />
              <ComboboxContent>
                <ComboboxEmpty>Genre tidak ditemukan.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.slug} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <Select
            value={statusFilter}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
