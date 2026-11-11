import { useState, useMemo } from "react"
import {
  ChatDotsIcon as ChatDots,
  TrashIcon as Trash,
  CheckIcon as Check,
  EyeIcon as Eye,
  ArrowsClockwiseIcon as ArrowsClockwise,
  MagnifyingGlassIcon as MagnifyingGlass,
  ShieldWarningIcon as ShieldWarning,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useAdminModeration, type ReportItem } from "@/hooks/use-admin-moderation"
import { ModerationDetailDialog } from "./moderation-detail-dialog"

export function ModerationTableSection() {
  const {
    reports,
    loading,
    isFetching,
    submitting,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    totalPages,
    totalRecords,
    fetchReports,
    resolveReport,
    bulkResolve,
  } = useAdminModeration(10)

  // Local search query for comment content or reporter
  const [searchQuery, setSearchQuery] = useState("")

  // Detail dialog state
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleOpenDetail = (r: ReportItem) => {
    setSelectedReport(r)
    setDetailOpen(true)
  }

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports
    const q = searchQuery.toLowerCase().trim()
    return reports.filter(
      (r) =>
        r.reporterName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.commentContent?.toLowerCase().includes(q) ||
        r.details?.toLowerCase().includes(q)
    )
  }, [reports, searchQuery])

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "SPAM":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]">
            Spam
          </Badge>
        )
      case "HARASSMENT":
        return (
          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-500 text-[10px]">
            Harassment
          </Badge>
        )
      case "SPOILER":
        return (
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-500 text-[10px]">
            Spoiler
          </Badge>
        )
      case "NSFW":
        return (
          <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-500 text-[10px]">
            NSFW
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-500 text-[10px]">
            {reason || "Other"}
          </Badge>
        )
    }
  }

  const handleBulkAction = async (action: string, selectedRows: ReportItem[]) => {
    if (action === "delete_comment" || action === "dismiss") {
      await bulkResolve(selectedRows, action)
    }
  }

  const columns = useMemo<ColumnDef<ReportItem>[]>(
    () => [
      {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => getReasonBadge(row.original.reason),
      },
      {
        accessorKey: "commentContent",
        header: "Reported Comment",
        cell: ({ row }) => {
          const r = row.original
          if (r.commentIsDeleted) {
            return <span className="italic text-muted-foreground">[Deleted]</span>
          }
          return (
            <button
              type="button"
              onClick={() => handleOpenDetail(r)}
              className="text-left font-sans text-foreground transition-colors hover:text-primary cursor-pointer line-clamp-1 max-w-sm"
              title="Click to view full comment details"
            >
              &ldquo;{r.commentContent || "-"}&rdquo;
            </button>
          )
        },
      },
      {
        accessorKey: "reporterName",
        header: "Reporter",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {row.original.reporterName}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status
          return (
            <Badge
              variant={
                s === "PENDING"
                  ? "default"
                  : s === "RESOLVED"
                    ? "secondary"
                    : "outline"
              }
              className="text-[10px] font-semibold uppercase"
            >
              {s}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => {
          const r = row.original
          const isPending = r.status === "PENDING"
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => handleOpenDetail(r)}
                title="View Report Details"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              {isPending && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => resolveReport(r.id, "dismiss")}
                    title="Dismiss Report"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  {!r.commentIsDeleted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      onClick={() => resolveReport(r.id, "delete_comment")}
                      title="Delete Comment"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <ChatDots className="h-5 w-5 text-primary" />
              <span>Comment Moderation & Reports</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Review, filter, and moderate reported comments from readers.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReports(false)}
            disabled={loading || isFetching}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <ArrowsClockwise
              className={`h-3.5 w-3.5 ${isFetching || loading ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlass className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search report reason, reporter, or content..."
                className="h-9 pl-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                Filter Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stable Height DataTable */}
          <DataTable
            columns={columns}
            data={filteredReports}
            loading={loading}
            loadingMessage="Loading moderation reports..."
            emptyMessage="No moderation reports found for this status filter."
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            rowHeight={52}
            fixedHeight={true}
            showGhostRows={true}
            enableRowSelection={true}
            enableRowNumbers={true}
            bulkActions={[
              {
                label: "Dismiss Selected",
                value: "dismiss",
              },
              {
                label: "Delete Selected Comments",
                value: "delete_comment",
                variant: "destructive",
              },
            ]}
            onBulkAction={handleBulkAction}
            serverPagination={{
              page,
              totalPages,
              totalRecords,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      {/* Moderation Detail Dialog */}
      <ModerationDetailDialog
        report={selectedReport}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAction={resolveReport}
        submitting={submitting}
      />
    </>
  )
}

