import React from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Card, CardContent } from "@/components/ui/card";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { isPending, isAuthenticated } = useRequireAuth(redirectTo);

  if (isPending) {
    return (
      <Card className="max-w-4xl mx-auto my-6">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Memeriksa sesi otentikasi...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-4xl mx-auto my-6">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Mengalihkan ke halaman masuk...
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
