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
      <Card className="w-full">
        <CardContent className="p-8 text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">
            Memeriksa sesi otentikasi...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Mengalihkan ke halaman masuk...
          </p>
        </CardContent>
      </Card>
    );
  }

  return <div className="space-y-6 w-full">{children}</div>;
}
