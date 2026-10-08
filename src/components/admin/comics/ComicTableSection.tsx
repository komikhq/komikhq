import React, { useState } from "react"
import {
  BookOpen,
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  Eye,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminComics, type ComicAdminItem } from "@/hooks/use-admin-comics"
import { ComicFormSheet } from "./ComicFormSheet"
import { ComicDeleteDialog } from "./ComicDeleteDialog"

import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

export function ComicTableSection() {
  const {
    comics,
    loading,
    submitting,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    createComic,
    updateComic,
    deleteComic,
  } = useAdminComics()

  const [formOpen, setFormOpen] = useState(false)
  const [selectedComic, setSelectedComic] = useState<ComicAdminItem | null>(
    null
  )

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingComic, setDeletingComic] = useState<ComicAdminItem | null>(
    null
  )

  const handleOpenAdd = () => {
    console.log("[DEBUG Sheet] Opening Add Form Sheet")
    setSelectedComic(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (c: ComicAdminItem) => {
    console.log("[DEBUG Sheet] Opening Edit Form Sheet for comic:", c)
    setSelectedComic(c)
    setFormOpen(true)
  }

  const handleOpenDelete = (c: ComicAdminItem) => {
    setDeletingComic(c)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingComic) {
      await deleteComic(deletingComic.id)
      setDeleteOpen(false)
    }
  }

  const columns = React.useMemo<ColumnDef<ComicAdminItem>[]>(
    () => [
      {
        accessorKey: "coverUrl",
        header: "Cover",
        cell: ({ row }) => (
          <div className="w-12">
            <img
              src={row.original.coverUrl}
              alt={row.original.title}
              className="h-12 w-9 rounded border border-border/60 object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Comic Title",
        cell: ({ row }) => (
          <a
            href={`/dashboard/comics/${row.original.id}`}
            className="font-semibold text-foreground transition-colors hover:text-primary"
          >
            {row.original.title}
          </a>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[10px] capitalize">
            {row.original.type || "Manga"}
          </Badge>
        ),
      },
      {
        accessorKey: "creators",
        header: "Author",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.creators?.join(", ") || "-"}
          </span>
        ),
      },
      {
        accessorKey: "genres",
        header: "Genres",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.genres?.map((g) => (
              <Badge key={g.id} variant="outline" className="text-[10px]">
                {g.name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "totalChapters",
        header: "Chapters",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.totalChapters} Ch.</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-[10px] text-emerald-500"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() =>
                (window.location.href = `/dashboard/comics/${row.original.id}`)
              }
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenEdit(row.original)}
            >
              <PencilSimple className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
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
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Comic Catalog</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Manage comic data, cover artwork, genres, authors, and publication
            status on KomikHQ.
          </CardDescription>
        </div>

        <Button
          size="sm"
          className="w-full gap-1.5 text-xs sm:w-auto"
          onClick={handleOpenAdd}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Comic</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlass className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comic title or author..."
              className="h-9 pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full text-xs sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="hiatus">Hiatus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={comics}
          loading={loading}
          loadingMessage="Loading comics..."
          emptyMessage="No comics found."
          enablePagination={false}
        />

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <ComicFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        comic={selectedComic}
        onSubmit={(fd: FormData) =>
          selectedComic ? updateComic(selectedComic.id, fd) : createComic(fd)
        }
        submitting={submitting}
      />

      <ComicDeleteDialog
        comic={deletingComic}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
