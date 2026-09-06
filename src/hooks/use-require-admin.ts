import { useEffect } from "react";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export function useRequireAdmin(redirectTo: string = "/") {
  const authState = useAuth();
  const { isPending, isAuthenticated, user } = authState;

  useEffect(() => {
    if (!isPending) {
      if (!isAuthenticated) {
        if (typeof window !== "undefined") {
          toast.error("Anda harus masuk terlebih dahulu.");
          window.location.replace("/login");
        }
      } else if (user?.role !== "admin") {
        if (typeof window !== "undefined") {
          toast.error("Akses Ditolak. Halaman ini khusus Administrator.");
          window.location.replace(redirectTo);
        }
      }
    }
  }, [isPending, isAuthenticated, user, redirectTo]);

  return {
    ...authState,
    isAdmin: user?.role === "admin",
  };
}
