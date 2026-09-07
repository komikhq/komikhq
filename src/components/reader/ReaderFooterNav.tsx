import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/comment/CommentSection";
import { API_PREFIX } from "@/constants/api-routes";
import { apiFetch } from "@/lib/api-client";

interface ReaderFooterNavProps {
  comicSlug?: string;
  chapterSlug?: string;
}

export function ReaderFooterNav({ comicSlug, chapterSlug }: ReaderFooterNavProps) {
  const [data, setData] = useState<any>(null);
  const [navData, setNavData] = useState<{ prevSlug: string | null; nextSlug: string | null }>({
    prevSlug: null,
    nextSlug: null,
  });

  useEffect(() => {
    if (!comicSlug || !chapterSlug) return;

    apiFetch(`${API_PREFIX}/comics/${comicSlug}/chapters/${chapterSlug}`)
      .then((res) => {
        setData(res);
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

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 my-8 flex items-center justify-between gap-4">
        {navData.prevSlug ? (
          <Button
            className="border border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-white hover:border-neutral-500 active:scale-95 transition-all shadow-sm cursor-pointer"
            onClick={() => (window.location.href = `/komik/${comicSlug}/${navData.prevSlug}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Chapter Sebelumnya
          </Button>
        ) : (
          <Button disabled className="border border-neutral-800/60 bg-neutral-900/40 text-neutral-600 opacity-50 cursor-not-allowed">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Chapter Pertama
          </Button>
        )}

        {navData.nextSlug ? (
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-semibold cursor-pointer shadow-md"
            onClick={() => (window.location.href = `/komik/${comicSlug}/${navData.nextSlug}`)}
          >
            Chapter Selanjutnya
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled className="bg-neutral-900/50 border border-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed">
            Chapter Terakhir
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <section className="max-w-3xl mx-auto px-4 mt-12">
        <CommentSection comicId={data?.comic?.id} chapterId={data?.chapter?.id} variant="dark" />
      </section>
    </>
  );
}

