import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { moderationApi } from "@/lib/sdk-client"

export interface ReportItem {
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

export function useAdminModeration(initialPageSize = 10) {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [statusFilter, setStatusFilter] = useState<string>("PENDING")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const fetchReports = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsFetching(true)
    } else {
      setLoading(true)
    }

    try {
      const res: any = await moderationApi.adminListModerationReports({
        page,
        limit: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
      })

      const rawReports: ReportItem[] = res?.reports || []
      setReports(rawReports)

      const total = res?.total ?? rawReports.length
      setTotalRecords(total)
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)))
    } catch (err: any) {
      toast.error(err.message || "Failed to load moderation reports.")
      setReports([])
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [page, pageSize, statusFilter])

  useEffect(() => {
    fetchReports(false)
  }, [fetchReports])

  const resolveReport = async (
    reportId: string,
    action: "delete_comment" | "dismiss"
  ): Promise<boolean> => {
    setSubmitting(true)
    try {
      await moderationApi.adminResolveModerationReport({
        id: reportId,
        adminResolveModerationReportRequest: { action },
      })
      toast.success(
        action === "delete_comment"
          ? "Reported comment deleted and report resolved."
          : "Report dismissed successfully."
      )
      fetchReports(true)
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to process moderation report.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const bulkResolve = async (
    items: ReportItem[],
    action: "delete_comment" | "dismiss"
  ) => {
    if (items.length === 0) return
    const actionLabel = action === "delete_comment" ? "delete comment for" : "dismiss"
    const confirm = window.confirm(
      `Are you sure you want to ${actionLabel} ${items.length} selected report(s)?`
    )
    if (!confirm) return

    setSubmitting(true)
    let count = 0
    try {
      for (const r of items) {
        try {
          await moderationApi.adminResolveModerationReport({
            id: r.id,
            adminResolveModerationReportRequest: { action },
          })
          count++
        } catch {}
      }
      toast.success(`Successfully processed ${count} report(s).`)
      fetchReports(true)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    reports,
    loading,
    isFetching,
    submitting,
    statusFilter,
    setStatusFilter: (s: string) => {
      setStatusFilter(s)
      setPage(1)
    },
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalRecords,
    fetchReports,
    resolveReport,
    bulkResolve,
  }
}
