import React, { useState } from "react";
import { BookOpen, Plus, MagnifyingGlass, PencilSimple, Trash, Eye } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminComics, type ComicAdminItem } from "@/hooks/use-admin-comics";
import { ComicFormDialog } from "./ComicFormDialog";
import { ComicDeleteDialog } from "./ComicDeleteDialog";

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
  } = useAdminComics();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState<ComicAdminItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingComic, setDeletingComic] = useState<ComicAdminItem | null>(null);

  const handleOpenAdd = () => {
    setSelectedComic(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (c: ComicAdminItem) => {
    setSelectedComic(c);
    setFormOpen(true);
  };

  const handleOpenDelete = (c: ComicAdminItem) => {
    setDeletingComic(c);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingComic) {
      await deleteComic(deletingComic.id);
      setDeleteOpen(false);
    }
  };

  return (
    <Card className="border-border/60 shadow-xs w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Katalog Komik</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola data komik, sampul cover, genre, penulis, dan status publikasi di KomikHQ.
          </CardDescription>
        </div>

        <Button size="sm" className="gap-1.5 text-xs w-full sm:w-auto" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4" />
          <span>Tambah Komik Baru</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul komik atau penulis..."
              className="pl-9 text-xs h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="hiatus">Hiatus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Full-width Comics Table */}
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th className="p-3">Cover</th>
                <th className="p-3">Judul Komik</th>
                <th className="p-3">Penulis</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Chapters</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">Memuat data komik...</td>
                </tr>
              ) : comics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">Tidak ada komik ditemukan.</td>
                </tr>
              ) : (
                comics.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-2 w-12">
                      <img src={c.coverUrl} alt={c.title} className="w-9 h-12 rounded object-cover border border-border/60" />
                    </td>
                    <td className="p-3">
                      <a href={`/dashboard/comics/${c.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                        {c.title}
                      </a>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.creators?.join(", ") || "-"}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.genres?.map((g) => (
                          <Badge key={g.id} variant="outline" className="text-[10px]">{g.name}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{c.totalChapters} Ch.</td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => (window.location.href = `/dashboard/comics/${c.id}`)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleOpenEdit(c)}>
                          <PencilSimple className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleOpenDelete(c)}>
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
            <span className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-xs h-8">
                Sebelumnya
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="text-xs h-8">
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <ComicFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        comic={selectedComic}
        onSubmit={(fd) => (selectedComic ? updateComic(selectedComic.id, fd) : createComic(fd))}
        submitting={submitting}
      />

      <ComicDeleteDialog
        comic={deletingComic}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
