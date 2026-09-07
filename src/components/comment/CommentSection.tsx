import React, { useState, useEffect } from "react";
import { ChatCircleText } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentInput } from "./CommentInput";
import { CommentTreeItem, type CommentData } from "./CommentTreeItem";
import { CommentReportModal } from "./CommentReportModal";
import { API_ROUTES } from "@/constants";
import { apiFetch, getBaseApiUrl } from "@/lib/api-client";

interface CommentSectionProps {
  comicId?: string;
  chapterId?: string;
  variant?: "default" | "dark";
}

export function CommentSection({ comicId, chapterId, variant = "default" }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    apiFetch(API_ROUTES.AUTH.SESSION)
      .then((res) => {
        if (res && (res.user || res.id)) {
          setIsLoggedIn(true);
          const u = res.user || res;
          setCurrentUserId(u.id || u.userId || null);
          if (u.role === "admin") setIsAdmin(true);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const fetchComments = () => {
    if (!comicId && !chapterId) return;
    setIsLoading(true);

    apiFetch(API_ROUTES.COMMENTS.LIST({ comicId, chapterId }))
      .then((data) => {
        const rawList: CommentData[] = data.comments || [];
        setComments(buildCommentTree(rawList));
      })
      .catch(() => setComments([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchComments();

    const targetId = chapterId || comicId;
    if (!targetId || typeof window === "undefined") return;

    const baseUrl = getBaseApiUrl();
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = baseUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}//${wsHost}/v1/realtime/ws?channel=comment_stream:${targetId}`;

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "new_comment") {
            fetchComments();
          }
        } catch {
          // Ignore
        }
      };
    } catch {
      // Ignore WS fail
    }

    return () => {
      if (ws) ws.close();
    };
  }, [comicId, chapterId]);

  const buildCommentTree = (flatList: CommentData[]): CommentData[] => {
    try {
      const map = new Map<string, CommentData>();
      const roots: CommentData[] = [];

      flatList.forEach((item) => {
        if (item && item.id) {
          map.set(item.id, { ...item, replies: [] });
        }
      });

      flatList.forEach((item) => {
        if (!item || !item.id) return;
        const node = map.get(item.id);
        if (!node) return;

        if (item.parentId && map.has(item.parentId)) {
          map.get(item.parentId)!.replies!.push(node);
        } else {
          roots.push(node);
        }
      });

      return roots;
    } catch {
      return flatList || [];
    }
  };

  const handlePostComment = async (
    content: string,
    parentId?: string | null,
    guestInfo?: { guestName?: string; guestEmail?: string; isSpoiler?: boolean }
  ) => {
    await apiFetch(API_ROUTES.COMMENTS.ADD, {
      method: "POST",
      body: JSON.stringify({
        comicId: comicId || null,
        chapterId: chapterId || null,
        parentId: parentId || null,
        content,
        guestName: guestInfo?.guestName,
        guestEmail: guestInfo?.guestEmail,
        isSpoiler: guestInfo?.isSpoiler ?? false,
      }),
    });
    fetchComments();
  };

  const handleDeleteComment = async (commentId: string) => {
    await apiFetch(API_ROUTES.COMMENTS.DELETE(commentId), {
      method: "DELETE",
    });
    fetchComments();
  };

  const handleReportSubmit = async (
    reason: string,
    details?: string,
    guestInfo?: { guestName?: string; guestEmail?: string }
  ) => {
    if (!reportingCommentId) return;

    await apiFetch(API_ROUTES.COMMENTS.REPORT(reportingCommentId), {
      method: "POST",
      body: JSON.stringify({
        reason,
        details,
        guestName: guestInfo?.guestName,
        guestEmail: guestInfo?.guestEmail,
      }),
    });

    alert("Laporan Anda telah terkirim. Terima kasih!");
  };

  const cardClasses =
    variant === "dark"
      ? "border-neutral-800 bg-neutral-900 text-neutral-100"
      : "border-border bg-card text-card-foreground shadow-xs";

  const headerClasses =
    variant === "dark" ? "border-b border-neutral-800" : "border-b border-border";

  return (
    <Card className={cardClasses}>
      <CardHeader className={headerClasses}>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ChatCircleText className="h-5 w-5 text-primary" />
          <span>Komentar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <CommentInput onSubmit={handlePostComment} isLoggedIn={isLoggedIn} />

        {isLoading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-1/4" />
                  <div className="h-3 bg-neutral-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs text-neutral-500 py-6">
            Belum ada komentar. Jadilah yang pertama memberikan komentar!
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
              />
            ))}
          </div>
        )}

        <CommentReportModal
          commentId={reportingCommentId || ""}
          isOpen={!!reportingCommentId}
          onClose={() => setReportingCommentId(null)}
          onSubmit={handleReportSubmit}
          isLoggedIn={isLoggedIn}
        />
      </CardContent>
    </Card>
  );
}
