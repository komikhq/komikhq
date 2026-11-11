import { useState, useEffect } from "react"
import { TagIcon as Tag } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { GenreItem } from "@/hooks/use-admin-genres"

interface GenreEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  genre: GenreItem | null
  onSubmit: (id: string, data: { name: string; description?: string }) => Promise<boolean>
  submitting?: boolean
}

export function GenreEditSheet({
  open,
  onOpenChange,
  genre,
  onSubmit,
  submitting = false,
}: GenreEditSheetProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open && genre) {
      setName(genre.name)
      setDescription(genre.description || "")
    }
  }, [open, genre])

  if (!genre) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await onSubmit(genre.id, { name, description })
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full max-w-md flex-col overflow-y-auto p-6">
        <SheetHeader className="space-y-1 text-left">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <Tag className="h-5 w-5 text-primary" />
            <span>Edit Genre: {genre.name}</span>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Update category title, display properties, and description.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between space-y-4 pt-4">
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="genre-name" className="text-xs font-semibold">
                Genre Name
              </Label>
              <Input
                id="genre-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Action, Fantasy"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="genre-slug" className="text-xs font-semibold">
                Slug (Auto-generated)
              </Label>
              <Input
                id="genre-slug"
                value={genre.slug}
                disabled
                className="h-9 bg-muted font-mono text-xs text-muted-foreground"
              />
              <span className="text-[10px] text-muted-foreground">
                Slug cannot be changed directly to protect URL integrity.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="genre-desc" className="text-xs font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="genre-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief overview of this genre..."
                className="text-xs resize-none"
              />
            </div>
          </div>

          <SheetFooter className="mt-auto border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !name.trim()}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

