import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChatCircleText, PaperPlaneRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { API_PREFIX } from "@/constants/api-routes";
import { apiFetch } from "@/lib/api-client";

interface ReaderFooterNavProps {
  comicSlug?: string;
  chapterSlug?: string;
}

export function ReaderFooterNav({ comicSlug, chapterSlug }: ReaderFooterNavProps) {
  const [commentText, setCommentText] = useState("");
  const [navData, setNavData] = useState<{ prevSlug: string | null; nextSlug: string | null }>({
    prevSlug: null,
    nextSlug: null,
  });

  useEffect(() => {
    if (!comicSlug || !chapterSlug) return;

    apiFetch(`${API_PREFIX}/comics/${comicSlug}/chapters/${chapterSlug}`)
      .then((res) => {
        const allChapters: any[] = res.allChapters || [];
        const currentIndex = allChapters.findIndex((c) => c.slug === chapterSlug);

        const prev = currentIndex > 0 ? allChapters[currentIndex - 1].slug : null;
        const next = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].slug : null;

        setNavData({ prevSlug: prev, nextSlug: next });
      })
      .catch(() => {
        setNavData({ prevSlug: null, nextSlug: null });
      });
  }, [comicSlug, chapterSlug]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 my-8 flex items-center justify-between gap-4">
        {navData.prevSlug ? (
          <Button
            variant="outline"
            className="border-neutral-800 text-neutral-200"
            onClick={() => (window.location.href = `/komik/${comicSlug}/${navData.prevSlug}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Chapter Sebelumnya
          </Button>
        ) : (
          <Button variant="outline" disabled className="border-neutral-800 text-neutral-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Chapter Pertama
          </Button>
        )}

        {navData.nextSlug ? (
          <Button
            className="bg-primary text-primary-foreground"
            onClick={() => (window.location.href = `/komik/${comicSlug}/${navData.nextSlug}`)}
          >
            Chapter Selanjutnya
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled variant="secondary">
            Chapter Terakhir
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <section className="max-w-3xl mx-auto px-4 mt-12">
        <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ChatCircleText className="h-5 w-5 text-primary" />
              <span>Komentar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            <form onSubmit={handlePostComment} className="space-y-3">
              <Textarea
                placeholder="Tulis komentar Anda untuk chapter ini..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={!commentText.trim()}>
                  <PaperPlaneRight className="mr-1.5 h-4 w-4" />
                  Kirim Komentar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

