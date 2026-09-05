import React from "react";
import { Warning, Trash, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useDeleteAccount } from "@/hooks/use-delete-account";

export function AccountDangerZoneCard() {
  const {
    user,
    hasPassword,
    confirmInput,
    setConfirmInput,
    isDeleting,
    deleteError,
    resetDeleteState,
    deleteAccount,
  } = useDeleteAccount();

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

            <AlertDialog onOpenChange={() => resetDeleteState()}>
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
                    <span>Apakah Anda yakin ingin menghapus akun?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun KomikHQ Anda secara permanen beserta seluruh preferensi, riwayat baca, dan bookmark.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 py-2">
                  <Label htmlFor="deleteConfirmInput">
                    {hasPassword
                      ? "Masukkan Kata Sandi Saat Ini untuk Mengonfirmasi:"
                      : `Ketik alamat email Anda (${user?.email || "email Anda"}) untuk mengonfirmasi:`}
                  </Label>
                  <Input
                    id="deleteConfirmInput"
                    type={hasPassword ? "password" : "text"}
                    placeholder={hasPassword ? "••••••••" : user?.email || "user@email.com"}
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    disabled={isDeleting}
                  />
                  {deleteError && (
                    <p className="text-xs text-destructive font-medium">{deleteError}</p>
                  )}
                </div>

                <AlertDialogFooter className="mt-2">
                  <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      deleteAccount();
                    }}
                    disabled={isDeleting || !confirmInput.trim()}
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
