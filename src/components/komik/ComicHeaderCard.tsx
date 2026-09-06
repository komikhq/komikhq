import React from "react";
import { BookmarkSimple, BookOpen, User } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useComicDetail } from "@/hooks/use-comic-detail";

interface ComicHeaderCardProps {
  slug?: string;
}

export function ComicHeaderCard({ slug }: ComicHeaderCardProps) {
  const {
    comicData,
    isLoading,
    error,
    bookmarked,
    toggleBookmark,
    handleReadFirstChapter,
    handleNavigateCatalog,
  } = useComicDetail(slug);

  if (isLoading) {
    return (
      <Card className="overflow-hidden p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="aspect-[3/4] w-44 sm:w-48 bg-muted rounded-md shrink-0" />
          <div className="w-full flex-1 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3 mx-auto sm:mx-0" />
            <div className="h-8 bg-muted rounded w-3/4 mx-auto sm:mx-0" />
            <div className="h-16 bg-muted rounded w-full" />
            <div className="h-10 bg-muted rounded w-40 mx-auto sm:mx-0" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !comicData) {
    return (
      <Card className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-destructive">Komik Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">{error || "Data komik tidak dapat diambil."}</p>
        <Button variant="outline" size="sm" onClick={handleNavigateCatalog}>
          Kembali ke Katalog
        </Button>
      </Card>
    );
  }

  const { comic, genres = [], creators = [], chapters = [] } = comicData;
  const firstChapter = chapters[0];

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
          <div className="relative aspect-[3/4] w-44 sm:w-48 shrink-0 overflow-hidden rounded-md bg-muted border shadow-sm">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                <Badge variant="default" className="capitalize">
                  {comic.status || "Ongoing"}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {comic.accessTier || "Free"}
                </Badge>
                {genres.map((g: any) => (
                  <Badge key={g.id || g.slug} variant="outline">
                    {g.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
                {comic.title}
              </h1>
              {creators.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Karya: {creators.map((c: any) => c.name).join(", ")}</span>
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {comic.synopsis || "Belum ada sinopsis untuk komik ini."}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              {firstChapter ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleReadFirstChapter}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Baca Chapter 1
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Mulai membaca dari chapter pertama</TooltipContent>
                </Tooltip>
              ) : (
                <Button disabled variant="secondary">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Belum Ada Chapter
                </Button>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={bookmarked ? "secondary" : "outline"}
                    onClick={toggleBookmark}
                  >
                    <BookmarkSimple
                      className="mr-2 h-4 w-4"
                      weight={bookmarked ? "fill" : "regular"}
                    />
                    {bookmarked ? "Tersimpan" : "Tambah ke Bookmark"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {bookmarked ? "Hapus dari daftar bacaan" : "Simpan ke daftar favorit Anda"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
