import React, { useState } from "react";
import { BookOpen, Plus, MagnifyingGlass, Trash, PencilSimple, CheckCircle, XCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminComicManagementCard() {
  const [search, setSearch] = useState("");

  const mockComics = [
    { id: "1", title: "Solo Leveling: Arise", author: "DUBU (REDICE)", chapters: 180, status: "Ongoing", genre: "Action, Fantasy" },
    { id: "2", title: "Tower of God", author: "SIU", chapters: 550, status: "Ongoing", genre: "Adventure, Fantasy" },
    { id: "3", title: "Omniscient Reader", author: "Sing Shong", chapters: 210, status: "Ongoing", genre: "Action, Sci-Fi" },
  ];

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Katalog & Manajemen Komik</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola judul komik, penulis, total chapter, dan status publikasi di KomikHQ.
          </CardDescription>
        </div>

        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Komik Baru</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul komik atau penulis..."
            className="pl-9 text-xs h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th className="p-3">Judul Komik</th>
                <th className="p-3">Penulis / Creator</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Total Chapter</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockComics.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold text-foreground">{c.title}</td>
                  <td className="p-3 text-muted-foreground">{c.author}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px]">{c.genre}</Badge>
                  </td>
                  <td className="p-3 font-medium">{c.chapters} Ch.</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <PencilSimple className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
