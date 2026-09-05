import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMON_GENRES, type GenreDefinition } from "@/constants";

export function BrowseContent() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  return (
    <div className="space-y-6 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse Comics</h1>
        <p className="text-sm text-muted-foreground">
          Search and filter your favorite manga, manhua, and manhwa titles.
        </p>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comic title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedGenre} onValueChange={(val) => setSelectedGenre(val || "all")}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {COMMON_GENRES.map((g: GenreDefinition) => (
                  <SelectItem key={g.slug} value={g.slug}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(val) => setSortBy(val || "latest")}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Filter controls active. Backend API connection ready for Hono Worker bindings.
        </p>
      </Card>
    </div>
  );
}
