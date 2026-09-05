import { useState, useCallback } from "react";
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
      setErrorMsg("Nama tidak boleh kosong.");
      return false;
    }
    setIsSavingName(true);
    setErrorMsg(null);
    try {
      const res = await authClient.updateUser({
        name: editedName.trim(),
      });
      if (res.error) {
        setErrorMsg(res.error.message || "Gagal memperbarui nama profil.");
        return false;
      } else {
        setIsEditingName(false);
        return true;
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat memperbarui nama.");
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
