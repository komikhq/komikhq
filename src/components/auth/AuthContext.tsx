import React, { createContext, useContext } from "react";
import { useAuth, type UseAuthReturn } from "@/hooks/use-auth";

const AuthContext = createContext<UseAuthReturn | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  value?: UseAuthReturn;
}

export function AuthProvider({ children, value }: AuthProviderProps) {
  const authState = useAuth();
  const contextValue = value || authState;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback to calling useAuth directly if outside provider
    return useAuth();
  }
  return context;
}
