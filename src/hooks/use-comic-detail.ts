import { useState, useEffect } from "react";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export interface ComicDetailData {
  comic: any;
  genres: any[];
  creators: any[];
  chapters: any[];
}

export function useComicDetail(slug?: string) {
  const [bookmarked, setBookmarked] = useState(false);
  const [comicData, setComicData] = useState<ComicDetailData | null>(null);
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
          if (data.comic?.id) {
            apiFetch(API_ROUTES.BOOKMARKS.LIST)
              .then((res) => {
                if (isMounted && res.bookmarks) {
                  const isSaved = res.bookmarks.some((b: any) => b.comic.id === data.comic.id);
                  setBookmarked(isSaved);
                }
              })
              .catch(() => {});
          }
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

  const toggleBookmark = async () => {
    if (!comicData?.comic?.id) return;
    const targetComicId = comicData.comic.id;
    const nextState = !bookmarked;
    setBookmarked(nextState);

    try {
      if (nextState) {
        await apiFetch(API_ROUTES.BOOKMARKS.ADD, {
          method: "POST",
          body: JSON.stringify({ comicId: targetComicId, status: "reading" }),
        });
      } else {
        await apiFetch(API_ROUTES.BOOKMARKS.REMOVE(targetComicId), {
          method: "DELETE",
        });
      }
    } catch (err) {
      // Rollback on failure
      setBookmarked(!nextState);
    }
  };

  const handleReadFirstChapter = () => {
    if (comicData?.chapters?.[0]) {
      window.location.href = `/komik/${comicData.comic.slug}/${comicData.chapters[0].slug}`;
    }
  };

  const handleNavigateCatalog = () => {
    window.location.href = "/browse";
  };

  return {
    comicData,
    isLoading,
    error,
    bookmarked,
    toggleBookmark,
    handleReadFirstChapter,
    handleNavigateCatalog,
  };
}
