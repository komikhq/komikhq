import { createContext, useContext } from "react"
import type { UseAuthReturn } from "@/hooks/use-auth"

export const AuthContext = createContext<UseAuthReturn | null>(null)

export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.")
  }
  return context
}
