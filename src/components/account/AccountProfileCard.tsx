import React, { useState } from "react";
import { UploadSimple, WarningCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { API_ROUTES } from "@/constants/api-routes";

export function AccountProfileCard() {
  const { user, isPending, isAuthenticated, handleSignOut, refetch } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground animate-pulse">Memuat profil akun...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="text-center p-6 space-y-4">
        <WarningCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Mengalihkan...</h2>
        <p className="text-sm text-muted-foreground">Silakan masuk ke akun Anda terlebih dahulu.</p>
        <a href="/login">
          <Button className="w-full">Masuk Sekarang</Button>
        </a>
      </Card>
    );
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const baseUrl = (window as any).__PUBLIC_API_URL__ || import.meta.env.PUBLIC_API_URL || "http://localhost:8787";
      const res = await fetch(`${baseUrl}${API_ROUTES.USER.AVATAR}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as any;
        throw new Error(err.error || "Gagal mengunggah foto profil.");
      }

      await refetch();
    } catch (err: any) {
      setUploadError(err.message || "Gagal mengunggah gambar avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">Profil Akun</CardTitle>
          <CardDescription>Kelola profil dan informasi akun KomikHQ Anda.</CardDescription>
        </div>
        <Button variant="destructive" size="sm" onClick={handleSignOut}>
          <span>Keluar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-card/50">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.image || undefined} alt={user.name || "User Avatar"} />
            <AvatarFallback className="text-2xl font-bold">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "HQ"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" type="button" disabled={isUploading}>
                  <UploadSimple className="mr-2 h-4 w-4" />
                  <span>{isUploading ? "Mengunggah..." : "Ubah Foto Profil"}</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
