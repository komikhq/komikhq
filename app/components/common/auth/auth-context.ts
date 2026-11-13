import { createContext, useContext } from "react"
import { useAuth, type UseAuthReturn } from "@/hooks/use-auth"

export const AuthContext = createContext<UseAuthReturn | null>(null)

export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext)
  const fallback = useAuth()
  return context ?? fallback
}
