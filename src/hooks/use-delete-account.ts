import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { API_ROUTES } from "@/constants/api-routes";
import { getBaseApiUrl } from "@/lib/api-client";

export function useDeleteAccount() {
  const { user, handleSignOut } = useAuth();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileInfo() {
      try {
        const baseUrl = getBaseApiUrl();
        const res = await fetch(`${baseUrl}${API_ROUTES.USER.PROFILE}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = (await res.json()) as { hasPassword?: boolean };
          setHasPassword(Boolean(data.hasPassword));
        }
      } catch (e) {
        console.error("Gagal memuat profil akun:", e);
      }
    }
    fetchProfileInfo();
  }, []);

  const resetDeleteState = useCallback(() => {
    setConfirmInput("");
    setDeleteError(null);
  }, []);

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    const payload: { password?: string; email?: string } = {};

    if (hasPassword) {
      if (!confirmInput) {
        setDeleteError("Kata sandi konfirmasi wajib diisi.");
        setIsDeleting(false);
        return false;
      }
      payload.password = confirmInput;
    } else {
      if (!confirmInput || confirmInput.toLowerCase().trim() !== user?.email?.toLowerCase().trim()) {
        setDeleteError("Alamat email konfirmasi tidak sesuai.");
        setIsDeleting(false);
        return false;
      }
      payload.email = confirmInput;
    }

    try {
      const baseUrl = getBaseApiUrl();
      const res = await fetch(`${baseUrl}${API_ROUTES.USER.PROFILE}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus akun.");
      }

      toast.success("Akun Anda telah berhasil dihapus permanen.");
      await handleSignOut();
      return true;
    } catch (err: any) {
      setDeleteError(err.message || "Gagal menghapus akun.");
      setIsDeleting(false);
      return false;
    }
  }, [hasPassword, confirmInput, user, handleSignOut]);

  return {
    user,
    hasPassword,
    confirmInput,
    setConfirmInput,
    isDeleting,
    deleteError,
    setDeleteError,
    resetDeleteState,
    deleteAccount,
  };
}
