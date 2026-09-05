import { useState, useCallback } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useUpdateUserName() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startEditing = useCallback((currentName: string) => {
    setEditedName(currentName);
    setIsEditingName(true);
    setErrorMsg(null);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditingName(false);
    setErrorMsg(null);
  }, []);

  const saveName = useCallback(async (): Promise<boolean> => {
    if (!editedName.trim()) {
      const msg = "Nama tidak boleh kosong.";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }
    setIsSavingName(true);
    setErrorMsg(null);
    try {
      const res = await authClient.updateUser({
        name: editedName.trim(),
      });
      if (res.error) {
        const msg = res.error.message || "Gagal memperbarui nama profil.";
        setErrorMsg(msg);
        toast.error(msg);
        return false;
      } else {
        toast.success("Nama profil berhasil diperbarui!");
        setIsEditingName(false);
        return true;
      }
    } catch (err: any) {
      const msg = err?.message || "Terjadi kesalahan saat memperbarui nama.";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsSavingName(false);
    }
  }, [editedName]);

  return {
    isEditingName,
    editedName,
    setEditedName,
    isSavingName,
    errorMsg,
    startEditing,
    cancelEditing,
    saveName,
  };
}
