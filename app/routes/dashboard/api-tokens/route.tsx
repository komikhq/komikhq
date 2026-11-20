import { useState } from "react"
import {
  KeyIcon as Key,
  PlusIcon as Plus,
  ShieldCheckIcon as ShieldCheck,
  CheckCircleIcon as CheckCircle,
  WarningCircleIcon as WarningCircle,
} from "@phosphor-icons/react"
import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminApiTokens } from "@/hooks/use-admin-api-tokens"
import { ApiTokensTable } from "./_components/api-tokens-table"
import { CreateTokenDialog } from "./_components/create-token-dialog"
import { TokenSecretModal } from "./_components/token-secret-modal"

export default function DashboardApiTokensRoute() {
  const { tokens, loading, createToken, revokeToken } = useAdminApiTokens()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createdSecretData, setCreatedSecretData] = useState<{
    token: string
    name: string
  } | null>(null)

  const handleCreateToken = async (data: {
    name: string
    scopes: string[]
    expiresInDays?: number | null
  }) => {
    const res = await createToken(data)
    if (res.success && res.rawToken) {
      setCreatedSecretData({
        token: res.rawToken,
        name: data.name,
      })
    }
    return res
  }

  // Derived statistics
  const now = Date.now()
  const activeTokens = tokens.filter(
    (t) => !t.expiresAt || new Date(t.expiresAt).getTime() > now
  )
  const fullAdminTokens = tokens.filter((t) => t.scopes.includes("admin:full"))
  const expiredTokens = tokens.filter(
    (t) => t.expiresAt && new Date(t.expiresAt).getTime() <= now
  )

  return (
    <AdminGuard>
      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Key className="h-5 w-5 text-primary" />
                <span>Personal & Programmatic API Tokens</span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-muted-foreground">
                Manage personal access tokens to authorize automated scrapers, CI/CD pipelines, and internal tools with granular permission scopes.
              </CardDescription>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="w-full shrink-0 gap-1.5 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Generate New Token</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Summary Statistics */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Active Tokens</p>
                  <p className="text-lg font-bold text-foreground">{activeTokens.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Full Admin Scopes</p>
                  <p className="text-lg font-bold text-foreground">{fullAdminTokens.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                  <WarningCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Expired Tokens</p>
                  <p className="text-lg font-bold text-foreground">{expiredTokens.length}</p>
                </div>
              </div>
            </div>

            {/* Tokens Table */}
            <ApiTokensTable
              tokens={tokens}
              loading={loading}
              onRevoke={revokeToken}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <CreateTokenDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateToken}
        />

        {/* One-time Secret Modal */}
        <TokenSecretModal
          open={Boolean(createdSecretData)}
          token={createdSecretData?.token || null}
          tokenName={createdSecretData?.name || ""}
          onClose={() => setCreatedSecretData(null)}
        />
      </div>
    </AdminGuard>
  )
}
