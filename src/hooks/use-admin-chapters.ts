import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface ChapterItem {
  id: string;
  comicId: string;
  chapterNumber: string;
  title?: string | null;
  slug: string;
  totalPages: number;
  accessTier?: string | null;
  isEarlyAccess: boolean;
  publishedAt: string;
}

export function useAdminChapters(comicId: string) {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getApiUrl = () => (window as any).__PUBLIC_API_URL__ || "http://localhost:8787";

  const fetchChapters = useCallback(async () => {
    if (!comicId) return;
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/comics/${comicId}/chapters`, { credentials: "include" });
      const data: any = await res.json();
      if (res.ok && data.chapters) {
        setChapters(data.chapters);
      } else {
        toast.error(data.error || "Gagal memuat daftar chapter");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data chapter");
    } finally {
      setLoading(false);
    }
  }, [comicId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const createChapterBatch = async (
    input: {
      chapterNumber: string;
      title?: string;
      accessTier?: string;
      isEarlyAccess?: boolean;
      pages: File[];
    },
    onProgress?: (progress: number, stepText: string) => void
  ) => {
    setSubmitting(true);
    try {
      onProgress?.(5, "Menginisialisasi chapter baru...");

      // Step 1: Init chapter
      const initRes = await fetch(`${getApiUrl()}/v1/admin/comics/${comicId}/chapters/init`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterNumber: input.chapterNumber,
          title: input.title,
          accessTier: input.accessTier || "free",
          isEarlyAccess: input.isEarlyAccess || false,
          totalPages: input.pages.length,
        }),
      });

      const initData: any = await initRes.json();
      if (!initRes.ok || !initData.success || !initData.chapter?.id) {
        throw new Error(initData.error || "Gagal menginisialisasi chapter.");
      }

      const chapterId = initData.chapter.id;
      const total = input.pages.length;

      // Step 2: Upload pages one by one (or batch) with retry
      for (let i = 0; i < total; i++) {
        const pageNum = i + 1;
        const pageFile = input.pages[i];
        const percent = 10 + Math.floor(((i + 1) / total) * 80);

        onProgress?.(percent, `Mengunggah halaman ${pageNum} dari ${total}...`);

        let uploaded = false;
        let lastErr = "";

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const pageFormData = new FormData();
            pageFormData.append("pageNumber", pageNum.toString());
            pageFormData.append("file", pageFile);

            const pageRes = await fetch(
              `${getApiUrl()}/v1/admin/comics/${comicId}/chapters/${chapterId}/pages/upload`,
              {
                method: "POST",
                credentials: "include",
                body: pageFormData,
              }
            );

            const pageData: any = await pageRes.json();
            if (pageRes.ok && pageData.success) {
              uploaded = true;
              break;
            } else {
              lastErr = pageData.error || "Gagal mengunggah halaman.";
            }
          } catch (err: any) {
            lastErr = err.message || "Kesalahan jaringan saat mengunggah halaman.";
          }
        }

        if (!uploaded) {
          throw new Error(`Gagal mengunggah halaman ${pageNum}: ${lastErr}`);
        }
      }

      // Step 3: Finalize
      onProgress?.(95, "Memfinalisasi rilis chapter...");
      const finalizeRes = await fetch(
        `${getApiUrl()}/v1/admin/comics/${comicId}/chapters/${chapterId}/finalize`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalPages: total }),
        }
      );

      const finalizeData: any = await finalizeRes.json();
      if (!finalizeRes.ok || !finalizeData.success) {
        throw new Error(finalizeData.error || "Gagal memfinalisasi chapter.");
      }

      onProgress?.(100, "Berhasil mengunggah semua halaman chapter!");
      toast.success("Chapter baru berhasil dibuat.");
      fetchChapters();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah chapter.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const createChapter = async (formData: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/comics/${comicId}/chapters`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success("Chapter baru berhasil dibuat.");
        fetchChapters();
        return true;
      } else {
        toast.error(data.error || "Gagal menambahkan chapter baru");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah chapter");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteChapter = async (chapterId: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/comics/${comicId}/chapters/${chapterId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Chapter berhasil dihapus");
        fetchChapters();
        return true;
      } else {
        toast.error(data.error || "Gagal menghapus chapter");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus chapter");
      return false;
    }
  };

  return {
    chapters,
    loading,
    submitting,
    fetchChapters,
    createChapter,
    createChapterBatch,
    deleteChapter,
  };
}
