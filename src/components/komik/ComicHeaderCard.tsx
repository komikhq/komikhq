import React, { useState, useEffect } from "react";
import { BookmarkSimple, BookOpen, User } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

interface ComicHeaderCardProps {
  slug?: string;
}

export function ComicHeaderCard({ slug }: ComicHeaderCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [comicData, setComicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    apiFetch(API_ROUTES.COMICS.DETAIL(slug))
      .then((data) => {
        if (isMounted) {
          setComicData(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Gagal memuat detail komik.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden p-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="aspect-[3/4] w-48 mx-auto md:mx-0 bg-muted rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-16 bg-muted rounded w-full" />
            <div className="h-10 bg-muted rounded w-40" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !comicData) {
    return (
      <Card className="p-8 text-center space-y-2">
        <h2 className="text-lg font-bold text-destructive">Komik Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">{error || "Data komik tidak dapat diambil."}</p>
        <Button variant="outline" size="sm" onClick={() => (window.location.href = "/browse")}>
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
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="relative aspect-[3/4] w-48 mx-auto md:mx-0 overflow-hidden rounded-md bg-muted flex-shrink-0 border">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {comic.title}
              </h1>
              {creators.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1 font-medium">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Karya: {creators.map((c: any) => c.name).join(", ")}</span>
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {comic.synopsis || "Belum ada sinopsis untuk komik ini."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {firstChapter ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => (window.location.href = `/komik/${comic.slug}/${firstChapter.slug}`)}>
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
                    onClick={() => setBookmarked(!bookmarked)}
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

