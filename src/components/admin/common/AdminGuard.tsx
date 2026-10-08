import React from "react"
import { useRequireAdmin } from "@/hooks/use-require-admin"
import { AuthProvider } from "@/components/auth/AuthContext"

interface AdminGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AdminGuard({ children, redirectTo = "/" }: AdminGuardProps) {
  const authState = useRequireAdmin(redirectTo)
  const { isPending, isAuthenticated, isAdmin } = authState

  if (isPending || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-[350px] w-full flex-col items-center justify-center space-y-4 p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="animate-pulse text-sm text-muted-foreground">
          Verifying Administrator access permissions...
        </p>
      </div>
    )
  }

  return (
    <AuthProvider value={authState}>
      <div className="flex w-full flex-col gap-6">{children}</div>
    </AuthProvider>
  )
}
