import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router"
import {
  CheckCircleIcon as CheckCircle,
  WarningCircleIcon as WarningCircle,
  EnvelopeSimpleIcon as EnvelopeSimple,
  ArrowClockwiseIcon as ArrowClockwise,
  SpinnerIcon as Spinner,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useResendCooldown } from "@/hooks/use-resend-cooldown"

export function VerifyEmailCard() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const initialEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const { cooldownSeconds, isCooldownActive, startCooldown } =
    useResendCooldown(email, 60)

  // Automatic token verification when token is in URL
  useEffect(() => {
    if (!token) return

    let isMounted = true
    async function verify() {
      setStatus("verifying")
      setErrorMessage(null)

      try {
        const res = await authClient.verifyEmail({
          query: { token },
        })

        if (!isMounted) return

        if (res.error) {
          setStatus("error")
          setErrorMessage(
            res.error.message ||
              "Verification link is invalid or has expired. Please request a new verification email."
          )
        } else {
          setStatus("success")
          toast.success("Email verified successfully!")
        }
      } catch (err: any) {
        if (!isMounted) return
        setStatus("error")
        setErrorMessage(
          err.message || "Failed to verify email. Please try requesting a new link."
        )
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token])

  const handleResend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email.trim() || isCooldownActive || isResending) return

    setIsResending(true)
    try {
      const res = await authClient.sendVerificationEmail({
        email: email.trim(),
        callbackURL: `${window.location.origin}/verify-email`,
      })

      if (res.error) {
        toast.error(res.error.message || "Failed to send verification email.")
      } else {
        startCooldown(60)
        toast.success(`Verification link sent to ${email.trim()}`)
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while sending email.")
    } finally {
      setIsResending(false)
    }
  }

  // 1. Verifying state
  if (status === "verifying") {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px] text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Spinner className="h-8 w-8 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verifying Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 2. Success state
  if (status === "success") {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px] text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Verified Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Thank you for verifying your email address. Your KomikHQ account is now fully active.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button className="w-full">Sign in to your account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 3. Error state (expired or invalid token)
  if (status === "error") {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px] text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <WarningCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verification Failed
            </CardTitle>
            <CardDescription>
              {errorMessage || "The verification link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <form onSubmit={handleResend} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Address</label>
                <div className="relative">
                  <EnvelopeSimple className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full flex items-center justify-center gap-1.5"
                disabled={isCooldownActive || isResending}
              >
                <ArrowClockwise className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                <span>
                  {isCooldownActive
                    ? `Resend in ${cooldownSeconds}s`
                    : "Resend Verification Link"}
                </span>
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              <Link
                to="/login"
                className="font-semibold text-primary underline underline-offset-4"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 4. Idle state (Check your inbox instructions)
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-[440px] text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <EnvelopeSimple className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            {email
              ? `We have sent a verification link to ${email}.`
              : "Please check your inbox and click the verification link to activate your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <form onSubmit={handleResend} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Email Address</label>
              <div className="relative">
                <EnvelopeSimple className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-1.5"
              disabled={isCooldownActive || isResending}
            >
              <ArrowClockwise className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
              <span>
                {isCooldownActive
                  ? `Resend in ${cooldownSeconds}s`
                  : "Resend Verification Link"}
              </span>
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
