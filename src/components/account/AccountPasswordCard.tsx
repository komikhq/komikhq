import React from "react";
import { Key, Lock, Eye, EyeSlash, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccountPassword } from "@/hooks/use-account-password";

export function AccountPasswordCard() {
  const {
    hasPassword,
    isLoadingProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    isSubmitting,
    errorMsg,
    submitPassword,
  } = useAccountPassword();

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
        <form onSubmit={submitPassword} className="space-y-4 max-w-md">
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
