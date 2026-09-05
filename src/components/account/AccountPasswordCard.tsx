import React, { useState, useEffect } from "react";
import { Key, Lock, Eye, EyeSlash, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getBaseApiUrl } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";

export function AccountPasswordCard() {
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
          const data = await res.json();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("Kata sandi baru harus memiliki minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak sesuai dengan kata sandi baru.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasPassword) {
        if (!currentPassword) {
          setErrorMsg("Kata sandi saat ini wajib diisi.");
          setIsSubmitting(false);
          return;
        }

        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          setErrorMsg(error.message || "Gagal mengubah kata sandi. Periksa kata sandi saat ini Anda.");
          setIsSubmitting(false);
          return;
        }

        toast.success("Kata sandi berhasil diperbarui!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // First-time set password for OAuth user
        const { error } = await (authClient as any).setPassword({
          newPassword,
        });

        if (error) {
          setErrorMsg(error.message || "Gagal membuat kata sandi baru.");
          setIsSubmitting(false);
          return;
        }

        toast.success("Kata sandi baru berhasil dibuat! Anda sekarang bisa masuk via email & kata sandi.");
        setHasPassword(true);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses kata sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <div className="h-6 w-44 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <span>{hasPassword ? "Ubah Kata Sandi" : "Buat Kata Sandi Akun"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {hasPassword
            ? "Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun KomikHQ."
            : "Akun Anda saat ini menggunakan Google OAuth. Buat kata sandi baru jika ingin bisa masuk via Email & Kata Sandi."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {hasPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Kata Sandi Baru</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded border border-destructive/20">
              {errorMsg}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
            {isSubmitting ? (
              <>
                <CircleNotch className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>{hasPassword ? "Simpan Kata Sandi Baru" : "Buat Kata Sandi Akun"}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
