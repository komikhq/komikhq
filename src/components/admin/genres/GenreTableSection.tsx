import React, { useState } from "react";
import { Plus, Tag, PencilSimple, Trash, Check, X } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminGenres, type GenreItem } from "@/hooks/use-admin-genres";

export function GenreTableSection() {
  const { genres, loading, submitting, createGenre, updateGenre, deleteGenre } = useAdminGenres();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const ok = await createGenre(newName, newDesc);
    if (ok) {
      setNewName("");
      setNewDesc("");
    }
  };

  const startEdit = (g: GenreItem) => {
    setEditingId(g.id);
    setEditName(g.name);
    setEditDesc(g.description || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    const ok = await updateGenre(id, editName, editDesc);
    if (ok) {
      setEditingId(null);
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
            Kelola kategori & genre komik di platform KomikHQ secara langsung.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inline add new genre form */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border/60">
          <Input
            placeholder="Nama Genre Baru (misal: Action, Isekai)"
            className="text-xs h-9"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Deskripsi Genre (opsional)"
            className="text-xs h-9"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={submitting || !newName.trim()} className="gap-1 text-xs shrink-0 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </Button>
        </form>

        {/* Table of genres */}
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th className="p-3">Nama Genre</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">Memuat data genre...</td>
                </tr>
              ) : genres.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">Belum ada genre terdaftar.</td>
                </tr>
              ) : (
                genres.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                    {editingId === g.id ? (
                      <>
                        <td className="p-2">
                          <Input className="text-xs h-8" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </td>
                        <td className="p-2 text-muted-foreground font-mono text-[11px]">{g.slug}</td>
                        <td className="p-2">
                          <Input className="text-xs h-8" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500" onClick={() => handleSaveEdit(g.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-semibold text-foreground">{g.name}</td>
                        <td className="p-3 font-mono text-muted-foreground text-[11px]">{g.slug}</td>
                        <td className="p-3 text-muted-foreground">{g.description || "-"}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEdit(g)}>
                              <PencilSimple className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => deleteGenre(g.id)}>
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
