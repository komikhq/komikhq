import React from "react";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { AuthProvider } from "@/components/auth/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AdminGuard({ children, redirectTo = "/" }: AdminGuardProps) {
  const authState = useRequireAdmin(redirectTo);
  const { isPending, isAuthenticated, isAdmin } = authState;

  if (isPending || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] w-full p-8 text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Memeriksa hak akses Administrator...</p>
      </div>
    );
  }

  return (
    <AuthProvider value={authState}>
      <div className="flex flex-col gap-6 w-full">{children}</div>
    </AuthProvider>
  );
}

