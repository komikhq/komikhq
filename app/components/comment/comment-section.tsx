import { useState, useEffect } from "react"
import { ChatCircleTextIcon as ChatCircleText } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentInput } from "./comment-input"
import { CommentTreeItem, type CommentData } from "./comment-tree-item"
import { CommentReportModal } from "./comment-report-modal"
import { commentsApi, authenticationApi, getRealtimeWebSocketUrl } from "@/lib/sdk-client"

interface CommentSectionProps {
  comicId?: string
  chapterId?: string
  variant?: "reader" | "default"
}

export function CommentSection({
  comicId,
  chapterId,
  variant = "reader",
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(
    null
  )

  useEffect(() => {
    // Check if user is logged in via session endpoint
    authenticationApi
      .getAuthSession()
      .then((res: any) => {
        if (res && (res.user || res.id)) {
          setIsLoggedIn(true)
          const u = res.user || res
          setCurrentUserId(u.id || u.userId || null)
          if (u.role === "admin") setIsAdmin(true)
        } else {
          setIsLoggedIn(false)
        }
      })
      .catch(() => setIsLoggedIn(false))
  }, [])

  const buildCommentTree = (flatList: CommentData[]): CommentData[] => {
    try {
      const map = new Map<string, CommentData>()
      const roots: CommentData[] = []

      flatList.forEach((item) => {
        if (item && item.id) {
          map.set(item.id, { ...item, replies: [] })
        }
      })

      flatList.forEach((item) => {
        if (!item || !item.id) return
        const node = map.get(item.id)
        if (!node) return

        if (item.parentId && map.has(item.parentId)) {
          map.get(item.parentId)!.replies!.push(node)
        } else {
          roots.push(node)
        }
      })

      return roots
    } catch {
      return flatList || []
    }
  }

  const fetchComments = (showSkeleton = false) => {
    if (!comicId && !chapterId) return
    if (showSkeleton) setIsLoading(true)

    commentsApi
      .listComments({ comicId, chapterId })
      .then((data: any) => {
        const rawList: CommentData[] = data.comments || []
        setComments(buildCommentTree(rawList))
      })
      .catch(() => setComments([]))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchComments(true)

    const targetId = chapterId || comicId
    if (!targetId || typeof window === "undefined") return

    let ws: WebSocket | null = null
    let isMounted = true

    getRealtimeWebSocketUrl(`comment_stream:${targetId}`)
      .then((wsUrl) => {
        if (!isMounted) return
        ws = new WebSocket(wsUrl)
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.event === "new_comment") {
              fetchComments()
            }
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        // Ignore WS fail
      })

    return () => {
      isMounted = false
      if (ws) ws.close()
    }
  }, [comicId, chapterId])

  const handlePostComment = async (
    content: string,
    parentId?: string | null,
    guestInfo?: { guestName?: string; guestEmail?: string; isSpoiler?: boolean }
  ) => {
    await commentsApi.createComment({
      createCommentRequest: {
        comicId: comicId || undefined,
        chapterId: chapterId || undefined,
        parentId: parentId || undefined,
        content,
        guestName: guestInfo?.guestName,
        guestEmail: guestInfo?.guestEmail,
        isSpoiler: guestInfo?.isSpoiler ?? false,
      },
    })
    fetchComments(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    await commentsApi.deleteComment({ commentId })
    fetchComments(false)
  }

  const handleReportSubmit = async (
    reason: string,
    details?: string,
    guestInfo?: { guestName?: string; guestEmail?: string }
  ) => {
    if (!reportingCommentId) return

    await commentsApi.reportComment({
      commentId: reportingCommentId,
      reportCommentRequest: {
        reason,
        details,
        guestName: guestInfo?.guestName,
        guestEmail: guestInfo?.guestEmail,
      },
    })

    alert("Your report has been submitted. Thank you!")
  }

  const cardClasses =
    variant === "reader"
      ? "border-neutral-800 bg-neutral-900 text-neutral-100"
      : "border-border bg-card text-card-foreground shadow-xs"

  const headerClasses =
    variant === "reader"
      ? "border-b border-neutral-800"
      : "border-b border-border"

  return (
    <Card className={cardClasses}>
      <CardHeader className={headerClasses}>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <ChatCircleText className="h-5 w-5 text-primary" />
          <span>Comments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <CommentInput
          onSubmit={handlePostComment}
          isLoggedIn={isLoggedIn}
          variant={variant}
        />

        {isLoading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-neutral-800" />
                  <div className="h-3 w-3/4 rounded bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center text-xs text-neutral-500">
            No comments yet. Be the first to leave a comment!
          </p>
        ) : (
          <div className="space-y-6 pt-2">
            {comments.map((comment) => (
              <CommentTreeItem
                key={comment.id}
                comment={comment}
                onSubmitReply={handlePostComment}
                onDeleteComment={handleDeleteComment}
                onOpenReportModal={(id) => setReportingCommentId(id)}
                isLoggedIn={isLoggedIn}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                variant={variant}
              />
            ))}
          </div>
        )}

        <CommentReportModal
          isOpen={!!reportingCommentId}
          onClose={() => setReportingCommentId(null)}
          onSubmit={handleReportSubmit}
          isLoggedIn={isLoggedIn}
        />
      </CardContent>
    </Card>
  )
}
