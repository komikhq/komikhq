import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { API_ROUTES } from "@/constants/api-routes";
import { getBaseApiUrl } from "@/lib/api-client";

export function useUploadAvatar() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadAvatar = async (fileBlob: Blob): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", fileBlob, "avatar.jpg");

      const baseUrl = getBaseApiUrl();
      const response = await fetch(`${baseUrl}${API_ROUTES.USER.AVATAR}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        avatarUrl?: string;
        imageUrl?: string;
        error?: string;
      };

      const finalUrl = data.avatarUrl || data.imageUrl;

      if (!response.ok || !finalUrl) {
        throw new Error(data.error || "Gagal mengunggah gambar profil ke server.");
      }

      // Sync user session image in better-auth
      await authClient.updateUser({
        image: finalUrl,
      });

      toast.success("Foto profil berhasil diperbarui!");
      return finalUrl;
    } catch (err: any) {
      const message = err?.message || "Terjadi kesalahan saat mengunggah foto profil.";
      setUploadError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    isUploading,
    uploadError,
    setUploadError,
  };
}
