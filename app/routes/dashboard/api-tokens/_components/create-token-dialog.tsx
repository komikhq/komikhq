import { useState } from "react"
import {
  PlusIcon as Plus,
  ShieldCheckIcon as ShieldCheck,
} from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const AVAILABLE_SCOPES = [
  {
    id: "admin:full",
    label: "admin:full",
    title: "Full Administrator Access",
    description: "Complete unrestricted access across all KomikHQ administrative operations.",
  },
  {
    id: "read:comics",
    label: "read:comics",
    title: "Read Comics & Chapters",
    description: "Query full comic catalog, metadata, chapters, reader pages, and analytics.",
  },
  {
    id: "write:comics",
    label: "write:comics",
    title: "Write Comics & Chapters",
    description: "Create, edit, publish, or delete comics, chapters, and genres.",
  },
  {
    id: "manage:users",
    label: "manage:users",
    title: "User Management & Moderation",
    description: "View user lists, inspect profiles, ban/unban users, and resolve reports.",
  },
  {
    id: "manage:system",
    label: "manage:system",
    title: "System Maintenance & Operations",
    description: "Trigger search cache purges, R2 image cleanup, and view count synchronizations.",
  },
]

interface CreateTokenDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    scopes: string[]
    expiresInDays?: number | null
  }) => Promise<{ success: boolean; rawToken?: string }>
}

export function CreateTokenDialog({
  open,
  onClose,
  onSubmit,
}: CreateTokenDialogProps) {
  const [name, setName] = useState("")
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:comics"])
  const [expiresInDays, setExpiresInDays] = useState<string>("30")
  const [loading, setLoading] = useState(false)

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) => {
      if (scopeId === "admin:full") {
        return prev.includes("admin:full") ? [] : ["admin:full"]
      }

      const withoutAdmin = prev.filter((s) => s !== "admin:full")
      if (withoutAdmin.includes(scopeId)) {
        return withoutAdmin.filter((s) => s !== scopeId)
      } else {
        return [...withoutAdmin, scopeId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const parsedExpiry = expiresInDays === "never" ? null : parseInt(expiresInDays, 10)

    setLoading(true)
    const res = await onSubmit({
      name: name.trim(),
      scopes: selectedScopes,
      expiresInDays: parsedExpiry,
    })
    setLoading(false)

    if (res.success) {
      setName("")
      setSelectedScopes(["read:comics"])
      setExpiresInDays("30")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">Generate API Token</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a personal access token for automated scripts, crawler daemons, or administrative CLI tools.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Token Name */}
            <div className="space-y-1.5">
              <Label htmlFor="token-name" className="text-xs font-semibold">
                Token Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="token-name"
                placeholder="e.g. Production Scraper, CI/CD Pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            {/* Expiration */}
            <div className="space-y-1.5">
              <Label htmlFor="token-expiry" className="text-xs font-semibold">
                Expiration
              </Label>
              <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                <SelectTrigger id="token-expiry" className="w-full text-xs">
                  <SelectValue placeholder="Select token expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days (Recommended)</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="never">No Expiration (Never expires)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Permission Scopes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Permission Scopes <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Select the granular permissions granted to requests carrying this token.
              </p>

              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border/60 p-2.5">
                {AVAILABLE_SCOPES.map((scope) => {
                  const isChecked = selectedScopes.includes(scope.id)
                  const isAdminActive = selectedScopes.includes("admin:full") && scope.id !== "admin:full"

                  return (
                    <label
                      key={scope.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50 ${
                        isChecked ? "bg-primary/5" : ""
                      } ${isAdminActive ? "opacity-60" : ""}`}
                    >
                      <Checkbox
                        checked={isChecked}
                        disabled={isAdminActive}
                        onCheckedChange={() => toggleScope(scope.id)}
                        className="mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {scope.label}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            — {scope.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                          {scope.description}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim() || selectedScopes.length === 0}
            >
              {loading ? "Generating..." : "Create Token"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
