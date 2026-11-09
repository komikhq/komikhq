import { Link } from "react-router"
import {
  LockIcon as Lock,
  EnvelopeSimpleIcon as EnvelopeSimple,
  GoogleLogoIcon as GoogleLogo,
  ArrowRightIcon as ArrowRight,
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  PaperPlaneRightIcon as PaperPlaneRight,
  ArrowClockwiseIcon as ArrowClockwise,
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
              Log in to KomikHQ
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your KomikHQ account.
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
                  <span>Email Not Yet Verified</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Your account is not yet active because your email has not been verified. Please check your email or request a verification link resend.
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
              <span>Sign in with Google</span>
            </Button>

            <div className="relative my-2 flex items-center justify-center text-xs text-muted-foreground uppercase">
              <span className="bg-card px-2">Or sign in with email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Address</label>
                <div className="relative">
                  <EnvelopeSimple className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Password</label>
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
                        ? "Hide password"
                        : "Show password"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-3 w-full"
                disabled={isLoading}
              >
                <span>{isLoading ? "Processing..." : "Login"}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
