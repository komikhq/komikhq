import React from "react"
import type { UseAuthReturn } from "@/hooks/use-auth"
import { AuthContext } from "./auth-context"

interface AuthProviderProps {
  children: React.ReactNode
  value: UseAuthReturn
}

export function AuthProvider({ children, value }: AuthProviderProps) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
