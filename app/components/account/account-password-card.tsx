import {
  KeyIcon as Key,
  LockIcon as Lock,
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  CircleNotchIcon as CircleNotch,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccountPassword } from "@/hooks/use-account-password"

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
  } = useAccountPassword()

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <div className="h-6 w-44 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Key className="h-5 w-5 text-primary" />
          <span>
            {hasPassword ? "Change Password" : "Set Account Password"}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          {hasPassword
            ? "Regularly update your password to keep your KomikHQ account secure."
            : "Your account currently uses social sign-in. Set a password if you want to sign in with email and password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitPassword} className="max-w-md space-y-4">
          {hasPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
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
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeSlash className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeSlash className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMsg && (
            <p className="rounded border border-destructive/20 bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gap-2 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <CircleNotch className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>
                  {hasPassword ? "Save New Password" : "Set Password"}
                </span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
