import { useState, useEffect } from "react";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export interface GenreOption {
  slug: string;
  name: string;
}

export function useBrowseFilters(
  onFilterChange?: (filters: { search: string; genre: string; status: string; sort: string }) => void
) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [genres, setGenres] = useState<GenreOption[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  // Fetch public genres from database
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGenres(true);

    apiFetch(API_ROUTES.GENRES)
      .then((data) => {
        if (isMounted && data.genres) {
          setGenres(data.genres);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar genre:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingGenres(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize query parameters from URL
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

  const handleSearchChange = (val: string) => {
    setSearch(val);
    triggerChange({ search: val, genre: selectedGenre, status: statusFilter, sort: sortBy });
  };

  const handleSelectGenreItem = (item: GenreOption | null) => {
    const newGenre = item?.slug || "all";
    setSelectedGenre(newGenre);
    triggerChange({ search, genre: newGenre, status: statusFilter, sort: sortBy });
  };

  const handleStatusChange = (val: string) => {
    const newStatus = val || "all";
    setStatusFilter(newStatus);
    triggerChange({ search, genre: selectedGenre, status: newStatus, sort: sortBy });
  };

  const handleSortChange = (val: string) => {
    const newSort = val || "latest";
    setSortBy(newSort);
    triggerChange({ search, genre: selectedGenre, status: statusFilter, sort: newSort });
  };

  const genreItems: GenreOption[] = [
    { slug: "all", name: "Semua Genre" },
    ...genres,
  ];

  const selectedGenreItem =
    genreItems.find((g) => g.slug === selectedGenre) || genreItems[0];

  return {
    search,
    selectedGenre,
    statusFilter,
    sortBy,
    genreItems,
    selectedGenreItem,
    isLoadingGenres,
    handleSearchChange,
    handleSelectGenreItem,
    handleStatusChange,
    handleSortChange,
  };
}
