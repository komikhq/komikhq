import React, { useState, useEffect } from "react";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMON_GENRES, type GenreDefinition } from "@/constants";

interface BrowseFilterBarProps {
  onFilterChange?: (filters: { search: string; genre: string; status: string; sort: string }) => void;
}

export function BrowseFilterBar({ onFilterChange }: BrowseFilterBarProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("q")) setSearch(params.get("q") || "");
    if (params.has("genre")) setSelectedGenre(params.get("genre") || "all");
    if (params.has("status")) setStatusFilter(params.get("status") || "all");
    if (params.has("sort")) setSortBy(params.get("sort") || "latest");
  }, []);

  const triggerChange = (updated: { search: string; genre: string; status: string; sort: string }) => {
    const params = new URLSearchParams();
    if (updated.search) params.set("q", updated.search);
    if (updated.genre && updated.genre !== "all") params.set("genre", updated.genre);
    if (updated.status && updated.status !== "all") params.set("status", updated.status);
    if (updated.sort && updated.sort !== "latest") params.set("sort", updated.sort);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);

    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

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
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                triggerChange({ search: val, genre: selectedGenre, status: statusFilter, sort: sortBy });
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={selectedGenre}
            onValueChange={(val) => {
              const newGenre = val || "all";
              setSelectedGenre(newGenre);
              triggerChange({ search, genre: newGenre, status: statusFilter, sort: sortBy });
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Semua Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Genre</SelectItem>
              {COMMON_GENRES.map((g: GenreDefinition) => (
                <SelectItem key={g.slug} value={g.slug}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              const newStatus = val || "all";
              setStatusFilter(newStatus);
              triggerChange({ search, genre: selectedGenre, status: newStatus, sort: sortBy });
            }}
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
            onValueChange={(val) => {
              const newSort = val || "latest";
              setSortBy(newSort);
              triggerChange({ search, genre: selectedGenre, status: newStatusSort(newSort), sort: newSort });
            }}
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

function newStatusSort(val: string) {
  return val;
}
