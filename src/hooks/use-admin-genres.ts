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

  // Form & Accordion State encapsulated inside Hook
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(`Genre "${newName}" berhasil ditambahkan.`);
        setNewName("");
        setNewDesc("");
        fetchGenres();
      } else {
        toast.error(data.error || "Gagal membuat genre baru");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat genre");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = (g: GenreItem) => {
    if (expandedId === g.id) {
      setExpandedId(null);
    } else {
      setExpandedId(g.id);
      setEditName(g.name);
      setEditDesc(g.description || "");
      setConfirmDeleteId(null);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success("Genre berhasil diperbarui.");
        setExpandedId(null);
        fetchGenres();
      } else {
        toast.error(data.error || "Gagal mengedit genre");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengedit genre");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/genres/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Genre berhasil dihapus");
        setConfirmDeleteId(null);
        if (expandedId === id) setExpandedId(null);
        fetchGenres();
      } else {
        toast.error(data.error || "Gagal menghapus genre");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus genre");
    }
  };

  return {
    genres,
    loading,
    submitting,
    newName,
    setNewName,
    newDesc,
    setNewDesc,
    expandedId,
    setExpandedId,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    confirmDeleteId,
    setConfirmDeleteId,
    handleAdd,
    toggleExpand,
    handleSaveEdit,
    handleDeleteConfirm,
  };
}
