import { useState, useMemo } from "react"
import {
  TagIcon as Tag,
  PlusIcon as Plus,
  PencilSimpleIcon as PencilSimple,
  TrashIcon as Trash,
  MagnifyingGlassIcon as MagnifyingGlass,
  ArrowsClockwiseIcon as ArrowsClockwise,
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
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useAdminGenres, type GenreItem } from "@/hooks/use-admin-genres"
import { GenreEditSheet } from "./genre-edit-sheet"
import { GenreDeleteDialog } from "./genre-delete-dialog"

export function GenreTableSection() {
  const {
    genres,
    loading,
    isFetching,
    submitting,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
  } = useAdminGenres()

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("")

  // Quick Inline Add form state
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  // Sheet & Dialog state
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [editingGenre, setEditingGenre] = useState<GenreItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGenre, setDeletingGenre] = useState<GenreItem | null>(null)

  const filteredGenres = useMemo(() => {
    if (!searchQuery.trim()) return genres
    const q = searchQuery.toLowerCase().trim()
    return genres.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    )
  }, [genres, searchQuery])

  const handleInlineAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const ok = await createGenre({ name: newName, description: newDesc })
    if (ok) {
      setNewName("")
      setNewDesc("")
    }
  }

  const handleOpenEdit = (genre: GenreItem) => {
    setEditingGenre(genre)
    setEditSheetOpen(true)
  }

  const handleOpenDelete = (genre: GenreItem) => {
    setDeletingGenre(genre)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingGenre) {
      const ok = await deleteGenre(deletingGenre.id)
      if (ok) {
        setDeleteDialogOpen(false)
        setDeletingGenre(null)
      }
    }
  }

  const handleBulkAction = async (action: string, selectedRows: GenreItem[]) => {
    if (action === "delete") {
      const ok = window.confirm(
        `Are you sure you want to permanently delete ${selectedRows.length} selected genre(s)?`
      )
      if (!ok) return
      for (const g of selectedRows) {
        await deleteGenre(g.id)
      }
    }
  }

  const columns = useMemo<ColumnDef<GenreItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Genre Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="font-mono text-[11px] text-muted-foreground bg-muted/30"
          >
            {row.original.slug}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-sm text-muted-foreground">
            {row.original.description || "-"}
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
              onClick={() => handleOpenEdit(row.original)}
              title="Edit Genre (Drawer)"
            >
              <PencilSimple className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer text-destructive hover:bg-destructive/10"
              onClick={() => handleOpenDelete(row.original)}
              title="Delete Genre"
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
    <>
      <Card className="w-full border-border/60 shadow-xs">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Tag className="h-5 w-5 text-primary" />
              <span>Genre Management</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Manage comic categories and taxonomy directly across KomikHQ.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchGenres(false)}
            disabled={loading || isFetching}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <ArrowsClockwise
              className={`h-3.5 w-3.5 ${isFetching || loading ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Inline Add Genre Bar */}
          <form
            onSubmit={handleInlineAdd}
            className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 shadow-2xs sm:flex-row"
          >
            <div className="w-full flex-1">
              <Input
                placeholder="New Genre Name (e.g. Action, Isekai)"
                className="h-9 bg-background text-xs"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="w-full flex-[1.5]">
              <Input
                placeholder="Brief Genre Description (optional)"
                className="h-9 bg-background text-xs"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !newName.trim()}
              className="h-9 w-full shrink-0 gap-1.5 text-xs sm:w-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{submitting ? "Adding..." : "Add Genre"}</span>
            </Button>
          </form>

          {/* Quick Search Bar */}
          <div className="relative w-full max-w-sm">
            <MagnifyingGlass className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search genre by name, slug, or description..."
              className="h-9 pl-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stable Height DataTable */}
          <DataTable
            columns={columns}
            data={filteredGenres}
            loading={loading}
            loadingMessage="Loading genres taxonomy..."
            emptyMessage="No genres found matching your search."
            pageSize={10}
            pageSizeOptions={[10, 20, 50, 100]}
            rowHeight={52}
            fixedHeight={true}
            showGhostRows={true}
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
      </Card>

      {/* Edit Drawer Sheet */}
      <GenreEditSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        genre={editingGenre}
        onSubmit={updateGenre}
        submitting={submitting}
      />

      {/* Delete Confirmation Alert Dialog */}
      <GenreDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        genre={deletingGenre}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />
    </>
  )
}
