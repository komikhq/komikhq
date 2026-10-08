import React, { useState, useEffect } from "react"
import { BookmarkSimple, Trash } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export function BookmarkComicGrid() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const fetchBookmarks = () => {
    setIsLoading(true)
    apiFetch(API_ROUTES.BOOKMARKS.LIST)
      .then((data) => setBookmarks(data.bookmarks || []))
      .catch(() => setBookmarks([]))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const handleRemove = async (e: React.MouseEvent, comicId: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await apiFetch(API_ROUTES.BOOKMARKS.REMOVE(comicId), { method: "DELETE" })
      setBookmarks((prev) => prev.filter((b) => b.comic.id !== comicId))
    } catch (err) {
      console.error("Failed to remove bookmark", err)
    }
  }

  const filteredBookmarks = bookmarks.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col space-y-2 rounded-lg border bg-card p-2"
            >
              <div className="aspect-[3/4] rounded-md bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card className="p-8 text-center">
          <BookmarkSimple className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {filterStatus === "all"
              ? "Belum ada komik yang disimpan dalam bookmark."
              : `Tidak ada komik dengan status "${filterStatus}".`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredBookmarks.map((item) => (
            <a
              key={item.id}
              href={`/komik/${item.comic.slug}`}
              className="group relative flex flex-col space-y-2 rounded-lg border bg-card p-2 transition-colors hover:bg-accent"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                <img
                  src={item.comic.coverUrl}
                  alt={item.comic.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <button
                  onClick={(e) => handleRemove(e, item.comic.id)}
                  title="Hapus Bookmark"
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-600"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
              <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-accent-foreground">
                {item.comic.title}
              </h3>
              <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary capitalize transition-colors group-hover:bg-accent-foreground/20 group-hover:text-accent-foreground">
                {item.status.replace(/_/g, " ")}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
