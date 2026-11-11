import { useState } from "react"
import { Link } from "react-router"
import {
  EnvelopeSimpleIcon as EnvelopeSimple,
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  CheckCircleIcon as CheckCircle,
  ArrowClockwiseIcon as ArrowClockwise,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useGuestOnly } from "@/hooks/use-guest-only"
import { useResendCooldown } from "@/hooks/use-resend-cooldown"

export function ForgotPasswordCard() {
  useGuestOnly("/account")

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { cooldownSeconds, isCooldownActive, startCooldown } =
    useResendCooldown(email, 60)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setErrorMsg(null)

    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const res = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo,
      })

      if (res.error) {
        const msg = res.error.message || "Failed to send reset link. Please check your email."
        setErrorMsg(msg)
        toast.error(msg)
        return
      }

      setIsSent(true)
      startCooldown(60)
      toast.success("Password reset instructions sent to your email.")
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred."
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-[440px]">
        <CardHeader className="pb-4 text-center">
          {isSent ? (
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-7 w-7" />
            </div>
          ) : null}
          <CardTitle className="text-2xl font-bold">
            {isSent ? "Check your email" : "Reset your password"}
          </CardTitle>
          <CardDescription>
            {isSent
              ? `We have sent a password reset link to ${email}. Please check your inbox and follow the instructions.`
              : "Enter your email address and we'll send you instructions to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          {isSent ? (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={isCooldownActive || isLoading}
              >
                <ArrowClockwise className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>
                  {isCooldownActive
                    ? `Resend in ${cooldownSeconds}s`
                    : "Resend email"}
                </span>
              </Button>

              <div className="pt-2 text-center text-xs text-muted-foreground">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline underline-offset-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                <span>{isLoading ? "Sending Link..." : "Send Reset Link"}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>

              <div className="pt-2 text-center text-xs text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

