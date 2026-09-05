import React, { useState } from "react";
import { Warning, Trash, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { API_ROUTES } from "@/constants/api-routes";
import { getBaseApiUrl } from "@/lib/api-client";

export function AccountDangerZoneCard() {
  const { handleSignOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const baseUrl = getBaseApiUrl();
      const res = await fetch(`${baseUrl}${API_ROUTES.USER.PROFILE}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as any;
        throw new Error(err.error || "Gagal menghapus akun.");
      }

      await handleSignOut();
    } catch (err: any) {
      setDeleteError(err.message || "Gagal menghapus akun.");
      setIsDeleting(false);
    }
  };

  return (
    <TooltipProvider>
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
            <Warning className="h-5 w-5 text-destructive" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Tindakan akun ini permanen dan tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <h4 className="font-semibold text-sm">Hapus Akun Permanen</h4>
              <p className="text-xs text-muted-foreground">
                Menghapus akun Anda dari KomikHQ beserta bookmark dan riwayat baca.
              </p>
              {deleteError && (
                <p className="text-xs text-destructive mt-1 font-medium">{deleteError}</p>
              )}
            </div>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="shrink-0 gap-2">
                      <Trash className="h-4 w-4" />
                      <span>Hapus Akun</span>
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">Hapus akun secara permanen</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <Warning className="h-5 w-5" />
                    <span>Apakah Anda yakin?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun KomikHQ Anda secara permanen beserta seluruh preferensi, riwayat baca, dan bookmark yang tersimpan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <CircleNotch className="h-4 w-4 animate-spin mr-2" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <span>Ya, Hapus Akun Saya</span>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
