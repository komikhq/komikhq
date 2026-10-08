import React, { useState } from "react"
import {
  ListNumbers,
  Plus,
  Trash,
  Image as ImageIcon,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminChapters, type ChapterItem } from "@/hooks/use-admin-chapters"
import { ChapterFormSheet } from "./ChapterFormSheet"
import { ChapterDeleteDialog } from "./ChapterDeleteDialog"

interface ChapterTableSectionProps {
  comicId: string
}

export function ChapterTableSection({ comicId }: ChapterTableSectionProps) {
  const { chapters, loading, submitting, createChapterBatch, deleteChapter } =
    useAdminChapters(comicId)
  const [formOpen, setFormOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingChapter, setDeletingChapter] = useState<ChapterItem | null>(
    null
  )

  const handleOpenDelete = (ch: ChapterItem) => {
    setDeletingChapter(ch)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingChapter) {
      await deleteChapter(deletingChapter.id)
      setDeleteOpen(false)
      setDeletingChapter(null)
    }
  }

  return (
    <Card className="w-full border-border/60 shadow-xs">
      <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <ListNumbers className="h-5 w-5 text-primary" />
            <span>Chapter Management</span>
          </CardTitle>
          <CardDescription className="text-xs">
            List of released chapters and their page counts.
          </CardDescription>
        </div>

        <Button
          size="sm"
          className="w-full gap-1.5 text-xs sm:w-auto"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Chapter</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/60 font-semibold text-muted-foreground">
              <tr>
                <th className="p-3">Chapter No.</th>
                <th className="p-3">Chapter Title</th>
                <th className="p-3">Total Pages</th>
                <th className="p-3">Access</th>
                <th className="p-3">Release Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-muted-foreground"
                  >
                    Loading released chapters...
                  </td>
                </tr>
              ) : chapters.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No chapters released for this comic yet.
                  </td>
                </tr>
              ) : (
                chapters.map((ch) => (
                  <tr
                    key={ch.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="p-3 font-bold text-foreground">
                      Chapter {ch.chapterNumber}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {ch.title || "-"}
                    </td>
                    <td className="p-3 font-medium">
                      <Badge variant="outline" className="gap-1 text-[10px]">
                        <ImageIcon className="h-3 w-3" />
                        <span>{ch.totalPages} Pages</span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {ch.accessTier || "Free"}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(ch.publishedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer text-destructive hover:bg-destructive/10"
                        title="Delete Chapter"
                        onClick={() => handleOpenDelete(ch)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <ChapterFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmitBatch={createChapterBatch}
        submitting={submitting}
      />

      <ChapterDeleteDialog
        chapter={deletingChapter}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
