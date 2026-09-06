import React, { useState } from "react";
import { Plus, Tag, PencilSimple, Trash, Check, X, CaretDown, CaretUp, Info, FloppyDisk } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminGenres, type GenreItem } from "@/hooks/use-admin-genres";

export function GenreTableSection() {
  const { genres, loading, submitting, createGenre, updateGenre, deleteGenre } = useAdminGenres();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const ok = await createGenre(newName, newDesc);
    if (ok) {
      setNewName("");
      setNewDesc("");
    }
  };

  const toggleExpand = (g: GenreItem) => {
    if (expandedId === g.id) {
      setExpandedId(null);
    } else {
      setExpandedId(g.id);
      setEditName(g.name);
      setEditDesc(g.description || "");
      setConfirmDeleteId(null);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    const ok = await updateGenre(id, editName, editDesc);
    if (ok) {
      setExpandedId(null);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    const ok = await deleteGenre(id);
    if (ok) {
      setConfirmDeleteId(null);
      if (expandedId === id) setExpandedId(null);
    }
  };

  return (
    <Card className="border-border/60 shadow-xs w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>Manajemen Genre Komik</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola kategori & genre komik di platform KomikHQ secara langsung dengan cepat.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cloudflare-style Inline Add New Genre Bar */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-2.5 bg-muted/40 p-3.5 rounded-xl border border-border/60 shadow-2xs">
          <div className="flex-1 w-full space-y-1">
            <Input
              placeholder="Nama Genre Baru (misal: Action, Sci-Fi)"
              className="text-xs h-9 bg-background"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="flex-[1.5] w-full space-y-1">
            <Input
              placeholder="Deskripsi Ringkas Genre (opsional)"
              className="text-xs h-9 bg-background"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={submitting || !newName.trim()} className="gap-1.5 text-xs shrink-0 w-full sm:w-auto h-9">
            <Plus className="h-4 w-4" />
            <span>{submitting ? "Menambahkan..." : "Tambah Genre"}</span>
          </Button>
        </form>

        {/* Cloudflare DNS Style Expandable Accordion Table */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60 select-none">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">Nama Genre</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-right">Aksi & Quick Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Memuat daftar genre...</span>
                    </div>
                  </td>
                </tr>
              ) : genres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Belum ada genre terdaftar. Tambahkan genre pertama Anda di atas.
                  </td>
                </tr>
              ) : (
                genres.map((g, index) => {
                  const isExpanded = expandedId === g.id;
                  const isConfirmingDelete = confirmDeleteId === g.id;

                  return (
                    <React.Fragment key={g.id}>
                      {/* Main Summary Row */}
                      <tr
                        onClick={() => toggleExpand(g)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? "bg-muted/50 border-b-0" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="p-3 text-center text-muted-foreground font-mono text-[11px]">
                          {index + 1}
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{g.name}</span>
                            {isExpanded && (
                              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                                Editing
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-muted-foreground text-[11px]">
                          {g.slug}
                        </td>
                        <td className="p-3 text-muted-foreground max-w-xs truncate">
                          {g.description || "-"}
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant={isExpanded ? "secondary" : "outline"}
                              className="h-7 px-2.5 text-[11px] gap-1"
                              onClick={() => toggleExpand(g)}
                            >
                              {isExpanded ? <CaretUp className="h-3.5 w-3.5" /> : <CaretDown className="h-3.5 w-3.5" />}
                              <span>{isExpanded ? "Tutup" : "Edit"}</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmDeleteId(isConfirmingDelete ? null : g.id)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Accordion Panel Row (Cloudflare DNS Style Editor) */}
                      {isExpanded && (
                        <tr className="bg-muted/40 border-b border-border/60">
                          <td colSpan={5} className="p-4 pt-2">
                            <div className="p-4 bg-background border border-border/60 rounded-xl space-y-4 shadow-2xs">
                              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <h4 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                                  <PencilSimple className="h-4 w-4 text-primary" />
                                  <span>Edit Quick Record Genre</span>
                                </h4>
                                <span className="text-[11px] font-mono text-muted-foreground">ID: {g.id}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-muted-foreground">Nama Genre</label>
                                  <Input
                                    className="text-xs h-8 bg-background"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Nama Genre"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-muted-foreground">Slug (Otomatis)</label>
                                  <Input
                                    disabled
                                    className="text-xs h-8 bg-muted font-mono text-muted-foreground"
                                    value={g.slug}
                                  />
                                </div>

                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-[11px] font-semibold text-muted-foreground">Deskripsi Genre</label>
                                  <Input
                                    className="text-xs h-8 bg-background"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    placeholder="Tuliskan keterangan genre..."
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Info className="h-3.5 w-3.5" />
                                  <span>Perubahan akan langsung memperbarui relasi komik terkait.</span>
                                </span>

                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setExpandedId(null)}>
                                    Batal
                                  </Button>
                                  <Button size="sm" className="h-7 text-xs gap-1" disabled={submitting} onClick={() => handleSaveEdit(g.id)}>
                                    <FloppyDisk className="h-3.5 w-3.5" />
                                    <span>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Inline Delete Confirmation Drawer */}
                      {isConfirmingDelete && (
                        <tr className="bg-destructive/10 border-b border-destructive/20">
                          <td colSpan={5} className="p-3 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-xs font-semibold text-destructive">
                                Hapus genre <strong>"{g.name}"</strong> secara permanen?
                              </span>
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDeleteConfirm(g.id)}>
                                Ya, Hapus
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setConfirmDeleteId(null)}>
                                Batal
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
