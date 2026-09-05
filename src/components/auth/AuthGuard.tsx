import React from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Card, CardContent } from "@/components/ui/card";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { isPending, isAuthenticated } = useRequireAuth(redirectTo);

  if (isPending || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
      </div>
    );
  }

  return <div className="flex flex-col gap-6 w-full">{children}</div>;
}
