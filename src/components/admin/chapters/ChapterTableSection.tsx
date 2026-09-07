import React, { useState } from "react";
import { ListNumbers, Plus, Trash, Image as ImageIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminChapters, type ChapterItem } from "@/hooks/use-admin-chapters";
import { ChapterFormSheet } from "./ChapterFormSheet";

interface ChapterTableSectionProps {
  comicId: string;
}

export function ChapterTableSection({ comicId }: ChapterTableSectionProps) {
  const { chapters, loading, submitting, createChapterBatch, deleteChapter } = useAdminChapters(comicId);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Card className="border-border/60 shadow-xs w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ListNumbers className="h-5 w-5 text-primary" />
            <span>Manajemen Chapter</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar chapter yang telah dirilis beserta jumlah gambar halaman.
          </CardDescription>
        </div>

        <Button size="sm" className="gap-1.5 text-xs w-full sm:w-auto" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Tambah Chapter Baru</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th className="p-3">No. Chapter</th>
                <th className="p-3">Judul Chapter</th>
                <th className="p-3">Total Halaman</th>
                <th className="p-3">Akses</th>
                <th className="p-3">Tanggal Rilis</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">Memuat rilis chapter...</td>
                </tr>
              ) : chapters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">Belum ada chapter dirilis untuk komik ini.</td>
                </tr>
              ) : (
                chapters.map((ch) => (
                  <tr key={ch.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">Chapter {ch.chapterNumber}</td>
                    <td className="p-3 text-muted-foreground">{ch.title || "-"}</td>
                    <td className="p-3 font-medium">
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>{ch.totalPages} Halaman</span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {ch.accessTier || "Free"}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(ch.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => deleteChapter(ch.id)}>
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
    </Card>
  );
}
