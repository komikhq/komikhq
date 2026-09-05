import { useEffect } from "react";
import { useAuth } from "./use-auth";

export function useGuestOnly(redirectTo: string = "/account") {
  const authState = useAuth();
  const { isPending, isAuthenticated } = authState;

  useEffect(() => {
    if (!isPending && isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.replace(redirectTo);
      }
    }
  }, [isPending, isAuthenticated, redirectTo]);

  return authState;
}
