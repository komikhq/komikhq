import React from "react"
import { Envelope, ShieldCheck } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/components/auth/auth-context"

export function AccountIdentityCard() {
  const { user, isAuthenticated } = useAuthContext()

  if (!isAuthenticated || !user) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Envelope className="h-4 w-4" />
              <span>Alamat Email</span>
            </div>
            <p className="pt-1 text-sm font-medium">{user.email}</p>
          </div>

          <div className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Status Akun</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary" className="capitalize">
                Role: {(user as any).role || "User"}
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              >
                Terverifikasi
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
