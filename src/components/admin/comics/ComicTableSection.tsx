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

        {/* Full-width Comics Table */}
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/60 font-semibold text-muted-foreground">
              <tr>
                <th className="p-3">Cover</th>
                <th className="p-3">Comic Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Author</th>
                <th className="p-3">Genres</th>
                <th className="p-3">Chapters</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center text-muted-foreground"
                  >
                    Loading comics...
                  </td>
                </tr>
              ) : comics.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No comics found.
                  </td>
                </tr>
              ) : (
                comics.map((c) => (
                  <tr
                    key={c.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="w-12 p-2">
                      <img
                        src={c.coverUrl}
                        alt={c.title}
                        className="h-12 w-9 rounded border border-border/60 object-cover"
                      />
                    </td>
                    <td className="p-3">
                      <a
                        href={`/dashboard/comics/${c.id}`}
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {c.title}
                      </a>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {c.type || "Manga"}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {c.creators?.join(", ") || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.genres?.map((g) => (
                          <Badge
                            key={g.id}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {g.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{c.totalChapters} Ch.</td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-[10px] text-emerald-500"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            (window.location.href = `/dashboard/comics/${c.id}`)
                          }
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <PencilSimple className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => handleOpenDelete(c)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
