import React, { useState } from "react"
import {
  ListNumbers,
  Plus,
  PencilSimple,
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
import { toast } from "sonner"
import { useAdminChapters, type ChapterItem } from "@/hooks/use-admin-chapters"
import { ChapterFormSheet } from "./ChapterFormSheet"
import { ChapterEditSheet } from "./ChapterEditSheet"
import { ChapterDeleteDialog } from "./ChapterDeleteDialog"

import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

interface ChapterTableSectionProps {
  comicId: string
}

export function ChapterTableSection({ comicId }: ChapterTableSectionProps) {
  const {
    chapters,
    loading,
    submitting,
    createChapterBatch,
    updateChapter,
    deleteChapter,
  } = useAdminChapters(comicId)
  const [formOpen, setFormOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<ChapterItem | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingChapter, setDeletingChapter] = useState<ChapterItem | null>(
    null
  )

  const handleOpenEdit = (ch: ChapterItem) => {
    setEditingChapter(ch)
    setEditOpen(true)
  }

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

  const handleBulkAction = async (action: string, selectedRows: ChapterItem[]) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected chapter(s)?`
      )
      if (!confirmDelete) return
      let count = 0
      for (const ch of selectedRows) {
        const ok = await deleteChapter(ch.id)
        if (ok) count++
      }
      toast.success(`${count} chapter(s) deleted successfully.`)
    }
  }

  const columns = React.useMemo<ColumnDef<ChapterItem>[]>(
    () => [
      {
        accessorKey: "chapterNumber",
        header: "Chapter No.",
        sortingFn: (rowA, rowB) => {
          const a = parseFloat(rowA.original.chapterNumber) || 0
          const b = parseFloat(rowB.original.chapterNumber) || 0
          return a - b
        },
        cell: ({ row }) => (
          <span className="font-bold text-foreground">
            Chapter {row.original.chapterNumber}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Chapter Title",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.title || "-"}
          </span>
        ),
      },
      {
        accessorKey: "totalPages",
        header: "Total Pages",
        cell: ({ row }) => (
          <Badge variant="outline" className="gap-1 text-[10px]">
            <ImageIcon className="h-3 w-3" />
            <span>{row.original.totalPages} Pages</span>
          </Badge>
        ),
      },
      {
        accessorKey: "accessTier",
        header: "Access",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[10px]">
            {row.original.accessTier || "Free"}
          </Badge>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: "Release Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Edit Chapter"
              onClick={() => handleOpenEdit(row.original)}
            >
              <PencilSimple className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer text-destructive hover:bg-destructive/10"
              title="Delete Chapter"
              onClick={() => handleOpenDelete(row.original)}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

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
        <DataTable
          columns={columns}
          data={chapters}
          loading={loading}
          loadingMessage="Loading released chapters..."
          emptyMessage="No chapters released for this comic yet."
          pageSize={10}
          pageSizeOptions={[10, 20, 50, 100]}
          enableRowSelection={true}
          enableRowNumbers={true}
          bulkActions={[
            {
              label: "Delete Selected",
              value: "delete",
              variant: "destructive",
            },
          ]}
          onBulkAction={handleBulkAction}
        />
      </CardContent>

      <ChapterFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmitBatch={createChapterBatch}
        submitting={submitting}
      />

      <ChapterEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        chapter={editingChapter}
        onUpdate={updateChapter}
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
