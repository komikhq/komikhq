import React, { useState, useEffect, useRef } from "react";
import { API_PREFIX, API_ROUTES } from "@/constants/api-routes";
import { apiFetch } from "@/lib/api-client";
import { Image, CircleNotch } from "@phosphor-icons/react";

interface ReaderImageStackProps {
  comicSlug?: string;
  chapterSlug?: string;
}

interface LazyChapterPageProps {
  page: any;
  pageIndex: number;
  totalPages: number;
}

function LazyChapterPage({ page, pageIndex, totalPages }: LazyChapterPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(pageIndex === 0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "400px 0px 400px 0px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[400px] bg-neutral-900 overflow-hidden flex flex-col items-center justify-center border border-neutral-800 rounded-md transition-colors"
    >
      {isVisible ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 text-neutral-500 gap-2">
              <CircleNotch className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Memuat Halaman {page.pageNumber || pageIndex + 1}...</span>
            </div>
          )}
          <img
            src={page.imageUrl}
            alt={`Halaman ${page.pageNumber || pageIndex + 1}`}
            className={`w-full h-auto object-contain transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
            decoding="async"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-neutral-600">
          <Image className="h-8 w-8 opacity-40" />
          <span className="text-xs font-mono opacity-50">Halaman {page.pageNumber || pageIndex + 1}</span>
        </div>
      )}

      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 backdrop-blur font-mono rounded border border-neutral-800">
        {page.pageNumber || pageIndex + 1}/{totalPages}
      </span>
    </div>
  );
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
          if (res.comic?.id && res.chapter?.id) {
            apiFetch(API_ROUTES.HISTORY.RECORD, {
              method: "POST",
              body: JSON.stringify({
                comicId: res.comic.id,
                chapterId: res.chapter.id,
                lastReadPage: 1,
                snapshotTotalPages: res.pages?.length || 1,
              }),
            }).catch(() => {
              // Fail silently for history recording
            });
          }
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
        {Array.from({ length: 3 }).map((_, i) => (
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
    <main className="max-w-3xl mx-auto py-4 px-2 space-y-3">
      {pages.map((page, idx) => (
        <LazyChapterPage
          key={page.id || idx}
          page={page}
          pageIndex={idx}
          totalPages={pages.length}
        />
      ))}
    </main>
  );
}


