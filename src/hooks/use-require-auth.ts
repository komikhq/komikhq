import { useEffect } from "react";
import { useAuth } from "./use-auth";

export function useRequireAuth(redirectTo: string = "/login") {
  const authState = useAuth();
  const { isPending, isAuthenticated } = authState;

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    }
  }, [isPending, isAuthenticated, redirectTo]);

  return authState;
}
