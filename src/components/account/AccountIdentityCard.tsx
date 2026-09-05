import React from "react";
import { Envelope, ShieldCheck } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export function AccountIdentityCard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
              <Envelope className="h-4 w-4" />
              <span>Alamat Email</span>
            </div>
            <p className="font-medium text-sm pt-1">{user.email}</p>
          </div>

          <div className="p-4 border rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Status Akun</span>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                Role: {(user as any).role || "User"}
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                Terverifikasi
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
