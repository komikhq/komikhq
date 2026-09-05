import React, { useState } from "react";
import { Lock, EnvelopeSimple, GoogleLogo, ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

export function LoginFormCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleSignInEmail, handleSignInGoogle, isLoading, authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSignInEmail(email, password);
    if (success) {
      window.location.href = "/account";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full sm:w-[85%] md:w-[42%] max-w-lg mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Masuk ke KomikHQ</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses akun KomikHQ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <span>Masuk dengan Google</span>
            </Button>

            <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground my-2">
              <span className="bg-card px-2">Atau masuk dengan email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                    placeholder="••••••••"
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

              <Button type="submit" className="w-full mt-3" disabled={isLoading}>
                <span>{isLoading ? "Memproses..." : "Masuk"}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              Belum memiliki akun?{" "}
              <a href="/register" className="font-semibold text-primary underline underline-offset-4">
                Daftar Sekarang
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
