import { useState } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

export interface UseAuthReturn {
  user: any;
  session: any;
  isPending: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  handleSignInEmail: (email: string, password: string) => Promise<boolean>;
  handleSignInGoogle: () => Promise<void>;
  handleSignUpEmail: (name: string, email: string, password: string) => Promise<boolean>;
  handleSignOut: () => Promise<void>;
  refetch: () => Promise<any>;
}

export function useAuth(): UseAuthReturn {
  const { data: sessionData, isPending, refetch } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (typeof window !== "undefined") {
    console.log("[Auth Session Debug]", {
      isPending,
      sessionData,
      user: sessionData?.user || null,
    });
  }

  const user = sessionData?.user || null;
  const session = sessionData?.session || null;
  const isAuthenticated = Boolean(user);

  const handleSignInEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error: err } = await authClient.signIn.email({
        email,
        password,
      });

      if (err) {
        const msg = err.message || "Gagal masuk. Periksa email dan kata sandi Anda.";
        setAuthError(msg);
        toast.error(msg);
        return false;
      }

      toast.success("Berhasil masuk akun!");
      await refetch();
      return true;
    } catch (e: any) {
      const msg = e.message || "Terjadi kesalahan saat masuk.";
      setAuthError(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/account",
        newUserCallbackURL: window.location.origin + "/account",
        authParams: {
          prompt: "select_account consent",
        },
      } as any);
    } catch (e: any) {
      const msg = e.message || "Gagal menghubungkan dengan Google OAuth.";
      setAuthError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const handleSignUpEmail = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { error: err } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: window.location.origin + "/verify-email",
      });

      if (err) {
        const msg = err.message || "Gagal membuat akun baru.";
        setAuthError(msg);
        toast.error(msg);
        return false;
      }

      toast.success("Akun berhasil dibuat!");
      await refetch();
      return true;
    } catch (e: any) {
      const msg = e.message || "Terjadi kesalahan saat mendaftar.";
      setAuthError(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      await refetch();
      toast.success("Berhasil keluar dari akun.");
      window.location.href = "/login";
    } catch (e: any) {
      const msg = e.message || "Gagal keluar.";
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    session,
    isPending,
    isAuthenticated,
    isLoading,
    authError,
    setAuthError,
    handleSignInEmail,
    handleSignInGoogle,
    handleSignUpEmail,
    handleSignOut,
    refetch,
  };
}
