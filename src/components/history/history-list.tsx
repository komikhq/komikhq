import React, { useState, useEffect } from "react"
import { Clock, BookOpen } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export function HistoryList() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    apiFetch(API_ROUTES.HISTORY.LIST)
      .then((data) => {
        if (isMounted) {
          setHistory(data.history || [])
        }
      })
      .catch(() => {
        if (isMounted) setHistory([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex animate-pulse items-center gap-3 p-3">
            <div className="h-20 w-16 shrink-0 rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          Belum ada riwayat bacaan. Chapter yang terakhir Anda baca akan tampil
          di sini.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {history.map((item) => (
        <a
          key={item.id || item.comic.id}
          href={`/komik/${item.comic.slug}`}
          className="group flex items-center gap-3 rounded-lg border bg-card p-2 transition-colors hover:bg-accent"
        >
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={item.comic.coverUrl}
              alt={item.comic.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-accent-foreground">
              {item.comic.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground/80">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Chapter {item.chapter?.chapterNumber || "Terakhir"}
              </span>
            </p>
            {item.lastReadPage && (
              <p className="mt-0.5 text-[11px] text-muted-foreground/70 transition-colors group-hover:text-accent-foreground/70">
                Halaman {item.lastReadPage} / {item.snapshotTotalPages || 1}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
