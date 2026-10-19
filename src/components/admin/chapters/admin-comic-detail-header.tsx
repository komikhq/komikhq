import React, { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, Eye } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminComicDetailHeaderProps {
  comicId: string
}

export function AdminComicDetailHeader({
  comicId,
}: AdminComicDetailHeaderProps) {
  const [comic, setComic] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDetail() {
      try {
        const apiUrl =
          (window as any).__PUBLIC_API_URL__ || "http://localhost:8787"
        const res = await fetch(`${apiUrl}/v1/admin/comics/${comicId}`, {
          credentials: "include",
        })
        const data: any = await res.json()
        if (res.ok && data.comic) {
          setComic(data)
        }
      } catch (err) {
        console.error("Failed to load comic details", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [comicId])

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-muted/20 p-4 text-xs text-muted-foreground">
        Loading comic info...
      </div>
    )
  }

  if (!comic || !comic.comic) {
    return (
      <div className="rounded-xl bg-destructive/10 p-4 text-xs text-destructive">
        Comic not found.{" "}
        <a href="/dashboard/comics" className="font-semibold underline">
          Back to catalog
        </a>
      </div>
    )
  }

  const item = comic.comic

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-xs md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => (window.location.href = "/dashboard/comics")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <img
          src={item.coverUrl}
          alt={item.title}
          className="h-20 w-14 shrink-0 rounded-lg border border-border/60 object-cover"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">{item.title}</h1>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-[10px] text-emerald-500"
            >
              {item.status}
            </Badge>
          </div>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {item.synopsis || "No synopsis available."}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>{item.totalChapters || 0} Total Chapters</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>{item.totalViews || 0} Total Views</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
