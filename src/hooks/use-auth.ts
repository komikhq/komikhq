import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

export function useAuth() {
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
        setAuthError(err.message || "Gagal masuk. Periksa email dan kata sandi Anda.");
        return false;
      }

      await refetch();
      return true;
    } catch (e: any) {
      setAuthError(e.message || "Terjadi kesalahan saat masuk.");
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
      setAuthError(e.message || "Gagal menghubungkan dengan Google OAuth.");
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
        setAuthError(err.message || "Gagal membuat akun baru.");
        return false;
      }

      await refetch();
      return true;
    } catch (e: any) {
      setAuthError(e.message || "Terjadi kesalahan saat mendaftar.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      await refetch();
      window.location.href = "/login";
    } catch (e: any) {
      setAuthError(e.message || "Gagal keluar.");
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
