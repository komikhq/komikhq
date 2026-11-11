import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router"
import {
  LockIcon as Lock,
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  ArrowRightIcon as ArrowRight,
  CheckCircleIcon as CheckCircle,
  WarningCircleIcon as WarningCircle,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { authClient } from "@/lib/auth-client"

export function ResetPasswordCard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password confirmation does not match.")
      return
    }

    if (!token) {
      setErrorMsg("Reset token is missing. Please request a new link.")
      return
    }

    setIsLoading(true)

    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (res.error) {
        const msg = res.error.message || "Failed to reset password. The link may have expired."
        setErrorMsg(msg)
        toast.error(msg)
        return
      }

      setIsSuccess(true)
      toast.success("Password has been reset successfully!")
      setTimeout(() => {
        navigate("/login")
      }, 2500)
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred."
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px] text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <WarningCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This password reset link is invalid or has expired. Please request a new reset link.
            </p>
            <div className="pt-2">
              <Link to="/forgot-password">
                <Button className="w-full">Request New Link</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px] text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Password Reset Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your password has been updated successfully. Redirecting you to login...
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button className="w-full">Sign in now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-[440px]">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold">
              Create New Password
            </CardTitle>
            <CardDescription>
              Please enter and confirm your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold">New Password</label>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-9 pl-9 text-xs"
                    required
                    minLength={8}
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
                      {showPassword ? "Hide password" : "Show password"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 text-xs"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isLoading}
              >
                <span>{isLoading ? "Saving..." : "Reset Password"}</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

