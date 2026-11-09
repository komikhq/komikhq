import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { toast } from "sonner"

export function useRequireAdmin(redirectTo: string = "/") {
  const authState = useAuth()
  const { isPending, isAuthenticated, user } = authState

  useEffect(() => {
    if (!isPending) {
      if (!isAuthenticated) {
        if (typeof window !== "undefined") {
          toast.error("Please login first.")
          window.location.replace("/login")
        }
      } else if (user?.role !== "admin") {
        if (typeof window !== "undefined") {
          toast.error("Access Denied. This page is only for Administrators.")
          window.location.replace(redirectTo)
        }
      }
    }
  }, [isPending, isAuthenticated, user, redirectTo])

  return {
    ...authState,
    isAdmin: user?.role === "admin",
  }
}
