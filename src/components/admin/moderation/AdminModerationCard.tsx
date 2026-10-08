import React, { useState, useEffect } from "react"
import {
  ChatDots,
  Trash,
  Check,
  ArrowClockwise,
  ShieldWarning,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

interface ReportItem {
  id: string
  commentId: string
  reason: string
  details?: string | null
  status: "PENDING" | "RESOLVED" | "DISMISSED"
  createdAt: string
  reporterName: string
  commentContent?: string | null
  commentIsDeleted?: boolean
}

export function AdminModerationCard() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("PENDING")
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const res = await apiFetch(API_ROUTES.ADMIN.REPORTS(1, 50, filterStatus))
      setReports(res.reports || [])
    } catch {
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [filterStatus])

  const handleAction = async (
    reportId: string,
    action: "delete_comment" | "dismiss"
  ) => {
    try {
      setProcessingId(reportId)
      await apiFetch(API_ROUTES.ADMIN.RESOLVE_REPORT(reportId), {
        method: "POST",
        body: JSON.stringify({ action }),
      })
      fetchReports()
    } catch (err: any) {
      alert(err.message || "Failed to process report")
    } finally {
      setProcessingId(null)
    }
  }

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "SPAM":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400"
          >
            Spam
          </Badge>
        )
      case "HARASSMENT":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400"
          >
            Harassment
          </Badge>
        )
      case "SPOILER":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-500/10 text-purple-400"
          >
            Spoiler
          </Badge>
        )
      case "NSFW":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-500"
          >
            NSFW
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-400"
          >
            Other
          </Badge>
        )
    }
  }

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ChatDots className="h-5 w-5 text-primary" />
            <span>Comment Moderation & Reports</span>
          </CardTitle>
          <CardDescription className="mt-1 text-xs text-muted-foreground">
            Review and take action on comments reported by users.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchReports}
          disabled={isLoading}
          className="h-8 gap-1.5 text-xs"
        >
          <ArrowClockwise
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-muted-foreground">
            Filter Status:
          </span>
          {["PENDING", "RESOLVED", "DISMISSED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* List Reports */}
        {isLoading ? (
          <div className="space-y-3 py-6 text-center text-xs text-muted-foreground">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="space-y-1 py-12 text-center text-xs text-muted-foreground">
            <ShieldWarning className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">No Reports Found</p>
            <p>No comment reports currently match this status filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="space-y-3 rounded-xl border border-border/60 bg-card p-4 text-xs transition-colors hover:bg-accent/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getReasonBadge(report.reason)}
                    <span className="text-muted-foreground">
                      Reported by{" "}
                      <strong className="text-foreground">
                        {report.reporterName}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(report.createdAt).toLocaleString("en-US")}
                  </span>
                </div>

                <div className="space-y-1 rounded-lg border border-border/40 bg-muted/60 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Reported Comment Content:
                  </p>
                  <p className="text-foreground italic">
                    {report.commentIsDeleted ? (
                      <span className="text-muted-foreground">[Deleted]</span>
                    ) : (
                      `"${report.commentContent || "-"}"`
                    )}
                  </p>
                </div>

                {report.details && (
                  <p className="text-muted-foreground">
                    <strong>Reporter Notes:</strong> {report.details}
                  </p>
                )}

                {report.status === "PENDING" && !report.commentIsDeleted && (
                  <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(report.id, "dismiss")}
                      disabled={processingId === report.id}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Dismiss Report
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAction(report.id, "delete_comment")}
                      disabled={processingId === report.id}
                      className="h-7 text-xs"
                    >
                      <Trash className="mr-1 h-3 w-3" />
                      Delete Comment
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
