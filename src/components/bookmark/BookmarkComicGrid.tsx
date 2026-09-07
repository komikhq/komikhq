import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkSimple, Trash } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function BookmarkComicGrid() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchBookmarks = () => {
    setIsLoading(true);
    apiFetch(API_ROUTES.BOOKMARKS.LIST)
      .then((data) => setBookmarks(data.bookmarks || []))
      .catch(() => setBookmarks([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (e: React.MouseEvent, comicId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await apiFetch(API_ROUTES.BOOKMARKS.REMOVE(comicId), { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b.comic.id !== comicId));
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  const filteredBookmarks = bookmarks.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="reading">Membaca</TabsTrigger>
            <TabsTrigger value="plan_to_read">Rencana Baca</TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2 border rounded-lg p-2 bg-card animate-pulse">
              <div className="aspect-[3/4] rounded-md bg-muted" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card className="p-8 text-center">
          <BookmarkSimple className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            {filterStatus === "all"
              ? "Belum ada komik yang disimpan dalam bookmark."
              : `Tidak ada komik dengan status "${filterStatus}".`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBookmarks.map((item) => (
            <a
              key={item.id}
              href={`/komik/${item.comic.slug}`}
              className="group relative flex flex-col space-y-2 border rounded-lg p-2 bg-card hover:bg-accent transition-colors"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted relative">
                <img
                  src={item.comic.coverUrl}
                  alt={item.comic.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <button
                  onClick={(e) => handleRemove(e, item.comic.id)}
                  title="Hapus Bookmark"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary">
                {item.comic.title}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit font-medium capitalize">
                {item.status.replace(/_/g, " ")}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

