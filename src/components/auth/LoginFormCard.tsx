import React from "react"
import {
  Lock,
  EnvelopeSimple,
  GoogleLogo,
  ArrowRight,
  Eye,
  EyeSlash,
  PaperPlaneRight,
  ArrowClockwise,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLoginForm } from "@/hooks/use-login-form"

export function LoginFormCard() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isUnverified,
    isLoading,
    authError,
    cooldownSeconds,
    isCooldownActive,
    handleSubmit,
    handleResendUnverified,
    handleSignInGoogle,
  } = useLoginForm()

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px]">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold">
              Masuk ke KomikHQ
            </CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses akun KomikHQ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                {authError}
              </div>
            )}

            {isUnverified && (
              <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-500">
                <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                  <PaperPlaneRight className="h-4 w-4" />
                  <span>Email Belum Diverifikasi</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Akun Anda belum aktif karena email belum diverifikasi. Silakan
                  periksa email Anda atau minta kirim ulang tautan verifikasi.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-1 flex h-8 w-full items-center justify-center gap-1.5 text-xs font-semibold"
                  onClick={handleResendUnverified}
                  disabled={isCooldownActive || isLoading}
                >
                  <ArrowClockwise
                    className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isCooldownActive
                      ? `Kirim Ulang dalam ${cooldownSeconds}s`
                      : "Kirim Ulang Email Verifikasi"}
                  </span>
                </Button>
              </div>
            )}

            {/* One-Click Google OAuth */}
            <Button
              variant="outline"
              className="flex h-10 w-full items-center justify-center gap-2"
              onClick={handleSignInGoogle}
              disabled={isLoading}
            >
              <GoogleLogo className="h-4 w-4 text-primary" weight="bold" />
              <span>Masuk dengan Google</span>
            </Button>

            <div className="relative my-2 flex items-center justify-center text-xs text-muted-foreground uppercase">
              <span className="bg-card px-2">Atau masuk dengan email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Alamat Email</label>
                <div className="relative">
                  <EnvelopeSimple className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
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
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-9 pl-9"
                    required
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
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
                      {showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-3 w-full"
                disabled={isLoading}
              >
                <span>{isLoading ? "Memproses..." : "Masuk"}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              Belum memiliki akun?{" "}
              <a
                href="/register"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Daftar Sekarang
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
