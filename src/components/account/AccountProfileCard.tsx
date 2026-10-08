import React, { useState, useRef } from "react"
import {
  UploadSimple,
  WarningCircle,
  PencilSimple,
  Check,
  X,
  ShieldCheck,
  SignOut,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/components/auth/auth-context"
import { useUpdateUserName } from "@/hooks/use-update-user-name"
import { useUploadAvatar } from "@/hooks/use-upload-avatar"
import { AvatarCropDialog } from "./AvatarCropDialog"

export function AccountProfileCard() {
  const { user, isPending, handleSignOut, refetch } = useAuthContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

  const { uploadAvatar, isUploading, uploadError } = useUploadAvatar()
  const {
    isEditingName,
    editedName,
    setEditedName,
    isSavingName,
    errorMsg: nameError,
    startEditing,
    cancelEditing,
    saveName,
  } = useUpdateUserName()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImageSrc(reader.result as string)
        setCropDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCroppedUpload = async (croppedBlob: Blob) => {
    await uploadAvatar(croppedBlob)
    await refetch()
  }

  const handleSaveName = async () => {
    const success = await saveName()
    if (success) {
      await refetch()
    }
  }

  if (isPending && !user) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-2">
            <div className="h-6 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-60 animate-pulse rounded bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 rounded-lg border bg-card/50 p-4 sm:flex-row">
            <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
            <div className="w-full space-y-2 text-center sm:text-left">
              <div className="mx-auto h-5 w-40 animate-pulse rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-4 w-48 animate-pulse rounded bg-muted sm:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="space-y-4 p-6 text-center">
        <WarningCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Sesi Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">
          Silakan masuk ke akun Anda terlebih dahulu.
        </p>
        <a href="/login">
          <Button className="w-full">Masuk Sekarang</Button>
        </a>
      </Card>
    )
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
            <CardDescription>
              Kelola profil dan informasi akun KomikHQ Anda.
            </CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="gap-1.5"
          >
            <SignOut className="h-4 w-4" />
            <span>Keluar</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.role === "admin" && (
            <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3.5 md:hidden">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-primary">
                    Akses Administrator
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Kelola komik & sistem di Dashboard
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/dashboard")}
                className="h-8 text-xs font-semibold"
              >
                Dashboard Admin
              </Button>
            </div>
          )}

          <div className="flex flex-col items-center gap-6 rounded-lg border bg-card/50 p-4 sm:flex-row">
            {/* Avatar with Crop Trigger Overlay */}
            <div
              className="group relative flex-shrink-0 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-24 w-24 border-2 border-primary/40">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User Avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "HQ"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/60 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <PencilSimple className="h-5 w-5" />
                <span>Ubah</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              {/* Inline Display Name Edit */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-8 w-44 text-sm font-semibold sm:w-56"
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
                    <h3 className="text-xl font-bold">{user.name}</h3>
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

                <Badge
                  variant="secondary"
                  className="cursor-default gap-1 text-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Verified Member</span>
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <UploadSimple className="mr-2 h-4 w-4" />
                  <span>
                    {isUploading ? "Mengunggah..." : "Ubah Foto Profil"}
                  </span>
                </Button>
              </div>

              {uploadError && (
                <p className="pt-1 text-xs text-destructive">{uploadError}</p>
              )}
              {nameError && (
                <p className="pt-1 text-xs text-destructive">{nameError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
