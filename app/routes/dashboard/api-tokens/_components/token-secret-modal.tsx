import { useState } from "react"
import {
  KeyIcon as Key,
  CopyIcon as Copy,
  CheckIcon as Check,
  WarningCircleIcon as WarningCircle,
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
import { toast } from "sonner"

interface TokenSecretModalProps {
  token: string | null
  tokenName: string
  open: boolean
  onClose: () => void
}

export function TokenSecretModal({
  token,
  tokenName,
  open,
  onClose,
}: TokenSecretModalProps) {
  const [copied, setCopied] = useState(false)

  if (!token) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      toast.success("API Token copied to clipboard!")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error("Failed to copy token automatically. Please copy it manually.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Key className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">API Token Created</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Token <strong className="text-foreground">{tokenName}</strong> has been generated successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
            <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Save your key safely</p>
              <p className="mt-0.5 opacity-90">
                This secret token will only be displayed <strong>once</strong>. If you lose it, you will need to revoke it and generate a new one.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-between rounded-lg border border-border/80 bg-muted/60 p-2.5 font-mono text-xs">
            <span className="truncate pr-8 select-all text-foreground">{token}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute right-1.5 h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-3.5 w-3.5 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            I have stored this token safely
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
