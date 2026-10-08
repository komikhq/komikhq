import React, { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Image as ImageIcon, Sparkle } from "@phosphor-icons/react"
import type { ChapterItem } from "@/hooks/use-admin-chapters"

interface ChapterEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapter: ChapterItem | null
  onUpdate: (
    chapterId: string,
    data: {
      chapterNumber?: string
      title?: string
      accessTier?: string
      isEarlyAccess?: boolean
    }
  ) => Promise<boolean>
  submitting: boolean
}

export function ChapterEditSheet({
  open,
  onOpenChange,
  chapter,
  onUpdate,
  submitting,
}: ChapterEditSheetProps) {
  const [chapterNumber, setChapterNumber] = useState("")
  const [title, setTitle] = useState("")
  const [accessTier, setAccessTier] = useState("free")
  const [isEarlyAccess, setIsEarlyAccess] = useState(false)

  useEffect(() => {
    if (chapter) {
      setChapterNumber(chapter.chapterNumber || "")
      setTitle(chapter.title || "")
      setAccessTier(chapter.accessTier || "free")
      setIsEarlyAccess(Boolean(chapter.isEarlyAccess))
    }
  }, [chapter, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chapter || !chapterNumber.trim()) return

    const ok = await onUpdate(chapter.id, {
      chapterNumber: chapterNumber.trim(),
      title: title.trim(),
      accessTier,
      isEarlyAccess,
    })

    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !submitting && onOpenChange(val)}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden p-0 sm:[&[data-slot=sheet-content]]:max-w-[560px]"
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 p-6 backdrop-blur">
          <SheetTitle className="text-lg font-bold">
            Edit Chapter {chapter?.chapterNumber}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Update chapter metadata, release accessibility tier, and titles
            without re-uploading pages.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {/* Chapter Read-only Stats */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Pages in Chapter
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1 text-xs font-semibold"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    <span>{chapter?.totalPages || 0} Pages</span>
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    /{chapter?.slug}
                  </span>
                </div>
              </div>

              {chapter?.publishedAt && (
                <div className="text-right">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    Published
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {new Date(chapter.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Chapter Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Chapter Number *</Label>
              <Input
                required
                disabled={submitting}
                type="number"
                step="0.1"
                placeholder="e.g. 1 or 1.5"
                className="h-9 text-xs"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Changing chapter number will update the chapter sequence and
                slug.
              </p>
            </div>

            {/* Chapter Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Chapter Title (Optional)
              </Label>
              <Input
                disabled={submitting}
                placeholder="e.g. The Awakening"
                className="h-9 text-xs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Access Tier */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Access Tier</Label>
              <Select
                value={accessTier}
                onValueChange={setAccessTier}
                disabled={submitting}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free (All Users)</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Early Access Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkle className="h-4 w-4 text-amber-500" />
                  <Label className="text-xs font-semibold">Early Access</Label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Lock this chapter behind early access privileges.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isEarlyAccess}
                disabled={submitting}
                onChange={(e) => setIsEarlyAccess(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
              />
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 z-10 mt-auto flex shrink-0 flex-row items-center justify-end gap-2 border-t border-border/60 bg-background/95 p-6 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !chapterNumber.trim()}
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
