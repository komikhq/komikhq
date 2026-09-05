import React, { useState } from "react";
import { UserCircle, UploadSimple, SignOut, ShieldCheck, Envelope, WarningCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";

export function AccountContent() {
  const { user, isPending, isAuthenticated, handleSignOut, refetch } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <p className="text-sm text-muted-foreground animate-pulse">Memuat profil akun...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6 space-y-4">
          <WarningCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Belum Masuk</h2>
          <p className="text-sm text-muted-foreground">Silakan masuk ke akun Anda terlebih dahulu.</p>
          <a href="/login">
            <Button className="w-full">Masuk Sekarang</Button>
          </a>
        </Card>
      </div>
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-4 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Profil Akun</CardTitle>
            <CardDescription>Kelola profil dan informasi akun KomikHQ Anda.</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={handleSignOut}>
            <SignOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
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

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                <Envelope className="h-4 w-4" />
                <span>Alamat Email</span>
              </div>
              <p className="font-medium text-sm pt-1">{user.email}</p>
            </div>

            <div className="p-4 border rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Status Akun</span>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  Role: {(user as any).role || "User"}
                </Badge>
                <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-800">
                  Terverifikasi
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
