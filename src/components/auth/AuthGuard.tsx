import React from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { AuthProvider } from "./AuthContext"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const authState = useRequireAuth(redirectTo)
  const { isPending, isAuthenticated } = authState

  if (isPending || !isAuthenticated) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center space-y-3 p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AuthProvider value={authState}>
      <div className="flex w-full flex-col gap-6">{children}</div>
    </AuthProvider>
  )
}
