import React, { useState, useRef } from "react";
import {
  UploadSimple,
  WarningCircle,
  PencilSimple,
  Check,
  X,
  ShieldCheck,
  SignOut,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUserName } from "@/hooks/use-update-user-name";
import { useUploadAvatar } from "@/hooks/use-upload-avatar";
import { AvatarCropDialog } from "./AvatarCropDialog";

export function AccountProfileCard() {
  const { user, isPending, handleSignOut, refetch } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const { uploadAvatar, isUploading, uploadError } = useUploadAvatar();
  const {
    isEditingName,
    editedName,
    setEditedName,
    isSavingName,
    errorMsg: nameError,
    startEditing,
    cancelEditing,
    saveName,
  } = useUpdateUserName();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedUpload = async (croppedBlob: Blob) => {
    await uploadAvatar(croppedBlob);
    await refetch();
  };

  const handleSaveName = async () => {
    const success = await saveName();
    if (success) {
      await refetch();
    }
  };

  if (isPending && !user) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-muted animate-pulse rounded" />
            <div className="h-4 w-60 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-card/50">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 text-center sm:text-left w-full">
              <div className="h-5 w-40 bg-muted animate-pulse rounded mx-auto sm:mx-0" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto sm:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="text-center p-6 space-y-4">
        <WarningCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Sesi Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">Silakan masuk ke akun Anda terlebih dahulu.</p>
        <a href="/login">
          <Button className="w-full">Masuk Sekarang</Button>
        </a>
      </Card>
    );
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      <AvatarCropDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCroppedUpload}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Profil Akun</CardTitle>
            <CardDescription>Kelola profil dan informasi akun KomikHQ Anda.</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={handleSignOut} className="gap-1.5">
            <SignOut className="h-4 w-4" />
            <span>Keluar</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-card/50">
            {/* Avatar with Crop Trigger Overlay */}
            <div
              className="relative group cursor-pointer flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-24 w-24 border-2 border-primary/40">
                <AvatarImage src={user.image || undefined} alt={user.name || "User Avatar"} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "HQ"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold rounded-full gap-1">
                <PencilSimple className="h-5 w-5" />
                <span>Ubah</span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              {/* Inline Display Name Edit */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-8 text-sm w-44 sm:w-56 font-semibold"
                      disabled={isSavingName}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      title="Simpan Nama"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={cancelEditing}
                      disabled={isSavingName}
                      title="Batal"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl">{user.name}</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => startEditing(user.name || "")}
                      title="Ubah nama tampilan"
                    >
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Badge variant="secondary" className="gap-1 text-xs cursor-default">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Verified Member</span>
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <UploadSimple className="mr-2 h-4 w-4" />
                  <span>{isUploading ? "Mengunggah..." : "Ubah Foto Profil"}</span>
                </Button>
              </div>

              {uploadError && <p className="text-xs text-destructive pt-1">{uploadError}</p>}
              {nameError && <p className="text-xs text-destructive pt-1">{nameError}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
