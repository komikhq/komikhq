import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChatDotsIcon as ChatDots,
  CheckIcon as Check,
  TrashIcon as Trash,
  WarningCircleIcon as WarningCircle,
} from "@phosphor-icons/react"
import type { ReportItem } from "@/hooks/use-admin-moderation"

interface ModerationDetailDialogProps {
  report: ReportItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: (reportId: string, action: "delete_comment" | "dismiss") => Promise<boolean>
  submitting?: boolean
}

export function ModerationDetailDialog({
  report,
  open,
  onOpenChange,
  onAction,
  submitting = false,
}: ModerationDetailDialogProps) {
  if (!report) return null

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "SPAM":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-500">
            Spam
          </Badge>
        )
      case "HARASSMENT":
        return (
          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-500">
            Harassment
          </Badge>
        )
      case "SPOILER":
        return (
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-500">
            Spoiler
          </Badge>
        )
      case "NSFW":
        return (
          <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-500">
            NSFW
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-500">
            {reason || "Other"}
          </Badge>
        )
    }
  }

  const handleActionClick = async (action: "delete_comment" | "dismiss") => {
    const ok = await onAction(report.id, action)
    if (ok) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ChatDots className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base font-bold">
              Moderation Report Details
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Review reported comment content and reporter notes before resolving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2 text-xs">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">Reason:</span>
              {getReasonBadge(report.reason)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  report.status === "PENDING"
                    ? "default"
                    : report.status === "RESOLVED"
                      ? "secondary"
                      : "outline"
                }
                className="text-[10px] font-semibold uppercase"
              >
                {report.status}
              </Badge>
            </div>
          </div>

          {/* Reporter info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div>
              <span className="font-semibold">Reported by:</span>{" "}
              <strong className="text-foreground">{report.reporterName}</strong>
            </div>
            <div className="text-right">
              <span className="font-semibold">Reported at:</span>{" "}
              <span>{new Date(report.createdAt).toLocaleString("en-US")}</span>
            </div>
          </div>

          {/* Comment Content Box */}
          <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/40 p-3.5">
            <span className="block font-semibold text-muted-foreground text-[11px]">
              Reported Comment Content:
            </span>
            {report.commentIsDeleted ? (
              <p className="italic text-muted-foreground">
                [This comment has already been deleted]
              </p>
            ) : (
              <p className="whitespace-pre-wrap font-sans text-xs text-foreground italic leading-relaxed">
                &ldquo;{report.commentContent || "No comment content found"}&rdquo;
              </p>
            )}
          </div>

          {/* Reporter Notes */}
          {report.details && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 mb-1">
                <WarningCircle className="h-4 w-4" />
                <span>Reporter Note:</span>
              </div>
              <p className="text-foreground/90">{report.details}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          {report.status === "PENDING" && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={() => handleActionClick("dismiss")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                <span>Dismiss</span>
              </Button>
              {!report.commentIsDeleted && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleActionClick("delete_comment")}
                >
                  <Trash className="mr-1.5 h-3.5 w-3.5" />
                  <span>Delete Comment</span>
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

