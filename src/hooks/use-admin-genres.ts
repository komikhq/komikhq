import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface GenreItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
}

export function useAdminGenres() {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getApiUrl = () => (window as any).__PUBLIC_API_URL__ || "http://localhost:8787";

  const fetchGenres = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres`, { credentials: "include" });
      const data: any = await res.json();
      if (res.ok && data.genres) {
        setGenres(data.genres);
      } else {
        toast.error(data.error || "Gagal mengambil daftar genre");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const createGenre = async (name: string, description?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(`Genre "${name}" berhasil ditambahkan.`);
        fetchGenres();
        return true;
      } else {
        toast.error(data.error || "Gagal membuat genre baru");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat genre");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateGenre = async (id: string, name: string, description?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success("Genre berhasil diperbarui.");
        fetchGenres();
        return true;
      } else {
        toast.error(data.error || "Gagal mengedit genre");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengedit genre");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteGenre = async (id: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Genre berhasil dihapus");
        fetchGenres();
        return true;
      } else {
        toast.error(data.error || "Gagal menghapus genre");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus genre");
      return false;
    }
  };

  return {
    genres,
    loading,
    submitting,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
  };
}
