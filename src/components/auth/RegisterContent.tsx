import React, { useState } from "react";
import { Lock, EnvelopeSimple, User, GoogleLogo, ArrowRight, Eye, EyeSlash, PaperPlaneRight } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

export function RegisterContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSignUpEmail, handleSignInGoogle, isLoading, authError, setAuthError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setAuthError("Kata sandi minimal 8 karakter.");
      return;
    }

    const success = await handleSignUpEmail(name, email, password);
    if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full sm:w-[85%] md:w-[42%] max-w-lg mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Buat Akun KomikHQ</CardTitle>
            <CardDescription>
              Bergabung dengan KomikHQ untuk sinkronisasi bookmark, riwayat baca, dan baca komik tanpa iklan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSuccess ? (
              <div className="p-6 text-center space-y-3 bg-muted/30 border rounded-lg">
                <PaperPlaneRight className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-bold text-lg">Periksa Email Anda</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kami telah mengirimkan tautan verifikasi ke <strong className="text-foreground">{email}</strong>. Silakan periksa kotak masuk dan lakukan verifikasi untuk mengaktifkan akun.
                </p>
                <a href="/login">
                  <Button variant="outline" className="w-full mt-2">
                    Kembali ke Halaman Masuk
                  </Button>
                </a>
              </div>
            ) : (
              <>
                {authError && (
                  <div className="p-3 text-xs rounded-md border border-destructive/50 bg-destructive/10 text-destructive">
                    {authError}
                  </div>
                )}

                {/* One-Click Google OAuth */}
                <Button
                  variant="outline"
                  className="w-full h-10 flex items-center justify-center gap-2"
                  onClick={handleSignInGoogle}
                  disabled={isLoading}
                >
                  <GoogleLogo className="h-4 w-4 text-primary" weight="bold" />
                  <span>Daftar dengan Google</span>
                </Button>

                <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground my-2">
                  <span className="bg-card px-2">Atau daftar dengan email</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Alamat Email</label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9"
                        required
                      />
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeSlash className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi kata sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9 pr-9"
                        required
                      />
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeSlash className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-3" disabled={isLoading}>
                    <span>{isLoading ? "Memproses..." : "Buat Akun"}</span>
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Sudah memiliki akun?{" "}
                  <a href="/login" className="font-semibold text-primary underline underline-offset-4">
                    Masuk Sekarang
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
