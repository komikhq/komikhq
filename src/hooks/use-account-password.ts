import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getBaseApiUrl } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";

export function useAccountPassword() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
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
        console.error("Gagal memuat status password user:", e);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchProfileData();
  }, []);

  const submitPassword = useCallback(
    async (e: React.FormEvent): Promise<boolean> => {
      e.preventDefault();
      setErrorMsg(null);

      if (newPassword.length < 8) {
        const msg = "Kata sandi baru harus memiliki minimal 8 karakter.";
        setErrorMsg(msg);
        return false;
      }

      if (newPassword !== confirmPassword) {
        const msg = "Konfirmasi kata sandi tidak sesuai dengan kata sandi baru.";
        setErrorMsg(msg);
        return false;
      }

      setIsSubmitting(true);

      try {
        if (hasPassword) {
          if (!currentPassword) {
            const msg = "Kata sandi saat ini wajib diisi.";
            setErrorMsg(msg);
            setIsSubmitting(false);
            return false;
          }

          const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          });

          if (error) {
            const msg = error.message || "Gagal mengubah kata sandi. Periksa kata sandi saat ini Anda.";
            setErrorMsg(msg);
            setIsSubmitting(false);
            return false;
          }

          toast.success("Kata sandi berhasil diperbarui!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          return true;
        } else {
          const { error } = await (authClient as any).setPassword({
            newPassword,
          });

          if (error) {
            const msg = error.message || "Gagal membuat kata sandi baru.";
            setErrorMsg(msg);
            setIsSubmitting(false);
            return false;
          }

          toast.success("Kata sandi baru berhasil dibuat! Anda sekarang bisa masuk via email & kata sandi.");
          setHasPassword(true);
          setNewPassword("");
          setConfirmPassword("");
          return true;
        }
      } catch (err: any) {
        const msg = err.message || "Terjadi kesalahan saat memproses kata sandi.";
        setErrorMsg(msg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [hasPassword, currentPassword, newPassword, confirmPassword]
  );

  return {
    hasPassword,
    isLoadingProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    isSubmitting,
    errorMsg,
    submitPassword,
  };
}
