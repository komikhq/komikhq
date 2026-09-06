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
    deleteChapter,
  };
}
