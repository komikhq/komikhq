import { useState } from "react"
import {
  TrashIcon as Trash,
  CopyIcon as Copy,
  CheckIcon as Check,
  MagnifyingGlassIcon as MagnifyingGlass,
  KeyIcon as Key,
  WarningCircleIcon as WarningCircle,
} from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/format-date"
import type { ApiTokenRecord } from "@/hooks/use-admin-api-tokens"
import { toast } from "sonner"

interface ApiTokensTableProps {
  tokens: ApiTokenRecord[]
  loading: boolean
  onRevoke: (id: string) => Promise<boolean>
  onCreateClick: () => void
}

export function ApiTokensTable({
  tokens,
  loading,
  onRevoke,
  onCreateClick,
}: ApiTokensTableProps) {
  const [search, setSearch] = useState("")
  const [tokenToRevoke, setTokenToRevoke] = useState<ApiTokenRecord | null>(null)
  const [copiedPrefixId, setCopiedPrefixId] = useState<string | null>(null)
  const [revoking, setRevoking] = useState(false)

  const filteredTokens = tokens.filter((t) => {
    const query = search.toLowerCase()
    return (
      t.name.toLowerCase().includes(query) ||
      t.tokenPrefix.toLowerCase().includes(query) ||
      t.scopes.some((s) => s.toLowerCase().includes(query))
    )
  })

  const handleCopyPrefix = async (prefix: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prefix)
      setCopiedPrefixId(id)
      toast.success(`Copied prefix "${prefix}"`)
      setTimeout(() => setCopiedPrefixId(null), 2000)
    } catch {
      toast.error("Failed to copy prefix")
    }
  }

  const handleConfirmRevoke = async () => {
    if (!tokenToRevoke) return
    setRevoking(true)
    await onRevoke(tokenToRevoke.id)
    setRevoking(false)
    setTokenToRevoke(null)
  }

  const getScopeBadge = (scope: string) => {
    if (scope === "admin:full") {
      return (
        <Badge key={scope} variant="destructive" className="font-mono text-[10px]">
          {scope}
        </Badge>
      )
    }
    if (scope.startsWith("write:") || scope.startsWith("manage:")) {
      return (
        <Badge key={scope} variant="secondary" className="font-mono text-[10px]">
          {scope}
        </Badge>
      )
    }
    return (
      <Badge key={scope} variant="outline" className="font-mono text-[10px]">
        {scope}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, key prefix, or scope..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredTokens.length}</span> of{" "}
          <span className="font-semibold text-foreground">{tokens.length}</span> tokens
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[200px] text-xs font-semibold">Token Name</TableHead>
              <TableHead className="text-xs font-semibold">Key Identifier</TableHead>
              <TableHead className="text-xs font-semibold">Permissions / Scopes</TableHead>
              <TableHead className="text-xs font-semibold">Created</TableHead>
              <TableHead className="text-xs font-semibold">Last Used</TableHead>
              <TableHead className="text-xs font-semibold">Expires</TableHead>
              <TableHead className="text-right text-xs font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                  Loading API tokens...
                </TableCell>
              </TableRow>
            ) : filteredTokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Key className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">No API tokens found</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {search
                        ? "No tokens match your search criteria. Try a different keyword."
                        : "Generate personal access tokens to securely authenticate scripts, CI/CD, or automated tools."}
                    </p>
                    {!search && (
                      <Button size="sm" onClick={onCreateClick} className="mt-2 text-xs">
                        Generate First Token
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTokens.map((token) => {
                const isExpired = token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()

                return (
                  <TableRow key={token.id} className={isExpired ? "opacity-60" : ""}>
                    {/* Name */}
                    <TableCell className="font-medium text-xs text-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold">{token.name}</span>
                        {isExpired && (
                          <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
                            Expired
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Key Prefix */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-1.5 py-0.5 select-all">
                          {token.tokenPrefix}...
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPrefix(token.tokenPrefix, token.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          title="Copy prefix"
                        >
                          {copiedPrefixId === token.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>

                    {/* Scopes */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {token.scopes.map((scope) => getScopeBadge(scope))}
                      </div>
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(token.createdAt)}
                    </TableCell>

                    {/* Last Used */}
                    <TableCell className="text-xs text-muted-foreground">
                      {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Never used"}
                    </TableCell>

                    {/* Expires */}
                    <TableCell className="text-xs">
                      {token.expiresAt ? (
                        <span className={isExpired ? "text-destructive font-semibold" : "text-muted-foreground"}>
                          {formatDate(token.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/70">Never</span>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTokenToRevoke(token)}
                        className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash className="mr-1 h-3.5 w-3.5" />
                        <span>Revoke</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={Boolean(tokenToRevoke)} onOpenChange={(val) => !val && setTokenToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <WarningCircle className="h-5 w-5" />
              <AlertDialogTitle>Revoke API Token?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to revoke the token{" "}
              <strong className="text-foreground">{tokenToRevoke?.name}</strong> (
              <span className="font-mono text-xs">{tokenToRevoke?.tokenPrefix}...</span>)?
              Any applications or automated daemons using this token will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRevoke}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revoking ? "Revoking..." : "Revoke Token"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
