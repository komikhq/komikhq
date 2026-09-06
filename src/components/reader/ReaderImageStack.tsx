import React, { useState, useEffect } from "react";
import { API_PREFIX } from "@/constants/api-routes";
import { apiFetch } from "@/lib/api-client";
import { Image } from "@phosphor-icons/react";

interface ReaderImageStackProps {
  comicSlug?: string;
  chapterSlug?: string;
}

export function ReaderImageStack({ comicSlug, chapterSlug }: ReaderImageStackProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comicSlug || !chapterSlug) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    apiFetch(`${API_PREFIX}/comics/${comicSlug}/chapters/${chapterSlug}`)
      .then((res) => {
        if (isMounted) {
          setPages(res.pages || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Gagal memuat lembaran komik.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [comicSlug, chapterSlug]);

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto py-8 px-2 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full h-96 bg-neutral-900 animate-pulse rounded-md border border-neutral-800" />
        ))}
      </main>
    );
  }

  if (error || pages.length === 0) {
    return (
      <main className="max-w-3xl mx-auto py-16 px-4 text-center space-y-3">
        <Image className="h-12 w-12 mx-auto text-neutral-600" />
        <h3 className="text-base font-bold text-neutral-300">Belum Ada Halaman Terdaftar</h3>
        <p className="text-xs text-neutral-500">
          {error || "Chapter ini belum memiliki lembaran gambar yang diunggah di database."}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-4 px-2 space-y-2">
      {pages.map((page, idx) => (
        <div
          key={page.id || idx}
          className="relative w-full bg-neutral-900 overflow-hidden flex flex-col items-center justify-center border border-neutral-800 rounded-md"
        >
          <img
            src={page.imageUrl}
            alt={`Page ${page.pageNumber || idx + 1}`}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 backdrop-blur font-mono rounded">
            {page.pageNumber || idx + 1}/{pages.length}
          </span>
        </div>
      ))}
    </main>
  );
}

